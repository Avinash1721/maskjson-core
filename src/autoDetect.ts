export const SENSITIVE_KEYS = [
    'password',
    'token',
    'access_token',
    'refresh_token',
    'secret',
    'apiKey',
    'jwt',
    'ssn',
    'creditCard',
    'email',
];

const SENSITIVE_REGEX = new RegExp(
    `^(${SENSITIVE_KEYS.join('|')})$`,
    'i'
);

/**
 * Checks if a key is likely sensitive based on common naming conventions.
 */
export function isSensitiveKey(key: string): boolean {
    return SENSITIVE_REGEX.test(key);
}
