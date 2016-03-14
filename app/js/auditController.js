angular.module("Gedeon")
.controller('AuditCtrl',function($scope,$rootScope,$http,$location){

	$rootScope.actualMenu = 'audit';
	$scope.scopeCheckUrl = function(){
	}

	//funcion para acceder a un valor desde la vista cuando el 2waydatabinding falla
    $rootScope.viewDataBind = function(data){

		return eval('$scope.'+ data);
		//return 10;

	}
	$rootScope.$on('$viewContentLoaded',function(event){ 
		$rootScope.rootCheckUrl('viewAudits');
		//alert('user')
	 	//alert('users',event.targetScope)
    });
    $scope.waitAuditLoad = true;
    $http.get('viewUsers', [''])
    .success(function(data)
    {	
    	
    	if(data['error']){

			$location.reload();

		}else{

			$scope.usersLoad= data

		}


    })
    .error(function(data)
    {
    	$location.reload();
    });
    $http.get('viewDependences', [''])
    .success(function(data)
    {	
    	
    	if(data['error']){

			$location.reload();

		}else{

			$scope.dependencesLoad= data

		}


    })
    .error(function(data)
    {
    	$location.reload();
    });
    $http.get('viewProjects', [''])
    .success(function(data)
    {	
    	
    	if(data['error']){

			$location.reload();

		}else{

			$scope.projectsLoad= data

		}


    })
    .error(function(data)
    {
    	$location.reload();
    });
    $http.get('viewAudits', [''])
    .success(function(data)
    {	
    	
    	if(data['error']){

			$location.reload();

		}else{

			$scope.audits= data

		}

		$scope.waitAuditLoad = false;

    })
    .error(function(data)
    {
    	$location.reload();
    });
    $scope.reset = function(type){
    	if(type == 1 && $scope.search.user == null){
    		$scope.search.user = ''
    	}
    	if(type == 2 && $scope.search.dependence == null){
    		$scope.search.dependence = ''
    	}
    	if(type == 3 && $scope.search.project == null){
    		$scope.search.project = ''
    	}
    }

})
