var NavbarController = App.controller('NavbarController', function($scope,UserTokenFactory){

    UserTokenFactory.getUserData().then(function(user){
        $scope.userdata = user;
        $scope.$apply();
    });

    $scope.logout = function(){
        UserTokenFactory.logoutUser().then(function(data){
            window.location.assign("/login");
        }).catch(function(err){
            console.log(err);
        });
    }

});
