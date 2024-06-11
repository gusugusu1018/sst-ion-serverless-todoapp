import middy from '@middy/core';
import { MiddlewareObj } from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ZodError, ZodSchema } from 'zod';

class ZodValidationError extends Error {
  public statusCode: number;
  public details: ZodError;

  constructor(message: string, details: ZodError) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400; // 400 Bad Request
    this.details = details;
  }
}

const zodValidationMiddleware = <T>(
  schema: ZodSchema<T>,
): MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const before: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
  > = async (request) => {
    try {
      const body = request.event.body;
      schema.parse(body);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        throw new ZodValidationError('Invalid request', error);
      } else {
        throw error;
      }
    }
  };

  return {
    before,
  };
};

export default zodValidationMiddleware;
