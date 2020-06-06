import Joi from "joi";
import { itemTypes, itemActions } from "../constants.js";
import Schemas from "./schemas.js";

// Joi validation options
export const validationOptions = {
  abortEarly: false, // abort after the last validation error
  allowUnknown: true, // allow unknown keys that will be ignored
  stripUnknown: true, // remove unknown keys from the validated data
};

export default (useJoiError = false) => {
  // useJoiError determines if we should respond with the base Joi error
  // boolean: defaults to false

  // return the validation middleware
  return (req, res, next) => {
    const type = req.body.type;
    const action = req.body.action;
    let schema = null;
    if (
      Object.values(itemTypes).includes(type) &&
      Object.values(itemActions).includes(action)
    ) {
      schema = Schemas[type][action];
    } else {
      const invalidPayloadError = `Malformed payload. Available options for "action" are: ${Object.values(
        itemActions
      )} and available options for "type" are: ${Object.values(itemTypes)}`;
      return res.status(422).json({ error: invalidPayloadError });
    }

    if (schema) {
      // Validate req.body using the schema and validation options
      return Joi.validate(req.body, schema, validationOptions, (err, data) => {
        if (err) {
          // Joi Error
          const JoiError = {
            status: "failed",
            error: {
              original: err._object,

              // fetch only message and type from each error
              details: err.details.map(({ message, type }) => ({
                message: message.replace(/['"]/g, ""),
                type,
              })),
            },
          };

          // Custom Error
          const CustomError = {
            status: "failed",
            error: "Invalid request data. Please review request and try again.",
          };

          // Send back the JSON error response
          return res.status(422).json(useJoiError ? JoiError : CustomError);
        } else {
          // Request is valid; continue further on.
          next();
        }
      });
    } else if (action && type) {
      // There shouldn't be actions without validation
      const notAllowedError = `Cannot apply operation ${action} to type ${type}`;
      return res.status(422).json(notAllowedError);
    }
    next();
  };
};
