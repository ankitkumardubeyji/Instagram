import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { newGroupChat ,getMyChats, addMembers, removeMember,leaveGroup,sendAttachments, getChatDetails, renameGroup, deleteChat, getMessages} from "../controllers/chat.controller.js";
import { attachmentsMulter } from "../middlewares/multer.middleware.js";

const router = Router()


router.use(verifyJWT)

router.route("/new").post(newGroupChat)
router.route("/my").get(verifyJWT, getMyChats)
router.route("/addmembers").put(addMembers)
router.route("/removemembers").put(removeMember)
router.delete("/leave/:id",leaveGroup)

// send attachments
router.post("/message",attachmentsMulter, sendAttachments)


// get messages
router.route("/message/:id").get(verifyJWT,getMessages);


router.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat)



export default router;


