/* eslint-disable */
var page = require('webpage').create();
var fs = require('fs');
var system = require('system');
var args = system.args;
var files = null;
var fileIndex = 0;
fs.changeWorkingDirectory('./client/build/mkfont');
console.log(fs.workingDirectory);
if (args.length === 1) {
  console.log('Try to pass some arguments when invoking this script!');
  phantom.exit();
} else {
   files = JSON.parse(args[1]);
}
var expectedContent = fs.read('./index.html');
var expectedLocation = 'https://icomoon.io/app/#/select/';
page.clearCookies();
page.setContent(expectedContent, expectedLocation);
page.onLoadFinished = function(status) {
  page.injectJs('./angular.min.js');
  page.injectJs('./jquery.min.js');
  page.injectJs('./angular-ui-router.min.js');
  page.injectJs('./idbstore.min.js');
  page.injectJs('./FileSaver.min.js');
  page.injectJs('./icon.js');
};


function selectAll() {

    try {
     $('[ng-click="selectAllNone($index, false)"]')
      .each(function() {
          var ev = makeEv(this);
          this && this.dispatchEvent(ev);
      });
      $('h1').each(function() {
        if(this.innerText.indexOf('IcoMoon') === -1) {
          $('[ng-click="selectAllNone($index, true)"]', this)
            .each(function() {
              var ev = makeEv(this);
              this.dispatchEvent(ev);
          });
        }
      })

    } catch(e) {
      window.callPhantom({isError: true, e: e});
      throw e;
    }
    setTimeout(function() {
      location.hash = '#/select/font';
    }, 100);
}
function uploadFile(i) {
    if(i >= files.length) {
    setTimeout(function() {
        page.evaluate(selectAll);
    }, 10)
        return;
    }
    page.uploadFile('#file input', files[i]);

}

setTimeout(function() {
  phantom.exit();
}, 5000);


function getFile(name) {
    return 'file:///' + fs.workingDirectory + '/' + name;
}

page.onResourceRequested = function onResourceRequested(requestData, networkRequest) {
    var match = requestData.url.match(/tmpl\/(.*)$/);
    var match1 = requestData.url.match(/views\/(.*)$/);
    console.log(requestData.url);
    if (/b9b9ae6a/.test(requestData.url)) {
        networkRequest.changeUrl(getFile('icon.js'));
    } else if(/app\/$/.test(requestData.url)) {
        networkRequest.changeUrl(getFile('index.html'));
    } else if(/FileSaver/.test(requestData.url)) {
        networkRequest.changeUrl(getFile('FileSaver.min.js'));
    } else if(/idbstore/.test(requestData.url)) {
        networkRequest.changeUrl(getFile('idbstore.min.js'));
    } else if(/angular-ui-router/.test(requestData.url)) {
        networkRequest.changeUrl(getFile('angular-ui-router.min.js'));
    } else if(/sha3d71416/.test(requestData.url)) {
        networkRequest.changeUrl(getFile('angular.min.js'));
    } else if(/main\.html/.test(requestData.url)) {
        console.log(getFile('main.html'));
        networkRequest.changeUrl(getFile('main.html'));
    } else if(/colorpicker.html/.test(requestData.url)) {
        networkRequest.changeUrl(getFile('colorpicker.html'));
    } else if(/image.svg.tmpl/.test(requestData.url)) {
        networkRequest.changeUrl(getFile('image.svg.tmpl'));
    } else if(/getsessiontime/.test(requestData.url)) {
        networkRequest.changeUrl(getFile('getsessiontime'));
    } else if(/dict.json/.test(requestData.url)) {
        networkRequest.changeUrl(getFile('dict.json'));
    } else if(/presets.json/.test(requestData.url)) {
        networkRequest.changeUrl(getFile('presets.json'));
    } else if(/purchases/.test(requestData.url)) {
        networkRequest.changeUrl(getFile('purchases'));
    } else if(match) {
        networkRequest.changeUrl(getFile(match[1]));
    } else if(match1) {
        networkRequest.changeUrl(getFile(match1[1]));
    } else {
        networkRequest.changeUrl(getFile('fake'));
    }
}


page.onResourceError = function(resourceError) {
  console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
  console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
};
page.onCallback = function(data) {
    if (data === 'upload') {
      console.log('upload start');
      uploadFile(fileIndex++);
    } else if(data.isError) {
      console.log(JSON.stringify(data.e));
      phantom.exit();
    } else if(data.files) {
        console.log('@@kr-font@@' + JSON.stringify(data.files))
        phantom.exit();
    }

};
