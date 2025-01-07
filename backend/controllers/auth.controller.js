import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from "jsonwebtoken"

// signup function
export const signup = async (req, res, next) => {
    const imgUrl = req.file?.path
    const { username, email, password } = req.body
    const hashedPass = bcryptjs.hashSync(password, 10)
    const newUser = new User({ username, email, password: hashedPass, avatar: imgUrl })
    try {
        await newUser.save()
        res.status(201).json({ message: "user saved successfully" })
    } catch (error) {
        next(error)
    }
}

// login function
export const signin = async (req, res, next) => {
    const { email, password } = req.body
    try {

        const validUser = await User.findOne({ email })
        if (!validUser) return next(errorHandler(404, "user not found!!"))

        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) return next(errorHandler(401, "wrong credentials"))
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)

        const { password: pass, ...rest } = validUser._doc
        res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest)

    } catch (error) {
        next(error)
    }
}
// login with google
export const google = async (req, res, next) => {
    try {
        const { name, email, photo } = req.body
        const user = await User.findOne({ email })

        if (user) {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            const {password: pass, ...rest} = user._doc
            res
            .cookie("access_token", token, {httpOnly: true})
            .status(200)
            .json(rest)
        }
        else {
            // generating a random password for user
            const randomPassword = Math.random().toString(36).slice(-8)
            const hashedPass = bcryptjs.hashSync(randomPassword, 10)

            // username should be unique so we are adding some random values at the end of username so it stays unique
            const username = name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4)

            // new user
            const newUser = new User({ username, email, password: hashedPass, avatar: photo })
            await newUser.save()

            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET)
            const {password: pass, ...rest} = newUser._doc
            res
            .cookie("access_token", token, {httpOnly: true})
            .status(200)
            .json(rest)
        }
    } catch (error) {
        next(errorHandler(500, error.message))
    }


}


// sign out
export const signout = async (req, res, next) => {
    res.clearCookie("access_token").status(200).json({success: true, message: "user signed out successfully" })
}