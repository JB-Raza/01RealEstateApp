import bcryptjs from 'bcryptjs'
import User from "../models/user.model.js"
import { errorHandler } from '../utils/error.js'

export const updateUser = async (req, res, next) => {
    const userId = req.params.id;
    if (req.user.id !== userId) return next(errorHandler(403, "You can only update your account"))
    try {
        const imageUrl = req.file?.path
        const { email, oldPassword, newPassword } = req.body;
        if (!email) return next(errorHandler(400, "Email is required"));

        const validUser = await User.findOne({ _id: userId });
        if (!validUser) return errorHandler(404, "User not found");

        // Update avatar if provided
        if (imageUrl) validUser.avatar = imageUrl

        // Update password if oldPassword and newPassword are provided
        if (oldPassword && newPassword) {
            const validPassword = bcryptjs.compareSync(oldPassword, validUser.password)
            if (!validPassword) return next(errorHandler(400, "Incorrect old password"))

            const hashedPass = bcryptjs.hashSync(newPassword, 10);
            validUser.password = hashedPass;
        }
        await validUser.save()
        const { password, ...restOfUser } = validUser._doc
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            updatedUser: restOfUser,
        });

    } catch (error) {
        return next(errorHandler(500, "Server error bhai : " + error.message));
    }
};
// delete user functionality not working
export const deleteUser = async (req, res, next) => {
    const { id } = req?.params;
    if (req.user.id !== id) return next(errorHandler(403, "You can only delete your account while logged in"))
    try {
        if (id) {
            await User.findByIdAndDelete(id);
            res.clearCookie('access_token')
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
            });
        }
        else console.log('User not found')
    } catch (error) {
        return next(errorHandler(500, "delete user error on server side : " + error.message));

    }
}
