var _menuData;
var pageCnt = 0;
var visitedArr = [];
var _menuView;
var getLessonTitle = [];
var getSubLessonTitle = [];
var getModuleLevelPageCount = [];
var pageLevelTwo, pageLevelThree

var MenuView = function () {
    this.events_Obj = [];
    this.data = {};
    _menuView = this;
    this.completedColor = '#00ff00';

    this.pageDetailsArr = [];
    this.levelPagesArr = [];
    this.totalPage = -1;
    this.currentPage = -1;
    this.currentModule = -1;
    this.currentLevelArr = [];
    this.moduleOuterHeight = [];
    this.pageOuterHeight = []
    this.accContainerArr = [];
}

MenuView.prototype.createMenu = function (_data) {
    _menuData = _data;
    var moduleToggleFlg = false;
    var pageToggleFlg = false;

    $('#f_hMenu').append('<ul></ul>');

    for (var i = 0; i < _menuData.length; i++) {
        var pagesCnt = 0;
        if (_menuData[i].module[0].URL != '#') {
            pagesCnt++;
            visitedArr.push(0);
            this.createModule(i);
        } else {
            moduleToggleFlg = true;
            this.createModulePage(i);
            for (var j = 0; j < _menuData[i].module[0].page.length; j++) {
                if (_menuData[i].module[0].page[j].URL != '#') {
                    getLessonTitle[pagesCnt] = _menuData[i].module[0].page[j].heading;
                    getSubLessonTitle[pagesCnt] = _menuData[i].module[0].page[j].subHeading
                    pagesCnt++;
                    visitedArr.push(0);
                    this.creatPage(i, j, _menuData[i].module[0].page[j].inMenuShow);
                    getModuleLevelPageCount[j] = 0;
                } else {
                    pageToggleFlg = true;
                    this.createSubPageContainer(i, j);
                    getModuleLevelPageCount[j] = [];
                    for (var k = 0; k < _menuData[i].module[0].page[j].subpage.length; k++) {
                        getLessonTitle[pagesCnt] = _menuData[i].module[0].page[j].heading;
                        getSubLessonTitle[pagesCnt] = _menuData[i].module[0].page[j].subpage[k].subHeading
                        pagesCnt++;
                        visitedArr.push(0);
                        getModuleLevelPageCount[j][k] = 0;
                        this.createSubPage(i, j, k, _menuData[i].module[0].page[j].subpage[k].inMenuShow);
                    }
                }
            }
        }
        this.levelPagesArr.push(pagesCnt)
    }

    this.totalPages = pageCnt;

    //scrom-----------
    totalPagesSCO = this.totalPages

    if (moduleToggleFlg) {
        $('.f_toggleMenuBtn').on('click', moduleToggleClicked);
    }

    if (pageToggleFlg) {
        $('.f_menuLevel_2').on('click', pageToggleClciked);
    }

    $('.f_pageBtn').on('click', menuPageClicked);

    $('.f_customMenupageBtn').on('click', customMenuPageClicked);

    this.updateCompletedStatus();

    enableScrollBar($("#f_accordContainer"), 'dark');
    enableScrollBar($("#f_subAccordContainer"), 'dark');
}


MenuView.prototype.createModule = function (moduleNo) {
    pageCnt++;

    $("#f_menuContent").append('<div class="menuContainers"><button class="f_menuLevel_1 f_pageBtn" id="f_pageId_' + (pageCnt - 1) + '" title= "' + _menuData[moduleNo].module[0].heading + '"><span class="f_statusBar"></span><span class= "f_menuText">' + _menuData[moduleNo].module[0].heading + '</span></button></div>');
    this.pageDetailsArr.push({
        level: [moduleNo + '_' + -1 + '_' + -1 + '_levelone' + '_pageId_' + pageCnt]
    });
}

MenuView.prototype.createModulePage = function (moduleNo) {
    $("#f_menuContent").append('<div class="menuContainers"><div id="f_accordContainer_' + moduleNo + '"><div class="f_accordContainer"></div></div></div>');
    this.pageDetailsArr.push({
        level: []
    });
    this.accContainerArr.push(moduleNo);
}

