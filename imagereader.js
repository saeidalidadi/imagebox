var thumbnail = require('jimp');
var fs = require('fs');
var dir = __dirname + '\\images';
var images;
//reading all images name from images directory
fs.readdir(dir, function(err, files) {
	images = files;
});


