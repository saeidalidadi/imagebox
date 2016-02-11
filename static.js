//this is for static files that dosent need any value insertion befor sending to client
var fs = require('fs');
var path = require('path');
var thumbnail = require('jimp');
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;


//inserting image to database
var insertImage = function(db, name, format, big, thumbnail) {

	var image = {
		"name" : name,
		"big" : big,
		"thumbnail" : thumbnail,
		"format" : format
	}

	db.collection('images').insertOne(image);
}

//checking existance of image in database
var existsIndb = function(name, callback) {

	mongoClient.connect('mongodb://localhost:27017/images', function(err, db) {
		if(err) {
			throw "An error in database connection";
		}
		else {
			var result = db.collection("images").find({"name" : name });
			//console.log('Ok, connected to Mongodb client' + result);
			result.each(function(err, doc) {
				if(doc == null ) {
					console.log('The image not exist in database.');
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

//answer to request after loading files
function answer(data, type, response) {

	response.writeHead(200,{'Content-Type': type });
	response.write(data);
	response.end();
}

function home(response){

	var dir = __dirname + '\\index.html';
	var data = fs.readFileSync(dir,'utf8');
	answer(data, 'text/html', response);
}

function style(request, response) {

	var dir = __dirname + '\\style\\' + request.url.replace('/','');
	fs.readFile(dir, function(err, data){
		answer(data, 'text/css', response);
	});	

}

function script(request, response) {
	var dir = __dirname + '\\script\\' + request.url.replace('/','');
	fs.readFile(dir, function(err, data) {
		answer(data, 'text/javascript', response);
	});
}

function image(request, response) {

	var name = request.url.replace('/','');
	var thumb_dir = __dirname + '\\images\\thumbnails\\';
	var thumb_path = thumb_dir + name;
	var big_path = __dirname + '\\images\\' + name;

	//checks to find that the image thumbnail and big exist in database
	existsIndb(name, function(existindb) {
		if(!existindb) {
			//if the thumbnails directory not exsits then creat it
			fs.mkdir(thumb_dir, function(err) {
				if(err && err.code == 'EEXIST') {
					console.log('directory exist');
				}
			});

			//checking for existance of thumbnail image in thumbnails folder
			fs.exists(thumb_path, function(exist) {
				if(exist) {
					fs.readFile(thumb_path, function(err, data) {
						answer(data, 'image/jpg', response);
					});
				} 
				else if(!exist) {
					fs.exists(big_path, function(exist) {
						if(exist) {
							thumbnail.read(big_path, function (err, lenna) {
		   						if (err) throw err;
		    					lenna.scale(0.5)   // resize 
		  			      	 	.quality(30)             // set JPEG quality 
		   			      	 	.greyscale()             // set greyscale
		   			      	 	.write(thumb_path)        
		    		     	 	.getBuffer(thumbnail.MIME_JPEG, function(err, buffer) {
		    		    			answer(buffer, 'image/jpg', response);
							 	});
							});
						}
						else {
							response.end();
						}
					});		
				} 
				else {
					console.log('thes is no more images! whit the path of: ' + dir);
					response.end();
				}
			});	
		} 
		else {

		}
	});
}

module.exports.home = home;
module.exports.style = style;
module,exports.script = script;
module.exports.image = image;