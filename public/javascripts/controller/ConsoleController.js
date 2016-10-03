var ConsoleController = App.controller('ConsoleController', function($scope,$document,PlayerService, UserService, TeamService, GameService, UserTokenFactory){
    console.log('Console Controller');

    $scope.shiftKeyDown = false;

    $scope.showPlayerList = false;
    $scope.players = [];

    $scope.showUserList = false;
    $scope.tempUsername = "";
    $scope.tempPassword = "";
    $scope.users = [];

    $scope.showTeamList = false;
    $scope.teams = [];

    $scope.showGameList = false;
    $scope.games = [];

    UserTokenFactory.checkTokenValidity().then(function(data){
        if(data === false){
            window.location.assign("/login");
        }
    });

    $scope.loadPlayers = function(){
        var players = PlayerService.getAll().then(function(response){
            console.log(response);
            $scope.players = response.data.players;
        });
    }

    $scope.loadPlayerAttrs = function(player){
        console.log("loading players");
        if(player && player.id) {
            var attrs = PlayerService.getAttrByPlayerId(player.id).then(function (response) {
                console.log(response.data.attributes);
                player.attrs = response.data.attributes;
            });
        }
    }

    $scope.loadPlayerStats = function(player) {
        console.log("loading player stats");
        if (player && player.id) {
            var stats = PlayerService.getStatsByPlayerId(player.id).then(function(response) {
                console.log(response);
                player.stats = response.data.stats;
            });
        }
    }

    $scope.createPlayer = function(){
        PlayerService.create().then(function(response){
            $scope.players.push(response.data);
        });
    }

    $scope.deletePlayer = function(player){
        PlayerService.deleteById(player.id).then(function(response){
            var index = $scope.players.indexOf(player);
            $scope.players.splice(index, 1);
        });
    }

    $scope.loadUsers = function(){
        var players = UserService.getAll().then(function(response){
            $scope.users = response.data.users;
        });
    }

    $scope.createUser = function(username, password){
        UserService.create(username, password).then(function(response){
            if(response.data.id){
                $scope.users.push(response.data);
            }else{
                alert(response.data);
                console.log(response.data);
            }
        });
    }

    $scope.deleteUser = function(user){
        if(user && user.id){
            UserService.deleteById(user.id).then(function(response){
                var index = $scope.users.indexOf(user);
                $scope.users.splice(index, 1);
            });
        }
    }

    $scope.loadTeams = function(){
        var teams = TeamService.getAll().then(function(response){
            $scope.teams = response.data.teams;
            console.log($scope.teams);
        });
    }

    $scope.loadTeamPlayers = function(team){
        console.log("Loading Players for Team " + team.id);
        TeamService.getPlayers(team.id).then(function(data){
            team.players = data.data.team;
        });
    }

    $scope.createTeam = function(teamname, league_id){
        TeamService.create(teamname, league_id).then(function(response){
            if(response.data.id){
                $scope.teams.push(response.data);
            }else{
                alert(response.data.error);
                console.log(response.data);
            }
        });
    }

    $scope.deleteTeam = function(team){
        if(team && team.id){
            TeamService.deleteById(team.id).then(function(response){
                var index = $scope.teams.indexOf(team);
                $scope.teams.splice(index, 1);
            });
        }
    }

    $scope.loadGames = function(){
        var games = GameService.getAll().then(function(response){
            console.log(response.data);
            $scope.games = response.data.games;
        });
    }

    $scope.createGame = function(team1_id, team2_id){
        GameService.create(team1_id, team2_id, 0, 0).then(function(response){
            console.log(response);
            if(response.data.game.id){
                $scope.games.push(response.data.game);
            }else{
                alert(response.data);
                console.log(response.data);
            }
        });
    }

    $scope.deleteGame = function(game){
        if(game && game.id){
            GameService.deleteById(game.id).then(function(response){
                var index = $scope.games.indexOf(game);
                $scope.games.splice(index, 1);
            });
        }
    }

    $scope.loadGameEvents = function(game){
        if(game && game.id){
            GameService.loadEventsByGameId(game.id).then(function(response){
                console.log(response);
                if(response.data[0].id) {
                    console.log(response);
                    game.events = response.data;
                }else{
                    console.log(response.data);
                    alert(response.data);
                }
            });
        }
    }

    $scope.nextGameEvent = function(game,team1_player_id, team2_player_id){
        if(game && game.id){
            GameService.nextGameEvent(game.id, team1_player_id, team2_player_id).then(function(response){
                console.log(response);
                if(response.data[0].id){
                    console.log(response);
                    game.events.push(response.data[0]);
                }else{
                    console.log(response.data);
                    alert(response.data);
                }
            });
        }
    }

    $scope.loadPositions = function(event){
        if(event && event.id){
            GameService.getPositionsByEventId(event.id).then(function(response){
                console.log(response);
                //if(!event.positions){
                  //  event.positions = [];
                //}
                event.positions = [response.data];

                console.log(event.positions);
            });
        }
    }

    $scope.startGame = function(game){
        if(game && game.id){
            GameService.startGameEvent(game.id).then(function(response){
                console.log(response);
                game.events.push(response.data);
            });
        }
    }
});