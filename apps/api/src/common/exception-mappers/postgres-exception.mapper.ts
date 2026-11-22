import { ConflictException } from '@nestjs/common';

function getSqlState(exception: unknown): string | undefined {
  if (typeof exception !== 'object' || exception === null) {
    return undefined;
  }

  if (!('sqlState' in exception)) {
    return undefined;
  }

  return typeof exception.sqlState === 'string'
    ? exception.sqlState
    : undefined;
}

export function mapPostgresException(
  exception: unknown,
): ConflictException | null {
  const sqlState = getSqlState(exception);

  switch (sqlState) {
    case '23505':
      return new ConflictException('Resource already exists');

    case '23503':
      return new ConflictException('Related resource constraint violation');

    default:
      return null;
  }
}
