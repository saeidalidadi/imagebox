var assert = require('assert');
var db = require('./database');
describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(4));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});

describe('Database', function(){
	it('shold return true if the name exist', function(done){
		db.existsIndb('name','ss');
		done();
	});
});