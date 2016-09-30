var UserController = require('../../Controller/UserController');

//User Setup
var username = "johndoe123";
var password = "toadstool"
var firstname = 'John';
var lastname = 'Doe';
var email = 'john@doe.com';

//Tests the createUser function
exports['test_create_user'] = function(test)
{
    var user = UserController.createUser(username, password, firstname, lastname, email);
    //Asserts that the return value is not null
    test.notEqual(null, user);
    //Asserts that it returns a Promise function
    test.equal(Promise.name, user.constructor.name);
    test.done();
};

//Tests the deleteUserById function
exports['test_delete_user_by_id'] = function(test)
{
    var user = UserController.createUser(username, password, firstname, lastname, email);
    var deletedUser = UserController.deleteUserById(user.id);
    
    //Asserts that the return value is not null
    test.notEqual(null, deletedUser);
    //Asserts that it returns a Promise function
    test.equal(Promise.name, deletedUser.constructor.name);
    test.done();
};

//Tests the getUsers function
exports['test_get_users'] = function(test)
{
    var users = UserController.getUsers(5, 1);
    
    //Asserts that the return value is not null
    test.notEqual(null, users);
    //Asserts that it returns a Promise function
    test.equal(Promise.name, users.constructor.name);
    test.done();
};

//Tests the getUserById function
exports['test_get_user_by_id'] = function(test)
{
    var user = UserController.createUser(username, password, firstname, lastname, email);
    var returnedUser = UserController.getUserById(user.id);
    
    //Asserts that the return value is not null
    test.notEqual(null, returnedUser);
    //Asserts that it returns a Promise function
    test.equal(Promise.name, returnedUser.constructor.name);
    test.done();
};
