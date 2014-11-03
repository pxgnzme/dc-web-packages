// version 1.01
var curPid,curPack,curPrice,totalPrice,GSTtotal,gst,resizeId;

var boltOns = []; 

$(document).ready(function() {

	//setupDragNDrop();

	setupMasonary();

	getPackages();

	placeholderFix();

	$(".datepicker").datepicker();

	var stickyTop = $('.sticky').offset().top;

	$(window).scroll(function(){ // scroll event

		var windowTop = $(window).scrollTop(); // returns number

		if (stickyTop < windowTop) {

	      $('.sticky').css({ position: 'fixed', top: 0 });

	    }

	    else {

	      $('.sticky').css('position','static');

	    }

	});

	/*$(document.body).on("sticky_kit:recalc",function(){

		$.logThis("recalc");

		//alert("recal");

	});*/

	//$('#droppable .pricing-table').css('height',getTotalHeight());

	$(window).on('resize',function(){

		clearTimeout(resizeId);
    	resizeId = setTimeout(doneResizing, 500);
    	//$(document.body).trigger("sticky_kit:recalc");

	});

	$('.submit1').on('click',function(e){

		e.preventDefault();

		gst =  0;
		GSTtotal = 0;

		$('.bolton_row').remove();

		$('.package_info_name').html("Package : "+curPack);
		$('.package_info_price').html("$"+formatPrice(curPrice));

		var boltOnHTML = "<tr class = 'bolton_row'><td class ='bolton_info_name'>*|BOLTON|*</td><td class = 'bolton_info_price'>$*|BOLTON-PRICE|*</td></tr>";


		var totalHTML = "<tr class = 'bolton_row totalrow'><td class ='bolton_info_name'><strong>GST</strong></td><td class = 'bolton_info_price'><strong>$*|GST|*</span></td></tr><tr class = 'bolton_row totalrow'><td class ='bolton_info_name'><strong>Total</strong></td><td class = 'bolton_info_price'><strong>$*|TOTAL-PRICE|*</span></td></tr>";

		if(boltOns.length > 0){

			$.each(boltOns,function(index,value){

				var targetHTML = boltOnHTML;

				var editedHTML = targetHTML.replace("*|BOLTON|*",value[0]);

				editedHTML = editedHTML.replace("*|BOLTON-PRICE|*",value[1].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));

				$('#info_table').append(editedHTML);

			});

		};

		$.logThis("total :> "+totalPrice);

		//var totalStr = totalPrice.toString();

		gst =  totalPrice* 0.125;

		GSTtotal = totalPrice + gst;

		var GSTtotalStr = (totalPrice + gst).toString();
		var gstStr =  gst.toString();

		totalHTML = totalHTML.replace("*|GST|*",gstStr.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));

		$('#info_table').append(totalHTML.replace("*|TOTAL-PRICE|*",GSTtotalStr.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")));

		$('#submit_modal').foundation('reveal', 'open');

	});

	$('.editbtn').on('click',function(){

		$('#site_modal').foundation('reveal', 'open');

	});

	$('#submit_2').on('click',function(){

		$.logThis("submit");

		var sendmail = true;

		$(".form_feild .error").hide();
		$('.form_feild').removeClass('error');

		$('.serial').each(function(value,index){

			//$.logThis("serial val :> "+$(this).attr("data-val")*100);

			if($(this).attr("data-val") > 0 ){

				$.logThis("id :> "+$(this).attr("data-id")+" :: type :> "+$(this).attr("type"));

				if($(this).attr("type") == "Email"){

					if(!validateEmail($(this).val())){

						sendmail = false;

						var targetID = $(this).attr("data-id");

						//$.logThis("target id :> "+targetID);

						$('#valid_'+targetID).addClass('error');

						$('#valid_'+targetID+" .error").css('display','block');


					}

				}else{

					if($(this).val().length == 0){

						sendmail = false;

						var targetID = $(this).attr("data-id");

						//$.logThis("target id :> "+targetID);

						$('#valid_'+targetID).addClass('error');

						$('#valid_'+targetID+" .error").css('display','block');

					}

				}

			}

		});

		if(sendmail){

			$.logThis("deadline :> "+$('#deadline').val());

			var GSTtotalStr = (totalPrice + gst).toString();
			var gstStr =  gst.toString();

			var curPriceStr = curPrice.toString();

			var pdfHTML = "Account manager: " + $('#name').val() + "<br>" + "Client : " + $('#client').val() + "<br>";

			pdfHTML = pdfHTML+"<b>Package:</b> " + curPack + ": $" + curPriceStr.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "<br><br>" ;

			$.each(boltOns,function(index,value){

				var boltonPriceStr = value[1].toString();

				pdfHTML = pdfHTML + value[0] + " : $" + boltonPriceStr.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "<br>";

			});

			pdfHTML = pdfHTML+"<br>";

			pdfHTML = pdfHTML + "GST : $" + gstStr.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "<br><br>";

			pdfHTML = pdfHTML + "<b>Total : $" + GSTtotalStr.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "</b>";

			$.post(
      
		      'includes/generate_pdf.php',

		      {

		        html:pdfHTML

		      },

		      function(data){
		      	
		      	if(data.status == "success"){

		      		$.logThis("filename :> "+data.file);
		      		$.logThis("jobid :> "+data.jobid);

		      		$.post(

		      			"includes/send_brief.php",

		      			{
		      				formdata:$('.serial').serialize(),
		      				pdf:data.file,
		      				jobid:data.jobid
		      			},

		      			function(data){

		      				$.logThis(data.status);

		      			},

		      			"json"

		      		);

		      	}else{

		      		$.logThis("ERROR");

		      	}

		      },

		      'json'
		    
		    );
		}

		$.logThis("sendmail :> "+sendmail);

	});


});

