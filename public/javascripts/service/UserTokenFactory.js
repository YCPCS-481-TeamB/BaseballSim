var UserTokenFactory = App.service('UserTokenFactory', function($http, $cookies){
    var token;

    this.getUserData = function(){
        return new Promise(function(resolve, reject){
            $http.post('/api/users/validate', {token: token}).then(function(data){
                resolve(data.data.user);
            }).catch(function(err){
                console.log(err);
            });
        });
    }

    if($cookies.get('userToken')){
        token = $cookies.get('userToken');
        this.getUserData().then(function(user){
            console.log("UserData: ", user);
        });
    }

    this.getToken = function(){
        return token;
    }

    this.logoutUser = function(){
        return new Promise(function(resolve, reject){
            $cookies.remove('userToken');
            resolve("DONE");
        });
    }

    this.validateUser = function(username, password){
        return new Promise(function(resolve, reject){
            $http.post('/api/users/token', {username: username, password: password}).then(function(data){
                if(data.data.success == true){
                    token = data.data.token;
                    $cookies.put("userToken", token);
                    resolve(token);
                }else{
                    reject(data.data.error);
                }
            }).catch(function(err){
                reject(err);
            });
        });
    }

    this.checkTokenValidity = function(){
        return new Promise(function(resolve, reject){
            $http.post('/api/users/validate', {token: token}).then(function(data){
                resolve(data.data.success);
            }).catch(function(err){
                console.log(err);
            });
        });
    }

});
