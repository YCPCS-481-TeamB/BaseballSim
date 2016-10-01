var PlayersController = require('../../Controller/PlayersController');

//Player Setup
var firstname = 'John';
var lastname = 'Doe';
var position = 'pitcher';
var team_id = 1;
var player_id = 1;


//Tests the createPlayer function
exports['test_create_player'] = function(test)
{
    var player = PlayersController.createPlayer(firstname, lastname, position, team_id);
    //Asserts that the return value is not null
    test.notEqual(null, player);
    //Asserts that it returns a Promise function
    test.equal(Promise.name, player.constructor.name);
    player.then(
        function(value) {
            test.notEqual({}, value);
            test.done();
    });
};

//Tests the createRandomPlayer function
exports['test_create_random_player'] = function(test)
{
    var randomPlayer = PlayersController.createRandomPlayer(team_id);
    //Asserts that the return value is not null
    test.notEqual(null, randomPlayer);
    //Asserts that it returns a Promise function
    test.equal(Promise.name, randomPlayer.constructor.name);
    randomPlayer.then(
        function(value) {
            //Tests to make sure the value is returning the correct type
            test.equal('string', typeof value.firstname);
            test.equal('string', typeof value.lastname);
            test.equal('string', typeof value.position);
            test.equal('number', typeof value.team_id);
            
            //Tests to make sure the value is not returning a blank string
            test.notEqual('', value.firstname);
            test.notEqual('', value.lastname);
            test.notEqual('', value.position);
            test.done();
    });
};

//Tests the getPlayerAtrributesById function
exports['test_get_player_atrributes_by_id'] = function(test)
{
    var playerAttributes = PlayersController.getPlayerAttributesById(30);
    //Asserts that the return value is not null
    test.notEqual(null, playerAttributes);
    //Asserts that it returns a Promise function
    test.equal(Promise.name, playerAttributes.constructor.name);
    playerAttributes.then(
        function(value) {
            //Tests to make sure the value is returning the correct type
            test.equal('number', typeof value.technique);
            test.equal('number', typeof value.pitch_speed);
            test.equal('number', typeof value.endurance);
            test.equal('number', typeof value.contact);
            test.equal('number', typeof value.swing_speed);
            test.equal('number', typeof value.bat_power);
            test.equal('number', typeof value.catching);
            test.equal('number', typeof value.throwing);
            test.equal('number', typeof value.awareness);
            test.equal('number', typeof value.speed);
            test.equal('number', typeof value.clutch);
            test.equal('string', typeof value.arm);
            
            /*
            //Tests to make sure arm is either right or left
            test(['right','left'].some(function(arm) {
                return value.arm == arm;
            }));*/
            test.done();
    });
};

