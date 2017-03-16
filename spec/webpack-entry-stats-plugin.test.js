import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import webpack from 'webpack';

import WebpackEntryStatsPlugin from '../';

const config = () => {
  return {
    entry: {
      entry: path.resolve(__dirname, './fixtures/index.js')
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
      new WebpackEntryStatsPlugin({})
    ],
    'devtool': 'sourcemap'
  };
};

describe('Webpack Entry Stats Plugin', () => {
  let stats;

  const getStats = (config) => {
    return new Promise((resolve, reject) => {
      const compiler = webpack(config);

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
    stats = await getStats(config());
  });

  afterEach(() => {
    return new Promise((resolve, reject) => {
      rimraf(path.resolve(__dirname, './tmp'), (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  });

  const readFile = (file) => {
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
  }

  it('should pass', async () => {
    const expectedEntries = Object.keys(stats.entrypoints);

    const file = await readFile('./tmp/stats.json');
    const actualEntries = Object.keys(file);

    expect(actualEntries).toEqual(expectedEntries);
  });
});
