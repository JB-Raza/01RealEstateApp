import express from 'express'
const app = express()
import mongoose from "mongoose"
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'


const mongoConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to MongoDB");
    }  catch (error) {
        console.log("ERROR in Mongo connection == ", error);
        if (error.cause) {
            console.log("Cause details: ", error.cause);
        }
    }
}
mongoConnection()
dotenv.config()


app.listen(3000, () => {
    console.log("server active on 3000")
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())


// routes 
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import User from './models/user.model.js'

// api requests
app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)

app.delete("/clear-all", async (req, res, next) => {
    try {
        const data = await User.deleteMany({})
        res.send(data)
    } catch (error) {
        next(error)
    }

})

// middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal server error bro"

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})
