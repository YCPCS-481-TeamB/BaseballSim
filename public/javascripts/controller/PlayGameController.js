var PlayGameController = App.controller('PlayGameController', function($scope,$interval, $location, UserTokenFactory, GameService, TeamService) {
    var url = $location.absUrl();
    var id = url.substring(url.lastIndexOf('/')+1);
    $scope.game_id = id;
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

    $scope.nextGameEvent = function(){
        UserTokenFactory.getUserData().then(function(user) {
            GameService.nextGameEvent(id).then(function (data) {
            }).catch(function (err) {
                console.log(err);
                alert(err);
            });
        });
    }

    var checkNextActionPlayable = function(){
        UserTokenFactory.getUserData().then(function(user) {
            GameService.getPlayableState(id).then(function (response) {
                if (response.data && response.data.filter(function (item) {
                        return !item.approved == "approved";
                    }).length == 0) {
                    $scope.showNextButton = true;
                } else {
                    $scope.showNextButton = false;
                }
            }).catch(function (err) {
                console.log(err);
            });
        });
    }

    var checkPlayerLineup = function(){
        UserTokenFactory.getUserData().then(function(user){
            GameService.getLineup(id, user.id).then(function(data){
                $scope.lineup = data.data;
                console.log("LINEUP", $scope.lineup);
            }).catch(function(err){
                console.log(err);
            });
        });
    }

    var updateScoreBoard = function(){
        $scope.team1_score = $scope.gameEvents[0].team1_score;
        $scope.team2_score = $scope.gameEvents[0].team2_score;
        $scope.balls = $scope.gameEvents[0].balls;
        $scope.strikes = $scope.gameEvents[0].strikes;
        $scope.outs = $scope.gameEvents[0].outs;
    }

    var updateGameEvents = function(){
        GameService.loadEventsByGameId(id).then(function (response) {
            $scope.gameEvents = response.data;
            $scope.gameEvents.reverse();
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
    $interval(checkPlayerLineup, 1000);
    $interval(updateScoreBoard, 2000);

});