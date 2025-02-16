import express from "express"
import { signup, signin, google, signout } from "../controllers/auth.controller.js"
import {upload} from '../file_upload/multerConfig.js'
import { validateUser } from "../utils/validation.js"

const router = express.Router()

router.post("/signup", upload.single("avatar"), validateUser, signup)
router.post("/signin", signin)
router.post("/google", google)
router.post("/signout", signout)

export default router