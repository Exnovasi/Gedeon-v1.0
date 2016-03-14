angular.module("Gedeon")
.controller('LoginCtrl',function($scope,$rootScope,$http,$location){


	$scope.wait = false;
	$scope.sessionMessage = [];
	$scope.success = false;
	$scope.loginForm = {
		
		user: '',
		password: ''
	}


	

	$scope.check = true;
	$http.get('loginCheck', [''])
    .success(function(data)
    {	
    	
    	if(data['user']){

			
			$location.path( "/home/start" );

		}else{

		}

		$scope.check = false;

    })
    .error(function(data)
    {
    	if (data.length>0) {

    	};
    	$scope.sessionMessage = 'Por favor ingrese el Usuario y Contraseña';
    	
    });

    /*$http.get('createUser', [''])
    .success(function(data)
    {	
    	
    	if(data['session']){
			
			$location.path( "/login" );

		}else{

		}

		$scope.check = false;
		console.log(data);

    })
    .error(function(data)
    {
    	$scope.sessionMessage = 'Por favor ingrese el Usuario y Contraseña';
    	console.log(data);
    });*/

    
	//funcion que valida el inicio de sesion 
	$scope.login = function(){

		$scope.wait = true;
		$scope.sessionMessage = [];

		//validacion del lado del cliente 
		if ($scope.loginForm.user == "") {

			$scope.sessionMessage.push("Por favor ingrese el nombre de usuario");
		};

		if ($scope.loginForm.password == "") {

			$scope.sessionMessage.push("Por favor ingrese la clave");

		};

		if ($scope.sessionMessage.length >= 1){
			$scope.wait = false;
			return;
		};

        //peticion al servidor usando http
        $http.post('login', $scope.loginForm)
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.sessionMessage = [data['error']]
    		}else if(data['name']){
    			$scope.sessionMessage = false
    			$location.path( "/home/start" );
    		}

    		$scope.wait = false
		console.log('success',data);


        })
        .error(function(data)
        {
    	console.log('error',data);
        	
        	$scope.sessionMessage = [];
			for(var m in data) {
			   $scope.sessionMessage.push(data[m][0]);
			}
			
        	$scope.wait = false
        });       
	};

	
})
