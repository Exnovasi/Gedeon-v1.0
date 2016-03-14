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



;angular.module("Gedeon")
.controller('ConfigCtrl',function($scope,$rootScope,$http,$location,$state,fileUpload,$modal){

	$rootScope.actualMenu = 'config';
	$rootScope.rootCheckUrl('viewDependences');
	$scope.wait = false;

	//funcion para acceder a un valor desde la vista cuando el 2waydatabinding falla
    $rootScope.viewDataBind = function(data){

		return eval('$scope.'+ data);
		//return 10;

	}

	//funcion para acceder a un valor desde la vista cuando el 2waydatabinding falla
    $rootScope.changeDataBind = function(data,val){

			$scope.$eval(data +' = ' + val);

    	console.log(eval('$scope.'+ data));

	}

    // *****************************************************************************
	// DEPENDENCIAS
	// *****************************************************************************
	$scope.dependenceForm = {

		name: '',
	}

	$scope.dependences = []

	$scope.selectedTabDep = 0;
	$scope.selectedIndex = 2;
    //muestra todas las dependencias creadas
	$scope.waitLoad = true;
	$scope.waitDelete = false;
	$http.get('viewDependences', [''])
    .success(function(data)
    {	
    	
    	if(data['error']){

			$location.reload();

		}else{

			$scope.dependences= data

		}

		$scope.waitLoad = false;

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


	//funcion que crea una nueva dependencia
	$scope.createDependence = function(){

		$scope.waitCreate = true;
		$scope.createMessage = null;
		$scope.createSuccess = false;
		
        //peticion al servidor usando http
        $http.post('createDependence', $scope.dependenceForm)
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.createMessage = [data['error']]
    		}else if(data['success']){
    			$scope.createMessage = false;
    			$scope.dependences.push(data['success']);
    			$scope.createSuccess = "La dependencia se creo con Exito!";
    			$scope.dependenceForm = {
					name: '',
				}
    		}

    		$scope.waitCreate = false

        })
        .error(function(data)
        {
        	$scope.createMessage = [];
			for(var m in data) {
			   $scope.createMessage.push(data[m][0]);
			}
			
        	$scope.waitCreate = false
        });       
	};

	//funcion que envia la peticion para edita una dependencia
	$scope.editDependences = function(){

		$scope.waitEdit = true;
		$scope.createMessage = false;
		$scope.createSuccess = false;
        
        //peticion al servidor usando http
        $http.post('editDependence', $scope.dependenceForm)
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.createMessage = [data['error']]
    		}else if(data['success']){
    			$scope.createMessage = false;
    			$scope.detectChanges = false;
    			angular.copy($scope.dependenceForm,$scope.dependences[$scope.dependences.indexOf($scope.dependenceFormAux)])
    			$scope.createSuccess = "La dependencia se edito con Exito!";
    			
    		}

    		$scope.waitEdit = false

        })
        .error(function(data)
        {
        	$scope.createSuccess = false
        	$scope.createMessage = [];
			for(var m in data) {
			   $scope.createMessage.push(data[m][0]);
			}
			
        	$scope.waitEdit = false
        });             
        
	};

	//cargar el formulario de edicion de dependencias
	$scope.loadDependenceForm = function(dependence){

		delete $scope.detectChanges;
		$scope.dependenceFormAux = dependence;
		angular.copy(dependence,$scope.dependenceForm);
		$scope.createMessage = false;
		$scope.createSuccess = false;		
		$scope.selectedTabDep = 1

	}

	//cancela la edicion de dependencias
	$scope.cancelEditDependence = function(){

		$scope.dependenceForm = {
			name: ''
		}
		$scope.selectedTabDep = 0;
		delete $scope.detectChanges;
		$scope.createMessage = false;
		$scope.createSuccess = false;
	}

	
	//funcion que pregunta el password para eliminar una dependencia
	$scope.confirmDeleteDependence = function(dependence){

		$scope.waitDelete = dependence;
		$scope.popupText= 'Para eliminar por favor ingrese su password:';
		dependence.deletePassword = ''

	};

	//funcion que cancela la eliminacion de dependencia
	$scope.closeWaitDelete = function(dependence){

		$scope.waitDelete = false;
		dependence.deletePassword = ''

	};


	//funcion que envia la peticion para eliminar una dependencia 
	$scope.deleteDependence = function(dependence){

		console.log(dependence);
		$scope.waitDeleteDependence = true;
	    //peticion al servidor usando http
	    $http.post('deleteDependence', dependence)
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){
	    		$scope.popupText= data['error'];
			}else if(data['success']){
				$scope.dependences.splice($scope.dependences.indexOf(dependence), 1);
				
			}
			
			$scope.waitDeleteDependence = false;


	    })
	    .error(function(data)
	    {
	    	$location.reload();	    	
	    });             
        
	};

	// *****************************************************************************
	// PLAN DE DESARROLLO
	// *****************************************************************************
	//funcion que abre el modal para editar el avatar 

	$scope.devPlanForm = {

		image: 'img/Gedeon-Logo.jpg',
		title: '',
		description: ''
	}

	$scope.waitEditDevPlan = true;
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


	$scope.openModal = function(){

		var modalInstance = $modal.open({
	        animation: true,
	        templateUrl: 'views/common/modal_edit_avatar.html',
	        backdrop: 'static',
	        controller: 'ModalDPlanImgCtrl',
	        resolve: {
		      	devplan: function () {
		          return $scope.devPlanForm;
		        }
	        }

     	});


     	$scope.imageCropResult = null;
	    $scope.showImageCropper = true;

	    $scope.$watch('imageCropResult', function(newVal) {
	        if (newVal) {
	        }
	    });

	    modalInstance.result.then(function (devplan) {
	      $scope.devPlanForm = devplan;
	    });		
    };

    //funcion que carga la imagen en el formulario de creación
	$scope.editDevPlan = function(){
		console.log($scope.devPlanForm);
		$scope.waitEditDevPlan = true
	    //peticion al servidor para cargar la informacion de perfil del usuario logueado
	    $http.post('createDevelopmentPlan',$scope.devPlanForm)
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){
	    		$scope.editDPMessage = ["No se pudo completar la operación"]
			}else{
				$scope.editDPSuccess = 	"La información se actualizo con éxito!"
			};

			$scope.waitEditDevPlan = false
	    })
	    .error(function(data)
	    {	
	    	$scope.editDPMessage = [];
			for(var m in data) {
			   $scope.editDPMessage.push(data[m][0]);
			}
	    	$scope.waitEditDevPlan = false
	    });
    };

    // *****************************************************************************
	// LINEAS
	// *****************************************************************************
	$scope.lineForm = {

		name: '',
		objective: '',
		weight: 0
	}

	$scope.lines = []

	$scope.countLinesWeight = function(){

		$scope.totalLinesWeight = 100;
		$scope.lines.forEach(function(line){
			$scope.totalLinesWeight -= line.weight;
		});
 	}

	$scope.selectedTabLines = 0;
    //muetras todas las lineas creadas
	$scope.waitLoadLines = true;
	$scope.waitDeleteLine = null;
	$http.get('viewLines', [''])
    .success(function(data)
    {	
    	
    	if(data['error']){

			$location.reload();
		}else{

			$scope.lines= data
    		$scope.countLinesWeight();
		}

		$scope.waitLoadLines = false;

    })
    .error(function(data)
    {
    	$state.go('home.config');

    });



    $scope.$watch('lineForm.weight', function(newVal, oldVal) {

       if (newVal && $scope.lineFormAux) {

	    	if (newVal != $scope.lineFormAux.weight) {
	    		$scope.detectchangesLine = true;
    		}else{
    			$scope.detectchangesLine = false;
    		}

    	}else {
    		$scope.detectchangesLine = false;
    	}
   });

    //oculta los alert de mensajes
    $scope.dismissAlertLines = function(){

		$scope.createMessageLines = false;
		$scope.createSuccessLines = false;		

	}

	//funcion que crea una nueva dependencia
	$scope.createLine = function(){

		$scope.waitCreateLine = true;
		$scope.createMessageLines = null;
		$scope.createSuccessLines = false;
		
        //peticion al servidor usando http
        $http.post('createLine', $scope.lineForm)
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.createMessageLines = [data['error']]
    		}else if(data['success']){
    			$scope.createMessageLines = false;
    			$scope.lines.push(data['success']);
    			$scope.createSuccessLines = "La línea se creo con Exito!";
    			$scope.countLinesWeight();
    			$scope.lineForm = {

					name: '',
					objective: '',
					weight: 0
				}
    		}

    		$scope.waitCreateLine = false

        })
        .error(function(data)
        {
        	$scope.createMessageLines = [];
			for(var m in data) {
			   $scope.createMessageLines.push(data[m][0]);
			}
			
        	$scope.waitCreateLine = false
        });       
	};

	//funcion que envia la peticion para edita una linea
	$scope.editLines = function(){

		$scope.waitCreateLine = true;
		$scope.createMessageLines = false;
		$scope.createSuccessLines = false;
        
        //peticion al servidor usando http
        $http.post('editLine', $scope.lineForm)
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.createMessageLines = [data['error']]
    		}else if(data['success']){
    			$scope.createMessageLines = false;
    			delete $scope.detectChangesLine;
    			angular.copy($scope.lineForm,$scope.lines[$scope.lines.indexOf($scope.lineFormAux)]);
    			$scope.countLinesWeight();
    			$scope.createSuccessLines = "La línea se edito con Exito!";    			
    		}

    		$scope.waitCreateLine = false

        })
        .error(function(data)
        {
        	$scope.createSuccessLines = false
        	$scope.createMessageLines = [];
			for(var m in data) {
			   $scope.createMessageLines.push(data[m][0]);
			}
			
        	$scope.waitCreateLine = false
        });             
        
	};

	//cargar el formulario de edicion de dependencias
	$scope.loadLineForm = function(line){

		$scope.lineFormAux = false;
		$scope.totalLinesWeightEdit = $scope.totalLinesWeight + line.weight; 
		$scope.lineFormAux = line;
		angular.copy(line,$scope.lineForm);
		$scope.createMessageLines = false;
		$scope.createSuccessLines = false;		
		$scope.selectedTabLines = 1
		$scope.detectChangesLine = false;

	}

	//cancela la edicion de dependencias
	$scope.cancelEditLine = function(){

		$scope.lineForm = {
			name: ''
		}
		$scope.selectedTabLines = 0;
		delete $scope.detectChangesLine;
		$scope.createMessageLines = false;
		$scope.createSuccessLines = false;
	}

	
	//funcion que pregunta el password para eliminar una dependencia
	$scope.confirmDeleteLine = function(line){

		$scope.waitConfirmDeleteLine = line;
		$scope.popupTextLine= 'Para eliminar por favor ingrese su password:';
		line.deletePassword = ''

	};

	
	//funcion que cancela la eliminacion de dependencia
	$scope.closeWaitDeleteLine = function(line){

		$scope.waitConfirmDeleteLine = false;
		line.deletePassword = ''
		$scope.reassignAreas = false;

	};


	//funcion que envia la peticion para eliminar una dependencia 
	$scope.deleteLine = function(line){

		$scope.waitDeleteLine = true;
	    //peticion al servidor usando http
	    $http.post('deleteLine', line)
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){
	    		$scope.popupTextLine= data['error'];
	    		line.deletePassword = '';
    		}else if(data['reassign']){
    			$scope.linesAux = [];
    			angular.copy($scope.lines,$scope.linesAux); 
    			$scope.linesAux.splice($scope.lines.indexOf(line), 1);
        		$scope.popupTextLine = data['reassign']
        		$scope.reassignAreas= true;
			}else if(data['success']){
				$scope.reassignAreas= false;
				$scope.lines.splice($scope.lines.indexOf(line), 1);
				$scope.reassignSuccessLines = data['success'];
				$scope.countLinesWeight();
			}
			
			$scope.waitDeleteLine = false;


	    })
	    .error(function(data)
	    {
	    	$location.reload();	    	
	    });             
        
	};

	// *****************************************************************************
	// ÁREAS
	// *****************************************************************************
	$scope.areaForm = {

		name: '',
		objective: '',
		weight: 0
	}

	$scope.areas = []

	$scope.countAreasWeight = function(){

		$scope.totalAreasWeight = 100;
		$scope.areas.forEach(function(area){
			$scope.totalAreasWeight -= area.weight;
			console.log(area.weight,$scope.totalAreasWeight);
		});
 	}

 	
 	$scope.loadAreasForLine = function(select){
 		$scope.totalAreasWeight = 100;
 		
 		if (!select){
 			$scope.areas = [];
 			return
 		};
 		$scope.cancelEditArea();
 		$scope.waitLoadAreas = true;

		$http.post('viewAreas', {'line': select.id})
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){

				$location.reload();
			}else{
				$scope.areas= data
			}

    		$scope.countAreasWeight();
			$scope.waitLoadAreas = false;

	    })
	    .error(function(data)
	    {
	    	$state.go('home.config');

	    });
 	}

	$scope.selectedTabAreas = 0;

    //muetras todas las Areas creadas
	$scope.waitLoadAreas = false;
	$scope.waitDeleteArea = null;



    /*$scope.$watch('areaForm.weight', function(newVal, oldVal) {

       if (newVal && $scope.areaFormAux) {
	    	if (newVal != $scope.areaFormAux.weight) {
	    		$scope.detectChangesArea = true;
	    		
    		}else{
    			$scope.detectChangesArea = false;
    		}

    	}else {
    		$scope.detectchangesArea = false;
    	}
   });*/

	
    //oculta los alert de mensajes
    $scope.dismissAlertAreas = function(){

		$scope.createMessageAreas = false;
		$scope.createSuccessAreas = false;		

	}

	//funcion que crea una nueva dependencia
	$scope.createArea = function(id){

		$scope.waitCreateArea = true;
		$scope.createMessageAreas = null;
		$scope.createSuccessAreas = false;
		$scope.areaForm.line = id;

        //peticion al servidor usando http
        $http.post('createArea', $scope.areaForm)
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.createMessageAreas = [data['error']]
    		}else if(data['success']){
    			$scope.createMessageAreas = false;
    			$scope.areas.push(data['success']);
    			$scope.createSuccessAreas = "La línea se creo con Exito!";
    			$scope.areaForm = {

					name: '',
					objective: '',
					weight: 0
				}
    		}

			$scope.countAreasWeight();
    		$scope.waitCreateArea = false

        })
        .error(function(data)
        {
        	$scope.createMessageAreas = [];
			for(var m in data) {
			   $scope.createMessageAreas.push(data[m][0]);
			}
			
        	$scope.waitCreateArea = false
        });       
	};

	//funcion que envia la peticion para edita una Área
	$scope.editAreas = function(){

		$scope.waitCreateArea = true;
		$scope.createMessageAreas = false;
		$scope.createSuccessAreas = false;
        
        //peticion al servidor usando http
        $http.post('editArea', $scope.areaForm)
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.createMessageAreas = [data['error']]
    		}else if(data['success']){
    			
    			//si se edito la linea de esta area,cargo de nuevo las areas
    			if($scope.areaFormAux.line != $scope.areaForm.line){

    				$scope.cancelEditArea()
    				$scope.areas.splice($scope.areas.indexOf($scope.areaFormAux), 1);
    			};

    			$scope.createMessageAreas = false;
    			delete $scope.detectChangesArea;
    			angular.copy($scope.areaForm,$scope.areas[$scope.areas.indexOf($scope.areaFormAux)]);
    			$scope.countAreasWeight();
    			$scope.createSuccessAreas = "La línea se edito con Exito!";    	
    					
    		}

    		$scope.waitCreateArea = false

        })
        .error(function(data)
        {
        	$scope.createSuccessAreas = false
        	$scope.createMessageAreas = [];
			for(var m in data) {
			   $scope.createMessageAreas.push(data[m][0]);
			}
			
        	$scope.waitCreateArea = false
        });             
        
	};

	//cargar el formulario de edicion de dependencias
	$scope.loadAreaForm = function(area){

		$scope.areaFormAux = false;
		$scope.countAreasWeight();
		$scope.totalAreasWeightEdit = $scope.totalAreasWeight + area.weight; 
		$scope.areaFormAux = area;
		angular.copy(area,$scope.areaForm);
		$scope.createMessageAreas = false;
		$scope.createSuccessAreas = false;		
		$scope.selectedTabAreas = 1
		$scope.$eval('detectChangesArea = false');

	}

	//cancela la edicion de dependencias
	$scope.cancelEditArea = function(){

		/*$scope.areaFormAux = false;
		$scope.totalAreasWeightEdit = $scope.totalAreasWeight + area.weight; */
		$scope.areaForm = {
			name: '',
			objective: '',
			weight: 0
		}
		$scope.selectedTabAreas = 0;
		$scope.$eval('detectChangesArea = null');
		$scope.detectChangesArea = null;
		$scope.createMessageAreas = false;
		$scope.createSuccessAreas = false;
	}

	
	//funcion que pregunta el password para eliminar una dependencia
	$scope.confirmDeleteArea = function(area){

		$scope.waitConfirmDeleteArea = area;
		$scope.popupTextArea= 'Para eliminar por favor ingrese su password:';
		area.deletePassword = ''
		$scope.reassignPrograms= false;

	};

	//funcion que cancela la eliminacion de dependencia
	$scope.closeWaitDeleteArea = function(area){

		$scope.waitConfirmDeleteArea = false;
		area.deletePassword = ''

	};


	//funcion que envia la peticion para eliminar una dependencia 
	$scope.deleteArea = function(area){

		$scope.waitDeleteArea = true;
	    //peticion al servidor usando http
	    $http.post('deleteArea', area)
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){
	    		area.deletePassword = ''
	    		$scope.popupTextArea= data['error'];
			}else if(data['reassign']){
    			$scope.areasAux = [];
    			angular.copy($scope.areas,$scope.areasAux); 
    			$scope.areasAux.splice($scope.areas.indexOf(area), 1);
        		$scope.popupTextArea = data['reassign']
        		$scope.reassignPrograms= true;
			}else if(data['success']){
				$scope.reassignPrograms= false;
				$scope.areas.splice($scope.areas.indexOf(area), 1);
			}
			
			$scope.waitDeleteArea = false;
			$scope.countAreasWeight();


	    })
	    .error(function(data)
	    {
	    	$location.reload();	    	
	    });             
        
	};


	// *****************************************************************************
	// PROGRAMAS
	// *****************************************************************************
	$scope.programForm = {

		name: '',
		objective: '',
		weight: 0
	}

	$scope.programsNoContentMsg = 'Por favor seleccione una línea'

	$scope.programs = []

	
	$scope.countProgramsWeight = function(){

		$scope.totalProgramsWeight = 100;
		$scope.programs.forEach(function(program){
			$scope.totalProgramsWeight -= program.weight;
		});
 	}

 	//funcion que muestra el mensaje en los formularios
	$scope.programsNoContentMsgFun = function(data,name,select){

		if (name =='A') {

			$scope.totalProgramsWeight = 100;

			if (data.length <= 0) {
				return 'En: ' + select.name + ' No hay ningun programa creado'
			}else if ($scope.totalProgramsWeight == 0) {


				return 'Ya completo el 100% del área: "' + select.name +'"'
			}else{

				return null
			};

		}else{
			if (data == null) {

				return 'Por favor seleccione una línea';
			}else if (!$scope.programsLineSelected){
				return 'Por favor seleccione una área';

			};

		};
				
 	}

 	$scope.programsLoadAreasForLine = function(select){

 		$scope.totalAreasWeight = 100;

 		if (!select){
 			$scope.programsNoContentMsg = $scope.programsNoContentMsgFun(null,'L',select);
 			$scope.programs = [];
 			return
 		};
 		
 		if ($scope.programFormAux) {

 			$scope.cancelEditProgram($scope.programFormAux);
 		};
 		$scope.waitLoadAreas = true;

		$http.post('viewAreas', {'line': select.id})
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){

				$location.reload();
			}else{
				$scope.programsAreas = data
				$scope.programsNoContentMsg = $scope.programsNoContentMsgFun(data,'L',select);
			}

    		$scope.countAreasWeight();
			$scope.waitLoadAreas = false;

	    })
	    .error(function(data)
	    {
	    	$state.go('home.config');

	    });
 	}
 	$scope.loadTags = function(query,select) {
 		return $http.post('viewIndicatorForArea', {'area': select.id,'indicator': query})
    };
 	$scope.loadProgramsForArea = function(select){
 		console.log(select)
 		$scope.totalProgramsWeight = 100;

 		if (!select){
			$scope.programsNoContentMsg = $scope.programsNoContentMsgFun([],'L',select);
 			$scope.programs = []
 			return
 		};

		$scope.waitLoadPrograms = true;
		$scope.cancelEditProgram(select);

		$http.post('viewProgram', {'area': select.id})
	    .success(function(data)
	    {	
	    	if(data['error']){

				$location.reload();
			}else{
				$scope.programs= data
				for (i = 0; i < $scope.programs.programs.length; i++) {
				 	$scope.programs.programs[i].count = i
				 } 
				$scope.programsNoContentMsg = $scope.programsNoContentMsgFun(data,'A',select);
			}

    		$scope.totalProgramsWeight = 100;
			$scope.waitLoadPrograms = false;

	    })
	    .error(function(data)
	    {
	    	$state.go('home.config');

	    });
 	}

	$scope.selectedTabPrograms = 0;

    //muetras todas las Programs creadas
	$scope.waitLoadPrograms = false;
	$scope.waitDeleteProgram = null;



    $scope.$watch('programForm.weight', function(newVal, oldVal) {

       if (newVal && $scope.programFormAux) {
	    	if (newVal != $scope.programFormAux.weight) {
	    		$scope.detectChangesProgram = true;
	    		
    		}else{
    			$scope.detectChangesProgram = false;
    		}

    	}else {
    		$scope.detectchangesProgram = false;
    	}
   });

	//oculta los alert de mensajes

    /*$scope.$watchCollection('programForm', function (newVal, oldVal) { 
    	console.log(newVal,oldVal,$scope.changesProgram);
    	//$scope.detectChangesProgram();
    	

    });*/


    //oculta los alert de mensajes
    $scope.dismissAlertPrograms = function(){

		$scope.createMessagePrograms = false;
		$scope.createSuccessPrograms = false;		

	}

	//funcion que crea una nueva dependencia
	$scope.createProgram = function(areaSelect){

		$scope.waitCreateProgram = true;
		$scope.createMessagePrograms = null;
		$scope.createSuccessPrograms = false;
		$scope.programForm.area = areaSelect.id;

        //peticion al servidor usando http
        $http.post('createProgram', $scope.programForm)
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.createMessagePrograms = [data['error']]
    		}else if(data['success']){
    			$scope.createMessagePrograms = false;
    			//$scope.programs.push(data['success']);
    			$scope.programsNoContentMsg = $scope.programsNoContentMsgFun($scope.programs,'A',areaSelect);
    			$scope.createSuccessPrograms = "El programa se creo con Exito!";
    			$scope.programForm = {

					name: '',
					objective: '',
					weight: 0
				}
				$scope.loadProgramsForArea(areaSelect)
    		}

			$scope.totalProgramsWeight = 100;
    		$scope.waitCreateProgram = false

        })
        .error(function(data)
        {
        	$scope.createMessagePrograms = [];
			for(var m in data) {
			   $scope.createMessagePrograms.push(data[m][0]);
			}
			
        	$scope.waitCreateProgram = false
        });       
	};

	//funcion que envia la peticion para edita una dependencia
	$scope.editPrograms = function(areaSelect){

		$scope.waitCreateProgram = true;
		$scope.createMessagePrograms = false;
		$scope.createSuccessPrograms = false;
        
        //peticion al servidor usando http
        $http.post('editProgram', $scope.programForm)
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.createMessagePrograms = [data['error']]
    		}else if(data['success']){
    			//si se edito el área de este programa,lo elimino de la vista
    			// if($scope.programFormAux.area != $scope.programForm.area){

    			// 	$scope.cancelEditProgram()
    			// 	$scope.programs.splice($scope.programs.indexOf($scope.programFormAux), 1);
    			// };
    			// $scope.createMessagePrograms = false;
    			// delete $scope.detectChangesProgram;
    			// angular.copy($scope.programForm,$scope.programs[$scope.programs.indexOf($scope.programFormAux)]);
    			// $scope.totalProgramsWeight = 100;
    			// $scope.programsNoContentMsg = $scope.programsNoContentMsgFun($scope.programs,'A',areaSelect);
    			$scope.createSuccessPrograms = "El programa se edito con Exito!";
    			$scope.loadProgramsForArea(areaSelect)    			
    		}

    		$scope.waitCreateProgram = false

        })
        .error(function(data)
        {
        	$scope.createSuccessPrograms = false
        	$scope.createMessagePrograms = [];
			for(var m in data) {
			   $scope.createMessagePrograms.push(data[m][0]);
			}
			
        	$scope.waitCreateProgram = false
        });             
        
	};

	//cargar el formulario de edicion de programa
	$scope.loadProgramForm = function(program){

		$scope.programFormAux = false;
		$scope.totalProgramsWeightEdit = $scope.totalProgramsWeight + program.weight; 
		$scope.programFormAux = program;
		angular.copy(program,$scope.programForm);
		ind = []
		$scope.programs.ir[program.count].forEach(function(indicador){
			ind.push(indicador.name)
		});
		$scope.programForm.tags = ind
		$scope.createMessagePrograms = false;
		$scope.createSuccessPrograms = false;		
		$scope.selectedTabPrograms = 1
		$scope.detectChangesProgram = false;

	}

	//cancela la edicion de dependencias
	$scope.cancelEditProgram = function(select){

		$scope.programsNoContentMsg = $scope.programsNoContentMsgFun($scope.programs,'A',select)
		$scope.programForm = {
			name: '',
			objective: '',
			weight: 0
		}
		$scope.selectedTabPrograms = 0;
		delete $scope.detectChangesProgram;
		$scope.createMessagePrograms = false;
		$scope.createSuccessPrograms = false;
	}

	
	//funcion que pregunta el password para eliminar una dependencia
	$scope.confirmDeleteProgram = function(program){

		$scope.waitConfirmDeleteProgram = program;
		$scope.popupTextProgram= 'Para eliminar por favor ingrese su password:';
		program.deletePassword = ''

	};

	//funcion que cancela la eliminacion de dependencia
	$scope.closeWaitDeleteProgram = function(program){
		$scope.reassignProjects = false
		$scope.waitConfirmDeleteProgram = false;
		program.deletePassword = ''

	};


	//funcion que envia la peticion para eliminar una dependencia 
	$scope.deleteProgram = function(program){

		$scope.waitDeleteProgram = true;
	    //peticion al servidor usando http
	    $http.post('deleteProgram', program)
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){
	    		program.deletePassword = ''
	    		$scope.popupTextProgram= data['error'];
			}else if(data['reassign']){
    			$scope.programsAux = [];
    			angular.copy($scope.programs.programs,$scope.programsAux); 
    			$scope.programsAux.splice($scope.programs.programs.indexOf(program), 1);
        		$scope.popupTextProgram = data['reassign']
        		$scope.reassignProjects= true;
			}else if(data['success']){
				$scope.reassignProjects= false;
				$scope.programs.programs.splice($scope.programs.programs.indexOf(program), 1);
			}
			
			console.log($scope.waitDeleteProgram);
			$scope.waitDeleteProgram = false;
			//$scope.countProgramsWeight();


	    })
	    .error(function(data)
	    {
	    	$location.reload();	    	
	    });             
        
	};   

	// *****************************************************************************
	// PROYECTOS
	// *****************************************************************************

	$scope.projectsNoContentMsg = 'Por favor seleccione un programa'
	$scope.selectedTabProjects = 0;

	$scope.projectForm = {

		name: '',
		description: '',
		weight: 0,
		dependencename:'',
		program:'',
		budget:'',
		year1:'',
		year2:'',
		year3:'',
		year4:'',
	}

	$http.get('viewPrograms').success(function(data)
    {
    	$scope.projectsPrograms = data;
	});

	$scope.projects = []

	$scope.countProjectsWeight = function(){

		$scope.totalProjectsWeight = 100;
		$scope.projects.forEach(function(project){
			$scope.totalProjectsWeight -= project.weight;
		});
 	}

	//funcion que carga los programas para crear un proyecto.
	$scope.projectsLoadPrograms = function(program){
		program = angular.element('#typeHeadProjects').val()
		if (program == '' || program == undefined || !program){

			return
		};
		$scope.waitLoadPrograms = true;
	    //peticion al servidor usando http
	  	$http.post('viewProgramForName', {'name': program})
	    .success(function(data)
	    {	
			console.log(data);
			$scope.waitLoadPrograms = false;
			/*return data.map(function(item){
		        return item;
	        });*/
	        $scope.projectsPrograms = data;	    	
			$scope.countProgramsWeight();


	    })
	    .error(function(data)
	    {
	    	//return data;
	    	$scope.waitLoadPrograms = false;
	    	$scope.projectsPrograms = $scope.projectsPrograms;
	    });             
        
	};

	//funcion que carga los programas de el area para editar un proyecto.
	$scope.projectsLoadProgramsForArea = function(search){
		search = angular.element('#typeHeadPrograms').val();
		program = $scope.projectsProgramSelected;
		$scope.detectChangesProject = true

		if (program == '' || program == undefined || !program || search == '' || search == undefined || !search){

			return
		};
	    //peticion al servidor usando http
	  	$http.post('viewProgramForNameInArea', {'area': program.area,'search': search})
	    .success(function(data)
	    {	
			/*return data.map(function(item){
		        return item;
	        });*/
	        $scope.projectsProgramsInArea = data;	    	
			$scope.countProgramsWeight();


	    })
	    .error(function(data)
	    {
	    	//return data;
	    	$scope.waitLoadPrograms = false;
	    	$scope.projectsPrograms = $scope.projectsPrograms;
	    });             
        
	};


	//funcion que muestra el mensaje en los formularios
	$scope.projectsNoContentMsgFun = function(data,select){

			$scope.countProjectsWeight();
			if (data.length <= 0) {
				return 'En: ' + select.name + ' No hay ningun proyecto creado'
			}else if ($scope.totalProjectsWeight == 0) {
				return 'Ya completo el 100% del programa: "' + select.name +'"'
			}else{

				return null
			};

			if (data == null) {
				return 'Por favor seleccione una línea';
			}else if (!$scope.programsLineSelected){
				return 'Por favor seleccione una área';

			};

 	}

	$scope.selectProject = function(programSelected) {
		$scope.projectLoadingPrograms = true;
		$scope.cancelEditProject(programSelected);
		$scope.projectsProgramSelected = programSelected;
       	$scope.totalProjectsWeight = 100;
 		
 		if (!programSelected){
 			$scope.projectsNoContentMsg = $scope.projectsNoContentMsgFun(null,programSelected);
 			$scope.projects = [];
 			return
 		};
 		//$scope.cancelEditProject();
 		$scope.waitLoadProjects = true;

		$http.post('viewProject', {'program': programSelected.id})
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){

				$location.reload();
			}else{
				$scope.projects= data
				$scope.projectsNoContentMsg = $scope.projectsNoContentMsgFun(data,programSelected);
				$http.post('viewProgramForNameInArea',{'area': programSelected.id,'search': ' '}).success(function(data)
			    {
			    	$scope.projectsProgramsInArea = data;
			    	console.log(data);
				});
			}

    		$scope.countProjectsWeight();
			$scope.waitLoadProjects = false;

	    })
	    .error(function(data)
	    {
	    	$state.go('home.config');

	    });	    
   	};

   	//cancela la edicion de un proyecto
	$scope.cancelEditProject = function(select){

		$scope.projectsNoContentMsg = $scope.projectsNoContentMsgFun($scope.projects,select)
		$scope.projectForm = {
			name: '',
			description: '',
			weight: 0,
			dependencename:'',
			program:'',
			budget:'',
			year1:'',
			year2:'',
			year3:'',
			year4:'',
		}
		$scope.selectedTabProjects = 0;
		delete $scope.detectChangesProject;
		$scope.createMessageProjects = false;
		$scope.createSuccessProjects = false;
	}

   	//cargar el formulario de edicion de proyecto
	$scope.loadProjectForm = function(project){
		$scope.projectFormAux = false;
		$scope.detectChangesProject = false;
		$scope.countProjectsWeight();
		$scope.totalProjectsWeightEdit = $scope.totalProjectsWeight + project.weight; 
		$scope.projectFormAux = project;
		angular.copy(project,$scope.projectForm);
		/*$scope.projectsProgramsInArea.forEach(function(item) {
		    if (item.id == $scope.projectsProgramSelected.id) {
		   		$scope.projectForm.programName = item.name
		    };
		});*/
		$scope.createMessageProjects = false;
		$scope.createSuccessProjects = false;		
		$scope.selectedTabProjects = 1

	} 


	//funcion que envia la peticion para edita una dependencia
	$scope.createProjects = function(programSelect){

		$scope.waitCreateProject = true;
		$scope.createMessageProjects = false;
		$scope.createSuccessProjects = false;
		$scope.projectForm.program = programSelect.id;
		console.log($scope.projectForm);
        
        //peticion al servidor usando http
        $http.post('createProject', $scope.projectForm)
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.createMessageProjects = [data['error']]
    		}else if(data['success']){
    			
    			$scope.createMessageProjects = false;
    			delete $scope.detectChangesProject;
    			$scope.projects.push(data['success']);
    			$scope.countProjectsWeight();
    			$scope.projectsNoContentMsg = $scope.projectsNoContentMsgFun($scope.projects,programSelect);
    			$scope.projectForm = {
					name: '',
					description: '',
					weight: 0,
					dependencename:'',
					program:'',
					budget:'',
					year1:'',
					year2:'',
					year3:'',
					year4:'',
				}
    			$scope.createSuccessProjects = "El Proyecto se edito con Exito!";    			
    		}

    		$scope.waitCreateProject = false

        })
        .error(function(data)
        {
        	$scope.createSuccessProjects = false
        	$scope.createMessageProjects = [];
			for(var m in data) {
			   $scope.createMessageProjects.push(data[m][0]);
			}
			
        	$scope.waitCreateProject = false
        });             
        
	}; 

	//funcion que envia la peticion para edita una dependencia
	$scope.editProjects = function(projectSelect){

		$scope.waitCreateProject = true;
		$scope.createMessageProjects = false;
		$scope.createSuccessProjects = false;
        
        //peticion al servidor usando http
        $http.post('editProject', $scope.projectForm)
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.createMessageProjects = [data['error']]
    		}else if(data['success']){
    			//si se edito el área de este Proyecto,lo elimino de la vista
    			console.log($scope.projectFormAux,$scope.projectForm);
    			if($scope.projectFormAux.program != $scope.projectForm.program){

    				$scope.cancelEditProject()
    				$scope.projects.splice($scope.projects.indexOf($scope.projectFormAux), 1);
    			};
    			$scope.createMessageProjects = false;
    			delete $scope.detectChangesProject;
    			angular.copy($scope.projectForm,$scope.projects[$scope.projects.indexOf($scope.projectFormAux)]);
    			$scope.countProjectsWeight();
    			$scope.projectsNoContentMsg = $scope.projectsNoContentMsgFun($scope.projects,projectSelect);
    			$scope.createSuccessProjects = "El Proyecto se edito con Exito!";    			
    		}

    		$scope.waitCreateProject = false

        })
        .error(function(data)
        {
        	$scope.createSuccessProjects = false
        	$scope.createMessageProjects = [];
			for(var m in data) {
			   $scope.createMessageProjects.push(data[m][0]);
			}
			
        	$scope.waitCreateProject = false
        });             
        
	};
	$scope.confirmDeleteProject = function(project){

		$scope.waitConfirmDeleteProject = project;
		$scope.popupTextProject= 'Para eliminar por favor ingrese su password:';
		project.deletePassword = ''
		$scope.reassignPrograms= false;

	};

	//funcion que cancela la eliminacion de dependencia
	$scope.closeWaitDeleteProject = function(project){

		$scope.waitConfirmDeleteProject = false;
		project.deletePassword = ''

	};


	//funcion que envia la peticion para eliminar una dependencia 
	$scope.deleteProject = function(project){

		$scope.waitDeleteProject = true;
	    //peticion al servidor usando http
	    $http.post('deleteProject', project)
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){
	    		project.deletePassword = ''
	    		$scope.popupTextProject= data['error'];
			}else if(data['reassign']){
    			$scope.projectsAux = [];
    			angular.copy($scope.projects,$scope.projectsAux); 
    			$scope.projectsAux.splice($scope.projects.indexOf(project), 1);
        		$scope.popupTextProject = data['reassign']
        		$scope.reassignProjects= true;
			}else if(data['success']){
				$scope.reassignProjects= false;
				$scope.projects.splice($scope.projects.indexOf(project), 1);
			}
			
			$scope.waitDeleteProject = false;
			$scope.countProjectsWeight();


	    })
	    .error(function(data)
	    {
	    	$location.reload();	    	
	    });             
        
	};

	// *****************************************************************************
	// Indicadores
	// *****************************************************************************
	$scope.indicatorsNoContentMsg = 'Por favor seleccione una línea'
	$scope.indicator = []
	$scope.indicatorsLoadAreasForLine = function(select){

			$scope.totalAreasWeight = 100;
			
			if (!select){
				$scope.indicatorsNoContentMsg = $scope.indicatorNoContentMsgFun(null,'L',select);
				$scope.indicator = [];
				return
			};
			
			if ($scope.programFormAux) {

				$scope.cancelEditProgram($scope.programFormAux);
			};
			$scope.waitLoadAreas = true;

		$http.post('viewAreas', {'line': select.id})
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){

				$location.reload();
			}else{
				$scope.programsAreas= data
				$scope.indicatorsNoContentMsg = $scope.indicatorNoContentMsgFun(data,'L',select);
			}

			$scope.countAreasWeight();
			$scope.waitLoadAreas = false;

	    })
	    .error(function(data)
	    {
	    	$state.go('home.config');

	    });
		}
	$scope.loadIndicatorForArea = function(select){

			$scope.totalIndicatorsWeight = 100;
			if (!select){
			$scope.indicatorsNoContentMsg = $scope.indicatorNoContentMsgFun([],'L',select);
				$scope.indicator = []
				return
			};

		$scope.waitLoadPrograms = true;
		$scope.cancelEditProgram(select);

		$http.post('viewResultIndicator', {'area': select.id})
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){

				$location.reload();
			}else{
				$scope.indicator= data
				$scope.indicatorsNoContentMsg = $scope.indicatorNoContentMsgFun(data,'A',select);
			}

			$scope.countIndicatorsWeight();
			$scope.waitLoadPrograms = false;

	    })
	    .error(function(data)
	    {
	    	$state.go('home.config');

	    });
		}
		$scope.indicatorNoContentMsgFun = function(data,name,select){
		if (name =='A') {

			$scope.countIndicatorsWeight();

			if (data.length <= 0) {
				return 'En: ' + select.name + ' No hay ningun indicador creado'
			}else if ($scope.totalIndicatorsWeight == 0) {
				return 'Ya completo el 100% del área: "' + select.name +'"'
			}else{

				return null
			};

		}else{
			if (data == null) {

				return 'Por favor seleccione una línea';
			}else if (!$scope.programsLineSelected){
				return 'Por favor seleccione un área';
				
			};

		};
				
		}
		$scope.indicatorForm = {

		name: '',
		goal: '',
		weight: 0
	}
		$scope.createIndicator = function(areaSelect){

		$scope.waitCreateProgram = true;
		$scope.createMessagePrograms = null;
		$scope.createSuccessPrograms = false;
		$scope.indicatorForm.area = areaSelect.id;

	    //peticion al servidor usando http
	    $http.post('createIndicator', $scope.indicatorForm)
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){
	    		$scope.createMessagePrograms = [data['error']]
			}else if(data['success']){
				$scope.createMessagePrograms = false;
				$scope.indicator.push(data['success']);
				$scope.indicatorsNoContentMsg = $scope.indicatorNoContentMsgFun($scope.indicator,'A',areaSelect);
				$scope.createSuccessPrograms = "El indicador se creo con Exito!";
				$scope.indicatorForm = {

					name: '',
					goal: '',
					weight: 0
				}
			}

			$scope.countIndicatorsWeight();
			$scope.waitCreateProgram = false

	    })
	    .error(function(data)
	    {
	    	$scope.createMessagePrograms = [];
			for(var m in data) {
			   $scope.createMessagePrograms.push(data[m][0]);
			}
			
	    	$scope.waitCreateProgram = false
	    });       
	};
	$scope.countIndicatorsWeight = function(){

		$scope.totalIndicatorsWeight = 100;
		$scope.indicator.forEach(function(program){
			$scope.totalIndicatorsWeight -= program.weight;
		});
	}
	$scope.loadIndicatorForm = function(program){

		$scope.programFormAux = false;
		$scope.totalIndicatorsWeightEdit = $scope.totalIndicatorsWeight + program.weight; 
		$scope.programFormAux = program;
		angular.copy(program,$scope.indicatorForm);
		$scope.createMessagePrograms = false;
		$scope.createSuccessPrograms = false;		
		$scope.selectedTabPrograms = 1
		$scope.detectChangesProgram = false;

	}
	$scope.cancelEditIndicator = function(select){

		$scope.indicatorsNoContentMsg = $scope.indicatorNoContentMsgFun($scope.indicator,'A',select)
		$scope.indicatorForm = {
			name: '',
			goal: '',
			weight: 0
		}
		$scope.selectedTabPrograms = 0;
		delete $scope.detectChangesProgram;
		$scope.createMessagePrograms = false;
		$scope.createSuccessPrograms = false;
	}
	$scope.editIndicator = function(areaSelect){

		$scope.waitCreateProgram = true;
		$scope.createMessagePrograms = false;
		$scope.createSuccessPrograms = false;
	    
	    //peticion al servidor usando http
	    $http.post('editIndicator', $scope.indicatorForm)
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){
	    		$scope.createMessagePrograms = [data['error']]
			}else if(data['success']){
				//si se edito el área de este programa,lo elimino de la vista
				if($scope.programFormAux.area != $scope.indicatorForm.area){

					$scope.cancelEditIndicator()
					$scope.indicator.splice($scope.indicator.indexOf($scope.programFormAux), 1);
				};
				$scope.createMessagePrograms = false;
				delete $scope.detectChangesProgram;
				angular.copy($scope.indicatorForm,$scope.indicator[$scope.indicator.indexOf($scope.programFormAux)]);
				$scope.countProgramsWeight();
				$scope.indicatorsNoContentMsg = $scope.indicatorNoContentMsgFun($scope.indicator,'A',areaSelect);
				$scope.createSuccessPrograms = "El indicador se edito con Exito!";    			
			}

			$scope.waitCreateProgram = false

	    })
	    .error(function(data)
	    {
	    	$scope.createSuccessPrograms = false
	    	$scope.createMessagePrograms = [];
			for(var m in data) {
			   $scope.createMessagePrograms.push(data[m][0]);
			}
			
	    	$scope.waitCreateProgram = false
	    });             
	    
	};
	$scope.confirmDeleteIndicator = function(program){

		$scope.waitConfirmDeleteProgram = program;
		$scope.popupTextProgram= 'Para eliminar por favor ingrese su password:';
		program.deletePassword = ''

	};
	//funcion que envia la peticion para eliminar una dependencia 
	$scope.deleteIndicator = function(program){

		$scope.waitDeleteProgram = true;
	    //peticion al servidor usando http
	    $http.post('deleteIndicator', program)
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){
	    		program.deletePassword = ''
	    		$scope.popupTextProgram= data['error'];
			}else if(data['reassign']){
				$scope.programsAux = [];
				angular.copy($scope.indicator,$scope.programsAux); 
				$scope.programsAux.splice($scope.indicator.indexOf(program), 1);
	    		$scope.popupTextProgram = data['reassign']
	    		$scope.reassignProjects= true;
			}else if(data['success']){
				$scope.reassignProjects= false;
				$scope.indicator.splice($scope.indicator.indexOf(program), 1);
			}
			
			$scope.waitDeleteProgram = false;
			$scope.countIndicatorsWeight();


	    })
	    .error(function(data)
	    {
	    	$location.reload();	    	
	    });             
	    
	}; 



	// *****************************************************************************
	// Indicadores de producto
	// *****************************************************************************
	$scope.productsNoContentMsg = 'Por favor seleccione un proyecto'
	$scope.selectedTabProducts = 0;

	$scope.productForm = {

		name: '',
		description: '',
		weight: 0,
		dependencename:'',
		program:'',
		budget:'',
		year1:'',
		year2:'',
		year3:'',
		year4:'',
	}

	$http.get('viewProjects').success(function(data)
    {
    	$scope.productsPrograms = data;
	});

	$scope.products = []

	$scope.countProductsWeight = function(){

		$scope.totalProductsWeight = 100;
		$scope.products.forEach(function(product){
			$scope.totalProductsWeight -= product.weight;
		});
 	}

	//funcion que carga los programas para crear un proyecto.
	$scope.productsLoadPrograms = function(program){
		program = angular.element('#typeHeadProducts').val()
		if (program == '' || program == undefined || !program){

			return
		};
		$scope.waitLoadPrograms = true;
	    //peticion al servidor usando http
	  	$http.post('viewProgramForName', {'name': program})
	    .success(function(data)
	    {	
			$scope.waitLoadPrograms = false;
			/*return data.map(function(item){
		        return item;
	        });*/
	        $scope.productsPrograms = data;	    	
			$scope.countProgramsWeight();


	    })
	    .error(function(data)
	    {
	    	//return data;
	    	$scope.waitLoadPrograms = false;
	    	$scope.productsPrograms = $scope.productsPrograms;
	    });             
        
	};

	//funcion que carga los programas de el area para editar un proyecto.
	$scope.productsLoadProgramsForArea = function(search){
		search = angular.element('#typeHeadPrograms').val();
		program = $scope.productsProgramSelected;
		$scope.detectChangesProduct = true

		if (program == '' || program == undefined || !program || search == '' || search == undefined || !search){

			return
		};
	    //peticion al servidor usando http
	  	$http.post('viewProgramForNameInArea', {'area': program.area,'search': search})
	    .success(function(data)
	    {	
			/*return data.map(function(item){
		        return item;
	        });*/
	        $scope.productsProgramsInArea = data;	    	
			$scope.countProgramsWeight();


	    })
	    .error(function(data)
	    {
	    	//return data;
	    	$scope.waitLoadPrograms = false;
	    	$scope.productsPrograms = $scope.productsPrograms;
	    });             
        
	};


	//funcion que muestra el mensaje en los formularios
	$scope.productsNoContentMsgFun = function(data,select){

			$scope.countProductsWeight();
			if (data.length <= 0) {
				return 'En: ' + select.name + ' No hay ningun proyecto indicador'
			}else if ($scope.totalProductsWeight == 0) {
				return 'Ya completo el 100% del proyecto: "' + select.name +'"'
			}else{

				return null
			};

			if (data == null) {
				return 'Por favor seleccione una línea';
			}else if (!$scope.programsLineSelected){
				return 'Por favor seleccione una área';

			};

 	}

	$scope.selectProduct = function(programSelected) {
		$scope.cancelEditProduct(programSelected);
		$scope.productsProgramSelected = programSelected;
       	$scope.totalProductsWeight = 100;
 		
 		if (!programSelected){
 			$scope.productsNoContentMsg = $scope.productsNoContentMsgFun(null,programSelected);
 			$scope.products = [];
 			return
 		};
 		//$scope.cancelEditProject();
 		$scope.waitLoadProducts = true;

		$http.post('viewProductIndicador', {'project': programSelected.id})
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){

				$location.reload();
			}else{
				$scope.products= data
				$scope.productsNoContentMsg = $scope.productsNoContentMsgFun(data,programSelected);
				// $http.post('viewProgramForNameInArea',{'area': programSelected.id,'search': ' '}).success(function(data)
			 //    {
			 //    	$scope.productsProgramsInArea = data;
			 //    	console.log(data);
				// });
			}

    		$scope.countProductsWeight();
			$scope.waitLoadProducts = false;

	    })
	    .error(function(data)
	    {
	    	$state.go('home.config');

	    });	    
   	};

   	//cancela la edicion de un proyecto
	$scope.cancelEditProduct = function(select){

		$scope.productsNoContentMsg = $scope.productsNoContentMsgFun($scope.products,select)
		$scope.productForm = {
			name: '',
			goal: '',
			weight: 0,
		}
		$scope.selectedTabProducts = 0;
		delete $scope.detectChangesProduct;
		$scope.createMessageProducts = false;
		$scope.createSuccessProducts = false;
	}

   	//cargar el formulario de edicion de proyecto
	$scope.loadProductForm = function(product){
		console.log(product)
		$scope.productFormAux = false;
		$scope.detectChangesProduct = false;
		$scope.countProductsWeight();
		$scope.totalProductsWeightEdit = $scope.totalProductsWeight + product.weight; 
		$scope.productFormAux = product;
		angular.copy(product,$scope.productForm);
		/*$scope.productsProgramsInArea.forEach(function(item) {
		    if (item.id == $scope.productsProgramSelected.id) {
		   		$scope.productForm.programName = item.name
		    };
		});*/
		$scope.createMessageProducts = false;
		$scope.createSuccessProducts = false;		
		$scope.selectedTabProducts = 1

	} 


	//funcion que envia la peticion para edita una dependencia
	$scope.createProducts = function(programSelect){

		$scope.waitCreateProduct = true;
		$scope.createMessageProducts = false;
		$scope.createSuccessProducts = false;
		$scope.productForm.project = programSelect.id;
		console.log($scope.productForm);
        
        //peticion al servidor usando http
        $http.post('createIndicatorProduct', $scope.productForm)
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.createMessageProducts = [data['error']]
    		}else if(data['success']){
    			
    			$scope.createMessageProducts = false;
    			delete $scope.detectChangesProduct;
    			$scope.products.push(data['success']);
    			$scope.countProductsWeight();
    			$scope.productsNoContentMsg = $scope.productsNoContentMsgFun($scope.products,programSelect);
    			$scope.productForm = {
					name: '',
					goal: '',
					weight: 0,
				}
    			$scope.createSuccessProducts = "El Indicador se creo con Exito!";    			
    		}

    		$scope.waitCreateProduct = false

        })
        .error(function(data)
        {
        	$scope.createSuccessProducts = false
        	$scope.createMessageProducts = [];
			for(var m in data) {
			   $scope.createMessageProducts.push(data[m][0]);
			}
			
        	$scope.waitCreateProduct = false
        });             
        
	}; 

	//funcion que envia la peticion para edita una dependencia
	$scope.editProducts = function(productSelect){

		$scope.waitCreateProduct = true;
		$scope.createMessageProducts = false;
		$scope.createSuccessProducts = false;
        
        //peticion al servidor usando http
        $http.post('editIndicatorProduct', $scope.productForm)
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.createMessageProducts = [data['error']]
    		}else if(data['success']){
    			//si se edito el área de este Proyecto,lo elimino de la vista
    			console.log($scope.productFormAux,$scope.productForm);
    			if($scope.productFormAux.program != $scope.productForm.program){

    				$scope.cancelEditProduct()
    				$scope.products.splice($scope.products.indexOf($scope.productFormAux), 1);
    			};
    			$scope.createMessageProducts = false;
    			delete $scope.detectChangesProduct;
    			angular.copy($scope.productForm,$scope.products[$scope.products.indexOf($scope.productFormAux)]);
    			$scope.countProductsWeight();
    			$scope.productsNoContentMsg = $scope.productsNoContentMsgFun($scope.products,productSelect);
    			$scope.createSuccessProducts = "El Proyecto se edito con Exito!";    			
    		}

    		$scope.waitCreateProduct = false

        })
        .error(function(data)
        {
        	$scope.createSuccessProducts = false
        	$scope.createMessageProducts = [];
			for(var m in data) {
			   $scope.createMessageProducts.push(data[m][0]);
			}
			
        	$scope.waitCreateProduct = false
        });             
        
	};
	$scope.confirmDeleteProduct = function(product){

		$scope.waitConfirmDeleteProduct = product;
		$scope.popupTextProduct= 'Para eliminar por favor ingrese su password:';
		product.deletePassword = ''

	};

	//funcion que cancela la eliminacion de dependencia
	$scope.closeWaitDeleteProduct = function(product){
		$scope.reassignProjects = false
		$scope.waitConfirmDeleteProduct = false;
		product.deletePassword = ''

	};


	//funcion que envia la peticion para eliminar una dependencia 
	$scope.deleteProduct = function(product){

		$scope.waitDeleteProduct = true;
	    //peticion al servidor usando http
	    $http.post('deleteIndicatorProduct', product)
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){
	    		product.deletePassword = ''
	    		$scope.popupTextproduct= data['error'];
			}else if(data['reassign']){
    			$scope.productsAux = [];
    			angular.copy($scope.products,$scope.productsAux); 
    			$scope.productsAux.splice($scope.products.indexOf(product), 1);
        		$scope.popupTextProduct = data['reassign']
        		$scope.reassignProjects= true;
			}else if(data['success']){
				$scope.reassignProjects= false;
				$scope.products.splice($scope.products.indexOf(product), 1);
			}
			
			$scope.waitDeleteProduct = false;
			$scope.countProductsWeight();
			console.log($scope.totalProductsWeight)


	    })
	    .error(function(data)
	    {
	    	$location.reload();	    	
	    });             
        
	};

	
})




