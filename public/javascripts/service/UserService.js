var UserService = App.service('UserService', function($http, UserTokenFactory){


    this.getAll = function(){
        return $http.get('/api/users',{headers: {"x-access-token" : UserTokenFactory.getToken()}});
    }

    this.create = function(username, password){
        return $http.post('/api/users', {username: username, password: password});
    }

    this.createUserWithAttributes = function(username, password, firstname, lastname, email){
        return $http.post('/api/users', {username: username, password: password, firstname: firstname, lastname:lastname, email: email});
    }

    this.deleteById = function(id){
        return $http.delete('/api/users/'+id,{headers: {"x-access-token" : UserTokenFactory.getToken()}});
    }
});