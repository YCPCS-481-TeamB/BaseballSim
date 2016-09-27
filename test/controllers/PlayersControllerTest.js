var assert = require('assert');
var PlayersController = require('../../Controller/PlayersController');

//Player Setup
var firstname = 'John';
var lastname = 'Doe';
var position = 'pitcher';
var team_id = 1;
var player_id = 1;

var testsComplete = 0;
var totalTests = 8;

//Run Tests
test_create_player();
test_create_random_player();
test_get_player_atrributes_by_id();
test_get_players();
test_get_players_by_id();
test_get_players_by_team_id();
test_delete_players_by_id();
test_delete_players_by_team_id();

//Tests the createPlayer function
function test_create_player()
{
    var player = PlayersController.createPlayer(firstname, lastname, position, team_id);
    //Asserts that the return value is not null
    assert.notEqual(null, player);
    //Asserts that it returns a Promise function
    assert.equal(Promise.name, player.constructor.name);
    player.then(
        function(value) {
            assert.notEqual({}, value)
            
            //Assertions completed
            console.log("Test: test_create_player completed");
            testsComplete++;
            if(testsComplete == totalTests)
            {
                console.log("All tests completed")
            }
        })
    .catch(
        function(reason) {
            console.log('('+reason+') in test_create_player');
    });
}

//Tests the createRandomPlayer function
function test_create_random_player()
{
    var randomPlayer = PlayersController.createRandomPlayer(team_id);
    //Asserts that the return value is not null
    assert.notEqual(null, randomPlayer);
    //Asserts that it returns a Promise function
    assert.equal(Promise.name, randomPlayer.constructor.name);
    randomPlayer.then(
        function(value) {
            //Tests to make sure the value is returning the correct type
            assert.equal('string', typeof value.firstname);
            assert.equal('string', typeof value.lastname);
            assert.equal('string', typeof value.position);
            assert.equal('number', typeof value.team_id);
            
            //Tests to make sure the value is not returning a blank string
            assert.notEqual('', value.firstname);
            assert.notEqual('', value.lastname);
            assert.notEqual('', value.position);
            
            //Assertions completed
            console.log("Test: test_create_random_player completed");
            testsComplete++;
            if(testsComplete == totalTests)
            {
                console.log("All tests completed")
                process.exit(0);
            }
        })
    .catch(
        function(reason) {
            console.log('('+reason+') in test_create_random_player');
    });
}

//Tests the getPlayerAtrributesById function
function test_get_player_atrributes_by_id()
{
    var playerAttributes = PlayersController.getPlayerAttributesById(30);
    //Asserts that the return value is not null
    assert.notEqual(null, playerAttributes);
    //Asserts that it returns a Promise function
    assert.equal(Promise.name, playerAttributes.constructor.name);
    playerAttributes.then(
        function(value) {
            //Tests to make sure the value is returning the correct type
            assert.equal('number', typeof value.technique);
            assert.equal('number', typeof value.pitch_speed);
            assert.equal('number', typeof value.endurance);
            assert.equal('number', typeof value.contact);
            assert.equal('number', typeof value.swing_speed);
            assert.equal('number', typeof value.bat_power);
            assert.equal('number', typeof value.catching);
            assert.equal('number', typeof value.throwing);
            assert.equal('number', typeof value.awareness);
            assert.equal('number', typeof value.speed);
            assert.equal('number', typeof value.clutch);
            assert.equal('string', typeof value.arm);
            
            //Tests to make sure arm is either right or left
            assert(['right','left'].some(function(arm) {
                return value.arm == arm;
            }));
            
            //Assertions completed
            console.log("Test: test_get_player_atrributes_by_id completed");
            testsComplete++;
            if(testsComplete == totalTests)
            {
                console.log("All tests completed")
                process.exit(0);
            }
        })
    .catch(
        function(reason) {
            console.log('('+reason+') in test_get_player_atrributes_by_id');
    });
}

