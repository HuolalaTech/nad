/**
 * Detects a non-null object.
 */
export const isNonNullObject = <T>(u: T): u is T & Record<PropertyKey, unknown> => u !== null && typeof u === 'object';

/**
 * Detects whether an http method supports tacking payload.
 */
export const isSupportingPayload = (method: string) => /^(?:POST|PUT|PATCH)$/i.test(method);
