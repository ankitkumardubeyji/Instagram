import cors from "cors"
import cookieparser from "cookie-parser"
import express from "express"

const app = express();

app.use(cookieparser())
app.use(cors())


app.use(express.json({limit:"16kb"})) // necessary to take the json data as the input 
app.use(express.static("public"))


import userRouter  from "./routes/user.route.js"


app.use("/api/v1/users",userRouter);

export default app;

