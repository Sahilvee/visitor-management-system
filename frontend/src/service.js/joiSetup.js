import Joi from "joi";

export const  loginSchema  = Joi.object({
email: Joi.string().email({ tlds: { allow: false } }).required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email",
      "any.required": "Email is required",
    }),
 

  password: Joi.string().min(6).required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
});



export const visitorSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required()
    .messages({
      "string.empty": "Full name is required",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name cannot exceed 50 characters",
      "any.required": "Full name is required",
      }),
  email: Joi.string().email({ tlds: { allow: false } }).required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email",
      "any.required": "Email is required",
      }),
  phone: Joi.string().pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must contain exactly 10 digits",
      "any.required": "Phone number is required",
     }),

  idtype: Joi.string()
    .valid("Aadhaar", "Passport", "DL")
    .required()
    .messages({
      "any.only": "Invalid ID type selected",
      "any.required": "ID type is required",
     }),

  idnumber: Joi.string()
    .trim()
     .required()
     .messages({
      "string.empty": "ID number is required",
      "any.required": "ID number is required",
    }),

   image: Joi.any()
    .required()
    .messages({
      "any.required": "Please upload an image",
     }),
} );