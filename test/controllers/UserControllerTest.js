var assert = require('assert');
var UserController = require('../../Controller/UserController');

//User Setup
var username = "johndoe123";
var password = "toadstool"
var firstname = 'John';
var lastname = 'Doe';
var email = 'john@doe.com';
var user = UserController.createUser(username, password, firstname, lastname, email);

//Run Tests
test_create_user();
test_delete_user_by_id();
test_get_users();
test_get_user_by_id();
console.log("All tests completed");

//Tests the createUser function
function test_create_user()
{
    //Asserts that the return value is not null
    assert.notEqual(null, user);
    //Asserts that it returns a Promise function
    assert.equal(Promise.name, user.constructor.name);
}

//Tests the deleteUserById function
function test_delete_user_by_id()
{
    var deletedUser = UserController.deleteUserById(user.id);
    
    //Asserts that the return value is not null
    assert.notEqual(null, deletedUser);
    //Asserts that it returns a Promise function
    assert.equal(Promise.name, deletedUser.constructor.name);
}

//Tests the getUsers function
function test_get_users()
{
    var users = UserController.getUsers(5, 1);
    
    //Asserts that the return value is not null
    assert.notEqual(null, users);
    //Asserts that it returns a Promise function
    assert.equal(Promise.name, users.constructor.name);
}

//Tests the getUserById function
function test_get_user_by_id()
{
    var returnedUser = UserController.getUserById(user.id);
    
    //Asserts that the return value is not null
    assert.notEqual(null, returnedUser);
    //Asserts that it returns a Promise function
    assert.equal(Promise.name, returnedUser.constructor.name);
}
