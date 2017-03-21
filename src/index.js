const { sortFilesByType } = require('./util');

class WebpackEntryStatsPlugin {
  constructor(opts = {}) {
    this.filename = opts.filename && opts.filename + '.json' || 'stats.json';
  }

  apply(compiler) {
    compiler.plugin("emit", (comp, cb) => {
      const stats = comp.getStats().toJson();

      const entrypoints = Object.keys(stats.entrypoints);

      const files = entrypoints.reduce((acc, entrypoint) => {
        acc[entrypoint] = sortFilesByType(stats.entrypoints[entrypoint].assets);
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
