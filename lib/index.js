'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./util'),
    sortFilesByType = _require.sortFilesByType;

var WebpackEntryStatsPlugin = function () {
  function WebpackEntryStatsPlugin() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, WebpackEntryStatsPlugin);

    this.filename = opts.filename || 'stats.json';
  }

  _createClass(WebpackEntryStatsPlugin, [{
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

      compiler.plugin("emit", function (comp, cb) {
        var stats = comp.getStats().toJson();

        var entrypoints = Object.keys(stats.entrypoints);

        var files = entrypoints.reduce(function (acc, entrypoint) {
          acc[entrypoint] = sortFilesByType(stats.entrypoints[entrypoint].assets);
          return acc;
        }, {});

        var statsStr = JSON.stringify(files, null, 2);

        comp.assets[_this.filename] = {
          source: function source() {
            return statsStr;
          },
          size: function size() {
            return statsStr.length;
          }
        };

        cb();
      });
    }
  }]);

  return WebpackEntryStatsPlugin;
}();

module.exports = WebpackEntryStatsPlugin;