import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },   
    category: {
        type: String,
        default: "Standard",
        enum: ["Standard", "Mansion", "Villa", "Cottage", "Palace"],
    },
    rentOrSale: {
        type: String,
        default: "rent",
        enum: ["rent", "sale"],
        required: true,
    },
    services: {
        type: [String],
    },
    contact: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
    },
    
    images: {
        type: [String],
        required: true,
    },
   
    availabilityStatus: {
        type: Boolean,
        default: true,
    },    
    userRef: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, {timestamps: true})

const Listing = mongoose.model("Listing", listingSchema)

export default Listing