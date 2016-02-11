var http = require('http');
var url = require('url');
var imagereader = require('./imagereader');
var thumbnail = require('jimp');
var staticf = require('./static');



function controller(req, res) {
	if(req.url == '/'){
		staticf.home(res);
	}

	else if (req.url == '/style.css' || req.url == '/normalize.css') {
		style(req,res);
	}
	else if(req.url == '/addimages.js'){
		staticf.script(req, res);
	}
	else {
		var imagePattern = /img/;
		var isImage = imagePattern.test(req.url);
		if (isImage){
			staticf.image(req, res);		
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


