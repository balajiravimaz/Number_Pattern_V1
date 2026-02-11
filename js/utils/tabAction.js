function setNavigationTabIndex() {
	//
}
function removeNavigationTabIndex() {
	//
}
function setNavigationContentTabIndex() {
	//
	var contentFocusable = document.getElementById('f_pageLoader');
	var content =  contentFocusable.querySelectorAll('button, [tabindex]:not([tabindex="0"])');
	for(let i=0; i<content.length; i++) {
		$(content[i]).attr('tabindex', 0);
	}
}
function removeNavigationContentTabIndex() {
	//
	var contentFocusable = document.getElementById('f_pageLoader');
	var content =  contentFocusable.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
	for(let i=0; i<content.length; i++) {		
		$(content[i]).attr('tabindex', -1);		
	}
}
function setNavigationAllTabIndex() {
    /*$("#f_homeBtn").attr("tabIndex", 1);
    $("#f_gadgetBtn").attr("tabIndex", 2);
    $("#f_homeBtn_bottom").attr("tabIndex", 1);
    $("#f_gadgetBtn_bottom").attr("tabIndex", 2);
    $("#f_menuBtn").attr("tabIndex", 3);
    $("#f_helpBtn").attr("tabIndex", 4);
    $("#f_transcriptBtn").attr("tabIndex", 5);
    $("#f_ccBtn").attr("tabIndex", 6);
    $("#f_glossaryBtn").attr("tabIndex", 7);
    $("#f_resourceBtn").attr("tabIndex", 8);

    $("#f_volumeBtn").attr("tabIndex", 9);
    $("#f_backBtn").attr("tabIndex", 11);
    $("#f_mediaBtn").attr("tabIndex", 12);
    $("#f_nextBtn").attr("tabIndex", 13);*/
	var headerFocusable = document.getElementById('f_header');
	var header =  headerFocusable.querySelectorAll('button, [tabindex]:not([tabindex="0"])');
	for(let i=0; i<header.length; i++) {		
		$(header[i]).attr('tabindex', 0);		
	}
	//
	var headerFocusable = document.getElementById('f_rightMenu');
	var header =  headerFocusable.querySelectorAll('button, [tabindex]:not([tabindex="0"])');
	for(let i=0; i<header.length; i++) {		
		$(header[i]).attr('tabindex', 0);		
	}
	//
	var footerFocusable = document.getElementById('f_footer');
	var footer =  footerFocusable.querySelectorAll('button, [tabindex]:not([tabindex="0"])');
	for(let i=0; i<footer.length; i++) {		
		$(footer[i]).attr('tabindex', 0);		
	}
	//
	var contentFocusable = document.getElementById('f_pageLoader');
	var content =  contentFocusable.querySelectorAll('button, [tabindex]:not([tabindex="0"])');
	for(let i=0; i<content.length; i++) {
		$(content[i]).attr('tabindex', 0);
	}
}

function removeNavigationAllTabIndex() {
    //$(".f_navBtn").attr("tabIndex", -1);
	//#f_content, f_header, f_footer
	var headerFocusable = document.getElementById('f_header');
	var header =  headerFocusable.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
	for(let i=0; i<header.length; i++) {		
		$(header[i]).attr('tabindex', -1);		
	}
	var headerFocusable = document.getElementById('f_rightMenu');
	var header =  headerFocusable.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
	for(let i=0; i<header.length; i++) {		
		$(header[i]).attr('tabindex', -1);		
	}
	//
	var footerFocusable = document.getElementById('f_footer');
	var footer =  footerFocusable.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
	for(let i=0; i<footer.length; i++) {		
		$(footer[i]).attr('tabindex', -1);		
	}
	//
	var contentFocusable = document.getElementById('f_pageLoader');
	var content =  contentFocusable.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
	for(let i=0; i<content.length; i++) {		
		$(content[i]).attr('tabindex', -1);		
	}
}

function setMenuTabIndex(e) {
    removeNavigationTabIndex();
    /*var tabLength = $(".f_toggleMenuBtn").length;
    var pageLength = [];

    for (var i = 0; i < tabLength; i++) {
        pageLength[i] = $("#f_accordContainer_" + i).find('.f_accordContainer').find('').length;
    }
    console.log("tabLength", tabLength, pageLength)*/
}