.controller('ModalDPlanImgCtrl',function($scope, $modalInstance,devplan,$http,$rootScope){

	$scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	};
	$scope.myImage='';
	$scope.imageCropResult= '';
	$scope.imgFrame = 'rectangle';

	//funcion que carga la imagen en el formulario de creación
	$scope.loadAvatar = function(){
		devplan.image = $scope.imageCropResult;
	    //peticion al servidor para cargar la informacion de perfil del usuario logueado
	    $http.post('editImgDevPlan',devplan)
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){
	    		$scope.errorMessage = ["No se pudo completar la operación"]
			}else{
				$modalInstance.close(devplan);
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
})

.controller('ModalDeleteCtrl',function($scope, $modalInstance,devplan,$http,$rootScope){

	$scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	};
	$scope.myImage='';
	$scope.imageCropResult= '';
	//funcion que carga la imagen en el formulario de creación
	$scope.loadAvatar = function(){
		devplan.image = $scope.imageCropResult;
	    //peticion al servidor para cargar la informacion de perfil del usuario logueado
	    $http.post('editImgDevPlan',devplan)
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){
	    		$scope.errorMessage = ["No se pudo completar la operación"]
			}else{
				$modalInstance.close(devplan);
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
})


;angular.module("Gedeon")
.controller('ProjectsCtrl',function($scope,$rootScope,$http,$location,$state,fileUpload,$modal){

	$rootScope.actualMenu = 'projects';

	//funcion para acceder a un valor desde la vista cuando el 2waydatabinding falla
    $rootScope.viewDataBind = function(data){

		return eval('$scope.'+ data);
		//return 10;

	}

	//funcion para acceder a un valor desde la vista cuando el 2waydatabinding falla
    $rootScope.changeDataBind = function(data,val){

			$scope.$eval(data +' = ' + val);

    	console.log(eval('$scope.'+ data));

	}

	// *****************************************************************************
	// PROYECTOS
	// *****************************************************************************

	$scope.projectsNoContentMsg = ' No tiene ningun proyecto asignado'
	$scope.waitLoadPermissions = true;

	$scope.projectForm = {

		name: '',
		description: '',
		weight: 0,
		dependencename:'',
		program:'',
		budget:'',
		year1:'',
		year2:'',
		year3:'',
		year4:'',
	}

	$rootScope.$on('$viewContentLoaded',function(event){ 
		$rootScope.rootCheckUrl('loginCheck');
		$scope.waitLoadPermissions = false;
    });

	$scope.userProjects = []

	
	//funcion que carga los programas para crear un proyecto.
	$scope.loadProjectsUser = function(){
		
		$scope.waitLoadProjects = true;
	    //peticion al servidor usando http
	  	$http.get('loadProjectsUser', {})
	    .success(function(data)
	    {	
			console.log(data);
			$scope.waitLoadProjects = false;
	        $scope.userProjects = data;	    	
			$scope.countProgramsWeight();

			if (actualUser.role==3 || actualUser.role==4) {

				$scope.projectsNoContentMsg = ' No tiene ningun proyecto asignado'

			}else{

				$scope.projectsNoContentMsg = ' No hay ningun proyecto creado'
			};


	    })
	    .error(function(data)
	    {
	    	//return data;
	    	$scope.waitLoadProjects = false;
	    	$scope.projectsPrograms = $scope.projectsPrograms;
	    });             
        
	};

	
	//funcion que carga los projectos y las dependencias para filtrar.
	$scope.loadProjectsDependece = function(){
		$scope.waitLoadAllProjects = true;

	    //peticion al servidor usando http
	  	$http.get('viewProjectsDetails', {})
	    .success(function(data)
	    {	
			
	        $scope.allProjects = data;	    	
	        $scope.waitLoadAllProjects = false;
	        console.log(data);
	    })
	    .error(function(data)
	    {
	    	$scope.waitLoadAllProjects = false;
	    	$scope.projectsPrograms = $scope.projectsPrograms;
	    }); 

	    //peticion al servidor usando http
	  	$http.get('viewDependences', {})
	    .success(function(data)
	    {	
			
	        $scope.dependences = data;	    	
	        $scope.waitLoadAllProjects = false;
	    })
	    .error(function(data)
	    {
	    	$scope.waitLoadAllProjects = false;
	    	$scope.projectsPrograms = $scope.projectsPrograms;
	    });                    
        
	};


	//funcion que muestra el mensaje en los formularios
	$scope.projectsNoContentMsgFun = function(data,select){

			$scope.countProjectsWeight();
			if (data.length <= 0) {
				return 'En: ' + select.name + ' No hay ningun proyecto creado'
			}else if ($scope.totalProjectsWeight == 0) {
				return 'Ya completo el 100% del programa: "' + select.name +'"'
			}else{

				return null
			};

			if (data == null) {
				return 'Por favor seleccione una línea';
			}else if (!$scope.programsLineSelected){
				return 'Por favor seleccione una área';

			};

 	}

	$scope.selectProject = function(programSelected) {
		$scope.cancelEditProject(programSelected);
		$scope.projectsProgramSelected = programSelected;
       	$scope.totalProjectsWeight = 100;
 		
 		if (!programSelected){
 			$scope.projectsNoContentMsg = $scope.projectsNoContentMsgFun(null,programSelected);
 			$scope.projects = [];
 			return
 		};
 		//$scope.cancelEditProject();
 		$scope.waitLoadProjects = true;

		$http.post('viewProject', {'program': programSelected.id})
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){

				$location.reload();
			}else{
				$scope.projects= data
				$scope.projectsNoContentMsg = $scope.projectsNoContentMsgFun(data,programSelected);
				$http.post('viewProgramForNameInArea',{'area': programSelected.id,'search': ' '}).success(function(data)
			    {
			    	$scope.projectsProgramsInArea = data;
			    	console.log(data);
				});
			}

    		$scope.countProjectsWeight();
			$scope.waitLoadProjects = false;

	    })
	    .error(function(data)
	    {
	    	$state.go('home.config');

	    });	    
   	};

   	//cancela la edicion de un proyecto
	$scope.cancelEditProject = function(select){

		$scope.projectsNoContentMsg = $scope.projectsNoContentMsgFun($scope.projects,select)
		$scope.projectForm = {
			name: '',
			description: '',
			weight: 0,
			dependencename:'',
			program:'',
			budget:'',
			year1:'',
			year2:'',
			year3:'',
			year4:'',
		}
		$scope.selectedTabProjects = 0;
		delete $scope.detectChangesProject;
		$scope.createMessageProjects = false;
		$scope.createSuccessProjects = false;
	}

   	//cargar el formulario de edicion de proyecto
	$scope.loadProjectForm = function(project){
		$scope.projectFormAux = false;
		$scope.detectChangesProject = false;
		$scope.countProjectsWeight();
		$scope.totalProjectsWeightEdit = $scope.totalProjectsWeight + project.weight; 
		$scope.projectFormAux = project;
		angular.copy(project,$scope.projectForm);
		/*$scope.projectsProgramsInArea.forEach(function(item) {
		    if (item.id == $scope.projectsProgramSelected.id) {
		   		$scope.projectForm.programName = item.name
		    };
		});*/
		$scope.createMessageProjects = false;
		$scope.createSuccessProjects = false;		
		$scope.selectedTabProjects = 1

	} 


	//funcion que envia la peticion para edita una dependencia
	$scope.createProjects = function(programSelect){

		$scope.waitCreateProject = true;
		$scope.createMessageProjects = false;
		$scope.createSuccessProjects = false;
		$scope.projectForm.program = programSelect.id;
		console.log($scope.projectForm);
        
        //peticion al servidor usando http
        $http.post('createProject', $scope.projectForm)
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.createMessageProjects = [data['error']]
    		}else if(data['success']){
    			
    			$scope.createMessageProjects = false;
    			delete $scope.detectChangesProject;
    			$scope.projects.push(data['success']);
    			$scope.countProjectsWeight();
    			$scope.projectsNoContentMsg = $scope.projectsNoContentMsgFun($scope.projects,programSelect);
    			$scope.projectForm = {
					name: '',
					description: '',
					weight: 0,
					dependencename:'',
					program:'',
					budget:'',
					year1:'',
					year2:'',
					year3:'',
					year4:'',
				}
    			$scope.createSuccessProjects = "El Proyecto se edito con Exito!";    			
    		}

    		$scope.waitCreateProject = false

        })
        .error(function(data)
        {
        	$scope.createSuccessProjects = false
        	$scope.createMessageProjects = [];
			for(var m in data) {
			   $scope.createMessageProjects.push(data[m][0]);
			}
			
        	$scope.waitCreateProject = false
        });             
        
	}; 

	//funcion que envia la peticion para edita una dependencia
	$scope.editProjects = function(projectSelect){

		$scope.waitCreateProject = true;
		$scope.createMessageProjects = false;
		$scope.createSuccessProjects = false;
        
        //peticion al servidor usando http
        $http.post('editProject', $scope.projectForm)
        .success(function(data)
        {	
        	
        	if(data['error']){
        		$scope.createMessageProjects = [data['error']]
    		}else if(data['success']){
    			//si se edito el área de este Proyecto,lo elimino de la vista
    			console.log($scope.projectFormAux,$scope.projectForm);
    			if($scope.projectFormAux.program != $scope.projectForm.program){

    				$scope.cancelEditProject()
    				$scope.projects.splice($scope.projects.indexOf($scope.projectFormAux), 1);
    			};
    			$scope.createMessageProjects = false;
    			delete $scope.detectChangesProject;
    			angular.copy($scope.projectForm,$scope.projects[$scope.projects.indexOf($scope.projectFormAux)]);
    			$scope.countProjectsWeight();
    			$scope.projectsNoContentMsg = $scope.projectsNoContentMsgFun($scope.projects,projectSelect);
    			$scope.createSuccessProjects = "El Proyecto se edito con Exito!";    			
    		}

    		$scope.waitCreateProject = false

        })
        .error(function(data)
        {
        	$scope.createSuccessProjects = false
        	$scope.createMessageProjects = [];
			for(var m in data) {
			   $scope.createMessageProjects.push(data[m][0]);
			}
			
        	$scope.waitCreateProject = false
        });             
        
	};
})




