import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
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
    emitCJS: true,
    inlineDependencies: false
  },
  failOnWarn: false,
  alias: {
    '@': 'src'
  }
})
