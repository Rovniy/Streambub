var admin = {};
//Вход на сайт, как администратор
admin.login = function(email, pass) {
    var data = {
        message_type: 'ADMIN_LOGIN',
        email: email,
        pass: pass
    };
    Intercom.getInstance().emit('adminlogin', data);
};
admin.reg = function(name, email, pass, superpass) {
    var data = {
        message_type: 'ADMIN_REGISTRATION',
        name: name,
        email: email,
        pass: pass,
        super: superpass
    };
    Intercom.getInstance().emit('adminreg', data);
};

(function () {
    'use strict';

    angular
        .module('streampub')
        .service('adminService', adminService);

    adminService.$inject = ['intercomService', '$http', 'preloader', 'authenticationService'];

    function adminService(intercomService, $http, preloader, authenticationService) {
        //this.act = act;

        //Проверка событий во всех вкладках
        intercomService.on('adminlogin', adminEnter);
        intercomService.on('adminreg', adminReg);

        //Вход в аккаунт через консоль
        function adminEnter(msg) {
            preloader.act('adminService-adminEnter');
            var data =  {
                email: msg.email,
                password: msg.pass
            };
            $http.post('/api/login', data)
                .then(function () {
                    intercomService.emit('authentication.login');
                    preloader.dis('adminService-adminEnter');
                })
                .catch(function() {
                    preloader.dis('adminService-adminEnter');
                });
        }

        //Регистрация через консоль
        function adminReg(msg) {
            preloader.act('adminService-adminReg');
            var data =  {
                "email": msg.email,
                "name": msg.name,
                "password": msg.pass,
                "acceptConditions": "true",
                "tz": new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1]
            };
            $http
                .post('/api/signup', data)
                .then(function () {
                    preloader.dis('adminService-adminReg');
                    return authenticationService.login(data.email, data.password);
                })
                .catch(function() {
                    preloader.dis('adminService-adminReg');
                })
        }

    }
})();

