import Joi from "joi";

export const createAppointmentSchema = Joi.object({
  dateTime: Joi.date().required(),
  city: Joi.string().min(3).required(),
  type: Joi.string().required(),
  reason: Joi.string().allow(""),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
});
