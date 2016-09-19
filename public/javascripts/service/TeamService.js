var TeamService = App.service('TeamService', function($http){

    this.getAll = function(){
        return $http.get('/api/teams');
    }

    this.create = function(teamname, league_id){
        return $http.post('/api/teams', {teamname: teamname, league_id: league_id});
    }

    this.getPlayers = function(team_id){
        return $http.get('/api/teams/'+team_id+"/players");
    }

    this.deleteById = function(id){
        return $http.delete('/api/teams/'+id);
    }
});