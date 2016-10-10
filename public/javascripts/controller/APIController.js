App.controller('APIController', function($scope, $http){
    $scope.apidoc = [];

    var createEndpoint = function(type, endpoint, description, inputs){
        return {
            type: type,
            endpoint: endpoint,
            description: description,
            inputs : inputs,
            endpoints : [],
            addEndpoint : function (endpoint){
                this.endpoints.push(endpoint);
            }
        }
    }

    var createInput = function(type, name){
        return {
            type : type,
            name : name
        }
    }

    var buildAPIDoc = function(){

        //BASE
        var API = createEndpoint('N/A', 'API', 'Base API Endpoint', 'N/A');

        var USER = createEndpoint('N/A', 'USERS', 'Base User Endpoint', 'N/A');

        USER.addEndpoint(createEndpoint('GET', '/', 'Returns all users', 'N/A'));

        API.addEndpoint(USER);

        $scope.apidoc.push(API);

    }

    buildAPIDoc();


});