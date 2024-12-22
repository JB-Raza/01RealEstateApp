import Listing from '../models/listing.model.js'
import { errorHandler } from '../utils/error.js'

export const addListing = async (req, res, next) => {
    // check if user logged in
    const userId = req.user.id
    if(!req.user) return next(errorHandler(400, "you must be logged in to create a new listing"))
    try {
        const images = req.files.map((image) => {
            return image.path
        })

        const data = req.body
        const newListing = new Listing({ ...data, userRef: userId, images })
        await newListing.save()

        res.status(201).json({
            success: true,
            message: "Listing created successfully sire",
            newListing
        })

    } catch (error) {
        next(errorHandler(500, error.message))
    }
}