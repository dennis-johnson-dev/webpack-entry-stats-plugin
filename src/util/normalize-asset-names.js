module.exports = (assets, publicPath = "") => {
  return assets.map(asset => {
    return `${publicPath}${asset}`;
  });
};
