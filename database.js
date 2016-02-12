var mongodb = require('mongodb');
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var test = require('assert');
function Database() {
	mongodb.call(this);
	this.url = 'mongodb://localhost:27017/imagebox';
}

Database.prototype = Object.create(mongodb);

//inserting image to database
Database.prototype.insertImage = function(name, format, big, thumbnail, callback) {

	var image = {
		name : name,
		big : big,
		thumbnail : thumbnail,
		format: format
	}
	//insertin documents into collection 
	function insertDocument(db, coll, callback) {
		var col = db.collection(coll);
		col.insertOne(image, function(err, result) {

		});
	}

	this.connect(this.url, function(err, db) {
		if(err) {

		}
		else {
			insertDocument(db,'images', function(result) {
				db.close();
			});
		}
	});
}

//find image in database and send result as buffer to callback
Database.prototype.findImage = function(name, callback) {

	this.connect(this.url, function(err, db) {
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
					callback(result.thumbnail.buffer);
				}
				db.close();
			});
		}
	});
}

module.exports = new Database();
