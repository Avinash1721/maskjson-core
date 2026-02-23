# @maskjson/core

**Fast, zero-dependency, TypeScript-first JSON redaction and masking engine.**

[![Package Size](https://img.shields.io/bundlephobia/minzip/@maskjson/core?color=blue&label=bundle%20size)](https://bundlephobia.com/package/@maskjson/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

MaskJSON is a high-performance library designed to safely redact sensitive information (PII, credentials, secrets) from JSON objects and strings. It works seamlessly in Node.js and Browser environments.

---

## 🚀 Features

- ⚡ **Blazing Fast**: Faster than naive `JSON.parse(JSON.stringify())` approaches.
- 📦 **Zero Dependencies**: Lightweight and tree-shakeable.
- 🛡️ **TypeScript First**: Full type safety and generic preservation.
- 🔗 **Circular Reference Safe**: Handles circular objects without crashing.
- 🔄 **Iterative Traversal**: Prevent stack overflow errors on deeply nested objects.
- 🔍 **Smart Auto-Detection**: Automatically mask common sensitive fields (passwords, tokens, etc.).
- 🎯 **Wildcards & Regex**: Support for dot-notation with wildcards (`users.*.email`) and Regex key matching.

---

## 📦 Installation

```bash
npm install @maskjson/core
# or
yarn add @maskjson/core
```

---

## 📖 Quick Start

```typescript
import { redact } from '@maskjson/core';

const data = {
  user: {
    id: 'user-123',
    email: 'john@example.com',
    password: 'super-secret-password',
  },
  apiKey: 'sk_live_51P...',
};

// 1. Basic Auto-Detection
const masked = redact(data, { autoDetect: true });
/*
{
  user: {
    id: 'user-123',
    email: '********',
    password: '********',
  },
  apiKey: '********'
}
*/

// 2. Path-Based Redaction
const pathMasked = redact(data, {
  paths: ['user.email', 'apiKey']
});

// 3. Regex Matching
const regexMasked = redact(data, {
  matchKeys: [/password/i, /Key$/]
});
```

---

## 🔧 API Reference

### `redact<T>(input: T, options?: RedactOptions): T`
The main function for redacting data. Returns a redacted clone of the input (immutable by default).

### `redactJsonString(jsonString: string, options?: RedactOptions): string`
Safely parses, redacts, and re-stringifies a JSON string.

### `RedactOptions`

| Option | Type | Description |
| :--- | :--- | :--- |
| `paths` | `string[]` | Dot-notation paths (e.g., `users.*.password`). |
| `matchKeys` | `(string \| RegExp)[]` | Keys to match anywhere in the object. |
| `autoDetect` | `boolean` | Enable smart detection for sensitive keys. |
| `mode` | `'mask' \| 'remove'` | `'mask'` (default) or `'remove'` the key completely. |
| `maskValue` | `string` | The value used for masking. Defaults to `'********'`. |
| `mutate` | `boolean` | If `true`, modifies the input object directly. |
| `preserveTypes` | `boolean` | Preserves original types (e.g., masking number to `0`). |

---

## ✨ Presets

We provide built-in presets for common sensitive data:

- `DEFAULT_MASK`: `'********'`
- `EMAIL_MASK`: Keeps the user's first letter and the domain (e.g., `j***@example.com`).
- `CREDIT_CARD_MASK`: Keeps only the last 4 digits.

---

## ⚡ Performance

MaskJSON uses an iterative traversal strategy and minimal allocations. It avoids the overhead of recursive calls and standard cloning techniques.

| Approach | Performance | Circular Safe |
| :--- | :--- | :--- |
| **MaskJSON** | **High** | ✅ Yes |
| `JSON.parse(JSON.stringify())` | Low | ❌ No |
| Recursive Traversal | Medium | ❌ No (Stack Overflow) |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT © [MaskJSON](https://maskjson.com)
