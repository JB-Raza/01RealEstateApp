import multer from 'multer'
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import cloudinary from "./cloudinaryConfig.js";


// creating multer storage
const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: "real_estate_project/avatars",
        allowed_formats: ["jpg", 'png', 'jpeg'],
        transformation: [{width: "500", height: "500", crop: "limit"}]
    },
})

export const upload = multer({storage})
