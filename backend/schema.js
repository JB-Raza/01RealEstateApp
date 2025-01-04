import joi from 'joi'

export const listingSchema = joi.object({
    title: joi.string().min(5).required(),
    description: joi.string().min(5).required(),
    address: joi.string().required(),
    category: joi.string().required(),
    rentOrSale: joi.string().required(),
    services: joi.array().items(joi.string()).default(() => []),
    contact: joi.string().required(),
    price: joi.number().positive().required(),
    discount: joi.number().max(joi.ref("price")).positive(),
    availabilityStatus: joi.boolean(),
})

// we can add custom validations using curtom method
// .custom((value, helpers) => {
//     if (value.discount > value.price) {
//       return helpers.error('any.invalid', { message: 'Discount cannot be greater than price' });
//     }
//     return value;
//   });

export const userSchema = joi.object({
    username: joi.string().required(),
    email: joi.string().email({ tlds: { allow: ['com', 'net', 'org'] } }).required(),
    password: joi.string().required(),
    avatar: joi.string(),
})