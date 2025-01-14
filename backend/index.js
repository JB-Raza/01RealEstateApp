import express from 'express'
const app = express()
import mongoose from "mongoose"
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
// models
import User from './models/user.model.js'
import Listing from './models/listing.model.js'
// routes 
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import listingRouter from './routes/listing.route.js'

const mongoConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to MongoDB");
    }  catch (error) {
        console.log("ERROR in Mongo connection == ", error);
        if (error.cause) {
            console.log("Cause details Sire: ", error.cause);
        }
    }
}
await mongoConnection()
dotenv.config()


app.listen(3000, () => console.log("server active on 3000"))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())


// api requests
app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/listings", listingRouter)



// delete all users
app.delete("/clear-all", async (req, res, next) => {
    try {
        const data = await User.deleteMany({})
        res.send(data)
    } catch (error) {
        next(error)
    }
})
app.delete("/listings/clear-all", async (req, res, next) => {
    try {
        const data = await Listing.deleteMany({})
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
