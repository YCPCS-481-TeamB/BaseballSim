var GameController = require('../../Controller/GameController');

var player1 = {"id": 1, "firstname": "Test", "lastname": "John", "position": "first_baseman", "team_id": 1, "date_created": "2016-11-14T16:44:48.045Z"}

exports['player_event_calc'] = function(test)
{
    var event = GameController.basicPlayerEvent(player1, player1_attr, player2, player2_attr);

    // Event is not null
    test.notEqual(null, event);

    // Asserts it will return a promise function
    test.equal(Promise.name, event.constructor.name);

    test.done();
};
