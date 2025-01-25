import Listing from '../models/listing.model.js'
import { errorHandler } from './error.js'

export const verifyListing = async (req, res, next) => {
    const listingId = req.params.listingId
    try {
        const listing = await Listing.findById(listingId)
        if (!listing) return next(errorHandler(404, "Listing not found"))
        req.listing = listing
        next()
    } catch (error) {
        next(error)
    }
}