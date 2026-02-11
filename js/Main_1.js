
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

_landingPageAudio = document.getElementById("landingPageAudio");
_landingPageAudio.src = 'assets/audios/launch_page.mp3';
_landingPageAudio.load()
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

    //    imageLoader('startAnimation("f_mainLoaderImg")')
    controller = new Controller();
    checkResizePopup();
    //stopMainScroll();
    winResize();

    $(window).on("wheel mousewheel", function (e) {
        e.preventDefault();
    });

    $("#f_gadgetPopup").removeClass('gadget_top gadget_bottom');
    $("#f_gadgetPatch").removeClass('gadget_patch_top gadget_patch_bottom');
    setTimeout(function () {
        if (isDevice && !isIpad) {
            $("#f_gadgetPopup").addClass('gadget_top');
			$("#f_progressBarContainer").hide()
        } else {
            $("#f_gadgetPopup").addClass('gadget_top');
			$("#f_progressBarContainer").show()
        }
    }, 50);

    $("#f_start_course").focus();

    //alert(window.innerWidth + ' :: ' + window.innerHeight)
}

window.addEventListener('resize', winResize);

function winResize() {
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


    // $("#int_heading_patch").css({
    //     'margin-left': -1 * (tempHeading / 2)
    // });

    //console.log(windowW, windowH, windowDim.w, windowDim.h)

    //alert("isDevice: " + isDevice);
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
        /*
                var tW = $("#f_transcriptContainer").outerWidth();
                var tH = $("#f_transcriptContainer").outerHeight();
                var pos = $("#f_transcriptContainer").position();
                var tmp = 0;

                if (mobileLandscape) {
                    if ((pos.left + tW) >= 768) {
                        tmp = (windowW - tW);
                        $("#f_transcriptContainer").css({
                            'left': tmp + 'px'
                        });
                    }

                    if ((pos.top + tH) >= windowH) {
                        tmp = (windowH - tH);
                        $("#f_transcriptContainer").css({
                            'top': tmp + 'px'
                        });
                    }
                } else {
                    if ((pos.left + tW) >= windowW) {
                        tmp = (windowW - tW);
                        $("#f_transcriptContainer").css({
                            'left': tmp + 'px'
                        });
                    }

                    if ((pos.top + tH) > 670) {
                        tmp = (windowH - tH);
                        $("#f_transcriptContainer").css({
                            'top': tmp + 'px'
                        });
                    }
                }*/
    }

    if (!isLandscapeRequired) {
        if (mobileLandscape && isMobile) {
            $("#f_orientationInfo").show();
            if (_hasAudio == 'true') {
                _playbackView.pauseMedia();
            }
        } else {
            $("#f_orientationInfo").hide();
            if (_hasAudio == 'true') {
                _playbackView.checkPlayPause();
            }
        }
    }

    checkResizePopup();

}

function checkResizePopup() {
    /*var tmpH = parseInt($('#f_menuPopup').outerHeight()) - 3;
    $('#f_menuContent').css({
        'height': tmpH + 'px',
        'padding-right': '0px'
    })

    var menuHeight = $('#f_menuContent').outerHeight(true);
    $('.mneuTrack').css({
        'height': menuHeight
    });*/

    var conH = parseInt($('#f_wrapper').outerHeight());
    /*$('#f_pageLoader').css({
        'height': conH - 102
    });*/


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
    $('#f_glossaryCol3').css({
        'width': '440px',
        'height': '361px',
        'padding-right': '0px'
    });
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