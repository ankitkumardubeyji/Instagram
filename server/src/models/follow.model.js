import mongoose  from "mongoose";

const followerSchema = mongoose.Schema({
    following:{     // the one who is following 
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    followed:{ // the one who is being followed 
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Follower = mongoose.model("Follower",followerSchema);



