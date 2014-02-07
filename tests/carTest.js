var should = require('should');
var car = require("../src/car.js");
var assert = require("assert")

var mycar = new car({
    name : "Vitz",
    engineSize : 1000
});


describe('#Car()', function() {
    it('Car enginesize method test', function() {
        mycar.getEngineSize().should.equal(1000);

    })
})

describe('#Car()', function() {
	it('should have wheels', function() {
		mycar.getWheels().should.equal(4);
	})
})

describe('#Car()', function() {
    it('Car name test', function() {
        mycar.name.should.equal('Vitz');

    })
})