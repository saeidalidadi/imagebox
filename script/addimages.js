//when document is ready
window.onload  =  function(){
	var btn = document.getElementById('btn-more');

	//when user click on more button
	btn.onclick = function(event) {

		//making images tags and scource urls
		var imageRow = '<div id="images-row" class="row">';
		var lastImageNumber = document.getElementsByClassName('img-item').length;

    	for(var i = lastImageNumber+1; i <= lastImageNumber + 3; i++) {
    		imageRow += '<div id="image-0' + i + '" class="" >';
    			imageRow += '<img src="/img-0' + i + '.jpg" class="img-thumbnail  img-item">';
    		imageRow += '</div>';
    	}		
    	imageRow += '</div>';

    	//adding these tags to end of images container
		document.getElementById('images').innerHTML += imageRow; 
	}
};