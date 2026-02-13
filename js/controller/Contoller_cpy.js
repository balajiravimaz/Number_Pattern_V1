var model;
var _menuView;
var _glossaryView;
var _resourceView;
var _refrenceView;
var _controller;
var ccTextToggle = false;
var _pagePreloadFlag = true;
var _hasAudio = "";
var _hasVideo = "";
var _preloadData = {};
var _ccOpenFlag = false;
var _ccTxt = "";
var _globalMusicPlaying;
var _transTxt = "";
var _strictNavigation = "";
var _audioSyncRequired = "";
var _audioRequired = "";
var settingInfo = {};
var _videoTagReplaced = false;
var _menuOpenFirstTime = false;
var _navBtnHeight = 50;
var _navBtnMargin = 4;
var _transscriptOpen = false;
var _menuOpen = false;
var _navbarUiElementsOpen = false;
var dummyAudioFlag = false;
var dummyAudioLevelOneFlag = false;
var dummyAudioLevelTwoFlag = false;
var dummyVideoFlag = false;
var dummyLoadAllAudioFlag = false;
var gadgetToggle = true
var _helpVideoMedia = null;
var _isVideoPlaying = null;
var _isVideoPlayed = null;
var preloadImgs = [];
//var forceNaviArry = ["1","","","","","","",""];
var mainAudioWithZoom = false;
var currentMedia = null;

//var userIndputData = [[{"que":"", "ans":"", "pgNo":12}, {"que":"", "ans":"", "pgNo":12}], [{"que":"", "ans":"", "pgNo":21}, {"que":"", "ans":"", "pgNo":21}],[{"que":"", "ans":"", "pgNo":27}, {"que":"", "ans":"", "pgNo":27}],[{"que":"", "ans":"", "pgNo":33}, {"que":"", "ans":"", "pgNo":33}],[{"que":"", "ans":"", "pgNo":38}, {"que":"", "ans":"", "pgNo":38}],[{"que":"", "ans":"", "pgNo":43}, {"que":"", "ans":"", "pgNo":43}],[{"que":"", "ans":"", "pgNo":46}, {"que":"", "ans":"", "pgNo":46}]]
/*var _branchingPage = {
    menuPage : 3
}*/
var Controller = function () {
    _controller = this;
    this.preLoadImgFlg = false;
    this.jsonLoadFlg = false;

    model = new Model();
    model.loadJson();
    model.addCustomEvent("ready", this.readyToPageLoad);

    menuBtn = this.assignControls($("#f_menuBtn"));
    menuBtn = this.assignControls($("#f_menuBtn_top"));
    gadgetBtn = this.assignControls($("#f_gadgetBtn"));
    gadgetBtnBottom = this.assignControls($("#f_gadgetBtn_bottom"));
    this._globalMusicPlaying = false;

    navigationIcons = $("#f_navBtnContainer");

    menuClose = this.assignControls($("#f_menuClose"));
    transBtn = this.assignControls($("#f_transcriptBtn"));
    volumeBtn = this.assignControls($("#f_volumeBtn"));
    transClose = this.assignControls($("#f_transClose"));
    pageContiner = this.assignControls($("#f_pageLoader"));
    backBtn = this.assignControls($("#f_backBtn"));
    nextBtn = this.assignControls($("#f_nextBtn"));
    homeBtn = this.assignControls($("#f_homeBtn"));
    homeBtnBottom = this.assignControls($("#f_homeBtn_bottom"));
    reviewBtn = this.assignControls($("#f_reviewBtn"));

    helpBtn = this.assignControls($("#f_helpBtn"));
    helpBtn = this.assignControls($("#f_helpBtn_top"));
    helpClose = this.assignControls($("#f_helpClose"));

    progresBarHolder = this.assignControls($(".slide__audio"));

    ccBtn = this.assignControls($("#f_ccBtn"));

    glossBtn = this.assignControls($("#f_glossaryBtn"));
    glossBtn = this.assignControls($("#f_glossaryBtn_top"));
    glossClose = this.assignControls($("#f_glossaryClose"));

    resourBtn = this.assignControls($("#f_resourceBtn"));
    resourBtn = this.assignControls($("#f_resourceBtn_top"));
    resourClose = this.assignControls($("#f_resourceClose"));

    refrenceBtn = this.assignControls($("#f_refrenceBtn"));

    refrenceClose = this.assignControls($("#f_gadgetPopupClose"));

    courseTitle = $("#f_courseTitle").find("p");
    pageTitle = $("#f_pageTitle").find("p");
    pageTitle_mobile = $("#f_pageTitle_mobile").find("p");
    screenTitle = $("#f_screenTitle").find("p");

    pageCounter = $("#f_pageCounter").find("p");
    courseProgress = $("#f_courseProgress").find("p");
    transText = $("#f_transText");

    this.totalPages = -1;
    this.pageCnt = 0;

    transHeader = $("#f_transcriptContainer");

    if (isMobile) {
        transHeader.draggable({
            containment: ".content-bg",
            disabled: true,
            //containment: "parent"
        });
    } else {
        transHeader.draggable({
            containment: ".content-bg",
            disabled: false,
            //containment: "parent"
        });
    }
    currentMedia = document.getElementById('courseAudio');
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            // currentMedia.pause();
            // $('#f_mediaBtn').removeClass('f_pause').removeClass('f_replay').addClass('f_play')

            if (_hasAudio == "true" || _navbarUiElementsOpen == true) _playbackView.pauseMedia();
            if (_hasVideo == "true" || _navbarUiElementsOpen == true) checkVideoPlayStatus("open")

        }
        else {
            if (_hasAudio == "true" && _navbarUiElementsOpen == false) {
                if (!forceAudioPause) {
                    if (!mediaEndFlag) {
                        pausePlay = "play";
                        playBack.checkPlayPause();

                    }
                }
            }

            if (_hasVideo == "true" && _navbarUiElementsOpen == false) checkVideoPlayStatus("close")
        }
    });

    var noPreloadImages = $("#f_preload_main_images img").length;
    for (var i = 1; i <= noPreloadImages; i++) {
        preloadImgs.push({
            src: "preload" + i
        });
    }

    // IOS code
    if (!document.documentElement.requestFullscreen ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    ) {
        document.getElementById("full-screen").style.display = "none";
    }

    preLoadImage();
};

function preLoadImage() {
    var loadCnt = 0;
    for (var i = 0; i < preloadImgs.length; i++) {
        preloadImgs[i].img = new Image();

        preloadImgs[i].img.src = $("#" + preloadImgs[i].src + "").attr("src");

        preloadImgs[i].img.onload = function () {
            loadCnt++;
            if (loadCnt == preloadImgs.length) {
                _controller.preLoadImgFlg = true;
                _controller.checkPreLoaderHide();
            }
        };
    }
}
Controller.prototype.removeTags = function (str) {
    //console.log('removeTags 0', str)
    if ((str === null) || (str === '')) {
        return false;
    } else {
        str = str.toString();
        str = str.replace(/(<([^>]+)>)/ig, '');
        str = str.split("EY").join("E Y");
        str = str.split("i.e.,").join("that is");
        str = str.split("e.g.").join("example");
        str = str.split("TOD").join("T O D");
        str = str.split("TOE").join("T O E");
        str = str.split("IPE").join("I P E");
        str = str.split("SOCD").join("S O C D");
        str = str.split("SME").join("S M E");
        str = str.split("GRC").join("G R C");
        str = str.split("ERP").join("E R P");
        str = str.split("IUC").join("I U C");
        str = str.split("IPO").join("I p O");
        str = str.split("EUC").join("E U C");
        str = str.split("IT").join("I T");
        str = str.split("Y/N").join("Yes or No");
        str = str.split("XYZ").join("x Y Z");
        str = str.split("WMS").join("W M S");
        str = str.split("GL").join("G L");
        str = str.split("SAP").join("S A P");
        str = str.split("N/A").join("Not Applicable");
        str = str.split("CEO").join("C E O");
        str = str.split("CFO").join("C F O");
        str = str.split("ICFR").join("i C F R");
        str = str.split("COSO").join("C O S O");
        str = str.split("GHI").join("G H I");
        str = str.split("SEC").join("S E C");
        str = str.split("WCGW").join("W C G W");
        str = str.split("SOP").join("S O P");
        str = str.split("SOC").join("S O C");
        str = str.split("SOX").join("S O X");
        str = str.split("SODC").join("S O D C");
        str = str.split("RACM").join("R A C M");
        str = str.split("PCAOB").join("P C A O B");
        str = str.split("MD&A").join("M D and A");
        str = str.split("C&A").join("C and A");


        return str
    }

}

