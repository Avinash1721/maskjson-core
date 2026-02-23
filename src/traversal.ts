import { isObject, isArray } from './utils';

export interface TraversalNode {
    value: any;
    path: string;
    parent: any;
    key: string | number;
}

/**
 * Iterative traversal to prevent stack overflow on deep objects.
 * Yields each node in the object tree.
 */
export function* iterateObject(obj: any): Generator<TraversalNode> {
    const stack: TraversalNode[] = [{ value: obj, path: '', parent: null, key: '' }];
    const seen = new WeakSet();

    while (stack.length > 0) {
        const node = stack.pop()!;
        const { value, path } = node;

        if (value && typeof value === 'object') {
            if (seen.has(value)) continue;
            seen.add(value);

            if (isArray(value)) {
                for (let i = value.length - 1; i >= 0; i--) {
                    const nextPath = path ? `${path}.${i}` : `${i}`;
                    stack.push({ value: value[i], path: nextPath, parent: value, key: i });
                }
            } else if (isObject(value)) {
                for (const key in value) {
                    if (Object.prototype.hasOwnProperty.call(value, key)) {
                        const nextPath = path ? `${path}.${key}` : key;
                        stack.push({ value: value[key], path: nextPath, parent: value, key });
                    }
                }
            }
        }

        yield node;
    }
}
