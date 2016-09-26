var PlayerService = App.service('PlayerService', function($http){

    this.getAll = function(){
        return $http.get('/api/players');
    }

    this.getAttrByPlayerId = function(player_id){
        return $http.get('/api/players/'+player_id+"/attributes");
    }

    this.getStatsByPlayerId = function(player_id) {
        return $http.get('/api/players/'+player_id+"/stats");
    }

    this.create= function(){
        return $http.post('/api/players');
    }

    this.deleteById = function(id){
        return $http.delete('/api/players/'+id);
    }
});