MenuView.prototype.creatPage = function (moduleNo, pageNo, visible) {
    pageCnt++;
    if (pageNo == 0) {
        $('#f_hMenu').find('ul').find('li').find('#f_moduleToggle_' + moduleNo).attr('data-index', 'f_moduleToggle_' + moduleNo + '_' + (pageCnt - 1))
    }

    $("#f_accordContainer_" + moduleNo).find('.f_accordContainer').append('<button class="f_menuLevel_2 f_pageBtn" id="f_pageId_' + (pageCnt - 1) + '" title="' + _menuData[moduleNo].module[0].page[pageNo].heading + '"><span class="f_menuText">' + _menuData[moduleNo].module[0].page[pageNo].heading + '</span></button>');

    this.pageDetailsArr[moduleNo].level.push(moduleNo + '_' + pageNo + '_' + -1 + '_leveltwo' + '_pageId_' + pageCnt);

    $('#f_accordContainer_' + moduleNo).find('.f_accordContainer').css({
        'margin-top': -$('#f_accordContainer_' + moduleNo).find('.f_accordContainer').outerHeight()
    });

    this.moduleOuterHeight.push($('#f_accordContainer_' + moduleNo).find('.f_accordContainer').outerHeight());

    if (visible != 'true')
        $("#f_pageId_" + (pageCnt - 1)).hide();
}
//<span class="f_statusBar"></span> Removed menu level status bar
MenuView.prototype.createSubPageContainer = function (moduleNo, pageNo) {
    $("#f_accordContainer_" + moduleNo).find('.f_accordContainer').append('<button class="f_menuLevel_2 lessonLevel" id="f_courseBtn_' + moduleNo + '_' + pageNo + '" title="' + _menuData[moduleNo].module[0].page[pageNo].heading + '"><span class="f_menuText">' + _menuData[moduleNo].module[0].page[pageNo].heading + '</span><span class="f_openClose menuPlusIcon"></span></button>');
    $("#f_accordContainer_" + moduleNo).find('.f_accordContainer').append('<div class="f_subAccordContainer" id="f_subAccordContainer_' + moduleNo + '_' + pageNo + '"><div class="f_level_2_container"></div></div>');
    this.pageOuterHeight[pageNo] = "";
}

MenuView.prototype.createSubPage = function (moduleNo, pageNo, subPageNo, visible) {
    pageCnt++;

    $('#f_subAccordContainer_' + moduleNo + '_' + pageNo).find('.f_level_2_container').append('<button class="f_menuLevel_3 f_pageBtn" id="f_pageId_' + (pageCnt - 1) + '" title="' + _menuData[moduleNo].module[0].page[pageNo].subpage[subPageNo].heading + '"><span class="f_statusBar"></span><span class= "f_menuText">' + _menuData[moduleNo].module[0].page[pageNo].subpage[subPageNo].heading + '</span></button>');

    this.pageDetailsArr[moduleNo].level.push(moduleNo + '_' + pageNo + '_' + subPageNo + '_levelthree' + '_pageId_' + pageCnt);

    var _height = $('#f_subAccordContainer_' + moduleNo + '_' + pageNo).find('.f_level_2_container').outerHeight();

    this.pageOuterHeight[pageNo] = moduleNo + '_level_' + pageNo + '_height_' + _height;
    if (visible != 'true')
        $("#f_pageId_" + (pageCnt - 1)).hide();
}


function moduleToggleClicked(evt) {
    var getId = $(this).attr('id').split('_');
    var id = parseInt(getId[2]);

    if ($(this).val() == 'toggle') {
        $(this).attr('value', 'notToggle');
        $(this).css({
            'backgroundColor': "#2e2e38"
        });
        $(this).find('.f_menuText').css({
            'color': '#fff'
        });
        $(this).find('.f_openClose').removeClass("menuMinusIcon").addClass("menuPlusIcon");
        $('#f_accordContainer_' + id).stop().animate({
            height: 0
        }, 300, function () {
            $('#f_accordContainer_' + id).css({
                'display': 'none'
            })
        });

        $('#f_accordContainer_' + id).find('.f_accordContainer').stop().animate({
            'margin-top': -$('#f_accordContainer_' + id).find('.f_accordContainer').outerHeight()
        }, 300);

    } else {
        $(this).attr('value', 'toggle');
        $(this).css({
            'backgroundColor': "#2e2e38"
        });
        $(this).find('.f_menuText').css({
            'color': '#ffe600'
        });
        $(this).find('.f_openClose').removeClass("menuPlusIcon").addClass("menuMinusIcon");
        $('#f_accordContainer_' + id).css({
            'display': 'block'
        })
        $('#f_accordContainer_' + id).stop().animate({
            height: $('#f_accordContainer_' + id).find('.f_accordContainer').outerHeight()
        }, 300);
        $('#f_accordContainer_' + id).find('.f_accordContainer').stop().animate({
            'margin-top': 0
        }, 300);
    }
}

