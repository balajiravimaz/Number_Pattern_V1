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
        updateHyperlinkPopup(_data, _indx);
        break;
    }
}

function updateHyperlinkPopup(_data, _indx) {
    var popupCont = _data.hyperlinks[_indx];
    _popupWidth = popupCont.popupWidth;

    $(".scroll_holder").getNiceScroll().remove();

    $('.popup_container').empty();

    //--------------- adding popup content elements ---------------
    $('.popup_container').append('<div class="popup_holder" tabindex="0"><div class="popup_header"><div class="popup_title"><p>' + popupCont.heading + '</p></div></div><div class="scrollbar_outer"><div class="popup_section"></div></div><button type="button" class="popup_close" title="Close Button"></button></div>');

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


    //--------------- set popup position ---------------
    $('.popup_container').show().css({
        'opacity': 0
    });

    updatePopupPosition();
    enablePopupAudio(popupCont);
    $('.popup_container').show().stop().animate({
        'opacity': 1
    }, 400, function () {
        setFocus($(".popup_holder"), 0);
        $(".popup_close").off('click mouseenter mouseleave').on('click mouseenter mouseleave', {
            param: _data
        }, closeHyperlinkPopup);
        $(".hyperlinks").off('click').on('click', {
            param: _data
        }, openHyperlink);
    });
}


//--------------- close popup ---------------
function closeHyperlinkPopup(e) {
    switch (e.type) {
    case 'click':
        var _data = e.data.param;
        var className = $(this).attr('class');

        $('.popup_container').stop().animate({
            'opacity': 0
        }, 300, function () {
            $('.popup_container').hide();
            setTimeout(function () {
                resetMainAudio(_data);
            }, 100);
            enableScrollBar(".scroll_holder", 'dark');
            setFocus(curBtn);
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
    $(".scrollbar_outer").getNiceScroll().remove();

    $(".scrollbar_outer").css({
        'height': 'auto'
    });

    setTimeout(function () {
        var popHolderW;
        var popHolderH;

        if ($('.popup_container').outerWidth() < 768) {
            $(".popup_holder").css({
                'width': '80%',
                'margin-left': '-40%'
            });
            popHolderH = $(".popup_holder").outerHeight();

        } else {
            popHolderW = $(".popup_holder").outerWidth();
            popHolderH = $(".popup_holder").outerHeight();
        }

        setTimeout(function () {
            var popHeaderH = $(".popup_header").outerHeight();
            var popSecH = $(".popup_section").outerHeight();

            console.log(popSecH, popHeaderH)

            $(".scrollbar_outer").css({
                'height': (popSecH + popHeaderH)
            });

            console.log(_popupWidth)

            $('.popup_holder').css({
                'margin-left': (-1 * (_popupWidth / 2)),
                'margin-top': (-1 * (popHolderH / 2))
            });

            enableScrollBar(".scrollbar_outer", 'dark');
        }, 50)
    }, 50);
}

// -------- resize page details ------------
window.onresize = function () {
    setTimeout(function () {
        updatePopupPosition();
    }, 50);
};