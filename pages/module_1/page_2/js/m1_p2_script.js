// ---------- setting start ---------------
var _preloadData, _pageData;
var _pagePreloadArray = {
    image: -1,
    audio: 1,
    video: 1,
    data: -1,
}; // item not availble please assign value 1.
var jsonSRC = "pages/module_1/page_2/data/m1_p2_data.json?v=";
_pageAudioSync = true;
_forceNavigation = false;
_audioRequired = true;
_videoRequired = false;
storeCurrentAudioTime = 0;
_popupAudio = false;
_reloadRequired = true;

_checkAudioFlag = false;
_tweenTimeline = null;
_popTweenTimeline = null;

var _audioIndex = 0;
_videoId = null;
_audioId = null;
// ---------- setting end ---------------
var sectionCnt = 0;
var totalSection = 0;
var prevSectionCnt = -1;
var sectionTopPos = [];
var playMainAudio = false;
// ------------------ common function start ------------------------------------------------------------------------
$(document).ready(function () {
    //console.log('Page ready')
    _preloadData = new PagePreload();
    _preloadData.initObj(_pagePreloadArray, jsonSRC);
    _preloadData.addCustomEvent("ready", _pageLoaded);
    //console.log('Page ready 1', _preloadData)
});

function _pageLoaded() {
    //console.log('_pageLoaded')
    _pageData = _preloadData.jsonData;
    if (_audioRequired) {
        _audioId = _pageData.mainAudio.audioSRC;
        _audioIndex = _pageData.mainAudio.audioIndex;
    }

    if (_videoRequired) _videoId = "courseVideo";

    //addSlideData();
    appState.pageCount = _controller.pageCnt -1;
    addSectionData();
    $(".home_btn").css({backgroundImage: `url(${_pageData.sections[0].backBtnSrc})`});
    $(".home_btn").attr("data-tooltip", "Back");
    $(".music, .introInfo").hide();
    $("#f_header").attr("style", "z-index: 1111 !important;");
    assignAudio(
        _audioId,
        _audioIndex,
        _pageAudioSync,
        _forceNavigation,
        _videoId,
        _popupAudio,
        _reloadRequired
    );
    pagePreLoad();
}

// ------------------ common function end ------------------------------------------------------------------------

