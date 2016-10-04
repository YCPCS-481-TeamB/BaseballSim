var GameController = require('../../Controller/GameController');

var team_id1 = 1;
var team_id2 = 2;
var field_id = 0;
var league_id = 0;


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
