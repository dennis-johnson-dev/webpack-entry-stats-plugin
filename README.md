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

option | type | default | required
--- | --- | --- | ---
*filename* | String | `stats.json` | false
*usePublicPath* | Boolean | false | false


## Output

A `.json` file that contains an object with a key for each entrypoint that specifies the order for which to load the application correctly.

i.e.
```js
{
  'entry-one': {
    js: [ 'manifest.js', 'entry-one.js' ],
    map: [ 'manifest.js.map', 'entry-one.js.map' ]
  },
  'entry-two': {
    js: [ 'manifest.js', 'entry-two.js' ],
    map: [ 'manifest.js.map', 'entry-two.js.map' ]
  }
}
```

This is saying we need to load `manifest.js` and then our entrypoint, probably in the form of script tags.

```html
<!-- index.html -->
...
<script src="/manifest.js"></script>
<script src="/entry-one.js"></script>
...
```

If the extract-text-webpack-plugin were included, you would see a `css` key under each entrypoint's extension map.
