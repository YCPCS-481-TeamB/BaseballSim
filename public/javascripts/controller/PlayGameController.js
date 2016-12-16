var PlayGameController = App.controller('PlayGameController', function($scope,$interval, $location, UserTokenFactory, GameService, TeamService,PlayerService, ApprovalService) {
    var url = $location.absUrl();
    var id = url.substring(url.lastIndexOf('/')+1);
    $scope.game_id = id;
    $scope.showNextButton = true;
    $scope.showLineupChooser = false;

    var temp = ['strike','ball','foul','single','double','triple','home_run','out'];

    $scope.opts = {};

    $scope.startGame = function(){
        UserTokenFactory.getUserData().then(function(user) {
            GameService.startGameEvent(id).then(function (response) {
                if (typeof response.data == 'object') {
                    $scope.gameEvents.push(response.data);
                } else {
                    alert(response.data);
                }
            }).catch(function (err) {
                console.log(err);
            });
        });
    }

    $scope.team = [];

    UserTokenFactory.getUserData().then(function(user){
        GameService.getTeamPlayersByUserId(id, user.id).then(function(team){
            if($scope.lineup && $scope.lineup.length > 0){
                $scope.team = team.data.players.filter(function(item){
                    return $scope.lineup.map(function(item2){return item2.player_id}).indexOf(item.id) == -1;
                });
            }else{
                $scope.team = team.data.players;
            }
        });
    });

    $scope.loadLineupPlayer = function(player){
        UserTokenFactory.getUserData().then(function(user){
            if(!player.player_data){
                PlayerService.getById(player.player_id).then(function(result){
                   var player_data = result.data.player;
                    player.player_data = result.data.player;
                });
            }
        });
    }

    $scope.nextGameEvent = function(){
        UserTokenFactory.getUserData().then(function(user) {
            ApprovalService.getAll().then(function(approvals){
                var approvals = approvals.data.approvals;
                var gameApprovals = approvals.filter(function(item){
                    return (item.item_type == 'games' && item.item_id == id);
                });
                if(gameApprovals.length > 0){
                    var approval = gameApprovals[0];
                    ApprovalService.setStatus(approval.id, 'approved').then(function(){
                        GameService.nextGameEvent(id).then(function (data) {

                        }).catch(function (err) {
                            console.log(err);
                            alert(err.data);
                        });
                    });
                }else{
                    GameService.nextGameEvent(id).then(function (data) {

                    }).catch(function (err) {
                        console.log(err);
                        alert(err.data);
                    });
                }
            });

        });
    }

    var checkNextActionPlayable = function(){
        UserTokenFactory.getUserData().then(function(user) {
            GameService.getPlayableState(id).then(function (response) {
                var approvals = response.data.approvals;
                if (approvals){
                    $scope.showNextButton = approvals.filter(function (item) {return item.approved != "approved" && item.approver_user_id != user.id;}).length == 0;
                }else{
                    console.log("error: ", response);
                }
            }).catch(function (err) {
                console.log(err);
            });
        });
    }

    $scope.selectLineupPosition = function(pos){
        if($scope.lineup && $scope.lineup.players.length>0){
            $scope.lineup.pitcher.selected = false;
            $scope.lineup.players.map(function(item){
               item.selected = false;
                return item;
            });
            pos.selected = true;
        }
    }

    $scope.selectTeamPosition = function(pos){
        if($scope.team && $scope.team.length>0){
            $scope.team.map(function(item){
                item.selected = false;
                return item;
            });
            pos.selected = true;
        }
    }

    $scope.swapSelected = function(){
        var selectedTeamPos = $scope.team.filter(function(item){return item.selected});
        var selectedLineupPos = $scope.lineup.players.filter(function(item){return item.selected});

        if(selectedTeamPos.length > 0){
            selectedTeamPos = selectedTeamPos[0];
        }

        if(selectedLineupPos.length > 0){
            selectedLineupPos = selectedLineupPos[0];
        }else if($scope.lineup.pitcher.selected === true){
            var selectedLineupPos = $scope.lineup.pitcher;
        }

        if(!selectedLineupPos.is_pitcher){
            var temp = $scope.lineup.players[$scope.lineup.players.indexOf(selectedLineupPos)].player_data;
            temp.selected = false;
            $scope.lineup.players[$scope.lineup.players.indexOf(selectedLineupPos)].player_id = selectedTeamPos.id;
            $scope.lineup.players[$scope.lineup.players.indexOf(selectedLineupPos)].selected = false;
            $scope.lineup.players[$scope.lineup.players.indexOf(selectedLineupPos)].player_data = selectedTeamPos;
        }else{
            var temp = $scope.lineup.pitcher.player_data;
            temp.selected = false;
            $scope.lineup.pitcher.player_id = selectedTeamPos.id;
            $scope.lineup.pitcher.player_data = selectedTeamPos;
        }

        $scope.team[$scope.team.indexOf(selectedTeamPos)] = temp;


        var newLineup = {"pitcher" : $scope.lineup.pitcher.player_id, "players": $scope.lineup.players.map(function(item){return item.player_id})};

        GameService.updateLineup(id, $scope.team[0].team_id, newLineup).then(function(result){
            console.log(result);
        }).catch(function(err){
           console.log(err);
        });
    }

    var checkPlayerLineup = function(){
        if($scope.showLineupChooser == false){
            UserTokenFactory.getUserData().then(function(user){
                GameService.getLineup(id, user.id).then(function(data){
                    $scope.lineup = data.data;
                    $scope.team = $scope.team.filter(function(item){
                        return $scope.lineup.players.map(function(item2){return item2.player_id}).concat([$scope.lineup.pitcher.player_id]).indexOf(item.id) == -1;
                    });
                }).catch(function(err){
                    console.log(err);
                });
            });
        }
    }

    var updateScoreBoard = function(){
        $scope.team1_score = $scope.gameEvents[0].team1_score;
        $scope.team2_score = $scope.gameEvents[0].team2_score;
        $scope.balls = $scope.gameEvents[0].balls;
        $scope.strikes = $scope.gameEvents[0].strikes;
        $scope.outs = $scope.gameEvents[0].outs;
        $scope.inning = $scope.gameEvents[0].inning;
        $scope.team_at_bat = $scope.gameEvents[0].team_at_bat;
    }

    var updateGameEvents = function(){
        GameService.loadEventsByGameId(id).then(function (response) {
            //if($scope.response.data.events.length != $scope.gameEvents.length){
                $scope.gameEvents = response.data.events;
                $scope.gameEvents.reverse();

                for(var i = 0;i<temp.length;i++){
                    $scope.opts[temp[i]] = $scope.gameEvents.filter(function(item){
                        return item.type == temp[i];
                    }).length;
                }
            //}
        });
    }

    var updatePlayerPositions = function(){
        if($scope.gameEvents && $scope.gameEvents[0]){
            var game_action_id = $scope.gameEvents[0].id;
            GameService.getGamePositionByGameEvent(game_action_id).then(function(response){
                $scope.player_positions = response.data.positions;
            });
        }
    }

    updatePlayerPositions();
    checkNextActionPlayable();
    checkPlayerLineup();
    updateGameEvents();


    $interval(updateGameEvents, 1000);
    $interval(updatePlayerPositions, 1000);
    $interval(checkNextActionPlayable, 1000);
    $interval(checkPlayerLineup, 2000);
    $interval(updateScoreBoard, 2000);

});