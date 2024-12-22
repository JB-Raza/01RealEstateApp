import express from 'express'
import { addListing } from '../controllers/listing.controller.js'
import { verifyUser } from '../utils/verifyUser.js'
import { uploadListing } from '../file_upload/multerConfig.js'

const router = express.Router({mergeParams: true})

router.post("/add", verifyUser, uploadListing.array("images", 4), addListing)


export default router