import express from 'express'
import { addReview, deleteReview, getListingReviews, updateReview } from '../controllers/review.controller.js'
import { verifyUser } from '../utils/verifyUser.js'
import { verifyListing } from '../utils/verifyListing.js'




const router = express.Router({mergeParams: true})


router.get("/", verifyListing, getListingReviews) // fetch listing reviews
router.post("/add",verifyUser, verifyListing, addReview)
router.delete("/delete/:reviewId", verifyUser, verifyListing, deleteReview)
router.put("/edit/:reviewId", verifyUser, verifyListing, updateReview)


export default router