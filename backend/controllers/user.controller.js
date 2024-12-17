import { errorHandler } from '../utils/error.js'
import bcryptjs from 'bcryptjs'
import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

export const updateUser = async (req, res, next) => {

    try {
        const { email, oldPassword, newPassword } = req.body
        const validUser = await User.findOne({ email })

        if (!validUser) return res.json({
            success: false,
            message: "user does not exist"
        })
        const validPassword = bcryptjs.compareSync(oldPassword, validUser.password)

        if (!validPassword) return res.json({
            success: false,
            message: "enter correct old password to set a new password"
        })
        const hashedPass = bcryptjs.hashSync(newPassword, 10)

        const updatedUser = await User.findByIdAndUpdate( { _id: validUser._id }, { $set: {password: hashedPass}}, {new: true})
        return res.json(updatedUser)

    } catch (error) {
        next(error)
    }
}
