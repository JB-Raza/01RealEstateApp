import express from 'express'
import { verifyUser } from '../utils/verifyUser.js'
import { verifyListing } from '../utils/verifyListing.js'
import { validateReview } from '../utils/validation.js'
import { addReview, deleteReview, getListingReviews, updateReview } from '../controllers/review.controller.js'

const router = express.Router({mergeParams: true})

router.get("/", verifyListing, getListingReviews) // fetch listing reviews
router.post("/add",verifyUser, validateReview, verifyListing, addReview) // add review
router.delete("/delete/:reviewId", verifyUser, verifyListing, deleteReview) // delete review
router.put("/edit/:reviewId", verifyUser, verifyListing, updateReview) // update review


export default router