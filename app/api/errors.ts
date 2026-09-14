export class AppError extends Error {
  public statusCode?: number
  public code?: string
  public data?: unknown

  constructor(message: string, statusCode?: number, code?: string, data?: unknown) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
    this.data = data
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network error occurred') {
    super(message, 0, 'NETWORK_ERROR')
    this.name = 'NetworkError'
  }
}

export class AuthError extends AppError {
  constructor(message = 'Authentication failed', statusCode = 401) {
    super(message, statusCode, 'AUTH_ERROR')
    this.name = 'AuthError'
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', data?: unknown) {
    super(message, 422, 'VALIDATION_ERROR', data)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}
