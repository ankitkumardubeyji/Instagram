import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsynHandler.js";
import { uploadOnCloudinarySingle} from "../utils/cloudinary.js"
import { getPublicIdFromUrl } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { Chat } from "../models/chat.model.js";
import mongoose from "mongoose";
import { Request } from "../models/request.model.js";
import { emitEvent } from "../utils/EmitEvent.js";
import { REFETCH_CHATS, NEW_REQUEST  } from "../constants/event.js";
import { getOtherMember } from "../lib/helper.js";
import { Follower } from "../models/follow.model.js";

let currentUser = {}

const registerUser = asyncHandler(async(req,res)=>{
    const {fullName, email,userName, password,phoneNo} = req.body;

        if(!fullName || !email || !userName || !password){
            throw new ApiError(400,"All fields are required");
        }

        const existedEmail = await User.findOne({email})
        const existedUserName = await User.findOne({userName})

        if(existedEmail || existedUserName){
            throw new ApiError(400,`User with the given email or Username already exists`);
        }

        // extracting avatarlocalfile that will have been stored in the local storage

     

        const avatarLocalPath = req.files.avatar[0]?.path;

        if(!avatarLocalPath){
            throw new ApiError(400,"avatar file is required")
        }

        const avatar = await uploadOnCloudinarySingle(avatarLocalPath)

   

        if(!avatar){
            throw new ApiError(400,'Avatar couldnt be uploaded')
        }

        const avatarUrl = avatar.url 
        const avatarPublicId = getPublicIdFromUrl(avatar.url)
  



        // creating the user with the above details

        const user = await User.create({
            fullName,
            email,
            password,
            userName,
            phoneNo,
            avatar:{secure_url:avatarUrl,public_id:avatarPublicId}
        })

        const createdUser = await User.findById(user._id)

        if(!createdUser){
            throw new ApiError(400,"some problem happened with registering the user ")
        }

        // All the custom defined in the schema are acessible by the schema entities
        const accessToken = await createdUser.generateJWTToken(createdUser._id)


        return res.status(200)
        .cookie("acessToken",accessToken)
        .json(new ApiResponse(200,{user:createdUser},"user registered successfully"))

})

const loginUser = asyncHandler(async(req,res)=>{
 
    const {email, password} = req.body

  


    if(!email || !password){
        throw new ApiError(400,"all credentials are required")
    }

    const user = await User.findOne({email}).select('+password');

    if(!user){
    
        throw new ApiError(400,"user with the given email id doesnt exists");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid password")
    }

    const accessToken = await user.generateJWTToken(user._id)

    currentUser = user;

    return res.status(200)
    .cookie("accessToken",accessToken)
    .json(new ApiResponse(200,{user,accessToken},"user logged in successfully"));

})


