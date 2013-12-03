/* global console */

// GLOBAL FANCYBOX CONFIG VARIABLES
var FB_PADDING = 0, FB_TOP_RATIO = 0.25, FB_CLOSE_CLICK = false, FB_OL_BG = "rgba(0,0,0,0.9)";

// WHEN THE PAGE IS LOADED
$(document).ready(function(){
	
	$(this).readXML();
	
	$("div.mobile-nav").on("click",function(){
		$("nav.mobile-nav").slideToggle("slow");
	});
	
	$(".dialog-container").dialog({
		modal:true,
		minWidth: 400,
		minHeight: 150,
		autoOpen: false,
		resizable: false,
		draggable: false,
		buttons: {
			Ok: function() {
				$(this).dialog("close");
			}
		}
	});
	
	$(window).onWindowResize();
	$("nav.mobile-nav").html($("header nav").html());
	$("nav.mobile-nav ul li a").onMenuSelect();
	
});

// FUNCTIONS

$.fn.readXML = function() {
	
	// AJAX setup
    $.ajaxSetup({
        url: 'assets/showcase.xml',
        dataType: 'xml',
        accepts: 'xml',
        content: 'xml',
        contentType: 'xml; charset="utf-8"',
        cache: false
    });
    
    // Encoding and overiding XML data via ajax requesting
    $.ajax({
        type: 'get',
        beforeSend: function (xhr) {
            xhr.overrideMimeType("xml; charset=utf-8");
            xhr.setRequestHeader("Accept", "text/xml");
        },
        success: function (xml) {
            $(this).setupXML(xml);
        },
        error: function (xhr, exception) {
            $(this).displayError(xhr.status, exception);
        }
    });
	
};

$.fn.setupXML = function(xml) {
	var CATEGORY = $(xml).find("category").find("name");
	var ITEM = $(xml).find("item");
	
	if (CATEGORY.length) {
		$("header nav ul").html("<li class=\"active\"><a data-cat=\"0\" href=\"#all\">All</a></li>");
		CATEGORY.each(function(){
			$("header nav ul").append("<li><a data-cat=\""+$(this).attr("id")+"\" href=\"javascript:void(0)\">"+$(this).text()+"</a></li>");
		});
		
		$("header nav ul li a").onMenuSelect();
		
	} else {
		$("header nav ul").hide();
		$("div.mobile-nav").hide();
	}
	
	if (ITEM.length) {
		ITEM.each(function(){
			var type = $(this).attr("type");
			var cat = $(this).attr("category");
			var title1 = $(this).find("title1").text();
			var title2 = $(this).find("title2").text();
			var subtitle = $(this).find("subtitle").text();
			var thumb = $(this).find("thumb").text();
			var source = $(this).find("source").text();
			
			$(".showcase-container").append("<div class=\"grid " + type + "\" data-cat=\"" + cat + "\"><img src=\"assets/thumbs/" + thumb + "\" alt=\"" + title1 + "<br />" + title2 + "\" data-subtitle=\"" + subtitle + "\" data-src=\"" + source + "\" /><div class=\"overlay\"><div class=\"title\">" + title1 + "<br />" + title2 + "</div><div class=\"icon\"><span class=\"icon-"+type+"\"></span></div></div></div>");
			
		});
		
		$(".showcase-container .grid").onGridHover();
		$(".showcase-container .grid").onGridClick();
		
	}
	
};

$.fn.displayError = function(status, exception) {
	var statusMsg, exceptionMsg;

    // assign status
    if (status === 0) {
        statusMsg = 'Error 0 - No network connection.';
    } else if (status === 404) {
        statusMsg = 'Error 404 - Requested XML not found.';
    } else if (status === 406) {
        statusMsg = 'Error 406 - Not acceptable error.';
    } else if (status === 500) {
        statusMsg = 'Error 500 - Internal Server Error.';
    } else {
        statusMsg = 'Uncaught error';
    }

    // assign error
    if (exception === 'parsererror') {
        exceptionMsg = 'Requested XML parse failed.';
    } else if (exception === 'timeout') {
        exceptionMsg = 'Time out error.';
    } else if (exception === 'abort') {
        exceptionMsg = 'Ajax request aborted.';
    } else if (exception === "error") {
        exceptionMsg = 'HTTP / URL Error.';
    } else {
        exceptionMsg = (status.responseText);
    }

    $(this).showMessage(statusMsg,exceptionMsg);
};

$.fn.onWindowResize = function() {
	this.resize(function() {
		var winWidth = $(this).innerWidth() + 15;
		
		$("nav.mobile-nav").html($("header nav").html());
		
		if (winWidth >= 720) {
			$("nav.mobile-nav").slideUp();
		} else {
			$("nav.mobile-nav ul li a").onMenuSelect();
		}
		
	});
};

$.fn.onMenuSelect = function() {
	this.on("click", function() {
	
		var catId = $(this);
	
		$(this.parentNode.parentNode.childNodes).each(function() {
			$(this).removeClass("active");
		});
		
		$(this.parentNode).addClass("active");
		
		if (catId.attr("data-cat") !== "0") {
			$(".grid").each(function() {
				if ($(this).attr("data-cat") !== catId.attr("data-cat")) {
					$(this).fadeOut();
				} else {
					$(this).delay(500).fadeIn()
				}
			});
		} else {
			$(".grid").each(function() {
				$(this).fadeIn();
			});
		}
		
		if ($(this.parentNode.parentNode.parentNode).hasClass("mobile-nav")) {
			$("nav.mobile-nav").slideToggle(1000,function() {
				$("header nav").html($("nav.mobile-nav").html());
				$("header nav ul li a").onMenuSelect();
			});
		}
		
	});
	
	return false;
	
};

