define(['Element'], function($element) {


	describe('$element', function() {
		
		var element;

		it('should initiate $element', function() {
			element = new $element();
			expect(element).toBeDefined();
		});

		it('should check if a value is undefined', function(){
			var obj = null,
				obj1 = {},
				obj2 = undefined;

			expect(element.isUndefined(obj2)).toBe(true);
		});

		it('should check if variable is an object', function() {
			var obj = {},
				obj2 = [];

			expect( element.isObject(obj) ).toBe(true);
			expect( element.isObject(obj2) ).toBe(true);
		});

		it('should check if variable is an array', function() {
			var obj = [1,2,3],
				obj2 = 'value',
				obj3 = {};

			expect( element.isArray(obj) ).toBe(true);
			expect( element.isArray(obj2) ).toBe(false);
			expect( element.isArray(obj3) ).toBe(false);
		});

		it('should check if variable is string', function() {
			var str = 'value',
				num = 1;

			expect( element.isString(str) ).toBe(true);
			expect( element.isString(num) ).toBe(false);
		});

		it('should check if variable is a number', function() {
			var num = 1;

			expect( element.isNumber(num) ).toBe(true);	
		});

		it('should check if variable is a boolean', function() {
			var bool = true;

			expect( element.isBoolean(bool) ).toBe(true);
		});

		it('should contain a value in an array', function() {
			var value = 'test',
				arr = ['test', 'bar', 'foo'];

			expect( element.contains(arr, value) ).toBeGreaterThan(-1);
		});

		it('should check if a value is empty', function() {
			var obj = null,
				obj2 = undefined,
				obj3 = [],
				obj4 = {},
				obj5 = [1,2,3];

			expect( element.isEmpty(obj) ).toBe(true);
			expect( element.isEmpty(obj2) ).toBe(true);
			expect( element.isEmpty(obj3) ).toBe(true);
			expect( element.isEmpty(obj4) ).toBe(true);

			expect( element.isEmpty(obj5) ).toBe(false);
		});

		it('should check if a value is defined', function() {
			var obj = ['test'];
			expect( element.isDefined(obj) ).toBe(true);
		});

		describe('size', function() {

			it('should return the number of items in an array', function() {
				expect(element.size([])).toBe(0);
				expect(element.size(['a', 'b', 'c'])).toBe(3);
			});

			it('should return the number of properties of an object', function() {
				expect(element.size({})).toBe(0);
				expect(element.size({a:1, b:'a'})).toBe(2);
			});

			it('should return the string length', function() {
				expect(element.size('')).toBe(0);
				expect(element.size('abc')).toBe(3);
			});

			it('should not rely on length property of an object to determine its size', function() {
				expect(element.size({length:99})).toBe(1);
			});
		});

		describe('forEach', function() {

			it('should iterate over "own" object properties', function() {
				function myObject() {
					this.foo = 'fooValue';
					this.bar = 'barValue'
				}
				myObject.prototype.test = 'testValue';

				var obj = new myObject(),
					log = [];

				element.forEach(obj, function(value, key) {
					log.push(key + ':' + value);
				});
				expect(log).toEqual(['foo:fooValue','bar:barValue']);
			});

			it('should handle arguments objects like arrays', function() {
				var args,
				log = [];

				(function(){ args = arguments}('a', 'b', 'c'));

				element.forEach(args, function(value, key) { 
					log.push(key + ':' + value);
				});

				expect(log).toEqual(['0:a', '1:b', '2:c']);
			});

			it('should handle objects with length property as objects', function() {
				var obj = {
					'foo' : 'bar',
					'length': 2
				},
				log = [];

				element.forEach(obj, function(value, key) { 
					log.push(key + ':' + value);
				});
				
				expect(log).toEqual(['foo:bar', 'length:2']);
			});
		});

		it('should not break if obj is an array we override hasOwnProperty', function() {
			var obj = [];
			obj[0] = 1;
			obj[1] = 2;
			obj.hasOwnProperty = null;
			var log = [];

			element.forEach(obj, function(value, key) {
				log.push(key + ':' + value);
			});
			expect(log).toEqual(['0:1', '1:2']);
		});
	});

});