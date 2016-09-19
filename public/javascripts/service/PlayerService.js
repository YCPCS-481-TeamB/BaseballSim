var PlayerService = App.service('PlayerService', function($http){

    this.getAll = function(){
        return $http.get('/api/players');
    }

    this.create= function(){
        return $http.post('/api/players');
    }

    this.deleteById = function(id){
        return $http.delete('/api/players/'+id);
    }
});