Controller.prototype.checkPreLoaderHide = function () {
    console.log(this.preLoadImgFlg + ' && ' + this.jsonLoadFlg)
    if (this.preLoadImgFlg && this.jsonLoadFlg) {
        _menuView = new MenuView();
        _menuView.createMenu(model.menuData);
        _menuView.addCustomEvent("MenuClicked", _controller.menuClicked);

        this.totalPages = _menuView.totalPages - 1;

        var pageDetail = _menuView.getPageDetails(this.pageCnt);
        var _courseTitle = pageDetail.courseTitle;
        var _pageTitle = pageDetail.heading;
        courseTitle.html(_courseTitle);
        // courseTitle.attr('aria-label', _courseTitle);

        pageTitle.html(_pageTitle);
        pageTitle_mobile.html(_pageTitle);
        screenTitle.html(_pageTitle);
        pageCounter.html(this.pageCnt + 1 + "<span class='centerLine'></span>" + (this.totalPages + 1));

        $("#f_pageCounter").find('p').attr('aria-label', "page " + (this.pageCnt + 1) + " of " + (this.totalPages + 1))

        _glossaryView = new GlossaryView();
        _glossaryView.createGlossary(model.glossaryData);

        _refrenceView = new RefrenceView();
        _refrenceView.createRefrence(model.refrenceData);

        _resourceView = new ResourcesView();
        _resourceView.createResources(model.resourceData);

        _playbackView = new PlaybackView();
        _playbackView.addCustomEvent("ready", this.mediaStartPlay);
        _playbackView.addCustomEvent("pagecompleted", this.pageCompleted);
        _playbackView.addCustomEvent("pageprogress", this.pageInProgress);
        _menuView.hideMenuContainer();
        _menuView.hideMenuTab();
        //$("#f_menuContainer").find('#f_closeMenu').append("<button class='f_closeMenuPopup'> x </button>");
        //$("#f_menuContainer").find('#f_closeMenu').find('.f_closeMenuPopup').off("click").on("click", closeMenuPopup);
        $("#f_menuPopup").hide();
        $("#f_menuContainer").hide();

        $("#f_menuPopup").css({
            "z-index": 10801
        });

        //----- setting detail -------
        settingInfo = model.settingData;
        _strictNavigation = settingInfo.strictNavigation;
        _audioRequired = settingInfo.audioRequired;
        _audioSyncRequired = settingInfo.audioSyncRequired;
        checkNavigationStatus();

        //---------- start course -------------
        $("#f_preloader_wrapper").hide();
        $("#f_preloader_page").hide();
        //-------------- start screen animation start ----------------

        //$("#intro-text").find('h1').focus();
        /*    $("#intro-text").find('#Ip1').text('Port of call 1:');
            $("#intro-text").find('#Ip2').text('BEFORE DEPARTING');*/
        $("#intro-text").find('.iText').text("Click Start to begin.")
        // $("#f_launchBtn").attr("aria-label", "PLAY").html("PLAY <span>&#10095;</span>");

        //
        $("#f_startCourseBtn").attr("title", "Lets PLAY").html("Lets PLAY ");

        if (_strictNavigation) {
            $("#dummyInput").hide()
        } else {
            $("#dummyInput").show()
        }






        $(".playButton")
            .off("click")
            .on("click", function (e) {
                //initPageAnimations();
                //$('#f_header').find('#f_companyLogo').find('img').removeAttr("tabindex", "0")
                //$(".btn_container").animate({ height: '0%' });
                $(".btnImg").hide();
                $(".play-inst").hide();
                mainAnimation();



                if (isScorm) {
                    initCourseStatus();
                    if (pipwerks.SCORM.get("cmi.suspend_data") != "") {
                        $("#f_start_course").hide();
                        resumePage();
                    }
                    else {
                        // document.getElementById("audio_src").play();
                        $("#f_start_course").find('#f_companyLogo_main').find('img').attr("tabindex", "0").focus();
                        $("#f_start_course").find('#intro-text').find('h1').attr("tabindex", "0");
                        $("#f_start_course").find('#intro-text').find('p').attr("tabindex", "0");

                        $(".playButton").attr('tabindex', '-1')
                        $('#audio_src').on('ended', function () {
                            $('#f_launchBtn').css({
                                'pointer-events': 'auto',
                                'opacity': 1
                            })
                            $("#f_start_course").find('#intro-text').find('#intro-button').find('button').prop('disabled', false);

                        })
                    }
                } else {
                    // document.getElementById("audio_src").play();
                    $("#f_start_course").find('#f_companyLogo_main').find('img').attr("tabindex", "0").focus();
                    $("#f_start_course").find('#intro-text').find('h1').attr("tabindex", "0");
                    $("#f_start_course").find('#intro-text').find('p').attr("tabindex", "0");

                    $(".playButton").attr('tabindex', '-1')
                    $('#audio_src').on('ended', function () {
                        $('#f_launchBtn').css({
                            'pointer-events': 'auto',
                            'opacity': 1
                        })
                        $("#f_start_course").find('#intro-text').find('#intro-button').find('button').prop('disabled', false);

                    })
                }


                setTimeout(function () {
                    $('.border-bottom').css({
                        'opacity': 1
                    })
                }, 9000)
            })
        $("#f_launchBtn")
            .off("click mouseenter mouseleave")
            .on("click mouseenter mouseleave", function (e) {
                switch (e.type) {
                    case "click":
                        $("#f_preloader_wrapper").show();
                        playClickThen();
                        onLaunchCourse();
                        var widthWindow = window.innerWidth;
                        var heightWindow = window.innerHeight;

                        // alert("Width: " + widthWindow + "px\nHeight: " + heightWindow + "px");
                        // IOS code
                        if (!document.documentElement.requestFullscreen ||
                            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
                        ) {
                            document.querySelector(".fScreen").style.display = "none";
                        }
                        document.getElementById("audio_src").play();
                        document.getElementById("audio_src").volume = 0.6;
                        if (!_controller._globalMusicPlaying) {
                            _controller._globalMusicPlaying = true;
                        }

                        /* $("#f_launchBtn").css({
                            'opacity': 0.5,
                            'color': '#2e2e38',
                            'cursor': 'default',
                            'pointer-events': 'none'
                        }); */
                        //   $("#f_launchBtn").prop("disabled", true);
                        //-------------help video
                        /*_helpVideoMedia = document.getElementById("helpVideo");
                        _helpVideoMedia.load();
                        _helpVideoMedia.addEventListener("loadeddata", helpVideoLoad);*/

                        break;
                    case "mouseenter":
                        break;
                    case "mouseleave":
                        break;
                }
            });


    }
};

function initintroPageAnimations() {
    if (_tweenTimeline) {
        _tweenTimeline.kill();
    }
    _tweenTimeline = new TimelineLite();
    _landingPageAudio.load();
    _landingPageAudio.play();
    _landingPageAudio.addEventListener('ended', onLandingPageMediaEnded)
    //mainAnimation();
    withAudioSync();

}

function mainAnimation() {
    $(".f_page_content").animate({
        'opacity': 1
    }, 300);
}

function withAudioSync() {
    _tweenTimeline.play();
    $("#f_start_course").show();
    //  _tweenTimeline.add(animateFadeIn($('.animate-intropage'), 1.5).play(), 1);
    //  _tweenTimeline.add(animateFadeIn($('.animate-intropage').find('#p2'), 1.5).play(), 2);
    //  _tweenTimeline.add(animateFadeIn($('#img1'), 1.5).play(), 4);
    //  //_tweenTimeline.add(animateFadeOut($('#img1'), 1.5).play(), 3);
    //  _tweenTimeline.add(animateFadeIn($('#img2'), 1.5).play(), 5);
    // // _tweenTimeline.add(animateFadeOut($('#img2'), 1.5).play(), 6.5);
    //  _tweenTimeline.add(animateFadeIn($('#img3'), 1.5).play(), 6);


}
function onLandingPageMediaEnded() {
    console.log('intro audio ended')
    _landingPageAudio.removeEventListener('ended', onLandingPageMediaEnded)
    onLaunchCourse();

}
function onLaunchCourse() {
    var _currentAudioMedia = document.getElementById("courseAudio");
    _currentAudioMedia.src = "js/utils/initAudio.mp3";
    _currentAudioMedia.load();
    console.log("_currentAudioMedia", _currentAudioMedia)

    _currentAudioMedia.addEventListener("loadeddata", dummyAudioLoad);

    //-------------
    var _audioLevel_1 = document.getElementById("audioLevel_1");
    _audioLevel_1.src = "js/utils/initAudio.mp3";
    _audioLevel_1.load();
    _audioLevel_1.addEventListener("loadeddata", dummyAudioLevelOne);

    console.log(_audioLevel_1);

    //-------------
    var _audioLevel_2 = document.getElementById("audioLevel_2");
    _audioLevel_2.src = "js/utils/initAudio.mp3";
    _audioLevel_2.load();
    _audioLevel_2.addEventListener("loadeddata", dummyAudioLevelTwo);

    //console.log(_audioLevel_2);

    //-------------
    var _currentVideoMedia = document.getElementById("courseVideo");
    _currentVideoMedia.src = "js/utils/initVideo.mp4";
    _currentVideoMedia.load();
    _currentVideoMedia.addEventListener("loadeddata", dummyVideoLoad);
    preLoadAllData();
}

function dummyAudioLoad(e) {
    e.currentTarget.src = "";
    dummyAudioFlag = true;
    checkDummyMediaLoaded();
    e.currentTarget.removeEventListener("loadeddata", dummyAudioLoad);
}

function dummyAudioLevelOne(e) {
    // e.currentTarget.src = ''
    dummyAudioLevelOneFlag = true;
    checkDummyMediaLoaded();
    e.currentTarget.removeEventListener("loadeddata", dummyAudioLevelOne);
}

function dummyAudioLevelTwo(e) {
    // e.currentTarget.src = ''
    dummyAudioLevelTwoFlag = true;
    checkDummyMediaLoaded();
    e.currentTarget.removeEventListener("loadeddata", dummyAudioLevelTwo);
}

function dummyVideoLoad(e) {
    // e.currentTarget.src = ''
    dummyVideoFlag = true;
    checkDummyMediaLoaded();
    e.currentTarget.removeEventListener("loadeddata", dummyVideoLoad);
}

function pageLoad(e) {
    dummyVideoFlag = true;
    $("#f_start_course").hide();
    $('#f_header').find('#f_companyLogo').find('img').focus()
    dummyAudioLoad();
    e.currentTarget.removeEventListener("loadeddata", pageLoad);


    $("#skipHelpBtn")
        .off("click")
        .on("click", skipHelpVideo);
}

function checkDummyMediaLoaded() {
    if (
        dummyAudioFlag &&
        dummyVideoFlag &&
        dummyAudioLevelOneFlag &&
        dummyAudioLevelTwoFlag &&
        dummyLoadAllAudioFlag
    ) {
        $("#f_preloader_wrapper").hide();
        $("#f_start_course").animate({
            opacity: 0
        },
            300,
            function () {
                $("#f_start_course").hide();
                $("#helpVideoHolder").hide();
                $(".hideMain").show();
                $("#f_preloader_page").show();
                $('#f_header').find('#f_companyLogo').find('img').focus()
                //-------SCROM ----------
                //console.log("isScorm", isScorm)
                if (isScorm) {
                    initCourseStatus();
                    if (pipwerks.SCORM.get("cmi.suspend_data") != "") {
                        $("#intro").hide();
                        showResumeButton();
                    }
                    else {
                        _controller.pageCnt = 0;
                        _controller.updateViewNow();
                    }
                }
                else {
                    _controller.pageCnt = 0;
                    _controller.updateViewNow();
                }

                //enable arrowleft and arrow right navigation
                //            window.addEventListener("keyup", keyNavigation);
            }
        );

        /*if (isScorm) {
          initCourseStatus();
          if (pageCntSCO != 0) {
            showResumeButton();
          } else {
            _controller.pageCnt = 0;
            _controller.updateViewNow();
          }
        } else {
          _controller.pageCnt = 0;
          _controller.updateViewNow();
        }*/
    }
}

