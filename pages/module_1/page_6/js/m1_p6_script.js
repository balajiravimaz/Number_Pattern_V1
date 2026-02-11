
// ---------- setting start ---------------
var _preloadData, _pageData
var _pagePreloadArray = {
    image: 1,
    audio: -1,
    video: 1,
    data: -1
}; // item not availble please assign value 1.
var jsonSRC = 'pages/module_1/page_6/data/m1_p6_data.json?v=';
_pageAudioSync = true;
_forceNavigation = false;
_audioRequired = true;
_videoRequired = false;
storeCurrentAudioTime = 0;
_popupAudio = false;
_reloadRequired = true;

_checkAudioFlag = false;
_popTweenTimeline = null;
_tweenTimeline = null;
var _audioIndex = 0;
_videoId = null;
_audioId = null;
// ---------- setting end ---------------
var sectionCnt = 0;
var totalSection = 0;
var prevSectionCnt = -1;
var sectionTopPos = []
var playMainAudio = false;
var totalVisited = 0;
var _currentAudioIndex = 0;
var _visitedArr = [];
// ------------------ common function start ------------------------------------------------------------------------
$(document).ready(function () {
    _preloadData = new PagePreload()
    _preloadData.initObj(_pagePreloadArray, jsonSRC);
    _preloadData.addCustomEvent('ready', _pageLoaded);
})

function _pageLoaded() {
    _pageData = _preloadData.jsonData

    if (_audioRequired) {
        _audioId = _pageData.mainAudio.audioSRC;
        _audioIndex = _pageData.mainAudio.audioIndex;
    }

    if (_videoRequired)
        _videoId = "courseVideo";

    if (parent._strictNavigation) {
        // _forceNavigation = true;

    }
    appState.pageCount = 0;
    $('.introInfo').attr('data-popup', 'introPopup-3');
    $("#f_header, #f_courseTitle").css("background", "transparent");
    $(".home_btn").css({ backgroundImage: `url(${_pageData.sections[0].backBtnSrc})` });
    $(".home_btn").attr("data-tooltip", "Back");
    addSectionData();
    //assignAudio(_audioId, _audioIndex, _pageAudioSync, _forceNavigation, _videoId, _popupAudio, _reloadRequired);
    pagePreLoad();
    setTimeout(function () {
        initPageAnimations();
        showVisitedModule();
    }, 100)


}

// ------------------ common function end ------------------------------------------------------------------------


