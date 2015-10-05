$(document).ready(function () {
  $('[data-toggle="offcanvas"]').click(function () {
/*	 $('.icon').attr("left","-3px");*/
	
    $('.row-offcanvas').toggleClass('active');
    
    
    $('.menu-label').toggle();
   $('.menu-icons').toggleClass('floating');
   $('body').animate({left: "0px"}, 200);
    
    
    
    	
  });
});