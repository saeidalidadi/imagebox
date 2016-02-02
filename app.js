var http = require('http');
var fs = require('fs');
var url = require('url');
var imagereader = require('./imagereader');



function controller(req, res) {
	if(req.url == '/'){
		var dir = __dirname + '\\index.html';
		var data = fs.readFileSync(dir,'utf8');
		res.writeHead(200,{'Content-Type':'text/html'});
		res.write(data);
		res.end();
	}
	else if (req.url == '/style.css' || req.url == '/bootstrap.min.css'){
		var dir = __dirname + '\\style\\' + req.url.replace('/','');
		fs.readFile(dir, function(err, data){
			res.writeHead(200,{'Content-Type':'text/css'});
			res.write(data);
			res.end();
		});		
	}
	else if(req.url == '/bootstrap.min.css'){
		res.end();
	}
	else if(req.url == '/addimages.js'){
		var dir = __dirname + '\\script\\' + req.url.replace('/','');
		fs.readFile(dir, function(err, data){
			res.writeHead(200,{'Content-Type':'text/javascript'});
			res.write(data);
			res.end();
		});
	}
	else {
		var imagePattern = /img/;
		var isImage = imagePattern.test(req.url);
		if (isImage){
			var dir = __dirname + '\\images\\' + req.url.replace('/','');
			fs.exists(dir,function(exist){
				if(exist) {
					fs.readFile(dir, function(err, data){
						res.writeHead(200,{'Content-Type':'image/jpg'});
						res.write(data);
						res.end();
					});	
				}
				else {
					console.log('thes is no more images! whit the path of: ' + dir);
					res.end();
				}
			});			
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


