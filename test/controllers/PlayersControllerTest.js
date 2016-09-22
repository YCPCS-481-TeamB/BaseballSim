var assert = require('assert');
var PlayersController = require('../../Controller/PlayersController');

//Player Setup
var firstname = 'John';
var lastname = 'Doe';
var position = 'Pitcher';
var team_id = 1;
var player = PlayersController.createPlayer(firstname, lastname, position, team_id);

//Run Tests
test_create_player();
test_create_random_player();
test_delete_players_by_id();
test_delete_player_by_team_id();
test_get_players();
test_get_players_by_id();
console.log("All tests completed");

//Tests the createPlayer function
function test_create_player()
{
    //Asserts that the return value is not null
    assert.notEqual(null, player);
    //Asserts that it returns a Promise function
    assert.equal(Promise.name, player.constructor.name);
}

//Tests the createRandomPlayer function
function test_create_random_player()
{
    var randomPlayer = PlayersController.createRandomPlayer(team_id);
    //Asserts that the return value is not null
    assert.notEqual(null, randomPlayer);
    //Asserts that it returns a Promise function
    assert.equal(Promise.name, randomPlayer.constructor.name);
}

//Tests the getPlayerAtrributesById function
function test_get_player_atrributes_by_id()
{
    var playerAttributes = player.getPlayerAttributesById();
    //Asserts that the return value is not null
    assert.notEqual(null, playerAttributes);
    //Asserts that it returns a Promise function
    assert.equal(Promise.name, playerAttributes.constructor.name);
}

//Tests the createRandomAttr function
function test_create_random_attributes()
{
    var playerAttributes = player.createRandomAttr();
    //Asserts that the return value is not null
    assert.notEqual(null, playerAttributes);
    //Asserts that it returns a Promise function
    assert.equal(Promise.name, playerAttributes.constructor.name);
}

//Tests the deletePlayersById function
function test_delete_players_by_id()
{
    var deletedPlayer = PlayersController.deletePlayersById(player.id);
    //Asserts that the return value is not null
    assert.notEqual(null, deletedPlayer);
    //Asserts that it returns a Promise function
    assert.equal(Promise.name, deletedPlayer.constructor.name);
}

//Tests the deletePlayerByTeamId function
function test_delete_player_by_team_id()
{
    var deletedPlayer = PlayersController.deletePlayerByTeamId(player.id);
    //Asserts that the return value is not null
    assert.notEqual(null, deletedPlayer);
    //Asserts that it returns a Promise function
    assert.equal(Promise.name, deletedPlayer.constructor.name);
}

//Tests the getPlayers function
function test_get_players()
{
    var players = PlayersController.getPlayers();
    //Asserts that the return value is not null
    assert.notEqual(null, players);
    //Asserts that it returns a Promise function
    assert.equal(Promise.name, players.constructor.name);
}

//Tests the getPlayersById function
function test_get_players_by_id()
{
    var players = PlayersController.getPlayersById(player.id);
    //Asserts that the return value is not null
    assert.notEqual(null, players);
    //Asserts that it returns a Promise function
    assert.equal(Promise.name, players.constructor.name);
}
