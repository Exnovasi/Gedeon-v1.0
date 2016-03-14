angular.module("Gedeon")
.controller('StartCtrl',function($scope,$rootScope,$http,$location){

	$rootScope.actualMenu = 'start';
	$scope.waitEditDevPlan = true;
	$scope.devPlanForm = {

		image: '',
		title: '',
		description: ''
	}

    //peticion al servidor para cargar la informacion del plan de desarrollo
    $http.get('viewDevelopmentPlan',[''])
    .success(function(data)
    {	
    	
    	if(data['error']){
    		$scope.editDPMessage = ["No se pudo completar la operación"]
		}else{
			$scope.devPlanForm = data;
		};

		$scope.waitEditDevPlan = false
    })
    .error(function(data)
    {	
    	$scope.editDPMessage = [];
		for(var m in data) {
		   $scope.editDPMessage.push(data[m][0]);
		}
    	$scope.processing = false
    });
	

    	

	
})
