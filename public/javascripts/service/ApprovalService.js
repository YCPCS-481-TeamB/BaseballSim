var ApprovalService = App.service('ApprovalService', function($http, UserTokenFactory){

    this.getAll = function(){
        return $http.get('/api/approvals/user/pending',{headers: {"x-access-token" : UserTokenFactory.getToken()}});
    }

    this.setStatus = function(approval_id, status){
        return $http.post("/api/approvals/" + approval_id +"/status", {status: status}, {headers: {"x-access-token" : UserTokenFactory.getToken()}});
    }

});