// -------- adding slide data ------------
function addSectionData() {
    totalSection = _pageData.sections.length;
    for (let n = 0; n < _pageData.sections.length; n++) {
        sectionCnt = n + 1;
        if (sectionCnt == 1) {
            //$('#section-'+sectionCnt).find('.content-holder').find('.col-left').find('.content').find('.content-bg').append('<h1 aria-label="'+removeTags(_pageData.sections[sectionCnt-1].headerTitle)+'" tabindex="0">'+_pageData.sections[sectionCnt-1].headerTitle+'</h1>');

            let htmlObj = "",
                textObject = "",
                titleText = "",
                listObject = "";
            // if(_pageData.sections[sectionCnt-1].content.leftSection.listText != "") {
            // 	listObject = '<ul>'
            // 	for(let i=0; i<_pageData.sections[sectionCnt-1].content.leftSection.listText.length; i++){
            // 		listObject += '<li aria-label="'+removeTags(_pageData.sections[sectionCnt-1].content.leftSection.listText[i])+'" tabindex="0">'+_pageData.sections[sectionCnt-1].content.leftSection.listText[i]+'</li>'
            // 	}
            // 	listObject += '</ul>'
            // }

            if (_pageData.sections[sectionCnt - 1].headerTitle != "") {
                // textObject += '<h1 aria-label="' + removeTags(_pageData.sections[sectionCnt - 1].headerTitle) + '" tabindex="0">' +  + '</h1>'
                titleText +=
                    '<h1 aria-label="' +
                    removeTags(_pageData.sections[sectionCnt - 1].headerTitle) +
                    '" tabindex="0">' +
                    _pageData.sections[sectionCnt - 1].headerTitle +
                    "</h1>";
            }

            if (_pageData.sections[sectionCnt - 1].ost != "") {
                titleText +=
                    '<div class="ost-txt"><p aria-label="' +
                    removeTags(_pageData.sections[sectionCnt - 1].ost) +
                    '" tabindex="0">' +
                    _pageData.sections[sectionCnt - 1].ost +
                    "</p></div>";
            }

            console.log(
                "_pageData.sections[sectionCnt-1].content.length",
                _pageData.sections[sectionCnt - 1].content.length
            );

            // htmlObj += '<div class="sub-section video">';

            // htmlObj +=
            //     '<div class="video-holder"><video class="video-js vjs-default-skin vjs-big-play-centered video-player" id="video-player-' +
            //     sectionCnt +
            //     '" poster="" width="1024" height="580" codecs="avc1.4D401E, mp4a.40.2"><source src="' +
            //     _pageData.sections[sectionCnt - 1].content.videoURL +
            //     '" type="video/mp4"></source><track kind="captions" src="" srclang="en" label="English" default></video><button class="play-btn" aria-label="Play Videos" tabindex="0"><div class="play-icon"></div></button><div>';

            // htmlObj += "</div>";
            // htmlObj += "</div>";


            htmlObj += '<div class="sub-section video">';

            htmlObj +=
                '<div class="video-holder"><video controls autoplay playsinline  preload="auto"class="video" id="video-player-' + sectionCnt + '" poster=""><source src="' +
                _pageData.sections[sectionCnt - 1].content.videoURL +
                '" type="video/mp4"></source><track kind="captions" src="" srclang="en" label="English" default></video><button class="play-btn" aria-label="Play Videos" tabindex="0"><div class="play-icon"></div></button><div>';

            htmlObj += "</div>";
            htmlObj += "</div>";

            // htmlObj += textObject;

            $("#section-" + sectionCnt)
                .find(".content-holder")
                .find(".col-left")
                .find(".content")
                .find(".content-bg")
                .append('<div class="body">' + htmlObj + '</div>');
            // onVideoPlayHandler();

            // setTimeout(function(){
            //     $('.right-section').css({
            //         'background-image': 'url(' + _pageData.sections[sectionCnt-1].content.rightSection.img.imageSRC + ')',
            //         'background-size': 'cover',
            //         'background-repeat': 'no-repeat',
            //         'background-position': 'center',
            //         'height':'395px'
            //     })
            // }, 50)
            // $(".home_btn").on("click", jumtoPage)
            $("footer").find("p").hide();
            let audio = document.getElementById("audio_src").pause();
            var video = document.getElementById('video-player-1');

            video.addEventListener('ended', function () {
                console.log('Video has ended!');
                onVideoEnded();
            });

            setCSS(sectionCnt);
        }
    }
    //pageVisited();
}

function onVideoEnded() {
    pageVisited();
}

function onVideoPlayHandler() {
    $(this).hide();
    let isFullScreen = false;
    var player = videojs("video-player-" + sectionCnt, {
        textTrackSettings: false,
        controls: true,
        autoplay: true,
        preload: "auto",
        prefixed: false,
    });
    var videoElement = player.el().querySelectorAll("div"); //		   console.log('player',player)
    //	   if (document[player.fsApi_.fullscreenEnabled] === false) {
    //		   console.log("helo")
    //     	$('.vjs-text-track-cue-en').css({
    //				'top': '777px',
    //				'background-color': 'red'
    //			})
    //    }
    player.bigPlayButton.hide(); /*player.on('fullscreenchange', function() {		
		isFullScreen = !isFullScreen;
		if(isFullScreen) {
			//console.log('on fullscreenchange');
			
			videoElement[1].classList.remove('full-screen-off')
			videoElement[1].classList.add('full-screen-on');
			//$("#video-player-"+subSectionCnt).find('.vjs-text-track-display').find('.vjs-text-track-cue-en').css({'top':'unset !important'})
		} else {
			//console.log('off fullscreenchange');
			videoElement[1].classList.remove('full-screen-on')
			videoElement[1].classList.add('full-screen-off');
			//$("#video-player-"+subSectionCnt).find('.vjs-text-track-display').find('.vjs-text-track-cue-en').css({'top':'572px !important'})
		}
	})
    */ /*var indx = (sectionCnt-1) + (sectionCnt-1);
    videojs("video-player-"+sectionCnt).focus();
    videojs("video-player-"+sectionCnt).ready(function () {
    	this.bigPlayButton.hide();
    	if(_strictNavigation) {
    		if(visitedArr[indx] == -1 || visitedArr[indx] == 0) {
    			player.controlBar.progressControl.disable();
    		}
    	}
    	
    	this.on("ended", function(){
    		setVisitedSection(indx);
    		if(_strictNavigation) {
    			enableDisableBtn(nextBtn, true)
    		}
    	})
    })*/ //cVideo = document.getElementById("video-player-"+subSectionCnt);
    //cVideo.play();
    var indx = sectionCnt - 1 + (sectionCnt - 1);
    videojs("video-player-" + sectionCnt).focus();
    videojs("video-player-" + sectionCnt).ready(function () {
        this.bigPlayButton.hide();
        if (_strictNavigation) {
            if (visitedArr[indx] == -1 || visitedArr[indx] == 0) {
                player.controlBar.progressControl.disable();
            }
        }
        this.on("playing", function () {
            if (this.currentTime() >= 0.0) {
                _isVideoPlayed = true;
            }
            _isVideoPlaying = true;
        });
        this.on(["waiting", "pause"], function () {
            _isVideoPlaying = false;
        });

        this.on("ended", function () {
            _isVideoPlaying = null;
            _isVideoPlayed = null;
            player.controlBar.progressControl.enable(); //setVisitedSection(indx);
            /*if(_strictNavigation) {
                enableDisableBtn(nextBtn, true)
            }*/
            pageVisited();
        });
    });
    $("#video-player-" + sectionCnt).attr("controls", true);
}


