import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/utils/sprite.ts',
    'src/components/svgs',
    'src/components/icon',
  ],
  clean: true,
  declaration: 'compatible',
  externals: [
    'vite',
    'fast-glob',
    'fs',
    'path',
    'os',
    '@nodelib/fs.walk',
    '@nodelib/fs.stat',
    '@nodelib/fs.scandir',
    'merge2',
    'glob-parent',
    'micromatch',
    'braces',
    'picomatch',
    'picomatch/lib/utils',
    'is-glob',
    'is-extglob',
    'fastq',
    'fill-range',
    'reusify',
    'run-parallel',
    'to-regex-range',
    'is-number',
    'queue-microtask',
    'vue'
  ],
  rollup: {
    emitCJS: false,
    inlineDependencies: false,
  },
  failOnWarn: false,
  alias: {
    '@': 'src'
  }
})
