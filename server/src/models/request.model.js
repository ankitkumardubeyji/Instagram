import { model, Schema } from "mongoose";

const requestSchema = Schema({
    status:{
        type:String,
        default:"pending",
        enum:["pending","accepted","rejected"]
    },

    sender:{
        type:Types.ObjectId,
        ref:"User",
        required:true 
    },

    receiver:{
        type:Types.ObjectId,
        ref:"User",
        required:true 
    }
},{timeStamps:true})


export const Request = model("Request",requestSchema)
