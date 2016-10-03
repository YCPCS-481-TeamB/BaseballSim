var UserController = require('../../Controller/UserController');

//User Setup
var username = "johndoe123";
var password = "toadstool"
var firstname = 'John';
var lastname = 'Doe';
var email = 'john@doe.com';

//User New Info
var newFirstname = 'Quincy';
var newLastname = 'Adams';
var newEmail = 'quincy@adams.com';

var user_id;

//Tests the createUser function
exports['test_create_user'] = function(test)
{
    var user = UserController.createUser(username, password, firstname, lastname, email);
    
    //Asserts that the return value is not null
    test.notEqual(null, user);
    //Asserts that it returns a Promise function
    test.equal(Promise.name, user.constructor.name);
    
    user.then(
        function(value) {
            var userValues = value.rows[0];
            user_id = userValues.id;
            
            test.equal('number', typeof userValues.id);
            test.equal(username, userValues.username);
            test.notEqual(password, userValues.password);
            test.equal(firstname, userValues.firstname);
            test.equal(lastname, userValues.lastname);
            test.equal(email, userValues.email);
            test.equal('Date', userValues.date_created.constructor.name);
            test.done();
    });
};

//Tests the getUsers function
exports['test_get_users'] = function(test)
{
    var getUsers = UserController.getUsers();
    
    //Asserts that the return value is not null
    test.notEqual(null, getUsers);
    //Asserts that it returns a Promise function
    test.equal(Promise.name, getUsers.constructor.name);
    
    getUsers.then(
        function(value) {
            var users = value.users;
            var lastUser = users[users.length-1];
            
            for(var i = 0; i < users.length; i++)
            {
                test.equal('number', typeof users[i].id);
                test.equal('string', typeof users[i].username);
                test.equal('string', typeof users[i].password);
                test.equal('string', typeof users[i].firstname);
                test.equal('string', typeof users[i].lastname);
                test.equal('string', typeof users[i].email);
                test.equal('Date', users[i].date_created.constructor.name);
            }
            
            //Test user created within test_create_user
            test.equal('number', typeof lastUser.id);
            test.equal(user_id, lastUser.id);
            test.equal(username, lastUser.username);
            test.notEqual(password, lastUser.password);
            test.equal(firstname, lastUser.firstname);
            test.equal(lastname, lastUser.lastname);
            test.equal(email, lastUser.email);
            test.equal('Date', lastUser.date_created.constructor.name);
            
            test.done();    
    });
};

//Tests the getUserById function
exports['test_get_user_by_id'] = function(test)
{
    var getUser = UserController.getUserById(user_id);
    
    //Asserts that the return value is not null
    test.notEqual(null, getUser);
    //Asserts that it returns a Promise function
    test.equal(Promise.name, getUser.constructor.name);
    
    getUser.then(
        function(value) {
            var userValues = value[0];
            
            test.equal('number', typeof userValues.id);
            test.equal(username, userValues.username);
            test.notEqual(password, userValues.password);
            test.equal(firstname, userValues.firstname);
            test.equal(lastname, userValues.lastname);
            test.equal(email, userValues.email);
            test.equal('Date', userValues.date_created.constructor.name);
            
            test.done();
    });
};

//Tests the updateuser function
exports['test_update_user'] = function(test)
{
    
    
    var updateUser = UserController.updateUser(user_id, newFirstname, newLastname, newEmail);
    
    //Asserts that the return value is not null
    test.notEqual(null, updateUser);
    //Asserts that it returns a Promise function
    test.equal(Promise.name, updateUser.constructor.name);
    
    updateUser.then(
        function(value) {
            var userValues = value.rows[0];
            
            test.equal('number', typeof userValues.id);
            test.equal(user_id, userValues.id);
            test.equal(username, userValues.username);
            test.notEqual(password, userValues.password);
            test.notEqual(firstname, userValues.firstname);
            test.notEqual(lastname, userValues.lastname);
            test.notEqual(email, userValues.email);
            test.equal(newFirstname, userValues.firstname);
            test.equal(newLastname, userValues.lastname);
            test.equal(newEmail, userValues.email);
            test.equal('Date', userValues.date_created.constructor.name);
            
            test.done();
    });

};

//Tests the deleteUserById function
exports['test_delete_user_by_id'] = function(test)
{
    var deletedUser = UserController.deleteUserById(user_id);
    //Asserts that the return value is not null
    test.notEqual(null, deletedUser);
    //Asserts that it returns a Promise function
    test.equal(Promise.name, deletedUser.constructor.name);
    
    deletedUser.then(
        function(value) {
            var userValues = value.player[0];
            
            test.equal('number', typeof userValues.id);
            test.equal(user_id, userValues.id);
            test.equal(username, userValues.username);
            test.notEqual(password, userValues.password);
            test.notEqual(firstname, userValues.firstname);
            test.notEqual(lastname, userValues.lastname);
            test.notEqual(email, userValues.email);
            test.equal(newFirstname, userValues.firstname);
            test.equal(newLastname, userValues.lastname);
            test.equal(newEmail, userValues.email);
            test.equal('Date', userValues.date_created.constructor.name);
            
            //Test to make sure user was deleted
            var getUser = UserController.getUserById(user_id);
            
            getUser.then(
                function(getValue) {
                    test.equal('', getValue);
                    test.done();
            });
    });
};
