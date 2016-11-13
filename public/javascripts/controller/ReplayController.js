var ReplayController = App.controller('ReplayController', function($scope,$interval, $location, UserTokenFactory, GameService, TeamService) {
    var url = $location.absUrl();
    var id = url.substring(url.indexOf('/games/')+"/games".length+1, url.indexOf('/replay'));
    console.log(id);
    $scope.game_id = id;

    var temp = ['strike','ball','foul','single','double','triple','home_run','out'];

    $scope.stepsPlayed = [];

    GameService.loadEventsByGameId(id).then(function (response) {
        $scope.gameEvents = response.data;
        //$scope.gameEvents.reverse();
    });

    $scope.playNextStep = function(){
        $scope.stepsPlayed.push($scope.gameEvents[$scope.stepsPlayed.length]);
        $scope.stepsPlayed.reverse();
    }
});