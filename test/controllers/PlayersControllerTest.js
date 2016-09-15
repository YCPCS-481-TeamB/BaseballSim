var assert = require('assert');
var PlayersController = require('../../Controller/PlayersController');

//Player Setup
var firstname = 'John';
var lastname = 'Doe';
var position = 'Pitcher';
var team_id = 1;
var player = PlayersController.createPlayer(firstname, lastname, position, team_id);

//Run Tests
//test_create_player();
//test_create_random_player();
//test_delete_player();
//test_get_players();
//test_get_players_by_id();

//Tests the createPlayer function
function test_create_player()
{
    assert.notEqual(null, player);
}

//Tests the createRandomPlayer function
function test_create_random_player()
{
    var randomPlayer = PlayersController.createRandomPlayer(team_id);
    assert.notEqual(null, randomPlayer);
}

//Tests the deletePlayer function
function test_delete_player()
{
    var player = PlayersController.deletePlayer(player.id);
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
    var player = PlayersController.getPlayersById(player.id);
    assert.notEqual(null, player);
}
