// To make images retina, add a class "2x" to the img element
// and add a <image-name>@2x.png image. Assumes jquery is loaded.
function isRetina() {
	var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
					  (min--moz-device-pixel-ratio: 1.5),\
					  (-o-min-device-pixel-ratio: 3/2),\
					  (min-resolution: 1.5dppx)";
 
	if (window.devicePixelRatio > 1){
		return true;
	}
 
	if (window.matchMedia && window.matchMedia(mediaQuery).matches){
		return true;
	}
	return false;
};
 
function retina() {
	if (!isRetina())
		return;
	$("img.2x").map(function(i, image) {
		var path = $(image).attr("src");
		path = path.replace(".png", "@2x.png");
		path = path.replace(".jpg", "@2x.jpg");
		$(image).attr("src", path);
	});	
};

// Custom function to get start and end CSS rules to populate Velocity.js animations.
// This makes it easy to define start and end css classes for each element, and then to use Velocity.js to interpolate between them.
// This also helps with responsive design by finding the correct rules depending on media-queries.
// This function depends on lodash.js

var getStyle = function(selectorText){
	var stylesSheetSelector = 'link[title="main"]'
    var stylesheet = $(stylesSheetSelector)[0].sheet;
    
    var rules = stylesheet.rules || stylesheet.cssRules;

    function mediaQueryMatch(mediaText){
        return window.matchMedia(mediaText).matches;
    }

    function fishForStyleRules(rule) {       
        if(rule.type == 1){
            rule.mediaText = 'screen and (max-width: 999999px)';
            rule.mediaOrder = 999999;
            return rule;
        }
        else if(rule.type == 4){
        	if(rule.cssRules.length){
            	var styleRule = rule.cssRules[0];
            	styleRule.mediaText = rule.media.mediaText;
            	styleRule.mediaOrder = _.parseInt(_.trimEnd(_.trimStart(rule.media.mediaText, 'screen and (max-width:'), 'px'));
            	return styleRule;
        	}
        	else {return}
        }
        else {
            return 
        }
    }

    var styleRules = _.flatMap(rules, fishForStyleRules);

    var matchingStyleRules = _.filter(styleRules, {selectorText: selectorText});
    matchingStyleRules = _.orderBy(matchingStyleRules, ['mediaOrder'], ['desc']);

    var style = {};

    for(x=0; x < matchingStyleRules.length; x++){
        var styleRule = matchingStyleRules[x];
        if(mediaQueryMatch(styleRule.mediaText)){
            for(i=0; i < styleRule.style.length; i++){
                style[styleRule.style[i]] = styleRule.style[styleRule.style[i]];
            }
        }
    }

    return style;
};




