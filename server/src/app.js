import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import {
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  ONLINE_USERS,
  START_TYPING,
  STOP_TYPING,
} from "./constants/event.js";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.model.js";
import { corsOptions } from "./constants/config.js";
import { socketAuthenticator } from "./middlewares/auth.js";

let userSocketIds = new Map(); // contains all the user that are active with their corresponding socket id
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "16kb" })); // necessary to take the json data as the input
app.use(express.static("public"));

import userRouter from "./routes/user.route.js";
import chatRouter from "./routes/chat.route.js";
import User from "./models/user.model.js";

// socket middleware to accept the token from the frontend
io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, async (err) => await socketAuthenticator(err, socket, next));
});



io.on("connection", async(socket) => {
   console.log("connected")
  const user = socket.user;
  userSocketIds.set(user._id.toString(), socket.id); // keep on adding the active users along with their id
  console.log(user)
  user.status = 'online';
  await user.save()
  console.log(user)

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    const membersSocket = getSockets(members); // returns the array of sockets corresponding to the members

    io.to(membersSocket).emit(NEW_MESSAGE, { // sending messages to all the members
      chatId,
      message: messageForRealTime,
    });

    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId }); // this is for the alert of the new messages

    try {
      await Message.create(messageForDB);
    } catch (error) {
      throw new Error(error);
    }
  });

  socket.on(START_TYPING, ({ members, chatId }) => {
    console.log("--------------------------------------------sTART TYPING ---------------------------")
    console.log(members)
    console.log(chatId+" is the id")
    const membersSockets = getSockets(members);
    console.log(membersSockets)
    socket.to(membersSockets).emit(START_TYPING, { chatId });
  });

  socket.on(STOP_TYPING, ({ members, chatId }) => {
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(STOP_TYPING, { chatId });
  });

  socket.on(CHAT_JOINED, ({ userId, members }) => {
    onlineUsers.add(userId.toString());

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on(CHAT_LEAVED, ({ userId, members }) => {
    onlineUsers.delete(userId.toString());

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on("disconnect", async() => {
    userSocketIds.delete(user._id.toString()); // deleting the user and their socket on disconnect
    user.status = new Date();
    await user.save()
    console.log(user)

   // onlineUsers.delete(user._id.toString());
    //socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
  });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/chats", chatRouter);

export { server, userSocketIds };