// -------- adding slide data ------------
function addSectionData() {
    totalSection = _pageData.sections.length;
    for (let n = 0; n < _pageData.sections.length; n++) {
        sectionCnt = n + 1;
        let titleText = '', insText = '';
        if (sectionCnt == 1) {


            /*     $("#section-" + sectionCnt).find(".content-holder").find(".col-left").find(".content").find(".content-bg").append('<div class="main-text"><h1 aria-label="' + removeTags(_pageData.sections[sectionCnt - 1].headerTitle) + '" tabindex="0">' + _pageData.sections[sectionCnt - 1].headerTitle + '</h1></div>'); */



            let textObject = '', listObject = '';
            if (_pageData.sections[sectionCnt - 1].insText != "") {
                insText += '<div class="ins-txt"><p aria-label="' + removeTags(_pageData.sections[sectionCnt - 1].insText) + '" tabindex="0">' + _pageData.sections[sectionCnt - 1].insText + '</p></div>';
            }
            if (_pageData.sections[sectionCnt - 1].content.text != "") {
                for (let i = 0; i < _pageData.sections[sectionCnt - 1].content.text.length; i++) {
                    if (Array.isArray(_pageData.sections[sectionCnt - 1].content.text[i])) {
                        listObject = '<ul>'
                        for (let j = 0; j < _pageData.sections[sectionCnt - 1].content.text[i].length; j++) {
                            listObject += '<li aria-label="' + removeTags(_pageData.sections[sectionCnt - 1].content.text[i][j]) + '" tabindex="0">' + _pageData.sections[sectionCnt - 1].content.text[i][j] + '</li>'
                        }
                        listObject += '</ul>'
                        textObject += listObject;
                        listObject = '';
                    } else {
                        textObject += '<p aria-label="' + removeTags(_pageData.sections[sectionCnt - 1].content.text[i]) + '" tabindex="0">' + _pageData.sections[sectionCnt - 1].content.text[i] + '</p>'
                    }
                }
            }


            let htmlObj = '', imgObj = '';

            htmlObj += textObject + insText;

            if (_pageData.sections[sectionCnt - 1].content.sectionArray != "") {
                for (let i = 0; i < _pageData.sections[sectionCnt - 1].content.sectionArray.length; i++) {
                    imgObj += '<div class="btn_holder"><button class="box" id="box-' + (_pageData.sections[sectionCnt - 1].content.sectionArray[i].sectionIndx) + '">'

                    imgObj += '</button><div class="btn_info i-txt-toolTip" id="info-' + (i + 1) + '" data-tooltip="Information"></div></div>'

                    // console.log( _pageData.sections[sectionCnt - 1].content.sectionArray[i].infoPopAudio, "pop audios");

                    $('#section-' + sectionCnt).find('.content-holder').append(
                        '<div class="infobtnPopup" id="infobtnPopup-' + (i + 1) + '"><div class="popup-content">' +
                        '<button class="infoPopAudio mute" onclick="togglePopAudio(this, \'' + _pageData.sections[sectionCnt - 1].content.sectionArray[i].infoAudio + '\')"></button>' +
                        '<button class="introPopclose" data-tooltip="Close" onClick="closeIntroPop(\'.infobtnPopup\')"></button>' +
                        '<img src="' + _pageData.sections[sectionCnt - 1].content.sectionArray[i].infoImg + '" alt="">' +
                        '</div></div>'
                    );
                }
            }

            $('#section-' + sectionCnt).find('.content-holder').find('.col-left').find('.content').find('.content-bg').append('<button class="goback-btn"></button><div class="body"><div class="dummypatch"></div><div class="image-container">' + imgObj + '</div></div>');


            let infoPop = `
            <div id="introPopup-3" class="introPopup">                
                <div class="popup-content">
                    <button class="introPopAudio mute" onclick="togglePopAudio(this, '${_pageData.sections[sectionCnt - 1].infoPopAudio}')"></button>
                    <button class="introPopclose" data-tooltip="Close" onclick="closePopup('introPopup-3')"></button>
                    <img src="${_pageData.sections[sectionCnt - 1].infoPopImage}" alt="">
                </div>
            </div>
            `;

            $('#section-' + sectionCnt).find('.content-holder').append(infoPop);

            $('.box').off('click mouseenter mouseleave').on('click mouseenter mouseleave', onClickHandler)
            $('.btn_info').off('click mouseenter mouseleave').on('click mouseenter mouseleave', onClickinfoHandler)

        }
        setCSS(sectionCnt);
        backButton = $('.goback-btn')

        backButton.off('click').on('click', selectOption);
        $('#section-' + sectionCnt)
            .find('.bg-img').append(`
            <video
                id="bgVideo"
                autoplay
                muted
                loop
                playsinline
                preload="auto"
            >
                <source src="${_pageData.bgVid.videoSRC}" type="video/mp4">
            </video>
        `);
    }

    //showVisitedModule();
    if ((bookMarkArray[0] == '1') || (bookMarkArray[0] == 1)) {
        _visitedArr = bookMarkArray;
    }
}


function selectOption() {
    pageVisited();
    _controller.updateViewNow();
    window.location.reload(true);
}

function setCSS($sectionCnt) {
    _wrapperWidth = $('#f_wrapper').outerWidth()
    _wrapperHeight = $('#f_wrapper').outerHeight()
    // ---- checking device width and height ----
    if (_wrapperWidth > 768) {
        for (var i = 0; i < _pageData.imgCollage.desktop.length; i++) {
            $('#section-' + $sectionCnt).find('.bg-img').eq(i).css({
                'background-image': 'url(' + _pageData.imgCollage.desktop[$sectionCnt - 1].imageSRC + ')',
                'background-size': 'cover'
            })
        }
    } else {
        for (var j = 0; j < _pageData.imgCollage.portrait.length; j++) {
            $('#section-' + $sectionCnt).find('.bg-img').eq(j).css({
                'background-image': 'url(' + _pageData.imgCollage.portrait[j].imageSRC + ')',
                'background-size': 'cover'
            })
        }
    }
}

