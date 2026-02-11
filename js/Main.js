var isTab = false;
var isMobile = false;
var isIpad = false;
var isDevice = false;
var isLandscapeRequired = true;
var isLandscape = false;
var isChrome = false;
var isIE = false;

var controller;

var windowDim = {
    w: 0,
    h: 0
}
var mobileLandscape = false;


$(document).ready(function () {
    init();
})

var controller;

function init() {
    isDevice = device.isDevice();
    isMobile = device.MobileDevice();
    isIpad = device.iPad();
    isChrome = device.Chrome();
    isIE = device.IE();

    controller = new Controller();
    checkResizePopup();
    winResize();

    $(window).on("wheel mousewheel", function (e) {
        //e.preventDefault();
    });

    $("#f_gadgetPopup").removeClass('gadget_top gadget_bottom');
    $("#f_gadgetPatch").removeClass('gadget_patch_top gadget_patch_bottom');
    setTimeout(function () {
        if (isDevice && !isIpad) {
            $("#f_gadgetPopup").addClass('gadget_top');
            $("#f_progressBarContainer").show();
            $(".slide__audio").hide();
        } else {
            $("#f_gadgetPopup").addClass('gadget_top');
            $("#f_progressBarContainer").show();
            $(".slide__audio").hide();
        }
    }, 50);

    $("#f_start_course").focus();
}


$(window).on('resize', handleDesktopLayout);
$(document).ready(handleDesktopLayout);

function handleDesktopLayout() {
    var windowW = window.innerWidth;

    console.log("Testing", {
        width: window.innerWidth,
        pointer: matchMedia("(pointer: coarse)").matches,
        hover: matchMedia("(hover: none)").matches,
        landscape: matchMedia("(orientation: landscape)").matches,
    })

    if (window.matchMedia('(pointer: fine)').matches && window.innerWidth > 1366) {
        // Desktop styles
        $('html').css({
            width: '1300px',
            zoom: windowW / 1300
        });

        // Override inline styles with !important
        $('#f_wrapper').css({
            width: '1300px !important',
            height: $("#f_content").height() + 'px !important'
        });

        $(".pageLoaderParallax").css('height', $("#f_content").height() + "px");

    } else {
        // Reset for tablet/mobile
        $('html').css({ width: '', zoom: '' });
        $('#f_wrapper').css({ width: '', height: '' });
        $(".pageLoaderParallax").css('height', '');
        winResize();
    }
}


function winResize() {
    var zoomW = window.innerWidth / $('html').width();
    $('html').css('zoom', zoomW);
    setTimeout(function () {
        windowDim.w = window.innerWidth;
        windowDim.h = window.innerHeight;
        updateCSS();
    }, 50)
}




function updateCSS() {
    var windowW = window.innerWidth;
    var windowH = window.innerHeight;
    var tempHeading = $("#int_heading_patch").outerWidth();

    if (isDevice) {
        $('#f_content').css({
            'min-height': windowH - 100
        });

        $('#f_wrapper').css({
            'width': windowW,
            'height': windowH
        });

        if (windowH > windowW) {
            mobileLandscape = false;
        } else {
            mobileLandscape = true;
        }
    }

    if (!isLandscapeRequired) {
        if (mobileLandscape && isMobile) {
            $("#f_orientationInfo").show();
            $("#mobileContainer").show();
            if (_hasAudio == 'true') {
                _playbackView.pauseMedia();
            }
        } else {
            $("#f_orientationInfo").hide();
            $("#mobileContainer").hide();
            if (_hasAudio == 'true') {
                _playbackView.checkPlayPause();
            }
        }
    }

    checkResizePopup();

}

function checkResizePopup() {

    var conH = parseInt($('#f_wrapper').outerHeight());


    $('#f_helpContent').css({
        'width': '100%',
        'height': 'calc(100% - 40px)',
        'padding-right': '0px'
    });

    var helpHeight = $('#f_helpContent').outerHeight(true);
    $('.helpTrack').css({
        'height': helpHeight
    });

    $('#f_glossaryCol1').css({
        'width': '40px',
        'height': '361px',
        'padding-right': '0px'
    })
    $('#f_glossaryCol2').css({
        'width': '220px',
        'height': '361px',
        'padding-right': '0px'
    })
    /*   $('#f_glossaryCol3').css({
          'width': '440px',
          'height': '361px',
          'padding-right': '0px'
      }); */
}

function stopMainScroll() {
    $(document).off('mouseup').on('mouseup', function (e) {
        $(document).focus()
    })

    $(document).off('touchend').on('touchend', function (e) {
        //$(document).focus()
    })

    $(document).off('mousemove').on('mousemove', function (e) {
        e.preventDefault()
    })

    $(document).off('touchmove').on('touchmove', function (e) {
        //e.preventDefault()
    })
}

// window.addEventListener('resize', winResize);

// $('html').css('width', "1300px");

// var zoomW = window.innerWidth / $('html').width();
// $('html').css('zoom', zoomW);

// $(".pageLoaderParallax").css('height', $("#f_content").height() + "px");