Controller.prototype.readyToPageLoad = function () {
    _controller.jsonLoadFlg = true;
    _preloadData = model.preloadData;

    _controller.checkPreLoaderHide();

};

function preLoadAllData() {
    loadAllElements = 0;
    // images preload
    if (_preloadData.images.length > 0) {
        for (let i = 0; i < _preloadData.images.length; i++) {
            let img = new Image();
            img.src = _preloadData.images[i].src;
            /*img.onload = function() {
                preLoadmediaLoaded();
            };*/
            img.addEventListener("load", preLoadmediaLoaded);

        }
    }

    // audio preload
    if (_preloadData.audios.length > 0) {
        for (let j = 0; j < _preloadData.audios.length; j++) {

            let audio = new Audio();
            audio.src = _preloadData.audios[j].src;
            audio.load();
            audio.addEventListener("loadeddata", preLoadmediaLoaded);
        }
    }

    // video preload
    if (_preloadData.videos.length > 0) {
        for (var k = 0; k < _preloadData.videos.length; k++) {
            var video = document.createElement("video");
            video.src = _preloadData.videos[k].src;
            video.load();
            video.addEventListener("loadeddata", preLoadmediaLoaded);
        }
    }
}
/*function preLoadImageLoaded() {
    loadAllElements++;
    if(loadAllElements == _preloadData.images.length) {
        console.log("loadAllElements",loadAllElements)
        $("#f_preloader_wrapper").hide();
        $("#f_preloader_page").hide();
    }
    
}*/
function preLoadmediaLoaded() {
    let totalElements = _preloadData.audios.length + _preloadData.images.length
    loadAllElements++;
    // console.log("loadAllElements",loadAllElements)
    if (loadAllElements == totalElements) {
        //console.log(">>>>",loadAllElements)
        $("#f_preloader_wrapper").hide();
        $("#f_preloader_page").hide();
        dummyLoadAllAudioFlag = true;
        checkDummyMediaLoaded()
    }
}
Controller.prototype.menuClicked = function () {
    _controller.moduleCnt = parseInt(_menuView.currentModule);
    _controller.pageCnt = _menuView.currentPage;
    _controller.updateViewNow();

    $("#f_menuContainer").hide(400, function () {
        $("#f_menuPopup").hide();
    });
};

Controller.prototype.assignControls = function (_btn) {
    _btn.on("click mouseenter mouseleave", this.fnClick);
    return _btn;
};

