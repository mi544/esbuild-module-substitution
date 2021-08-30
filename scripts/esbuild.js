const path = require('path')

let modulesSubstitutionOnResolvePlugin = {
  name: 'Node Modules Substitution',
  setup(build) {
    // sub `fs` with our local fake fs module
    build.onResolve({ filter: /^fs$/ }, (args) => {
      // console.log(args)
      return { path: require.resolve('local-fs/index.js') }
    })

    // sub `path` with `path-browserify`
    build.onResolve({ filter: /^path$/ }, (args) => {
      // console.log(args)
      return { path: require.resolve('path-browserify') }
    })
  },
}

require('esbuild')
  .build({
    bundle: true,
    entryPoints: ['src/index.js'],
    minify: true,
    plugins: [modulesSubstitutionOnResolvePlugin],
    outfile: 'dist/main.js',
    platform: 'browser',
    target: ['chrome92', 'firefox91'],
    treeShaking: true,
  })
  .catch(() => process.exit(1))
