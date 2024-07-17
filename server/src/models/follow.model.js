import mongoose  from "mongoose";

const followerSchema = mongoose.Schema({
    follower:{     // the one who is following the artist
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    following:{ // the one who is being followed by the follower 
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Follower = mongoose.model("Follower",followerSchema);



