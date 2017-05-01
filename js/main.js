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
	var chartIds = ['chartETH', 'chartREP', 'chartDGD', 'chartGNT', 'chartMLN', 'chartSWT', 'chartMKR', 'chartSNGLS'];

	// START Web3 data connection
	var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/zlxHErsCk0K9XtxyUguc"));
	const abiICO = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"raisedFromToken","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"}],"name":"setToken","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"address"}],"name":"setAllStopper","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"currTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newPayee","type":"address"}],"name":"changePayee","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"currSaleActive","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_for","type":"address"},{"name":"_token","type":"address"},{"name":"_ethValue","type":"uint256"},{"name":"_depositedTokens","type":"uint256"},{"name":"_reference","type":"bytes32"}],"name":"depositTokens","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"allStart","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"currSaleComplete","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"sale","type":"address"}],"name":"addSale","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"claim","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"salenum","type":"uint256"}],"name":"claimableOwnerEth","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"claimableRefund","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"address"},{"name":"_amt","type":"uint256"}],"name":"emergencyRefund","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_to","type":"address"}],"name":"transferTokens","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"weiPerEth","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"a","type":"address"}],"name":"claimableRefund","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"salenum","type":"uint256"}],"name":"numContributors","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"t","type":"uint256"}],"name":"setFakeTime","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"a","type":"address"}],"name":"claimableTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"testing","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"m","type":"uint256"}],"name":"addMinutes","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_controller","type":"address"}],"name":"setController","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"setAsTest","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"numSales","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"raisedFromFiat","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"salenum","type":"uint256"}],"name":"claimOwnerEth","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdrawTopUp","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"payee","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"}],"name":"claimFor","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"sales","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"claimableTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tokensPerEth","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"mintRefs","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"nextClaim","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"d","type":"uint256"}],"name":"addDays","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"topUp","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"topUpAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getCurrSale","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"allStop","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_for","type":"address"},{"name":"_ethValue","type":"uint256"},{"name":"_reference","type":"bytes32"}],"name":"depositFiat","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"sale","type":"address"},{"name":"minimumPurchase","type":"uint256"}],"name":"addSale","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"raised","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"controller","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"purchaser","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"logPurchase","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"purchaser","type":"address"},{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"depositedTokens","type":"uint256"},{"indexed":false,"name":"ethValue","type":"uint256"},{"indexed":false,"name":"_reference","type":"bytes32"}],"name":"logPurchaseViaToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"purchaser","type":"address"},{"indexed":false,"name":"ethValue","type":"uint256"},{"indexed":false,"name":"_reference","type":"bytes32"}],"name":"logPurchaseViaFiat","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"logTokenTransfer","type":"event"},{"anonymous":false,"inputs":[],"name":"logAllStop","type":"event"},{"anonymous":false,"inputs":[],"name":"logAllStart","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"startTime","type":"uint256"},{"indexed":false,"name":"stopTime","type":"uint256"}],"name":"logSaleStart","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"purchaser","type":"address"},{"indexed":false,"name":"refund","type":"uint256"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"logClaim","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];
	const abiToken = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"lockTokenHolder","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"},{"name":"amount","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"burn","outputs":[{"name":"result","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_maxSupply","type":"uint256"}],"name":"setMaxSupply","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_controller","type":"address"}],"name":"setController","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_ico","type":"address"}],"name":"setICO","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"maxSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_th","type":"address"}],"name":"setTokenHolder","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"burner","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Burn","type":"event"}]

	var contractICO = web3.eth.contract(abiICO);
	var contractInstanceICO = contractICO.at('0x2235a7b77308c5631a33e83b5b7cb06b0092311d');
	var contractToken = web3.eth.contract(abiToken);
	var contractInstanceToken = contractToken.at('0x0e898b8ae39ae33ae810069a0a6b562455d4f43c');

	const weiPerEth = contractInstanceICO.weiPerEth.call();

	var raisedETH = contractInstanceICO.raised.call()/weiPerEth;
	var raisedFiat = contractInstanceICO.raisedFromFiat.call().toNumber();
	var raisedREP = contractInstanceICO.raisedFromToken.call('0x48c80F1f4D53D5951e5D5438B54Cba84f29F32a5').toNumber()/weiPerEth*16;
	var raisedDGD = contractInstanceICO.raisedFromToken.call('0xe0b7927c4af23765cb51314a0e0521a9645f0e2a').toNumber()/weiPerEth*27.5;
	var raisedGNT = contractInstanceICO.raisedFromToken.call('0xa74476443119A942dE498590Fe1f2454d7D4aC0d').toNumber()/weiPerEth*.22;
	var raisedMLN = contractInstanceICO.raisedFromToken.call('0xBEB9eF514a379B997e0798FDcC901Ee474B6D9A1').toNumber()/weiPerEth*36.4;
	var raisedSWT = contractInstanceICO.raisedFromToken.call('0xb9e7f8568e08d5659f5d29c4997173d84cdf2607').toNumber()/weiPerEth*1.35;
	var raisedMKR = contractInstanceICO.raisedFromToken.call('0xc66ea802717bfb9833400264dd12c2bceaa34a6d').toNumber()/weiPerEth*85.8;
	var raisedSNGLS = contractInstanceICO.raisedFromToken.call('0xaec2e87e0a235266d9c5adc9deb4b2e29b54d009').toNumber()/weiPerEth*13.8;

	var raisedETHp = numeral(raisedETH).format('0.0a');
	var raisedFiatp = numeral(raisedFiat).format('0.0a');
	var raisedREPp = numeral(raisedREP).format('0.0a');
	var raisedDGDp = numeral(raisedDGD).format('0.0a');
	var raisedGNTp = numeral(raisedGNT).format('0.0a');
	var raisedMLNp = numeral(raisedMLN).format('0.0a');
	var raisedSWTp = numeral(raisedSWT).format('0.0a');
	var raisedMKRp = numeral(raisedMKR).format('0.0a');
	var raisedSNGLSp = numeral(raisedSNGLS).format('0.0a');

	var numberContributors = contractInstanceICO.numContributors.call().toNumber();
	var numMVP = numberContributors <= 500 ? numberContributors : 500;

	var tknCreated = contractInstanceToken.totalSupply.call().toNumber()/100000000;
	var tknCreatedp = numeral(tknCreated).format('0.0a');

	var tknDollarAmount = ((raisedREP * 16) + (raisedDGD * 27.5) + (raisedGNT * .22) + (raisedMLN * 36.4) + (raisedSWT * 1.35) + (raisedMKR * 85.8) + (raisedSNGLS * 13.8));
	console.log('raised in ETH =', raisedETH * 75);
	console.log('raised in Fiat =', raisedFiat);
	console.log('raised in Tokens =', tknDollarAmount);

	var raisedUSD = ((raisedETH * 75) + raisedFiat + tknDollarAmount);
	var raisedUSDp = numeral(raisedUSD).format('0.0a');
	var tknPerETH = (raisedETH + raisedFiat + tknDollarAmount) <= 750000 ? 150 : 100;

	const ETH_CAP = 65000;
	const REP_CAP = 50000;
	const DGD_CAP = 10000;
	const GNT_CAP = 2750000;
	const MLN_CAP = 5000;
	const SWT_CAP = 70000;
	const MKR_CAP = 3500;
	const SNGLS_CAP = 3500000;

	var remainingETH = raisedETH <= ETH_CAP ? ETH_CAP - raisedETH : 0;
	var remainingREP = raisedREP <= REP_CAP ? REP_CAP - raisedREP : 0;
	var remainingDGD = raisedDGD <= DGD_CAP ? DGD_CAP - raisedDGD : 0;
	var remainingGNT = raisedGNT <= GNT_CAP ? GNT_CAP - raisedGNT : 0;
	var remainingMLN = raisedMLN <= MLN_CAP ? MLN_CAP - raisedMLN : 0;
	var remainingSWT = raisedSWT <= SWT_CAP ? SWT_CAP - raisedSWT : 0;
	var remainingMKR = raisedMKR <= MKR_CAP ? MKR_CAP - raisedMKR : 0;
	var remainingSNGLS = raisedSNGLS <= SNGLS_CAP ? SNGLS_CAP - raisedSNGLS : 0;

	var tokenAmts = {
		'chartETH': [raisedETH, remainingETH],
		'chartREP': [raisedREP, remainingREP],
		'chartDGD': [raisedDGD, remainingDGD],
		'chartGNT': [raisedGNT, remainingGNT],
		'chartMLN': [raisedMLN, remainingMLN],
		'chartSWT': [raisedSWT, remainingSWT],
		'chartMKR': [raisedMKR, remainingMKR],
		'chartSNGLS': [raisedSNGLS, remainingSNGLS]
	};

	$('#raised-ETH').html(raisedETHp);
	$('#raised-REP').html(raisedREPp);
	$('#raised-DGD').html(raisedDGDp);
	$('#raised-GNT').html(raisedGNTp);
	$('#raised-MLN').html(raisedMLNp);
	$('#raised-SWT').html(raisedSWTp);
	$('#raised-MKR').html(raisedMKRp);
	$('#raised-SNGLS').html(raisedSNGLSp);

	$('#usd-raised').html(raisedUSDp);
	$('#num-contributors').html(numMVP);

	$('#tkn-created').html(tknCreatedp);

	$('tkn-per-eth').html(tknPerETH);

	// END Web3 data connection

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
				var chartIds = ['chartETH', 'chartREP', 'chartDGD', 'chartGNT', 'chartMLN', 'chartSWT', 'chartMKR', 'chartSNGLS'];
				_.each(chartIds, function(chartId, index){
					createChartForId(chartId, index, tokenAmts);
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
		//offsetSectionsKey: 'bmdyb2suaW9faHAxYjJabWMyVjBVMlZqZEdsdmJuTT1JejQ=',  // this one is for dev purposes for use on ngrok.io
		offsetSectionsKey: 'dG9rZW5jYXJkLmlvX0lLV2IyWm1jMlYwVTJWamRHbHZibk09cEEw', //this is the real activationkey for this extention for use with the tokencard.io domain name
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
	function createChartForId(canvasId, index, raisedAmounts){
		var ctx = document.getElementById(canvasId);
		var options = {
			cutoutPercentage: 95,
	  };
	  var colors = ['#24DD7B','#8A49B4','#577DFE','#DD24C9', '#C1DD24', '#ED5B5B', '#DD9124', '#60D2EA'];
		var data = {
			datasets: [
				{
					data: [raisedAmounts[canvasId][0], raisedAmounts[canvasId][1]],
					backgroundColor: [colors[index], '#141C2E'],
					borderColor: ['transparent', 'transparent']
				}
			]
		}
		var chart = new Chart(ctx, {
	    	type: 'doughnut',
	    	data: data,
	    	options: options
		});
	}

	var chartIds = ['chartETH', 'chartREP', 'chartDGD', 'chartGNT', 'chartMLN', 'chartSWT', 'chartMKR', 'chartSNGLS'];

	_.each(chartIds, function(chartId, index){
		createChartForId(chartId, index, tokenAmts);
	});

	// video player
	$(".video-preview-overlay").modalVideo({channel:'vimeo'});

	// countdown YYYY/MM/DD hh:mm:ss
	$('#countdown-contain').countdown('2017/05/02 16:00:00 GMT').on('update.countdown', function(event) {
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
