import { confirmPasswordReset } from "firebase/auth";
import User from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req,res,next)=>{
    try{
        const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer","");

        if(!token){
            throw new ApiError(400,"UnAuthoirsed Request")
        }

        // if the token is valid then jwt will verify and return the data stored in the token
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
       

        const user = await User.findById(decodedToken?._id)

        if(!user){
            throw new ApiError(400,"invalid access Token")
        }

        req.user = user;
        next()
    }

    catch(err){
        throw new ApiError(400,err)
    }
})

export const authorisedRoles = (...roles) => async(req,res,next)=>{
    const currentUserRoles = req.user.role;
    if(!roles.includes(currentUserRoles)){
            return next(new AppError('You dont have the permission to access these routes '),400);
    }
    return next();
   
}

// make middleware for authorised subscribers