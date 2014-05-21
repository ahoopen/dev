define(['car', 'jquery'], function(Auto, $) {

    describe('Auto', function() {

        var mycar;

        it('init car classe', function() {
            
            mycar = new Auto({
                name : "Vitz",
                engineSize : 1000
            });
        });

        it('Moet 4 wielen hebben.', function() {
            expect(mycar.getWheels()).toBe(4);
        });

        it('Moet een engine van 1000pk hebben.', function() {
            expect(mycar.getEngineSize()).toBe(1000);
        });

        it('Moet een blauwe kleur hebben.', function() {
            expect(mycar.getColour()).toBe('blauw23');
        });

        it('Kan de pagina aanroepen', function() {
            
        });

    });

});