import { isMultipartFormData, isWwwFormUrlEncoded } from '@huolala-tech/request';

/**
 * Detects a form (WWW_FORM_URLENCODED or MULTIPART_FORM_DATA)
 */
export const isForm = (mediaType: string | null) =>
  !mediaType || isMultipartFormData(mediaType) || isWwwFormUrlEncoded(mediaType);

/**
 * Detects a non-null object.
 */
export const isNonNullObject = <T>(u: T): u is T & Record<PropertyKey, unknown> => u !== null && typeof u === 'object';

/**
 * Detects whether an http method supports tacking payload.
 */
export const isSupportingPayload = (method: string) => /^(?:POST|PUT|PATCH)$/i.test(method);
