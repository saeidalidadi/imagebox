var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;


function Database() {

}
//connectiong to database if no connection is yet
Database.prototype.connect = function() {

}
//inserting image to database
Database.prototype.insertImage = function(db, name, format, big, thumbnail) {

	var image = {
		"name" : name,
		"big" : big,
		"thumbnail" : thumbnail,
		"format" : format
	}

	db.collection('images').insertOne(image);
}

//checking existance of image in database
Database.prototype.existsIndb = function(name, callback) {

	mongoClient.connect('mongodb://localhost:27017/images', function(err, db) {
		if(err) {
			throw "An error in database connection";
		}
		else {
			var result = db.collection("images").find({"name" : name });
			result.each(function(err, doc) {
				if(doc == null ) {
					callback(false);
				}
				else {
					callback(true);
				}
			});
		}
		db.close();
	});
}

module.exports = new Database();
