$(document).ready(function(){

	var sentences, sentenceStart, sentenceEnd, currentSentence;//global variables that contains the HTML for each sentence and two vars for end and beginning of current sentence (in seconds)
	var colors=["#ff5f5f", "#8b95f4", "#fff8a0", "#48fe99", "#898989", "#f48be7", "#e0750c", "#abfff7", "#75b090", "#bd8bf4", "#cfcfcf", "#edae53", "#8bd0f4", "#bc8a8a", "#b0f781", "#ff45c9"];

	

	var timeout;//global timeoutvariable

	var quizProbability = 0; // probability of doing a quiz

	//VIDEO
	var video = document.getElementById('video');
	var videoUrl = getQueryVariable('video');

	var source = document.createElement('source');

	source.setAttribute('src', 'http://www.tomhutman.nl/medium-waffle-3/'+videoUrl+'.mp4');

	video.appendChild(source);
	video.play();

	video.addEventListener("timeupdate", function(){
	    if(this.currentTime >= sentenceEnd) {
	        this.pause();
	        $('.video-overlay').addClass('active');
	    }
	});


	//XML
	var url=getQueryVariable('file');


	$.ajax({
	    type: "GET" ,
	    url: "xml/"+url+".xml" ,
	    dataType: "text" ,
	    success: function(data) {
		    
			//we start by splitting the incoming data (the pseudo xml) into seperate sentences.

	    	var newdata = data.replaceAll('</mw-sentence>', '</mw-sentence>}}{{');//add delimiters
	    	sentences = newdata.split('}}{{');
	    	if(sentences[sentences.length-1].indexOf("sentence") < 0) sentences.pop(); // for some reason, there is an empty string at the end of the array.

	    	console.log(sentences);

	    	//then, we add the first sentence to the body.

	    	setSentence(0);
	    	quizProbability = 0.5;

	    	//now let's also add the timeline buttons

	    	for(var i = 0; i < sentences.length; i++){
	    		var element = $('<a href="#" sentence-id="'+i+'"></a>');
	    		if(i==0) element.addClass('active');
	    		element.on('click', function(){
	    			setSentence($(this).attr('sentence-id'));
	    		});
	    		$('#timeline').append(element);
	    	}

	    	$('#video').click(function(){
				if(video.paused || video.ended){
					setSentence((currentSentence+1)%sentences.length);
				}
	    	});

	    	$('.video-overlay a:first-child').click(function(e){
	    		setSentence(currentSentence-1);
	    	});
	    	$('.video-overlay a:last-child').click(function(e){
	    		setSentence(currentSentence+1);
	    	});
	    	$('.video-overlay a:nth-child(2)').click(function(e){
    			video.currentTime = sentenceStart;
    			video.play();
	        	$('.video-overlay').removeClass('active');
	    	});



	    	function setSentence(sentenceId){
	    		if(Math.random() < quizProbability) {
	    			return doQuiz(sentenceId, function() { 
		    			$('#quiz').removeClass('active'); 
		    			setSentence(sentenceId); 
		    		});
	    		}

	        	$('.video-overlay').removeClass('active');
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
		    		//setSentence((sentenceId + 1) % sentences.length);
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

	    	function doQuiz(sentenceId, callBack){
	    		var $sentence = $($(sentences[sentenceId]));
	    		var $finnishWords = $sentence.find('mw-finnish mw-word');
	    		var $finnishWord = $finnishWords[Math.round(Math.random() * $finnishWords.length)];

	    		console.log($sentence, 'sentence');
	    		$('#quiz .question').html($finnishWord);


	    		var $arabicWords = $sentence.find('mw-arabic mw-word');
	    		var $correctAnswer = $sentence.find('mw-arabic mw-word[finnish-id="'+$($($finnishWord)).attr('id')+'"]')[0];


	    		console.log($arabicWords, 'words');
	    		console.log($correctAnswer, 'word');
	    		
	    		//randomly pick incorrect values
	    		var incorrect = [findNewRandom(3, [])];
	    		incorrect.push(findNewRandom(3, incorrect));
	    		incorrect.push(findNewRandom(3, incorrect));

	    		var offset = Math.floor(Math.random() * 4);

	    		var answers = [null, null, null, null];

    			answers[(offset)%answers.length] = $correctAnswer.innerHTML;
	    		for(var i = 1; i < answers.length; i++){
	    			console.log('index', incorrect[i-1]);
	    			console.log($arabicWords[incorrect[i-1]], 'word');
	    			answers[(i+offset)%answers.length] = $arabicWords[incorrect[i-1]].innerHTML;
	    		}

	    		console.log(offset);

	    		$('#quiz .answers').html("<li>"+answers[0]+"</li>"+"<li>"+answers[1]+"</li>"+"<li>"+answers[2]+"</li>"+"<li>"+answers[3]+"</li>");

	    		$('#quiz .answers li:nth-child('+((offset+1))+')').addClass('correct');

	    		$('#quiz').addClass('active');

				$('#quiz .answers li').click(function(e){
					if($(this).hasClass('correct')){
						callBack();
					} else {
						$(this).addClass('wrong');
					}
				})	    		
	    	}

		}
    });

});

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function findNewRandom(range, existing){
	if(existing.length >= range) return 0; // protection
	var r = Math.round(Math.random() * range);
	for(var i = 0; i < existing.length; i++){
		if(r == existing[i]) r = findNewRandom(range, existing);
	}
	return r;
}