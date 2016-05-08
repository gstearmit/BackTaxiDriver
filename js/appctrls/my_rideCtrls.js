App.controller('rideCtrl', function ($ionicHistory,$scope, $rootScope, $state, WebService, $http, $ionicLoading,$timeout) {
    //Scopes.store('mapCtrl', $scope);
    $scope.myTrip_menu = [
        {
            'name': 'NEW RIDES'
        },
        {
            'name': 'COMPLETED'
        },
        {
            'name': 'CANCELLED'
        }];

       /*$ionicHistory.nextViewOptions({
        disableBack: true
       });*/

    $scope.Trip_menu_click = function (index) {
        
        $rootScope.pickup_loc ="";
        $rootScope.drop_loc = "";
        
        if ($rootScope.myTrip_menu_selected != index) {

            $rootScope.myTrip_menu_selected = index;
            if (index == 0) {
               $rootScope.accept_btn = true;
                $rootScope.active_trip = $rootScope.Trips.new_rade;
            } else if (index == 1) {
               $rootScope.accept_btn = false;
                $rootScope.active_trip = $rootScope.Trips.complete;
            } else if (index == 2) {
                $rootScope.accept_btn = false;
                $rootScope.active_trip = $rootScope.cancelled_trip;

            }
        }
    }
    $scope.show_details = function (index) {
        $rootScope.details = $rootScope.active_trip[index];
    }

    $scope.accept_rade = function (pick_up, drop) {
       // alert(pick_up);


       

        $rootScope.pickup_loc = pick_up;
        $rootScope.drop_loc = drop;

        var pickup_location = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + pick_up;
        var drop_location = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + drop;


        var pickup_lat;
        var pickup_lng;
        var drop_lat;
        var drop_lng;

        var promise_pickup = WebService.get_google_lat_lng(pickup_location);
        WebService.show_loading();
        
        promise_pickup.then(function (data) {
                   $rootScope.pickup_lat=0;
                    $rootScope.pickup_lng=0;
            var pick_up_lat_lng = data.results[0].geometry.location;
            $rootScope.pickup_lat = pick_up_lat_lng.lat;
            $rootScope.pickup_lng = pick_up_lat_lng.lng;
            $ionicLoading.hide();

        });

        var promise_drop = WebService.get_google_lat_lng(drop_location);
        WebService.show_loading();
        promise_drop.then(function (data) {
            $rootScope.drop_lat=0;
            $rootScope.drop_lng=0;
            var drop_lat_lng = data.results[0].geometry.location;
            $rootScope.drop_lat = drop_lat_lng.lat;
            $rootScope.drop_lng = drop_lat_lng.lng;
            
            
          $timeout(function(){
            $state.go('app.rade_map');
            $ionicLoading.hide();
           }, 1000); 
            

        })

    }

})