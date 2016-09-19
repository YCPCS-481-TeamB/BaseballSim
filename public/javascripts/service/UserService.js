var UserService = App.service('UserService', function($http){

    this.getAll = function(){
        return $http.get('/api/users');
    }

    this.create = function(){
        return $http.post('/api/users');
    }

    this.deleteById = function(id){
        return $http.delete('/api/users/'+id);
    }
});