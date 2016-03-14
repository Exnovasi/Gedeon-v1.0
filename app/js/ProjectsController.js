angular.module("Gedeon")
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


