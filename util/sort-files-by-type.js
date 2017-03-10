module.exports = (assets) => {
  return assets.reduce((acc, file) => {
    const ext = file.match(/\.([\w]+)$/)[1];

    acc.hasOwnProperty(ext) ?
      acc[ext].push(file) :
      acc[ext] = [file];

    return acc;
  }, {});
}
