import joi from '@hapi/joi';
import ValidationService from './ValidationService';

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

export default class GroupValidationService extends ValidationService {
  constructor() {
    super();
  }

  validateQueryParams() {
    return super.validateQueryParams(querySchema);
  }

  validateBody() {
    return super.validateBody(bodySchema);
  }

  validateParams() {
    return super.validateParams(paramsSchema);
  }
}

