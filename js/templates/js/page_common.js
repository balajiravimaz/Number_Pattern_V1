var storeCurrentAudioTime = 0;
var _audioRequired = false;
var _videoRequired = false;
var _pageAudioSync = true;
var _forceNavigation = false;
var _popupAudio = false;
var _reloadRequired = true;
var _visitedPopup = [];
var _videoId = null;
var _audioId = null;

var _popupWidth = 300;
var _padding = 48;
var _linkPopupOpened = false;

// -------- Assign audio for play ------------
function assignAudio(_audioSRC, _ccIndx, _audioSync, _restriction, videoId, _popAudio, _reloadRequ) {
    var ccObj = _pageData.ccText[_ccIndx];
    var transcriptObj = _pageData.transcriptText[_ccIndx];
    loadMedia(_audioSRC, ccObj, _audioSync, _restriction, transcriptObj, videoId, _popAudio, _reloadRequ);
	console.log("trans:>:",transcriptObj)
}

// -------- open url functions ------------
function openLink(_url) {
    _playbackView.pauseAudio();
    var win = window.open(_url, '_blank');
    win.focus();
}



// -------- Set and Remove Focus ------------
function setFocus(_elem, _tabindx) {
    if (_tabindx != undefined)
        _elem.attr('tabindex', _tabindx).focus();
    else
        _elem.focus();
}

function removeFocus(_elem) {
    _elem.blur();
}


// -------- Set and Remove Button Disabled ------------
function setButtonDisabled(_elem) {
    _elem.attr("disabled", "disabled");
}

function removeButtonDisabled(_elem) {
    _elem.removeAttr("disabled");
}

// -------- popup audio functions ------------
function enablePopupAudio(_dataIndx) {
    pauseMainAudio();
    updatePopupAudio(_dataIndx);
}

function pauseMainAudio() {
    storeCurrentAudioTime = currentMedia.currentTime;
    currentMedia.pause();
    currentMedia.removeEventListener('timeupdate', checkTimeUpdate);
}

function resetMainAudio(_data) {
    if (_popTweenTimeline) {
        _popTweenTimeline.kill();
    }
    _popTweenTimeline = null;

    currentPopupMedia.pause();
    _popupAudio = false;
    _reloadRequired = false;

    currentMedia.currentTime = storeCurrentAudioTime - 0.2;

    if (!forceAudioPause) {
        popupMedia = false;
        pausePlay = 'play';
        playBack.checkPlayPause();
    }

    //assignAudio(_data.mainAudio.audioSRC, _data.mainAudio.audioIndex, _pageAudioSync, _forceNavigation, _videoId, _popupAudio, _reloadRequired);
    initPageAnimations();
}

function updatePopupAudio(_data) {
    _checkAudioFlag = false;
    _popupAudio = true;
    assignAudio(_data.audio.audioSRC, _data.audio.audioIndex, _pageAudioSync, _forceNavigation, _videoId, _popupAudio);
    currentPopupMedia.addEventListener('timeupdate', checkTimeUpdate);
}

//--------------- openHyperlink -----------------
var curBtn = null;

function openHyperlink(e) {
    var _data = e.data.param;
    curBtn = $(this);
    curBtn.addClass('visited');

    var _linkData = curBtn.data('type');
    //var _indx = $(".hyperlinks").index(this);
    var _indx = parseInt(curBtn.data('indx'));

    switch (_linkData) {
        case 'link':
            openLink(_data.hyperlinks[_indx].url);
            break;
        case 'popup':
            generatePopup(_data.hyperlinks[_indx], curBtn);
            break;
    }
}