Controller.prototype.fnClick = function (e) {
    e.stopPropagation();
    var id = e.currentTarget.id;
    switch (id) {
        case "f_gadgetBtn":
            gadgetNavOver(e.type, id);
            if (e.type == "click") {

                //$("#f_rightMenu").show();
                var gadgetToggle = $("#f_gadgetPopup").is(":visible");
                $("#f_gadgetPopup").css({
                    display: "flex"
                });
                console.log('gadgetToggle ', gadgetToggle)
                if (gadgetToggle) {
                    hideGadget();
                    gadgetBtn.removeClass('f_gadgetClosenavBtn').addClass('f_gadgetnavBtn')
                    gadgetToggle = false

                } else {
                    showGadget();
                    //closeMenuPopup();
                    gadgetBtn.removeClass('f_gadgetnavBtn').addClass('f_gadgetClosenavBtn')
                    gadgetToggle = true
                }
            }
            break;

        case "f_gadgetBtn_bottom":
            gadgetNavOver(e.type, id);
            if (e.type == "click") {
                var gadgetToggle = $("#f_gadgetPopup").is(":visible");
                if (gadgetToggle) {
                    hideGadget();
                } else {
                    showGadget();
                }
            }
            break;

        case "f_menuBtn":
            gadgetNavOver(e.type, id);

            if (e.type == "click") {

                if (!_menuOpen) {
                    _navbarUiElementsOpen = true;
                    _menuOpen = true;
                    $("#f_menuPopup").show();
                    $("#f_menuPopup").find('#f_menuContainer').find('#f_menuHeader').find('#f_menuTitle').focus();
                    _menuView.updateCompletedStatus();
                    $(".f_menuLevel_1").attr("tabindex", "-1");
                    var gadgetToggle = $("#f_gadgetPopup").is(":visible");


                    hideGadget();

                    $("#f_menuContainer")
                        .show()
                        .stop()
                        .animate({
                            top: 0
                        },
                            400,
                            function () {
                                //setMenuTabIndex();
                                //hideGadget();
                                /* $(".f_menuLevel_2")
                                   .eq(_controller.pageCnt)
                                   .focus();*/

                                checkResizePopup();
                            }
                        );
                    removeNavigationAllTabIndex()
                    $("#f_menuPopup").find('#f_menuContainer').find('#f_menuHeader').find('#f_menuTitle').focus();
                    if (_hasAudio == "true" || _hasVideo == "true") {
                        _playbackView.pauseMedia();
                    }
                    checkVideoPlayStatus("open")
                } else {
                    closeMenuPopup();
                }
            }
            break;
        case "f_menuBtn_top":
            gadgetNavOver(e.type, id);

            if (e.type == "click") {
                if (!_menuOpen) {
                    _navbarUiElementsOpen = true;
                    _menuOpen = true;
                    $("#f_menuPopup").show();
                    _menuView.updateCompletedStatus();
                    $(".f_menuLevel_1").attr("tabindex", "-1");
                    var gadgetToggle = $("#f_gadgetPopup").is(":visible");
                    console.log('gadgetToggle ', gadgetToggle)

                    hideGadget();

                    $("#f_menuContainer")
                        .show()
                        .stop()
                        .animate({
                            top: 0
                        },
                            function () {
                                //setMenuTabIndex();
                                //hideGadget();
                                $(".f_menuLevel_2")
                                    .eq(_controller.pageCnt)
                                    .focus();
                                checkResizePopup();
                            }
                        );
                    removeNavigationAllTabIndex()
                    if (_hasAudio == "true" || _hasVideo == "true") {
                        _playbackView.pauseMedia();
                    }
                } else {
                    closeMenuPopup();
                }
            }
            break;
        case "f_menuClose":
            gadgetNavOver(e.type, id);
            if (e.type == "click") {

                closeMenuPopup();
                $("#f_menuPopup").hide();


                hideGadget();
                //$('#f_header').find('#f_companyLogo').find('img').focus()
                $("#f_header").find("#f_rightMenu").find("#f_menuBtn").focus();
            }
            break;

        case "f_transcriptBtn":
            gadgetNavOver(e.type, id);
            if (e.type == "click") {
                _transscriptOpen = true;
                _navbarUiElementsOpen = true;
                _controller.transcriptDisable();
                $("#f_transcriptContainer").show(200);
                $("#f_transContent").scrollTop(0);
                removeNavigationTabIndex();
                $("#f_transcriptContainer").find('#f_transHeader').find('#f_transTitle').focus();
                hideGadget();
                /*var gadgetToggle = $('#f_gadgetPopup').is(':visible');
                        if (gadgetToggle) {
                            hideGadget();
                        }*/

            }
            break;

        case "f_transClose":
            gadgetNavOver(e.type, id);
            if (e.type == "click") {
                _navbarUiElementsOpen = false;
                setTimeout(function () {
                    $('#f_transcriptBtn').focus();
                }, 300)
                $("#f_transContent").scrollTop(0);
                $("#f_transcriptContainer").hide(200, function () {
                    $("#f_transContent").scrollTop(0);
                    //enableScrollBar($("#f_transContent"), "dark");
                    _transscriptOpen = false;
                    _navbarUiElementsOpen = false;
                    _controller.transcriptEnable();
                    $("#f_transcriptContainer").css({
                        right: "20%",
                        bottom: "80px"
                    });
                });
                //setNavigationTabIndex();
            }
            break;

        case "f_glossaryBtn":
            gadgetNavOver(e.type, id);
            if (e.type == "click") {
                _navbarUiElementsOpen = true;
                removeNavigationAllTabIndex();

                setTimeout(function () {
                    _glossaryView.createGlossaryWords();
                    $("#f_glossaryPopup").show();
                    $("#f_glossaryContainer").show(400);
                    $("#f_glossaryPopup").find('#f_glossaryContainer').find('#f_glossaryHeader').find('#f_glossaryTitle').focus();
                    let glossaryContant = $("#f_glossaryContainer").find('table').find('tbody');
                    glossaryContant.scrollTop(0);
                    enableScrollBar(glossaryContant, "dark");
                }, 50);



                hideGadget();
                checkResizePopup();
                console.log('f_glossaryBtn >> ', forceAudioPause, mediaEndFlag)

                if (_hasAudio == "true" || _hasVideo == "true") {
                    _playbackView.pauseMedia();
                }
                checkVideoPlayStatus("open")
            }
            break;
        case "f_glossaryBtn_top":
            gadgetNavOver(e.type, id);
            if (e.type == "click") {
                _navbarUiElementsOpen = true;
                removeNavigationAllTabIndex();

                setTimeout(function () {
                    _glossaryView.createGlossaryWords();
                    $("#f_glossaryPopup").show();
                    $("#f_glossaryContainer").show(400);
                    $("#f_glossaryPopup").find('#f_glossaryContainer').find('#f_glossaryHeader').find('#f_glossaryTitle').focus();
                    let glossaryContant = $("#f_glossaryContainer").find('table').find('tbody');
                    glossaryContant.scrollTop(0);
                    enableScrollBar(glossaryContant, "dark");
                }, 50);



                hideGadget();
                checkResizePopup();
                console.log('f_glossaryBtn >> ', forceAudioPause, mediaEndFlag)
                if (_hasAudio == "true" || _hasVideo == "true") {
                    _playbackView.pauseMedia();
                }
            }
            break;
        case "f_glossaryClose":
            gadgetNavOver(e.type, id);
            if (e.type == "click") {
                _navbarUiElementsOpen = false;
                $("#f_glossaryContainer").hide(400, function () {
                    $("#f_glossaryPopup").hide();
                    //setNavigationTabIndex();
                    setNavigationAllTabIndex();
                });

                console.log('f_glossaryClose >> ', forceAudioPause, mediaEndFlag)
                if (_hasAudio == "true") {
                    if (!forceAudioPause) {
                        if (!mediaEndFlag) {
                            pausePlay = "play";
                            playBack.checkPlayPause();

                        }
                    }
                }
                if (_hasVideo == "true") checkVideoPlayStatus("close")
                $("#f_header").find("#f_rightMenu").find("#f_glossaryBtn").focus();
            }
            break;
        case "f_resourceBtn":
            gadgetNavOver(e.type, id);
            if (e.type == "click") {
                _navbarUiElementsOpen = true;
                removeNavigationAllTabIndex();
                setTimeout(function () {
                    $("#f_resourcePopup").show();
                    $("#f_resourceContainer").show(400);

                    $("#f_resourcePopup").find('#f_resourceContainer').find('#f_resourceHeader').find('#f_resourceTitle').focus();
                    let resourceContant = $("#f_resourceContainer").find('#f_resourceContent');
                    resourceContant.scrollTop(0);
                    enableScrollBar(resourceContant, "dark");

                }, 50);


                hideGadget();
                checkResizePopup();
                console.log('f_resourceBtn >> ', forceAudioPause, mediaEndFlag)

                if (_hasAudio == "true" || _hasVideo == "true") {
                    _playbackView.pauseMedia();
                }
                checkVideoPlayStatus("open")
            }
            break;


        case "f_resourceBtn_top":
            gadgetNavOver(e.type, id);
            if (e.type == "click") {
                _navbarUiElementsOpen = true;

                removeNavigationAllTabIndex();

                setTimeout(function () {
                    $("#f_resourcePopup").show();
                    $("#f_resourceContainer").show(400);
                    $("#f_resourcePopup").find('#f_resourceContainer').find('#f_resourceHeader').find('#f_resourceTitle').focus();
                }, 50);


                hideGadget();
                checkResizePopup();
                console.log('f_resourceBtn >> ', forceAudioPause, mediaEndFlag)
                if (_hasAudio == "true" || _hasVideo == "true") {
                    _playbackView.pauseMedia();
                }
            }
            break;

        case "f_resourceClose":
            gadgetNavOver(e.type, id);
            if (e.type == "click") {
                _navbarUiElementsOpen = false;
                $("#f_resourceContainer").hide(400, function () {
                    $("#f_resourcePopup").hide();
                    // setNavigationTabIndex();
                    setNavigationAllTabIndex();

                });
                console.log('f_resourceClose >> ', forceAudioPause, mediaEndFlag)
                if (_hasAudio == "true") {
                    if (!forceAudioPause) {
                        if (!mediaEndFlag) {
                            pausePlay = "play";
                            playBack.checkPlayPause();

                        }
                    }
                }
                if (_hasVideo == "true") checkVideoPlayStatus("close")
                //$('#f_header').find('#f_companyLogo').find('img').focus()
                $("#f_footer").find("#f_rightMenu").find("#f_resourceBtn").focus();
            }
            break;
        case "f_reviewBtn":
            if (e.type == "click") {
                window.open("https://sites.ey.com/sites/CollaborativeReviewTool/Shared%20Documents/crt/index.aspx#/?projectName=Dark_theme_template_Advanced&projectCode=Dark_theme_template_Advanced&deliveryPhase=Alpha&serviceLine=Americas", "reviewWindow", "menubar=1,resizable=1,width=550,height=480");
            }
            break;
        case "f_refrenceBtn":
            gadgetNavOver(e.type, id);
            if (e.type == "click") {
                _navbarUiElementsOpen = true;
                removeNavigationAllTabIndex();

                setTimeout(function () {
                    $("#f_refrencePopup").show();
                    $("#f_refrenceContainer").show(400);

                    $("#f_refrencePopup").find('#f_refrencePopup').find('#f_refrenceHeader').find('#f_refrenceTitle').focus();
                    let refrenceContant = $("#f_refrenceContainer").find('#f_refrenceContent');
                    refrenceContant.scrollTop(0);
                    enableScrollBar(refrenceContant, "dark");

                }, 50);


                hideGadget();
                checkResizePopup();
                console.log('f_refrenceBtn >> ', forceAudioPause, mediaEndFlag)

                if (_hasAudio == "true" || _hasVideo == "true") {
                    _playbackView.pauseMedia();
                }
                checkVideoPlayStatus("open")
            }
            break;
        case "f_gadgetPopupClose":
            gadgetNavOver(e.type, id);
            if (e.type == "click") {
                _navbarUiElementsOpen = false;
                $("#f_gadgetPopup").hide(400, function () {
                    $("#f_gadgetPopup").hide();
                    gadgetBtn.removeClass('f_gadgetClosenavBtn').addClass('f_gadgetnavBtn')
                    // setNavigationTabIndex();
                    setNavigationAllTabIndex();

                });
                console.log('f_gadgetPopupClose >> ', forceAudioPause, mediaEndFlag)
                if (_hasAudio == "true") {
                    if (!forceAudioPause) {
                        if (!mediaEndFlag) {
                            pausePlay = "play";
                            playBack.checkPlayPause();

                        }
                    }
                }
                if (_hasVideo == "true") checkVideoPlayStatus("close")
                //$('#f_header').find('#f_companyLogo').find('img').focus()
                $('#f_footer').find('#f_rightMenu').find('.f_gadgetnavBtn').focus()
                gadgetBtn.removeClass('f_gadgetClosenavBtn').addClass('f_gadgetnavBtn')
            }
            break;

        case "f_helpBtn":
            gadgetNavOver(e.type, id);
            if (e.type == "click") {
                _navbarUiElementsOpen = true;
                $("#f_helpPopup").show();
                $("#f_helpContainer").show(400);
                removeNavigationAllTabIndex();
                hideGadget();
                checkResizePopup();
                $("#f_helpPopup").find('#f_helpContainer').find('#f_helpHeader').find('#f_helpTitle').focus();
                if (_hasAudio == "true" || _hasVideo == "true") {
                    _playbackView.pauseMedia();
                }
                checkVideoPlayStatus("open")
            }
            break;
        case "f_helpBtn_top":
            gadgetNavOver(e.type, id);
            if (e.type == "click") {
                _navbarUiElementsOpen = true;
                $("#f_helpPopup").show();
                $("#f_helpContainer").show(400);

                //removeNavigationTabIndex();
                hideGadget();
                checkResizePopup();
                if (_hasAudio == "true" || _hasVideo == "true") {
                    _playbackView.pauseMedia();
                }
            }
            break;
        case "f_helpClose":
            gadgetNavOver(e.type, id);
            if (e.type == "click") {
                _navbarUiElementsOpen = false;
                $("#f_helpContainer").hide(400, function () {
                    $("#f_helpPopup").hide();
                    //  setNavigationTabIndex();
                    setNavigationAllTabIndex();
                    //$('#f_header').find('#f_companyLogo').find('img').focus()
                    $("#f_header").find("#f_rightMenu").find("#f_helpBtn").focus();
                });


                if (_hasAudio == "true") {
                    if (!forceAudioPause) {
                        if (!mediaEndFlag) {
                            pausePlay = "play";
                            playBack.checkPlayPause();

                        }
                    }
                }
                if (_hasVideo == "true") checkVideoPlayStatus("close")
                $('#f_header').find('#f_companyLogo').find('img').focus()
            }
            break;

        case "f_backBtn":
            gadgetNavOver(e.type, id);
            if (e.type == "click") {
                _controller.backDisable();
                _controller.pageCnt--;
                _controller.updateViewNow();
                $('#f_header').find('#f_companyLogo').find('img').focus()
                hideGadget();
                gadgetBtn.removeClass('f_gadgetClosenavBtn').addClass('f_gadgetnavBtn')
                $("#f_transContent").scrollTop(0);
            }
            break;
        case "f_nextBtn":
            gadgetNavOver(e.type, id);
            if (e.type == "click") {
                pageVisited();
                hideGadget();
                gadgetBtn.removeClass('f_gadgetClosenavBtn').addClass('f_gadgetnavBtn')
                _controller.nextDisable();
                _controller.pageCnt++;
                _controller.updateViewNow();
                $('#f_header').find('#f_companyLogo').find('img').focus()
                $("#f_transContent").scrollTop(0);
            }
            break;

        case "f_homeBtn":
            gadgetNavOver(e.type, id);
            if (e.type == "click") {
                _controller.pageCnt = 0;
                _controller.updateViewNow();
                $('#f_header').find('#f_companyLogo').find('img').focus()
            }
            break;

        case "f_homeBtn_bottom":
            gadgetNavOver(e.type, id);
            if (e.type == "click") {
                _controller.pageCnt = 0;
                _controller.updateViewNow();
            }
            break;

        case "f_ccBtn":
            gadgetNavOver(e.type, id);
            if (e.type == "click") {
                if (ccTextToggle) {
                    _playbackView.hideCCText();
                    ccTextToggle = false;
                } else {
                    ccTextToggle = true;
                    _playbackView.showCCText();
                }
                var gadgetToggle = $("#f_gadgetPopup").is(":visible");
                if (gadgetToggle) {
                    hideGadget();
                }
            }
            break;

        case "restart_button":
            if (e.type == "click") {
                restartPage();
            }
            break;

        //-------SCROM ----------
        case "resume_button":
            if (e.type == "click") {
                resumePage();
            }
            break;

        default:
            // alert("not a button")
            break;
    }
};

function keyNavigation(e) {
    if (e.defaultPrevented) {
        return; // Should do nothing if the default action has been cancelled
    }

    var arrowLeftKey = 37;
    var arrowRightkey = 39;

    var key = event.which || event.keyCode;

    if (_controller.pageCnt > 0) {
        if (key == arrowLeftKey) {
            //   window.removeEventListener("keyup", keyNavigation);
            _controller.pageCnt--;
            _controller.updateViewNow();
        }
    }

    if (_controller.pageCnt < _controller.totalPages) {
        if (key == arrowRightkey) {
            //   window.removeEventListener("keyup", keyNavigation);
            pageVisited();
            _controller.pageCnt++;
            _controller.updateViewNow();
        }
    }
}

