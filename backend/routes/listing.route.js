import express from 'express'
import { addListing, allListings, deleteListing, getListing, getUserListings } from '../controllers/listing.controller.js'
import { verifyUser } from '../utils/verifyUser.js'
import { uploadListing } from '../file_upload/multerConfig.js'

const router = express.Router({mergeParams: true})

router.get("/", allListings)
router.post("/add", verifyUser, uploadListing.array("images", 4), addListing)
router.get("/:id", getListing)
router.get("/user/:userId", verifyUser, getUserListings)
router.delete("/delete/:id", verifyUser, deleteListing)


export default router