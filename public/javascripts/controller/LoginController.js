var LoginController = App.controller('LoginController', function($scope,UserService,UserTokenFactory){
    console.log("Login Controller");
    //$scope.errorMessage;
    $scope.usernameInput = "";
    $scope.passwordInput = "";

    $scope.showAccountCreate = false;

    $scope.login = function(username, password){
        console.log("Attempting To Log In...");
        UserTokenFactory.validateUser(username, password).then(function(token){
            UserTokenFactory.checkTokenValidity().then(function(data){
                if(data === true){
                    console.log("Token: " + UserTokenFactory.getToken());
                    window.location.assign("/console");
                }else{
                    $scope.errorMessage = "Username or password Invalid";
                }
            });
        }).catch(function(err){
            $scope.errorMessage = err;
        });
    }

    $scope.createUser = function(createInputUsername, createInputPassword, createInputFirstname, createInputLastname,createInputEmail){
        console.log("Creating User");
        UserService.createUserWithAttributes(createInputUsername, createInputPassword, createInputFirstname, createInputLastname,createInputEmail).then(function(data){
            console.log(data);
            console.log("Attemping new user login");
            $scope.login(createInputUsername, createInputPassword);
        });
    }
});