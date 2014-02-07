define(["Application"], function(app) {

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
		}
	};

});