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
    
    team.then(
        function(value) {
            test.notEqual({}, value);
            test.done();
    });
};

//Tests the buildRandomTeam function
exports['test_build_random_team'] = function(test)
{
    var team = TeamsController.buildRandomTeam(team_name, league_id);
    
    //Asserts that the return value is not null
    test.notEqual(null, team);
    //Asserts that it returns a Promise function
    test.equal(Promise.name, team.constructor.name);
    
    team.then(
        function(value) {
            test.equal('number', typeof value.id);
            test.equal('string', typeof value.name);
            test.equal('number', typeof value.league_id);
            test.equal('Date', value.date_created.constructor.name);
            
            var players = value.players;
            test.notEqual({}, players);
            test.equal(25, players.length)
            for(var i = 0; i < players.length; i++)
            {
                var player = players[i];
                test.equal('number', typeof player.id);
                test.equal('string', typeof player.firstname);
                test.equal('string', typeof player.lastname);
                test.equal('string', typeof player.position);
                test.equal('number', typeof player.team_id);
                test.equal('Date', player.date_created.constructor.name);
            }
            test.done();
    });
};
