import express from "express"
import {upload} from '../file_upload/multerConfig.js'
import { deleteUser, updateUser } from "../controllers/user.controller.js"

const router = express.Router({mergeParams: true})

router.put("/update", upload.single("avatar"), updateUser)
router.delete("/delete/:id", deleteUser)


export default router