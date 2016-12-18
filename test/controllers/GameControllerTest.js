var GameController = require('../../Controller/GameController');

var player1 = {"id": 1, "firstname": "Test", "lastname": "John", "position": "first_baseman", "team_id": 1, "date_created": "2016-11-14T16:44:48.045Z"}
var player2 = {"id": 2, "firstname": "Test", "lastname": "John", "position": "first_baseman", "team_id": 1, "date_created": "2016-11-14T16:44:48.045Z"}

function printCalculatedNums(p1_attr, p2_attr, rand){

    //Base stats
    var ball = 25;
    var single = 10;
    var double = 5;
    var triple = 3;
    var home_run = 2;

    var strike = 25;
    var out = 20;
    var foul = 20;

    // Attributes
    var technique = p2_attr.technique;
    var pitch_speed = p2_attr.pitch_speed;
    var endurance = p2_attr.endurance;

    var contact = p1_attr.contact;
    var swing_speed = p1_attr.swing_speed;
    var bat_power = p1_attr.bat_power;

    var totalattrs = contact + swing_speed + bat_power + technique + pitch_speed + endurance;

    //Batter
    ball += ((.7 * swing_speed));
    single += ((.15 * swing_speed) + (.6 * contact));
    double += ((.3 * bat_power) + (.15 * swing_speed) + (.4 * contact));
    home_run += (.4 * bat_power);

    //Pitcher
    strike += ((.4 * endurance) + (technique));
    out += ((.3 * endurance) + (.5 * pitch_speed));
    foul += ((.5 * pitch_speed) + (.3 * endurance));

    var calc = {num: (totalattrs + rand), total_attr: totalattrs,
        batter: {
            ball: ball, single: single, double: double, home_run: home_run
        },
        pitcher: {
            strike: strike,
            out: out,
            foul: foul
        }
    }

    console.log("DATA: ", calc);

}

