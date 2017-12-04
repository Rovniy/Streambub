(function () {
    'use strict';

    angular
        .module('streampub')
        .controller('uploadImageController', uploadImageController);

    uploadImageController.$inject = ['$scope','FileUploader','$rootScope','$http','intercomService'];

    function uploadImageController($scope,FileUploader,$rootScope,$http,intercomService) {
        var vm = this;
        vm.count = 0;
        vm.imgServerUrl = undefined;
        var uploadUrl = '/api/files/upload';
        vm.uploader = new FileUploader({
            url: uploadUrl
        });
        vm.myImage = '';
        vm.myCroppedImage = '';

        vm.postAnswer = postAnswer;
        vm.startUpload = startUpload;

        activate();

        function activate() {
            vm.uploadImageFromModal = $rootScope.uploadImageFromModal;
            angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
        }


        /**
         * Crop image функция
         * @param evt - загруженное изображение
         */
        function handleFileSelect(evt) {
            var file=evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function(){
                    vm.myImage=evt.target.result;
                });
            };
            reader.readAsDataURL(file);
        }

        /**
         * Конвертер Base64 в файл изображения
         * @param url - текст Base64
         * @param filename - имя файла для сохранение
         * @param mimeType - тип конечного изображения
         * @returns {*} - promise
         */
        function urltoFile(url, filename, mimeType){
            return (fetch(url)
                    .then(function(res){return res.arrayBuffer();})
                    .then(function(buf){return new File([buf], filename, {type:mimeType});})
            );
        }

        /**
         * Начало загрузки файлов в зависимости от типа окна
         */
        function startUpload() {
            if (vm.uploadImageFromModal.key === 'gift') {
                var sold = new Date();
                var fileName = 'crop'+sold.getUTCMilliseconds()+'.png';
                urltoFile(vm.myCroppedImage, fileName, 'image/png')
                    .then(function(file){
                        vm.uploader.queue[0]._file = file;
                        vm.uploader.queue[0].file = file;
                        vm.uploader.queue[0].upload();
                    });
            } else {
                vm.uploader.queue[0].upload();
            }
        }

        /**
         * Событие после успешной загрузки файла на сервер
         * @param response
         */
        vm.uploader.onSuccessItem = function(response) {
            var arrImgs = [];
            var resp = JSON.parse(response._xhr.response);
            arrImgs.push(resp.data.value[0].value);
            var uploadUrl = '/upload/user/' + $rootScope.user.userData.name;
            var postData = {
                path: uploadUrl,
                fileNames: arrImgs
            };
            $http.post('/api/files/move', postData)
                .then(function(datka){
                    vm.imgServerUrl = datka.data.data[0];
                    postAnswer();
                });
        };

        /**
         * Вовзрат данных в форму, откуда было вызвано окно
         */
        function postAnswer(){
            var data = {
                key: vm.uploadImageFromModal.key || null,
                url: vm.imgServerUrl,
                task: vm.uploadImageFromModal.row || null
            };
            console.log('data',data.url);
            if (vm.uploadImageFromModal.row) {
                intercomService.emit('complete-Upload-Image-From-Modal', data);
            } else {
                intercomService.emit('complete-Upload-Image-From-Modal-to-Admin', data);
            }
            $scope.$dismiss();
        }
        
    }

})();