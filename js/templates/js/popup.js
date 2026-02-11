var _popupData = null;
var _pageCont = null;
var _curButton = null;
var _curZoomButton = null;
var _popupOpenFlag = false;
var _zoomPopupOpenFlag = false;
var lastFocusedElement = null;
var _popupAudioPlaying = false;
var _pageType = null;

function generatePopup(_data, _curBtn, _pageD, _audioRequired, _type, _pgType) {
    _popupData = _data;
    _curButton = _curBtn;
    _pageCont = _pageD;
    _popupOpenFlag = false;
    _pageType = _pgType;

    var listCnt = 0;

    $('.popup_container').empty();

    //--------------- adding popup content elements ---------------
    $('.popup_container').append('<div class="popup_holder"><div class="popup_header"><div class="popup_title"><p>' + _popupData.heading + '</p></div></div><div class="scrollbar_outer"><div class="popup_section"></div></div><button type="button" title="Close" class="popup_close"></button></div>');

    if (_type != 'popupImage') {
        //--------------- adding popup content ---------------
        for (var i = 0; i < _popupData.text.length; i++) {
            console.log(typeof _popupData.text[i] != "object" ,   "typeof _popupData.text[i] != object")
            if (typeof _popupData.text[i] != "object") {
                $(".popup_section").append("<p>" + _popupData.text[i] + "</p>");
                $(".popup_section p").find('a').addClass('hyperlinks').attr('href', 'javascript:void(null);');

                //----------create equation----------
                createEquation($(".popup_section p").eq(i), _pageCont);
            } else {
                console.log("listhitttt");
                //------ list items ------
                if (_popupData.text[i].listItem.type != '') {
                    listCnt++;
                    generateListItem(_popupData.text[i].listItem, $(".popup_section"), listCnt);
                }
            }
        }

        //---------- adding image inside popup --------------
        if (_popupData.images != undefined) {
            //-------- right side images adding -----------
            generateDecorativeImage(_popupData.images, $(".popup_section"));
        }


        //---------- adding table inside popup --------------
        if (_popupData.table != undefined) {
            generatePopupTable($(".popup_section"), _popupData.table, _pageCont);
        }
    } else {
        $(".popup_section").append("<img src='" + _popupData.image.imageSRC + "' alt='" + _popupData.image.altText + "' title='" + _popupData.image.title + "'>");
        $(".popup_section img").css({
            'width': _popupData.image.width
        })
    }

    setPopupWidth();


    $(".popup_holder").addClass("test");
    $(".popup_container").show();

    // Store the last focused element
    //lastFocusedElement = document.activeElement;    
    //console.log(lastFocusedElement)    

    setTimeout(function () {
        setTimeout(function () {
            //------ assign audio ------
            /*if (_type != 'popupImage')
                enablePopupAudio(_popupData, true, 1);
            else
                pauseMainAudio();*/


            updatePopupResize();

            $('.popup_container').stop().animate({
                'opacity': 1
            }, 400, function () {
                $(".popup_close").off('click mouseenter mouseleave').on('click mouseenter mouseleave', {
                    param: _pageCont
                }, hidePopup);

                $(".hyperlinks").off('click').on('click', {
                    param: _pageCont
                }, openHyperlink);
            });

            setFocus($(".popup_title"), 0);

            $(".f_courseTitle").attr("aria-hidden", "true");
        }, 100);
        destroyScrollBar($('.scroll_holder'));
    }, 300);
}

function setPopupWidth() {
    //--------------- popup size -----------------------
    if (!isMobile) {
        if (_popupData.width != undefined) {
            var mq = window.matchMedia('(min-width:767px) and (max-width: 992px)');
            //var mq = window.matchMedia('@media all and (min-width: 767px) and (max-width: 768px)');
            if (mq.matches) {
                var w = parseInt(_popupData.width);
                $(".popup_holder").css({
                    'width': (w + 20) + '%'
                });

            } else {
                $(".popup_holder").css({
                    'width': _popupData.width
                });
            }
        }
    }
}

function hidePopup(e) {
    switch (e.type) {
        case 'click':
            var _data = e.data.param;
            _popupOpenFlag = false;
            _popupAudioPlaying = false;

            $('.popup_container').stop().animate({
                'opacity': 0
            }, 300, function () {
                $('.popup_container').hide();
                setTimeout(function () {
                    //resetMainAudio(_data);
                    resetAudio(1);
                }, 100);

                enableScrollBar($('.scroll_holder'), "dark");
                destroyScrollBar($('.popup_container'));

                if (_pageType != undefined) {
                    switch (_pageType) {
                        case 'mcss':
                            enableMcssOptions();
                            break;

                        case 'mcms':
                            enableMcmsOptions();
                            break;
                    }
                }

                setTimeout(function () {
                    setFocus(_curButton, 0);
                }, 50)
            });


            break;
        case 'mouseenter':

            break;
        case 'mouseleave':

            break;
    }
}

