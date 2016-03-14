var Gedeon = angular.module("Gedeon",['ngImgCrop',"ui.router","ngRoute","ngMaterial",'ui.bootstrap','ngTagsInput'], function($interpolateProvider) {
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');

})


.config(function($routeProvider,$locationProvider,$stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise('/');

	$stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('login', {
            url: '/',
            controller:"LoginCtrl",
			templateUrl: "views/login.html",
        })
        .state('home', {
            url: '/home',
           	controller:"HomeCtrl",
			templateUrl: "views/home.html"
        })
        .state('home.start', {
            url: '/start',
           	controller:"StartCtrl",
			templateUrl: "views/common/start.html"
        })
        .state('home.users', {
            url: '/users',
           	controller:"UsersCtrl",
			templateUrl: "views/common/users.html"
        })
        .state('home.config', {
            url: '/config',
           	controller:"ConfigCtrl",
			templateUrl: "views/common/config.html"
        })
        .state('home.projects', {
            url: '/projects',
           	controller:"ProjectsCtrl",
			templateUrl: "views/common/projects_module.html"
        })
        .state('home.audit', {
            url: '/audit',
           	controller:"AuditCtrl",
			templateUrl: "views/common/audit.html"
        })/*
        .state('verify', {
            url: '/verify_account/:n/{c:.*}',
           	controller:"VerifyCtrl",
			templateUrl: "views/auth/verify.blade.php"
        })
        */
})



.run(function($rootScope,$location,$http) {


	$rootScope.goTo = function(url){

		$location.path(url);
	}


	$rootScope.$on('$stateChangeSuccess', function() {
		$rootScope.actualMenu = false;
		$('html, body').animate({ scrollTop: $('html').offset().top }, 0);

		$rootScope.rootCheckUrl = function(url){
			$rootScope.checkUrl = true;
			eval('$http.get('+'"'+url+'"'+',[""])')
		    .success(function(data)
		    {	
		    	
		    	if(data['error']){
					$location.path( "/home/start" );
				}else{

				}

				$rootScope.checkUrl = null;
				$rootScope.loadOK = true

		    })
		    .error(function(data)
		    {
		    	$location.path( "/home/start" );
		    });
	    }


    });


})


