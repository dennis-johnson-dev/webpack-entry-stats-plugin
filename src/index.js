const { sortFilesByType } = require("./util");

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
            if (typeof this.publicPath === "boolean") {
              this.publicPath = stats.publicPath;
            }

            assets = assets.map(asset => `${this.publicPath}${asset}`);
          }

          acc[entrypoint] = sortFilesByType(assets);
          return acc;
        },
        {}
      );

      const statsStr = JSON.stringify(files, null, 2);

      comp.assets[this.filename] = {
        source: () => statsStr,
        size: () => statsStr.length
      };

      cb();
    });
  }
}

module.exports = WebpackEntryStatsPlugin;
