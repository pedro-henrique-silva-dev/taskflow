export const PG_UNIQUE_VIOLATION = '23505';

export function isUniqueViolation(error) {
  return error?.code === PG_UNIQUE_VIOLATION;
}
