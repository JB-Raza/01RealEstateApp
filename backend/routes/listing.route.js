import express from 'express'
import { addListing, allListings, deleteListing, getListing, getUserListings, updateListing, searchListings } from '../controllers/listing.controller.js'
import { verifyUser } from '../utils/verifyUser.js'
import { uploadListing } from '../file_upload/multerConfig.js'
import { validateListing } from '../utils/validation.js'

const router = express.Router({mergeParams: true})

router.get("/", allListings)
// if we validateListing first and then uplaodListing images in cloudinary, it will give error because the multer actually parses the data and send to req.body. thats why we get undefined in all fields of req.body. 

// better approach is to store the files in local storage first, validate the listing fields and then upload to cloudinary, then remove img files from local storage.
router.post("/add", verifyUser, uploadListing.array("images", 4), validateListing, addListing)
router.get("/user/:userId", verifyUser, getUserListings)
router.delete("/delete/:id", verifyUser, deleteListing)
router.get("/search", searchListings)
router.put("/:id/update", verifyUser, uploadListing.array("images", 4), updateListing)
router.get("/:id", getListing)


export default router