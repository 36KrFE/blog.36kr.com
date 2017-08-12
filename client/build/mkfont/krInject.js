window.krUpload = false;
angular.module('kr.font', [])
    .directive('krCallPhantom', function() {
        return {
            link: function postLink() {
               if(!window.krUpload) {
                   window.krUpload = true;
                   window.callPhantom('upload');
               } 
            }
        }
    })