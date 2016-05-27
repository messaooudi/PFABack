var app = angular.module('mainApp', ['ngRoute']);

app.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            
            // route for the emodules page
            .when('/emodules', {
                templateUrl : 'pages/emodules.html',
                controller  : 'emodulesController'
            })

            // route for the modules page
            .when('/modules', {
                templateUrl : 'pages/modules.html',
                controller  : 'modulesController'
            });
    });

    app.controller('mainController', function($scope,$http) {
       
    });

    app.controller('emodulesController', function($scope,$http) {
        $scope.eModules = [];
        $http({
            method: 'POST',
            url: '/gestionfiliere/eModules/getEmodule',
            data : {query : {},fields  :"intitulee"}
        }).then(function successCallback(response) {
            $scope.eModules = response.data.data
        }, function errorCallback(response) {
            alert(JSON.stringify(response.data,null))
        });
    });

    app.controller('modulesController', function($scope,$http) {

    });