//Tests the getPlayers function
function test_get_players()
{
    var players = PlayersController.getPlayers();
    //Asserts that the return value is not null
    assert.notEqual(null, players);
    //Asserts that it returns a Promise function
    assert.equal(Promise.name, players.constructor.name);
    players.then(
        function(value) {
            var key = Object.keys(value)[2];
            var val = value[key];
            for(var i = 0; i < val.length; i++)
            {
                var player = val[i];
                assert.equal('number', typeof player.id);
                assert.equal('string', typeof player.firstname);
                assert.equal('string', typeof player.lastname);
                assert.equal('string', typeof player.position);
                assert.equal('number', typeof player.team_id);
                assert.equal('Date', player.date_created.constructor.name);
            }
            
            //Assertions completed
            console.log("Test: test_get_players completed");
            testsComplete++;
            if(testsComplete == totalTests)
            {
                console.log("All tests completed")
                process.exit(0);
            }
        })
    .catch(
        function(reason) {
            console.log('('+reason+') in test_get_players');
    });

}

//Tests the getPlayersById function
function test_get_players_by_id()
{
    var player = PlayersController.getPlayersById(1);
    //Asserts that the return value is not null
    assert.notEqual(null, player);
    //Asserts that it returns a Promise function
    assert.equal(Promise.name, player.constructor.name);
    player.then(
        function(value) {
            //Tests to make sure the returning value is the correct type
            assert.equal('number', typeof value.id);
            assert.equal('string', typeof value.firstname);
            assert.equal('string', typeof value.lastname);
            assert.equal('string', typeof value.position);
            assert.equal('number', typeof value.team_id);
            assert.equal('Date', value.date_created.constructor.name);
            
            //Tests to see if the first player in the database matches the ones created in this file
            assert.equal(player_id, value.id);
            assert.equal(firstname, value.firstname);
            assert.equal(lastname, value.lastname);
            assert.equal(team_id, value.team_id);
            
            //Assertions completed
            console.log("Test: test_get_players_by_id completed");
            testsComplete++;
            if(testsComplete == totalTests)
            {
                console.log("All tests completed")
                process.exit(0);
            }
        })
    .catch(
        function(reason) {
            console.log('('+reason+') in test_get_players_by_id');
    });
}

//Tests the getPlayersByTeamId function
function test_get_players_by_team_id()
{
    var players = PlayersController.getPlayersByTeamId(team_id);
    //Asserts that the return value is not null
    assert.notEqual(null, players);
    //Asserts that it returns a Promise function
    assert.equal(Promise.name, players.constructor.name);
    players.then(
        function(value) {
            for(var i = 0; i < value.length; i++)
            {
                //Tests to make sure the returning value is the correct type
                assert.equal('number', typeof value[i].id);
                assert.equal('string', typeof value[i].firstname);
                assert.equal('string', typeof value[i].lastname);
                assert.equal('string', typeof value[i].position);
                assert.equal('number', typeof value[i].team_id);
                assert.equal('Date', value[i].date_created.constructor.name);
                
                //Tests the value of team_id is the correct value
                assert.equal(team_id, value[i].team_id);
            }
            
            //Assertions completed
            console.log("Test: test_get_players_by_team_id completed");
            testsComplete++;
            if(testsComplete == totalTests)
            {
                console.log("All tests completed")
                process.exit(0);
            }
            
        })
    .catch(
        function(reason) {
            console.log('('+reason+') in test_get_players_by_team_id');
    });
}

