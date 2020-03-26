import joi from '@hapi/joi';
import ValidationService from './ValidationService';

const bodySchema = joi.object({
  name: joi.string().required(),
  permissions: joi.array()
});

const paramsSchema = joi.object({
  id: joi.string().required()
});

const querySchema = joi.object({
  userId: joi.required()
});

export default class GroupValidationService extends ValidationService {
  constructor() {
    super();
  }

  validateBody() {
    return super.validateBody(bodySchema);
  }

  validateParams() {
    return super.validateParams(paramsSchema);
  }

  validateQueryParams() {
    return super.validateQueryParams(querySchema);
  }
}

