var TeamService = App.service('TeamService', function($http, UserTokenFactory){

    this.getAll = function(){
        return $http.get('/api/teams', {headers: {"x-access-token" : UserTokenFactory.getToken()}});
    }

    this.getTeamByUserId = function(user_id){
        return $http.get('/api/users/'+ user_id +'/teams', {headers: {"x-access-token" : UserTokenFactory.getToken()}});
    }

    this.updateTeam = function(team_id, teamname){
        return $http.put('/api/teams/'+team_id, {teamname: teamname},{headers: {"x-access-token" : UserTokenFactory.getToken()}});
    }

    this.create = function(teamname, league_id){
        return $http.post('/api/teams', {teamname: teamname, league_id: league_id}, {headers: {"x-access-token" : UserTokenFactory.getToken()}});
    }

    this.getPlayers = function(team_id){
        return $http.get('/api/teams/'+team_id+"/players", {headers: {"x-access-token" : UserTokenFactory.getToken()}});
    }

    this.deleteById = function(id){
        return $http.delete('/api/teams/'+id, {headers: {"x-access-token" : UserTokenFactory.getToken()}});
    }
});