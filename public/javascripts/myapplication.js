var myapp = angular.module("myapp", ['ngCookies']);

var uname, email, pwd, cpwd;
var t_name, descp, status1;


var info;

myapp.controller("registration", ['$cookies', '$scope', '$http', function($cookies, $scope, $http) {

    $scope.onRegistration = function() {

        var reg_data = {
            'uname': $scope.uname,
            'email': $scope.email,
            'pwd': $scope.pwd,
            'cpwd': $scope.cpwd
        }

        $http.post('/signup', reg_data)
            .success(function(signup_data) {
                console.log(signup_data);
            })
            .error(function(error) {
                console.log("Error not register");
            })
    }

    // if ($cookies.get('authtoken') && $cookies.get('uid')) {
    //      window.location = "/task";
    // } else {
    $scope.onLogin = function() {
        var login_data = {
            'email': $scope.email,
            'pwd': $scope.pwd
        };
        $http.post('/signin', login_data)
            .success(function(json) {
                if (json.data) {
                    console.log(json.data);
                    var name = json.data.username;
                    console.log(name);
                    window.location = "/task";

                } else {
                    console.log(json.err)
                    window.location = '/';
                }
            })
            .error(function(error) {
                console.log("Error");
            })

    };

    // }

}]);

myapp.controller("todo", ['$cookies', '$scope', '$http', function($cookies, $scope, $http) {

    // if ($cookies.get('authtoken') && $cookies.get('uid')) {
    $scope.show1 = true;
    $scope.current_uuid=$cookies.get('uid');

    $http.post('/getTask')
        .success(function(json) {
            console.log(json);
            $scope.taskname = json; 
        })
        .error(function(error) {
            console.log("error");
        })

    $scope.logout = function() {
        $http.get('/logout')
            .success(function(d) {
                console.log("success")
                window.location = '/'
            });
    };

    $scope.addTask = function() {
        var data = {
            'task_name': $scope.tname,
            'description': $scope.des,
            'status': false
        }
        $http.post('/addTask', data)
            .success(function(object) {
                // console.log(object);
                $scope.taskname.unshift(object);

            })
            .error(function() {
                console.log("Error");
            });
    }

    $scope.statusUpdate = function(status_info) {

        var data = {
            'uid': status_info.uid,
            'status': status_info.status
        }
        $http.post('/statusUpdate', data)
            .success(function(status_obj) {
                console.log(status_obj);
            })
            .error(function() {

            })
    }

    $scope.taskUpdate = function(task_info) {
        var data = {
            'uid': task_info.uid,
            'task_name': task_info.task_name,
            'description': task_info.description
        }
        $http.post('/taskEdit', data)
            .success(function(update_object) {
                console.log(update_object);
            })
            .error(function() {
                console.log("Error");
            });
    }

    $scope.deleteTask = function(taskuid, index) {
        console.log(index);
        var data = {
            'uid1': taskuid.uid
        }
        $http.post('/taskDelete', data)
            .success(function(json) {
                // var del=json.ta1;
                if (json.success) {
                    $scope.taskname.splice(index, 1);
                } else {
                    console.log("Error");
                }
            })
            .error(function() {
                console.log("Error");
            });


    };

    $scope.shareTask = function(task) {

        $http.post('/shareTask')
            .success(function(user_list) {
                $scope.userList = user_list;
            })
            .error(function() {
                console.log("Error user Not found");
            })

        $scope.selectedUser = function() {
            // console.log($scope.selected.uid);
            var data = {
                'taskshareuid': task.uid,
                'shared_user_id':$scope.selected.uid
            }

            $http.post('/shareTaskToUser',data)
                .success(function(object) {

                    console.log("Done with share",object);
                })
                .error(function() {
                    console.log("Error in share");
                });
        }

    }
}]);

myapp.controller('forgotpwd',['$cookies','$scope','$http','$location',function($cookies,$scope,$http,$location){

    $scope.sendVerification=function(){
        
        var data={
            'email1':$scope.email
        }

        $http.post('/sendVerification',data)
        .success(function(){
            console.log("success");
            res.end();

        })

        .error(function(){
            console.log("error in sending");
        })
    }

    $scope.resetPassword=function(){
        var token=location.pathname.split('/')[2];

        var data={
            'pwd':$scope.pwd,
            'cpwd':$scope.pwd,
            'token':token
        }
        
        $http.post('/reset',data)
        .success(function(success){
            console.log(success.done);
            window.location="/";
        })
        .error(function(){

        })
    }

}]);
