var GameController = require('../../Controller/GameController');

var team_id1 = 1;
var team_id2 = 2;
var field_id = 0;
var league_id = 0;
var game_id = 1;
var player1_id = 1;
var player2_id = 2;

//Tests the createGame function
exports['test_create_game'] = function(test)
{
    var game = GameController.createGame(team_id1, team_id2, field_id, league_id);
    
    //Asserts that the return value is not null
    test.notEqual(null, game);
    //Asserts that it returns a Promise function
    test.equal(Promise.name, game.constructor.name);
    
    test.done();
};

exports['test_game_event'] = function(test)
{
    var event = GameController.doGameEvent(game_id, player1_id, player2_id);

    // Event is not null
    test.notEqual(null, event);

    // Asserts it will return a promise function
    test.equal(Promise.name, event.constructor.name);

    test.done();
};
