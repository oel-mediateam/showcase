/* global console */
	
$(document).ready(function(){

	$("header nav ul li a").onMenuSelect();
	
});

$.fn.onMenuSelect = function() {
	this.on("click", function() {
		$(this.parentNode.parentNode.childNodes).each(function() {
			$(this).removeClass("active");
		});
		
		$(this.parentNode).addClass("active");

	});
};