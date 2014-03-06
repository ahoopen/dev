define( ["Element", "Error"], function($element, $error) {
	
	var getFuncArgs = function(fn) {
		var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
		var args = fn.toString().match(FN_ARGS)[1].split(',');
		return args;
	};

	/**
	*
	* @name $module.annotate
	* @function
	* @param {Object} obj Object om te kijken
	* @returns {int} de positie van de gevonden object in de array 
	**/
	var annotate = function(fn) {
		var $inject,
			args,
			last;

		if ( $element.isFunction(fn) ) {
			if (!($inject = fn.$inject)) {
				$inject = [];
				if (fn.length) {
					args = getFuncArgs(fn);
					$element.forEach( args, function(name) {
						$inject.push( name );
					});
				}
				fn.$inject = $inject;
			}
		} else if ( $element.isArray(fn) ) {
			// er is gebruik gemaakt van een constructor array
			last = fn.length - 1;
			$inject = fn.slice(0, last);
		} else {
			//
		}

		return $inject;
	};

	/**
	*
	* @name $module.annotate
	* @function
	* @param {Object} obj Object om te kijken
	* @returns {int} de positie van de gevonden object in de array 
	**/
	var invoke = function(fn, self) {
		var args = [],
			$inject = annotate(fn),
			length, i,
			key;

		for( i = 0, length = $inject.length; i < length; i++) {
			key = $inject[i];
			if ( !$element.isString(key) ) {
				throw new Error("Incorrect injection token! Expected service name as string");
			}

			args.push( 
				key
			);
		}

		if (!fn.$inject) {
			fn = fn[length];
		}

		return fn.apply(self, args);
	};

	/**
	*
	* @name $module.annotate
	* @function
	* @param {Object} obj Object om te kijken
	* @returns {int} de positie van de gevonden object in de array 
	**/
	var loadModules = function(modules) {
		
		try {
			$element.forEach(modules, function(module) {
				invoke(module);
			});
		} catch (e) {
			if ($element.isArray(module)) {
				module = module[module.length - 1];
			}
			if( e.message && e.stack && e.stack.indexOf(e.message) === -1 ) {
				// Safari & FF's stack traces bevatten geen error.message inhoud
				// In tegenstelling tot Chrome en IE
				// Dus als de stack geen boodschap bevat, maken we een nieuwe string die beide bevat.
				// Sinds error.stack alleen-lezen is in Safari. Wordt e overrided ipv e.stack				
				e = e.message + '\n' + e.stack;
			}

			throw $error.minErr('module', "Fout bij het initiëren van de module {0} wegens:\n{1}",
				module, e.stack || e.message || e);	
		}
	};

	/**
	*
	* @name $module.bootstrap
	* @function
	**/
	var bootstrap = function(modules) {
		modules = modules || [];
	};

	var Login = function($session, authenticator) {

	};

	/**
	app.module( 'test', function() {

		var Login = function($entity, $authenticator) {

		};

		return {
			login : [ "$entity", "$authenticator", Login]
		};
	});
	**/
});