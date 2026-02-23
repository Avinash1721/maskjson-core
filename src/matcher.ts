/**
 * Checks if a path matches a pattern (supporting wildcards).
 * Example: 'users.0.password' matches 'users.*.password'
 */
export function isPathMatch(path: string, pattern: string): boolean {
    if (path === pattern) return true;
    if (!pattern.includes('*')) return path === pattern;

    const pathParts = path.split('.');
    const patternParts = pattern.split('.');

    if (pathParts.length !== patternParts.length) return false;

    for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i] === '*') continue;
        if (patternParts[i] !== pathParts[i]) return false;
    }

    return true;
}

/**
 * Checks if a key matches any of the matchKeys (string or RegExp).
 */
export function isKeyMatch(key: string, matchKeys: (string | RegExp)[]): boolean {
    for (const matcher of matchKeys) {
        if (typeof matcher === 'string') {
            if (key === matcher) return true;
        } else if (matcher instanceof RegExp) {
            if (matcher.test(key)) return true;
        }
    }
    return false;
}
