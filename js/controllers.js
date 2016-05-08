var App = angular.module('starter.controllers', []);

App.controller('AppCtrl', function ($cordovaNetwork, $scope, $ionicModal, $timeout, $window, $state, $rootScope, WebService, $ionicLoading,$ionicHistory) {

      $ionicHistory.nextViewOptions({
        disableBack: true
       });




//$cordovaNetwork,

 function set_net(status) {
        if (status == 'online') {
            $('.net-error').hide();
            $ionicLoading.hide();
            //alert("online");
        } else {
            $('.net-error').show();
            WebService.show_loading();
            //alert("offline");
        }

    }

    if ($cordovaNetwork.isOffline()) {
        set_net('offline');
    } else {
        set_net('online');
    }




    //$cordovaSplashscreen.show();
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,

    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    $scope.load_trips = function () {
        WebService.load_trips();
        $state.go('app.my_ride');

    }


    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };



    $scope.logout = function () {
        localStorage.removeItem('user_data');
        $state.go('landing', {}, {
            reload: true
        });
    };


   /* $scope.close_app=function(){
       ionic.Platform.exitApp();
    };*/


})

//Landing page controller
App.controller('landingCtrl', function ($cordovaOauth, $scope, $ionicModal, $timeout, $state, WebService, $rootScope, $ionicPopup, $timeout, $ionicLoading, $filter) {

    var link = 'fetchDriverAppLanguage';
    var post_data ="";
    //setTimeout(function(){     }, 1000);
    var promise = WebService.send_data(link, post_data);
    promise.then(function (data) {
        //console.log(data);
        $rootScope.appConvertedLang=data;
    });


    $scope.facebookLogin = function () {


         $cordovaOauth.facebook("415834555280405", ["email"]).then(function (result) {
            $scope.oauthResult = result;
            //alert(JSON.stringify($scope.oauthResult,null,4))
            WebService.show_loading();
            $http.get("https://graph.facebook.com/v2.2/me", {
                params: {
                    access_token: $scope.oauthResult.access_token,
                    fields: "id,name,gender,picture",
                    format: "json"
                }
            }).then(function (result) {
                $scope.profileData = result.data;
                $scope.social_login($scope.profileData.id);
                //alert(JSON.stringify($scope.profileData,null,4))
            }, function (error1) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                //console.log(error);
                //alert(JSON.stringify(error1,null,4))
            });



        }, function (error) {
            $scope.oauthResult = "OAUTH ERROR (see console)";
            console.log(error);
        });


        //alert("Facebook");
    };

    $scope.googleLogin = function () {
          $cordovaOauth.google("961941792261-65dbtr9khlc6auv8u9n78icmjtvbpj9h.apps.googleusercontent.com", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function (result) {
                // $scope.oauthResult = result;
                alert(JSON.stringify(result, null, 4))
            }, function (error) {
                $scope.oauthResult = "OAUTH ERROR (see console)";
                console.log(error);
            });
    };



    if (localStorage.getItem('user_data') === null) {

    } else {
        $rootScope.user_data = JSON.parse(localStorage.getItem('user_data'));
        WebService.load_trips();
        $state.go('app.my_ride');
    }




    $ionicModal.fromTemplateUrl('templates/sign-up.html', {
        scope: $scope,
    }).then(function (modal) {
        $scope.signup = modal;
    });

    $scope.sign_up = function () {
        $scope.signup.show();
    };
    $scope.closeSignUp = function () {
        $scope.signup.hide();
    };


    // Create the login modal
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,

    }).then(function (modal) {
        $scope.login = modal;
    });

    $scope.show_login1 = function () {
        $scope.login.show();
    };
    $scope.closeLogin = function () {
        $scope.login.hide();
    };

    $scope.doLogin = function (login_form_data) {

        var link = "driver_login";
        if (login_form_data.$valid) {
            var post_data = {

                    'Email': $scope.login.mail,
                    'Password': $scope.login.pwd
                }
                //WebService.show_loading();

            var promise = WebService.send_data(link, post_data);
            WebService.show_loading();

            promise.then(function (data) {

                data = data[0];
                //alert(data.status);
                if (data.status == 'failed') {
                    $scope.login.message = data.message;
                    $ionicLoading.hide();
                } else if (data.status == 'success') {
                    $ionicLoading.hide();
                    var user_data = {
                        "Id": data.id,
                        "Name": data.mobile,
                        "Email": data.email,
                        "User_name": data.username,
                        "Mobile": data.mobile
                    };
                    localStorage.setItem('user_data', JSON.stringify(user_data));

                    $rootScope.user_data = JSON.parse(localStorage.getItem('user_data'));

                    $scope.login.hide();
                    $state.go('app.my_ride');
                    WebService.load_trips();
                }

            })




            //$scope.login.hide();
            // $state.go('app.my_ride');



        } else {
            form.mail.$setDirty();
            form.pwd.$setDirty();
        }

    };

    $scope.signUp = {};
    $scope.do_signUp = function (form) {
        var link = 'driver_sign_up';

        var post_data = {
            'Email': $scope.signUp.mail,
            'Password': $scope.signUp.pwd,
            'Mobile': $scope.signUp.mobile,
            'User_name': $scope.signUp.user_name,
            'Name': $scope.signUp.name
        }
        var promise = WebService.send_data(link, post_data);


        promise.then(function (data) {
            // console.log(data);
            // $ionicLoading.hide();
            console.log(data.status);

            // alert("");
            if (data.status == 'failed') {

                $scope.signUp.error_list = data.error_list;

                $ionicPopup.alert({
                    title: '<p class="text-center color-yellow">'+$filter('langTranslate')("Failed",$rootScope.appConvertedLang['Failed'])+'</p>',

                    template: "<div ng-show='signUp.error_list.length' class='text-center  m-top-20'>" +
                        "<span ng-repeat='error in signUp.error_list' class='color-yellow d-block'>" +
                        "{{error.message}} " +
                        "</span>" +
                        "</div>",
                    scope: $scope,
                });

            } else if (data.status == 'success') {

                $scope.showAlert = function () {
                    var alertPopup = $ionicPopup.alert({
                        title: $filter('langTranslate')("ThankYou",$rootScope.appConvertedLang['ThankYou']),
                        template: $filter('langTranslate')("You are successfully registered",$rootScope.appConvertedLang['You_are_successfully_registered'])
                    });
                    alertPopup.then(function (res) {
                        $scope.signup.hide();
                        $scope.login.show();
                    });
                };
                $scope.showAlert();

                //$state.go('app.landing', {}, {reload: true});
            }

        })

    }

})
