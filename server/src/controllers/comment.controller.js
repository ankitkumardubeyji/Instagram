import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/AsynHandler.js"


const getPostComments = asyncHandler(async (req, res) => {

    //TODO: get all comments for a video
    const {postId} = req.params
    //const {page = 1, limit = 10} = req.query

    const comment = await Comment.aggregate([
        {
            $match:{
                post:new mongoose.Types.ObjectId(postId) 
            }
        },

        {

            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",

                pipeline:[
                    {
                        $project:{
                            fullName:1,
                            avatar:1 ,
                        }
                    }
                ]
            }
        },

        {
            $addFields:{
                owner:{
                    $first:"$owner"
                }
               
            }
        }
    ])
    console.log(comment)
    if(comment){
        res.status(200)
        .json(new ApiResponse(200,comment,"comment on the posts found out successfully "))
    }

    else{
        res.staus(200)
        .json(new ApiResponse(200,{},"no comment found on the videos "))
    }
})

const addComment = asyncHandler(async (req, res) => {
    console.log("htt bsdka");
    console.log(req.body);
    // TODO: add a comment to a video
    const {postId} = req.params
    const {comment} = req.body
    

    const newComment = await Comment.create({
        post:postId,
        content:comment,
        owner:req.user?._id,
    })

    const publishedComment = await Comment.findById(newComment?._id)



    res.status(200).json(
        new ApiResponse(200,publishedComment,"Successfully added comment to the post")
    )
})




export {
    getPostComments, 
    addComment, 
   
    }