function pageToggleClciked(evt) {
    //_menuView.hideMenuTab();
    var getId = $(this).attr('id').split('_')
    var moduleId = parseInt(getId[2]);
    var pageId = parseInt(getId[3]);
    if ($(this).val() == 'toggle') {
        $(this).attr('value', 'notToggle');
        $(this).css({
            'backgroundColor': "#2e2e38"
        });
        $(this).find('.f_menuText').css({
            'color': '#fff'
        });
        $(this).find('.f_openClose').removeClass("menuMinusIcon").addClass("menuPlusIcon");
        $('#f_subAccordContainer_' + moduleId + '_' + pageId).stop().animate({
            height: 0
        }, 300, function () {
            $('#f_subAccordContainer_' + moduleId + '_' + pageId).css({
                'display': 'none'
            });
        });

        $('#f_accordContainer_' + moduleId).css({
            'height': 'auto'
        })

        $('#f_subAccordContainer_' + moduleId + '_' + pageId).find('.f_level_2_container').stop().animate({
            'margin-top': -$('#f_subAccordContainer_' + moduleId + '_' + pageId).find('.f_level_2_container').outerHeight()
        }, 300);
    } else {
        $(this).attr('value', 'toggle');
        $(this).css({
            'backgroundColor': "#2e2e38"
        });
        $(this).find('.f_menuText').css({
            'color': '#ffe600'
        });

        $(this).find('.f_openClose').removeClass("menuPlusIcon").addClass("menuMinusIcon");
        $('#f_subAccordContainer_' + moduleId + '_' + pageId).css({
            'display': 'block'
        });
        $('#f_subAccordContainer_' + moduleId + '_' + pageId).stop().animate({
            height: $('#f_subAccordContainer_' + moduleId + '_' + pageId).find('.f_level_2_container').outerHeight()
        }, 300);

        $('#f_accordContainer_' + moduleId).css({
            'height': 'auto'
        })

        $('#f_subAccordContainer_' + moduleId + '_' + pageId).find('.f_level_2_container').stop().animate({
            'margin-top': 0
        }, 300);
    }
}

function menuPageClicked(evt) {
    var getId = $(this).attr('id').split('_');
    var id = parseInt(getId[2]);
    _menuView.hideMenuTab();
    _menuView.currentPage = id;
    _menuView.dispatchCustomEvent("MenuClicked");
    enableWheel();
    console.log("clicked")
    $('#f_header').find('#f_companyLogo').find('img').focus()
}

function customMenuPageClicked(evt) {
    var getId = $(this).attr('data-index').split('_');

    var id = parseInt(getId[getId.length - 1]);
    var moduleIndx = parseInt(getId[getId.length - 2]);
    _menuView.currentPage = id;
    _menuView.currentModule = moduleIndx + 1;
    _menuView.dispatchCustomEvent("MenuClicked");
    enableWheel();
}

MenuView.prototype.updateActiveState = function (arg) {

    for (var i = 0; i < _menuData.length; i++) {
        if ($('#f_hMenu').find('ul').find('li:nth-child(' + (i + 1) + ')').find('a').hasClass('active')) {
            $('#f_hMenu').find('ul').find('li:nth-child(' + (i + 1) + ')').find('a').removeClass('active')
        }
    }
    $('#f_hMenu').find('ul').find('li:nth-child(' + arg + ')').find('a').addClass('active')
}

MenuView.prototype.dispatchCustomEvent = function (arg) {
    this.events_Obj[0].funcCallBack();
};

