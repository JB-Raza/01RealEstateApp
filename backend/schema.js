import joi from 'joi'

export const listingSchema = joi.object({
    title: joi.string().min(5).required(),
    description: joi.string().min(5).required(),
    address: joi.string().required(),
    category: joi.string().required(),
    rentOrSale: joi.string().default("rent").required(),
    services: joi.alternatives().try(joi.array().items(joi.string()), joi.string()).default(() => []),
    contact: joi.string().min(7).max(15).required(),
    price: joi.number().positive().required(),
    discount: joi.number().max(joi.ref("price")).empty("").default(0).custom((value) => value === "" ? 0 : value),
    availabilityStatus: joi.boolean(),
})

// we can add custom validations using cutom method
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