import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"



const postSchema = new mongoose.Schema({
   
    posts: [
        {
          public_id: {
            type: String,
            required: true,
          },
          secure_url: {
            type: String,
            required: true,
          },
        },
      ],

   

    caption:{
        type:String,
      
    },

    

    isPublished:{
        type:Boolean,
        default:false, 
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },



},{timestamps:true})


postSchema.plugin(mongooseAggregatePaginate)
//songSchema.index({title:"text",description:"text"})

export const Post = mongoose.model("Post",postSchema)
