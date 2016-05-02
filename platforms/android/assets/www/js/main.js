$(document).ready(function(){

	var sentences, sentenceStart, sentenceEnd, currentSentence;//global variables that contains the HTML for each sentence and two vars for end and beginning of current sentence (in seconds)

	console.log('hello world!');

	var colors=["#f99","#9f9", "#99f", "#ff9", "#f9f", "#9ff", "#caf", "#fca"];

	var video = document.getElementById('video');
	video.play();
	$('#video').resize(function(){
		//$('#content').css({'height': ($(window).height() - $('#video').height()) + 'px'});//-20 is a dirty thing but I don't feel like changing it right now
	});

	video.addEventListener("timeupdate", function(){
	    if(this.currentTime >= sentenceEnd) {
	        this.pause();
	    }
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
	    		if(i==0) element.addClass('active');
	    		element.on('click', function(){
	    			setSentence($(this).html());
	    		});
	    		$('#timeline').append(element);
	    	}

	    	$('#video').click(function(){
				if(video.paused || video.ended){
					setSentence((currentSentence+1)%sentences.length);
				}
	    	});



	    	function setSentence(sentenceId){
	    		currentSentence = sentenceId;

    			$('mw-sentence').remove();
    			$('.container').append(sentences[sentenceId]);

    			sentenceStart = parseInt($('mw-sentence').attr('start'));
    			sentenceEnd = parseInt($('mw-sentence').attr('end'));

    			video.currentTime = sentenceStart;
    			video.play();

    			$('#timeline a').removeClass('active');
    			$('#timeline a:nth-child('+(parseInt(sentenceId)+1)+')').addClass('active');

    			console.log(sentenceId, $('#timeline a:nth-child('+(parseInt(sentenceId)+1)+')'));



		    	$('mw-finnish mw-word').on('click', function(e){
		    		$('mw-sentence, mw-word').removeClass('active');
		    		$(this).addClass('active');
		    		clearTimeout(timeout);
		    		timeout = setTimeout(function(){
		    			$('mw-word').removeClass('active');
		    		}, 2000);
		    	});


		    	$('mw-finnish').on('dblclick', function(e){
		    		$('mw-word').removeClass('active');
		    		$('mw-sentence').toggleClass('active');
		    	});


		    	$('mw-sentence').on('swipeone swiperight', function(e){
		    		setSentence((sentenceId + 1) % sentences.length);
		    	});

		    	//this code adds a tooltip for each Finnish word containing the arabic translations of those words as specified in the pseudo-xml file.
		    	var iterator = 0;
		    	$('mw-finnish mw-word').each(function(){
		    		var finnishId = $(this).attr('id');

		    		$(this).css({'border': '2px solid ' + colors[iterator%colors.length]});
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