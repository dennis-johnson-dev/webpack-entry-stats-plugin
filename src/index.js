const {
  normalizeAssetNames,
  sortFilesByType
} = require('./util');

class WebpackEntryStatsPlugin {
  constructor(opts = {}) {
    this.filename = opts.filename && opts.filename + '.json' || 'stats.json';
    this.publicPath = opts.usePublicPath;
    // true, string, undefined
    /*

    */
  }

  apply(compiler) {
    compiler.plugin("emit", (comp, cb) => {
      const stats = comp.getStats().toJson({ publicPath: true });

      const entrypoints = Object.keys(stats.entrypoints);

      const files = entrypoints.reduce((acc, entrypoint) => {
        const assets = normalizeAssetNames(stats, entrypoint, this.publicPath);
        acc[entrypoint] = sortFilesByType(assets);
        return acc;
      }, {});

      const statsStr = JSON.stringify(files, null, 2);

      comp.assets[this.filename] = {
        source: function () {
          return statsStr;
        },
        size: function () {
          return statsStr.length;
        }
      };

      cb();
    });
  }
}

module.exports = WebpackEntryStatsPlugin;