const searchUser = asyncHandler(async (req, res) => {
    const { fullName = "" } = req.query;
    console.log(req.query)
  // Verify req.user is populated
  if (!req.user || !req.user._id) {
    return res.status(400).json({ success: false, message: 'User not authenticated' });
  }

  
  // Ensure user ID is in correct format
  const userId = new  mongoose.Types.ObjectId(req.user._id);

  // Finding all my chats
  const myChats = await Chat.find({ groupChat: false, members: userId });

  // Extracting all users from my chats means friends or people I have chatted with
  const allUsersFromMyChats = myChats.flatMap((chat) => chat.members).map(id => id.toString());

  // Adding the current user to the exclusion list
  allUsersFromMyChats.push(userId.toString());

  // Log the user ID and extracted users for debugging
  //console.log('User ID:', req.user._id);
  //console.log('All Users From My Chats:', allUsersFromMyChats);

  
  console.log(fullName+" "+ "here is the fullname")


  // Finding all users except me and my friends and filtering by fullName
  const allUsersExceptMeAndFriends = await User.find({
    //_id: { $nin: allUsersFromMyChats },
    fullName: { $regex: fullName, $options: "i" },
  });

  // Log the result of the user query for debugging
  //console.log('All Users Except Me and Friends:', allUsersExceptMeAndFriends);

  // Modifying the response
  const users = allUsersExceptMeAndFriends.map(({ _id, fullName, avatar }) => ({
    _id,
    fullName,
    avatar: avatar ? avatar.secure_url : null,
  }));

  return res.status(200).json({
    success: true,
    users,
    });
  });


  const sendFriendRequest = asyncHandler(async (req, res, next) => {
    const { userId } = req.body;

  // Check if userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError(400, "Invalid user ID"));
  }

  const request = await Request.findOne(
      { sender: req.user._id, receiver: userId }, 
  );

  if (request) return next(new ApiError(400, "Request already sent"));

  await Request.create({
    sender: req.user._id,
    receiver: new  mongoose.Types.ObjectId(userId),
  });

  emitEvent(req, NEW_REQUEST, [userId]);
  
    return res.status(200).json({
      success: true,
      message: "Friend Request Sent",
    });
  });
  
  const acceptFriendRequest = asyncHandler(async (req, res, next) => {
    const { requestId, accept } = req.body;

    console.log(requestId);
    console.log(req.user._id);
  
    // Check if requestId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return next(new ApiError(400, "Invalid request ID"));
    }
  
    const request = await Request.findById(new mongoose.Types.ObjectId(requestId))
      .populate("sender", "fullName")
      .populate("receiver", "fullName");
  
    if (!request) return next(new ApiError(400, "Request not found"));
  
    if (request.receiver._id.toString() !== req.user._id.toString())
      return next(new ApiError(400, "You are not authorized to accept this request"));
  
    if (!accept) {
      await request.deleteOne();
  

   

      return res.status(200).json({
        success: true,
        message: "Friend Request Rejected",
      });
    }
  
    const members = [request.sender._id, request.receiver._id];
  
    await Promise.all([
      Chat.create({
        members,
        name: `${request.sender.fullName}`,
      }),
      request.deleteOne(),
    ]);
  
    emitEvent(req, REFETCH_CHATS, members);

    const newfollow = await Follower.create({
      following:request.sender?._id,  // the one who is following 
      followed:req.user._id   // the one who is being followed 
  })


  

    return res.status(200).json({
      success: true,
      message: "Friend Request Accepted",
      senderId: request.sender._id,
    });
  });
  
  const getMyNotifications = asyncHandler(async (req, res) => {
    const requests = await Request.find({ receiver: req.user._id }).populate(
      "sender",
      "fullName avatar userName"
    );

  
    const allRequests = requests.map(({ _id, sender }) => ({
      _id,
      sender: {
        _id: sender._id,
        fullName: sender.fullName,
        userName:sender.userName,
        avatar: sender.avatar.secure_url,
      },
    }));
  
    return res.status(200).json({
      success: true,
      allRequests,
    });
  });
  
  const getMyFriends = asyncHandler(async (req, res) => {
    const chatId = req.query.chatId;
  
    const chats = await Chat.find({
      members: req.user,
      groupChat: false,
    }).populate("members", "name avatar");
  
    const friends = chats.map(({ members }) => {
      const otherUser = getOtherMember(members, req.user);
  
      return {
        _id: otherUser._id,
        name: otherUser.name,
        avatar: otherUser.avatar.url,
      };
    });
  
    if (chatId) {
      const chat = await Chat.findById(chatId);
  
      const availableFriends = friends.filter(
        (friend) => !chat.members.includes(friend._id)
      );
  
      return res.status(200).json({
        success: true,
        friends: availableFriends,
      });
    } else {
      return res.status(200).json({
        success: true,
        friends,
      });
    }
  });
  


const logOut = asyncHandler(async(req,res,next)=>{
    console.log("came to the backend for the logout")
    // finding the user logged in , and unsetting its refreshToken
   

    const options = {
        httpOnly:true,
        secure:true, 
    }
    console.log("here");
    return res.status(200)
    .clearCookie("accessToken",options)
    .json(new ApiResponse(200,{},"User logged out successfully "))
})


const getUserProfile = asyncHandler(async(req,res)=>{
     // extracting the username/channel from the url
     const {userId} = req.params

     console.log(userId)


     if(!userId?.trim()){
         throw new ApiError(400,"userId is missing")
     }
 
     // joining the subscriptions collection with the users collection to store the information of subscriptions collections documents
     // inorder to know the subcribers, no of channel subscribed by the channel and whether the currentUser has
     // subscribed to the channel or not.
 
     const user = await  User.aggregate([
         {
         $match:{
             _id: new mongoose.Types.ObjectId(userId )// finding the document in the users collection with the given username
         }
     },
 
     {
         // looking into the subsriptions collections and checking the documents whose channel matches with the localfield _id, to know the subscribers of the channel
         $lookup:{
             from:"followers",
             localField:"_id",
             foreignField:"followed",
             as:"followers"
 
         }
     },
 
     {
 
 // looking into the subscriptions collection and finding out te doucnents whose subscription mathes with the localField id , to get to know the channels subscribed by the current Channel username
 
         $lookup:{
             from :"followers",
             localField:"_id",
             foreignField:"following",
             as:"following"
         }
     },
 
     {
         $addFields:{
             followersCount:{
                 $size:"$followers"
             },
 
             followingCount:{
                 $size :"$following"
             },
 
             isFollowing:{
                 // checking if any of the documents in the subscribers has the subscriber matching with the current user id , if it is then yes the current user is the subscriber.
                 $cond:{
                     if:{$in:[req.user?._id,"$followers.following"]},
                     then:true,
                     else:false,
                 },
 
             }
 
         }
     },
 
     {
     $project:{
         fullName:1,
         username:1,
         followersCount:1,
         followingCount:1,
         isFollowing:1,
         avatar:1,
         email:1,
         userName:1,
     }
 }
 
     ])
 
     if(!user?.length){
        throw new ApiError(400,"User doesnt exists") 
     }
 
 
     return res.status(200)
     .json(new ApiResponse(200,user[0],"User info fetched  successfully"))
    

});







export {registerUser,loginUser,logOut,searchUser,sendFriendRequest,getMyNotifications,acceptFriendRequest,getMyFriends,getUserProfile,currentUser};

