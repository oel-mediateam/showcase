/* global console */

// GLOBAL FANCYBOX CONFIG VARIABLES
var FB_PADDING = 0, FB_TOP_RATIO = 0.25;
	
$(document).ready(function(){

	$("header nav ul li a").onMenuSelect();
	$(".showcase-container .grid").onGridHover();
	$(".showcase-container .grid").onGridClick();
	
});

$.fn.onMenuSelect = function() {
	this.on("click", function() {
		$(this.parentNode.parentNode.childNodes).each(function() {
			$(this).removeClass("active");
		});
		$(this.parentNode).addClass("active");
	});
};

$.fn.onGridHover = function() {
	this.hover(function() {
		$(this).find(".overlay").hide().fadeIn(500);
		$(this).toggleClass("active").next().stop(true,true);
	});
};

$.fn.onGridClick = function() {
	this.click(function() {
	
		var ttl = $(this).find("img").attr("alt");
		var sbttl = $(this).find("img").attr("data-subtitle");
		var vsrc = $(this).find("img").attr("data-src");
		
		console.log(sbttl);
		
		if($(this).hasClass("video")) {
			$(this).getVideo(ttl,sbttl,vsrc);
		} else {
			$(this).getVideo(ttl,sbttl,vsrc);
		}

	});
};

$.fn.getVideo = function(videoTitle,videoSubtitle,videoSrc) {

	var vidWidth = 640, vidHeight = 360;
	
	if (videoSrc.indexOf("mediastreamer") >= 0) {
		vidHeight = 410;
	}
	
	$.fancybox({
		href:videoSrc,
		title:videoTitle,
		padding: FB_PADDING,
		topRatio: FB_TOP_RATIO,
		width: vidWidth,
		height: vidHeight,
		type: "iframe",
		helpers: {
			title: null,
			overlay: {
				closeClick: false,
				css: {"background":"rgba(0,0,0, 0.9)"}
			},
			media: true
		},
		afterLoad: function() {
			this.inner.before("<h2>"+this.title+"</h2><h3>"+videoSubtitle+"</h3>");
		}
	});
};