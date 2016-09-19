var UserService = App.service('UserService', function($http){

    this.getAll = function(){
        return $http.get('/api/users');
    }

    this.create = function(username, password){
        return $http.post('/api/users', {username: username, password: password});
    }

    this.deleteById = function(id){
        return $http.delete('/api/users/'+id);
    }
});