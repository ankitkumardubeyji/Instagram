import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsynHandler.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { getPublicIdFromUrl } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"

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

        const avatar = await uploadOnCloudinary(avatarLocalPath)

   

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

    return res.status(200)
    .cookie("accessToken",accessToken)
    .json(new ApiResponse(200,{user,accessToken},"user logged in successfully"));

})


const searchUser = asyncHandler(async(req,res)=>{
    const {fullName} = req.query



    


})

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

export {registerUser,loginUser,logOut};

