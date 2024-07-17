import {Router} from "express"
import { registerUser,loginUser, logOut, searchUser, sendFriendRequest, getMyNotifications, acceptFriendRequest, getMyFriends, getUserProfile } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { emitEvent } from "../utils/EmitEvent.js"
const router = Router()

router.route("/register").post(upload.fields([
    {
        name:"avatar",
        maxCount:1 
    }
])
,registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logOut)
router.route("/search").get(verifyJWT,searchUser)
router.route("/sendrequest").put(verifyJWT,sendFriendRequest)
router.route("/notifications").get(verifyJWT,getMyNotifications)
router.route("/acceptrequest").put(verifyJWT,acceptFriendRequest)
router.route("/friends").get(verifyJWT,getMyFriends);
router.route("/userProfile/:userId").get(verifyJWT,getUserProfile)


export default router;



