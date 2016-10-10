var NavbarController = App.controller('NavbarController', function($scope, $interval, UserTokenFactory, ApprovalService){


    $scope.approvals = [];

    function updateApprovals(){
        UserTokenFactory.checkTokenValidity().then(function(valid){
            if(valid == true){
                ApprovalService.getAll().then(function(response){
                    console.log(response);
                    $scope.approvals = response.data.approvals;
                }).catch(function(err){
                    console.log(err);
                });
            }
        }).catch(function(err){
            console.log(err);
        });
    }

    updateApprovals();

    $interval(updateApprovals, 10000);

    $scope.approve = function(approval){
        ApprovalService.setStatus(approval.id, 'approved').then(function(data){
            console.log(data);
        }).catch(function(err){
            console.log(err);
        });
    }

    $scope.decline = function(approval){
        ApprovalService.setStatus(approval.id, 'declined').then(function(data){
            console.log(data);
        }).catch(function(err){
            console.log(err);
        });
    }

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
