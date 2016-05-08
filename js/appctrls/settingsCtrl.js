App.controller('settingsCtrl', function ($scope, $rootScope, $ionicModal, $timeout, $state, $ionicLoading, $ionicPopup, WebService, $ionicHistory, $filter) {
  
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
    $scope.signUp = {};
    $scope.do_update = function (form) {

        if (
            form.$valid && $scope.signUp.pwd == $scope.signUp.c_pwd

        ) {

            var link = 'update_driver_pwd';

            var post_data = {
                'username': $rootScope.user_data.User_name,
                'Password': $scope.signUp.pwd,
                'old_pass': $scope.signUp.old_pwd
            }

            WebService.show_loading();

            var promise = WebService.send_data(link, post_data);

            promise.then(function (data) {

                $ionicLoading.hide();

                form.$setPristine();
                $scope.signUp = {};

                if (data.status == 'success') {

                    $ionicPopup.alert({
                        title: '<p class="text-center color-yellow">'+$filter('langTranslate')("SUCCESS",$rootScope.appConvertedLang['SUCCESS'])+'</p>',

                        template: "<p class='text-center color-gery'>"+$filter('langTranslate')("Password successfully updated",$rootScope.appConvertedLang['Password_successfully_updated'])+"</p>",
                        scope: $scope
                    });
                }
                if (data.status == 'fail') {
                    $ionicPopup.alert({
                        title: '<p class="text-center color-yellow">'+$filter('langTranslate')("Failed",$rootScope.appConvertedLang['Failed'])+'</p>',

                        template: "<p class='text-center color-gery'>"+$filter('langTranslate')("Current password is error",$rootScope.appConvertedLang['Current_password_is_error'])+"</p>",
                        scope: $scope
                    });
                }

            })
        } else {

            form.pwd.$setDirty();
        }
    }


})