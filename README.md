# webpack-entry-stats-plugin
Webpack plugin emitting a JSON file containing the required assets for each of the entrypoints.

This is useful if you are code splitting initial chunks (something like AggressiveSplittingPlugin) and need a reference to the hashed filenames for use in building script tag urls.

# Installation

```
$ yarn add --dev webpack-entry-stats-plugin
```

> __Note__: This plugin requires Node 4.7 and Webpack 2.

# Usage

```js
// webpack.config.js

...
plugins: [
  // writes to `some-cool-file.json` in output directory
  new WebpackEntryStatsPlugin({ filename: 'some-cool-file' })
],
...
```

## Options

- filename?: String

## Output

A `.json` file that contains an object with a key for each entrypoint. The value of each key is an object containing keys mapped to extensions. For each extension, you will find an array of files you must load in the specified order for the application to load correctly.

i.e.
```js
{
  one: {
    js: [ 'runtime.js', 'one.js' ],
    map: [ 'runtime.js.map', 'one.js.map' ]
  },
  two: {
    js: [ 'runtime.js', 'two.js' ],
    map: [ 'runtime.js.map', 'two.js.map' ]
  }
}
```

If the extract-text-webpack-plugin were included, you would see a `css` key under each entrypoint's extension map.