MenuView.prototype.updateCompletedStatus = function () {
    var pageCnt = 0;
    for (var l = 0; l < visitedArr.length; l++) {
        if (visitedArr[l] == 1) {
            $('#f_pageId_' + l).find('.f_statusBar').addClass('f_pageCompleted')
            //$('#f_pageId_' + l).find('.f_menuText').addClass('f_pageCompleted')
        }
    }

    for (var i = 0; i < _menuData.length; i++) {
        var levelOneCnt = 0;
        if (_menuData[i].module[0].URL != '#') {
            pageCnt++;
            if (visitedArr[pageCnt - 1] == 1) {
                levelOneCnt++;
            }
        } else {
            for (var j = 0; j < _menuData[i].module[0].page.length; j++) {
                if (_menuData[i].module[0].page[j].URL != '#') {
                    pageCnt++;
                    if (visitedArr[pageCnt - 1] == 1) {
                        levelOneCnt++;
                    }
                } else {
                    var levelTwoCnt = 0;
                    for (var k = 0; k < _menuData[i].module[0].page[j].subpage.length; k++) {
                        pageCnt++;
                        if (visitedArr[pageCnt - 1] == 1) {
                            levelOneCnt++;
                            levelTwoCnt++;
                        }
                    }

                    if (_menuData[i].module[0].page[j].subpage.length == levelTwoCnt) {
                        $('#f_courseBtn_' + i + '_' + j).find('.f_statusBar').removeClass('f_pageInprogress').addClass('f_pageCompleted');
                    } else {
                        if (levelTwoCnt != 0) {
                            $('#f_courseBtn_' + i + '_' + j).find('.f_statusBar').addClass('f_pageInprogress');
                        }
                    }
                }
            }
        }

        if (this.levelPagesArr[i] == levelOneCnt) {
            $('#f_moduleToggle_' + i).find('.f_statusBar').removeClass('f_pageInprogress').addClass('f_pageCompleted');
        } else {
            if (levelOneCnt != 0) {
                $('#f_moduleToggle_' + i).find('.f_statusBar').addClass('f_pageInprogress');
            }
        }
    }

    this.showMenuTab();
}

MenuView.prototype.getPageDetails = function (_id) {
    $('.f_pageBtn').find('.f_statusBar').removeClass('f_pageInprogressIcon')
    $('#f_pageId_' + _id).find('.f_statusBar').addClass('f_pageInprogressIcon');
    $('.f_pageBtn').removeClass('f_pageInprogressText')
    $('#f_pageId_' + _id).addClass('f_pageInprogressText');

    for (var i = 0; i < this.pageDetailsArr.length; i++) {
        for (var j = 0; j < this.pageDetailsArr[i].level.length; j++) {
            var levelone = -1;
            var leveltwo = -1;
            var levelthree = -1;
            var levels = -1;
            var pageId = -1;
            var levelSplit = this.pageDetailsArr[i].level[j].split('_');
            levelone = parseInt(levelSplit[0]);
            leveltwo = parseInt(levelSplit[1]);
            levelthree = parseInt(levelSplit[2]);

            levels = String(levelSplit[3]);

            pageId = parseInt(levelSplit[5]) - 1;

            this.currentLevelArr = [];
            this.currentLevelArr.push(levelone);
            this.currentLevelArr.push(leveltwo);
            this.currentLevelArr.push(levelthree);
            pageLevelTwo = leveltwo;
            pageLevelThree = levelthree;


            if (pageId == _id) {
                var pageData = {
                    heading: '',
                    URL: ''
                }

                switch (levels) {
                    case 'levelone':

                        pageData.heading = _menuData[levelone].module[0].heading;
                        pageData.URL = _menuData[levelone].module[0].URL;
                        pageData.courseTitle = _menuData[levelone].courseName;
                        pageData.hasAudio = _menuData[levelone].module[0].hasAudio;
                        pageData.hasVideo = _menuData[levelone].module[0].hasVideo;
                        pageData.assessment = _menuData[levelone].module[0].assessment;
                        pageData.type = _menuData[levelone].module[0].type;

                        break;
                    case 'leveltwo':
                        pageData.heading = _menuData[levelone].module[0].page[leveltwo].heading;
                        pageData.URL = _menuData[levelone].module[0].page[leveltwo].URL;
                        pageData.courseTitle = _menuData[levelone].courseName;
                        pageData.hasAudio = _menuData[levelone].module[0].page[leveltwo].hasAudio;
                        pageData.hasVideo = _menuData[levelone].module[0].page[leveltwo].hasVideo;
                        pageData.type = _menuData[levelone].module[0].page[leveltwo].type;
                        break;
                    case 'levelthree':
                        pageData.heading = _menuData[levelone].module[0].page[leveltwo].subpage[levelthree].heading;
                        pageData.URL = _menuData[levelone].module[0].page[leveltwo].subpage[levelthree].URL;
                        pageData.courseTitle = _menuData[levelone].courseName;
                        pageData.hasAudio = _menuData[levelone].module[0].page[leveltwo].subpage[levelthree].hasAudio;
                        pageData.hasVideo = _menuData[levelone].module[0].page[leveltwo].subpage[levelthree].hasVideo;
                        pageData.type = _menuData[levelone].module[0].page[leveltwo].subpage[levelthree].type;
                        break;
                    default:
                }
                return pageData;

            }
        }
    }
}

