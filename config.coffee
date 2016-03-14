exports.config =
	# See http://brunch.readthedocs.org/en/latest/config.html for documentation.
	modules:
		wrapper: false
		definition: false

	files:
		javascripts:
			joinTo:
				'js/app.js': /^app/
				'js/vendor.js': /^vendor/
			order:
				before: [
					# vendor
					'vendor/jquery-2.1.3.min.js',
					'vendor/angular.min.js',
					'vendor/angular-route.min.js',
					'vendor/angular-animate.min.js',
					'vendor/bootstrap.min.js',
					'vendor/ng-img-crop.js'
					# app
					'app/js/main.js',
					'app/js/controllers.js'
				] 

		stylesheets:
			joinTo:
				'css/app.css': /^(app|vendor)/
			order:
				before: [
				]
				after: []

		templates:
			joinTo: 'scripts/app.js'

			

		  

	plugins:
		autoReload:
			enabled:
				css: on
				js: on
				assets: on
		uglify:
			mangle: false
			compress:
				global_defs: 
					DEBUG: false