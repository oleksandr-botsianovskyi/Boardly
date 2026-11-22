import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { mapPostgresException } from '../exception-mappers/postgres-exception.mapper.js';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const mappedException =
      exception instanceof HttpException
        ? exception
        : mapPostgresException(exception);

    const status = mappedException
      ? mappedException.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (mappedException) {
      const body = mappedException.getResponse();

      if (typeof body === 'string') {
        message = body;
      } else {
        const responseBody = body as Record<string, unknown>;

        if (
          typeof responseBody.message === 'string' ||
          Array.isArray(responseBody.message)
        ) {
          message = responseBody.message as string | string[];
        }

        if (typeof responseBody.error === 'string') {
          error = responseBody.error;
        }
      }
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
