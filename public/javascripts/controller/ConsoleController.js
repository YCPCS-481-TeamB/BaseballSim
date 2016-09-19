var ConsoleController = App.controller('ConsoleController', function($scope,$document,PlayerService, UserService){
    console.log('Console Controller');

    $scope.shiftKeyDown = false;

    $scope.showPlayerList = false;
    $scope.players = [];

    $scope.showUserList = false;
    $scope.users = [];

    $scope.loadPlayers = function(){
        var players = PlayerService.getAll().then(function(response){
            $scope.players = response.data.players;
        });
    }

    $scope.createPlayer = function(){
        PlayerService.create().then(function(response){
            $scope.players.push(response.data);
        });
    }

    $scope.deletePlayer = function(player){
        PlayerService.deleteById(player.id).then(function(response){
            var index = $scope.players.indexOf(player);
            $scope.players.splice(index, 1);
        });
    }

    $scope.loadUsers = function(){
        var players = UserService.getAll().then(function(response){
            $scope.users = response.data.users;
        });
    }

    $scope.createUser = function(){
        UserService.create().then(function(response){
            $scope.players.push(response.data);
        });
    }

    $scope.deleteUser = function(user){
        UserService.deleteById(user.id).then(function(response){
            var index = $scope.users.indexOf(user);
            $scope.users.splice(index, 1);
        });
    }
});