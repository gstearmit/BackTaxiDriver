// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js


if(wordpress == true ){
    var base_url      = server_domain + '/wp-admin/admin-ajax.php';
}else{
    var base_url      = server_domain + '/index.php/web_service/';
}


angular.module('starter', ['ionic','ngCordova','starter.controllers'])

.run(function ($ionicPlatform, $ionicPopup,$ionicHistory) {
    
   // $cordovaSplashScreen.hide();
  // $state.go('app.my_ride');
   //alert("jdfhb");
    
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
	
	
	  $ionicPlatform.registerBackButtonAction(function(event) {
		if ($ionicHistory.currentStateName()=="app.my_ride") { // your check here
		  $ionicPopup.confirm({
			title: 'Exit',
			template: 'are you sure you want to exit?'
		  }).then(function(res) {
			if (res) {
			  //ionic.Platform.exitApp();
			  navigator.app.clearCache();
              navigator.app.exitApp();
			}
		  })
		}
	  }, 100);
	  
	  

}) 

  .filter('split', function() {
        return function(input, splitChar, splitIndex) {
            // do some bounds checking here to ensure it has that index
            return input.split(splitChar)[splitIndex];
        }
    })
  
  .filter("langTranslate", function() { 
      return function(englishInput, translatedLang) { 
        if(translatedLang === undefined){
            return englishInput;
        }
        
        if(translatedLang.length == 0 )
        {
            return englishInput;
        }else{
            return translatedLang;
        }
         
      }
    })

  .filter("menuLangTranslate", function() { 
      return function(englishInput, newrides, completed, cancelled) { 
        if(newrides === undefined || completed === undefined || cancelled === undefined){
            return englishInput;
        }
        
        if(englishInput=="NEW RIDES"){
            return newrides;
        }
        if(englishInput=="COMPLETED"){
            return completed;
        }
        if(englishInput=="CANCELLED"){
            return cancelled;
        }
         
      }
    })



.config(function ($stateProvider, $urlRouterProvider) {
    
    /*setTimeout(function() {
				
         navigator.splashscreen.hide();
    }, 3000);*/
    
    
    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.search', {
        url: '/search',
        views: {
            'menuContent': {
                templateUrl: 'templates/search.html'
            }
        }
    })

    .state('app.browse', {
        url: '/browse',
        views: {
            'menuContent': {
                templateUrl: 'templates/browse.html'
            }
        }
    })

    /*settings page*/
    .state('app.settings', {
        url: '/settings',
        views: {
            'menuContent': {
                templateUrl: 'templates/settings.html',
                controller: 'settingsCtrl'
            }
        }
    })
    /*Settings page*/

    /*Recipt page*/
    .state('app.reciept', {
            url: '/reciept',
            views: {
                'menuContent': {
                    templateUrl: 'templates/reciept.html',
                    controller: 'recieptCtrl'
                }
            }
        })
        /*Reciept Page*/

    /*Landin page*/
    .state('landing', {
            url: '/landing',
            templateUrl: 'templates/landing.html',
            controller: 'landingCtrl'
        })
        /*Landin page ends*/

    /* my_ride page*/
    .state('app.my_ride', {
            url: '/my_ride',
            views: {
                'menuContent': {
                    templateUrl: 'templates/my_ride.html',
                    controller: 'rideCtrl'
                }
            }
        })
        /* my_ride page*/

    /* tripDetails page*/
    .state('app.tripDetails', {
            url: '/tripDetails',
            views: {
                'menuContent': {
                    templateUrl: 'templates/tripDetails.html',
                    controller: 'rideCtrl'
                }
            }
        })
        /* tripDetails page*/

    /*rate card page*/
    .state('app.rate_card', {
            url: '/rate_card',
            views: {
                'menuContent': {
                    templateUrl: 'templates/rate_card.html',
                    controller: 'rateCardCtrl'
                }
            }
        })
        /*rate card page*/

    /*rade_mape page*/
    .state('app.rade_map', {
            url: '/rade_map',
            views: {
                'menuContent': {
                    templateUrl: 'templates/rade_map.html',
                    controller: 'mapCtrl'
                }
            }
        })
        /*rade_mape page*/


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('landing');
});