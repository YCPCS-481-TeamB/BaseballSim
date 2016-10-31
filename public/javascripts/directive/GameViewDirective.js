App.directive('gameViewDirective', function(GameService, $interval){
    return {
        template: "<canvas id='FieldCanvas' width='200' height='200'></canvas>",
        scope : {
          gameid: '@'
        },
        link : function($scope, element, attribute){
            var canvas = document.getElementById("FieldCanvas");
            var ctx = canvas.getContext("2d");

            var width = 200;
            var height = 200;

            //var updatePlayerPositions = function(){
            //    if($scope.gameEvents && $scope.gameEvents[0]){
            //        var game_action_id = $scope.gameEvents[0].id;
            //        GameService.getGamePositionByGameEvent(game_action_id).then(function(response){
            //            $scope.player_positions = response.data.positions;
            //        });
            //    }
            //}
            //
            //updatePlayerPositions();
            //$interval(updatePlayerPositions, 1000);

            //Second Base
            var base1_filled = false;//($scope.player_positions && $scope.player_positions.onfirst_id != 0);

            //Home Base
            var base2_filled = false;//($scope.player_positions && $scope.player_positions.onsecond_id != 0);

            //First Base
            var base3_filled = false;//($scope.player_positions && $scope.player_positions.onthird_id != 0);

            //Third Base
            var base4_filled = false;//($scope.player_positions && $scope.$scope.player_positions.onfirst_id != 0);

            //console.log("BASE 1: " , base1_filled);
            //console.log("BASE 2: " , base2_filled);
            //console.log("BASE 3: " , base3_filled);
            //console.log("BASE 4: " , base4_filled);

            //console.log($scope.player_positions);

            //Draw Grass
            ctx.fillStyle = "green";
            ctx.fillRect(0,0,width,height);

            //Draw Field
            ctx.translate(width/2, height/2);
            ctx.rotate(45*Math.PI/180);
            ctx.translate(-width/2, -height/2);
            ctx.fillStyle = "brown";
            ctx.rect(width/5, height/5, width/2, height/2);
            //Draw Bases
            if(base1_filled){
                ctx.fillStyle = "grey";
            }else{
                ctx.fillStyle = "brown";
            }
            ctx.fillRect(width/5, height/5, width*(25/500), height*(25/500));

            if(base2_filled){
                ctx.fillStyle = "grey";
            }else{
                ctx.fillStyle = "brown";
            }
            ctx.fillRect(width*(325/500), height*(325/500), width*(25/500), height*(25/500));

            if(base3_filled){
                ctx.fillStyle = "grey";
            }else{
                ctx.fillStyle = "brown";
            }
            ctx.fillRect(width*(325/500), height/5, width*(25/500), height*(25/500));

            if(base4_filled){
                ctx.fillStyle = "grey";
            }else{
                ctx.fillStyle = "brown";
            }
            ctx.fillRect(width/5, height*(325/500), width*(25/500), height*(25/500));
            ctx.stroke();
        }
    };
});