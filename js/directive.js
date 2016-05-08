App.directive('fullHeight', function() {
	
	function link(scope, element, attrs) {
		
		
	   var argHeight =  attrs.fullHeight ? attrs.fullHeight : 0;
		scope.$watch(function(){ 
			
			element.height( $(window).height() + parseInt(argHeight) );
			 
		});
		
		
	}
    return {
      link: link
    };
});

App.directive('fullWidth', function() {
	
	function link(scope, element, attrs) {
		
		
		var argWidth =  attrs.fullWidth ? attrs.fullWidth : 0;
		
		element.width( $(window).width() + parseInt(argWidth) );
		
	}
    return {
      link: link
    };
});

App.directive('resize', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        
        w.bind('resize', function () {
            scope.$apply();
        });
    }
});

App.directive('mainmenu',function () { //declaration; identifier master
    function link(scope, element, attrs) { //scope we are in, element we are bound to, attrs of that element
      element.bind('click', function() {
				 
				 $('.active-menu').removeClass('active-menu');
				 element.addClass('active-menu');
				 // scope.$apply();
			});
	  }
		return {
			restrict: 'AE', //describes how we can assign an element to our directive in this case like <div master></div
			link: link // the function to link to our element
		};
}); 
