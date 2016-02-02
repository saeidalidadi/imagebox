var http = require('http');
var fs = require('fs');
var url = require('url');
var imagereader = require('./imagereader');
var thumbnail = require('jimp');


function home(response){

	var dir = __dirname + '\\index.html';
	var data = fs.readFileSync(dir,'utf8');
	response.writeHead(200,{'Content-Type':'text/html'});
	response.write(data);
	response.end();

}

function style(request, response){

	var dir = __dirname + '\\style\\' + request.url.replace('/','');
	fs.readFile(dir, function(err, data){
		response.writeHead(200,{'Content-Type':'text/css'});
		response.write(data);
		response.end();
	});	

}

function script(request, response) {
	var dir = __dirname + '\\script\\' + request.url.replace('/','');
	fs.readFile(dir, function(err, data){
		response.writeHead(200,{'Content-Type':'text/javascript'});
		response.write(data);
		response.end();
	});
}

function image(request, response) {

	var thumb_dir = __dirname + '\\images\\thumbnails\\' + request.url.replace('/','');
	var big_dir = __dirname + '\\images\\' + request.url.replace('/','');
	fs.exists(thumb_dir, function(exist) {
		//checking for existance of thumbnail image in thumbnails folder
		if(exist) {console.log(thumb_dir);
			fs.readFile(thumb_dir, function(err, data) {
				response.writeHead(200,{'Content-Type':'image/jpg'});
				response.write(data);
				response.end();
			});
		} 
		else if(!exist) {
			fs.exists(big_dir, function(exist){
				if(exist) {
					thumbnail.read(big_dir, function (err, lenna) {
   						if (err) throw err;
    					lenna.resize(256, 256)       // resize 
  			      	 	.quality(60)            // set JPEG quality 
   			      	 	.greyscale()
   			      	 	.write(thumb_dir)            // set greyscale 
    		     	 	.getBuffer(thumbnail.MIME_JPEG, function(err, buffer) {
    		    			response.writeHead(200,{'Content-Type':'image/jpg'});
							response.write(buffer);
							response.end();
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

function controller(req, res) {
	if(req.url == '/'){
		home(res);
	}
	else if (req.url == '/style.css' || req.url == '/bootstrap.min.css') {
		style(req,res);
	}
	else if(req.url == '/addimages.js'){
		script(req, res);
	}
	else {
		var imagePattern = /img/;
		var isImage = imagePattern.test(req.url);
		if (isImage){
			image(req, res);		
		}
		else {
			res.end();
		}
	}

	//console.log(req.url)
}

http.createServer(controller).listen(3000, function(arg){
	console.log('Server listen to: 127.0.0.1 on port 3000' );
});


