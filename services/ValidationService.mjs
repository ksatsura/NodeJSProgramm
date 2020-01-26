import exprssJoiValidation from 'express-joi-validation';
import joi from '@hapi/joi';

const bodySchema = joi.object({
  login: joi.string().required(),
  password: joi.string().alphanum().required(),
  age: joi.number().integer().min(4).max(130).required()
});

const paramsSchema = joi.object({
  id: joi.string().required()
});

const querySchema = joi.object({
  loginSubstr: joi.required(),
  limit: joi.required()
});

export default class ValidationService {
  constructor() {
    this.validator = exprssJoiValidation.createValidator({});
  }

  validateQueryParams() {
    return this.validator.query(querySchema);
  }

  validateBody() {
    return this.validator.body(bodySchema);
  }

  validateParams() {
    return this.validator.params(paramsSchema);
  }
}

