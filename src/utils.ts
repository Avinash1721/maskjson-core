export const isObject = (val: unknown): val is Record<string, any> =>
    val !== null && typeof val === 'object' && !Array.isArray(val);

export const isArray = Array.isArray;

/**
 * Fast deep clone for plain objects and arrays.
 * Handles circular references.
 */
export function deepClone<T>(obj: T, seen = new WeakMap()): T {
    if (obj === null || typeof obj !== 'object') return obj;

    if (seen.has(obj as object)) return seen.get(obj as object);

    if (isArray(obj)) {
        const copy: any[] = [];
        seen.set(obj, copy);
        for (let i = 0; i < obj.length; i++) {
            copy[i] = deepClone(obj[i], seen);
        }
        return copy as T;
    }

    if (isObject(obj)) {
        const copy: Record<string, any> = {};
        seen.set(obj, copy);
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                copy[key] = deepClone(obj[key], seen);
            }
        }
        return copy as T;
    }

    return obj;
}
