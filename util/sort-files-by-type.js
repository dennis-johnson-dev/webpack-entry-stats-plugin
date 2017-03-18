module.exports = (files) => {
  return files.reduce((acc, file) => {
    const match = file.match(/\.([\w]+)$/);
    if (!match) {
      return acc;
    }

    const ext = match[1];

    acc.hasOwnProperty(ext) ?
      acc[ext].push(file) :
      acc[ext] = [file];

    return acc;
  }, {});
}
