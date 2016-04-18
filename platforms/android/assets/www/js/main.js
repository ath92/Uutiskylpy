$(document).ready(function(){
	console.log('hello world!');

	var colors=["#f00","#0f0", "#00f", "#990", "#909", "#099"];

	$('#video').get(0).play();

	$.ajax({
	    type: "GET" ,
	    url: "xml/text.xml" ,
	    dataType: "text" ,
	    success: function(data) {
		    
	    	$('#content').html(data);

	    	$('mw-finnish mw-word').on('click', function(e){
	    		//var finnishId = $(this).attr('id');
	    		//$('mw-arabic mw-word[finnish-id="'+finnishId+'"]').toggleClass('active');
	    		$(this).toggleClass('active');
	    		console.log("hey!");
	    	});

	    	$('#video').click(function(){
				$('#video').get(0).play();
	    	});



	    	$('mw-finnish').on('swipeone swiperight', function(e){
	    		$('mw-arabic').toggleClass('active');
	    		console.log("taphold!");
	    	});

	    	//this code adds a tooltip for each Finnish word containing the arabic translations of those words as specified in the pseudo-xml file.
	    	var iterator = 0;
	    	$('mw-finnish mw-word').each(function(){
	    		var finnishId = $(this).attr('id');

	    		$(this).css({'color':colors[iterator]});
				$('mw-arabic mw-word[finnish-id="'+finnishId+'"]').css({'background-color':colors[iterator]});
	    		var arabicWords = $('mw-arabic mw-word[finnish-id="'+finnishId+'"]');
	    		console.log(arabicWords);
	    		var arabicHTMLString = "";
	    		for(i=0;i<arabicWords.length;i++){
	    			arabicHTMLString += arabicWords.get(i).innerHTML;
	    		}

	    		$(this).append('<mw-tooltip>'+arabicHTMLString+'</mw-tooltip>');

	    		iterator++;
	    	});

		}
    });

});