function closeMenuPopup() {
    _menuOpen = false;
    _navbarUiElementsOpen = false;
    var tmpH = parseInt($("#f_menuPopup").outerHeight()) - 3;
    console.log('closeMenuPopup::_isVideoPlaying ', _isVideoPlaying)
    $("#f_menuContainer")
        .stop()
        .animate(
            /* {
               top: -1 * tmpH
             },
             400,*/
            function () {
                $("#f_menuContent").scrollTop(0);
                _menuView.hideMenuTab();
                $("#f_menuPopup").hide();

                setFocus($(".page_heading").parent());
            }
        );
    setNavigationAllTabIndex()

    if (_hasAudio == "true") {
        if (!forceAudioPause) {
            if (!mediaEndFlag) {
                pausePlay = "play";
                playBack.checkPlayPause();

            }
        }
    }
    if (_hasVideo == "true") checkVideoPlayStatus("close")
}

function navOver(_type, _id) {
    switch (_type) {
        case "click":
            $("#" + _id).removeClass("navOverOne");
            break;
        case "mouseenter":
            $("#" + _id)
                .removeClass("navOverOne")
                .addClass("navOverOne");
            break;
        case "mouseleave":
            $("#" + _id).removeClass("navOverOne");
            break;
    }
}

function gadgetNavOver(_type, _id) {
    switch (_type) {
        case "click":
            $("#" + _id).removeClass("navOverOne");
            $("#" + _id).removeClass("over");
            break;
        case "mouseenter":
            $("#" + _id)
                .removeClass("navOverOne")
                .addClass("navOverOne");
            $("#" + _id)
                .removeClass("over")
                .addClass("over");
            break;
        case "mouseleave":
            $("#" + _id).removeClass("navOverOne");
            $("#" + _id).removeClass("over");
            break;
    }
}

function checkVideoPlayStatus(_popupStatus) {
    if (_hasVideo == "true") {
        console.log('_isVideoPlaying ', _isVideoPlaying, _isVideoPlayed)
        if (_popupStatus == "open") {
            if (_isVideoPlaying) {
                videojs("video-player-1_html5_api").pause();
            }
        } else if (_popupStatus == "close") {
            if (!_isVideoPlaying && _isVideoPlayed) {
                videojs("video-player-1_html5_api").play();
            }
        }
    }

}
/*
function hideGadget() {
  if (isMobile) {
    $("#f_gadgetPopup")
      .stop()
      .animate(
        {
          height: 0
        },
        300,
        function() {
          $("#f_gadgetPatch_bottom")
            .stop()
            .animate(
              {
                height: 0
              },
              0,
              function() {
                $("#f_gadgetPopup").hide();
              }
            );
        }
      );
  } else {
    $("#f_gadgetPopup")
      .stop()
      .animate(
        {
          height: 0
        },
        300,
        function() {
          $("#f_gadgetPatch")
            .stop()
            .animate(
              {
                height: 0
              },
              0,
              function() {
                $("#f_gadgetPopup").hide();
              }
            );
        }
      );
  }
}

function showGadget() {
    console.log('showGadget >>')
  if (isMobile) {
    $("#f_gadgetPopup").show();
    $("#f_gadgetPatch_bottom")
      .stop()
      .animate(
        {
          height: 2
        },
        50,
        function() {
          $("#f_gadgetPopup")
            .stop()
            .animate(
              {
                height: 40 * settingInfo.noOfGadgetBtn + _navBtnMargin * settingInfo.noOfGadgetBtn + 4
              },
              300
            );
        }
      );
  } else {
      console.log('showGadget >> else ')
    $("#f_gadgetPopup").show();
    $("#f_gadgetPatch")
      .stop()
      .animate(
        {
          height: 7
        },
        50,
        function() {
          $("#f_gadgetPopup")
            .stop()
            .animate(
              {
                height: _navBtnHeight * settingInfo.noOfGadgetBtn + _navBtnMargin * settingInfo.noOfGadgetBtn + 5
              },
              300
            );			
        }
      );
      console.log('showGadget >> else ', $("#f_gadgetPopup").height())
  }
}*/
function hideGadget() {
    gadgetBtn.removeClass("f_gadgetClosenavBtn").addClass("f_gadgetnavBtn");
    if (isMobile || isIpad) {
        $("#f_gadgetPopup").animate({
            width: 0,
        },
            10,
            function () {
                $("#f_gadgetPopup").hide();
            }
        );
    } else {
        $("#f_gadgetPopup").animate({
            width: 0,
        },
            10,
            function () {
                $("#f_gadgetPopup").hide();
            }
        );
        gadgetBtn
            .removeClass("f_gadgetClosenavBtn")
            .addClass("f_gadgetnavBtn");
        $(gadgetBtn).prop('title', 'Hamburger');
        $(gadgetBtn).attr('aria-label', 'Hamburger');
    }
}

function showGadget() {
    gadgetBtn.removeClass("f_gadgetnavBtn").addClass("f_gadgetClosenavBtn");
    if (isMobile || isIpad) {
        $("#f_gadgetPopup").show();
        $("#f_gadgetPopup")
            .stop()
            .animate({
                width: 0,
            },
                1,
                function () {
                    $("#f_gadgetPopup").stop().animate({
                        width: 315,
                    },
                        300
                    );
                }
            );
    } else {
        $("#f_gadgetPopup").show();
        $("#f_gadgetPopup")
            .stop()
            .animate({
                width: 0,
            },
                1,
                function () {
                    $("#f_gadgetPopup").animate({
                        width: 315,
                    },
                        300
                    );
                }
            );
    }
}


Controller.prototype.updateViewNow = function () {
    if (_hasAudio == "true") {
        if (visitedArr[_controller.pageCnt] == 1) {
            $(".slide__audio").css({
                cursor: "pointer",
                pointerEvents: "auto",
                opacity: 1
            });
        }
    }
    closeMenuPopup();
    Controller.prototype.pageInProgress();
    if (typeof tweenTimeline != "undefined") {
        if (tweenTimeline) {
            tweenTimeline.kill();
        }
        closeMenuPopup
    }

    //imageLoader('startAnimation("f_pageLoaderImg")')
    $("#f_preloader_page").show();
    $("#f_hintBtn").hide();
    $(".buttonTrap").show();
    $("#f_header").show()
    $("#f_rightMenu").show()
    $("#f_pageCounter").show()

    console.log('pageCnt ', this.pageCnt)
    var pageDetail = _menuView.getPageDetails(this.pageCnt);
    console.log('pageDetail ', pageDetail)
    //--------SCORM --------------------
    pageCntSCO = this.pageCnt;

    console.log("pageCntSCO :: ", pageCntSCO)
    if (isScorm) setCourseDetailToLMS();
    console.log("pageCntSCO after :: ", pageCntSCO)
    //----------------------------------

    var url = pageDetail.URL;
    var _courseTitle = pageDetail.courseTitle;
    var _pageTitle = pageDetail.heading;
    _hasAudio = pageDetail.hasAudio;
    _hasVideo = pageDetail.hasVideo;
    var _pageType = pageDetail.pageType;
    console.log(_pageType, "rovket")

    var _moduleNo = url.split("/")[1];
    _moduleNo = _moduleNo.split("_")[1];

    _controller.moduleCnt = parseInt(_moduleNo);

    $("#path").html(url);
    //swap video tag
    _videoTagReplaced = _hasVideo;
    //width console
    let vieId = document.getElementById('video-player-1');
    if (vieId) videojs(vieId).dispose();
    //
    if (_videoTagReplaced) {
        _videoTagReplaced = false;

        $(".dummyDiv").replaceWith($("#courseVideo"));
        $("#f_dummyVideoHolder").append("<div class='dummyDiv'></div>");
    }

    pageContiner.find("div").remove();
    pageContiner.html("");
    if (this.pageCnt == 0) {
        this.backDisable();
    } else {
        this.backEnable();
    }

    ccBtn.off("click mouseenter mouseleave");
    ccBtn.css({
        opacity: 0.5,
        cursor: "default"
    });

    _playbackView.hideCCText();
    _playbackView.assessmentFlag = false;

    if (_pageType != undefined) {
        window.removeEventListener("keyup", keyNavigation);
        this.nextDisable();
        this.backDisable();
    }

    _playbackView.removePlayBackListener();

    courseTitle.html(_courseTitle);

    mainAudioWithZoom = false;
    //courseTitle.attr('aria-label', _courseTitle);
    // pageTitle.html('Client Workspace ' + _moduleNo + ' > ' + _pageTitle);
    // pageTitle.html('Tow and Impound forms ');
    // pageTitle_mobile.html('Tow and Impound forms ');
    // screenTitle.html(_pageTitle);
    this.nextDisable();
    this.backDisable();
    pageCounter.html("<span class='pageNumbr'>" + this.pageCnt + 1 + "</span><span class='centerLine'></span>" + (this.totalPages + 1));
    /* pageCounter.html("<span class='cPage'>" +this.pageCnt + 1 +"</span> <span class='slash'></span><span class='tPage'>"+(this.totalPages + 1)+"</span>");*/

    pageCounter.html(this.pageCnt + 1 + "<span class='centerLine'></span>" + (this.totalPages + 1));

    $("#f_pageCounter").find('p').attr('aria-label', "page " + (this.pageCnt + 1) + " of " + (this.totalPages + 1))


    //stopCustomeAudio();
    /*if (pageCntSCO == 0) {
      forceAudioPause = true;
      pausePlay = "pause";
      playBack.checkPlayPause();
      //showHelpVideo();
    } else {
      pageContiner.load(url, function() {
        if (!_audioSyncRequired) {
          _controller.pageCompleted();
        }
      });

      $("#f_transContent").scrollTop(0);

      if (_transscriptOpen) _controller.transcriptDisable();
    }*/
    //console.log("pageContiner | url :: ", url, _audioSyncRequired)
    //showHideNavigationIcons(false)
    forceAudioPause = false;
    pageContiner.load(url, function () {
        _isVideoPlaying = null;
        _isVideoPlayed = null;
        if (!_audioSyncRequired) {
            _controller.pageCompleted();
        }

        //pageContiner.find('.f_page_content').animate
    });

    $("#f_transContent").scrollTop(0);
    if (typeof IdleAudioManager !== "undefined") {
        IdleAudioManager.stop();
    }

    if (_transscriptOpen) _controller.transcriptDisable();
};