module.exports = {
    'basicPlayerEvent_ball': function(beforeExit, assert) {

        var player1_attr = {"id": 2, "player_id": 2, "technique": 1, "pitch_speed": 1, "endurance": 1, "contact": 1, "swing_speed": 1, "bat_power": 1, "catching": 1, "throwing": 1, "awareness": 1, "speed": 1, "clutch": 1, "arm": "left"};
        var player2_attr = {"id": 2, "player_id": 2, "technique": 1, "pitch_speed": 1, "endurance": 1, "contact": 1, "swing_speed": 1, "bat_power": 1, "catching": 1, "throwing": 1, "awareness": 1, "speed": 1, "clutch": 1, "arm": "left"};

        //Ball Between 0-19
        var event = GameController.basicPlayerEvent(player1, player1_attr, player2, player2_attr, 19);

        assert.isNotNull(event);
        assert.eql(event, 'ball');

        //Ball Between 100-?
        var event = GameController.basicPlayerEvent(player1, player1_attr, player2, player2_attr, 100);

        assert.isNotNull(event);
        assert.eql(event, 'ball');
    },
    'basicPlayerEvent_single' : function(beforeExit, assert){
        var player1_attr = {"id": 2, "player_id": 2, "technique": 1, "pitch_speed": 1, "endurance": 1, "contact": 1, "swing_speed": 1, "bat_power": 1, "catching": 1, "throwing": 1, "awareness": 1, "speed": 1, "clutch": 1, "arm": "left"};
        var player2_attr = {"id": 2, "player_id": 2, "technique": 1, "pitch_speed": 1, "endurance": 1, "contact": 1, "swing_speed": 1, "bat_power": 1, "catching": 1, "throwing": 1, "awareness": 1, "speed": 1, "clutch": 1, "arm": "left"};

        //Single between 20-30
        var event = GameController.basicPlayerEvent(player1, player1_attr, player2, player2_attr, 30);

        assert.isNotNull(event);
        assert.eql(event, 'single');
    },
    'basicPlayerEvent_double' : function(beforeExit, assert){
        //var player1_attr = {"id": 2, "player_id": 2, "technique": 0, "pitch_speed": 0, "endurance": 0, "contact": 0, "swing_speed": 0, "bat_power": 5, "catching": 1, "throwing": 1, "awareness": 1, "speed": 1, "clutch": 1, "arm": "left"};
        //var player2_attr = {"id": 2, "player_id": 2, "technique": 0, "pitch_speed": 0, "endurance": 0, "contact": 0, "swing_speed": 0, "bat_power": 0, "catching": 1, "throwing": 1, "awareness": 1, "speed": 1, "clutch": 1, "arm": "left"};
        var player1_attr = {"id": 2, "player_id": 2, "technique": 1, "pitch_speed": 1, "endurance": 1, "contact": 1, "swing_speed": 1, "bat_power": 1, "catching": 1, "throwing": 1, "awareness": 1, "speed": 1, "clutch": 1, "arm": "left"};
        var player2_attr = {"id": 2, "player_id": 2, "technique": 1, "pitch_speed": 1, "endurance": 1, "contact": 1, "swing_speed": 1, "bat_power": 1, "catching": 1, "throwing": 1, "awareness": 1, "speed": 1, "clutch": 1, "arm": "left"};

        //Double between 31-36
        var event = GameController.basicPlayerEvent(player1, player1_attr, player2, player2_attr, 31);

        assert.isNotNull(event);
        assert.eql(event, 'double');
    },
    'basicPlayerEvent_triple' : function(beforeExit, assert){
        var player1_attr = {"id": 2, "player_id": 2, "technique": 1, "pitch_speed": 1, "endurance": 1, "contact": 1, "swing_speed": 1, "bat_power": 1, "catching": 1, "throwing": 1, "awareness": 1, "speed": 1, "clutch": 1, "arm": "left"};
        var player2_attr = {"id": 2, "player_id": 2, "technique": 1, "pitch_speed": 1, "endurance": 1, "contact": 1, "swing_speed": 1, "bat_power": 1, "catching": 1, "throwing": 1, "awareness": 1, "speed": 1, "clutch": 1, "arm": "left"};

        //Triple between 37-39
        var event = GameController.basicPlayerEvent(player1, player1_attr, player2, player2_attr, 37);

        assert.isNotNull(event);
        assert.eql(event, 'triple');
    },
    'basicPlayerEvent_homerun' : function(beforeExit, assert){
        var player1_attr = {"id": 2, "player_id": 2, "technique": 1, "pitch_speed": 1, "endurance": 1, "contact": 1, "swing_speed": 1, "bat_power": 1, "catching": 1, "throwing": 1, "awareness": 1, "speed": 1, "clutch": 1, "arm": "left"};
        var player2_attr = {"id": 2, "player_id": 2, "technique": 1, "pitch_speed": 1, "endurance": 1, "contact": 1, "swing_speed": 1, "bat_power": 1, "catching": 1, "throwing": 1, "awareness": 1, "speed": 1, "clutch": 1, "arm": "left"};

        //Home run between 40 - 41
        var event = GameController.basicPlayerEvent(player1, player1_attr, player2, player2_attr, 40);

        assert.isNotNull(event);
        assert.eql(event, 'home_run');
    },
    'basicPlayerEvent_strike' : function(beforeExit, assert){
        var player1_attr = {"id": 2, "player_id": 2, "technique": 1, "pitch_speed": 1, "endurance": 1, "contact": 1, "swing_speed": 1, "bat_power": 1, "catching": 1, "throwing": 1, "awareness": 1, "speed": 1, "clutch": 1, "arm": "left"};
        var player2_attr = {"id": 2, "player_id": 2, "technique": 1, "pitch_speed": 1, "endurance": 1, "contact": 1, "swing_speed": 1, "bat_power": 1, "catching": 1, "throwing": 1, "awareness": 1, "speed": 1, "clutch": 1, "arm": "left"};

        //Home run between 41 - 68
        var event = GameController.basicPlayerEvent(player1, player1_attr, player2, player2_attr, 68);

        assert.isNotNull(event);
        assert.eql(event, 'strike');
    },
    'basicPlayerEvent_out' : function(beforeExit, assert){
        var player1_attr = {"id": 2, "player_id": 2, "technique": 1, "pitch_speed": 1, "endurance": 1, "contact": 1, "swing_speed": 1, "bat_power": 1, "catching": 1, "throwing": 1, "awareness": 1, "speed": 1, "clutch": 1, "arm": "left"};
        var player2_attr = {"id": 2, "player_id": 2, "technique": 1, "pitch_speed": 1, "endurance": 1, "contact": 1, "swing_speed": 1, "bat_power": 1, "catching": 1, "throwing": 1, "awareness": 1, "speed": 1, "clutch": 1, "arm": "left"};

        //Home run between 69 - 88
        var event = GameController.basicPlayerEvent(player1, player1_attr, player2, player2_attr, 88);

        assert.isNotNull(event);
        assert.eql(event, 'out');
    },
    'basicPlayerEvent_foul' : function(beforeExit, assert){
        var player1_attr = {"id": 2, "player_id": 2, "technique": 1, "pitch_speed": 1, "endurance": 1, "contact": 1, "swing_speed": 1, "bat_power": 1, "catching": 1, "throwing": 1, "awareness": 1, "speed": 1, "clutch": 1, "arm": "left"};
        var player2_attr = {"id": 2, "player_id": 2, "technique": 1, "pitch_speed": 1, "endurance": 1, "contact": 1, "swing_speed": 1, "bat_power": 1, "catching": 1, "throwing": 1, "awareness": 1, "speed": 1, "clutch": 1, "arm": "left"};

        //Home run between 88 - 99
        var event = GameController.basicPlayerEvent(player1, player1_attr, player2, player2_attr, 99);

        assert.isNotNull(event);
        assert.eql(event, 'foul');
    },
    'calculatePlayerPositionByEventResult_no_movement' : function(beforeExit, assert){
        var game = {"id": 1, "team1_id": 2, "team2_id": 1, "field_id": 0, "league_id": 0, "date_created": "2016-11-14T17:11:46.866Z"};
        var game_action = {"id": 1, "game_id": 1, "team_at_bat": 2, "team1_score": 0, "team2_score": 0,
            "balls": 0, "strikes": 0, "outs": 0, "inning": 1, "type": "start", "message": "Game Started!", "date_created": "2016-11-14T17:12:00.031Z"};
        var player_position = {"id": 12, "game_action_id": 12, "onfirst_id": 0, "onsecond_id": 0, "onthird_id": 0, "date_created": "2016-11-14T17:12:28.611Z"};

        var no_movement = ['ball', 'strike', 'out', 'foul'];

        for(var i = 0;i<no_movement.length;i++){
            var pos = GameController.calculatePlayerPositionByEventResult(game, game_action, player_position, player1, no_movement[i]);
            assert.eql(pos.newPosition.onfirst_id, 0);
            assert.eql(pos.newPosition.onsecond_id, 0);
            assert.eql(pos.newPosition.onthird_id, 0);
            assert.eql(pos.update_game_score, false);
            assert.eql(pos.newScore, game_action.team1_score);
        }
    },
    'calculatePlayerPositionByEventResult_movement_single_player' : function(beforeExit, assert){
        var game = {"id": 1, "team1_id": 2, "team2_id": 1, "field_id": 0, "league_id": 0, "date_created": "2016-11-14T17:11:46.866Z"};
        var game_action = {"id": 1, "game_id": 1, "team_at_bat": 2, "team1_score": 0, "team2_score": 0,
            "balls": 0, "strikes": 0, "outs": 0, "inning": 1, "type": "start", "message": "Game Started!", "date_created": "2016-11-14T17:12:00.031Z"};
        var player_position = {"id": 12, "game_action_id": 12, "onfirst_id": 0, "onsecond_id": 0, "onthird_id": 0, "date_created": "2016-11-14T17:12:28.611Z"};

        var movement = ['single', 'double', 'triple', 'home_run'];

        for(var i = 0;i<movement.length;i++){
            var pos = GameController.calculatePlayerPositionByEventResult(game, game_action, player_position, player1, movement[i]);

            switch (i){
                case 0:
                    assert.notEqual(pos.newPosition.onfirst_id, 0);
                    assert.eql(pos.newPosition.onfirst_id, player1.id);
                    break;
                case 1:
                    assert.notEqual(pos.newPosition.onsecond_id, 0);
                    assert.eql(pos.newPosition.onsecond_id, player1.id);
                    break;
                case 2:
                    assert.notEqual(pos.newPosition.onthird_id, 0);
                    assert.eql(pos.newPosition.onthird_id, player1.id);
                    break;
                case 3:
                    assert.eql(pos.newPosition.onfirst_id, 0);
                    assert.eql(pos.newPosition.onsecond_id, 0);
                    assert.eql(pos.newPosition.onthird_id, 0);
                    break;
            }
        }
    },
    'calculatePlayerPositionByEventResult_movement_multiplayer' : function(beforeExit, assert){
        var game = {"id": 1, "team1_id": 2, "team2_id": 1, "field_id": 0, "league_id": 0, "date_created": "2016-11-14T17:11:46.866Z"};
        var game_action = {"id": 1, "game_id": 1, "team_at_bat": 2, "team1_score": 0, "team2_score": 0,
            "balls": 0, "strikes": 0, "outs": 0, "inning": 1, "type": "start", "message": "Game Started!", "date_created": "2016-11-14T17:12:00.031Z"};
        var player_position = {"id": 12, "game_action_id": 12, "onfirst_id": 0, "onsecond_id": 0, "onthird_id": 0, "date_created": "2016-11-14T17:12:28.611Z"};

        var movement = ['single', 'double', 'triple', 'home_run'];
        var temp_player = player1;
        var tempPlayers = [];

        for(var i = 0;i<4;i++){
            var temp = Object.assign({}, temp_player);
            temp.id=(i+1);
            tempPlayers.push(temp);
        }

        var temp_player_position = player_position;

        for(var i = 0;i<movement.length;i++){
            var pos = GameController.calculatePlayerPositionByEventResult(game, game_action, temp_player_position, tempPlayers[i], movement[i]);
            temp_player_position = Object.assign({}, pos.newPosition);
            switch (i){
                case 0:
                    assert.notEqual(pos.newPosition.onfirst_id, 0);
                    assert.eql(pos.newPosition.onfirst_id, tempPlayers[i].id);
                    break;
                case 1:
                    assert.eql(pos.newPosition.onfirst_id, 0);
                    assert.notEqual(pos.newPosition.onsecond_id, 0);
                    assert.notEqual(pos.newPosition.onthird_id, 0);

                    assert.eql(pos.newPosition.onsecond_id, tempPlayers[1].id);
                    assert.eql(pos.newPosition.onthird_id, tempPlayers[0].id);
                    break;
                case 2:
                    assert.eql(pos.newPosition.onfirst_id, 0);
                    assert.eql(pos.newPosition.onsecond_id, 0);
                    assert.notEqual(pos.newPosition.onthird_id, 0);
                    assert.eql(pos.newPosition.onthird_id, tempPlayers[2].id);
                    break;
                case 3:
                    assert.eql(pos.newPosition.onfirst_id, 0);
                    assert.eql(pos.newPosition.onsecond_id, 0);
                    assert.eql(pos.newPosition.onthird_id, 0);
                    break;
            }
        }
    },
    'calculateCountsByEventResult' : function(beforeExit, assert){
        var game = {"id": 1, "team1_id": 2, "team2_id": 1, "field_id": 0, "league_id": 0, "date_created": "2016-11-14T17:11:46.866Z"};
        var game_action = {"id": 1, "game_id": 1, "team_at_bat": 2, "team1_score": 0, "team2_score": 0,
            "balls": 0, "strikes": 0, "outs": 0, "inning": 1, "type": "start", "message": "Game Started!", "date_created": "2016-11-14T17:12:00.031Z"};

        var game_results = ['single', 'double', 'triple', 'home_run', 'walk'];

        for(var i = 0;i<game_results.length;i++){
            var testCounts = GameController.calculateCountsByEventResult(game, game_action, game_results[i]);
            assert.eql(testCounts.counts.balls, 0);
            assert.eql(testCounts.counts.outs, 0);
            assert.eql(testCounts.counts.strikes, 0);
            assert.eql(testCounts.counts.inning, 1);
        }

    },
    'calculateCountsByEventResult_two_strike_one_foul' : function(beforeExit, assert){
        var game = {"id": 1, "team1_id": 2, "team2_id": 1, "field_id": 0, "league_id": 0, "date_created": "2016-11-14T17:11:46.866Z"};
        var game_action = {"id": 1, "game_id": 1, "team_at_bat": 2, "team1_score": 0, "team2_score": 0,
            "balls": 0, "strikes": 0, "outs": 0, "inning": 1, "type": "start", "message": "Game Started!", "date_created": "2016-11-14T17:12:00.031Z"};

        //First Foul
        var testCounts = GameController.calculateCountsByEventResult(game, game_action, 'foul');
        game_action.strikes = testCounts.counts.strikes;
        game_action.outs = testCounts.counts.outs;
        game_action.inning = testCounts.counts.inning;
        game_action.balls = testCounts.counts.balls;
        assert.eql(testCounts.counts.strikes, 1);
        //Second Foul
        testCounts = GameController.calculateCountsByEventResult(game, game_action, 'foul');
        game_action.strikes = testCounts.counts.strikes;
        game_action.outs = testCounts.counts.outs;
        game_action.inning = testCounts.counts.inning;
        game_action.balls = testCounts.counts.balls;
        assert.eql(testCounts.counts.strikes, 2);
        //Third Foul
        testCounts = GameController.calculateCountsByEventResult(game, game_action, 'foul');
        game_action.strikes = testCounts.counts.strikes;
        game_action.outs = testCounts.counts.outs;
        game_action.inning = testCounts.counts.inning;
        game_action.balls = testCounts.counts.balls;
        assert.eql(testCounts.counts.strikes, 2);
    },
    'calculateCountsByEventResult_strike_out' : function(beforeExit, assert){
        var game = {"id": 1, "team1_id": 2, "team2_id": 1, "field_id": 0, "league_id": 0, "date_created": "2016-11-14T17:11:46.866Z"};
        var game_action = {"id": 1, "game_id": 1, "team_at_bat": 2, "team1_score": 0, "team2_score": 0,
            "balls": 0, "strikes": 0, "outs": 0, "inning": 1, "type": "start", "message": "Game Started!", "date_created": "2016-11-14T17:12:00.031Z"};

        var testCounts = GameController.calculateCountsByEventResult(game, game_action, 'strike');
        game_action.strikes = testCounts.counts.strikes;
        game_action.outs = testCounts.counts.outs;
        game_action.inning = testCounts.counts.inning;
        game_action.balls = testCounts.counts.balls;
        assert.eql(testCounts.counts.strikes, 1);
        var testCounts = GameController.calculateCountsByEventResult(game, game_action, 'strike');
        game_action.strikes = testCounts.counts.strikes;
        game_action.outs = testCounts.counts.outs;
        game_action.inning = testCounts.counts.inning;
        game_action.balls = testCounts.counts.balls;
        assert.eql(testCounts.counts.strikes, 2);
        var testCounts = GameController.calculateCountsByEventResult(game, game_action, 'strike');
        game_action.strikes = testCounts.counts.strikes;
        game_action.outs = testCounts.counts.outs;
        game_action.inning = testCounts.counts.inning;
        game_action.balls = testCounts.counts.balls;
        assert.eql(testCounts.counts.strikes, 0);
        assert.eql(testCounts.counts.outs, 1);
    },
    'calculateCountsByEventResult_game_over' : function(beforeExit, assert){
        var game = {"id": 1, "team1_id": 2, "team2_id": 1, "field_id": 0, "league_id": 0, "date_created": "2016-11-14T17:11:46.866Z"};
        var game_action = {"id": 1, "game_id": 1, "team_at_bat": 2, "team1_score": 0, "team2_score": 0,
            "balls": 0, "strikes": 0, "outs": 2, "inning": 17, "type": "start", "message": "Game Started!", "date_created": "2016-11-14T17:12:00.031Z"};

        var testCounts = GameController.calculateCountsByEventResult(game, game_action, 'out');

        assert.eql(testCounts.game_over, true);
    },
    'calculateCountsByEventResult_third_out' : function(beforeExit, assert){
        var game = {"id": 1, "team1_id": 2, "team2_id": 1, "field_id": 0, "league_id": 0, "date_created": "2016-11-14T17:11:46.866Z"};
        var game_action = {"id": 1, "game_id": 1, "team_at_bat": 2, "team1_score": 0, "team2_score": 0,
            "balls": 0, "strikes": 0, "outs": 2, "inning": 1, "type": "start", "message": "Game Started!", "date_created": "2016-11-14T17:12:00.031Z"};

        var testCounts = GameController.calculateCountsByEventResult(game, game_action, 'out');

        assert.eql(testCounts.toggle_at_bat, true);
        assert.eql(testCounts.counts.outs, 0);
    }
};
