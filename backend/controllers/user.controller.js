import bcryptjs from 'bcryptjs'
import User from "../models/user.model.js"
import Listing from '../models/listing.model.js'
import { errorHandler } from '../utils/error.js'
import cloudinary from '../file_upload/cloudinaryConfig.js'

// update user
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

// delete user
export const deleteUser = async (req, res, next) => {
    const { id } = req?.params;
    if (req.user.id !== id) return next(errorHandler(403, "You can only delete your account while logged in"))
    try {
        const user = await User.findById(id)
        if (!user) return next(errorHandler(404, "The User you are trying to delete does not exist"))

        // delete images in cloudinary using publicId
        // const deleteUserImg = async () => {
        //     const getPublicId = (url) => {
        //         if (!url || typeof url !== 'string') {
        //             console.error("Invalid Cloudinary URL");
        //             return null;
        //         }
        //         const segments = url.split("/"); // Split the URL by "/"
        //         const versionIndex = segments.findIndex(segment => segment.startsWith("v")); // Find the version segment
        //         if (versionIndex === -1) {
        //             console.error("Version identifier not found in URL");
        //             return null;
        //         }
        //         // Reconstruct the path excluding the base URL and version identifier
        //         return segments.slice(versionIndex + 1).join("/").split(".")[0];
        //     };

        //     const publicId = getPublicId(user.avatar)
        //     if (!publicId) return next(errorHandler(400, "Failed to extract publicId from the provided URL"));

        //     // Delete the image from Cloudinary
        //     const cloudinaryResponse = await cloudinary.uploader.destroy(publicId);
        //     if (cloudinaryResponse.result !== "ok") return next(errorHandler(500, "Failed to delete image from Cloudinary"));

        // }
        // await deleteUserImg()

        // deleting all listings of user
        await Listing.deleteMany({ userRef: id })
        // delete the user
        await User.findByIdAndDelete(id)

        res.clearCookie('access_token')
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        return next(errorHandler(500, "delete user error on server side : " + error.message));

    }
}
