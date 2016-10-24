var GameController = App.controller('GameController', function($scope, UserTokenFactory, GameService, TeamService){
    $scope.selectedGame;

    UserTokenFactory.getUserData().then(function(user){
        GameService.loadGamesByUserId(user.id).then(function(response){
            $scope.games = response.data.games;
        }).catch(function(err){
            console.log(err);
        });
    })

    UserTokenFactory.getUserData().then(function(user){
        TeamService.getTeamByUserId(user.id).then(function(response){
            $scope.myTeams = response.data.teams;
        });
    });

   TeamService.getAll().then(function(response){
       console.log(response);
       $scope.theirTeams = response.data.teams;
   });


    $scope.loadGames = function(){
        UserTokenFactory.getUserData().then(function(user){
            GameService.loadGamesByUserId(user.id).then(function(response){
                $scope.games = response.data.games;
            }).catch(function(err){
                console.log(err);
            });
        });
    }

    $scope.createNewGame = function(team1_id, team2_id){
        GameService.create(team1_id, team2_id, 0, 0).then(function(response){
            $scope.games.push(response.data.game);
        });
    }

    $scope.updateGame = function(game){
        GameService.updateGame(game.team1_id, game.team2_id).then(function(response){
            console.log(response);
        }).catch(function(err){
            console.log(err);
        })
    }

    $scope.deleteGame = function(game){
        if(game && game.id){
            GameService.deleteById(game.id).then(function(response){
                var index = $scope.games.indexOf(game);
                $scope.games.splice(index, 1);
            });
        }
    }

});