function showVisitedModule() {
    getModuleLevelpageVisited();
    console.log("Raj-------------", getModuleLevelPageCount);

    var pageCnter = 0;
    var sectionArray = _pageData.sections[sectionCnt - 1].content.sectionArray;
    //$('#box-'+ ( _controller.pageCnt + 1)).addClass('active');

    $(".image-container").find(".box").removeClass('active');

    setTimeout(function () {
        pageVisited();
        for (let i = 0; i < sectionArray.length; i++) {

            console.log(_controller.pageCnt + 1, sectionArray[i].sectionID, "Controoler")
            if ((_controller.pageCnt + 1) == sectionArray[i].sectionID) {
                console.log(sectionArray[i].sectionIndx, sectionArray[i].sectionID, "Controoler", i)
                $('#box-' + sectionArray[i].sectionIndx).addClass('active');
                $('#box-' + sectionArray[i].sectionIndx).find('img').attr('src', sectionArray[i].imgActive)
                $('#box-' + sectionArray[i].sectionIndx).attr("disabled", false);
                $('#box-' + sectionArray[i].sectionIndx).css({
                    pointerEvents: "auto",
                    cursor: "pointer"
                })

                let currentDiv = '#box-' + sectionArray[i].sectionIndx;
                // console.log('#box-' + sectionArray[i].sectionIndx, currentDiv, "visited", ('#arrow-' + (sectionArray[i].sectionIndx)))

                if ($(currentDiv).hasClass("visited")) {
                    console.log((sectionArray[i].sectionIndx + 1), "Visited")
                    $('#box-' + (sectionArray[i].sectionIndx + 1)).attr("disabled", false);
                    $('#box-' + (sectionArray[i].sectionIndx + 1)).css({
                        pointerEvents: "auto",
                        cursor: "pointer"
                    })

                }
                loadAudio(sectionArray[i])
                // console.log("Audio Count", audioCount);
                // console.log(_pageData.mainAudio+' '+audioCount);
            }

            for (let j = 0; j < getModuleLevelPageCount.length; j++) {
                let count = 0;
                if (Array.isArray(getModuleLevelPageCount[j])) {
                    for (let k = 0; k < getModuleLevelPageCount[j].length; k++) {
                        if (getModuleLevelPageCount[j][k] == 1) {
                            count++;
                        }
                    }

                    console.log('count ', count, getModuleLevelPageCount[j].length, getModuleLevelPageCount[j])
                    if (count == getModuleLevelPageCount[j].length) {
                        console.log(getModuleLevelPageCount.indexOf(getModuleLevelPageCount[j]), "Values")
                        $("#box-" + (getModuleLevelPageCount.indexOf(getModuleLevelPageCount[j]) - 1)).find(".moduleVisited").show();
                        $("#box-" + (getModuleLevelPageCount.indexOf(getModuleLevelPageCount[j]) - 1)).addClass('visited')



                        $("#box-" + (getModuleLevelPageCount.indexOf(getModuleLevelPageCount[j]) - 1)).css({
                            pointerEvents: "auto",
                            cursor: "pointer"
                        })

                        $("#box-" + (getModuleLevelPageCount.indexOf(getModuleLevelPageCount[j]))).css({
                            pointerEvents: "auto",
                            cursor: "pointer"
                        })
                        $("#box-" + (getModuleLevelPageCount.indexOf(getModuleLevelPageCount[j]))).attr("disabled", false);



                        let boxElement = $("#box-" + (getModuleLevelPageCount.indexOf(getModuleLevelPageCount[j]))).find(".moduleVisited")
                        var id = $(boxElement).attr('id');
                        var arr = id.split('-')
                        var num1 = Number(arr[arr.length - 1]) - 1;
                        $("#box-" + (getModuleLevelPageCount.indexOf(getModuleLevelPageCount[j]))).find("img").attr('src', sectionArray[num1].imgVisisted);


                        //$("#box-" + (getModuleLevelPageCount.indexOf(getModuleLevelPageCount[j]))).addClass('active');
                    }
                }

            }
        }
    }, 200)

}

function getModuleLevelpageVisited() {
    console.log(getModuleLevelPageCount, "Module Level count start")

    var sectionArray = _pageData.sections[sectionCnt - 1].content.sectionArray;

    for (let i = 0; i < sectionArray.length; i++) {
        if (Array.isArray(getModuleLevelPageCount[sectionArray[i].sectionIndx])) {
            let count = sectionArray[i].sectionID
            for (let j = 0; j < getModuleLevelPageCount[sectionArray[i].sectionIndx].length; j++) {
                if ((_visitedArr[count] == '1') || (_visitedArr[count] == 1)) {
                    getModuleLevelPageCount[sectionArray[i].sectionIndx][j] = 1;
                }
                count++
            }
        }
    }
    console.log(getModuleLevelPageCount, "Module Level count end")

}

function onClickinfoHandler(evt) {
    var eventType = evt.type;
    var targetButton = $(this);
    var count = 0;
    var id = $(this).attr('id');
    var arr = id.split('-')
    var num = Number(arr[arr.length - 1]);
    console.log("helo", num)
    var body = $('#section-' + sectionCnt).find('.content-holder')
    switch (eventType) {
        case "click":
            playClickThen();
            ///AudioController.pause();
            // console.log("its wokring")

            $(`#infobtnPopup-${num}`).css('display', 'flex');
            $(`#infobtnPopup-${num}`).css('opacity', '1');
            $(".infoPopAudio").removeClass('playing');
            $(".infoPopAudio").addClass('mute');
            break;
        case "mouseenter":
            break;
        case "mouseleave":
            break;
    }
}


