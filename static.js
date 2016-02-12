//this is for static files that dosent need any value insertion befor sending to client
var fs = require('fs');
var path = require('path');
var thumbnail = require('jimp');
var database = require('./database');

//Response to all request after loading files
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

	var basename = path.parse(request.url).name;
	var name = request.url.replace('/','');
	var thumb_dir = __dirname + '\\images\\thumbnails\\';
	var thumb_path = thumb_dir + name;
	var big_path = __dirname + '\\images\\' + name;

	//checks to find that the image thumbnail and big exist in database
	database.findImage(basename, function(image) {
		if(!image) {
			//if the thumbnails directory not exsits then creat it
			fs.mkdir(thumb_dir, function(err) {
				if(err && err.code == 'EEXIST') {
					
				}
			});

			//checking for existance of thumbnail image in thumbnails folder
			fs.exists(thumb_path, function(exist) {
				if(exist) {
					fs.readFile(thumb_path, function(err, data) {
						answer(data, 'image/jpg', response);
						database.insertImage(basename, 'jpg', '', data);
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
		    		    			database.insertImage(basename, 'jpg', '', buffer, function() {

		    		    			});
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
			//anser with images returned from database
			answer(image, 'image/jpg', response);
		}
	});
}

module.exports.home = home;
module.exports.style = style;
module,exports.script = script;
module.exports.image = image;