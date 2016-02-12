var mongodb = require('mongodb');
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var test = require('assert');
function Database() {
	mongodb.call(this);
	this.url = 'mongodb://localhost:27017/imagebox';
}

Database.prototype = Object.create(mongodb);
//connectiong to database if no connection is yet
/*Database.prototype.connect = function() {

}*/
//inserting image to database
Database.prototype.insertImage = function(name, format, big, thumbnail, callback) {

	var image = {
		name : name,
		big : big,
		thumbnail : thumbnail,
		format: format
	}
	//insertin 
	function insertDocument(db, coll, callback) {
		var col = db.collection('images');
		col.insertOne(image, function(err, result) {
			//callback(result);
			//console.log(test.equal(null, err));
    		//test.equal(1, result.insertedCount);
    		//console.log(result);
		});
	}

	mongoClient.connect(this.url, function(err, db) {
		if(err) {

		}
		else {
			insertDocument(db,'images', function(result) {
				db.close();
			});
		}
	});
}

//checking existance of image in database
Database.prototype.findImage = function(name, callback) {

	mongoClient.connect(this.url, function(err, db) {
		if(err) {
			throw "An error in database connection";
		}
		else {
			var col = db.collection('images');
			col.find({ name : name }).limit(1).next(function(err, result) {
				
				if(result == null || typeof result == 'undefined' || result.length == 0 ) {
					callback(false);
				}
				else {
					callback(true, result.thumbnail.buffer );
				}
				db.close();
			});
		}
	});
}

module.exports = new Database();