$(document).ready(function() {
	smoothScroll.init();
	retina();

	/////////////////////////////////////////////////////////
	//prep load animations (just add prep to each one)
	/////////////////////////////////////////////////////////

	$('.hero-tokencard').addClass('hidden').delay(100).addClass('animated fadeInDown').removeClass('hidden');
	// .charts-container
	// $('.crowdsale-metric-container').addClass('hidden');
	$('.app-demo-frame-contain').addClass('hidden');
	$('.contribution-form-contain').addClass('hidden');
	$('.video-preview-contain').addClass('hidden');

	// fullpage nav // http://alvarotrigo.com/fullPage/
	var sectionAnchors = ['token', 'card', 'creation', 'app', 'contribute', 'vision'];
	var sectionTooltips = ['Token', 'The Card', 'TKN Creation Event', 'The App', 'Contribute', 'Vision' ];
	var chartIds = ['chartOne', 'chartTwo', 'chartThree', 'chartFour', 'chartFive', 'chartSix', 'chartSeven', 'chartEight'];

	function handleOnLeave(index, nextIndex, direction){
		// console.log('index:' + index)
		// console.log('nextIndex:' + nextIndex);
		// console.log('direction:' + direction);

		var fromAnchor = sectionAnchors[index-1];
		var toAnchor = sectionAnchors[nextIndex-1];
		// console.log('fromAnchor:' + fromAnchor);
		// console.log('toAnchor:' + toAnchor);
		
		if(direction == "down"){
			// TODO: perform velocity.js animations for the toAnchor section...
			if(fromAnchor == 'token'){
				if($('#site-header').hasClass('docked')){
					$('#site-header').removeClass('docked').addClass('animatedquick pulsenew');
				}
				var end = getStyle('.hero-tokencard.end');
				$.Velocity.animate($('.hero-tokencard'), end, {duration:700, easing:'ease-in-out'})
				.then(function(el){$(el).addClass('end').attr('style','')});
			}
			if(toAnchor == 'creation'){
				var chartIds = ['chartOne', 'chartTwo', 'chartThree', 'chartFour', 'chartFive', 'chartSix', 'chartSeven', 'chartEight'];
				_.each(chartIds, function(chartId, index){
					createChartForId(chartId, index);
				});
			}
			if(toAnchor == 'app'){
				$('.app-demo-frame-contain').addClass('animated fadeInUp').removeClass('hidden');
				// scrolljack the scrolljacker
				// $.fn.fullpage.setAllowScrolling(false);
			}
			if(toAnchor == 'contribute'){
				$('.contribution-form-contain').addClass('animated fadeInRight').removeClass('hidden');
			}

			if(toAnchor == 'vision'){
				$('.video-preview-contain').addClass('animated fadeInLeft').removeClass('hidden');
			}
		}
		else {
			if(toAnchor == 'token'){ 
				$('#site-header').addClass('docked animatedquick pulsenew').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
	          		$(this).removeClass('animatedquick pulsenew');
	          	});
				var start = getStyle('.hero-tokencard');
				$.Velocity.animate($('.hero-tokencard'), start, {duration:700, easing:'ease-in-out'})
				.then(function(el){$(el).removeClass('end').attr('style','')});
			}
		}
	}

	function handleAfterLoad(){

	}

	$('#fullpage').fullpage({
		offsetSections: true,
		offsetSectionsKey: 'bmdyb2suaW9faHAxYjJabWMyVjBVMlZqZEdsdmJuTT1JejQ=',  // this one is for dev purposes for use on ngrok.io
		// offsetSectionsKey: 'dG9rZW5jYXJkLmlvX0lLV2IyWm1jMlYwVTJWamRHbHZibk09cEEw', //this is the real activationkey for this extention for use with the tokencard.io domain name
		menu: '#menu',
		anchors: sectionAnchors,
		navigation: false,
		// navigationPosition: 'right',
		// navigationTooltips: sectionTooltips,
		// showActiveTooltip: false,
		animateAnchor: false,
		onLeave: handleOnLeave,
		afterLoad: handleAfterLoad,
		responsiveWidth: 3000,
		// responsiveHeight: 700,
		bigSectionsDestination: 'top',
	});


	// charts
	function createChartForId(canvasId, index){
		var ctx = document.getElementById(canvasId);
		var options = {
			cutoutPercentage: 95,
	    };

	    var colors = ['#24DD7B','#8A49B4','#577DFE','#DD24C9', '#C1DD24', '#ED5B5B', '#DD9124', '#60D2EA'];
		
		var data = {datasets: [{data:[50,50], backgroundColor:[colors[index], '#141C2E'], borderColor:['transparent', 'transparent']}]}

		var chart = new Chart(ctx, {
	    	type: 'doughnut',
	    	data: data,
	    	options: options
		});
	}

	// video player
	$(".video-preview-overlay").modalVideo({channel:'vimeo'});	

	var chartIds = ['chartOne', 'chartTwo', 'chartThree', 'chartFour', 'chartFive', 'chartSix', 'chartSeven', 'chartEight'];
	_.each(chartIds, function(chartId, index){
		createChartForId(chartId, index);
	});

	// countdown
	$('#countdown-contain').countdown('2017/05/02').on('update.countdown', function(event) {
		var $this = $(this).html(event.strftime(''
	    + '<div class="countdown-component"> <div class="countdown-value">%-d</div> <div class="countdown-label">Day%!d</div> </div>'
	    + '<div class="countdown-component"> <div class="countdown-value">%-H</div> <div class="countdown-label">Hours</div> </div>'
	    + '<div class="countdown-component"> <div class="countdown-value">%M</div> <div class="countdown-label">Minutes</div> </div>'
	    + '<div class="countdown-component"> <div class="countdown-value">%S</div> <div class="countdown-label">Seconds</div> </div>'));
	});


	// slider 
	$('.app-demo-nav-item').click(function(event){
		event.preventDefault();

		var slideSelector = '.app-demo-img-' + this.attributes['data-slide-index'].value;
		var navSelector = '.app-demo-nav-item-' + this.attributes['data-slide-index'].value;
		//hide active slide
		$('.app-demo-img').removeClass('active');
		$('.app-demo-nav-item').removeClass('active');

		//show new active slide
		$(slideSelector).addClass('active');
		$(this).addClass('active');

		return false;
	});

	$('.app-demo-slider-prev').click(function(event){
		event.preventDefault();

		//find active slide index
		var currentIndex = $('.app-demo-img.active')[0].attributes['data-slide-index'].value;
		var nextIndex = parseInt(currentIndex) - 1;
		if(nextIndex <= 0){ nextIndex = 3; }
		var slideSelector = '.app-demo-img-' + nextIndex;
		var navSelector = '.app-demo-nav-item-' + nextIndex;

		//hide active slide
		$('.app-demo-img').removeClass('active');
		$('.app-demo-nav-item').removeClass('active');

		//show new active slide
		$(slideSelector).addClass('active');
		$(navSelector).addClass('active');

		return false;
	});

	$('.app-demo-slider-next').click(function(event){
		event.preventDefault();

		//find active slide index
		var currentIndex = $('.app-demo-img.active')[0].attributes['data-slide-index'].value;
		// console.log(currentIndex)
		var nextIndex = parseInt(currentIndex) + 1;
		// console.log(nextIndex)
		if(nextIndex > 3){ nextIndex = 1; }
		// console.log(nextIndex)
		var slideSelector = '.app-demo-img-' + nextIndex;
		var navSelector = '.app-demo-nav-item-' + nextIndex;

		//hide active slide
		$('.app-demo-img').removeClass('active');
		$('.app-demo-nav-item').removeClass('active');

		//show new active slide
		$(slideSelector).addClass('active');
		$(navSelector).addClass('active');

		return false;
	});


	// confirm interaction 
	$(".confirm-btn").click(function(event){
		event.preventDefault();
		if($(this).hasClass('disabled')){
			return
		}
		else{
			$(".contribution-checklist").addClass('hidden');
			$(".contribution-form-contain h2").addClass('hidden');
			$(".etherium-address-info").removeClass('hidden');
		}
		return false;
	});

	$(".confirm-checkbox").change(function(event) {
		var checked = [];
		var checks = $('.confirm-checkbox').each(function(check, obj){
			if(obj.checked){
				checked.push(obj.checked)
			}
		});

		console.log(checked)
		console.log(checked.length)
		if(checked.length == 3){
			$(".confirm-btn").removeClass('disabled');
		}
	});


	// main nav menu
	/////////////////////////////////////
	var waypointTop = new Waypoint({
	    element:  $('.section-hero')[0],
	    handler: function(direction) {
	      if(direction == 'down'){
	          $('#site-header').removeClass('docked').addClass('animatedquick pulsenew').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
	          		$(this).removeClass('animatedquick pulsenew');
	          });
	      }
	      else if(direction=='up'){
	          $('#site-header').addClass('docked animatedquick pulsenew').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
	          		$(this).removeClass('animatedquick pulsenew');
	          });
	      } 
	    },
	    offset: '-30px'
	  });

	var toggleNav = function(){
    	$('#site-header').toggleClass('site-header-dropdown--open');
	}

	$('.site-header-menu-icon').click(function(event){
		event.preventDefault();
		toggleNav();
		return false;
	});

  $('#site-header a:not(.site-header-menu-icon)').click(function(event){
    if($('#site-header').hasClass('site-header-dropdown--open')){
      toggleNav();
    }
  });



	// REMOVE ALL THIS JUNK BEFORE THIS GOES TO PRODUCTION
	///////////////////////////////////////////////////////
	//setInterval(function(){
	// 	$('div:not([class],[id])').each(function(){
	// 	$(this).css('opacity', 0);
	// })
	// }, 5000);

	setTimeout(function(){
		$('div:not([class],[id])').each(function(){
		$(this).css('opacity', 0);
	})
	}, 3000);


});