function doneResizing(){
    //whatever we want to do

    $.logThis("end resize");

    $('#packages_container').masonry( 'reload' );

    //$(document.body).trigger("sticky_kit:recalc");
}

function getPackages(){

	$('#packages_container').html("");

	$('#site_modal').foundation('reveal', 'close');

	$('.sitepanel .price').hide();
	$('.sitepanel .cta-button').hide();
	$('.bolton-panel').html("");
	$('.cur-boltons').hide();
	$('.editbtn').hide();
	$('.cur-package').html("<span class = 'remove-item remove-packages'>&#xf217;</span>").hide();

	boltOns = [];

	curPid = 0;
	curPack = '';
	curPrice = 0;

	$.post(

		'includes/get_packages.php',

		function(data){

			$('#packages_container').html(data);

			//$('#packages_container').fadeIn(500);

			setupDragNDrop();

			//sizePackages();

			$('#packages_container').masonry( 'reload' );

			

			$('.remove-packages').on('click',function(){

				$('.remove-packages').off('click');

				getPackages();

			});

		}

	);

};

function setupMasonary(){

	$.logThis("mason");

	var $container = $('#packages_container');
   //$container.imagesLoaded( function(){
      $container.masonry({
        itemSelector: '.draggable',
        isAnimated: true,
        isFitWidth: true,
        columnWidth: 250,
      });	
    //});
}

function sizePackages(){

	if($(window).width() >= 640){
		$('#packages_container .pricing-table').css('height',getTotalHeight());
	}

}

function setupDragNDrop(){

	$( ".draggable" ).draggable({ revert: "invalid", handle: ".title", cursor: "grabbing", stack: ".draggable"});

	/*$( "#droppable" ).droppable({ 

	accept: ".draggable", activeClass: "active-drop-class",hoverClass: "drop-hover",tolerance: "pointer", drop:function(event,ui){dropped(ui.draggable)}

	});*/

	$( ".sitepanel" ).droppable({ 

	accept: ".draggable", activeClass: "active-drop-class",hoverClass: "drop-hover",tolerance: "pointer", drop:function(event,ui){dropped(ui.draggable)}

	});

	//$('#drop').stick_in_parent();
	//$('#mobile_drop').stick_in_parent();

	//$('#drop').stickySidebar();
	//$('#mobile_drop').stickySidebar();

}

function dropped($item){

	if($item.attr('data-item') === "package"){

		curPid = $item.attr('data-pid');
		curPack = $item.attr('data-pname');
		curPrice = $item.attr('data-pprice');

		totalPrice = Number(curPrice);

		var priceReadOut = formatPrice(totalPrice);

		$('.cur-package').prepend("Package: "+curPack+" ").fadeIn(500);

		$('.sitepanel .price').html("$"+priceReadOut).fadeIn(500);

		$('.sitepanel .cta-button').fadeIn(500);

		$('.editbtn').css('display','block');

		$('.sitepanel .description').html("Drag and drop bolt-ons here");

		$('.sitepanel .pricing-table').css('height','auto');

		$('#packages_container').fadeOut(500,function(){

			launchBoltOns();

		});


	}else{

		var targetPrice = $item.attr('data-pprice');
		var targetName = $item.attr('data-pname');
		var targetHTML = $item.html();
		
		var targetId = $item.attr('id');
		var targetVal = $("#"+targetId+" select").val();

		if(typeof $item.attr('data-curprice') !== 'undefined'){

			if($item.attr('data-curprice') == ""){
			
				$.logThis("no cur price");

			}else{

				targetPrice = $item.attr('data-curprice');

			}

		};

		if($item.has(".dropdown").length > 0){

			$.logThis("target val :> "+targetVal);

			targetName = $("#"+targetId+" select option[value='"+targetVal+"']").text();

		}
			
		boltOns.push([targetName,targetPrice,$item.attr('data-pdes'),targetHTML,$item.attr('data-pprice')]);

		$item.remove();

		$('#packages_container').masonry( 'reload' );

		addBoltOns();

	}

};

