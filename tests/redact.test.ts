import { describe, it, expect } from 'vitest';
import { redact, redactJsonString } from '../src';

describe('redact', () => {
    it('should perform basic masking', () => {
        const input = { password: 'secret123', name: 'John' };
        const result = redact(input, { paths: ['password'] });
        expect(result.password).toBe('********');
        expect(result.name).toBe('John');
    });

    it('should handle deep nesting', () => {
        const input = { user: { profile: { email: 'test@example.com' } } };
        const result = redact(input, { paths: ['user.profile.email'] });
        expect(result.user.profile.email).toBe('********');
    });

    it('should support wildcards', () => {
        const input = {
            users: [
                { id: 1, ssn: '123-456' },
                { id: 2, ssn: '789-012' }
            ]
        };
        const result = redact(input, { paths: ['users.*.ssn'] });
        expect(result.users[0].ssn).toBe('********');
        expect(result.users[1].ssn).toBe('********');
    });

    it('should match keys by Regex', () => {
        const input = { apiKey: 'key123', access_token: 'token456' };
        const result = redact(input, { matchKeys: [/key/i, 'access_token'] });
        expect(result.apiKey).toBe('********');
        expect(result.access_token).toBe('********');
    });

    it('should auto-detect sensitive fields', () => {
        const input = { password: '123', email: 'a@b.com', public: 'yes' };
        const result = redact(input, { autoDetect: true });
        expect(result.password).toBe('********');
        expect(result.email).toBe('********');
        expect(result.public).toBe('yes');
    });

    it('should support remove mode', () => {
        const input = { secret: 'data', name: 'John' };
        const result = redact(input, { paths: ['secret'], mode: 'remove' });
        expect(result.secret).toBeUndefined();
        expect(Object.keys(result)).not.toContain('secret');
    });

    it('should mutate if requested', () => {
        const input = { secret: 'data' };
        const result = redact(input, { paths: ['secret'], mutate: true });
        expect(result).toBe(input);
        expect(input.secret).toBe('********');
    });

    it('should handle circular objects', () => {
        const input: any = { a: 1 };
        input.self = input;
        const result = redact(input, { paths: ['a'] });
        expect(result.a).toBe('********');
        expect(result.self).toBe(result);
    });

    it('should redact JSON strings', () => {
        const json = JSON.stringify({ password: '123', name: 'John' });
        const result = redactJsonString(json, { autoDetect: true });
        const parsed = JSON.parse(result);
        expect(parsed.password).toBe('********');
        expect(parsed.name).toBe('John');
    });

    it('should preserve types if requested', () => {
        const input = { age: 30, active: true, tags: ['a'], meta: { x: 1 } };
        const result = redact(input, {
            paths: ['age', 'active', 'tags', 'meta'],
            preserveTypes: true
        });
        expect(result.age).toBe(0);
        expect(result.active).toBe(false);
        expect(result.tags).toEqual([]);
        expect(result.meta).toEqual({});
    });
});
