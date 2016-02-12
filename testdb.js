var mongodb = require('mongodb');
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var test = require('assert');
var util = require('util');

var user = {
	name : 'saeid',
	email : 'alidadisaeid@gmail.com'
}

mongoClient.connect('mongodb://localhost:27017/site', function(err, db){
	var col = db.collection('Users');
	col.insertOne(user, function(err, r){
		console.log('inserted %s user to database', r.insertedCount);
		//db.close();
	});
	//find saeid from database
	var name = 'saeid';
	col.find({"name" : name }).toArray(function(err,result) {
		for(var i = 0; i<result.length; i++) {
			console.log(result[i]._id + '  ' + result[i].name);
		}
	});
});

//Getting command from console
process.stdin.resume();
process.stdin.on('data', function(data) {
	console.log(data.toString());
	process.exit();
});