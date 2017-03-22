const {
  normalizeAssetNames,
  sortFilesByType
} = require("./util");

class WebpackEntryStatsPlugin {
  constructor(opts = {}) {
    this.filename = (opts.filename && opts.filename + ".json") || "stats.json";
    this.publicPath = opts.usePublicPath;
  }

  apply(compiler) {
    compiler.plugin("emit", (comp, cb) => {
      const stats = comp.getStats().toJson({ publicPath: true });

      const entrypoints = Object.keys(stats.entrypoints);

      const files = entrypoints.reduce(
        (acc, entrypoint) => {
          let assets = stats.entrypoints[entrypoint].assets;

          if (this.publicPath) {
            let publicPath = this.publicPath;
            if (typeof this.publicPath === "boolean") {
              publicPath = stats.publicPath;
            }

            assets = normalizeAssetNames(assets, publicPath);
          }

          acc[entrypoint] = sortFilesByType(assets);
          return acc;
        },
        {}
      );

      const statsStr = JSON.stringify(files, null, 2);

      comp.assets[this.filename] = {
        source: function() {
          return statsStr;
        },
        size: function() {
          return statsStr.length;
        }
      };

      cb();
    });
  }
}

module.exports = WebpackEntryStatsPlugin;
