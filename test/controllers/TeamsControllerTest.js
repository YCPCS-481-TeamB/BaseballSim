var TeamsController = require('../../Controller/TeamsController');

var team_name = 'Team';
var league_id = 0;

//Tests the createTeam function
exports['test_create_team'] = function(test)
{
    var team = TeamsController.createTeam(team_name, league_id);
    
    //Asserts that the return value is not null
    test.notEqual(null, team);
    //Asserts that it returns a Promise function
    test.equal(Promise.name, team.constructor.name);
    
    test.done();
};