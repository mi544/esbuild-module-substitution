# ESBuild Module Substitution

This repo is an example of how to substitute your dependencies' dependencies
with ESBuild by using the "resolve callbacks" feature of ESBuild.

Inspired by this response by [@evanw](https://github.com/evanw):
<https://github.com/evanw/esbuild/issues/1324#issuecomment-856580391>

<https://esbuild.github.io/plugins/#resolve-callbacks>

## Installation

All yarn dependencies are already included in this repo. Please **DO NOT** run
`yarn install` as that will remove fake dependencies added to `node_modules`
for illustrative purposes  

If you need to run `yarn install`, move `local-fs/` and `funny-logs/` folders
out of `node-modules/` first, run `yarn install`, then put the folders back  

## Building with ESBuild

Build by running `yarn build`  

The bundled file with replaced dependencies can be found at `dist/main.js`  

## Running

You can run the bundled file by running `node dist/main.js`  

Console logs with subbed modules should be displayed  

Compare that with the output from `node src/index.js` to see the difference

---

Notice that our _local_ file at `src/index.js` requires `os` module that comes
with node. To sub `os` with `os-browserify` in production build, install it 
with yarn and add the following line to the `package.json`

```diff
  browser: {
+   "os": "os-browserify"
  }
```

ESBuild will automatically detect `os` imports in project files and swap them
with `os-browserify`  

However, this approach wouldn't substitute your modules' dependencies  

Our _local_ file at `src/index.js` requires `funny-logs`. Then, `funny-logs`
itself requires `fs` and `path`, modules that are only available in node. Thus,
a module we are directly requiring needs 2 node-specific libraries that are not
required directly, but rather are required by a dependency  

To substitute these two modules with something else, the build script for
ESBuild at `scripts/esbuild.js` was adjusted to include a `resolve plugin`
hook. There are two rules defined in that hook - if `^fs$` (regex) is matched,
replace it with `node_modules/local-fs/index.js`; for `^path$`, the path is
replaced with `node_modules/path-browserify`  

This allows to substitute dependencies of our dependencies, making it
possible to compile browser-friendly code even when node-specific modules are
used in some parts of a project
