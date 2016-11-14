var UnitTestDemoController = App.controller('UnitTestDemoController', function($scope, $http){

    $scope.messages = [];

    $scope.showCached = false;

    $scope.createdPlayers = [];
    $scope.createdTeams = [];
    $scope.createdGames = [];

    function addMessage(message, success){
        $scope.messages.push({success: success, message: message});
    }

    $scope.startTesting = function(){
        addMessage("STARTING TEST...", true);
        //var promises = [testPlayerCreation(), testPlayerCreation(),loginCreatedPlayers()];
        //addMessage(promises.length + ' tests to run...', true);
        testPlayerCreation();

        //testPlayerCreation().then(testPlayerCreation()).then(loginCreatedPlayers());

    }

    function testPlayerCreation(){
        return new Promise(function(resolve, reject){
            addMessage("Adding Player " + ($scope.createdPlayers.length+1));
            var username = createRandomString(10);
            var password = createRandomString(10);
            var firstname = createRandomString(10);
            var lastname = createRandomString(10);
            var email = createRandomString(10);

            addMessage("Attempting To Create player with these credentials: username: "+ username+" password: "+password +" firstname: "+ firstname+" lastname: "+lastname + " email: "+ email, true);

            $http.post('/api/users', {username: username, password: password}).then(function(data){
                addMessage(JSON.stringify(data), true);
                data.data.user.plainTextPassword = password;
                $scope.createdPlayers.push(data.data.user);
                testLogin(username, password).then(function(token){
                    data.data.user.token = token;
                    testTeamCreation(createRandomString(10), token).then(function(teams){
                        testTeamCreation(createRandomString(10), token).then(function(team2){
                            testGameCreation($scope.createdTeams[0].id, $scope.createdTeams[1].id, token).then(function(game){
                                testAcceptGame(token).then(function(accepts){
                                    resolve(data.data.user);
                                }).catch(function(err){
                                    reject(err);
                                });
                            }).catch(function(err){
                               reject(err);
                            });
                        }).catch(function(err){reject(err);})
                           reject(err);
                    }).catch(function(err){reject(err);})
                }).catch(function(err){
                    reject(err);
                });

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
                    addMessage(data, false);
                    reject(data.data.error);
                }
            }).catch(function(err){
                reject(err);
            });
        });
    }

    function testTeamCreation(teamname, token){
        return new Promise(function(resolve, reject){
            $http.post('/api/teams', {teamname: teamname, league_id: 0}, {headers: {"x-access-token" : token}}).then(function(data){
                addMessage("Added team with name" + teamname, true);
                $scope.createdTeams.push(data.data.teams);
                addMessage("Team: " + JSON.stringify(data), true);
                resolve(data.data.teams);
            }).catch(function(err){
                addMessage(err, false);
              reject(err);
            });
        });
    }

    //function getTeams(user_id, token){
    //    new Promise(function(resolve, reject){
    //        $http.get('/api/users/'+ user_id +'/teams', {headers: {"x-access-token" : token}}).then(function(data){
    //            addMessage(data.data.teams, true);
    //        }).catch(function(err){
    //            addMessage("Error getting teams", false);
    //            reject(err);
    //        });
    //    });
    //}

    function testAcceptGame(token){
        return new Promise(function(resolve, reject){
            $http.get('/api/approvals/user/pending',{headers: {"x-access-token" : token}}).then(function(approvals){
                addMessage(JSON.stringify(approvals), true);
                resolve(approvals);
            }).catch(function(err){
                addMessage(JSON.stringify(err), false);
                reject(err);
            });
        });
    }

    function testGameCreation(team1_id, team2_id, token){
        new Promise(function(resolve, reject){
            $http.post('/api/games', {team1_id: team1_id, team2_id: team2_id, field_id: 0, league_id: 0},{headers: {"x-access-token" : token}}).then(function(result){
                $scope.createdGames.push(result.data.game);
                addMessage("GAME: " + JSON.stringify(result), true);
                resolve(result.data.game);
            }).catch(function(err){
                addMessage("ERR: " + JSON.stringify(err), false);
                reject(err);
            });
        });
    }

    function testGamePlay(){
        new Promise(function(resolve, reject){

        });
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

