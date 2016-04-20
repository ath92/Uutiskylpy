$(document).ready(function(){

	var sentences;//global container for the sentences that will be loaded later.

	console.log('hello world!');

	var colors=["#f00","#0f0", "#00f", "#990", "#909", "#099"];

	$('#video').get(0).play();
	$('#video').resize(function(){
		//$('#content').css({'height': ($(window).height() - $('#video').height()) + 'px'});//-20 is a dirty thing but I don't feel like changing it right now
	});

	var timeout;//global timeoutvariable

	$.ajax({
	    type: "GET" ,
	    url: "xml/text.xml" ,
	    dataType: "text" ,
	    success: function(data) {
		    
			//we start by splitting the incoming data (the pseudo xml) into seperate sentences.

	    	var newdata = data.replace('</mw-sentence>', '</mw-sentence>}}{{');//add delimiters
	    	sentences = newdata.split('}}{{');

	    	//then, we add the first sentence to the body.

	    	setSentence(0);

	    	//now let's also add the timeline buttons

	    	for(var i = 0; i < sentences.length; i++){
	    		var element = $('<a href="#">'+i+'</a>');
	    		element.on('click', function(){
	    			$('#timeline a').removeClass('active');
	    			$(this).addClass('active');
	    			setSentence($(this).html());
	    		});
	    		$('#timeline').append(element);
	    	}

	    	$('#video').click(function(){
				$('#video').get(0).play();
	    	});



	    	function setSentence(sentenceId){

    			$('mw-sentence').remove();
    			$('.container').append(sentences[sentenceId]);


		    	$('mw-finnish mw-word').on('click', function(e){
		    		$('mw-sentence, mw-word').removeClass('active');
		    		$(this).addClass('active');
		    		clearTimeout(timeout);
		    		timeout = setTimeout(function(){
		    			$('mw-word').removeClass('active');
		    		}, 2000);
		    	});


		    	$('mw-finnish').on('swipeone swiperight', function(e){
		    		$('mw-sentence').toggleClass('active');
		    	});

		    	//this code adds a tooltip for each Finnish word containing the arabic translations of those words as specified in the pseudo-xml file.
		    	var iterator = 0;
		    	$('mw-finnish mw-word').each(function(){
		    		var finnishId = $(this).attr('id');

		    		$(this).css({'color':colors[iterator]});
					$('mw-arabic mw-word[finnish-id="'+finnishId+'"]').css({'background-color':colors[iterator%colors.length]});
		    		var arabicWords = $('mw-arabic mw-word[finnish-id="'+finnishId+'"]');
		    		console.log(arabicWords);
		    		var arabicHTMLString = "";
		    		for(i=0;i<arabicWords.length;i++){
		    			arabicHTMLString += arabicWords.get(i).innerHTML;
		    		}

		    		$(this).append('<mw-tooltip>'+arabicHTMLString+'</mw-tooltip>');

		    		iterator++;
		    	});

		    	$('mw-tooltip').css({'height': $('mw-arabic').height()});
	    	}

		}
    });

});