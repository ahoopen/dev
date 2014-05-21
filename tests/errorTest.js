define(['Error'], function(error) {

	describe('Error', function() { 

		var testError = error.minErr('test');

		it('should return an Error factory', function() {
			var myError = testError('test', 'Oops');
			expect(myError instanceof Error).toBe(true);
		});
	});
});