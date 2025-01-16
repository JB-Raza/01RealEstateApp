import Listing from '../models/listing.model.js'
import { errorHandler } from '../utils/error.js'

export const allListings = async (req, res, next) => {
    const listings = await Listing.find()
    res.json(listings)
}

export const addListing = async (req, res, next) => {
    // check if user logged in
    const userId = req.user.id
    
    if (!req.user) return next(errorHandler(400, "you must be logged in to create a new listing"))
    try {
        const images = req.files?.map((image) => {
            return image.path
        })
        const data = req.body
        if (data.discount == undefined || data.discount == "" || data.discount == null) data.discount = 0

        const newListing = new Listing({ ...data, userRef: userId, images })
        await newListing.save()
        res.status(201).json({
            success: true,
            message: "Listing created successfully sire",
            newListing
        })

    } catch (error) {
        // console.log("Bad errror sire == ", error.message)
        next(errorHandler(500, error.message))
    }
}

export const getListing = async (req, res, next) => {
    try {
        const id = req.params.id
        const listing = await Listing.findById(id)
        res.json(listing)
    } catch (error) {
        next(error)
    }

}

export const getUserListings = async (req, res, next) => {
    const userId = req.params.userId
    const id = req.user.id
    try {
        if (!id) return next(errorHandler(404, "Login to get Your Listings"))
        if (userId !== id) return next(errorHandler(400, "You are not authorized to access these listings"))

        const allUserListings = await Listing.find({ userRef: userId })
        res.status(200).json(allUserListings)
    } catch (error) {
        next(error.message)
    }
}

export const deleteListing = async (req, res, next) => {
    const userId = req.user.id
    const listingId = req.params.id
    try {
        if (!userId) return next(errorHandler(400, "you must be logged in to delete this listing"))
        if (!listingId) return next(errorHandler(404, "listing not found"))
        const listing = await Listing.findById(listingId)
        const userRef = listing.userRef.toString()  //since it is of Type ObjectId and the params id is string.

        if (userId !== userRef) return next(errorHandler(400, "You can only delete your own listing sire"))
        const deletedListing = await Listing.deleteOne(listing)
        res.json({    
            success: true,
            message: "Listing Deleted",
            deletedListing
        })
    } catch (error) {
        next(error)
    }
}

export const updateListing = async (req, res, next) => {
    const userId = req.user?.id;
    try {
        // check user login status
        if (!userId) return next(errorHandler(400, "You must be logged in to update this listing"));

        const listingId = req.params.id;
        const listing = await Listing.findById(listingId);
        if (!listing) return next(errorHandler(404, "Listing not found"));

        // Verifying user ownership of the listing
        const userRef = listing.userRef.toString();
        if (userId !== userRef) return next(errorHandler(403, "You can only update your own listings"));

        const images = req.files?.map((image) => image.path) || [];
        const updateData = { ...req.body, ...(images.length > 0 && { images }) };
        const updatedListing = await Listing.findByIdAndUpdate(listingId, updateData, { new: true });

        res.json({
            success: true,
            message: "Listing updated successfully",
            updatedListing,
        });
    } catch (error) {
        next(errorHandler(500, error.message || "An error occurred while updating the listing"));
    }
};

export const searchListings = async (req, res, next) => {
    try {
        const { searchTerm } = req?.query;
        const listings = await Listing.find({ title: { $regex: searchTerm, $options: "i" } });
        res.json({
            success: true,
            message: "Listings found",
            listings,
        });
    } catch (error) {
        next(error);
    }
};