var UnitTestDemoController = App.controller('UnitTestDemoController', function($scope, $http){

    $scope.messages = [];

    $scope.showCached = false;

    $scope.user1;
    $scope.user2;

    $scope.user1Token;
    $scope.user2Token;

    function addMessage(message, success){
        $scope.messages.push({success: success, message: message});
    }

    $scope.startTesting = function(){
        addMessage("STARTING TEST...", true);
        addMessage("CREATING PLAYER 1", true);
        testPlayerCreation().then(function(user){
            $scope.user1 = user;
            $scope.$apply();
            addMessage("CREATING PLAYER 2", true);
        }).then(
        testPlayerCreation().then(function(user){
            $scope.user2 = user;
            $scope.$apply();
        })).then(testLogin(user1.username, user1.password).then(function(token){
            console.log(token);
            $scope.user1Token = token;
        }));
    }

    function testPlayerCreation(){
        return new Promise(function(resolve, reject){
            var username = createRandomString(10);
            var password = createRandomString(10);
            var firstname = createRandomString(10);
            var lastname = createRandomString(10);
            var email = createRandomString(10);

            addMessage("Attempting To Create player with these credentials: username: "+ username+" password: "+password +" firstname: "+ firstname+" lastname: "+lastname + " email: "+ email, true);

            $http.post('/api/users', {username: username, password: password}).then(function(data){
                addMessage(JSON.stringify(data), true);
                resolve(data.data.user);
            }).catch(function(err){
                addMessage(JSON.stringify(err), false);
                reject(err);
            });
        });
    }

    function testLogin(username, password){
        return new Promise(function(resolve, reject){
            $http.post('/api/users/token', {username: username, password: password}).then(function(data){
                if(data.data.success == true){
                    token = data.data.token;
                    addMessage(data, true);
                    resolve(token);
                }else{
                    reject(data.data.error);
                    addMessage(data, false);
                }
            }).catch(function(err){
                reject(err);
            });
        });
    }

    function testTeamCreation(){

    }

    function testAcceptGame(){

    }

    function testGameCreation(){

    }

    function testGamePlay(){

    }


    function createRandomString(size)
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < size; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
});