MenuView.prototype.showMenuTab = function () {
    var levelOne = this.currentLevelArr[0];
    var levelTwo = this.currentLevelArr[1];
    var levelThree = this.currentLevelArr[2] - 1;
    if (levelTwo != -1) {
        var id = levelOne;
        var _this = $('#f_moduleToggle_' + id);
        _this.attr('value', 'toggle');
        _this.css({
            'backgroundColor': "#2e2e38"
        });
        _this.find('.f_menuText').css({
            'color': '#ffe600'
        });

        $(".f_menuLevel_2").find('.f_openClose').addClass("menuPlusIcon").removeClass("menuMinusIcon");
        _this.find('.f_openClose').removeClass("menuPlusIcon").addClass("menuMinusIcon");
        $('#f_accordContainer_' + id).css({
            'display': 'block'
        });
        setTimeout(function () {
            $('#f_accordContainer_' + id).css({
                height: $('#f_accordContainer_' + id).find('.f_accordContainer').outerHeight()
            });

            $('#f_accordContainer_' + id).find('.f_accordContainer').css({
                'margin-top': 0
            });

        }, 50)
    }

    if (levelThree != -1) {
        var _thisDiv = $('#f_courseBtn_' + levelOne + '_' + levelTwo)
        console.log('f_courseBtn_' + levelOne + '_' + levelTwo)
        _thisDiv.attr('value', 'toggle');
        _thisDiv.css({
            'backgroundColor': "#2e2e38"
        });
        _thisDiv.find('.f_menuText').css({
            'color': '#ffe600'
        });
        _thisDiv.find('.f_openClose').removeClass("menuPlusIcon").addClass("menuMinusIcon");
        $('#f_subAccordContainer_' + levelOne + '_' + levelTwo).css({
            'display': 'block'
        });
        setTimeout(function () {
            $('#f_subAccordContainer_' + levelOne + '_' + levelTwo).css({
                height: $('#f_subAccordContainer_' + levelOne + '_' + levelTwo).find('.f_level_2_container').outerHeight()
            });

            $('#f_accordContainer_' + levelOne).css({
                'height': 'auto'
            })

            $('#f_subAccordContainer_' + levelOne + '_' + levelTwo).find('.f_level_2_container').css({
                'margin-top': 0
            });

        }, 50)
    }


}

