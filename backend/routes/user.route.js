import express from "express"
import {upload} from '../file_upload/multerConfig.js'
import { deleteUser, updateUser } from "../controllers/user.controller.js"
import { verifyUser } from "../utils/verifyUser.js"

const router = express.Router({mergeParams: true})

router.put("/update/:id", verifyUser, upload.single("avatar"), updateUser)
router.delete("/delete/:id", deleteUser)


export default router