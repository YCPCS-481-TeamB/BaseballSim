var GameController = App.controller('GameController', function($scope, UserTokenFactory, GameService){

    UserTokenFactory.getUserData().then(function(user){
        GameService.loadGamesByUserId(user.id).then(function(response){
            console.log(response);
            $scope.games = response.data.games;
        }).catch(function(err){
            console.log(err);
        });
    });

    $scope.loadGames = function(){
        UserTokenFactory.getUserData().then(function(user){
            GameService.loadGamesByUserId(user.id).then(function(response){
                $scope.games = response.data;
            }).catch(function(err){
                console.log(err);
            });
        });
    }

});
