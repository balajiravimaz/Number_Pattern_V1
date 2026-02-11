var storeCurrentAudioTime = 0;
var storeCurrentPopupAudioTime = 0;
var _audioRequired = false;
var _videoRequired = false;
var _pageAudioSync = true;
var _forceNavigation = false;
var _popupAudio = false;
var _reloadRequired = true;
var _levelOneReloadRequired = true;

var _videoId = null;
var _audioId = null;

// -------- Assign audio for play ------------
function assignAudio(_audioSRC, _ccIndx, _audioSync, _restriction, videoId, _popAudio, _reloadRequ, _mediaLevel) {
    var ccObj = _pageData.ccText[_ccIndx];
    var transcriptObj = _pageData.transcriptText[_ccIndx];
    //console.log("transcript", transcriptObj)
    loadMedia(_audioSRC, ccObj, _audioSync, _restriction, transcriptObj, videoId, _popAudio, _reloadRequ, _mediaLevel);
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

// -------- Move to page top ------------
function moveToTop() {
    $('#f_wrapper').scrollTop(0);
}


// -------- Set and Remove Button Disabled ------------
function setButtonDisabled(_elem) {
    _elem.attr("disabled", "disabled");
    _elem.attr("aria-disabled", "true");
}

function removeButtonDisabled(_elem) {
    _elem.removeAttr("disabled");
    _elem.attr("aria-disabled", "false");
}
// -------- main audio reset functions ------------
function reEnableMainAudio(_dataID, _dataIndx, _reload, _mediaLevel) {

    assignAudio(_dataID, _dataIndx, _pageAudioSync, _forceNavigation, _videoId, _popupAudio, _reload, _mediaLevel);
    storeCurrentAudioTime = currentMedia.duration;
    resetAudio(_mediaLevel);
}

// -------- popup audio functions ------------
function enablePopupAudio(_dataIndx, _reload, _mediaLevel) {
    _popupAudioPlaying = false;
    pauseLevelAudio(_mediaLevel);
    updatePopupAudio(_dataIndx, _reload, _mediaLevel);
}

function pauseLevelAudio(_mediaLevel) {
    switch (_mediaLevel) {
        case 1:
            storeCurrentAudioTime = currentMedia.currentTime;
            currentMedia.pause();
            currentMedia.removeEventListener('timeupdate', checkTimeUpdate);
            break;

        case 2:
            storeCurrentAudioTime = currentMedia.currentTime;
            currentMedia.pause();
            currentMedia.removeEventListener('timeupdate', checkTimeUpdate);

            storeCurrentPopupAudioTime = mediaLevelOne.currentTime;
            mediaLevelOne.pause();
            mediaLevelOne.removeEventListener('timeupdate', checkTimeUpdate);
            break;
    }
}


function updatePopupAudio(_data, _reload, _mediaLevel) {
    _checkAudioFlag = false;
    _popupAudio = true;
    console.log("audio>", _data)
    _popupAudioPlaying = true;
    assignAudio(_data.audio.audioSRC, _data.audio.audioIndex, _pageAudioSync, _forceNavigation, _videoId, _popupAudio, _reload, _mediaLevel);
}

function resetAudio(_mediaLevel) {
    console.log("mediaLevel", mediaLevel)
    switch (mediaLevel) {
        case 1:
            if (_popTweenTimeline) {
                _popTweenTimeline.kill();
            }
            _popTweenTimeline = null;

            mediaLevelOne.pause();
            _popupAudio = false;
            _reloadRequired = false;

            currentMedia.currentTime = storeCurrentAudioTime - 0.2;
            mediaLevel = undefined;
            break;
        case 2:
            mediaLevelTwo.pause();
            mediaLevelOne.currentTime = storeCurrentPopupAudioTime - 0.2;
            mediaLevel = 1;
            break;
    }

    if (!forceAudioPause) {
        pausePlay = 'pause';
        playBack.checkPlayPause();
    }

    initPageAnimations();
}


function resetMainAudio(_data) {
    if (_popTweenTimeline) {
        _popTweenTimeline.kill();
    }
    _popTweenTimeline = null;

    mediaLevelOne.pause();
    _popupAudio = false;
    _reloadRequired = false;

    currentMedia.currentTime = storeCurrentAudioTime - 0.2;
    mediaLevel = undefined;

    if (!forceAudioPause) {
        popupMedia = false;
        pausePlay = 'pause';
        playBack.checkPlayPause();
    }

    initPageAnimations();
}

function resetPopupAudio(_data) {
    _reloadRequired = false;

    mediaLevelOne.currentTime = storeCurrentPopupAudioTime - 0.2;
    mediaLevel = 1;

    if (!forceAudioPause) {
        pausePlay = 'pause';
        playBack.checkPlayPause();
    }

    initPageAnimations();
}


//--------------- openHyperlink -----------------
var curBtn = null;

function openHyperlink(e) {
    var _data = e.data.param;
    curBtn = $(this);
    curBtn.addClass('visited');

    var _linkData = curBtn.data('type');
    var _indx = parseInt(curBtn.data('indx'));

    switch (_linkData) {
        case 'link':
            openLink(_data.hyperlinks[_indx].url);
            break;
        case 'popup':
            generatePopup(_data.hyperlinks[_indx], curBtn, _data, 'popup');
            break;
        case 'videolink':
            _playbackView.pauseAudio();
            var win = window.open(_data.hyperlinks[_indx].url, '_blank', 'location=yes,height=840,width=870,scrollbars=yes,status=yes');
            win.focus();
            break;
        case 'popupImage':
            var tmpType = 'popupImage'
            generatePopup(_data.hyperlinks[_indx], curBtn, _data, null, tmpType);
    }
}

// -------- open url functions ------------
function openLink(_url) {
    _playbackView.pauseAudio();
    var win = window.open(_url, '_blank');
    win.focus();
}

//--------------- open Video link ---------------
function openVideoLink(e) {
    var link = e.data.param;
    _playbackView.pauseAudio();
    var win = window.open(link, '_blank', 'location=yes,height=840,width=870,scrollbars=yes,status=yes');
    win.focus();
}

// -------- Replace element with new element ------------
function replaceTargetWith(targetID, html) {
    /// find our target
    var i, tmp, elm, last, target = document.getElementById(targetID);
    /// create a temporary div or tr (to support tds)
    tmp = document.createElement(html.indexOf('<td') != -1 ? 'tr' : 'div');
    /// fill that div with our html, this generates our children
    tmp.innerHTML = html;
    /// step through the temporary div's children and insertBefore our target
    i = tmp.childNodes.length;
    /// the insertBefore method was more complicated than I first thought so I 
    /// have improved it. Have to be careful when dealing with child lists as  
    /// they are counted as live lists and so will update as and when you make
    /// changes. This is why it is best to work backwards when moving children 
    /// around, and why I'm assigning the elements I'm working with to `elm` 
    /// and `last`
    last = target;
    while (i--) {
        target.parentNode.insertBefore((elm = tmp.childNodes[i]), last);
        last = elm;
    }
    /// remove the target.
    target.parentNode.removeChild(target);
}

//----------------- create equations ------------
function createEquation(_elem, _data) {
    var noOfEquations = _elem.find('span').length;
    var equationHolder = null;

    if (noOfEquations > 0) {
        for (var i = 0; i < noOfEquations; i++) {
            equationHolder = _elem.find('span').eq(i);
            var svgId = equationHolder.data('id');
            equationHolder.attr('id', 'equationId_' + svgId);
            equationHolder.attr('class', 'equation');

            if (equationHolder.data('type') != 'equationImage') {
                equationHolder.append(_data.equations[svgId]);
                equationHolder.find('svg').attr('role', 'img');
            } else {
                equationHolder.append('<img src="' + _data.equationImage[svgId].imageSRC + '" />');
                equationHolder.find('img').attr('title', _data.equationImage[svgId].title);
            }
        }
    }
}

//----------------- Generate Table ------------
function generateTable(_parentDiv, _tableData, _pageContent) {
    if (_tableData != undefined) {
        _parentDiv.append('<div class="table_container"></div>');

        for (var i = 0; i < _tableData.length; i++) {
            if (_tableData[i].tableHead.length > 0) {
                $(".table_container").append("<table class='cc_table left' id='table_" + i + "'><thead><tr></tr></thead><tbody></tbody></table>");

                for (var j = 0; j < _tableData[i].tableHead.length; j++) {
                    $("#table_" + i).find("thead tr").append('<th>' + _tableData[i].tableHead[j] + '</th>');
                    //----------create equation----------
                    createEquation($("#table_" + i).find("thead tr").find('th').eq(j), _pageContent);
                }
            } else {
                $(".table_container").append("<table class='cc_table left' id='table_" + i + "'><tbody></tbody></table>");
            }


            for (var k = 0; k < _tableData[i].tableBody.length; k++) {
                $("#table_" + i).find("tbody").append('<tr></tr>');
                for (var n = 0; n < _tableData[i].tableBody[k].length; n++) {
                    if (_tableData[i].tableBody[k][n].colspan > 0) {
                        $("#table_" + i).find("tbody tr").eq(k).append('<td colspan="' + _tableData[i].tableBody[k][n].colspan + '">' + _tableData[i].tableBody[k][n].text + '</td>');
                    } else {
                        $("#table_" + i).find("tbody tr").eq(k).append('<td>' + _tableData[i].tableBody[k][n].text + '</td>');
                    }

                    //----------create equation----------
                    createEquation($("#table_" + i).find("tbody tr").eq(k).find('td').eq(n), _pageContent);
                }
            }
        }
    }
}



function generatePopupTable(_parentDiv, _tableData, _pageContent) {
    if (_tableData != undefined) {
        _parentDiv.append('<div class="table_container"></div>');

        for (var i = 0; i < _tableData.length; i++) {
            if (_tableData[i].tableHead.length > 0) {
                _parentDiv.find(".table_container").append("<table class='cc_table left' id='table_" + _tableData[i].id + "'><thead><tr></tr></thead><tbody></tbody></table>");

                for (var j = 0; j < _tableData[i].tableHead.length; j++) {
                    $("#table_" + _tableData[i].id).find("thead tr").append('<th>' + _tableData[i].tableHead[j] + '</th>');
                    //----------create equation----------
                    createEquation($("#table_" + _tableData[i].id).find("thead tr").find('th').eq(j), _pageContent);
                }
            } else {
                _parentDiv.find(".table_container").append("<table class='cc_table left' id='table_" + _tableData[i].id + "'><tbody></tbody></table>");
            }


            for (var k = 0; k < _tableData[i].tableBody.length; k++) {
                $("#table_" + _tableData[i].id).find("tbody").append('<tr></tr>');
                for (var n = 0; n < _tableData[i].tableBody[k].length; n++) {
                    if (_tableData[i].tableBody[k][n].colspan > 0) {
                        $("#table_" + _tableData[i].id).find("tbody tr").eq(k).append('<td colspan="' + _tableData[i].tableBody[k][n].colspan + '">' + _tableData[i].tableBody[k][n].text + '</td>');
                    } else {
                        $("#table_" + _tableData[i].id).find("tbody tr").eq(k).append('<td>' + _tableData[i].tableBody[k][n].text + '</td>');
                    }

                    //----------create equation----------
                    createEquation($("#table_" + _tableData[i].id).find("tbody tr").eq(k).find('td').eq(n), _pageContent);
                }
            }
        }
    }
}

//---------------- Add Instruction Text -------------
function generateInstructionText(_pageContent, _parentElem) {
    if (_pageContent.instruction != undefined) {
        if (_pageContent.instruction.text != '') {
            _parentElem.append("<p class='instruction'>" + _pageContent.instruction.text + "</p>");

            if (_parentElem.find(".instruction").find('span').length > 0) {
                _parentElem.find(".instruction").find('span').addClass('tipIconSmall').css({
                    'background-image': 'url(' + _pageContent.instruction.icon.imageSRC + ')',
                    'margin-top': '3px'
                });
            }
        }
    }
}

//------------- generate List item ---------------
function generateListItem(_listData, _parentElem, _indx) {
    var listSubCnt = 0;

    if (_listData.type == 'number') {
        _parentElem.append("<ol type='" + _listData.numberType + "' class='list_items_number list' id='list_" + _indx + "'></ol>");
    } else {
        _parentElem.append("<ul class='list_items list' id='list_" + _indx + "'></ul>");
    }

    for (var j = 0; j < _listData.content.length; j++) {
        if (typeof _listData.content[j] != "object") {
            _parentElem.find("#list_" + _indx).append("<li>" + _listData.content[j] + "</li>");
            _parentElem.find("#list_" + _indx).find('li').find('a').addClass('hyperlinks').attr('href', 'javascript:void(null);');
        } else {
            //------ list items ------
            if (_listData.content[j].listItem.type != '') {
                listSubCnt++;
                generateListItem(_listData.content[j].listItem, _parentElem.find("#list_" + _indx).find('li'), listSubCnt);
            }
        }
        //----------create equation----------
        createEquation(_parentElem.find("#list_" + _indx).find('li').eq(j), _pageData);
    }
}

//-------------- generate decorative image -----------------
function generateDecorativeImage(_imgData, _elem) {
    var zoomIcon = "assets/images/global/zoom_icon.png";

    for (var k = 0; k < _imgData.length; k++) {
        if (_imgData[k].zoomImage != undefined) {
            _elem.append('<div class="image_Frame zoom_btn_holder"><img src="' + _imgData[k].imageSRC + '"  aria-hidden="true"><div class="zoomIcon"></div><button type="button" class="zoomBtn" id="zoomBtn_' + k + '" aria-label="Image ' + _imgData[k].zoomImage.altText + '"></button></div>');

            //_elem.append('<div class="image_Frame zoom_btn_holder zoomBtn" id="zoomBtn_' + k + '" role="button" aria-label="Image ' + _imgData[k].zoomImage.altText + '" tabindex="0"><img src="' + _imgData[k].imageSRC + '" aria-hidden="true"><div class="zoomIcon"></div></div>');

            $(".zoomIcon").css({
                'background-image': 'url(' + zoomIcon + ')'
            });

            $(".zoomBtn").off('click').on('click', {
                param: _imgData
            }, generateZoomPopup);

            if (_imgData[k].width != undefined) {
                _elem.find('img').eq(k).parent().css({
                    'width': _imgData[k].width
                });
            }

        } else {
            _elem.append('<img class="image_Frame" id="imgId_' + k + '" src="' + _imgData[k].imageSRC + '"  >');

            if (_imgData[k].altText != '')
                _elem.find('#imgId_' + k).attr('alt', _imgData[k].altText);
            else
                _elem.find('#imgId_' + k).attr('aria-hidden', 'true');


            if (_imgData[k].width != undefined) {
                _elem.find('img').eq(k).css({
                    'width': _imgData[k].width
                })
            }
        }
    }
}

//----------------- replace null images into div ------------
function replaceImgToDiv(_parent, _obj, _id) {
    for (var l = 0; l < _obj.length; l++) {
        if (_obj[l].altText == '') {
            _parent.append("<div class='decorative-image image_Frame' id='img_" + l + "'></div>");

            var imgW = $("#" + (_id + l)).outerWidth();
            var imgH = $("#" + (_id + l)).outerHeight();

            $("#img_" + l).css({
                'background-image': 'url(' + _obj[l].imageSRC + ')',
                'width': imgW,
                'height': imgH
            });


            $("#" + (_id + l)).remove();

            _parent.css({
                "display": "flex",
                "justify-content": "center"
            });
        }
    }
}