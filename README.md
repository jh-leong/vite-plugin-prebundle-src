# vite-plugin-prebundle-src

[![npm version][npm-version-src]][npm-version-href] [![bundle][bundle-src]][bundle-href] [![JSDocs][jsdocs-src]][jsdocs-href] [![License][license-src]][license-href]

Pre-bundle source files from your Vite app, just like [Dependency Pre-Bundling](https://vitejs.dev/guide/dep-pre-bundling.html#the-why).

## Why

### Performance

Bundle local entry files with many internal modules into a single file to enhance subsequent page loading performance.

### Browser Cache

Pre-bundled source code requests are strongly cached w/ HTTP headers `max-age=31536000, immutable` to improve page reload performance during dev. Once cached, these requests will never hit the dev server again.

## Usage

### Patch Vite

The plugin functionality relies on Vite's internal function `getDepsOptimizer`, so you need to patch and export this function yourself. Reference: [vite@5.0.11.patch](./playground/patches/vite@5.0.11.patch)

Tools for patching:

- pnpm: Use [`pnpm patch`](https://pnpm.io/cli/patch)
- Non-pnpm: Use [`patch-package`](https://github.com/ds300/patch-package)

### Setup

> Example project: [playground](./playground)

Install `vite-plugin-prebundle-src`:

```bash
npm i -D vite-plugin-prebundle-src
```

Use the Vite plugin:

```ts
// vite.config.js
import { defineConfig, getDepsOptimizer } from 'vite';
import prebundleSrc from 'vite-plugin-prebundle-src';

export default defineConfig({
  plugins: [
    prebundleSrc(
      // retrieve from your patched version of Vite
      getDepsOptimizer,
      {
        files: ['src/utils/**/*.ts'],
        ignore: ['src/utils/bar/a.ts'],
      }
      // or use multiple options
      // [
      //   {
      //     files: ['src/utils/foo/**/*.ts'],
      //   },
      //   {
      //     files: ['src/utils/bar/**/*.ts'],
      //     ignore: ['src/utils/bar/a.ts'],
      //   },
      // ]
    ),
  ],
});
```

The files can be direct file names or glob patterns using [fast-glob](https://github.com/mrmlnc/fast-glob).

### Which source files can be pre-bundled?

Infrequently changing source code files, such as utility functions, constants, configurations, etc.

### How to update pre-bundled source files?

1. When the Vite dev server starts, it automatically listens to the specified source files. When changes occur, it automatically rebuilds source files.

2. Restart the Vite dev server with the `--force` option to rebuild source files.

## License

[MIT](./LICENSE) License © 2024-PRESENT [Tycho](https://github.com/jh-leong)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/vite-plugin-prebundle-src?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/vite-plugin-prebundle-src
[npm-downloads-src]: https://img.shields.io/npm/dm/vite-plugin-prebundle-src?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/vite-plugin-prebundle-src
[bundle-src]: https://img.shields.io/bundlephobia/minzip/vite-plugin-prebundle-src?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=vite-plugin-prebundle-src
[license-src]: https://img.shields.io/github/license/jh-leong/vite-plugin-prebundle-src.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/jh-leong/vite-plugin-prebundle-src/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/vite-plugin-prebundle-src
