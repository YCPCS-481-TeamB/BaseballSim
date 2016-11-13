var AutoPlayController = App.controller('AutoPlayController', function($scope,$interval, $location, UserTokenFactory, GameService, TeamService) {
    var url = $location.absUrl();
    var id = url.substring(url.indexOf('/games/')+"/games".length+1, url.indexOf('/autoplay'));
    $scope.game_id = id;

    var temp = ['strike','ball','foul','single','double','triple','home_run','out'];

    $scope.startGame = function(){
        UserTokenFactory.getUserData().then(function(user) {
            GameService.startGameEvent(id).then(function (response) {
                if (typeof response.data == 'object') {
                    $scope.gameEvents.push(response.data);
                    $scope.playGame();
                } else {
                    console.log(response.data);
                    alert(response.data);
                }
            }).catch(function (err) {
                console.log(err);
            });
        });
    }

    $scope.playGame = function(){
        var keepPlaying = true;

        while(keepPlaying === true){
            GameService.loadEventsByGameId(id).then(function(events){
                $scope.gameEvents = events.data;

                if(events.data[events.data.length-1].type == 'end'){
                    keepPlaying = false;
                }else{
                    var wait = true;
                    GameService.nextGameEvent(game_id,undefined, undefined).then(function(result){
                        wait = false;
                    }).catch(function(err){
                        console.log(err);
                        alert(err);
                        break;
                    });

                    while(wait){
                        //DO NOTHING;
                    }
                }

            }).catch(function(err){
                console.log(err);
                alert(err);
            });
        }
    }
});