function checkNextBackStatus() {
    var pageDetail = _menuView.getPageDetails(_controller.pageCnt);
    if (_controller.pageCnt == 0) {
        _controller.backDisable();
    }
    if (_controller.pageCnt == _controller.totalPages) {
        console.log(_controller.totalPages, " _controller.totalPages")
        _controller.nextDisable();
        // window.removeEventListener("keyup", keyNavigation);
        nextBtn.css({
            cursor: "default",
            opacity: 0.5
        });
    } else {
        // window.addEventListener("keyup", keyNavigation);
        _controller.nextEnable();
    }

    if (_strictNavigation) {
        _menuView.removeButtonNavigation(_controller.pageCnt);
        $(".slide__audio").css({
            cursor: "default",
            pointerEvents: "none",
            opacity: 1
        });
        progresBarHolder.prop("disabled", true);
        if (_hasAudio == "true") {
            if (visitedArr[_controller.pageCnt] == 1) {
                $(".slide__audio").css({
                    cursor: "pointer",
                    pointerEvents: "auto",
                    opacity: 1
                });
            }
        }
        if (visitedArr[_controller.pageCnt] == 1) {
            //   window.addEventListener("keyup", keyNavigation);
            _controller.nextEnable();


        } else {
            //   window.removeEventListener("keyup", keyNavigation);
            _controller.nextDisable();
        }
    }
    /*  if ((pageDetail.type == 'Sections') || (pageDetail.type == 'sub-section')) {
         _controller.nextDisable();
         
         
     } */
}

function disableNavigation() {
    _controller.nextDisable();
    _controller.backDisable();
    _playbackView.removePlayBackListener();
}

function disableNavigationAssessment() {
    _controller.nextDisable();
    _controller.backDisable();
    _controller.gadgetDisable();
    _playbackView.removePlayBackListener();
}

function pagePreLoad() {
    $(".buttonTrap").hide();

    //enableScrollBar($(".scroll_holder"), "dark");

    setTimeout(function () {
        $(".page_heading").attr({
            role: "heading",
            "aria-level": "1"
        });

        setTimeout(function () {
            setFocus($(".page_heading"), 0);
        }, 200);

        if (!isDevice) {
            $(".page_heading")
                .parent()
                .parent()
                .attr("tabindex", -1);
        }

        $("#f_wrapper").scrollTop(0);

        //------------ enable navigation -----------------
        console.log("next page loaded........");
        // window.addEventListener("keyup", keyNavigation);
        _controller.backEnable();
        checkNextBackStatus();

        if (_pagePreloadFlag) {
            _pagePreloadFlag = false;
            stopAnimation();
            $("#f_preloader").hide();
            $("#f_preloader_page").hide();
        } else {
            stopAnimation();
            $("#f_preloader_page").hide();
        }
    }, 50);
}

function loadMedia(_src, ccObj, _audioSync, _restriction, _transcriptObj,
    _videoId) {
    _playbackView.startPlayback(_src, ccObj, _audioSync, _restriction, _videoId)
    _ccTxt = ccObj
    _transTxt = '';
    _transTxt = _transcriptObj;
    _controller.updateTranscriptView();
}

function loadMedia(
    _src,
    ccObj,
    _audioSync,
    _restriction,
    _transcriptObj,
    _videoId,
    _popAudio,
    _reloadReq,
    _mediaLevel
) {
    switch (_mediaLevel) {
        case undefined:
            _playbackView.startPlayback(
                _src,
                ccObj,
                _audioSync,
                _restriction,
                _videoId,
                _popAudio,
                _reloadReq,
                _mediaLevel
            );
            break;
        case 1:
            _playbackView.startLevelOnePlayback(
                _src,
                ccObj,
                _audioSync,
                _restriction,
                _videoId,
                _popAudio,
                _reloadReq,
                _mediaLevel
            );
            break;
        case 2:
            _playbackView.startLevelTwoPlayback(
                _src,
                ccObj,
                _audioSync,
                _restriction,
                _videoId,
                _popAudio,
                _reloadReq,
                _mediaLevel
            );
            break;
    }

    _ccTxt = ccObj;
    _transTxt = "";
    _transTxt = _transcriptObj;
    if (settingInfo.transcriptRequired) {
        _controller.updateTranscriptView();
    }
}

Controller.prototype.updateTranscriptView = function () {
    transText.empty();
    let txt = " ";
    let _typeof = "";
    for (let i = 0; i < _transTxt.length; i++) {
        _typeof = typeof _transTxt[i];
        console.log(_typeof, " eeeee ")
        if (_typeof == "string") {
            transText.append('<p aria-label="' + removeTags(_transTxt[i]) + '" tabindex="0">' + _transTxt[i] + '</p>');
        } else {
            let listText = ""
            listText = "<ul>"
            for (let j = 0; j < _transTxt[i].length; j++) {
                listText += '<li aria-label="' + removeTags(_transTxt[i][j]) + '" tabindex="0">' + _transTxt[i][j] + '</li>';
            }
            listText += "</ul>"
            transText.append(listText);

        }
    }

    $("#f_transContent").scrollTop(0);
    enableScrollBar($("#f_transContent"), "dark");
    if (_transTxt == "") {
        closeTranscript();
        $('#f_transcriptContainer').hide(200, function () {
            $('#f_transContent').scrollTop(0);
            _controller.transcriptDisable();
            _controller.volumeBtnDisable();
        });
    }
};

Controller.prototype.mediaStartPlay = function () {
    if (_ccTxt != null) {
        ccBtn.on("click mouseenter mouseleave", _controller.fnClick);
        ccBtn.css({
            opacity: 1,
            cursor: "pointer"
        });
    } else {
        ccBtn.off("click mouseenter mouseleave");
        ccBtn.css({
            opacity: 0.5,
            cursor: "default"
        });
    }

    if (ccTextToggle) {
        _playbackView.showCCText();
    } else {
        _playbackView.hideCCText();
    }
    checkStartAnimation();
};
Controller.prototype.pageCompleted = function () {
    pageVisited();
};

Controller.prototype.pageInProgress = function () {
    $("#f_nextIndicator").hide();
    /*  if (indicator != null) {
            indicator.kill()

        }*/
};

function pageVisited() {
    console.log("visited");
    var pageDetail = _menuView.getPageDetails(_controller.pageCnt);
    //visitedArr[_controller.pageCnt] = 1
    _menuView.updateVisitedStatus(_controller.pageCnt);
    _menuView.updateActiveState(_controller.moduleCnt)
    if (_strictNavigation) {
        _menuView.enableMenuButtonNavigation(_controller.pageCnt, _controller.totalPages);
    }
    if (_controller.pageCnt == _controller.totalPages) {
        _controller.nextDisable();
        nextBtn.css({
            cursor: "default",
            opacity: 0.5
        });
        nextBtn.prop("disabled", true);
    } else {
        _controller.nextEnable();
        $("#f_nextIndicator").show();
        indicatorAnimation();
    }
    checkCourseProgress();
    if ((pageDetail.type == 'Sections') || (pageDetail.type == 'sub-section')) {
        _controller.nextDisable();
    }
}
/*new chnage*/
Controller.prototype.backDisable = function () {
    backBtn.off("click mouseenter mouseleave", this.fnClick);
    backBtn.css({
        cursor: "default",
        opacity: 0.5
    });

    backBtn.prop("disabled", true);

    homeBtn.off("click mouseenter mouseleave", this.fnClick);
    homeBtn.css({
        cursor: "default",
        opacity: 0.5
    });
    homeBtn.prop("disabled", true);
};

Controller.prototype.backEnable = function () {
    backBtn
        .off("click mouseenter mouseleave")
        .on("click mouseenter mouseleave", this.fnClick);
    backBtn.css({
        cursor: "pointer",
        opacity: 1
    });

    backBtn.prop("disabled", false);

    homeBtn
        .off("click mouseenter mouseleave")
        .on("click mouseenter mouseleave", this.fnClick);
    homeBtn.css({
        cursor: "pointer",
        opacity: 1
    });
    homeBtn.prop("disabled", false);
};
/*new change*/
Controller.prototype.nextDisable = function () {
    nextBtn.off("click mouseenter mouseleave", this.fnClick);
    nextBtn.css({
        cursor: "default",
        opacity: 0.5
    });
    nextBtn.prop("disabled", true);
};

Controller.prototype.nextEnable = function () {
    nextBtn
        .off("click mouseenter mouseleave")
        .on("click mouseenter mouseleave", this.fnClick);
    nextBtn.css({
        cursor: "pointer",
        opacity: 1
    });
    nextBtn.prop("disabled", false);
};

Controller.prototype.gadgetDisable = function () {
    gadgetBtn.off("click mouseenter mouseleave", this.fnClick);
    gadgetBtn.css({
        cursor: "default",
        opacity: 0.5
    });

    gadgetBtnBottom.off("click mouseenter mouseleave", this.fnClick);
    gadgetBtnBottom.css({
        cursor: "default",
        opacity: 0.5
    });
};

Controller.prototype.gadgetEnable = function () {
    gadgetBtn
        .off("click mouseenter mouseleave")
        .on("click mouseenter mouseleave", this.fnClick);
    gadgetBtn.css({
        cursor: "pointer",
        opacity: 1
    });

    gadgetBtnBottom
        .off("click mouseenter mouseleave")
        .on("click mouseenter mouseleave", this.fnClick);
    gadgetBtnBottom.css({
        cursor: "pointer",
        opacity: 1
    });
};

