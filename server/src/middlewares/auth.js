import cookieParser from "cookie-parser";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"




const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);

    // Check if cookies are already parsed
    if (!socket.request.cookies) {
      console.error("Cookies not parsed");
      return next(new ApiError("Cookies not parsed", 400));
    }

    const authToken = socket.request.cookies.accessToken;

    console.log("Cookies:", socket.request.cookies);
    console.log("Auth Token:", authToken);

    if (!authToken) {
      return next(new ApiError("Please login to access this route", 401));
    }

    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

    console.log("Decoded Data:", decodedData);

    const user = await User.findById(decodedData.id);
    
    console.log("User:", user);

    if (!user) {
      return next(new ApiError("Please login to access this route", 401));
    }

    socket.user = user;

    return next();
  } catch (error) {
    console.error("Authentication Error:", error);
    return next(new ApiError("Please login to access this route", 400));
  }
};


export { socketAuthenticator };

