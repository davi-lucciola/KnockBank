export const HttpStatus = {
  Ok: 200,
  Created: 201,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  InternalServerError: 500,
};

export class ApiError extends Error {
  detail?: object;

  constructor(message: string, detail?: object) {
    super(message);
    this.detail = detail;
  }
}

export class ApiBadRequestError extends ApiError {}
export class ApiUnauthorizedError extends ApiError {}
export class ApiForbiddenError extends ApiError {}
export class ApiInternalServerError extends ApiError {}
