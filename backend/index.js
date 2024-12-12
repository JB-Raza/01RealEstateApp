import express from 'express'
import mongoose from "mongoose"
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("connected to db")
}).catch((err) => console.log(err))


const app = express()

app.get("/", (req, res) => {
    res.send("server running")
})

app.listen(3000, () => {
    console.log("server active on 3000")
})