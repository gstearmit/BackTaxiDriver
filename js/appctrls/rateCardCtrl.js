App.controller('rateCardCtrl', function ($scope, $ionicModal, $timeout, $interval, $window, $state, $rootScope, $ionicLoading, WebService, $ionicHistory) {

    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;
    var map;
    var image = 'img/icons/google_marker.png';
    var moving_marker = 'img/icons/track_icon.png';
    var styles = WebService.map_style();
    /* var _last_lat;
     var _last_lng;*/



    $ionicHistory.nextViewOptions({
        disableBack: true
    });

    function initialize() {

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

        // map = new google.maps.Map(document.querySelector('[nav-view="active"] #rate_card_map'),mapOptions);
        map = new google.maps.Map(document.getElementById('rate_card_map'), mapOptions);
        $scope.map=map;
        directionsDisplay.setMap(map);
        directionsDisplay.setOptions({
            suppressMarkers: true
        });
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

        $rootScope._last_lat = $rootScope.pickup_lat;
        $rootScope._last_lng = $rootScope.pickup_lng;

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

    /*Add marker to map*/
    function add_marker(lat, lng) {
        var drop_mark = new google.maps.Marker({
            position: {
                lat: lat,
                lng: lng
            },
            map: map,
            icon: moving_marker
        });

        $rootScope._new_lat = lat;
        $rootScope._new_lng = lng;
    }
    /*Add marker to map Ends here*/

    /*Function for fetching Address string of a location by Lat&lng */
    function get_places_address(lat, lng) {
        var current_lat_lng = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng;

        var promise_pickup = WebService.get_google_lat_lng(current_lat_lng);
        // WebService.show_loading();
        promise_pickup.then(function (data) {
            var current_address = data.results[0].address_components[1].long_name;

            var myElq = angular.element(document.querySelector('#current_location'));

            myElq.text(current_address);

            // $ionicLoading.hide();
        });
    }

    /*Function for fetching Address string of a location by Lat&lng Ends here*/


    /* Claculate distance using from lat&lng To Lat&lng */

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        // alert(lat1);
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1); // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        d = d.toFixed(2);
        //alert(d);
        var dist1 = angular.element(document.querySelector('#distance'));
        dist1.text(d);





        /*Rate calculation for current trip
         **Sends Trip uniq Id to the function
         **return standard rate from webservice
         */

        //console.log($rootScope.details);
        var post_data = $rootScope.details
        var link = "getRide_rate";
        var promise = WebService.send_data(link, post_data);
        // WebService.show_loading();
        promise.then(function (data) {
            console.log(data);
            var status = data.status;
            var transfer_type = data.transfer_tyepe;
            var purpose = data.purpose;
            var intialkm = 0;
            var intailrate = 0;
            var standardrate = 0;
            $scope.ride_uniq_id = data.booking_id;

            if (purpose == "Point to Point Transfer") {
                intialkm = data.raw_data[0].intialkm;
                intailrate = data.raw_data[0].intailrate;
                standardrate = data.raw_data[0].standardrate;
            }

            if (purpose == "Airport Transfer") {

                if (transfer_type == "going") {
                    intialkm = data.raw_data[0].intialkm;
                    intailrate = data.raw_data[0].intailrate;
                    standardrate = data.raw_data[0].standardrate;
                }
                if (transfer_type == "coming") {
                    intialkm = data.raw_data[0].fromintialkm;
                    intailrate = data.raw_data[0].fromintailrate;
                    standardrate = data.raw_data[0].fromstandardrate;
                }

            }


            if (purpose == "Outstation Transfer") {

                if (transfer_type == "oneway") {
                    intialkm = 0;
                    intailrate = 0;
                    standardrate = data.raw_data[0].standardrate;
                }
                if (transfer_type == "round") {
                    intialkm = 0;
                    intailrate = 0;
                    standardrate = data.raw_data[0].fromstandardrate;
                }

            }

            if (purpose == "Hourly Rental") {
                intialkm = 0;
                intailrate = 0;
                standardrate = data.raw_data[0].standardrate;
            }




            var total_rate = 0;
            if (Number(d) > Number(intialkm)) {
                var extra_km = Number(d) - intialkm;
                var extra_rate = extra_km * standardrate;
                total_rate = Number(intailrate) + Number(extra_rate);
                total_rate = total_rate.toFixed(2);

            }

            $scope.trip_details = {
                trip_type: transfer_type,
                standard_rate: standardrate,
                min_distance: intialkm,
                minimum_rate: intailrate,
                total_rate: total_rate

            };


            $rootScope.bill = {
                trip_type: transfer_type,
                minimum_rate: intailrate + " Upto " + intialkm,
                extra_rate: standardrate,
                total_distance_traveled: Number(d),
                total_amount: total_rate
            }

            // $ionicLoading.hide();

        })


        /*Rate calculation ends here*/


    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }
    /* Claculate distance using from lat&lng To Lat&lng Ends here */



    ionic.Platform.ready(initialize);


   /* add_marker(10.0572249, 76.3955603);
    get_places_address($rootScope._new_lat, $rootScope._new_lng);
    getDistanceFromLatLonInKm($rootScope._last_lat, $rootScope._last_lng, $rootScope._new_lat, $rootScope._new_lng);*/

    /*Clock function starts from here*/
    /*Clock function starts from here*/

    var secs = 0;
    var sec_count = 0;
    var min = 0;
    var hours = 0;

    $interval(function () {
        navigator.geolocation.getCurrentPosition(function (pos) {

            var myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

            add_marker(pos.coords.latitude, pos.coords.longitude);
            get_places_address(pos.coords.latitude, pos.coords.longitude);
            getDistanceFromLatLonInKm($rootScope._last_lat, $rootScope._last_lng, $rootScope._new_lat, $rootScope._new_lng);
        }, function (error) {
            alert('Unable to get location: ' + error.message);
        });

    }, 5000);

    /*Clock function Ends*/


    $scope.goto_my_ride = function () {


        $state.go('app.my_ride');

    }



    $scope.stop_ride = function (id) {
       if(! id)
        {
            alert("Invalid data");
        }
        else
        {    var link = "set_ride_as_complete";
        //var post_data = id;
        post_data={'current_ride_id':id};
      
        var promise = WebService.send_data(link, post_data);
        WebService.show_loading();
        promise.then(function (data) {
            if (data.trim() == "success") {
                $state.go('app.reciept');
                $ionicLoading.hide();
            }
        })
        $state.go('app.reciept');
    }
     
       
        
    }

    /* $scope.$on('$ionicView.beforeLeave', function () {
         alert("Before Leaving");
     });*/


})