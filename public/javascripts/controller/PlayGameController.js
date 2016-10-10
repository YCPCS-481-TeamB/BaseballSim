var PlayGameController = App.controller('PlayGameController', function($scope, $location, UserTokenFactory, GameService, TeamService) {
    var url = $location.absUrl();
    var id = url.substring(url.lastIndexOf('/')+1);

    GameService.loadEventsByGameId(id).then(function (response) {
        $scope.gameEvents = response.data;
        console.log(response.data);
    });

    $scope.startGame = function(){
        GameService.startGameEvent(id).then(function(response){
            if(typeof response.data == 'object'){
                $scope.gameEvents.push(response.data);
            }else{
                alert(response.data);
            }
        }).catch(function(err){
            console.log(err);
        });
    }

});