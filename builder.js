var fs = require('fs');
var parser = require('./lib/parser.js');
var js2xmlparser = require("js2xmlparser");

fs.readFile('./iran_cities_in_moi_site.crawl', 'utf8', function read(err, data) {
  if (err) {
    throw err;
  } else {
    //convert html string to javascript object
    var data = parser.parse(data);

    var json = JSON.stringify(data, null, 2);
    var xml = JSON.stringify({'city':data});

    var javascript = '(function () {' + '\n' +
      '\t// Establish the root object, `window` in the browser, or `exports` on the server.' + '\n' +
      '\tvar root = this;' + '\n' +
      '\n' +
      '\t// Create a safe reference to the iran object for use below.'  + '\n' +
      '\tvar iran = function (obj) {'  + '\n' +
        '\t\tif (obj instanceof iran) return obj;'  + '\n' +
        '\t\tif (!(this instanceof iran)) return new iran(obj);' + '\n' +
        '\t\tthis._wrapped = obj;' + '\n' +
      '\t};' + '\n' +
      '\n' +
      '\t// Export the iran object for **Node.js**, with'  + '\n' +
      '\t// backwards-compatibility for the old `require()` API. If we\'re in'  + '\n' +
      '\t// the browser, add `iran` as a global object.' + '\n' +
      '\tif (typeof exports !== \'undefined\') {'  + '\n' +
      '\t\tif (typeof module !== \'undefined\' && module.exports) {'  + '\n' +
      '\t\t\texports = module.exports = iran;' + '\n' +
      '\t\t}' + '\n' +
      '\t\texports.iran = iran;' + '\n' +
      '\t} else {' + '\n' +
      '\t\troot.iran = iran;' + '\n' +
      '\t}' + '\n' +
      '\n' +
      '\t// Current version.' + '\n' +
      '\tiran.VERSION = \'1.0.2\';' + '\n' +
      '\n' +
      '\tiran.cities = JSON.parse(\'' + JSON.stringify(data) + '\')' + '\n' +
      '\n' +
      '\n' +
      '\t// Register iran angular module' + '\n' +
      '\t// iran service avilable' + '\n' +
      '\tif (typeof angular === \'object\') {' + '\n' +
        '\t\tangular.module(\'iran\', [])' + '\n' +
          '\t\t.service(\'iran\', function () {' + '\n' +
            '\t\t\treturn iran;' + '\n' +
          '\t\t});' + '\n' +
      '\t}' + '\n' +
      '\n' +
      '\t// AMD registration happens at the end for compatibility with AMD loaders' + '\n' +
      '\t// that may not enforce next-turn semantics on modules. Even though general' + '\n' +
      '\t// practice for AMD registration is to be anonymous, iran registers' + '\n' +
      '\t// as a named module because, like jQuery, it is a base library that is' + '\n' +
      '\t// popular enough to be bundled in a third party lib, but not be part of' + '\n' +
      '\t// an AMD load request. Those cases could generate an error when an' + '\n' +
      '\t// anonymous define() is called outside of a loader request.' + '\n' +
      '\tif (typeof define === \'function\' && define.amd) {' + '\n' +
        '\t\tdefine(\'iran\', [], function() {' + '\n' +
          '\t\t\treturn iran;' + '\n' +
        '\t\t});' + '\n' +
      '\t}' + '\n' +
    '}.call(this));';


    fs.writeFile('./dist/iran.json', json, function (err) {
      if (err) {
        throw err;
      }
      console.log('iran.json saved!');
    });

    fs.writeFile('./dist/iran.js', javascript, function (err) {
      if (err) {
        throw err;
      }
      console.log('iran.js saved!');
    });

    fs.writeFile('./dist/iran.xml', js2xmlparser('iran', xml), function (err) {
      if (err) {
        throw err;
      }
      console.log('iran.xml saved!');
    });
  }
});
