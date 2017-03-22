module.exports = files => {
  return files.reduce(
    (acc, file) => {
      const matchGroup = file.match(/([.])(\w+)$/);
      if (!matchGroup) {
        return acc;
      }

      const [fullMatch, delimiter, extension] = matchGroup;

      acc.hasOwnProperty(extension)
        ? acc[extension].push(file)
        : (acc[extension] = [file]);

      return acc;
    },
    {}
  );
};
