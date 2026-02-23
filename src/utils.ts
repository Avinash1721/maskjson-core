export const isObject = (val: unknown): val is Record<string, any> =>
    val !== null && typeof val === 'object' && !Array.isArray(val);

export const isArray = Array.isArray;

/**
 * Iterative deep clone for plain objects and arrays.
 * Handles circular references and prevents stack overflow.
 */
export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;

    const seen = new WeakMap();
    const result = isArray(obj) ? [] : {};
    seen.set(obj as object, result);

    const stack: { source: any; target: any }[] = [{ source: obj, target: result }];

    while (stack.length > 0) {
        const { source, target } = stack.pop()!;

        if (isArray(source)) {
            for (let i = 0; i < source.length; i++) {
                const value = source[i];
                if (value && typeof value === 'object') {
                    if (seen.has(value)) {
                        target[i] = seen.get(value);
                    } else {
                        const copy = isArray(value) ? [] : {};
                        seen.set(value, copy);
                        target[i] = copy;
                        stack.push({ source: value, target: copy });
                    }
                } else {
                    target[i] = value;
                }
            }
        } else {
            for (const key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    const value = source[key];
                    if (value && typeof value === 'object') {
                        if (seen.has(value)) {
                            target[key] = seen.get(value);
                        } else {
                            const copy = isArray(value) ? [] : {};
                            seen.set(value, copy);
                            target[key] = copy;
                            stack.push({ source: value, target: copy });
                        }
                    } else {
                        target[key] = value;
                    }
                }
            }
        }
    }

    return result as T;
}