function updatePopupResize() {
    var popContainerHeight = $(".popup_container").outerHeight();
    var popHolderHeight = $(".popup_holder").outerHeight();
    var popHolderWidth = $(".popup_holder").outerWidth();

    $(".popup_container").show().css({
        'display': '-webkit-box'
    });

    if (popHolderHeight > popContainerHeight) {
        enableScrollBar($('.popup_container'), "dark");
    } else {
        $(".popup_holder").removeClass("test");
    }

    if (popHolderHeight > popContainerHeight) {
        $(".popup_holder").css({
            'margin-top': '20px',
            'margin-bottom': '20px'
        });
    }
    _popupOpenFlag = true;
}


// -------- resize page details ------------
$(window).resize(function () {
    setTimeout(function () {
        if (_popupOpenFlag) {
            setPopupWidth();
            updatePopupResize();
        }

        if (_zoomPopupOpenFlag)
            updateZoomPopupResize();
    }, 100);
});

//-------------- zoom popup -------------------
function addZoomImage(_data, _indx) {
    $(".zoomIcon").css({
        'background-image': 'url(' + _data.zoomPopup.zoomIcon.imageSRC + ')'
    });
}

function generateZoomPopup(e) {
    var _imgCont = e.data.param;
    console.log("_imgCont", _imgCont)
    //var selected = $(this).index($(".zoomBtn"));
    _curZoomButton = $(this);

    var selected = parseInt($(this).attr('id').split('_')[1]);

    _zoomPopupOpenFlag = false;

    $(".f_page_content .zoom_container").detach();

    $(".f_page_content").append('<div class="zoom_container"></div>');

    //--------------- adding popup content elements ---------------
    $('.zoom_container').append('<div class="zoom_holder" tabindex="0"><div class="scrollbar_outer"><div class="zoom_section"></div></div></div>');

    $(".zoom_section").append("<img src='" + _imgCont[selected].zoomImage.imageSRC + "' alt='" + _imgCont[selected].zoomImage.altText + "' title='" + _imgCont[selected].zoomImage.title + "'>");

    setTimeout(function () {
        updateZoomPopupResize();

        setTimeout(function () {
            //------ show popup ------
            $('.zoom_container').stop().animate({
                'opacity': 1
            }, 400, function () {
                if (_imgCont[selected].zoomImage.level != undefined || mainAudioWithZoom) {
                    enablePopupAudio(_imgCont[selected].zoomImage, true, 1);
                } else {
                    enablePopupAudio(_imgCont[selected].zoomImage, true, 2);
                }



                $(".zoom_container").off('click mouseenter mouseleave').on('click mouseenter mouseleave', {
                    param: _imgCont,
                    param1: selected
                }, hideZoomPopup);

                $(document).off('keyup').on("keyup", function (e) {
                    if (e.keyCode === 27) {
                        hideZoomPopupWithESC(_imgCont, selected);
                    }
                });
            });
        }, 100);

        setFocus($(".zoom_section"), 0);
        destroyScrollBar($('.scroll_holder'));
    }, 400);
}

function hideZoomPopup(e) {
    switch (e.type) {
        case 'click':
            var _data = e.data.param;
            var selected = e.data.param1;

            _zoomPopupOpenFlag = false;
            _popupAudioPlaying = false;

            $(document).off('keyup');

            $('.zoom_container').stop().animate({
                'opacity': 0
            }, 300, function () {
                $('.zoom_container').hide();
                setTimeout(function () {
                    if (_data[selected].zoomImage.level != undefined || mainAudioWithZoom) {
                        resetAudio(1);
                    } else {
                        resetAudio(2);
                    }
                }, 100);

                enableScrollBar($('.scroll_holder'), "dark");
                destroyScrollBar($('.zoom_container'));

                setTimeout(function () {
                    setFocus(_curZoomButton, 0);
                }, 50)
            });
            break;
        case 'mouseenter':

            break;
        case 'mouseleave':

            break;
    }
}

function updateZoomPopupResize() {

    var zoomPopContainerHeight = $(".zoom_container").outerHeight();
    var zoomPopHolderHeight = $(".zoom_holder").outerHeight();
    $('.zoom_container').show().css({
        'display': '-webkit-box'
    })

    if (zoomPopHolderHeight > zoomPopContainerHeight) {
        //console.log('show Middle')
        enableScrollBar($('.zoom_container'), "dark");
    } else {
        //console.log('show center')
        $(".zoom_holder").removeClass("test");
    }

    //enableScrollBar($('.zoom_container'), "dark");

    if (zoomPopHolderHeight > zoomPopContainerHeight) {
        $(".zoom_holder").css({
            'margin-top': '20px',
            'margin-bottom': '20px'
        });
    }

    _zoomPopupOpenFlag = true;
}



function hideZoomPopupWithESC(data, _selected) {
    var _data = data;
    var selected = _selected;
    _zoomPopupOpenFlag = false;
    _popupAudioPlaying = false;

    $(document).off('keyup');

    $('.zoom_container').stop().animate({
        'opacity': 0
    }, 300, function () {
        $('.zoom_container').hide();
        setTimeout(function () {
            if (_data[selected].zoomImage.level != undefined || mainAudioWithZoom) {
                resetAudio(1);
            } else {
                resetAudio(2);
            }
        }, 100);

        enableScrollBar($('.scroll_holder'), "dark");
        destroyScrollBar($('.zoom_container'));

        setTimeout(function () {
            setFocus(_curZoomButton, 0);
        }, 50)
    });

}