import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    console.log("toggle krane backend tak phuch gya ")
    //TODO: toggle like on video
    const like = await Like.findOne({video:videoId,likedBy:req.user?._id})
    if(!like){
        const newLike = await Like.create(
            {
                video:videoId ,
                likedBy:req.user?._id,
            }     
        )
     const publishedLike = await Like.findById(newLike._id)
     res.status(200)
     .json(new ApiResponse(200,publishedLike,"Liked toggled:added successfully "))
    }
    else{
        const del = await Like.findByIdAndDelete(like._id)
        res.status(200)
        .json(new ApiResponse(200,{},"Like toggled and removed successfully"))
    }
        
})


const getLikesOnVideos = asyncHandler(async(req,res)=>{
    console.log("Yha aa gya tha ji")
    const {videoId} = req.params

    const likes = await Like.find({video:videoId})

    if(!likes){
        throw new ApiError(400,"Soory likes on the video couldnt be fetched")
    }

    else{
        res.status(200)
        .json(new ApiResponse(200,likes,"Likes on the video successfully fetched "))
    }

})

const checkIfLikedVideo = asyncHandler(async(req,res)=>{
    console.log("humre yha bhi phuch gya tha ")
    const {videoId} = req.params
    console.log(videoId)
    const likes = await Like.find({video:videoId,likedBy:req.user?._id})

    if(likes.length>0){
        res.status(200)
        .json(new ApiResponse(200,likes,"Video has been liked by the user"))
    }
    else{
        res.status(200)
        .json(new ApiResponse(200,{},"video has not been liked by the user "))
    }

})



const toggleCommentLike = asyncHandler(async (req, res) => {

    const {commentId} = req.params
    console.log(commentId)
    //TODO: toggle like on comment
    const like = await Like.findOne({comment:commentId,likedBy:req.user?._id})
   
    if(!like){
       
        const newLike = await Like.create(
            {
                likedBy:req.user?._id,
                comment:commentId,
            }
        )
       
        const publishedLike = await Like.findById(newLike._id)
        res.status(200)
        .json(new ApiResponse(200,publishedLike,"comment has been toggled:like added successfully"))
    }
    else{
   
        const del = await Like.findByIdAndDelete(like)
        res.status(200)
        .json(new ApiResponse(200,del,"comment has been toggled: like removed from the comment successfully"))
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    console.log("humre pas phuchh gya sir aaap nischit raho ")
    const {tweetId} = req.params

    //TODO: toggle like on tweet
   
 
    //TODO: toggle like on comment
    const like = await Like.findOne({tweet:tweetId,likedBy:req.user?._id})
   
    if(!like){
       
        const newLike = await Like.create(
            {
                likedBy:req.user?._id,
                tweet:tweetId,
            }
        )
       
        const publishedLike = await Like.findById(newLike._id)
        res.status(200)
        .json(new ApiResponse(200,publishedLike,"tweet has been toggled:like added successfully"))
    }
    else{
   
        const del = await Like.findByIdAndDelete(like)
        res.status(200)
        .json(new ApiResponse(200,del,"tweet has been toggled: like removed from the comment successfully"))
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    // here also we need to apply the aggregation and pipeline
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getLikesOnVideos,
    checkIfLikedVideo,
}


