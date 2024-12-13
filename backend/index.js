import express from 'express'
const app = express()
import mongoose from "mongoose"
import dotenv from 'dotenv'



dotenv.config()
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("connected to db") )
.catch((err) => console.log(err))

app.listen(3000, () => {
    console.log("server active on 3000")
})

// routes 
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'

app.use(express.urlencoded({extended: true}))
app.use(express.json())

// api requests
app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal server error bro"

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})
