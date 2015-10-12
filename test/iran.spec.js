var expect = require("chai").expect;
var iran = require('../dist/iran.js');

describe('Iran Cities', function () {
	describe('Length', function () {
		it('cities length should be 1242', function () {
			var citiesLength = iran.cities.length;
			expect(citiesLength).to.equal(1242);
		});
	});
});