var PlayerService = App.service('PlayerService', function($http, UserTokenFactory){

    this.getAll = function(){
        return $http.get('/api/players', {headers: {"x-access-token" : UserTokenFactory.getToken()}});
    }

    this.getAttrByPlayerId = function(player_id){
        return $http.get('/api/players/'+player_id+"/attributes", {headers: {"x-access-token" : UserTokenFactory.getToken()}});
    }

    this.getStatsByPlayerId = function(player_id) {
        return $http.get('/api/players/'+player_id+"/stats", {headers: {"x-access-token" : UserTokenFactory.getToken()}});
    }

    this.create= function(){
        return $http.post('/api/players', {},{headers: {"x-access-token" : UserTokenFactory.getToken()}});
    }

    this.deleteById = function(id){
        return $http.delete('/api/players/'+id, {headers: {"x-access-token" : UserTokenFactory.getToken()}});
    }
});