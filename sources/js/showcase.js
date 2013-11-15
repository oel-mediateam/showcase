/* global console */
	
$(document).ready(function(){
	$("header nav ul li a").onMenuSelect();
	$(".showcase-container .grid").onGridHover();
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