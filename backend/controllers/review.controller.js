import Review from '../models/review.model.js'
import { errorHandler } from '../utils/error.js';

export const addReview = async (req, res, next) => {
    try {
        if (!req.user) return next(errorHandler(401, "You must be logged in to delete your review sire..."));
        if (!req.listing) return next(errorHandler(404, "Listing not found"));

        const { rating, comment } = req.body
        const review = new Review({ rating, comment, userRef: req.user.id, listingRef: req.listing._id })
        await review.save()
        res.status(201).json({ success: true, message: "Review added successfully", review })

    } catch (error) {
        next(errorHandler(500, error.message))
    }
}
export const deleteReview = async (req, res, next) => {
    try {
        if (!req.user) return next(errorHandler(401, "User not found"));
        if (!req.listing) return next(errorHandler(404, "Listing not found"));
        
        const reviewId = req.params.reviewId
        const review = await Review.findByIdAndDelete(reviewId)
        res.status(200).json({ success: true, message: "Review deleted successfully", review })

    } catch (error) {
        next(errorHandler(500, error.message))
    }
}
export const updateReview = async (req, res, next) => {

    try {
        if (!req.user) return next(errorHandler(401, "User not found"));
        if (!req.listing) return next(errorHandler(404, "Listing not found"));
        
        const reviewId = req.params.reviewId
        const review = await Review.findByIdAndUpdate(reviewId, req.body, { new: true })
        res.status(200).json({ success: true, message: "Review updated successfully", review })

    } catch (error) {
        next(errorHandler(500, error.message))        
    }
    
}

export const getListingReviews = async (req, res, next) => {
    try {
        if(!req.listing) return next(errorHandler(404, "Listing not found so no reviews could be provided"));
        const listingId = req.params.listingId
        const reviews = await Review.find({ listingRef: listingId }).populate("userRef", "username")
        res.status(200).json({ success: true, message: "Reviews fetched successfully", reviews })
    } catch (error) {
        next(errorHandler(500, error.message))
    }
}
