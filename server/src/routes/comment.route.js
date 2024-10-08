import { Router } from 'express';
import {
    addComment,
    getPostComments,
  
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:postId").get(getPostComments).post(addComment);


export default router
