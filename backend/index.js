import express from 'express'
const app = express()
import mongoose from "mongoose"
import dotenv from 'dotenv'
import methodOverride from 'method-override'


dotenv.config()
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("connected to db") )
.catch((err) => console.log(err))

app.listen(3000, () => {
    console.log("server active on 3000")
})

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride("_method"))


// routes 
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import User from './models/user.model.js'

// api requests
app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)

app.delete("/clear-all", async(req, res, next) => {
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
