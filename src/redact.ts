import { RedactOptions, Redactable } from './types';
import { isObject, isArray, deepClone } from './utils';
import { isPathMatch, isKeyMatch } from './matcher';
import { iterateObject } from './traversal';
import { isSensitiveKey } from './autoDetect';
import { PRESETS } from './presets';

/**
 * Redacts sensitive information from an object or array.
 * @param input The object or array to redact
 * @param options Redaction options
 * @returns The redacted object or array
 */
export function redact<T>(input: T, options: RedactOptions = {}): T {
    if (input === null || typeof input !== 'object') {
        return input;
    }

    const {
        paths = [],
        matchKeys = [],
        autoDetect = false,
        mode = 'mask',
        maskValue = PRESETS.DEFAULT_MASK,
        replacer,
        mutate = false,
        preserveTypes = false,
    } = options;

    // Clone if not mutating
    let result = mutate ? input : deepClone(input);

    const nodes = iterateObject(result);

    for (const node of nodes) {
        const { value, path, parent, key } = node;

        // Skip root node
        if (parent === null) continue;

        let shouldRedact = false;

        // 1. Path-based redaction
        if (paths.length > 0) {
            if (paths.some((p) => isPathMatch(path, p))) {
                shouldRedact = true;
            }
        }

        // 2. Key-based redaction (Regex + String)
        if (!shouldRedact && matchKeys.length > 0 && typeof key === 'string') {
            if (isKeyMatch(key, matchKeys)) {
                shouldRedact = true;
            }
        }

        // 3. Auto-detection
        if (!shouldRedact && autoDetect && typeof key === 'string') {
            if (isSensitiveKey(key)) {
                shouldRedact = true;
            }
        }

        if (shouldRedact) {
            if (mode === 'remove') {
                if (isArray(parent)) {
                    (parent as any)[key] = undefined;
                } else {
                    delete (parent as any)[key];
                }
            } else {
                // Mask mode
                let newValue: any = maskValue;

                if (replacer) {
                    newValue = replacer(value, path);
                } else if (preserveTypes) {
                    if (typeof value === 'number') newValue = 0;
                    else if (typeof value === 'boolean') newValue = false;
                    else if (isArray(value)) newValue = [];
                    else if (isObject(value)) newValue = {};
                }

                (parent as any)[key] = newValue;
            }
        }
    }

    // Cleanup undefined if it was an array (optional, but cleaner)
    // However, the iterative traversal might have already skipped them.

    return result;
}

/**
 * Redacts a JSON string.
 * @param jsonString The JSON string to redact
 * @param options Redaction options
 * @returns The redacted JSON string
 */
export function redactJsonString(
    jsonString: string,
    options: RedactOptions = {}
): string {
    try {
        const parsed = JSON.parse(jsonString);
        const redacted = redact(parsed, options);
        return JSON.stringify(redacted);
    } catch (e) {
        // If invalid JSON, return as is or handle error
        return jsonString;
    }
}