//Tests the getPlayers function
exports['test_get_players'] = function(test)
{
    var players = PlayersController.getPlayers();
    //Asserts that the return value is not null
    test.notEqual(null, players);
    //Asserts that it returns a Promise function
    test.equal(Promise.name, players.constructor.name);
    players.then(
        function(value) {
            var key = Object.keys(value)[2];
            var val = value[key];
            for(var i = 0; i < val.length; i++)
            {
                var player = val[i];
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

//Tests the getPlayersById function
exports['test_get_player_by_id'] = function(test)
{
    var player = PlayersController.getPlayersById(1);
    //Asserts that the return value is not null
    test.notEqual(null, player);
    //Asserts that it returns a Promise function
    test.equal(Promise.name, player.constructor.name);
    player.then(
        function(value) {
            //Tests to make sure the returning value is the correct type
            test.equal('number', typeof value.id);
            test.equal('string', typeof value.firstname);
            test.equal('string', typeof value.lastname);
            test.equal('string', typeof value.position);
            test.equal('number', typeof value.team_id);
            test.equal('Date', value.date_created.constructor.name);
            
            //Tests to see if the first player in the database matches the ones created in this file
            test.equal(player_id, value.id);
            test.equal(firstname, value.firstname);
            test.equal(lastname, value.lastname);
            test.equal(team_id, value.team_id);
            test.done();
    });
};

//Tests the getPlayersByTeamId function
exports['test_get_players_by_team_id'] = function(test)
{
    var players = PlayersController.getPlayersByTeamId(team_id);
    //Asserts that the return value is not null
    test.notEqual(null, players);
    //Asserts that it returns a Promise function
    test.equal(Promise.name, players.constructor.name);
    players.then(
        function(value) {
            for(var i = 0; i < value.length; i++)
            {
                //Tests to make sure the returning value is the correct type
                test.equal('number', typeof value[i].id);
                test.equal('string', typeof value[i].firstname);
                test.equal('string', typeof value[i].lastname);
                test.equal('string', typeof value[i].position);
                test.equal('number', typeof value[i].team_id);
                test.equal('Date', value[i].date_created.constructor.name);
                
                //Tests the value of team_id is the correct value
                test.equal(team_id, value[i].team_id);
            }
            test.done();
    });
};

//Tests the deletePlayersById function
exports['test_delete_players_by_id'] = function(test)
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
                    
                    var deletedPlayer = PlayersController.deletePlayersById(playerId);
                    //Asserts that the return value is not null
                    test.notEqual(null, deletedPlayer);
                    //Asserts that it returns a Promise function
                    test.equal(Promise.name, deletedPlayer.constructor.name);
                    deletedPlayer.then(
                        function(deletedValue) {
                            var getPlayer = PlayersController.getPlayersById(playerId);
                            getPlayer.then(
                                function(getValue) {
                                    test.equal('', getValue);
                                    test.done();
                                })
                            .catch(
                                function(reason) {
                                    //console.log('('+reason+') in test_delete_players_by_id: [getPlayer]');
                                    test.equal('Player ' + playerId + ' not found', reason);
                                    test.done();
                            });
                    });
            });
    });
};

//Tests the deletePlayerByTeamId function
exports['test_delete_players_by_team_id'] = function(test)
{   
    var delete_id = 452;
    var firstDeletedPlayers = PlayersController.deletePlayerByTeamId(delete_id);
    //Asserts that the return value is not null
    test.notEqual(null, firstDeletedPlayers);
    //Asserts that it returns a Promise function
    test.equal(Promise.name, firstDeletedPlayers.constructor.name);
    firstDeletedPlayers.then( 
        function(firstDeleteValue) {
            //Tests that there are no players with the team_id
            test.equal('', firstDeleteValue.player);
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
                                    test.notEqual('', secondDeleteValue.player[0]);
                                    test.notEqual('', secondDeleteValue.player[1]);
                                    var getDeletedPlayers = PlayersController.getPlayersByTeamId(delete_id);
                                    getDeletedPlayers.then(
                                        function(getDeletedValue) {
                                            //Tests that players have been deleted
                                            test.equal('', getDeletedValue);
                                            test.done();
                                    });
                            });
                    });
            });
    });
};

//Tests the getStatsByPlayerId function
exports['test_get_stats_by_player_id'] = function(test)
{
    var player = PlayersController.createRandomPlayer(team_id);
    player.then(
        function(playerValue) {
            var player_id = playerValue.id;
            var playerStats = PlayersController.getStatsByPlayerId(player_id);
            //Asserts that the return value is not null
            test.notEqual(null, playerStats);
            //Asserts that it returns a Promise function
            test.equal(Promise.name, playerStats.constructor.name);
            playerStats.then(
                function(statsValue) {
                    var key = Object.keys(statsValue);
                    var i, val;
                    
                    //Tests to make sure the value is returning the correct type
                    for(i = 0; i < key.length; i++)
                    {
                        val = statsValue[key[i]];
                        test.equal('number', typeof val);
                    }
                    
                    //Tests to make sure player_id matches
                    test.equal(player_id, statsValue.player_id);
                    
                    //Tests to make sure all stats are initialized with 0 (starts with i=1 so it does not check player_id)
                    for(i = 1; i < key.length; i++)
                    {
                        val = statsValue[key[i]];
                        test.equal(0, val);
                    }
                    test.done();
            });
    });
};
