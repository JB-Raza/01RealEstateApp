import express from 'express'
import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config()
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("connected to db") )
.catch((err) => console.log(err))

// routes 
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'

const app = express()
app.use(express.json())

// api requests
app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)










app.listen(3000, () => {
    console.log("server active on 3000")
})