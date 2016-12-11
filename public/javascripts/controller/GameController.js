var GameController = App.controller('GameController', function($scope, UserTokenFactory, GameService, TeamService, ApprovalService){
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

    $scope.loadGameApprovals = function(game){
        UserTokenFactory.getUserData().then(function(user){
           GameService.getPlayableState(game.id).then(function(data){
               var approvals = data.data.approvals;
               if(approvals.filter(function(item){return item.approved === "declined"}).length > 0){
                   game.playable_state = "declined";
               }else if(approvals.filter(function(item){return item.approved === 'pending' && item.approver_user_id != user.id}).length > 0){
                       game.playable_state = "waiting";
               }
               else if(approvals.filter(function(item){return item.approved === "approved"}).length > 0){
                   game.playable_state = "approved";
               }else{
                   game.playable_state = "pending";
               }
           }).catch(function(err){
                console.log(err);
           });
        });
    }

    function getApprovalForGame(id){
        return new Promise(function(resolve, reject){
            UserTokenFactory.checkTokenValidity().then(function(valid){
                if(valid == true){
                    ApprovalService.getAll().then(function(response){
                        var approvals = response.data.approvals;
                        if(approvals.length > 0){
                            resolve(approvals.filter(function(item){
                                return item.item_type == 'games' && item.item_id == id;
                            })[0]);
                        }
                    }).catch(function(err){
                        reject(err);
                    });
                }
            }).catch(function(err){
                reject(err);
            });
        });
    }

    $scope.approveGame = function(game){
        getApprovalForGame(game.id).then(function(approval){
            approve(approval);
        }).catch(function(err){
           console.log(err);
        });
    }

    $scope.declineGame = function(game){
        getApprovalForGame(game.id).then(function(approval){
            decline(approval);
        }).catch(function(err){
            console.log(err);
        });
    }


    function approve(approval){
        ApprovalService.setStatus(approval.id, 'approved').then(function(data){
            console.log(data.data.approvals);
            if(data.data.approvals.item_type === 'games'){
                window.location.assign("/games/"+data.data.approvals.item_id);
            }
        }).catch(function(err){
            console.log(err);
        });
    }

    function decline(approval){
        UserTokenFactory.getUserData().then(function(user) {
            ApprovalService.setStatus(approval.id, 'declined').then(function (data) {
                GameService.loadGamesByUserId(user.id).then(function (response) {
                    $scope.games = response.data.games;
                }).catch(function (err) {
                    console.log(err);
                });
            }).catch(function (err) {
                console.log(err);
            });
        });
    }

    $scope.getGameMessage = function(game){
        game.message = "Loading...";
        TeamService.getById(game.team1_id).then(function(team1){
            var team1 = team1.data.team[0];
            TeamService.getById(game.team2_id).then(function(team2){
                var team2 = team2.data.team[0];
                game.message = "Game " + game.id + ": "  + team1.name + " against " + team2.name;
                console.log(game.message);
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
