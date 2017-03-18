import { sortFilesByType } from '../';

describe('Sort Files by type', () => {
  it('creates entries for each filetype', () => {
    let counter = 1;
    const extensions = ['YO', 'css', 'scss', 'js', 'ts', 'less', 'jsx', 'abc', 'foo', 'cool'];
    const files = extensions.map(ext => `alpha.funky-${counter++}.${ext}`);

    const filetypeMap = sortFilesByType(files);

    Object.keys(filetypeMap).forEach((ext) => {
      expect(extensions).toContain(ext);
    });
  });

  it('buckets files with the same extension', () => {
    const files = ['one.js', 'one.js.map', 'two.js', 'two.js.map'];

    const filetypeMap = sortFilesByType(files);
    expect(filetypeMap.js).toEqual(['one.js', 'two.js']);
    expect(filetypeMap.map).toEqual(['one.js.map', 'two.js.map']);
  });

  it('handles files with no extension', () => {
    const files = ['one'];

    const filetypeMap = sortFilesByType(files);
    expect(filetypeMap).toEqual({});
  });
});
