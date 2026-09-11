import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';

/**
 * Validates req[source] against a Zod schema before the request reaches business logic,
 * and replaces req[source] with the parsed (and coerced/defaulted) value.
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      req[source] = schema.parse(req[source]);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        }));
        return next(ApiError.badRequest('Validation failed', details));
      }
      next(err);
    }
  };
}
