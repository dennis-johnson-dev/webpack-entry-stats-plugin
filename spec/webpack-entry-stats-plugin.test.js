import path from 'path';
import MemoryFs from 'memory-fs';
import rimraf from 'rimraf';
import webpack from 'webpack';

import WebpackEntryStatsPlugin from '../';

const config = () => {
  return {
    entry: {
      one: path.resolve(__dirname, './fixtures/index.js'),
      two: path.resolve(__dirname, './fixtures/two.js')
    },
    output: {
      path: path.resolve(__dirname, 'tmp'),
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
      new WebpackEntryStatsPlugin()
    ],
    'devtool': 'sourcemap'
  };
};

const readStatsFile = (file, fs) => {
  return new Promise((resolve, reject) => {
    const actual = fs.readFile(path.resolve(__dirname, file), 'utf8', (err, src) => {
      if (err) {
        return reject(err);
      }

      try {
        src = JSON.parse(src);
      } catch (err) {
        return reject(err);
      }

      resolve(src);
    });
  });
};

describe('Webpack Entry Stats Plugin', () => {
  let statsFile, fs, stats;

  const getStats = (config, fs) => {
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

  beforeEach(async () => {
    fs = new MemoryFs();
    stats = await getStats(config(), fs);
    statsFile = await readStatsFile('./tmp/stats.json', fs);
  });

  it('creates stats entries for each entry point', async () => {
    const expectedEntries = Object.keys(stats.entrypoints);

    const actualEntries = Object.keys(statsFile);

    expect(actualEntries).toEqual(expectedEntries);
  });

  it('adds extension types as keys in entry stats object', async () => {
    const entry = Object.keys(statsFile)[0];
    const extensions = Object.keys(statsFile[entry]);

    expect(extensions.length).toEqual(2);
    expect(extensions[0]).toEqual('js');
    expect(extensions[1]).toEqual('map');
  });

  it('adds required assets for each entry', async () => {
    statsFile
  });
});
