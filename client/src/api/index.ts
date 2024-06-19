import {
  HttpStatus,
  ApiError,
  ApiBadRequestError,
  ApiUnauthorizedError,
  ApiForbiddenError,
  ApiInternalServerError,
} from "@/api/errors";

export const API_LOCAL_URL = "http://127.0.0.1:5000";
export const API_SERVER_URL = "http://api:5000";

export type ApiResponse = {
  message: string;
  detail?: object;
};

export class Api {
  async get<R>(url: string, params?: URLSearchParams): Promise<R> {
    url = !params ? url : `${url}?${params?.toString()}`;

    const response = await fetch(url, { method: "GET" });
    const data = await response.json();

    this.handleError(response, data);
    return data;
  }

  async post<R, B>(url: string, body: B): Promise<R> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    this.handleError(response, data);
    return data;
  }

  async put<R, B>(url: string, body: B): Promise<R> {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    this.handleError(response, data);
    return data;
  }

  async delete<R, B>(url: string, body?: B): Promise<R> {
    let requestConfig = {};
    if (body) {
      requestConfig = {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      };
    }

    const response = await fetch(url, {
      method: "DELETE",
      ...requestConfig,
    });
    const data = await response.json();

    this.handleError(response, data);
    return data;
  }

  handleError(response: Response, data?: any) {
    if (!response.ok) {
      switch (response.status) {
        case HttpStatus.BadRequest:
          throw new ApiBadRequestError(data?.message, data?.detail);
        case HttpStatus.Unauthorized:
          throw new ApiUnauthorizedError(data?.message, data?.detail);
        case HttpStatus.Forbidden:
          throw new ApiForbiddenError(data?.message, data?.detail);
        case HttpStatus.InternalServerError:
          throw new ApiInternalServerError(data?.message, data?.detail);
        default:
          throw new ApiError("Ocorreu um erro inesperado.", undefined);
      }
    }
  }
}