Controller.prototype.transcriptDisable = function () {
    transBtn.off("click mouseenter mouseleave", this.fnClick);
    transBtn.css({
        cursor: "default",
        opacity: 0.2
    });
    transBtn.prop("disabled", true);
};
Controller.prototype.transcriptEnable = function () {
    transBtn
        .off("click mouseenter mouseleave")
        .on("click mouseenter mouseleave", this.fnClick);
    transBtn.css({
        cursor: "pointer",
        opacity: 1
    });
    transBtn.prop("disabled", false);
};
Controller.prototype.volumeBtnEnable = function () {
    volumeBtn
        .off("click mouseenter mouseleave")
        .on("click mouseenter mouseleave", this.fnClick);
    volumeBtn.css({
        cursor: "pointer",
        opacity: 1
    });
    volumeBtn.prop("disabled", false);
};

Controller.prototype.volumeBtnDisable = function () {
    volumeBtn.off("click mouseenter mouseleave", this.fnClick);
    volumeBtn.css({
        cursor: "default",
        opacity: 0.2
    });
    volumeBtn.prop("disabled", true);
};

function checkNavigationStatus() {
    if (settingInfo.audioRequired) {
        $("#f_volumeBtn").show();
    }

    if (settingInfo.helpRequired) {
        $("#f_helpBtn").show();
    }

    if (settingInfo.transcriptRequired) {
        $("#f_transcriptBtn").show();
    }

    if (settingInfo.ccRequired) {
        $("#f_ccBtn").show();
    }

    if (settingInfo.glossaryRequired) {
        $("#f_glossaryBtn").show();
    }

    if (settingInfo.resourceRequired) {
        $("#f_resourceBtn").show();
    }

    if (settingInfo.homeBtnRequired) {
        $("#f_homeBtn").show();
    }

    if (settingInfo.timeLineRequired) {
        $("#f_progresBarHolder").show();
        $("#f_mediaBtn").show();
    }

    if (settingInfo.settingBtnRequired) {
        $("#f_gadgetBtn").show();
    }
    $("#f_menuBtn").show();
    $(".f_navBtn").css({
        opacity: 1
    });
    /*  if(!isMobile){
         $(".f_gadgetnavBtn").css("display", "none"); 
      }else{
        $(".f_gadgetnavBtn").css("display", "block"); 
      }*/
}

function transcriptInitPos() {
    $("#f_transContent").scrollTop(0);
}

// ---------- dummy input box -------------
$("#dummyInput").on("keypress", function (e) {
    if (e.keyCode == 13) {
        var tmpPNo = parseInt($(this).val());
        _controller.pageCnt = tmpPNo - 1;
        _controller.updateViewNow();
        return false; // prevent the button click from happening
    }
});

//------------- SCORM -------------------------
function showResumeButton() {
    $(".playButton").on('click', function () {
        console.log("resume is happening")
        //$("#resumePlayBlock").hide();
        resumePage();
    })
}

function resumePage() {
    console.log("clicked on play button")
    // $("#resumeBlock").hide();
    $(".hideMain").show();
    getAllData();
}

function restartPage() {
    $("#resumeBlock").hide();
    var _menuData = model.menuData;
    visitedArr = [];
    _controller.moduleCnt = 0;
    _controller.pageCnt = 0;
    for (var i = 0; i < _menuData.length; i++) {
        if (_menuData[i].module.URL != "#") {
            visitedArr.push(0);
        } else {
            for (var j = 0; j < _menuData[i].module.page.length; j++) {
                if (_menuData[i].module.page[j].URL != "#") {
                    visitedArr.push(0);
                } else {
                    for (var k = 0; k < _menuData[i].module.page[j].subpage.length; k++) {
                        visitedArr.push(0);
                    }
                }
            }
        }
    }
    _controller.updateViewNow();
}

function getAllData() {
    _controller.pageCnt = pageCntSCO;
    if (bookMarkArray.length == 0) {
        if (visitedArr.length != 0) {
            bookMarkArray = visitedArr;
        }
    }
    if (bookMarkArray[0] == 1) {
        // console.log(bookMarkArray, "Arrrays")
        visitedArr = bookMarkArray;
    }

    //userIndputData = JSON.stringify(userIndputData);
    //userIndputData = JSON.parse(userData);
    _controller.updateViewNow();
}

//------------- SCROLLBAR FUNCTIONALITY -------------------------

function enableScrollBar(_elem, _theme) {
    if (!isIpad && !isMobile) {
        _elem.addClass("content mCustomScrollbar");
        _elem.mCustomScrollbar({
            scrollButtons: {
                enable: false
            },
            theme: _theme,
            scrollbarPosition: "outside"
        });
    }
}

function disableScrollBar(_elem, _boolean) {
    if (!isIpad && !isMobile) {
        if (_boolean) _elem.mCustomScrollbar("disable");
        else _elem.mCustomScrollbar("update");
    }
}

function destroyScrollBar(_elem) {
    if (!isIpad && !isMobile) {
        $(_elem).mCustomScrollbar("destroy");
    }
}

//----------------------- swipe -------------------
function detectswipe(el, func) {
    swipe_det = new Object();
    swipe_det.sX = 0;
    swipe_det.sY = 0;
    swipe_det.eX = 0;
    swipe_det.eY = 0;
    var min_x = 20; //min x swipe for horizontal swipe
    var max_x = 40; //max x difference for vertical swipe
    var min_y = 40; //min y swipe for vertical swipe
    var max_y = 50; //max y difference for horizontal swipe
    var direc = "";
    ele = document.getElementById(el);
    ele.addEventListener(
        "touchstart",
        function (e) {
            var t = e.touches[0];
            swipe_det.sX = t.screenX;
            swipe_det.sY = t.screenY;
        },
        false
    );
    ele.addEventListener(
        "touchmove",
        function (e) {
            e.preventDefault();
            var t = e.touches[0];
            swipe_det.eX = t.screenX;
            swipe_det.eY = t.screenY;

            //console.log(t.screenX)

            ele.style.left = swipe_det.eX;
        },
        false
    );
    ele.addEventListener(
        "touchend",
        function (e) {
            //horizontal detection
            // console.log(swipe_det.eX - min_x, swipe_det.sX)

            if (
                (swipe_det.eX - min_x > swipe_det.sX ||
                    swipe_det.eX + min_x < swipe_det.sX) &&
                (swipe_det.eY < swipe_det.sY + max_y &&
                    swipe_det.sY > swipe_det.eY - max_y)
            ) {
                if (swipe_det.eX > swipe_det.sX) direc = "r";
                else direc = "l";
            }
            //vertical detection
            if (
                (swipe_det.eY - min_y > swipe_det.sY ||
                    swipe_det.eY + min_y < swipe_det.sY) &&
                (swipe_det.eX < swipe_det.sX + max_x &&
                    swipe_det.sX > swipe_det.eX - max_x)
            ) {
                if (swipe_det.eY > swipe_det.sY) direc = "d";
                else direc = "u";
            }

            if (direc != "") {
                if (typeof func == "function") func(el, direc);
            }
            direc = "";
        },
        false
    );
}

function myfunction(el, d) {
    //console.log("you swiped on element with id '" + el + "' to " + d + " direction");
    switch (d) {
        case "r":
            if (_controller.pageCnt >= 1) {
                _controller.pageCnt--;
                _controller.updateViewNow();
            }

            break;

        case "l":
            _controller.pageCnt++;
            _controller.updateViewNow();
            break;
    }
}

//detectswipe('f_content', myfunction);

function enableTouchSwipe() {
    if (isDevice) {
        $("#f_pageLoader").swipe({
            swipe: function (event, direction) {
                console.log("You swiped " + direction);

                switch (direction) {
                    case "right":
                        if (_controller.pageCnt >= 1) {
                            _controller.pageCnt--;
                            _controller.updateViewNow();
                        }

                        break;

                    case "left":
                        if (_controller.pageCnt < _controller.totalPages) {
                            _controller.pageCnt++;
                            _controller.updateViewNow();
                        }
                        break;
                }
            },
            swipeStatus: function (event, phase) {
                if (phase == "cancel") {
                    console.log("You didnt swipe far enough ");
                }
            },
            threshold: 200,
            allowPageScroll: "auto"
        });
    }
}

//------------------- -------------- help player -------------- -------------- --------------
var helpVideoProgressWidth = 10;
var helpTimer = null;

function showHelpVideo() {
    visitedArr[0] = 1;
    $("#helpVideoHolder")
        .show()
        .css({});

    $(".hideMain").hide();
    helpVideoProgressWidth = parseInt($("#helpProgress").outerWidth());
    _helpVideoMedia.currentTime = 0;
    _helpVideoMedia.play();

    $("#skipHelpBtn").focus();

    $("#helpPlayBtn")
        .removeClass("helpPlay")
        .addClass("helpPause");
    $("#skipHelpBtn")
        .off("click")
        .on("click", skipHelpVideo);
    $("#helpPlayBtn")
        .off("click")
        .on("click", togglePlayHelpVideo);
    $("#helpReplayBtn")
        .off("click")
        .on("click", replayHelpVideo);
    $("#helpProgress")
        .off("mousedown")
        .on("mousedown", updateHelpVideoTime);
    $("#helpProgress")
        .off("touchstart")
        .on("touchstart", updateHelpVideoTime);
    _helpVideoMedia.addEventListener("timeupdate", helpUpdatePlaybackTime);
    _helpVideoMedia.addEventListener("ended", helpMediaEnded);

    //enable arrowleft and arrow right navigation
    //window.removeEventListener("keyup", keyNavigation);
}

function skipHelpVideo() {
    _helpVideoMedia.pause();
    _helpVideoMedia.currentTime = 0;
    checkDummyMediaLoaded();
    removeHelpVideoEvents();
    enableTouchSwipe();
}

function removeHelpVideoEvents() {
    $("#skipHelpBtn").off("click");
    $("#helpPlayBtn").off("click");
    $("#helpReplayBtn").off("click");
    $("#helpProgress").off("mousedown");
    $("#helpProgress").off("touchstart");
    _helpVideoMedia.removeEventListener("timeupdate", helpUpdatePlaybackTime);
    _helpVideoMedia.removeEventListener("ended", helpMediaEnded);
}

function helpUpdatePlaybackTime() {
    var progressWidth = Math.round(
        (_helpVideoMedia.currentTime / _helpVideoMedia.duration) *
        helpVideoProgressWidth
    );

    $("#helpProgressBar").css({
        width: progressWidth
    });
}

