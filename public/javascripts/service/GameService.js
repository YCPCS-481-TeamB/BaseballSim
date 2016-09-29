var GameService = App.service('GameService', function($http){

    this.getAll = function(){
        return $http.get('/api/games');
    }

    this.loadEventsByGameId = function(game_id){
        return $http.get('/api/games/' + game_id + '/events', {});
    }

    this.getPositionsByEventId = function(event_id){
        return $http.get('/api/games/events/' + event_id + '/positions');
    }

    this.startGameEvent = function(game_id){
        return $http.post('/api/games/' + game_id + '/start', {});
    }

    this.nextGameEvent = function(game_id,team1_player_id, team2_player_id){
        return $http.post('/api/games/' + game_id + '/events/next', {player1_id: team1_player_id, player2_id: team2_player_id});
    }

    this.create= function(team1_id, team2_id, field_id, league_id){
        return $http.post('/api/games', {team1_id: team1_id, team2_id: team2_id, field_id: field_id, league_id: league_id});
    }

    this.deleteById = function(id){
        return $http.delete('/api/games/'+id);
    }
});