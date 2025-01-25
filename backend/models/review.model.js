import mongoose from 'mongoose'
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    rating: {
        type: Number,
        max: 5,
        required: true,
    },
    comment: {
        type: String,
    },
    listingRef: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
    },
    userRef: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {timestamps: true})


const Review = mongoose.model("Review", reviewSchema)

export default Review