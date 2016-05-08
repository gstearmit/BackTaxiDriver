App.controller('mapCtrl', function ($scope, $ionicModal, $timeout, $window, $state, $rootScope, WebService) {

    //Scopes.store('rideCtrl', $scope);

    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;


    $ionicModal.fromTemplateUrl('templates/directions.html', {
        scope: $scope,
    }).then(function (modal) {
        $scope.directions = modal;
    });


    $scope.show_direction = function () {
        $scope.directions.show();
        directionsDisplay.setPanel(document.getElementById('right-panel'));
    }

    function initialize() {

        var image = 'img/icons/google_marker.png';
        var styles = WebService.map_style();

        // Create a new StyledMapType object, passing it the array of styles,
        // as well as the name to be displayed on the map type control.
        var styledMap = new google.maps.StyledMapType(styles, {
            name: "Styled Map"
        });

        // Create a map object, and include the MapTypeId to add
        // to the map type control.
        var mapOptions = {
            zoom: 11,
            center: new google.maps.LatLng($rootScope.pickup_lat, $rootScope.pickup_lng),
            disableDefaultUI: true,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            }
        };


        var map = new google.maps.Map(document.getElementById('map'),
            mapOptions);
        $scope.map=map;

        directionsDisplay.setMap(map);
        directionsDisplay.setOptions( { suppressMarkers: true } );
        calculateAndDisplayRoute(directionsService, directionsDisplay);
        //  directionsDisplay.setPanel(document.getElementById('right-panel'));

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });



        var contentString = 'frdfdfdfd';

        //Associate the styled map with the MapTypeId and set it to display.
        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');

        var pick_up_mark = new google.maps.Marker({
            position: {
                lat: $rootScope.pickup_lat,
                lng: $rootScope.pickup_lng
            },
            map: map,
            icon: image
        });

        pick_up_mark.addListener('click', function () {
            infowindow.open(map, pick_up_mark);
        });

        var drop_mark = new google.maps.Marker({
            position: {
                lat: $rootScope.drop_lat,
                lng: $rootScope.drop_lng
            },
            map: map,
            icon: image
        });



    }

       $scope.$on( "$ionicView.enter", function( scopes, states ) {
             google.maps.event.trigger( $scope.map, 'resize' );
        });

    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        var selectedMode = "DRIVING";

        directionsService.route({
            origin: {
                lat: $rootScope.pickup_lat,
                lng: $rootScope.pickup_lng
            }, // Haight.
            destination: {
                lat: $rootScope.drop_lat,
                lng: $rootScope.drop_lng
            }, 
            travelMode: google.maps.TravelMode[selectedMode]
        }, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);

            } else {
                alert('Directions request failed due to ' + status);
            }
        });
    }




    $scope.google_locations = {
        pick_up: $rootScope.pickup_loc,
        drop: $rootScope.drop_loc
    };

    initialize();
    
    $scope.start_ride=function(){
          $state.go('app.rate_card');
    }

})