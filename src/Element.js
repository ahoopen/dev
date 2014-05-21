define(function() {

	var $element = function() {

	};

	$element.prototype = {

		/**
		* Geeft aan of een referencie undefined is
		*
		* @name $element.isUndefined
		* @function
		* @param {*} value Referencie om te checken
		* @returns {boolean} true wanneer 'value' undefined is
		**/
		isUndefined : function(value) {
			return typeof value === 'undefined';
		},

		/**
		* Geeft aan of een referencie defined is
		*
		* @name $element.isDefined
		* @function
		* @param {*} value Referencie om te checken
		* @returns {boolean} true wanneer 'value' defined is
		**/
		isDefined : function(value) {
			return typeof value !== 'undefined';
		},

		/**
		* Geeft aan of een referencie een object is
		*
		* @name $element.isObject
		* @function
		* @param {*} value Referencie om te checken
		* @returns {boolean} true wanneer 'value' een object is
		**/
		isObject : function(value) {
			return value != null && typeof value === 'object';
		},

		/**
		* Geeft aan of een referencie een string is
		*
		* @name $element.isString
		* @function
		* @param {*} value Referencie om te checken
		* @returns {boolean} true wanneer 'value' een string is
		**/
		isString : function(value) {
			return typeof value === 'string';
		},

		/**
		* Geeft aan of een referencie een number is
		*
		* @name $element.isNumber
		* @function
		* @param {*} value Referencie om te checken
		* @returns {boolean} true wanneer 'value' een number is
		**/
		isNumber : function(value) {
			return typeof value === 'number';
		},

		/**
		* Geeft aan of een referencie een array is
		*
		* @name $element.isArray
		* @function
		* @param {*} value Referencie om te checken
		* @returns {boolean} true wanneer 'value' een array is
		**/
		isArray : function(value) {
			return Object.prototype.toString.call(value) === '[object Array]';
		},

		/**
		* Geeft aan of een referencie een functie is
		*
		* @name $element.isFunction
		* @function
		* @param {*} value Referencie om te checken
		* @returns {boolean} true wanneer 'value' een functie is
		**/
		isFunction : function(value) {
			return typeof value === 'function';
		},

		/**
		* Geeft aan of een referencie een boolean is
		*
		* @name $element.isBoolean
		* @function
		* @param {*} value Referencie om te checken
		* @returns {boolean} true wanneer 'value' een boolean is
		**/
		isBoolean : function(value) {
			return typeof value === 'boolean';
		},

		/**
		* Bepaalt het aantal elementen in een array, het aantal properties van een object of
		* de lengte van de string.
		*
		* @name $element.size
		* @function
		* @param {Object|Array|string} obj Object, array, of string om te doorzoeken.
		* @returns {number} de grootte van het 'obj'
		**/
		size : function(obj, ownPropsOnly) {
			var count = 0, key;

			if ( this.isArray(obj) || this.isString(obj)) {
				return obj.length;
			} else if (this.isObject(obj)) {
				for (key in obj) {
					if (!ownPropsOnly || obj.hasOwnProperty(key)) {
						count++;
					}
				}
			}

			return count;
		},

		/**
		* Geeft aan of het object leeg is.
		*
		* @name $element.isEmpty
		* @function
		* @param {Object} obj Object om te kijken
		* @returns {boolean} true als object leeg is
		**/
		isEmpty : function(obj) {
			var has = Object.prototype.hasOwnProperty;

			// null en undefined zijn "empty"
			if(obj == null) {
				return true;
			}

			if(obj.length && obj.length > 0) {
				return false;
			}
			if(obj.length === 0) {
				return true;
			}

			for( var key in obj) {
				if( has.call(obj, key)) {
					return false;
				}
			}

			return true;
		},

		/**
		* Geeft aan of het object in de array zit
		*
		* @name $element.contains
		* @function
		* @param {Object} obj Object om te kijken
		* @returns {int} de positie van de gevonden object in de array 
		**/
		contains : function(array, obj) {
			return this.indexOf(array, obj);
		},

		indexOf : function(array, obj) {
			if( array.indexOf ) {
				return array.indexOf(obj);
			}

			for (var i = 0; i < array.length; i++) {
				if (obj === array[i]) {
					return i;
				}
			}
			return -1;
		},

		isArrayLike : function( obj ) {
			if (!obj || (typeof obj.length !== 'number')) {
				return false;
			}

			// We have on object which has length property. Should we treat it as array?
			if (typeof obj.hasOwnProperty !== 'function' &&
				typeof obj.constructor !== 'function') {
				// This is here for IE8: it is a bogus object treat it as array;
				return true;
			} else {
				return (jQuery && obj instanceof jQuery) || // jQuery
					typeof obj.callee === 'function'; // arguments (on IE8 looks like regular obj)
			}
		},

		/**
		* Roept de iterator functie aan voor elke element in 'obj'. De iterator functie word aangeroepen als 'iterator( value, key )'
		* waar value de waarde is van object propertie of een element van een array en de 'key' is de object key of array index. Een context defineren
		* is optioneel.
		*
		* @name $element.forEach
		* @function
		* @param {Object|Array} obj Object to iterate over.
		* @param {Function} iterator Iterator function.
		* @param {Object} context Object to become context (`this`) for the iterator function.
		* @returns {number} de grootte van het 'obj'
		**/
		forEach : function( obj, iterator, context ) {
			var key;

			if ( obj ) {
				if ( this.isFunction( obj) ) {
					for( key in obj ) {
						if ( key !== 'prototype' && key !== 'length' && key !== 'name' && obj.hasOwnProperty(key) ) {
							iterator.call(context, obj[key], key);
						}
					}
				} else if ( obj.forEach && obj.forEach !== this.forEach ) {
					obj.forEach(iterator, context);
				} else if ( this.isArrayLike( obj ) ) {
					for( key = 0; key < obj.length; key++ ) {
						iterator.call(context, obj[key], key);
					}
				} else {
					for ( key in obj ) {
						if (obj.hasOwnProperty(key) ) {
							iterator.call(context, obj[key], key);
						}
					}
				}
			}

			return obj;
		}
	};

	return $element;
});