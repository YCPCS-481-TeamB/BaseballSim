var LogoutController = App.controller('LogoutController', function($scope,UserTokenFactory){

    $scope.logout = function(){
        UserTokenFactory.logoutUser().then(function(data){
            window.location.assign("/login");
        }).catch(function(err){
            console.log(err);
        });
    }

});
