import {
  ResolvedConfig,
  OptimizedDepInfo,
  DepOptimizationMetadata,
} from 'vite';

export interface Options {
  /**
   * An array of glob patterns to include in optimization.
   */
  files: string[];
  /**
   * An array of glob patterns to exclude matches.
   *
   * @default []
   */
  ignore?: string[];
}

export interface DepsOptimizer {
  metadata: DepOptimizationMetadata;
  getOptimizedDepId: (depInfo: OptimizedDepInfo) => string;
}

export type Helper = (
  config: ResolvedConfig,
  ssr?: boolean
) => DepsOptimizer | undefined;
