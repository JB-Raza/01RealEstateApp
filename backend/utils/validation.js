import { errorHandler } from './error.js'
import { listingSchema, userSchema, reviewSchema } from '../schema.js'

export const validateListing = async (req, res, next) => {
    try {
        const { error } = listingSchema.validate( req.body, { abortEarly: false }) // abortEarly: false will return all the errors instead of stopping at first error
        if (error) {
            const errMsgs = error.details.map((detail) => detail.message).join(", ")
            return next(errorHandler(400, `Validation Error: ${errMsgs}`));
        }
        next()
    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

export const validateUser = async (req, res, next) => {
    try {
        const { error } = userSchema.validate(req.body, { abortEarly: false })
        if (error) {
            const errMsgs = error.details.map((detail) => detail.message).join(", ")
            return next(errorHandler(400, `Validation Error sire == ${errMsgs}`))
        }
        else next()

    } catch (error) {
        next(errorHandler(500, error.message))
    }

}

export const validateReview = async (req, res, next) => {
    try {
        const { error } = reviewSchema.validate(req.body)
        if (error) return next(errorHandler(400, error.details[0].message))
        next()
    } catch (error) {
        next(errorHandler(500, error.message))
    }
}