import {
  HttpStatus,
  ApiError,
  ApiBadRequestError,
  ApiUnauthorizedError,
  ApiForbiddenError,
  ApiInternalServerError,
} from "@/api/errors";

export const API_URL = "http://127.0.0.1:5000";

export type ApiResponse = {
  message: string;
  detail?: object;
};

export class Api {
  private accessToken?: string;

  constructor(accessToken: string | undefined = undefined) {
    this.accessToken = accessToken;
  }

  async get<R>(url: string, params?: URLSearchParams): Promise<R> {
    url = !params ? url : `${url}?${params?.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...(this.accessToken && {
          Authorization: `Bearer ${this.accessToken}`,
        }),
      },
    });
    const data = await response.json();

    this.handleError(response, data);
    return data;
  }

  async post<R, B>(url: string, body: B): Promise<R> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.accessToken && {
          Authorization: `Bearer ${this.accessToken}`,
        }),
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
        ...(this.accessToken && {
          Authorization: `Bearer ${this.accessToken}`,
        }),
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    this.handleError(response, data);
    return data;
  }

  async delete<R, B>(url: string, body?: B): Promise<R> {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        ...(body && {
          "Content-Type": "application/json",
        }),
        ...(this.accessToken && {
          Authorization: `Bearer ${this.accessToken}`,
        }),
      },
      ...(body && { body: JSON.stringify(body) }),
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
