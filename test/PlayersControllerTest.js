var assert = require('assert');
var PlayersController = require('../Controller/PlayersController');

//Run Tests
test_create_player();
test_create_random_player();
//test_delete_player();
test_get_players();
test_get_players_by_id();

//Tests the createPlayer function
function test_create_player()
{
    var player = PlayersController.createPlayer('John', 'Doe', 'Pitcher', 1);
    assert.notEqual(null, player);
}

//Tests the createRandomPlayer function
function test_create_random_player()
{
    var player = PlayersController.createRandomPlayer(1);
    assert.notEqual(null, player);
}

//Tests the deletePlayer function
function test_delete_player()
{
    var player = PlayersController.deletePlayer(1);
    assert.notEqual(null, player);
}


//Tests the getPlayers function
function test_get_players()
{
    var players = PlayersController.getPlayers();
    assert.notEqual(null, players);
}

//Tests the getPlayersById function
function test_get_players_by_id()
{
    var player = PlayersController.getPlayersById(1);
    assert.notEqual(null, player);
}
