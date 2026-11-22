import { ConflictException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { mapPostgresException } from './postgres-exception.mapper.js';

describe('mapPostgresException', () => {
  it('should map unique constraint violation to ConflictException', () => {
    const exception = {
      sqlState: '23505',
    };

    const result = mapPostgresException(exception);

    expect(result).toBeInstanceOf(ConflictException);
    expect(result?.getStatus()).toBe(409);
    expect(result?.message).toBe('Resource already exists');
  });

  it('should map foreign key violation to ConflictException', () => {
    const exception = {
      sqlState: '23503',
    };

    const result = mapPostgresException(exception);

    expect(result).toBeInstanceOf(ConflictException);
    expect(result?.getStatus()).toBe(409);
    expect(result?.message).toBe('Related resource constraint violation');
  });

  it('should return null for unknown SQLSTATE', () => {
    const exception = {
      sqlState: '42P01',
    };

    expect(mapPostgresException(exception)).toBeNull();
  });

  it('should return null for an object without sqlState', () => {
    expect(mapPostgresException({ message: 'Some error' })).toBeNull();
  });

  it('should return null for non-object exceptions', () => {
    expect(mapPostgresException('database error')).toBeNull();
    expect(mapPostgresException(null)).toBeNull();
    expect(mapPostgresException(undefined)).toBeNull();
  });
});
