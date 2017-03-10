class WebpackEntryStatsPlugin {
  constructor(opts) {
    this.filename = opts.filename || 'stats.json';
  }

  apply(compiler) {
    compiler.plugin("emit", (comp, cb) => {
      const stats = comp.getStats().toJson();

      const entrypoints = Object.keys(stats.entrypoints);

      const files = entrypoints.reduce((acc, entrypoint) => {
        acc[entrypoint] = this.sortFilesByType(stats.entrypoints[entrypoint].assets);
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

  sortFilesByType(assets) {
    return assets.reduce((acc, file) => {
      const ext = file.match(/\.([\w]+)$/)[1];

      acc.hasOwnProperty(ext) ?
        acc[ext].push(file) :
        acc[ext] = [file];

      return acc;
    }, {});
  }
}

module.exports = WebpackEntryStatsPlugin;
