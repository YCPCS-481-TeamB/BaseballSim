var assert = require('assert');
var PlayersController = require('../../Controller/PlayersController');

//Player Setup
var firstname = 'John';
var lastname = 'Doe';
var position = 'pitcher';
var team_id = 1;
var player_id = 1;

var testsComplete = 0;
var totalTests = 6;

//Run Tests
test_create_player();
test_create_random_player();
test_get_player_atrributes_by_id();
test_get_players();
test_get_players_by_id();
test_delete_players_by_id();
//test_delete_player_by_team_id();

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
            assert.equal('number', typeof value[0].id);
            assert.equal('string', typeof value[0].firstname);
            assert.equal('string', typeof value[0].lastname);
            assert.equal('string', typeof value[0].position);
            assert.equal('number', typeof value[0].team_id);
            assert.equal('Date', value[0].date_created.constructor.name);
            
            //Tests to see if the first player in the database matches the ones created in this file
            assert.equal(player_id, value[0].id);
            assert.equal(firstname, value[0].firstname);
            assert.equal(lastname, value[0].lastname);
            assert.equal(team_id, value[0].team_id);
            
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
                    var playerId = lastPlayer.id
                    
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
            
            //Assertions completed
            console.log("Test: test_delete_players_by_id completed");
            testsComplete++;
            if(testsComplete == totalTests)
            {
                console.log("All tests completed")
                process.exit(0);
            }
        })
    .catch(
        function(reason) {
            console.log('('+reason+') in test_delete_players_by_id: [player]');
    });
    
}

//Tests the deletePlayerByTeamId function
function test_delete_player_by_team_id()
{
    /*
    var deletedPlayer = PlayersController.deletePlayerByTeamId(null);
    //Asserts that the return value is not null
    assert.notEqual(null, deletedPlayer);
    //Asserts that it returns a Promise function
    assert.equal(Promise.name, deletedPlayer.constructor.name);
    */
}