function updateLinkPopup(_data, _indx) {
    var popupCont = _data.hyperlinks[_indx];
    _popupWidth = popupCont.popupWidth;
    _linkPopupOpened = true;

    $('.popup_container').empty();

    //--------------- adding popup content elements ---------------
    $('.popup_container').append('<div class="popup_holder" tabindex="0"><div class="popup_header"><div class="popup_title"><p>' + popupCont.heading + '</p></div></div><div class="scrollbar_outer"><div class="popup_section"></div></div><button type="button" class="popup_close"></button></div>');

    //--------------- adding popup content ---------------
    for (var i = 0; i < popupCont.text.length; i++) {
        $(".popup_section").append("<p>" + popupCont.text[i] + "</p>");
        $(".popup_section p").find('a').addClass('hyperlinks').attr('href', 'javascript:void(null);');
    }

    //------ list items ------
    if (popupCont.listItem.type != '') {
        if (popupCont.listItem.type == 'number') {
            $(".popup_section").append("<ul class='list_items_number list'></ul>");
        } else {
            $(".popup_section").append("<ul class='list_items list'></ul>");
        }

        for (var j = 0; j < popupCont.listItem.content.length; j++) {
            $(".popup_section").find('.list').append("<li><p>" + popupCont.listItem.content[j] + "</p></li>");
            $(".popup_section .list li").find('a').addClass('hyperlinks').attr('href', 'javascript:void(null);');
        }
    }

    //--------------- adding popup close icon ---------------
    $(".popup_close").css({
        'background-image': 'url(' + _data.popupClose.imageSRC + ')'
    });

    $(".popup_close").attr('title', _data.popupClose.title);


    //--------------- set popup position ---------------
    $('.popup_container').show().css({
        'opacity': 0
    });

    updatePopupPosition();
    enablePopupAudio(popupCont);
    $('.popup_container').show().stop().animate({
        'opacity': 1
    }, 400, function() {
        setFocus($(".popup_holder"), 0);
        $(".popup_close").off('click mouseenter mouseleave').on('click mouseenter mouseleave', {
            param: _data
        }, closeHyperlinkPopup);
        $(".hyperlinks").off('click').on('click', {
            param: _data
        }, openHyperlink);
    });


    disableScrollBar($(".scroll_holder"), true);
    enableScrollBar($(".scrollbar_outer"), "dark");
}


//--------------- close popup ---------------
function closeHyperlinkPopup(e) {
    switch (e.type) {
        case 'click':
            var _data = e.data.param;
            var className = $(this).attr('class');

            $('.popup_container').stop().animate({
                'opacity': 0
            }, 300, function() {
                $('.popup_container').hide();
                setTimeout(function() {
                    resetMainAudio(_data);
                }, 100);
                disableScrollBar($(".scroll_holder"), false);
                setFocus(curBtn);
                _linkPopupOpened = false;
            });
            break;
        case 'mouseenter':

            break;
        case 'mouseleave':

            break;
    }
}


//----------- update popup link size and position --------------
function updatePopupPosition() {
    var popHolderW;
    var popHolderH;
    $(".scrollbar_outer").css({
        'height': 'auto'
    });

    if ($('.popup_container').outerWidth() < 766) {
        $(".popup_holder").css({
            'width': '80%',
            'margin-left': '-40%'
        });
    } else {
        $(".popup_holder").css({
            'width': _popupWidth,
            'margin-left': (-1 * (_popupWidth / 2))
        });
    }

    setTimeout(function() {
        var popHeaderH = $(".popup_header").outerHeight();
        var popSectionH = $(".popup_section").outerHeight();
        popHolderH = $(".popup_holder").outerHeight();

        if ((popHeaderH + popSectionH + _padding) > popHolderH) {
            $(".scrollbar_outer").css({
                'height': popHolderH - (popHeaderH + _padding)
            });
        } else {
            $(".scrollbar_outer").css({
                'height': popSectionH
            });
        }

        popHolderH = $(".popup_holder").outerHeight();
        $('.popup_holder').css({
            'margin-top': (-1 * (popHolderH / 2))
        });
    }, 50);
}

// -------- resize page details ------------
$(window).resize(function() {
    setTimeout(function() {
        if (_linkPopupOpened)
            updatePopupPosition();
    }, 50);
});

// -------- check page complition ------------
function checkPageCompletion() {
    var visitCnt = 0;

    for (var i = 0; i < _visitedPopup.length; i++) {
        if (_visitedPopup[i] == 1)
            visitCnt++;
    }

    if (visitCnt == _visitedPopup.length)
        pageVisited();
}