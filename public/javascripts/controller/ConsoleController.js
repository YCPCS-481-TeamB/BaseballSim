var ConsoleController = App.controller('ConsoleController', function($scope,$document,PlayerService, UserService){
    console.log('Console Controller');

    $scope.shiftKeyDown = false;

    $scope.showPlayerList = false;
    $scope.players = [];

    $scope.showUserList = false;
    $scope.tempUsername = "";
    $scope.tempPassword = "";
    $scope.users = [];

    $scope.showTeamList = false;
    $scope.teams = [];

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

    $scope.createUser = function(username, password){
        UserService.create(username, password).then(function(response){
            if(response.data.id){
                $scope.users.push(response.data);
            }else{
                alert(response.data);
                console.log(response.data);
            }
        });
    }

    $scope.deleteUser = function(user){
        if(user && user.id){
            UserService.deleteById(user.id).then(function(response){
                var index = $scope.users.indexOf(user);
                $scope.users.splice(index, 1);
            });
        }
    }

    $scope.loadTeams = function(){
        var teams = TeamService.getAll().then(function(response){
            $scope.teams = response.data.teams;
        });
    }
});