import path from 'node:path';
import fastGlob from 'fast-glob';
import createDebug from 'debug';
import { normalizePath, type Plugin, type ResolvedConfig } from 'vite';
import { Helper, Options } from './types';

const { globSync } = fastGlob;

const NAME = 'vite-plugin-prebundle-src';
const debug = createDebug(NAME);

export * from './types';

export default function prebundleSrc(
  getDepsOptimizer: Helper,
  options: Options | Options[]
): Plugin {
  let config: ResolvedConfig;

  const { files, ignore } = normalizeOptions(options);
  const deps = mapFiles(files, ignore);
  const depsSet = new Set(deps);
  const depsToOriginal: Map<string, string> = deps.reduce((acc, p) => {
    acc.set(cleanExt(p), p);
    return acc;
  }, new Map());

  return {
    name: NAME,
    apply: 'serve',
    enforce: 'pre',
    configResolved(_config) {
      config = _config;
    },
    config(_config) {
      const optimizeDeps = _config.optimizeDeps ?? {};
      optimizeDeps.include = [...(optimizeDeps.include ?? []), ...deps];
      _config.optimizeDeps = optimizeDeps;
    },
    configureServer(server) {
      server.watcher.on('change', (file) => {
        if (depsSet.has(normalizePath(file))) {
          debug(`file '${file}' changed, reload server`);
          server.restart(true);
        }
      });
    },
    async resolveId(id, importer) {
      const dep = normalizePath(path.resolve(path.dirname(importer!), id));
      const optimizedKey = depsToOriginal.get(dep);

      if (optimizedKey) {
        const optimizer = getDepsOptimizer(config);
        if (!optimizer) return;

        debug(`resolve '${dep}' from '${importer}'`);

        const metadata = optimizer.metadata;
        const depInfo = metadata.optimized[optimizedKey];

        if (depInfo) {
          return optimizer.getOptimizedDepId(depInfo);
        }
      }
    },
  };
}

function mapFiles(files: string[], ignore: string[] = []) {
  return globSync(files, {
    dot: true,
    absolute: true,
    ignore,
  });
}

function cleanExt(resolveId: string) {
  const ext = path.extname(resolveId);
  return ext ? resolveId.replace(ext, '') : resolveId;
}

function normalizeOptions(options: Options | Options[]): Options {
  if (!Array.isArray(options)) return options;

  return options.reduce<Options>(
    (acc, opt) => {
      return {
        files: [...acc.files, ...opt.files],
        ignore: [...acc.ignore!, ...(opt.ignore ?? [])],
      };
    },
    { files: [], ignore: [] }
  );
}
