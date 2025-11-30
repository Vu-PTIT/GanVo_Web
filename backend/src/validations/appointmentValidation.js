import Joi from "joi";

export const appointmentSchema = Joi.object({
  dateTime: Joi.string().required(),
  city: Joi.string().required(),
  type: Joi.string().required(),
  reason: Joi.string().allow("").optional(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
});
