var k = 290;
$(window).load(function(){
	var h = $(window).height();
	console.log(h);
	$(".h_resize").css("max-height", h-k);
});
$(window).resize(function(){
	var h = $(window).height();
	console.log(h);
	$(".h_resize").css("max-height", h-k);
});	