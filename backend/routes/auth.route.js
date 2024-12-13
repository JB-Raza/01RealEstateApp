import express from "express"
import { signupRouter } from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/signup", signupRouter)

export default router