function jumtoPage() {
    playClickThen();
    // const audio = document.getElementById("audio_src").pause();
    _controller.pageCnt = 1;
    $("#f_header").css("z-index", "11")
    if (_controller._globalMusicPlaying) {
        document.getElementById("audio_src").play();
    }
    setTimeout(function () {
        $("footer").find("p").show();
    }, 100)
    // _controller.updateViewNow();
}


function selectOption() {
    pageVisited();
    _controller.pageCnt = 2;
    _controller.updateViewNow();
}

// -------- update CSS ------------
function setCSS($sectionCnt) {
    _wrapperWidth = $("#f_wrapper").outerWidth();
    _wrapperHeight = $("#f_wrapper").outerHeight();
    // ---- checking device width and height ----
    if (_wrapperWidth > 768) {
        for (var i = 0; i < _pageData.imgCollage.desktop.length; i++) {
            $("#section-" + $sectionCnt)
                .find(".bg-img")
                .eq(i)
                .css({
                    "background-image":
                        "url(" +
                        _pageData.imgCollage.desktop[$sectionCnt - 1].imageSRC +
                        ")",
                    "background-size": "cover",
                });
        }
    } else {
        for (var j = 0; j < _pageData.imgCollage.portrait.length; j++) {
            $("#section-" + $sectionCnt)
                .find(".bg-img")
                .eq(j)
                .css({
                    "background-image":
                        "url(" + _pageData.imgCollage.portrait[j].imageSRC + ")",
                    "background-size": "cover",
                });
        }
    }
}

function removeTags(str) {
    //console.log('removeTags 0', str)
    if (str === null || str === "") {
        return false;
    } else {
        str = _controller.removeTags(str);
        str = str.split("IT").join("I T");
        return str;
    }
}
function initPageAnimations() {
    if (_tweenTimeline) {
        _tweenTimeline.kill();
    }
    _tweenTimeline = new TimelineLite();

    mainAnimation();
    if (_pageAudioSync && !_pageData.mainAudio.isEmptyAudio) {
        withAudioSync();
    } else {
        withoutAudioSync();
    }
}

function mainAnimation() {
    $(".f_page_content").animate(
        {
            opacity: 1,
        },
        300
    );
}

// function withAudioSync() {
//     _tweenTimeline.play();
//      // _tweenTimeline.add(animateFadeInWoDisplay($('.bg-img'), 1, 1).play(), 0.5)

//     _tweenTimeline.add(animateFromMarginLeft($('.body'), 0.5, 0).play(), 0.5)
// 	_tweenTimeline.add(animateFromMarginRight($('.overview'), 0.5, 0).play(), 0.1);
//     _tweenTimeline.add(animateFadeIn($('h1'), 0.5).play(), 0.5);
//     _tweenTimeline.add(animateFadeIn($('h2'), 0.5).play(), 0.1);
//     // _tweenTimeline.add(animateFadeIn($('.body').find('.sub-section').find('.left-section'),0.5).play(), 2);

//     var rightListTiming = [0.5,1,1.5,2,2.5,3,3.5,4,4.5,5];
//     for (var k = 0; k < rightListTiming.length; k++) {
//         _tweenTimeline.add(animateFadeIn($('.body').find('.overview').find('.left-section').find('ul').find('li').eq(k), 0.5, 0).play(), rightListTiming[k])
//     }
//     // var rightparaTiming = [2.5,29,34,40,56];
//     // for (var k = 0; k < rightparaTiming.length; k++) {
//     //     _tweenTimeline.add(animateFadeIn($('.body').find('p').eq(k), 0.5, 0).play(), rightparaTiming[k])
//     // }

