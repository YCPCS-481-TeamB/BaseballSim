var GameService = App.service('GameService', function($http){

    this.getAll = function(){
        return $http.get('/api/games');
    }

    this.create= function(team1_id, team2_id, field_id, league_id){
        return $http.post('/api/games', {team1_id: team1_id, team2_id: team2_id, field_id: field_id, league_id: league_id});
    }

    this.deleteById = function(id){
        return $http.delete('/api/games/'+id);
    }
});