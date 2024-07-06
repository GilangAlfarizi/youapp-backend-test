import { Response } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';

interface IResponseBody<T = any> {
  status: number;
  message: string;
  data?: T;
}

export const errorResponse = (error) => {
  if (error.response) {
    throw new CustomError(
      error.status,
      error.response.message,
      error.response.data,
    );
  }

  throw new CustomError(500, error.message);
};

export class CustomError extends HttpException {
  constructor(status: number, message: string, data?: Record<string, any>) {
    const validStatus = status || HttpStatus.INTERNAL_SERVER_ERROR;

    super(
      {
        message,
        data: data || undefined,
        statusCode: validStatus,
      },
      validStatus as number,
    );
  }
}

export class BadRequest extends CustomError {
  constructor(message: string, errorData?: Record<string, any>) {
    super(400, message, errorData);
  }
}

export class Unauthorized extends CustomError {
  constructor(message: string, errorData?: Record<string, any>) {
    super(401, message, errorData);
  }
}

export class Forbidden extends CustomError {
  constructor(message: string, errorData?: Record<string, any>) {
    super(401, message, errorData);
  }
}
export class NotFound extends CustomError {
  constructor(message: string, errorData?: Record<string, any>) {
    super(404, message, errorData);
  }
}

export class ResponseBody implements IResponseBody {
  status = 200;
  message: string;
  data: any;

  constructor(message: string, data?: any) {
    this.message = message;
    this.data = data;
  }
}

export class Success extends ResponseBody {
  status = 200;

  constructor(message: string, data?: any) {
    super(message, data);
  }
}

export class Created extends ResponseBody {
  status = 201;

  constructor(message: string, data?: any) {
    super(message, data);
  }
}

export const sendResponse = async (res: Response, data: IResponseBody) => {
  res.status(data.status).json({
    status: data.status,
    message: data.message,
    data: data.data ?? undefined,
  });
};
