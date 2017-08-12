const svgpath = './client/src/assets/svgs';
const path = require('path');
let fs = require('fs');
fs = require('fs-extra');
/* eslint-disable */
const childProcess = require('child_process');
const phantomjs = require('phantomjs-prebuilt');
const binpath = phantomjs.path;
let files = fs.readdirSync(svgpath).filter(function isFile(file) {
  return /.svg$/.test(file);
}).map(function (file) {
  return path.resolve(svgpath, file);
});
const childArgs = [
  path.join(__dirname, 'test.js'),
  JSON.stringify(files),
];
console.log(binpath);
function mkfont(resolve, reject) {
  childProcess.execFile(binpath, childArgs, {maxBuffer: 1024 * 2500}
  , function (err, stdout, stderr) {
    const data = stdout.split('@@kr-font@@')[1];
    console.log(stdout.split('@@kr-font@@')[0]);
    fs.ensureDirSync('client/src/common/fonts');
    if (data) {
      files = JSON.parse(data);
      for (const file in files) {
        if (files[file].data) {
          if (files[file].options.binary) {
            fs.writeFileSync(path.join('client/src/common', file),
              Buffer.from(string2Uint8Array(files[file].data).buffer), 'binary');
            continue;
          } else if(/.css$/.test(file)) {
            fs.writeFileSync('client/src/common/fonts/font.css', files[file].data);
          }
        }
      }
      resolve();
    } else {
      console.log(stdout);
      reject();
    }
  });

}


function string2Uint8Array(str) {
  for (var b = new ArrayBuffer(str.length), c = new Uint8Array(b), d = 0; d < str.length; d++)
    c[d] = str.charCodeAt(d);
  return c;
}

module.exports =  mkfont;

