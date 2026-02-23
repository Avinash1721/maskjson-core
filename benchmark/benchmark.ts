import { redact } from '../src';

const iterations = 10000;
const largeObject = {
    id: '123',
    user: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'super-secret-password',
        meta: {
            lastLogin: new Date().toISOString(),
            permissions: ['read', 'write', 'admin'],
            settings: {
                theme: 'dark',
                notifications: true,
            }
        }
    },
    data: [
        { id: 1, token: 'abc-123' },
        { id: 2, token: 'def-456' },
    ]
};

console.log('--- Benchmarking @maskjson/core ---');

// Warmup
for (let i = 0; i < 1000; i++) {
    redact(largeObject, { autoDetect: true });
}

console.log(`Running ${iterations} iterations...`);

// @maskjson/core benchmark (Path-based)
const startMask = performance.now();
for (let i = 0; i < iterations; i++) {
    redact(largeObject, { paths: ['user.password', 'data.*.token'] });
}
const endMask = performance.now();
const maskTime = endMask - startMask;

// Naive Clone + Manual Redact (comparable operation)
const startNaive = performance.now();
for (let i = 0; i < iterations; i++) {
    const clone = JSON.parse(JSON.stringify(largeObject));
    clone.user.password = '********';
    if (Array.isArray(clone.data)) {
        for (const item of clone.data) {
            item.token = '********';
        }
    }
}
const endNaive = performance.now();
const naiveTime = endNaive - startNaive;

console.log(`@maskjson/core (path-based): ${maskTime.toFixed(2)}ms`);
console.log(`JSON.parse/stringify (naive manual): ${naiveTime.toFixed(2)}ms`);
console.log(`Ratio: ${(naiveTime / maskTime).toFixed(2)}x`);

if (maskTime < naiveTime) {
    console.log('\nResult: @maskjson/core is FASTER than naive cloning for these paths! 🚀');
} else {
    console.log('\nResult: Naive cloning is faster for this specific payload/operation.');
}
