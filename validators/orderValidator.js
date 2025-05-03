
const Joi = require("joi");


const shippingValidator = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  postalCode: Joi.string().required(),
  additionalInfo: Joi.string().allow('')
});

 const paymentValidator = Joi.object({
  sellerId: Joi.string().required(),
  phoneNumber: Joi.string().min(10).required(),
  mpesaCode: Joi.string().required(),
  mpesaName: Joi.string().required(),
  amount: Joi.number().positive().required(),
  items: Joi.array().items(
    Joi.object({
      _id: Joi.string().required(),
      quantity: Joi.number().integer().positive().required()
    })
  ).required()
});
 
const orderValidator = Joi.object({
  shippingInfo: shippingValidator.required(),
  payments: Joi.array().items(paymentValidator).min(1).required(),
  items: Joi.array().items(
    Joi.object({
      _id: Joi.string().required(),
      name: Joi.string().required(),
      price: Joi.number().positive().required(),
      quantity: Joi.number().integer().positive().required(),
      image: Joi.string().required(),
      color: Joi.string().allow(''),
      stock: Joi.number().integer(),
      sellerId: Joi.string().required(),
      shelfId: Joi.string().allow('')
    })
  ).min(1).required()
});

module.exports = {
  paymentValidator,
  shippingValidator,
  orderValidator 
};
