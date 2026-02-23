export interface RedactOptions {
    /**
     * List of dot-notation paths to redact.
     * Supports wildcards: 'users.*.password'
     */
    paths?: string[];

    /**
     * List of keys (string or RegExp) to match for redaction anywhere in the object.
     */
    matchKeys?: (string | RegExp)[];

    /**
     * If true, automatically detects sensitive fields like 'password', 'token', etc.
     */
    autoDetect?: boolean;

    /**
     * Redaction mode:
     * - 'mask': Replaces the value with `maskValue` (default)
     * - 'remove': Removes the key from the object
     */
    mode?: 'mask' | 'remove';

    /**
     * The value used for masking. Defaults to '********'
     */
    maskValue?: string;

    /**
     * Custom replacer function for granular control.
     * @param value The original value
     * @param path The dot-notation path to the value
     * @returns The redacted value
     */
    replacer?: (value: unknown, path: string) => unknown;

    /**
     * If true, mutates the input object. Defaults to false (immutable).
     */
    mutate?: boolean;

    /**
     * If true, tries to preserve the original types of redacted values (e.g. masking a number with 0).
     * Defaults to false (always uses maskValue).
     */
    preserveTypes?: boolean;
}

export type Redactable = Record<string, any> | any[];