$.fn.onGridHover = function() {
	this.hover(function() {
		//$(this).find(".overlay").hide().fadeIn(500);
		$(this).toggleClass("active").next().stop(true,true);
	});
};

$.fn.onGridClick = function() {
	this.click(function() {
	
		var ttl = $(this).find("img").attr("alt");
		var sbttl = $(this).find("img").attr("data-subtitle");
		var vsrc = $(this).find("img").attr("data-src");
		
		if (vsrc.length) {
			if($(this).hasClass("video")||$(this).hasClass("animation")) {
				$(this).getVideo(ttl,sbttl,vsrc);
			} else if ($(this).hasClass("sound")||$(this).hasClass("music")) {
				$(this).getAudio(ttl,sbttl,vsrc);
			} else if ($(this).hasClass("print")||$(this).hasClass("infographic")||$(this).hasClass("illustration")||$(this).hasClass("mobile")) {
				$(this).getImage(ttl,sbttl,vsrc);
			} else if ($(this).hasClass("web")) {
				$(this).getWeb(ttl,sbttl,vsrc);
			} else if ($(this).hasClass("document")) {
				$(this).getDoc(ttl,sbttl,vsrc);
			} else if ($(this).hasClass("presentation")) {
				$(this).getPresentation(ttl,sbttl,vsrc);
			}
		} else {
			$(this).showMessage("No Source Found!","No source was found or specified for this item. Please double check the XML for "+ttl+".");
		}
		
	});
};

$.fn.getVideo = function(ttl,sbttl,src) {

	var w = 640, h = 360;
	
	if (src.indexOf("mediastreamer") >= 0) {
		h = 410;
	}
	
	$.fancybox({
		href:src,
		title:ttl,
		padding: FB_PADDING,
		topRatio: FB_TOP_RATIO,
		width: w,
		height: h,
		minHeight: h,
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
			this.inner.before("<h2>"+this.title+"</h2><h3>"+sbttl+"</h3>");
		}
	});
};

$.fn.getAudio = function(ttl,sbttl,src) {

	var w = 390, h = 275;
	
	$.fancybox({
		href:src,
		title:ttl,
		padding: FB_PADDING,
		topRatio: FB_TOP_RATIO,
		width: w,
		height: h,
		type: "iframe",
		helpers: {
			title: null,
			overlay: {
				closeClick: FB_CLOSE_CLICK,
				css: {"background":FB_OL_BG}
			}
		},
		afterLoad: function() {
			this.inner.before("<h2>"+this.title+"</h2><h3>"+sbttl+"</h3>");
		}
	});
};

$.fn.getImage = function(ttl,sbttl,src) {
	
	var fitView = true;
	
	if ($(this).hasClass("infographic")) {
		fitView = false;
	}
	
	$.fancybox({
		href:src,
		title:ttl,
		fitToView: fitView,
		padding: FB_PADDING,
		topRatio: FB_TOP_RATIO,
		helpers: {
			title: null,
			overlay: {
				closeClick: FB_CLOSE_CLICK,
				css: {"background":FB_OL_BG}
			}
		},
		afterLoad: function() {
			this.inner.before("<h2>"+this.title+"</h2><h3>"+sbttl+"</h3>");
		}
	});
};

$.fn.getWeb = function(ttl,sbttl,src) {
	
	$.fancybox({
		href:src,
		title:ttl,
		type: "iframe",
		iframe: {
			scrolling: "auto"
		},
		padding: FB_PADDING,
		topRatio: FB_TOP_RATIO,
		helpers: {
			title: null,
			overlay: {
				closeClick: FB_CLOSE_CLICK,
				css: {"background":FB_OL_BG}
			}
		},
		afterLoad: function() {
			this.inner.before("<h2>"+this.title+"</h2><h3>"+sbttl+"</h3>");
		}
	});
};

$.fn.getDoc = function(ttl,sbttl,src) {
	
	$.fancybox({
		href:src,
		title:ttl,
		type: "iframe",
		iframe: {
			scrolling: "auto",
			preload:false
		},
		padding: FB_PADDING,
		topRatio: FB_TOP_RATIO,
		helpers: {
			title: null,
			overlay: {
				closeClick: FB_CLOSE_CLICK,
				css: {"background":FB_OL_BG}
			}
		},
		afterLoad: function() {
			this.inner.before("<h2>"+this.title+"</h2><h3>"+sbttl+"</h3>");
		}
	});
};

$.fn.getPresentation = function(ttl,sbttl,src) {
	
	$.fancybox({
		href:src,
		title:ttl,
		type: "iframe",
		width:900,
		height:680,
		padding: FB_PADDING,
		topRatio: FB_TOP_RATIO,
		helpers: {
			title: null,
			overlay: {
				closeClick: FB_CLOSE_CLICK,
				css: {"background":FB_OL_BG}
			}
		},
		afterLoad: function() {
			this.inner.before("<h2>"+this.title+"</h2><h3>"+sbttl+"</h3>");
		}
	});
};

$.fn.showMessage = function(ttl,msg) {
	$(".dialog-container").dialog({title:ttl});
	$(".dialog-container").dialog("open");
	$(".dialog-container").html(msg);
};