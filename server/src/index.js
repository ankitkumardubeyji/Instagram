
import {server} from "./app.js";
import dotenv from "dotenv"
import { connectDB } from "./db/index.js";


dotenv.config({
path:"../.env"
})
const port = process.env.PORT || 5000;
connectDB().then(()=>server.listen(port,()=>{
    console.log(`Server listening at the port ${port}`)
})
).catch((err)=>console.log("Some error happened in connecting the servers"))






