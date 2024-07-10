export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const HttpStatus = {
  Ok: 200,
  Created: 201,
  NoContent: 204,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  InternalServerError: 500,
};

export type ApiResponse = {
  message: string;
  detail?: object;
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

export class Api {
  private accessToken?: string;

  constructor(accessToken: string | undefined = undefined) {
    this.accessToken = accessToken;
  }

  public async get<R>(url: string, params?: URLSearchParams): Promise<R> {
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

  public async post<R, B = any>(url: string, body: B): Promise<R> {
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

  public async put<R, B = any>(url: string, body: B): Promise<R> {
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

  public async delete<R, B = any>(url: string, body?: B): Promise<R> {
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

  private handleError(response: Response, data?: any) {
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
