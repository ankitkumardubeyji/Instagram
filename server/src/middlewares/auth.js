import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";





const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);

    const authToken = socket.request.cookies["chattu-token"];

    if (!authToken)
      return next(new ApiError("Please login to access this route", 401));

    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await User.findById(decodedData._id);

    if (!user)
      return next(new ApiError(401,"Please login to access this route"));

    socket.user = user;

    return next();
  } catch (error) {
    console.log(error);
    return next(new ApiError(400,"Please login to access this route"));
  }
};

export { socketAuthenticator };

