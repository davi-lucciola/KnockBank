export const API_LOCAL_URL = "http://127.0.0.1:5000";
export const API_SERVER_URL = "http://api:5000";

export const HttpStatus = {
  Ok: 200,
  Created: 201,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
};

export class ApiError extends Error {
  detail?: object;

  constructor(message: string, detail?: object) {
    super(message);
    this.detail = detail;
  }
}