MenuView.prototype.hideMenuTab = function () {
    for (var m = 0; m < this.pageOuterHeight.length; m++) {
        var str = this.pageOuterHeight[m];
        var splitArr;
        var moduleId = -1;
        var pageId = -1;
        var _height = -1;
        if (str) {
            splitArr = str.split('_')
            moduleId = parseInt(splitArr[0]);
            pageId = parseInt(splitArr[2]);
            _height = parseInt(splitArr[4]);
            var _this = $('#f_moduleToggle_' + moduleId);
            _this.attr('value', 'toggle');
            _this.css({
                'backgroundColor': "#2e2e38"
            });
            _this.find('.f_menuText').css({
                'color': '#ffe600'
            });
            _this.find('.f_openClose').removeClass("menuMinusIcon").addClass("menuPlusIcon");
            $('#f_accordContainer_' + moduleId).css({
                height: 0
            })
            $('#f_accordContainer_' + moduleId).css({
                'display': 'none'
            });

            $('#f_accordContainer_' + moduleId).find('.f_accordContainer').css({
                'margin-top': -this.moduleOuterHeight[moduleId]
            });

            var _thisDiv = $('#f_courseBtn_' + moduleId + '_' + pageId)
            _thisDiv.attr('value', 'notToggle');
            _thisDiv.css({
                'backgroundColor': "#2e2e38"
            });
            _thisDiv.find('.f_menuText').css({
                'color': '#fff'
            });
            //_thisDiv.find('.f_openClose').removeClass("menuPlusIcon").addClass("menuMinusIcon");

            $('#f_subAccordContainer_' + moduleId + '_' + pageId).css({
                height: 0
            })

            $('#f_accordContainer_' + moduleId).css({
                'height': 'auto'
            })
        }

        $('#f_subAccordContainer_' + moduleId + '_' + pageId).find('.f_level_2_container').css({
            'margin-top': -_height
        });

        $('#f_subAccordContainer_' + moduleId + '_' + pageId).css({
            'display': 'none'
        });
    }
}

MenuView.prototype.removeButtonNavigation = function (_curPage) {
    for (var l = 0; l < visitedArr.length; l++) {
        $('#f_pageId_' + l).off('click').css({
            'cursor': 'default',
            'opacity': 0.5

        });
        $('#f_pageId_' + l).prop("disabled", true);
        if (visitedArr[l] == 1) {
            $('#f_pageId_' + l).css({
                'cursor': 'pointer',
                'opacity': 1

            });
            $('#f_pageId_' + l).prop("disabled", false);
            $('#f_pageId_' + l).off('click').on('click', menuPageClicked);

        }
    }
    for (let l = 0; l < visitedArr.length; l++) {
        let np = l + 1;
        np = (np <= visitedArr.length) ? np : visitedArr.length - 1;
        if (visitedArr[l] == 1) {
            $('#f_pageId_' + l + ', #f_pageId_' + np).css({
                'cursor': 'pointer',
                'opacity': 1
            });

            $('#f_pageId_' + _curPage).prop("disabled", false);
            $('#f_pageId_' + l + ', #f_pageId_' + np).off('click').on('click', menuPageClicked);
        }
    }
    $('#f_pageId_' + _curPage).off('click').on('click', menuPageClicked);
    $('#f_pageId_' + _curPage).css({
        'cursor': 'pointer',
        'opacity': 1
    });
    $('#f_pageId_' + _curPage).prop("disabled", false);
}
MenuView.prototype.enableMenuButtonNavigation = function (_curPage, _totalPage) {
    let nextPage = (_curPage + 1);
    nextPage = (nextPage <= _totalPage) ? nextPage : _totalPage;
    $('#f_pageId_' + _curPage + ', #f_pageId_' + nextPage).off('click').on('click', menuPageClicked);
    $('#f_pageId_' + _curPage + ', #f_pageId_' + nextPage).css({
        'cursor': 'pointer',
        'opacity': 1
    });
    $('#f_pageId_' + _curPage + ', #f_pageId_' + nextPage).prop("disabled", false);
}
MenuView.prototype.hideMenuContainer = function () {
    for (var i = 0; i < this.accContainerArr.length; i++) {
        $('#f_accordContainer_' + this.accContainerArr[i]).hide();
    }
}

MenuView.prototype.updateVisitedStatus = function (_id) {
    visitedArr[_id] = 1;
    bookMarkArray = visitedArr;
    //userData = JSON.stringify(userIndputData);
    checkCompletionStatus();

    if (pageLevelThree == -1) {
        getModuleLevelPageCount[pageLevelTwo] = 1;
    } else {
        getModuleLevelPageCount[pageLevelTwo][pageLevelThree] = 1;
    }

}

MenuView.prototype.addCustomEvent = function (evet, callback) {
    this.events_Obj.push({
        "eventName": evet,
        "funcCallBack": callback
    });
};