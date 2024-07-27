import { ALERT, REFETCH_CHATS , NEW_MESSAGE,NEW_ATTACHMENT,NEW_MESSAGE_ALERT} from "../constants/event.js";
import { getOtherMember } from "../lib/helper.js";
import { Chat } from "../models/chat.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsynHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { emitEvent } from "../utils/EmitEvent.js";
import { Message } from "../models/message.model.js";
const newGroupChat = asyncHandler(async(req,res)=>{

    const {name,members} = req.body;

    if(members.length < 2){
        throw new ApiError(400,"Group must have atleast two memebers")
    }

    const allMembers = [...members, req.user]

    await Chat.create({
        name,
        groupChat:true,
        creator:req.user,
        members:allMembers, 
    })


    emitEvent(req,ALERT,allMembers, `Welcome to ${name} group.`)
    emitEvent(req,REFETCH_CHATS,members, `Welcome to ${name} group.`)


    return res.status(200)
    .json(new ApiResponse(200,{},"group created successfully"))
})

const getMyChats = asyncHandler(async (req, res, next) => {
  const chats = await Chat.find({ members: req.user }).populate(
      "members",
      "name avatar"
  );

  const transformedChats = await Promise.all(chats.map(async ({ _id, name, members, groupChat }) => {
      
    const otherId = members.filter((item)=> item._id.toString()!=req.user._id)[0]._id
    console.log("ideas of the fellows are ")
    console.log(members)
    console.log("-----------------------------------------") 
    console.log(req.user._id+" is the login wala id")
    console.log(otherId+" is the member id ")
    console.log("----------------------------------") 
    const otherMember = await User.findById(otherId)
    console.log(otherMember)     

      return {
          _id,
          groupChat,
          avatar: groupChat
              ? members.slice(0, 3).map(({ avatar }) => avatar.secure_url)
              : [otherMember.avatar.secure_url],
          name: groupChat ? name : otherMember.fullName,
          members: members.reduce((prev, curr) => {
              if (curr._id.toString() !== req.user.toString()) {
                  prev.push(curr._id);
              }
              return prev;
          }, []),
      };
  }));

  return res.status(200).json({
      success: true,
      chats: transformedChats,
  });
});


  const addMembers = asyncHandler(async (req, res, next) => {
    const { chatId, members } = req.body;
  
    const chat = await Chat.findById(chatId);
  
    if (!chat) return next(new ApiError(404,"Chat not found"));
  
    if (!chat.groupChat)
      return next(new ApiError(400,"This is not a group chat"));
    console.log(chat.creator.toString())
    console.log(req.user._id.toString())

  
    if (chat.creator.toString() !== req.user._id.toString())
      return next(new ApiError(403,"You are not allowed to add members"));
  
    const allNewMembersPromise = members.map((i) => User.findById(i, "name"));
  
    const allNewMembers = await Promise.all(allNewMembersPromise);
  
    const uniqueMembers = allNewMembers
      .filter((i) => !chat.members.includes(i._id.toString()))
      .map((i) => i._id);
  
    chat.members.push(...uniqueMembers);
  
    if (chat.members.length > 100)
      return next(new ApiError(400,"Group members limit reached"));
  
    await chat.save();
  
    const allUsersName = allNewMembers.map((i) => i.name).join(", ");
  
    emitEvent(
      req,
      ALERT,
      chat.members,
      `${allUsersName} has been added in the group`
    );
  
    emitEvent(req, REFETCH_CHATS, chat.members);
  
    return res.status(200).json({
      success: true,
      message: "Members added successfully",
    });
  });


  const removeMember = asyncHandler(async (req, res, next) => {
    const { userId, chatId } = req.body;
  
    const [chat, userThatWillBeRemoved] = await Promise.all([
      Chat.findById(chatId),
      User.findById(userId, "name"),
    ]);
  
    if (!chat) return next(new ApiError(404,"Chat not found"));
  
    if (!chat.groupChat)
      return next(new ApiError(400,"This is not a group chat"));
  
    if (chat.creator.toString() !== req.user._id.toString())
      return next(new ApiError(403,"You are not allowed to remove members"));
  
    if (chat.members.length <= 3)
      return next(new ApiError(400,"Group must have at least 3 members"));
  
    const allChatMembers = chat.members.map((i) => i.toString());
  
    chat.members = chat.members.filter(
      (member) => member.toString() !== userId.toString()
    );
  
    await chat.save();
  
    emitEvent(req, ALERT, chat.members, {
      message: `${userThatWillBeRemoved.name} has been removed from the group`,
      chatId,
    });
  
    emitEvent(req, REFETCH_CHATS, allChatMembers);
  
    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  });
  
  const leaveGroup = asyncHandler(async (req, res, next) => {
    const chatId = req.params.id;
  
    const chat = await Chat.findById(chatId);
  
    if (!chat) return next(new ApiError(404,"Chat not found"));
  
    if (!chat.groupChat)
      return next(new ApiError(400,"This is not a group chat"));
  
    const remainingMembers = chat.members.filter(
      (member) => member.toString() !== req.user.toString()
    );
  
    if (remainingMembers.length < 3)
      return next(new ApiError(400,"Group must have at least 3 members"));
  
    if (chat.creator.toString() === req.user.toString()) {
      const randomElement = Math.floor(Math.random() * remainingMembers.length);
      const newCreator = remainingMembers[randomElement];
      chat.creator = newCreator;
    }
  
    chat.members = remainingMembers;
  
    const [user] = await Promise.all([
      User.findById(req.user, "name"),
      chat.save(),
    ]);
  
    emitEvent(req, ALERT, chat.members, {
      chatId,
      message: `User ${user.name} has left the group`,
    });
  
    return res.status(200).json({
      success: true,
      message: "Leave Group Successfully",
    });
  });
  

  const sendAttachments = asyncHandler(async (req, res, next) => {
    console.log("--------------------------------------------------------")
    console.log(req.body)
    const { chatId } = req.body;
  
    const files = req.files || [];
  
    
  
    if (files.length > 5)
      return next(new ApiError(400, "Files Can't be more than 5"));
  
    const [chat, me] = await Promise.all([
      Chat.findById(chatId),
      User.findById(req.user, "name"),
    ]);
  
    if (!chat) return next(new ApiError(404,"Chat not found"));
  
    if (files.length > 5 )
      return next(new ApiError(400,"Please provide attachments less than 5"));
  
    //   Upload files here
    const attachments = await uploadOnCloudinary(files);
  
    const messageForDB = {
      content: req.body.content,
      attachments,
      sender: me._id,
      chat: chatId,
    };
  
    const messageForRealTime = {
      ...messageForDB,
      sender: {
        _id: me._id,
        name: me.name,
      },
    };
  
    const message = await Message.create(messageForDB);
  
    emitEvent(req, NEW_MESSAGE, chat.members, {
      message: messageForRealTime,
      chatId,
    });
  
    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });
  
    return res.status(200).json({
      success: true,
      message,
    });
  });


  const getChatDetails = asyncHandler(async (req, res, next) => {
    if (req.query.populate === "true") {
      let chat = await Chat.findById(req.params.id)
        .populate("members", "fullName avatar userName status")
        .lean();
  
      if (!chat) return next(new ApiError(404,"Chat not found"));
  
     // console.log(chat)
      chat.members = chat.members.map(({ _id, fullName, avatar, userName, status }) => ({
        _id,
        fullName,
        userName,
        avatar: avatar.secure_url,
        status
      }));

      console.log("came here ")
      //console.log(members[1].avatar)

      let index = 0;
      for(let i = 0;i<chat.members.length;i++){
        if(chat.members[i]._id.toString()!=req.user._id.toString()){
          index = i;
        }
      }

      chat = {...chat, dp:chat.members[index].avatar, userName:chat.members[index].userName, status:chat.members[index].status}
      chat.name = chat.members[index].fullName

  
      return res.status(200).json({
        success: true,
        chat,
      });
    } else {
      const chat = await Chat.findById(req.params.id);
      console.log("came here ")
      
      if (!chat) return next(new ApiError(404,"Chat not found"));
  
      return res.status(200).json({
        success: true,
        chat,
      });
    }
  });

  const renameGroup = asyncHandler(async (req, res, next) => {
    const chatId = req.params.id;
    const { name } = req.body;
  
    const chat = await Chat.findById(chatId);
  
    if (!chat) return next(new ApiError(404,"Chat not found"));
  
    if (!chat.groupChat)
      return next(new ApiError(400,"This is not a group chat"));
  
    if (chat.creator.toString() !== req.user._id.toString())
      return next(
        new ApiError(403,"You are not allowed to rename the group")
      );
  
    chat.name = name;
  
    await chat.save();
  
    emitEvent(req, REFETCH_CHATS, chat.members);
  
    return res.status(200).json({
      success: true,
      message: "Group renamed successfully",
    });
  });


  const deleteChat = asyncHandler(async (req, res, next) => {
    const chatId = req.params.id;
  
    const chat = await Chat.findById(chatId);
  
    if (!chat) return next(new ApiError(404,"Chat not found"));
  
    const members = chat.members;
  
    if (chat.groupChat && chat.creator.toString() !== req.user._id.toString())
      return next(
        new ApiError(403,"You are not allowed to delete the group")
      );
  
    if (!chat.groupChat && !chat.members.includes(req.user.toString())) {
      return next(
        new ApiError(403,"You are not allowed to delete the chat")
      );
    }
  
    //   Here we have to dete All Messages as well as attachments or files from cloudinary
  
    const messagesWithAttachments = await Message.find({
      chat: chatId,
      attachments: { $exists: true, $ne: [] },
    });
  
    const public_ids = [];
  
    messagesWithAttachments.forEach(({ attachments }) =>
      attachments.forEach(({ public_id }) => public_ids.push(public_id))
    );
  
    await Promise.all([
      deleteFromCloudinary(public_ids),
      chat.deleteOne(),
      Message.deleteMany({ chat: chatId }),
    ]);
  
    emitEvent(req, REFETCH_CHATS, members);
  
    return res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  });

  const getMessages = asyncHandler(async (req, res, next) => {
    const chatId = req.params.id;
    const { page = 1 } = req.query;
  
    const resultPerPage = 20;
    const skip = (page - 1) * resultPerPage;
  
    const chat = await Chat.findById(chatId);
  
    if (!chat) return next(new ApiError(400,"Chat not found"));
  
    if (!chat.members.includes(req.user._id.toString()))
      return next(
        new ApiError(400,"You are not allowed to access this chat")
      );
  
    const [messages, totalMessagesCount] = await Promise.all([
      Message.find({ chat: chatId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(resultPerPage)
        .populate("sender", "fullName userName avatar")
        .lean(),
      Message.countDocuments({ chat: chatId }),
    ]);
  
    const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;
  
    return res.status(200).json({
      success: true,
      messages: messages.reverse(),
      totalPages,
    });
  });

  
  


export {newGroupChat,getMyChats, addMembers,removeMember,leaveGroup,sendAttachments,getChatDetails,renameGroup,deleteChat,getMessages}




