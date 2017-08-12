var path = require('path')
var fs = require('fs');
var childProcess = require('child_process')
var phantomjs = require('phantomjs');
var binpath = phantomjs.path;

var childArgs = [
  path.join(__dirname, 'test.js'),
]

childProcess.execFile(binpath, childArgs, function(err, stdout, stderr) {
    const data = stdout.split('@@kr-font@@')[1];
    if(data) {
        files = JSON.parse(data);
        for(var file in files) {
            if(files[file].data) {
                if(files[file].options.binary) {
                    console.log(file);
                    fs.writeFileSync(file, Buffer.from( string2Uint8Array(files[file].data).buffer), 'binary');
                    continue;
                }
                fs.writeFileSync(file, files[file].data);
            }
        }
    }
})


function string2Uint8Array(str) {
    for (var b = new ArrayBuffer(str.length), c = new Uint8Array(b), d = 0; d < str.length; d++)
        c[d] = str.charCodeAt(d);
    return c
}
