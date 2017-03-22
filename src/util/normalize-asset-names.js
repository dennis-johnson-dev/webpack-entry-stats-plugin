module.exports = (stats, entrypoint, publicPath = '') => {
  return stats.entrypoints[entrypoint].assets.map((asset) => {
    if (publicPath && typeof publicPath === 'boolean') {
      publicPath = stats.publicPath;
    }

    return `${publicPath}${asset}`;
  });
};
