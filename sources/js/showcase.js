/* global console */

// GLOBAL FANCYBOX CONFIG VARIABLES
var FB_PADDING = 0, FB_TOP_RATIO = 0.25, FB_CLOSE_CLICK = false, FB_OL_BG = "rgba(0,0,0,0.9)";

// WHEN THE PAGE IS LOADED
$(document).ready(function(){

	$("header nav ul li a").onMenuSelect();
	$(".showcase-container .grid").onGridHover();
	$(".showcase-container .grid").onGridClick();
	
	$(".dialog-container").dialog({
		modal:true,
		autoOpen: false,
		buttons: {
			Ok: function() {
				$(this).dialog("close");
			}
		}
	});
	
});

// FUNCTIONS

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
		
		if (vsrc.length) {
			if($(this).hasClass("video")) {
				$(this).getVideo(ttl,sbttl,vsrc);
			} else {
				$(this).getVideo(ttl,sbttl,vsrc);
			}
		} else {
			$(this).showMessage("No Source Found!","No source was found or specified for this grid.");
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
				closeClick: FB_CLOSE_CLICK,
				css: {"background":FB_OL_BG}
			},
			media: true
		},
		afterLoad: function() {
			this.inner.before("<h2>"+this.title+"</h2><h3>"+videoSubtitle+"</h3>");
		}
	});
};

$.fn.showMessage = function(ttl,msg) {
	$(".dialog-container").dialog({title:ttl});
	$(".dialog-container").dialog("open");
	$(".dialog-container").html(msg);
};