var PlayGameController = App.controller('PlayGameController', function($scope,$interval, $location, UserTokenFactory, GameService, TeamService) {
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

    $scope.nextGameEvent = function(){
        GameService.nextGameEvent(id).then(function(data){

        }).catch(function(err){
            console.log(err);
            alert(err);
        });
    }

    var checkNextActionPlayable = function(){
        GameService.getPlayableState(id).then(function(response){
            if(response.data.filter(function(item){return !item.approved == "approved";}).length == 0){
                $scope.showNextButton = true;
            }else{
                $scope.showNextButton = false;
            }
        }).catch(function(err){
           console.log(err);
        });
    }

    checkNextActionPlayable();

    $interval(checkNextActionPlayable, 10000);

});