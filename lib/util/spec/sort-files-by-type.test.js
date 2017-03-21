'use strict';

var _ = require('../');

describe('Sort Files by type', function () {
  it('creates entries for each filetype', function () {
    var counter = 1;
    var extensions = ['YO', 'css', 'scss', 'js', 'ts', 'less', 'jsx', 'abc', 'foo', 'cool'];
    var files = extensions.map(function (ext) {
      return 'alpha.funky-' + counter++ + '.' + ext;
    });

    var filetypeMap = (0, _.sortFilesByType)(files);

    Object.keys(filetypeMap).forEach(function (ext) {
      expect(extensions).toContain(ext);
    });
  });

  it('buckets files with the same extension', function () {
    var files = ['one.js', 'one.js.map', 'two.js', 'two.js.map'];

    var filetypeMap = (0, _.sortFilesByType)(files);
    expect(filetypeMap.js).toEqual(['one.js', 'two.js']);
    expect(filetypeMap.map).toEqual(['one.js.map', 'two.js.map']);
  });

  it('handles files with no extension', function () {
    var files = ['one'];

    var filetypeMap = (0, _.sortFilesByType)(files);
    expect(filetypeMap).toEqual({});
  });
});