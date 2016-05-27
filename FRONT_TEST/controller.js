/* global io */

var app = angular.module('mainApp',[]);

app.controller('mainController',function($scope,$http){
    

        $scope.profs = [
            {
                nom : "kotb",
                id : "573a1790a72c2597d03f7d8f",
            },
            {
                nom : "oussama",
                id : "573a178ca72c2597d03f7d8e",
            }
        ];

        $scope.sharedUser = {};
        
        $scope.req = {
            intitulee : '',
            targetUsers : [],
            userId : '573a1790a72c2597d03f7d8f'
        }
     
    $scope.add = function(){
        $scope.req.targetUsers.push({id : $scope.sharedUser.id,permision :$scope.permision});
         
    }
    
    $scope.deleteU = function(index){
        $scope.req.targetUsers.splice(index,1);
    }
    
    $scope.create = function(){  
        $http({
            method: 'POST',
            url: 'gestionfiliere/eModules/creeEmodule',
            data : $scope.req
        }).then(function successCallback(response) {
            //response in data 
            alert(JSON.stringify(response.data,null))
        }, function errorCallback(response) {
            alert(JSON.stringify(response.data,null))
        });
    }
    
    $scope.share = function(){  
        $scope.shareReq = {eModuleId : $scope.req.eModuleId._id,targetUsers : $scope.req.targetUsers}
        $http({
            method: 'POST',
            url: 'gestionfiliere/eModules/shareEmodule',
            data : {eModuleId : $scope.req.eModuleId._id,targetUsers : $scope.req.targetUsers}
        }).then(function successCallback(response) {
            //response in data 
            alert(JSON.stringify(response.data,null))
        }, function errorCallback(response) {
            alert(JSON.stringify(response.data,null))
        });
    }
    
    $scope.res = {
        data : ""
    }
    
    $scope.get = {
        req : {
            query : {
                intitulee : '',
            },
            fields : "",
        }
        }
    
    $scope.getb = function(){
        $http({
            method: 'POST',
            url: 'gestionfiliere/eModules/getEmodule',
            data : $scope.get.req
        }).then(function successCallback(response) {
            //response in data 
            $scope.res.data = response.data;
            $scope.eModules =  response.data; 
        }, function errorCallback(response) {
            alert(JSON.stringify(response.data,null))
        });
    }
    
    $scope.delete = {
        req : {
            eModuleId :'',
        }
    }
    
    $scope.get.req = {fields : "intitulee"}
    $http({
            method: 'POST',
            url: 'gestionfiliere/eModules/getEmodule',
            data : $scope.get.req
        }).then(function successCallback(response) {
            //response in data 
            $scope.eModules =  response.data.data; 
        }, function errorCallback(response) {
            alert(JSON.stringify(response.data,null))
        });
    
    
    $scope.deleteb = function(){
        $http({
            method: 'POST',
            url: 'gestionfiliere/eModules/deleteEmodule',
            data : {eModuleId : $scope.delete.req.eModuleId._id}
        }).then(function successCallback(response) {
            //response in data 
             alert(JSON.stringify(response.data,null))
        }, function errorCallback(response) {
            alert(JSON.stringify(response.data,null))
        });
    }
    
    
});

app.controller('loginController',function($scope,$http){
    $scope.loginForm = {
        email : "",
        password : ""
    }

    $scope.logIn  = function(){
        $http({
            method: 'POST',
            url: '/gestionfiliere/prof/login',
            data :{query : $scope.loginForm}
        }).then(function successCallback(response) {
            //response in data 
            //$rootScope.currentUser = response;
            var b = response.data
            //if(b.type == "error")
                $scope.loginForm.errorMessage =b.message;
            alert(JSON.stringify(response.data,null))
        }, function errorCallback(response) {
            alert(JSON.stringify(response.data,null))
        });
    }
    
})

app.controller('singupController',function($scope,$http){
    $scope.singupForm = {
        nom : "",
        prenom : "",
        email : '',
        password : ''
    }

    $scope.singUp  = function(){
        $http({
            method: 'POST',
            url: '/gestionfiliere/prof/singup',
            data : {query : $scope.singupForm}
        }).then(function successCallback(response) {
            //response in data 
            //$rootScope.currentUser = response;
            alert(JSON.stringify(response.data,null))
        }, function errorCallback(response) {
            alert(JSON.stringify(response.data,null))
        });
    }
    
})

app.controller('createElementModuleController',function($scope,$http){
  var _data = {
      intitulee : "EM2",
      eModuleId : "5739b282090a66a319b007e5",
      targetUsers : [
          {
              id : "5739a01f61c7e85e02512d70" ,
              permision : 'w',
          },
          {
              id : "5739a02161c7e85e02512d71",
              permision : 'r',
          }
      ]
  }  ;    
        
  $scope.test = function(){
      $http({
            method: 'POST',
            url: '/gestionfiliere/eModules/creeEmodule',
            data : _data
        }).then(function successCallback(response) {
            //response in data 
            //$rootScope.currentUser = response;
            alert(JSON.stringify(response.data,null))
        }, function errorCallback(response) {
            alert(JSON.stringify(response.data,null))
        });
  }
    
});

