import axios, { AxiosError, AxiosInstance } from "axios";


const API_URL: string = import.meta.env.VITE_API_URL

export function Api(): AxiosInstance {
  return axios.create({
    baseURL: API_URL
  })
}

export enum ApiErrorType {
  ERROR = 'Error',
  WARNING = 'Warning'
}

export class ApiError extends Error {
  type: ApiErrorType

  constructor (message: string, type: ApiErrorType) {
    super(message)
    this.type = type;
  }
}

export const HttpStatus = {
  OK: 200,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
}

export function apiError(e: any) {
  const statusCode = e.response?.status;
    
  if ((e instanceof AxiosError) && (
      HttpStatus.BAD_REQUEST == statusCode || 
      HttpStatus.UNPROCESSABLE_ENTITY == statusCode)
  ) {
    throw new ApiError(e.response?.data.message, ApiErrorType.WARNING)
  }

  if ((e instanceof AxiosError) && (
      HttpStatus.NOT_FOUND == statusCode || 
      HttpStatus.FORBIDDEN == statusCode)
  ) {
    throw new ApiError(e.response?.data.message, ApiErrorType.ERROR)
  }
  
  throw new ApiError('Houve um erro ao realizar sua solicitação.', ApiErrorType.ERROR)
} 