function onClickHandler(evt) {
    var eventType = evt.type;
    var targetButton = $(this);
    var count = 0;
    var id = $(this).attr('id');
    var arr = id.split('-')
    var num = Number(arr[arr.length - 1]) - 1;

    var body = $('#section-' + sectionCnt).find('.content-holder').find('.col-mid').find('.content').find('.content-bg').find('.body')
    //var sectionArray = _pageData.sections[sectionCnt - 1].content.sectionArray;
    var jumpToPage = [6, 7, 3, 4];
    console.log("Jump to page", jumpToPage[num])
    //var jumpToPage = sectionArray.sectionID

    //console.log(' == num ', num, sectionCnt,  _pageData.sections[sectionCnt-1].content[num].terms.iconHoverImage)
    switch (eventType) {
        case "click":
            //pageVisited();
            playClickThen();
            _controller.pageCnt = jumpToPage[num];

            // $("#f_preventor").show();
            _controller.updateViewNow();
            break;
        case "mouseenter":
            break;
        case "mouseleave":
            break;
    }
}


function loadAudio(aud) {
    _audioId = aud.audioSRC;
    _audioIndex = aud.audioIndex;
    // console.log(_audioIndex)
    _currentAudioIndex = _audioIndex

    assignAudio(_audioId, _audioIndex, _pageAudioSync, _forceNavigation, _videoId, _popupAudio, _reloadRequired);

}


function removeTags(str) {
    if ((str === null) || (str === '')) {
        return false;
    } else {
        str = _controller.removeTags(str);
        return str
    }
} function initPageAnimations() {
    if (_tweenTimeline) {
        _tweenTimeline.kill();
    }
    _tweenTimeline = new TimelineLite();


    mainAnimation();
    if (_pageAudioSync && !_pageData.mainAudio.isEmptyAudio) {
        withAudioSync()
    } else {
        withoutAudioSync()
    }

}

function mainAnimation() {
    $(".f_page_content").animate({
        'opacity': 1
    }, 300);
}



function withAudioSync() {

    _tweenTimeline.play();
    console.log("With Audio", _currentAudioIndex)
    _tweenTimeline.add(animateFadeIn($('.col-left'), 0.5).play(), 0.5)
    var body = $('#section-' + sectionCnt).find('.content-holder').find('.col-left').find('.content').find('.content-bg').find('.body');
    _tweenTimeline.add(animateFadeIn($('h1'), 0.5).play(), 2)
    _tweenTimeline.add(animateFadeIn(body.find('.text-container'), 0.5).play(), 1)
    _tweenTimeline.add(animateFadeIn(body.find('.text-container').find('p'), 0.5).play(), 1.5)
    // var iconTimings = [3];
    // var textTimings = [3,5,7];
    // for (var k = 0; k < iconTimings.length; k++) {
    //    _tweenTimeline.add(animateFadeIn(body.find('.text-container').find('p').eq(k), 0.5, 0).play(), iconTimings[k])
    // }
    var rightListTiming = [1, 2];
    for (var k = 0; k < rightListTiming.length; k++) {
        _tweenTimeline.add(animateFadeIn(body.find('.text-container').find('li').eq(k), 0.5, 0).play(), rightListTiming[k])
    }

    var boxTiming1 = [0.1, 0.5, 0.8]
    _tweenTimeline.add(animateFadeIn(body.find('.text-container').find('.ins-txt '), 0.5).play(), 1)
    _tweenTimeline.add(animateFadeOut(body.find('.dummypatch '), 0.5).play(), 1)
    for (var k = 0; k < boxTiming1.length; k++) {
        _tweenTimeline.add(animateFadeIn(body.find('.box').eq(k), 0.5, 0).play(), boxTiming1[k])
    }
}
function withoutAudioSync() {
    _tweenTimeline.play();
    console.log("Out Audio")
    _tweenTimeline.add(animateFadeIn($('h1'), 0.5).play(), 0.5)
    _tweenTimeline.add(animateFromMarginLeft($('.animat-container'), 0.5, 0).play(), 1)
    let time = 1, t = 0, pTag = 0, listTag = 0, divTag = 0;
    for (let i = 0; i < _pageData.sections[0].content.text.length; i++) {
        t = time + (i * 0.5)
        if (Array.isArray(_pageData.sections[0].content.text[i])) {
            let time1 = t + 0.5
            for (let j = 0; j < _pageData.sections[0].content.text[i].length; j++) {
                t = time1 + (j * 0.5)
                _tweenTimeline.add(animateFadeIn($(courseIdNameRef + '').find('ul li').eq(listTag), 0.5, 0).play(), t);
                listTag++
            }
            time = time1
        } else {
            _tweenTimeline.add(animateFadeIn($(courseIdNameRef + '').find('p').eq(pTag), 0.5, 0).play(), t);
            pTag++
        }

    }

}




