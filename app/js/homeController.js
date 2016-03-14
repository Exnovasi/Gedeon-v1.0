angular.module("Gedeon")
.controller('HomeCtrl',function($scope,$rootScope,$timeout,$http,$location){


	$scope.projects = [
		{
			name: 'P1'
		},
		{
			name: 'P2'
		},
		{
			name: 'P3'
		}
	]

    $scope.$on('$viewContentLoaded',function(event){ 

        //$rootScope.loadOK = true
        //event.targetScope.scopeCheckUrl()
        //alert('home',event)
    });

	$timeout(function(){

		$scope.notificationCount = 2
    }, 1000)

	/*$timeout(function(){

	$scope.notificationCount = false
	    }, 5000)*/
    
        
    //$rootScope.check = true;
    $http.get('loginCheck', [''])
    .success(function(data)
    {   
        
        if(data['user']){
            
            $rootScope.actualUser = data
        }else{

            $location.path( "/login" );
        }

        $rootScope.check = false;
        $rootScope.loadOK = true

    })
    .error(function(data)
    {
        $location.path( "/login" );
    });


    //cierra la actual sesion
    $scope.logOut = function () {

    	$scope.logOut = true

		//peticion al servidor usando http
        $http.post('logout', [''])
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.sessionMessage = data['error']
    		}else if(data['success']){
    			$location.path( "/login" );
    			
    		}

        })
        .error(function(data)
        {
        	
        });
		
	};
	
})