function addBoltOns(){

	offRemoveBoltonListener();

	//$.logThis(boltOns.toSource());
	$('.bolton-panel').html("");

	//$.logThis(boltOns.length);

	totalPrice = Number(curPrice);

	if(boltOns.length > 0){

		$.logThis("number of boltons :> " + boltOns.length);

		$('.cur-boltons').show();

	}else{

		$('.cur-boltons').hide();

	}

	$.each(boltOns,function(index,value){

		$('.bolton-panel').append("<li class = 'bolton-item'>" + value[0] + " <span class = 'remove-item remove-bolton' data-pid='"+index+"'>&#xf217;</span></li>");

		totalPrice = totalPrice + Number(value[1]);

	});

	onRemoveBoltonListener();
	boltonDropdownListeners();

	$.logThis("total :> "+totalPrice)

	//var totalStr = totalPrice.toString();

	var printPrice = formatPrice(totalPrice);
	

	$('.sitepanel .price').html("$"+printPrice);

	

};

function onRemoveBoltonListener(){

	$('.remove-bolton').on('click',function(){

		var targetPid = $(this).attr('data-pid');
		var uniqId = getUniqueTime();

		//var priceStr = boltOns[targetPid][1].toString();

		var printPrice = "$"+formatPrice(boltOns[targetPid][1]);
		var orgPrintPrice = "$"+formatPrice(boltOns[targetPid][4]);

		$.logThis(boltOns[targetPid][3]);

		var boltonHTML = '<div class="columns draggable ui-bolton" data-item = "bolton" data-pname="Additional page templates" data-pprice="'+boltOns[targetPid][4]+'" data-pdes = "'+boltOns[targetPid][2]+'" id="'+uniqId+'" data-curprice = "">'+boltOns[targetPid][3]+'</div>';

		boltOns.splice(targetPid,1);

		$(this).parent().remove();

		$('#packages_container').append(boltonHTML);

		$('#'+uniqId+" .price").html(orgPrintPrice);

		$('#packages_container').masonry( 'reload' );

		setupDragNDrop();

		addBoltOns();



	});

};

function offRemoveBoltonListener(){

	$('.remove-bolton').off('click');

	boltonDropdownOff()

};

function launchBoltOns(){

	$('#packages_container').html("");

	$.post(

		'includes/get_bolt_ons.php',

		{pid:curPid},

		function(data){

			$('#packages_container').html(data);

			$('#packages_container').fadeIn(500);

			setupDragNDrop();
			//sizePackages();

			$('#packages_container').masonry( 'reload' );

			boltonDropdownListeners();


		}

	);


};

function boltonDropdownListeners(){

	$('.draggable select').on('change',function(){

		var parentId = $(this).parent().parent().parent().attr("id");

		var targetPrice = $('#'+parentId).attr("data-pprice");

		//var parentId = $(this).parent().parent().parent().attr("class");

		$.logThis("parent id :> "+parentId+" : price :> "+targetPrice);

		var thisPrice = Number(targetPrice) * Number($(this).val());

		$('#'+parentId+' .price').html("$"+formatPrice(thisPrice));

		$('#'+parentId).attr("data-curprice",thisPrice);

		//$.logThis("target price :> "+$(this).parent().parent().parent().attr("data-pprice"));

		//$.logThis($(this).parent().parent(".price").html());
		//$.logThis($(this).parent().parent(".price").attr("class"));


	});

}

function boltonDropdownOff(){

	$('.draggable select').off('change');

};

function getTotalHeight(){

	

	var totalHeight = 0;

	$('#packages_container .pricing-table').each(function(index){

		if($(this).height() > totalHeight){

			totalHeight = $(this).height();

		}

	});

	return totalHeight;

}

function formatPrice(value){

	var valueStr = value.toString();

	return valueStr.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

}


// =====================================================================================================

// validate email
function validateEmail(email){ 

	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; 
	
	if(!reg.test(email)){ 
	
		return false;
	
	}else{
		
		return true;
		
	} 

} 

//IE placehoder input fix
function placeholderFix(){

    //ie placeholder fix
    $.support.placeholder = ( 'placeholder' in document.createElement('input') );
	
	if($.support.placeholder){
		
		$('.form_label').hide();
	}

}

function getUniqueTime() {
	var time = new Date().getTime();
	while (time == new Date().getTime());
	return new Date().getTime();
}

// CONSOLE LOG FUNCTION ---------------------------------------------
// taken from http://www.nodans.com/index.cfm/2010/7/12/consolelog-throws-error-on-Internet-Explorer-IE

jQuery.logThis = function(text){
  
   if((window['console'] !== undefined)){
     
        console.log(text);
    
   }

}