//Tests the deletePlayersById function
function test_delete_players_by_id()
{
    var player = PlayersController.createPlayer(firstname, lastname, position, team_id);
    player.then(
        function(playerValue) {
            var players = PlayersController.getPlayers();
            players.then(
                function(playersValue) {
                    var key = Object.keys(playersValue)[2];
                    var val = playersValue[key];
                    var lastPlayer = val[val.length-1];
                    var playerId = lastPlayer.id;
                    var getPlayer = PlayersController.getPlayersById(playerId);
                    
                    var deletedPlayer = PlayersController.deletePlayersById(playerId);
                    //Asserts that the return value is not null
                    assert.notEqual(null, deletedPlayer);
                    //Asserts that it returns a Promise function
                    assert.equal(Promise.name, deletedPlayer.constructor.name);
                    deletedPlayer.then(
                        function(deletedValue) {
                            var getPlayer = PlayersController.getPlayersById(playerId);
                            getPlayer.then(
                                function(getValue) {
                                    assert.equal('', getValue);
                                })
                            .catch(
                                function(reason) {
                                    console.log('('+reason+') in test_delete_players_by_id: [getPlayer]');
                                    //Assertions completed
                                    console.log("Test: test_delete_players_by_id completed");
                                    testsComplete++;
                                    if(testsComplete == totalTests)
                                    {
                                        console.log("All tests completed")
                                        process.exit(0);
                                    }
                            });
                        })
                    .catch(
                        function(reason) {
                            console.log('('+reason+') in test_delete_players_by_id: [deletedPlayer]');
                    });
                    
                })
            .catch(
                function(reason) {
                    console.log('('+reason+') in test_delete_players_by_id: [players]');
            });
            
        })
    .catch(
        function(reason) {
            console.log('('+reason+') in test_delete_players_by_id: [player]');
    });
    
}

//Tests the deletePlayerByTeamId function
function test_delete_players_by_team_id()
{   
    var delete_id = 452;
    var firstDeletedPlayers = PlayersController.deletePlayerByTeamId(delete_id);
    //Asserts that the return value is not null
    assert.notEqual(null, firstDeletedPlayers);
    //Asserts that it returns a Promise function
    assert.equal(Promise.name, firstDeletedPlayers.constructor.name);
    firstDeletedPlayers.then( 
        function(firstDeleteValue) {
            //Tests that there are no players with the team_id
            assert.equal('', firstDeleteValue.player);
            var player1 = PlayersController.createRandomPlayer(delete_id);
            player1.then(
                function(player1Value) {
                    var player2 = PlayersController.createRandomPlayer(delete_id);
                    player2.then(
                        function(player2Value) {
                            var secondDeletedPlayers = PlayersController.deletePlayerByTeamId(delete_id);
                            secondDeletedPlayers.then(
                                function(secondDeleteValue) {
                                    //Tests that it returns the players that were deleted
                                    assert.notEqual('', secondDeleteValue.player[0]);
                                    assert.notEqual('', secondDeleteValue.player[1]);
                                    var getDeletedPlayers = PlayersController.getPlayersByTeamId(delete_id);
                                    getDeletedPlayers.then(
                                        function(getDeletedValue) {
                                            //Tests that players have been deleted
                                            assert.equal('', getDeletedValue);
                                            //Assertions completed
                                            console.log("Test: test_delete_players_by_team_id completed");
                                            testsComplete++;
                                            if(testsComplete == totalTests)
                                            {
                                                console.log("All tests completed")
                                                process.exit(0);
                                            }
                                        })
                                    .catch(
                                        function(reason) {
                                            console.log('('+reason+') in test_delete_players_by_team_id: [getDeletedPlayers]');    
                                    });
                                })
                            .catch(
                                function(reason) {
                                    console.log('('+reason+') in test_delete_players_by_team_id: [secondDeleteValue]');
                            });
                        })
                    .catch(
                        function(reason) {
                            console.log('('+reason+') in test_delete_players_by_team_id: [player2]');
                    });
                })
            .catch(
                function(reason) {
                    console.log('('+reason+') in test_delete_players_by_team_id: [player1]');
            });
        })
    .catch(
        function(reason) {
            console.log('('+reason+') in test_delete_players_by_team_id: [firstDeletedPlayers]');
    });
}