function helpMediaEnded() {
    _helpVideoMedia.pause();
    $("#helpPlayBtn")
        .removeClass("helpPause")
        .addClass("helpPlay");
    $("#helpVideoPlayer").removeClass("videoPlayer-fade-out");
}

function updateHelpVideoTime(e) {
    var _x = 0;
    var parentX = parseInt(
        $("#helpProgress")
            .parent()
            .offset().left
    );
    var currentX = parentX + parseInt($("#helpPlayBtn").outerWidth());

    if (e.originalEvent.touches) {
        touch = e.originalEvent.touches[0];
        helpUpdateProgressbar(touch.pageX);
        touchPageX = touch.pageX;
        $(document)
            .off("touchmove")
            .on("touchmove", progressBarMouseMove);
        $(document)
            .off("touchend")
            .on("touchend", progressBarMouseUp);
        _x = Math.round(touchPageX - currentX);
    } else {
        helpUpdateProgressbar(e.pageX);
        _x = Math.round(e.pageX - currentX);
        $(document)
            .off("mousemove")
            .on("mousemove", progressBarMouseMove);
        $(document)
            .off("mouseup")
            .on("mouseup", progressBarMouseUp);
    }

    _helpVideoMedia.pause();
    $("#helpPlayBtn")
        .removeClass("helpPause")
        .addClass("helpPlay");
    _helpVideoMedia.currentTime =
        (_x / helpVideoProgressWidth) * _helpVideoMedia.duration;

    if (_helpVideoMedia.currentTime >= _helpVideoMedia.duration) { } else {
        _helpVideoMedia.play();
        $("#helpPlayBtn")
            .removeClass("helpPlay")
            .addClass("helpPause");
    }
}

function helpUpdateProgressbar(_x) {
    var parentX = parseInt(
        $("#helpProgress")
            .parent()
            .offset().left
    );
    var currentX = parentX + parseInt($("#helpPlayBtn").outerWidth());
    var _width = Math.round(_x - currentX);

    if (_width <= 0) {
        _width = 0;
    }

    if (helpVideoProgressWidth <= _width) {
        _width = helpVideoProgressWidth;
    }

    $("#helpProgressBar").css({
        width: _width
    });
}

function progressBarMouseMove(e) {
    var _x = 0;
    var parentX = parseInt(
        $("#helpProgress")
            .parent()
            .offset().left
    );
    var currentX = parentX + parseInt($("#helpPlayBtn").outerWidth());

    if (e.originalEvent.touches) {
        touch = e.originalEvent.touches[0];
        helpUpdateProgressbar(touch.pageX);
        touchPageX = touch.pageX;
        _x = Math.round(touchPageX - currentX);
    } else {
        helpUpdateProgressbar(e.pageX);
        _x = Math.round(e.pageX - currentX);
    }

    _helpVideoMedia.pause();
    $("#helpPlayBtn")
        .removeClass("helpPause")
        .addClass("helpPlay");
    _helpVideoMedia.currentTime =
        (_x / helpVideoProgressWidth) * _helpVideoMedia.duration;
}

function progressBarMouseUp(e) {
    e.stopPropagation();
    var _x = 0;
    var parentX = parseInt(
        $("#helpProgress")
            .parent()
            .offset().left
    );
    var currentX = parentX + parseInt($("#helpPlayBtn").outerWidth());

    if (e.originalEvent.touches) {
        touch = e.originalEvent.touches[0];
        $(document).off("touchmove", progressBarMouseMove);
        $(document).off("touchend", progressBarMouseUp);
        _x = Math.round(touchPageX - currentX);
    } else {
        $(document).off("mousemove", progressBarMouseMove);
        $(document).off("mouseup", progressBarMouseUp);
        _x = Math.round(e.pageX - currentX);
    }

    _helpVideoMedia.pause();
    $("#helpPlayBtn")
        .removeClass("helpPause")
        .addClass("helpPlay");
    _helpVideoMedia.currentTime =
        (_x / helpVideoProgressWidth) * _helpVideoMedia.duration;

    if (_helpVideoMedia.currentTime >= _helpVideoMedia.duration) { } else {
        _helpVideoMedia.play();
        $("#helpPlayBtn")
            .removeClass("helpPlay")
            .addClass("helpPause");
    }
}

function togglePlayHelpVideo() {
    if ($("#helpPlayBtn").hasClass("helpPlay")) {
        _helpVideoMedia.play();
        $("#helpPlayBtn")
            .removeClass("helpPlay")
            .addClass("helpPause");
    } else {
        _helpVideoMedia.pause();
        $("#helpPlayBtn")
            .removeClass("helpPause")
            .addClass("helpPlay");
        $("#helpVideoPlayer").removeClass("videoPlayer-fade-out");
    }
}

function replayHelpVideo() {
    _helpVideoMedia.currentTime = 0;
    _helpVideoMedia.play();
    $("#helpPlayBtn")
        .removeClass("helpPlay")
        .addClass("helpPause");
}
//------------------- -------------- Course Progress -------------- -------------- --------------	
function checkCourseProgress() {
    console.log('checkCourseProgress .. ')
    let count = 0,
        percent = 0;
    for (let i = 0; i < visitedArr.length; i++) {
        if (visitedArr[i] == 1) {
            count++;
        }
    }
    percent = (count * 100) / visitedArr.length;
    percent = Math.round(Math.floor(percent));
    console.log('checkCourseProgress .. ', percent)
    courseProgress.html('Course Progress: ' + percent + ' %');
    $("#f_courseProgress").attr('aria-label', courseProgress.text())
}
/*
function showHideNavigationIcons(_boolean) {
    if(_boolean) {
        $("#f_navBtnContainer").show()
    } else {
        $("#f_navBtnContainer").hide()
    }
	
}
*/
$(".helpVidContent").on("mouseout", function () {
    $("#helpVideoPlayer").addClass("videoPlayer-fade-out");
});

$(".helpVidContent").on("mouseover", function () {
    $("#helpVideoPlayer").removeClass("videoPlayer-fade-out");
});

function closeTranscript() {
    $("#f_transContent").scrollTop(0);
    $("#f_transcriptContainer").hide(200, function () {
        $("#f_transContent").scrollTop(0);
        //enableScrollBar($("#f_transContent"), "dark");
        _transscriptOpen = false;
        _navbarUiElementsOpen = false;
        _controller.transcriptEnable();
        $("#f_transcriptContainer").css({
            right: "20%",
            bottom: "80px"
        });
    });
}
// newly functions global

function checkGlobalAudio() {

    const musicButtons = document.querySelectorAll('.music'); // all buttons
    if (!musicButtons.length) return;

    console.log("Global music playing:", _controller._globalMusicPlaying);

    musicButtons.forEach(button => {
        button.classList.toggle('playing', _controller._globalMusicPlaying);
        button.classList.toggle('mute', !_controller._globalMusicPlaying);
    });
}



function toggleFullscreen(btn) {

    playClickThen()

    const doc = document;
    const elem = doc.documentElement;


    const isFullscreen =
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.msFullscreenElement;

    if (!isFullscreen) {
        // OPEN fullscreen
        (elem.requestFullscreen ||
            elem.webkitRequestFullscreen ||
            elem.msRequestFullscreen).call(elem);

        setButtonState(btn, true);
    } else {
        // CLOSE fullscreen
        (doc.exitFullscreen ||
            doc.webkitExitFullscreen ||
            doc.msExitFullscreen).call(doc);

        setButtonState(btn, false);
    }

}

function setButtonState(btn, isFullscreen) {
    btn.classList.toggle("fullScreen", !isFullscreen);
    btn.classList.toggle("offScreen", isFullscreen);
    btn.setAttribute(
        "data-tooltip",
        isFullscreen ? "Normal View" : "Fullscreen"
    );
}

document.addEventListener("fullscreenchange", () => {
    const btn = document.getElementById("full-screen");
    setButtonState(btn, !!document.fullscreenElement);
});

function goHome(pageCount) {

    console.log("Incoming pageCount:", pageCount);

    playClickThen();

    // stop audio
    const audio = document.getElementById("simulationAudio");
    if (audio && typeof audio.pause === "function") {
        audio.pause();
        audio.currentTime = 0;
    }

    sessionStorage.setItem("stopAudio", "true");

    // HOME
    if (pageCount === -1) {
        location.reload();
        return;
    }

    // ✅ CHECK CURRENT PAGE TYPE (NOT TARGET)
    var currentPageDetail = _menuView.getPageDetails(_controller.pageCnt);
    var currentType = currentPageDetail?.type;

    console.log("Current page type:", currentType);

    // 👉 if leaving simulation/game → show popup
    if (currentType === 'simulation' || currentType === 'game') {

        console.log("Leaving simulation → show popup");

        $(".popup-home").css("display", "flex");

        // store where user wanted to go
        window.__nextPage = pageCount;

        return;
    }

    // normal navigation
    _controller.pageCnt = Number(pageCount);

    $(".home_btn").css({
        backgroundImage: "url(assets/images/home.png)"
    });

    _controller.updateViewNow();
    if (currentType === 'video') {
        $("footer").find("p").show();
    }
}

//------------------nav new global code added--------------------------
$(".popup-continue").on("click", function () {

    $(".popup-home").hide();

    if (window.__nextPage != null) {
        _controller.pageCnt = Number(window.__nextPage);
        _controller.updateViewNow();
    }
});





let simulationWasPlaying = false;


function getSimulationAudio() {

    return document.getElementById("simulationAudio");
}

function pauseSimulationAudio() {
    var pageDetail = _menuView.getPageDetails(_controller.pageCnt);
    var _pageType = pageDetail.type;

    const audio = getSimulationAudio();
    if (!audio) return;

    simulationWasPlaying = !audio.paused;
    audio.pause();

}

function resumeSimulationAudio() {
    console.log("woking @@@@@@@@@ resume")
    var pageDetail = _menuView.getPageDetails(_controller.pageCnt);
    var _pageType = pageDetail.type;

    const audio = getSimulationAudio();
    if (!audio) return;

    if (simulationWasPlaying && audio.src) {
        audio.play().catch(() => { });
    }

    simulationWasPlaying = false;

}
