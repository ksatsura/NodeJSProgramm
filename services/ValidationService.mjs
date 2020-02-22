import exprssJoiValidation from 'express-joi-validation';

export default class ValidationService {
  constructor() {
    this.validator = exprssJoiValidation.createValidator({});
  }

  validateQueryParams(querySchema) {
    return this.validator.query(querySchema);
  }

  validateBody(bodySchema) {
    return this.validator.body(bodySchema);
  }

  validateParams(paramsSchema) {
    return this.validator.params(paramsSchema);
  }
}