// }

// function withoutAudioSync() {
//     _tweenTimeline.play();

//     //_tweenTimeline.add(animateFromMarginLeft($('.body'), 0.5, 0).play(), 1)
// 	_tweenTimeline.add(animateFromMarginLeft($('.overview'), 0.5, 0).play(), 0.5);
//     _tweenTimeline.add(animateFadeIn($('h1'), 0.5).play(), 1);
//     _tweenTimeline.add(animateFadeIn($('h2'), 0.5).play(), 1.5)
// 	//
// 	let time = 1.5, t = 0, pTag = 0, listTag = 0, divTag = 0;
//     /*
//     for(let i=0; i<_pageData.sections[sectionCnt-1].content.leftSection.text.length; i++){
//         t = time + (i * 0.5)
//         if(Array.isArray(_pageData.sections[sectionCnt-1].content.leftSection.text[i])) {
//             for(let j=0; j<_pageData.sections[sectionCnt-1].content.leftSection.text[i].length; j++){
//                 t = time1 + (j * 0.5)
//                 _tweenTimeline.add(animateFadeIn($('.body').find('ul li').eq(listTag), 0.5, 0).play(), t);
//                 listTag++
//             }
//         } else {
//             _tweenTimeline.add(animateFadeIn($('.body').find('p').eq(pTag), 0.5, 0).play(), t);
//         }
//     }

//     for (let k = 0; k < _pageData.sections[sectionCnt-1].content.leftSection.paraText.length; k++) {
// 		t = time + (k * 0.5)
//         _tweenTimeline.add(animateFadeIn($('.body').find('p').eq(pTag), 0.5, 0).play(), t);
// 		pTag++
//     }

//     let time1 = t + 0.5
//     for (let j = 0; j < _pageData.sections[0].content.leftSection.listText.length; j++) {
// 		t = time1 + (j * 0.5)
//         _tweenTimeline.add(animateFadeIn($('.body').find('ul li').eq(listTag), 0.5, 0).play(), t)
// 		listTag++
//     }
//     */
// }

function withAudioSync() {
    _tweenTimeline.play();
    _tweenTimeline.add(animateFadeIn($("h1"), 0.5).play(), 0.5);
    // _tweenTimeline.add(animateFadeIn($('.ost-txt'), 0.5).play(), 1)
    // _tweenTimeline.add(animateFadeIn($('p'), 0.5).play(), 1.5)
    _tweenTimeline.add(animateFadeIn($(".right-section"), 0.5).play(), 1);
    var rightparaTiming = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    for (var k = 0; k < rightparaTiming.length; k++) {
        _tweenTimeline.add(
            animateFadeIn($(".left-section").find("p").eq(k), 0.5, 0).play(),
            rightparaTiming[k]
        );
    }
    var rightListTiming = [1.5, 2, 2.5];
    for (var k = 0; k < rightListTiming.length; k++) {
        _tweenTimeline.add(
            animateFadeIn($("li").eq(k), 0.5, 0).play(),
            rightListTiming[k]
        );
    }
}
function withoutAudioSync() {
    _tweenTimeline.play();
    _tweenTimeline.add(animateFadeIn($("h1"), 0.5).play(), 0.5);
    _tweenTimeline.add(
        animateFromMarginLeft($(".animat-container"), 0.5, 0).play(),
        1
    );
    let time = 1,
        t = 0,
        pTag = 0,
        listTag = 0,
        divTag = 0;
    for (let i = 0; i < _pageData.sections[0].content.text.length; i++) {
        t = time + i * 0.5;
        if (Array.isArray(_pageData.sections[0].content.text[i])) {
            let time1 = t + 0.5;
            for (let j = 0; j < _pageData.sections[0].content.text[i].length; j++) {
                t = time1 + j * 0.5;
                _tweenTimeline.add(
                    animateFadeIn($("ul li").eq(listTag), 0.5, 0).play(),
                    t
                );
                listTag++;
            }
            time = time1;
        } else {
            _tweenTimeline.add(animateFadeIn($("p").eq(pTag), 0.5, 0).play(), t);
            pTag++;
        }
    }
}
// -------- resize page details ------------
