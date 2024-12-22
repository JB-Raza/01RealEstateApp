import multer from 'multer'
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import cloudinary from "./cloudinaryConfig.js";


// creating multer storage to upload avatars
const avatarStorage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: "real_estate_project/avatars",
        allowed_formats: ["jpg", 'png', 'jpeg'],
        transformation: [{width: "500", height: "500", crop: "limit"}]
    },
})
// creating multer storage to upload avatars
const listingStorage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: "real_estate_project/listings",
        allowed_formats: ["jpg", 'png', 'jpeg'],
        transformation: [{width: "500", height: "500", crop: "limit"}]
    },
})

export const upload = multer({
    storage: avatarStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, /* 10MB */
 })

 export const uploadListing = multer({
    storage: listingStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, /* 10MB */
 })