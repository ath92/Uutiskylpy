$(document).ready(function(){

	var sentences, sentenceStart, sentenceEnd, currentSentence;//global variables that contains the HTML for each sentence and two vars for end and beginning of current sentence (in seconds)
	var colors=["#ff5f5f", "#8b95f4", "#fff8a0", "#48fe99", "#898989", "#f48be7", "#e0750c", "#abfff7", "#75b090", "#bd8bf4", "#cfcfcf", "#edae53", "#8bd0f4", "#bc8a8a", "#b0f781", "#ff45c9"];

	var video = document.getElementById('video');
	video.play();

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

	    	var newdata = data.replaceAll('</mw-sentence>', '</mw-sentence>}}{{');//add delimiters
	    	sentences = newdata.split('}}{{');
	    	if(sentences[sentences.length-1]=="") sentences.pop(); // for some reason, there is an empty string at the end of the array.

	    	console.log(sentences);

	    	//then, we add the first sentence to the body.

	    	setSentence(0);

	    	//now let's also add the timeline buttons

	    	for(var i = 0; i < sentences.length; i++){
	    		var element = $('<a href="#" sentece-id="'+i+'"></a>');
	    		if(i==0) element.addClass('active');
	    		element.on('click', function(){
	    			setSentence($(this).attr('sentece-id'));
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
    			$('#timeline a.active').addClass('complete');
    			$('#timeline a').removeClass('active');
    			$('#timeline a:nth-child('+(parseInt(sentenceId)+1)+')').addClass('active');

		    	$('mw-finnish mw-word').on('click', function(e){
		    		$('#tooltip').addClass('active');
		    		$('mw-word, mw-sentence').removeClass('active');
		    		$(this).addClass('active');
		    		$('#tooltip').html($(this).parent().parent().find('mw-tooltip[finnish-id="'+$(this).attr('id')+'"]').prop('outerHTML'));
		    		clearTimeout(timeout);
		    		timeout = setTimeout(function(){
		    			$('#tooltip, mw-word').removeClass('active');
		    		}, 4000);
		    	});


		    	$('mw-finnish').on('dblclick', function(e){
		    		$('mw-word, #tooltip').removeClass('active');
		    		$('mw-sentence').toggleClass('active');
		    	});


		    	$('mw-sentence').on('swipeone swiperight', function(e){
		    		setSentence((sentenceId + 1) % sentences.length);
		    	});

		    	//this code adds a tooltip for each Finnish word containing the arabic translations of those words as specified in the pseudo-xml file.
		    	var iterator = 0;
		    	$('mw-finnish mw-word').each(function(){
		    		var finnishId = $(this).attr('id');

		    		$(this).css({'background-color': '' + colors[iterator%colors.length]});
					$('mw-arabic mw-word[finnish-id="'+finnishId+'"]').css({'background-color':colors[iterator%colors.length]});

					var sentence = $(this).parent().parent();// mw-word --> mw-finnish -> mw-sentece

					//dynamically add tooltip if not already there in the xml. Assumes there is one word in finnish that directly translates to all the corresponding arabic words, without caring about grammar etc.
					if(sentence.find('mw-tooltip[finnish-id="'+finnishId+'"]').length == 0)
					{
			    		var arabicWords = $('mw-arabic mw-word[finnish-id="'+finnishId+'"]');
			    		
			    		var arabicHTMLString = "";
			    		for(i=0;i<arabicWords.length;i++){
			    			arabicHTMLString += arabicWords.get(i).innerHTML;
			    		}
			    		var $tooltip = $('<mw-tooltip finnish-id="'+finnishId+'"><finnish-part id="1">'+$(this).html()+'</finnish-part><arabic-part finnish-id="1">'+arabicHTMLString+'</arabic-part></mw-tooltip>'); 

			    		sentence.find('mw-tooltips').append($tooltip);
					} else {
						$tooltip = sentence.find('mw-tooltip[finnish-id="'+finnishId+'"]');

						var finnishParts = $tooltip.find('finnish-part');
						console.log(finnishParts);
			    		if(finnishParts.length > 1){
			    			var colorIterator = 0;
			    			$tooltip.find('finnish-part').each(function(e){
			    				$(this).css({'background-color':colors[colorIterator%colors.length]});
			    				if(!$(this).is(':last-of-type')) $(this).after(' + ');
			    				$tooltip.find('arabic-part[finnish-id="'+$(this).attr('id')+'"]').css({'background-color':colors[colorIterator%colors.length]});
			    				colorIterator++;
			    			});
			    		}
					}

		    		iterator++;
		    	});

		    	$('mw-tooltip').css({'height': $('mw-arabic').height()});
	    	}

		}
    });

});

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};