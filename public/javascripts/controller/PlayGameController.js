var PlayGameController = App.controller('PlayGameController', function($scope,$interval, $location, UserTokenFactory, GameService, TeamService) {
    var url = $location.absUrl();
    var id = url.substring(url.lastIndexOf('/')+1);

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
                //console.log(data);
                //$scope.gameEvents.push(data.data);
            }).catch(function (err) {
                console.log(err);
                alert(err);
            });
        });
    }

    var checkNextActionPlayable = function(){
        UserTokenFactory.getUserData().then(function(user) {
            GameService.getPlayableState(id).then(function (response) {
                if (response.data.filter(function (item) {
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
                console.log(data);
                $scope.lineup = data.data;
            }).catch(function(err){
                console.log(err);
            });
        });
    }

    var updateScoreBoard = function(){
        $scope.team1_score = $scope.gameEvents[$scope.gameEvents.length-1].team1_score;
        $scope.team2_score = $scope.gameEvents[$scope.gameEvents.length-1].team2_score;
        $scope.balls = $scope.gameEvents[$scope.gameEvents.length-1].balls;
        $scope.strikes = $scope.gameEvents[$scope.gameEvents.length-1].strikes;
        $scope.outs = $scope.gameEvents[$scope.gameEvents.length-1].outs;
    }

    var updateGameEvents = function(){
        GameService.loadEventsByGameId(id).then(function (response) {
            $scope.gameEvents = response.data;
            $scope.gameEvents.reverse();
        });
    }

    checkNextActionPlayable();
    checkPlayerLineup();
    updateGameEvents();

    $interval(updateGameEvents, 1000);
    $interval(checkNextActionPlayable, 1000);
    $interval(checkPlayerLineup, 1000);
    $interval(updateScoreBoard, 2000);

});