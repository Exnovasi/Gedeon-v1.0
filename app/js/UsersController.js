angular.module("Gedeon")
.controller('UsersCtrl',function($scope,$rootScope,$http,$location,$modal,fileUpload){

	$rootScope.actualMenu = 'users';
	$scope.scopeCheckUrl = function(){
	}

	//funcion para acceder a un valor desde la vista cuando el 2waydatabinding falla
    $rootScope.viewDataBind = function(data){

		return eval('$scope.'+ data);
		//return 10;

	}

	$rootScope.$on('$viewContentLoaded',function(event){ 
		$rootScope.rootCheckUrl('viewUsers');loginCheck
		//alert('user')
	 	//alert('users',event.targetScope)
    });
    $scope.loadTags = function(query,select) {
 		return $http.post('viewProjectForDependence', {'dependence': select ,'project': query})
    };
    
	$scope.wait = false;
	$scope.sessionMessage = [];
	$scope.success = false;
	$scope.userForm = {

		name: '',
		email: '',
		telephone: '',
		avatar: 'img/img_profile_users/default-avatar2.jpg',
		dependence: '',
		role: '',
		dependenceid: '',
		roleid: '',
		password: '',	
		password_confirmation: ''
	}

	$scope.usersRoles = [

		{
			name: 'Administrador',
			id: 1
		},
		{
			name: 'Directivo',
			id: 2
		},
		{
			name: 'Asesor',
			id: 3
		},
		{
			name: 'Responsable de área',
			id: 4
		},
		{
			name: 'Operativo',
			id: 5
		}
	]

	 
	
	$scope.selectedTabUsers = 0


    //muetras todos los usuarios creados
	$scope.waitUsersLoad = true;
	$http.get('viewUsers', [''])
    .success(function(data)
    {	
    	
    	if(data['error']){

			$location.path( "/home/start" );

		}else{

			$scope.users= data

		}

		$scope.waitUsersLoad = false;

    })
    .error(function(data)
    {
    	$location.reload();
    });

    /*cargar las dependencias creadas*/
    $scope.waitCreate = true
    $http.get('viewDependences', [''])
    .success(function(data)
    {	
    	
    	if(data['error']){

			$location.path( "/home/star" );

		}else{

			$scope.dependences= data

		}

		$scope.waitCreate = false;

    })
    .error(function(data)
    {
    	$location.reload();
    });

    //oculta los alert de mensajes
    $scope.dismissAlert = function(){

		$scope.createMessage = false;
		$scope.createSuccess = false;		

	}

	//funcion que crea un nuevo usuario
	$scope.createUser = function(){
		$scope.waitCreate = true;
		$scope.createUserMessage = null;
		$scope.createUserSuccess = null;
        //peticion al servidor usando http
        $http.post('createUser', $scope.userForm)
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.createUserMessage = [data['error']]
    		}else if(data['success']){
    			$scope.createUserMessage = false;
    			$scope.users.push(data['success']);
    			$scope.createUserSuccess = "El usuario se creo con Exito!";
    			angular.copy($scope.userForm,$scope.users[$scope.users.indexOf($scope.userFormAux)])
    			$scope.userForm = {
					name: '',
					email: '',
					telephone: '',
					avatar: 'img/img_profile_users/default-avatar2.jpg',
					password: '',
					dependenceid: '',
					roleid: '',	
					password_confirmation: ''
				}
    		}

    		$scope.waitCreate = false

        })
        .error(function(data)
        {
        	$scope.createUserMessage = [];
			for(var m in data) {
			   $scope.createUserMessage.push(data[m][0]);
			}
			
        	$scope.waitCreate = false
        });       
	};

	//funcion que edita un usuario
	$scope.editUserPartial = function(){

		$scope.waitEdit = true;
		$scope.createUserMessage = false;

        
        //si el password esta presente envia la peticion a una url diferente
        if ($scope.userForm.password || $scope.userForm.password_confirmation) {

	        //peticion al servidor usando http
	        $http.post('editUser', $scope.userForm)
	        .success(function(data)
	        {	
	        	
	        	if(data['error']){
	        		$scope.createUserMessage = [data['error']]
	    		}else if(data['success']){
	    			$scope.createUserMessage = false;
	    			$scope.detectChanges = false;
	    			angular.copy(data['success'],$scope.users[$scope.users.indexOf($scope.userFormAux)])
	    			$scope.createUserSuccess = "El usuario se edito con Exito!";
	    			
	    		}

	    		$scope.waitEdit = false

	        })
	        .error(function(data)
	        {
	        	$scope.createUserSuccess = false
	        	$scope.createUserMessage = [];
				for(var m in data) {
				   $scope.createUserMessage.push(data[m][0]);
				}
				
	        	$scope.waitEdit = false
	        });             
        }else{

        	//peticion al servidor usando http
	        $http.post('editUserPartial', $scope.userForm)
	        .success(function(data)
	        {	
	        	
	        	if(data['error']){
	        		$scope.createUserMessage = [data['error']]
	    		}else if(data['success']){
	    			$scope.createUserMessage = false;
	    			$scope.detectChanges = false;
	    			angular.copy(data['success'],$scope.users[$scope.users.indexOf($scope.userFormAux)])
	    			$scope.createUserSuccess = "El usuario se edito con Exito!";
	    			
	    		}

	    		$scope.waitEdit = false

	        })
	        .error(function(data)
	        {
	        	$scope.createUserSuccess = false
	        	$scope.createUserMessage = [];
				for(var m in data) {
				   $scope.createUserMessage.push(data[m][0]);
				}
				
	        	$scope.waitEdit = false
	        }); 

        };
	};

	$scope.loadUserForm = function(user){

		$scope.editingUser = true
		$scope.detectChanges = false;
		$scope.userFormAux = user;
		angular.copy(user,$scope.userForm);
		$scope.createUserMessage = false;
		$scope.createUserSuccess = false;		
		$scope.selectedTabUsers = 1

	}

	$scope.cancelEditUser = function(){

		$scope.userForm = {
			name: '',
			email: '',
			telephone: '',
			avatar: 'img/img_profile_users/default-avatar2.jpg',
			dependence: '',
			role: '',
			dependenceid: '',
			roleid: '',
			password: '',	
			password_confirmation: ''
		}
		$scope.editingUser = false;
		$scope.selectedTabUsers = 0;
		$scope.detectChanges = false;
	}

	//funcion que habilita o deshabilita un usuario
	$scope.enabledUser = function(user){

	    //peticion al servidor usando http
	    $http.post('enabledUser', user)
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){
	    		
			}else if(data['success']){
				user.enabled = !user.enabled;
				
			}

	    })
	    .error(function(data)
	    {
	    	
	    });             
        
	};

	
	//funcion que abre el modal para editar el avatar 
	$scope.openModal = function(){

		var modalInstance = $modal.open({
	        animation: true,
	        templateUrl: 'views/common/modal_edit_avatar.html',
	        backdrop: 'static',
	        controller: 'ModalAvatarCtrl',
	        resolve: {
		      	profile: function () {
		          return $scope.userForm;
		        }
	        }

     	});


     	$scope.imageCropResult = null;
	    $scope.showImageCropper = true;

	    $scope.$watch('imageCropResult', function(newVal) {
	        if (newVal) {
	        }
	    });

	    modalInstance.result.then(function (profile) {
	      $scope.profile = profile;
	    });

		
    }; 




	
})
.controller('ModalAvatarCtrl',function($scope, $modalInstance,profile,$http,$location,$rootScope){

	$scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	};

	$scope.myImage='';
	$scope.imageCropResult= '';
	$scope.imgFrame = 'circle';
	$scope.maxWidth = 300;

	//funcion que carga la imagen en el formulario de creación
	$scope.loadAvatar = function(){

		if (!profile.id) {

			profile.avatar = $scope.imageCropResult;
			$modalInstance.dismiss('cancel');
		}else{

			profile.avatar = $scope.imageCropResult;
			$scope.processing = true
		    //peticion al servidor para cargar la informacion de perfil del usuario logueado
		    $http.post('editAvatar',profile)
		    .success(function(data)
		    {	
		    	
		    	if(data['error']){
		    		$scope.errorMessage = ["No se pudo completar la operación"]
				}else{
					$modalInstance.close(data[0]);
					$modalInstance.dismiss('cancel');
				};

				$scope.processing = true
		    })
		    .error(function(data)
		    {	
		    	$scope.errorMessage = [];
				for(var m in data) {
				   $scope.errorMessage.push(data[m][0]);
				}
		    	$scope.processing = false
		    });
		};
    };

	//funcion que edita la imagen de perfil del usuario logueado 
	$scope.editAvatar = function(){

		$scope.processing = true

	    //peticion al servidor para cargar la informacion de perfil del usuario logueado
	    $http.post('editAvatar',{avatar: $scope.imageCropResult})
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){
	    		$location.path( "/login" );
			}else{
				$modalInstance.close(data[0]);
				$scope.processing = true
			};

	    })
	    .error(function(data)
	    {	
	    	$scope.errorMessage = [];
			for(var m in data) {
			   $scope.errorMessage.push(data[m][0]);
			}
	    	$scope.processing = false
	    });
    };

})
