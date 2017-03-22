import path from 'path';
import MemoryFs from 'memory-fs';
import rimraf from 'rimraf';
import webpack from 'webpack';

import WebpackEntryStatsPlugin from '../src/';

const config = (options = {}) => {
  return {
    entry: {
      one: path.resolve(__dirname, './fixtures/index.js'),
      two: path.resolve(__dirname, './fixtures/two.js')
    },
    output: {
      path: path.resolve(__dirname, 'tmp'),
      publicPath: '/resources',
      filename: '[name].js'
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'runtime',
        minChunks: Infinity
      }),
      new webpack.optimize.AggressiveSplittingPlugin({
        minSize: 5000,
        maxSize: 10000
      }),
      new WebpackEntryStatsPlugin({
        filename: options.filename,
        usePublicPath: options.usePublicPath
      })
    ],
    'devtool': 'sourcemap'
  };
};

describe('Webpack Entry Stats Plugin', () => {
  let statsFile, fs, stats;

  const getStats = (config) => {
    return new Promise((resolve, reject) => {
      const compiler = webpack(config);
      compiler.outputFileSystem = fs;

      compiler.run((err, stats) => {
        if (err || stats.hasErrors()) {
          console.error(stats.compilation.errors[0].message);
          console.error(stats.compilation.errors[0].stack);
          return reject('there was an error in the compilation');
        }

        resolve(stats.toJson());
      });
    });
  };

  const readStatsFile = (file) => {
    return new Promise((resolve, reject) => {
      const actual = fs.readFile(path.resolve(__dirname, file), 'utf8', (err, src) => {
        let json;
        if (err) {
          console.error(err);
          return reject(err);
        }

        try {
          json = JSON.parse(src);
        } catch (err) {
          return reject(err);
        }

        resolve(json);
      });
    });
  };

  beforeEach(async () => {
    fs = new MemoryFs();
  });

  it('creates stats entries for each entry point', async () => {
    stats = await getStats(config());
    statsFile = await readStatsFile('./tmp/stats.json');
    const expectedEntries = Object.keys(stats.entrypoints);
    const actualEntries = Object.keys(statsFile);

    expect(actualEntries).toEqual(expectedEntries);
  });

  it('adds extension types as keys in entry stats object', async () => {
    stats = await getStats(config());
    statsFile = await readStatsFile('./tmp/stats.json');
    const entry = Object.keys(statsFile)[0];
    const extensions = Object.keys(statsFile[entry]);

    expect(extensions.length).toEqual(2);
    expect(extensions).toContain('js');
    expect(extensions).toContain('map');
  });

  it('adds required assets for each entry', async () => {
    stats = await getStats(config());
    statsFile = await readStatsFile('./tmp/stats.json');
    const entries = Object.keys(statsFile);

    entries.forEach((entry) => {
      expect(statsFile[entry].js.length).toEqual(2);
      expect(statsFile[entry].map.length).toEqual(2);

      expect(statsFile[entry].js).toEqual(['runtime.js', `${entry}.js`]);
      expect(statsFile[entry].map).toEqual(['runtime.js.map', `${entry}.js.map`]);
    });
  });

  it('uses filename parameter', async () => {
    stats = await getStats(config({ filename: 'foo' }));
    statsFile = await readStatsFile('./tmp/foo.json');
  });

  it('adds webpack config publicPath to asset name', async () => {
    stats = await getStats(config({ usePublicPath: true }));
    statsFile = await readStatsFile('./tmp/stats.json');

    Object.keys(statsFile).forEach((entry) => {
      statsFile[entry].js.forEach((jsFile) => {
        expect(jsFile).toContain(stats.publicPath);
      });
    });
  });

  it('adds publicPath passed as parameter to asset name', async () => {
    const publicPath = '/foo/';
    stats = await getStats(config({ usePublicPath: publicPath }));
    statsFile = await readStatsFile('./tmp/stats.json');

    Object.keys(statsFile).forEach((entry) => {
      statsFile[entry].js.forEach((jsFile) => {
        expect(jsFile).toContain(publicPath);
      });
    });
  });
});
