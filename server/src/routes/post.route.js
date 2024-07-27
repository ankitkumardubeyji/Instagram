import { Router } from "express";
import { getAllPosts, publishPost } from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { attachmentsMulter } from "../middlewares/multer.middleware.js";


const router = Router()


router.route("/upload/post").post(verifyJWT ,attachmentsMulter,publishPost)
router.route("/").get(verifyJWT,getAllPosts)

export default router;