.controller('ModalDPlanImgCtrl',function($scope, $modalInstance,devplan,$http,$rootScope){

	$scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	};
	$scope.myImage='';
	$scope.imageCropResult= '';
	$scope.imgFrame = 'rectangle';

	//funcion que carga la imagen en el formulario de creación
	$scope.loadAvatar = function(){
		devplan.image = $scope.imageCropResult;
	    //peticion al servidor para cargar la informacion de perfil del usuario logueado
	    $http.post('editImgDevPlan',devplan)
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){
	    		$scope.errorMessage = ["No se pudo completar la operación"]
			}else{
				$modalInstance.close(devplan);
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
})

.controller('ModalDeleteCtrl',function($scope, $modalInstance,devplan,$http,$rootScope){

	$scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	};
	$scope.myImage='';
	$scope.imageCropResult= '';
	//funcion que carga la imagen en el formulario de creación
	$scope.loadAvatar = function(){
		devplan.image = $scope.imageCropResult;
	    //peticion al servidor para cargar la informacion de perfil del usuario logueado
	    $http.post('editImgDevPlan',devplan)
	    .success(function(data)
	    {	
	    	
	    	if(data['error']){
	    		$scope.errorMessage = ["No se pudo completar la operación"]
			}else{
				$modalInstance.close(devplan);
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
})

Gedeon.filter('noFractionCurrency',
    [ '$filter', '$locale', function(filter, locale) {
      var currencyFilter = filter('currency');
      var formats = locale.NUMBER_FORMATS;
      return function(amount, currencySymbol) {
        var value = currencyFilter(amount, currencySymbol);
        var sep = value.indexOf(formats.DECIMAL_SEP);
        if(amount >= 0) { 
          return value.substring(0, sep);
        }
        return value.substring(0, sep) + ')';
      };
    } ]);

Gedeon.filter('loadProjectsfilter', function() {
  	return function(items, search) {
	    if (!search) {
	      return items;
	    }
	    console.log(items, search);
	    if (!search || '' === search) {
	      return items;
	    }

	    return items.filter(function(element, index, array) {
	      return element.dependence === search;
	    });

  	};
});



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

;angular.module("Gedeon")
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

;angular.module("Gedeon")
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

;
Gedeon.directive('xngFocus', function ($timeout) {
    return {
        link: function(scope, element, attrs) {
            scope.$watch(attrs.xngFocus, function(newValue){
                if ( newValue ) {
                    $timeout(function(){
                        element.focus();
                    });
                }
            });
        }
     };
});

Gedeon.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);

/*Gedeon.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);*/


Gedeon.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file){
        var fd = new FormData();
        fd.append('file', file);
        /*$http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
        })
        .error(function(){
        });*/

        return(fd)
    }
}]);

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


;angular.module("Gedeon")
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

;
//# sourceMappingURL=app.js.map