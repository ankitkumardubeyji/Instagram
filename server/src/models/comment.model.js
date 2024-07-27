import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; // this is used as the plugin 

const commentSchema = mongoose.Schema({
    content:{
        type:String,
        required:true 
    },

    post:{
        type:Schema.Types.ObjectId,
        ref:"Post"
    },

    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true})

commentSchema.plugin(mongooseAggregatePaginate) // enables the functionality of controlling  pagination ie kaha se kaha comment/video dene h

export const Comment = mongoose.model("Comment",commentSchema)

