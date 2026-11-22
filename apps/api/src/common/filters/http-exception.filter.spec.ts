import { BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HttpExceptionFilter } from './http-exception.filter.js';

describe('HttpExceptionFilter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function createHttpContext() {
    const response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const request = {
      url: '/test',
    };

    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    };

    return {
      host,
      response,
    };
  }

  it('should preserve HttpException response', () => {
    const filter = new HttpExceptionFilter();
    const { host, response } = createHttpContext();

    filter.catch(new BadRequestException('Invalid input'), host as never);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Invalid input',
        error: 'Bad Request',
        path: '/test',
      }),
    );
  });

  it('should preserve validation error messages as an array', () => {
    const filter = new HttpExceptionFilter();
    const { host, response } = createHttpContext();

    const exception = new BadRequestException({
      message: ['email must be an email'],
      error: 'Bad Request',
      statusCode: 400,
    });

    filter.catch(exception, host as never);

    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: ['email must be an email'],
        error: 'Bad Request',
      }),
    );
  });

  it('should map PostgreSQL unique constraint violation to 409', () => {
    const filter = new HttpExceptionFilter();
    const { host, response } = createHttpContext();

    const exception = {
      sqlState: '23505',
    };

    filter.catch(exception, host as never);

    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        message: 'Resource already exists',
        error: 'Conflict',
      }),
    );
  });

  it('should return a generic 500 response for unknown errors', () => {
    const filter = new HttpExceptionFilter();
    const { host, response } = createHttpContext();

    vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    filter.catch(new Error('Sensitive internal error'), host as never);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
        path: '/test',
      }),
    );

    const responseBody = response.json.mock.calls[0][0];

    expect(JSON.stringify(responseBody)).not.toContain(
      'Sensitive internal error',
    );
  });

  it('should log unknown internal errors', () => {
    const filter = new HttpExceptionFilter();
    const { host } = createHttpContext();

    const loggerSpy = vi
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);

    const exception = new Error('Sensitive internal error');

    filter.catch(exception, host as never);

    expect(loggerSpy).toHaveBeenCalledWith(exception.stack);
  });
});
