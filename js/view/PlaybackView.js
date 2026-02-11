var volumeToggle = true
var pausePlay = 'pause'
var playBack
var touchPageX = 0
var ccObj = null
var dragStatus = ''
var strictNavigation = false;
var assessmentFlag = false;

var currentMedia = null;
var currentPopupMedia = null;
var mediaLevelOne = null;
var mediaLevelTwo = null;

var popupMedia = false;
var mediaLevel = null;
var isPopupAudio = false;


var forceAudioPause = false;
var _tweenTimeline = null;
var _checkAudioFlag = false;
var _popTweenTimeline = null;
var mediaEndFlag = false;
var scrubberHeight = 0


$('.audio__slider').roundSlider({
    radius: 23,
    value: 0,
    startAngle: 90,
    width: 2,
    handleSize: '+6',
    handleShape: 'round',
    sliderType: 'min-range'
});

$('.audio__slider').on('drag, change', function (e) {
    let $this = $(this);
    let $elem = $this.closest('.js-audio');
    updateAudio(e, $elem);
    $this.addClass('active');
});

function updateAudio(e, $elem) {
    let value = e.handle.value;
    var circle = $elem.find('#seekbar'), getCircle = circle.get(0), totalLength = getCircle.getTotalLength(), maxduration;

    switch (mediaLevel) {
        case undefined:
            maxduration = currentMedia.duration;
            var y = (value * maxduration) / 100;
            currentMedia.currentTime = y;

            if (currentMedia.currentTime >= currentMedia.duration) { } else {
                if (pausePlay == 'replay') {
                    playBack.dispatchCustomEvent('pageprogress')
                    if (dragStatus == 'play') {
                        pausePlay = 'play'
                        mediaBtn.removeClass('f_play').removeClass('f_replay').addClass('f_pause')
                    } else {
                        pausePlay = 'pause'
                        mediaBtn.removeClass('f_pause').removeClass('f_replay').addClass('f_play')
                    }
                }
            }
            break;

        case 1:
            maxduration = mediaLevelOne.duration;
            var y = (value * maxduration) / 100;
            mediaLevelOne.currentTime = y;

            if (mediaLevelOne.currentTime >= mediaLevelOne.duration) { } else {
                if (pausePlay == 'replay') {
                    playBack.dispatchCustomEvent('pageprogress')
                    if (dragStatus == 'play') {
                        pausePlay = 'play'
                        mediaBtn.removeClass('f_play').removeClass('f_replay').addClass('f_pause')
                    } else {
                        pausePlay = 'pause'
                        mediaBtn.removeClass('f_pause').removeClass('f_replay').addClass('f_play')
                    }
                }
            }
            break;

        case 2:
            maxduration = mediaLevelTwo.duration;
            var y = (value * maxduration) / 100;
            mediaLevelTwo.currentTime = y;

            if (mediaLevelTwo.currentTime >= mediaLevelTwo.duration) { } else {
                if (pausePlay == 'replay') {
                    playBack.dispatchCustomEvent('pageprogress')

                    if (dragStatus == 'play') {
                        pausePlay = 'play'
                        mediaBtn.removeClass('f_play').removeClass('f_replay').addClass('f_pause')
                    } else {
                        pausePlay = 'pause'
                        mediaBtn.removeClass('f_pause').removeClass('f_replay').addClass('f_play')
                    }
                }
            }
            break;
    }

}


var PlaybackView = function () {
    playBack = this
    this.events_Obj = []
    this.audioSync = false
    currentMedia = document.getElementById('courseAudio');
    currentPopupMedia = document.getElementById('coursePopupAudio');
    mediaLevelOne = document.getElementById('audioLevel_1');
    mediaLevelTwo = document.getElementById('audioLevel_2');
    this.initPlayBack()
    scrubberHeight = $('#f_scrubber').outerHeight();
}


PlaybackView.prototype.initPlayBack = function () {
    volumeBtn = $('#f_volumeBtn').off('click mouseenter mouseleave').on('click mouseenter mouseleave', this.volumeBtnClicked)
    $('#f_volumeBtn').attr('title','Mute')

    mediaBtn = $('#f_mediaBtn').off('click mouseenter mouseleave').on('click mouseenter mouseleave', this.mediaBtnClicked)
    scrubber = $('#f_scrubber')
    playbackProgress = $('#f_progress')
    playbackProgress.css({
        height: 0
    })

    scrubber.off('mousedown').on('mousedown', this.scrubberDown).css('cursor', 'pointer');
    scrubber.off('touchstart').on('touchstart', this.scrubberDown);

    var circle = $(".js-audio").find('#seekbar'), getCircle = circle.get(0), totalLength = getCircle.getTotalLength();

    circle.attr({
        'stroke-dasharray': totalLength,
        'stroke-dashoffset': totalLength,
    });
}

PlaybackView.prototype.enablePlayBackListener = function () {
    volumeBtn.off('click mouseenter mouseleave').on('click mouseenter mouseleave', this.volumeBtnClicked);
    mediaBtn.off('click mouseenter mouseleave').on('click mouseenter mouseleave', this.mediaBtnClicked)
    scrubber.off('mousedown').on('mousedown', this.scrubberDown).css('cursor', 'pointer');
    scrubber.off('touchstart').on('touchstart', this.scrubberDown)
    _controller.volumeBtnEnable();
    mediaBtn.css({
        'opacity': 1,
        "cursor": "pointer"
    });
    mediaBtn.prop("disabled", false);
}

PlaybackView.prototype.disablePlayBackListener = function () {
    volumeBtn.off('click mouseenter mouseleave');
    mediaBtn.off('click mouseenter mouseleave');
    scrubber.off('mousedown').css('cursor', 'pointer');
    scrubber.off('touchstart');
    _controller.volumeBtnDisable();
    mediaBtn.css({
        'opacity': 0.5,
        "cursor": "default"
    })
    mediaBtn.prop("disabled", true);
    mediaBtn.removeClass('f_pause').removeClass('f_replay').addClass('f_play')
}

PlaybackView.prototype.removePlayBackListener = function () {
    volumeBtn.off('click mouseenter mouseleave');
    mediaBtn.off('click mouseenter mouseleave');
    playbackProgress.css({
        height: 0
    })
    scrubber.off('mousedown').css('cursor', 'pointer');
    scrubber.off('touchstart')
    _controller.volumeBtnDisable();
    mediaBtn.css({
        'opacity': 0.5,
        "cursor": "default"
    });
    mediaBtn.prop("disabled", true);
    currentMedia.src = '';
    mediaLevelOne.src = '';
    mediaLevelTwo.src = '';
    mediaBtn.removeClass('f_pause').removeClass('f_replay').addClass('f_play')
}


PlaybackView.prototype.pauseMedia = function () {
    if (!forceAudioPause) {
        pausePlay = 'pause'
        playBack.checkPlayPause();
    }
}

function removeMediaEventListeners() {
    currentMedia.removeEventListener('timeupdate', playBack.updatePlaybackTime);
    currentMedia.removeEventListener('ended', playBack.mediaEnded);
    mediaLevelOne.removeEventListener('timeupdate', playBack.updatePlaybackTime);
    mediaLevelOne.removeEventListener('ended', playBack.mediaEnded);
    mediaLevelTwo.removeEventListener('timeupdate', playBack.updatePlaybackTime);
    mediaLevelTwo.removeEventListener('ended', playBack.mediaEnded);
}

PlaybackView.prototype.startPlayback = function (_src, obj, _audioSync, _restriction, _videoId, _popAudio, _reloadReq, _mediaLevel) {
    if (_src != null) {
        popupMedia = _popAudio;
        mediaLevel = _mediaLevel;

        ccObj = null
        ccObj = obj
        strictNavigation = _restriction;

        this.audioSync = _audioSync

        if (_reloadReq) {
            volumeBtn.off('click mouseenter mouseleave');
            mediaBtn.off('click mouseenter mouseleave');
            playbackProgress.css({
                height: 0
            });
            scrubber.off('mousedown');
            scrubber.off('touchstart');
            _controller.volumeBtnDisable();
            mediaBtn.css({
                'opacity': 0.5,
            })
            mediaBtn.prop("disabled", true);
            if (_videoId == null && _src == null) {
                _transscriptOpen = false;
                _controller.transcriptDisable();
                $('#f_transcriptContainer').hide(200, function () {
                    $('#f_transContent').scrollTop(0);
                });
            } else {
                if (_transscriptOpen) {
                    _transscriptOpen = open;
                    _controller.transcriptDisable();
                } else {
                    _transscriptOpen = false;
                    _controller.transcriptEnable();
                }
            }

            var src = _src;

            if (_videoId != null) {
                src = ''
                currentMedia = document.getElementById(_videoId)
                src = $('#' + _videoId).attr('src')
                currentMedia.src = ''
                currentMedia.src = src
                currentMedia.load()
                currentMedia.addEventListener('loadeddata', this.mediaLoaded)
            } else {
                if (src != null) {
                    currentMedia.src = ''
                    currentMedia.src = src;
                    currentMedia.load()
                    currentMedia.addEventListener('loadeddata', this.mediaLoaded)
                }
            }
        } else {
            removeMediaEventListeners();
            currentMedia.addEventListener('timeupdate', playBack.updatePlaybackTime)
            currentMedia.addEventListener('ended', playBack.mediaEnded)
        }
    } else {
        _transscriptOpen = false;
        _controller.transcriptDisable();
        $('#f_transcriptContainer').hide(200, function () {
            $('#f_transContent').scrollTop(0);
        });
    }
}

PlaybackView.prototype.startLevelOnePlayback = function (_src, obj, _audioSync, _restriction, _videoId, _popAudio, _reloadReq, _mediaLevel) {
    removeMediaEventListeners();

    mediaLevel = _mediaLevel;
    popupMedia = _popAudio;
    ccObj = null
    ccObj = obj
    strictNavigation = _restriction

    this.audioSync = _audioSync

    if (_reloadReq) {
        volumeBtn.off('click mouseenter mouseleave');
        mediaBtn.off('click mouseenter mouseleave');
        playbackProgress.css({
            height: 0
        });
        scrubber.off('mousedown');
        scrubber.off('touchstart');
        _controller.volumeBtnEnable();
        _controller.volumeBtnDisable();

        if (_videoId == null && _src == null) {
            _transscriptOpen = false;
            _controller.transcriptDisable();
            $('#f_transcriptContainer').hide(200, function () {
                $('#f_transContent').scrollTop(0);
            });
        } else {
            if (_transscriptOpen) {
                _transscriptOpen = open;
                _controller.transcriptDisable();
            } else {
                _transscriptOpen = false;
                _controller.transcriptEnable();
            }
        }

        var src = _src;

        if (_videoId != null) {
            src = ''
            mediaLevelOne = document.getElementById(_videoId)
            src = $('#' + _videoId).attr('src')
            mediaLevelOne.src = ''
            mediaLevelOne.src = src
            mediaLevelOne.load()
            mediaLevelOne.addEventListener('loadeddata', this.mediaLoaded)
        } else {
            if (src != null) {
                mediaLevelOne.src = ''
                mediaLevelOne.src = src;
                mediaLevelOne.load()
                mediaLevelOne.addEventListener('loadeddata', this.mediaLoaded)
            }
        }
    } else {
        removeMediaEventListeners();
        mediaLevelOne.addEventListener('timeupdate', playBack.updatePlaybackTime)
        mediaLevelOne.addEventListener('ended', playBack.mediaEnded)
    }
}


PlaybackView.prototype.startLevelTwoPlayback = function (_src, obj, _audioSync, _restriction, _videoId, _popAudio, _reloadReq, _mediaLevel) {
    removeMediaEventListeners();

    mediaLevel = _mediaLevel;

    popupMedia = _popAudio;
    ccObj = null
    ccObj = obj
    strictNavigation = _restriction

    this.audioSync = _audioSync

    volumeBtn.off('click mouseenter mouseleave');
    mediaBtn.off('click mouseenter mouseleave');
    playbackProgress.css({
        height: 0
    });
    scrubber.off('mousedown');
    scrubber.off('touchstart');

    volumeBtn.css({
        'opacity': 0.5,
        "cursor": "default"
    })
    volumeBtn.prop("disabled", true);
    mediaBtn.css({
        'opacity': 1
    })
    mediaBtn.prop("disabled", false);
    if (_videoId == null && _src == null) {
        _transscriptOpen = false;
        _controller.transcriptDisable();
        $('#f_transcriptContainer').hide(200, function () {
            $('#f_transContent').scrollTop(0);
        });
    } else {
        if (_transscriptOpen) {
            _transscriptOpen = open;
            _controller.transcriptDisable();
        } else {
            _transscriptOpen = false;
            _controller.transcriptEnable();
        }
    }

    var src = _src;

    if (_videoId != null) {
        src = ''
        mediaLevelTwo = document.getElementById(_videoId)
        src = $('#' + _videoId).attr('src')
        mediaLevelTwo.src = ''
        mediaLevelTwo.src = src
        mediaLevelTwo.load()
        mediaLevelTwo.addEventListener('loadeddata', this.mediaLoaded)
    } else {
        if (src != null) {
            mediaLevelTwo.src = ''
            mediaLevelTwo.src = src;
            mediaLevelTwo.load()
            mediaLevelTwo.addEventListener('loadeddata', this.mediaLoaded)
        }
    }

}

PlaybackView.prototype.mediaLoaded = function (e) {
    volumeBtn.css({
        'opacity': 1,
        "cursor": "pointer"
    });
    volumeBtn.prop("disabled", false);
    mediaBtn.css({
        'opacity': 1,
        "cursor": "pointer"
    });
    mediaBtn.prop("disabled", false);
    volumeBtn.off('click mouseenter mouseleave').on('click mouseenter mouseleave', playBack.volumeBtnClicked)
    mediaBtn.off('click mouseenter mouseleave').on('click mouseenter mouseleave', playBack.mediaBtnClicked)
    scrubber.off('mousedown').on('mousedown', playBack.scrubberDown)
    scrubber.off('touchstart').on('touchstart', playBack.scrubberDown);

    currentMedia.removeEventListener('loadeddata', playBack.mediaLoaded)

    currentMedia.addEventListener('ended', playBack.mediaEnded)

    playBack.dispatchCustomEvent('ready')
    pausePlay = 'play'
    playBack.checkPlayPause()

    checkStartAnimation();
    switch (mediaLevel) {
        case undefined:
            currentMedia.removeEventListener('loadeddata', playBack.mediaLoaded)
            currentMedia.addEventListener('timeupdate', playBack.updatePlaybackTime)
            currentMedia.addEventListener('ended', playBack.mediaEnded)
            break;

        case 1:
            mediaLevelOne.removeEventListener('loadeddata', playBack.mediaLoaded)
            mediaLevelOne.addEventListener('timeupdate', playBack.updatePlaybackTime)
            mediaLevelOne.addEventListener('ended', playBack.mediaEnded)
            break;

        case 2:
            mediaLevelTwo.removeEventListener('loadeddata', playBack.mediaLoaded)
            mediaLevelTwo.addEventListener('timeupdate', playBack.updatePlaybackTime)
            mediaLevelTwo.addEventListener('ended', playBack.mediaEnded)
            break;
    }


    playBack.dispatchCustomEvent('ready')

    /*if (!forceAudioPause) {
        pausePlay = 'play'
        playBack.checkPlayPause();
    }*/
    if (!volumeToggle) {
        if (!popupMedia) {
            currentMedia.volume = 0;
           // if (_bgmAudio) _bgmAudio.volume = 0;

        } else {
            mediaLevelOne.volume = 0;
           // if (_bgmAudio) _bgmAudio.volume = 0;
        }
    } else {
        if (!popupMedia) {
            currentMedia.volume = 1;
           // if (_bgmAudio) _bgmAudio.volume = 1;
        } else {
            mediaLevelOne.volume = 1;
           // if (_bgmAudio) _bgmAudio.volume = 1;
        }
    }
}

PlaybackView.prototype.volumeOn = function () {
    currentMedia.volume = 1;
    mediaLevelOne.volume = 1;
    mediaLevelTwo.volume = 1;
}

PlaybackView.prototype.volumeOff = function () {
    currentMedia.volume = 1;
    mediaLevelOne.volume = 1;
    mediaLevelTwo.volume = 1;
}

PlaybackView.prototype.volumeBtnClicked = function (e) {
    gadgetNavOver(e.type, "f_volumeBtn")
    if (e.type == "click") {
        if (volumeToggle) {
            if (!popupMedia) {
                currentMedia.volume = 0;
               // if (_bgmAudio) _bgmAudio.volume = 0;
            } else {
                mediaLevelOne.volume = 0;
               // if (_bgmAudio) _bgmAudio.volume = 0;
            }
            volumeBtn.removeClass('f_unmute').addClass('f_mute')
            $('#f_volumeBtn').attr('title','Unmute')
            volumeToggle = false
        } else {
            if (!popupMedia) {
                currentMedia.volume = 1;
               // if (_bgmAudio) _bgmAudio.volume = 1;
            } else {
                mediaLevelOne.volume = 1;
                //if (_bgmAudio) _bgmAudio.volume = 1;
            }
            volumeBtn.removeClass('f_mute').addClass('f_unmute')
            $('#f_volumeBtn').attr('title','Mute')

            volumeToggle = true
        }
    }
}

PlaybackView.prototype.mediaBtnClicked = function (e) {
    gadgetNavOver(e.type, "f_mediaBtn");

    if (e.type == "click") {
        switch (pausePlay) {
            case 'play':
                forceAudioPause = true;
                pausePlay = 'pause'
                break
            case 'pause':
                forceAudioPause = false;
                pausePlay = 'play'
                break
            case 'replay':
                forceAudioPause = false;
                playBack.dispatchCustomEvent('pageprogress');
                if (!isPopupAudio) {
                    console.log("Main audio playing")
                    setTimeout(function () {
                        _controller.updateViewNow();
                    }, 50)
                }
                // _bgmAudio = null;
              /*   if (_bgmAudio) {
                    _bgmAudio.currentTime = 0;
                    _bgmAudio.pause();
                } */
                switch (mediaLevel) {
                    case undefined:
                        currentMedia.currentTime = 0;
                        _tweenTimeline.remove()

                        // _tweenTimeline.play();
                        break;
                    case 1:
                        mediaLevelOne.currentTime = 0;
                        if (_popTweenTimeline != null)
                            _popTweenTimeline.remove();
                        break;

                    case 2:
                        mediaLevelThree.currentTime = 0;
                        break;
                }

                pausePlay = 'play';

                if (!volumeToggle) {
                    if (!popupMedia) {
                        currentMedia.volume = 0;
                    } else {
                        mediaLevelOne.volume = 0;
                    }
                } else {
                    if (!popupMedia) {
                        currentMedia.volume = 1;
                    } else {
                        mediaLevelOne.volume = 1;
                    }
                }
                break
        }
        playBack.checkPlayPause();
    }
}

PlaybackView.prototype.checkPlayPause = function () {
    // console.log("play pause");
    switch (pausePlay) {
        case 'play':
            switch (mediaLevel) {
                case undefined:
                    if (_tweenTimeline) {
                        _tweenTimeline.play()
                    }
                    // let getAudioSrc = (currentMedia.src).split(".")[1];
                    // if(getAudioSrc != undefined){
                    currentMedia.play();

                    currentMedia.addEventListener('timeupdate', playBack.updatePlaybackTime);
                    currentMedia.addEventListener('ended', playBack.mediaEnded);
                    mediaLevelOne.removeEventListener('timeupdate', playBack.updatePlaybackTime);
                    mediaLevelOne.removeEventListener('ended', playBack.mediaEnded);
                    mediaLevelTwo.removeEventListener('timeupdate', playBack.updatePlaybackTime);
                    mediaLevelTwo.removeEventListener('ended', playBack.mediaEnded);
                    // }
                    break;

                case 1:
                    if (_tweenTimeline) {
                        _tweenTimeline.remove();
                    }
                    if (_popTweenTimeline != null)
                        _popTweenTimeline.remove();

                    mediaLevelOne.play();

                    currentMedia.removeEventListener('timeupdate', playBack.updatePlaybackTime);
                    currentMedia.removeEventListener('ended', playBack.mediaEnded);
                    mediaLevelOne.addEventListener('timeupdate', playBack.updatePlaybackTime);
                    mediaLevelOne.addEventListener('ended', playBack.mediaEnded);
                    mediaLevelTwo.removeEventListener('timeupdate', playBack.updatePlaybackTime);
                    mediaLevelTwo.removeEventListener('ended', playBack.mediaEnded);

                    break;

                case 2:
                    mediaLevelTwo.currentTime = 0;
                    mediaLevelTwo.play();
                    mediaLevelTwo.addEventListener('timeupdate', playBack.updatePlaybackTime)
                    mediaLevelTwo.addEventListener('ended', playBack.mediaEnded)
                    break;
            }

            forceAudioPause = false;
            mediaEndFlag = false;
            mediaBtn.removeClass('f_play').removeClass('f_replay').addClass('f_pause')
            $('#f_mediaBtn').attr('title','Pause')
            break
        case 'pause':

            switch (mediaLevel) {
                case undefined:

                    if (typeof _tweenTimeline !== undefined && _tweenTimeline != null) {
                        _tweenTimeline.pause()
                    }

                    currentMedia.pause();
                    break;

                case 1:
                    if (typeof _popTweenTimeline !== undefined && _popTweenTimeline != null) {
                        _popTweenTimeline.pause()
                    }

                    mediaLevelOne.pause();
                    break;

                case 2:
                    mediaLevelTwo.pause();
                    break;
            }

            mediaBtn.removeClass('f_pause').addClass('f_play')
            $('#f_mediaBtn').attr('title','Play')
            break
    }
}


PlaybackView.prototype.scrubberDown = function (e) {
    var _y = 0
    var parentY = parseInt(scrubber.parent().offset().top)
    var childMargin = scrubber.css('margin-top')
    var childY = parseInt(childMargin.substr(0, childMargin.length - 2))
    var currentY = parentY + childY

    dragStatus = pausePlay
    if (e.originalEvent.touches) {
        touch = e.originalEvent.touches[0]
        playBack.updateProgressbar(touch.pageY)
        touchPageY = touch.pageY
        $(document).off('touchmove').on('touchmove', playBack.scrubberMousemove)
        $(document).off('touchend').on('touchend', playBack.scrubberUp)
        _y = Math.round((touchPageY / Number($('html').css('zoom'))) - currentY)
    } else {
        playBack.updateProgressbar(e.pageY)
        $(document).mousemove(playBack.scrubberMousemove)
        $(document).off('mouseup').on('mouseup', playBack.scrubberUp)
        _y = Math.round(e.pageY - currentY)
        _y = (Math.round((e.pageY / Number($('html').css('zoom'))) - currentY))
    }


    switch (mediaLevel) {
        case undefined:
            currentMedia.pause();
            currentMedia.currentTime = (_y / scrubberHeight) * currentMedia.duration;
            if (currentMedia.currentTime >= currentMedia.duration) { } else {
                if (pausePlay == 'replay') {
                    playBack.dispatchCustomEvent('pageprogress')
                    if (dragStatus == 'play') {
                        pausePlay = 'play'
                        mediaBtn.removeClass('f_play').removeClass('f_replay').addClass('f_pause')
                    } else {
                        pausePlay = 'pause'
                        mediaBtn.removeClass('f_pause').removeClass('f_replay').addClass('f_play')
                    }
                }
            }
            break;

        case 1:
            mediaLevelOne.pause();
            mediaLevelOne.currentTime = (_y / scrubberHeight) * mediaLevelOne.duration
            if (mediaLevelOne.currentTime >= mediaLevelOne.duration) { } else {
                if (pausePlay == 'replay') {
                    playBack.dispatchCustomEvent('pageprogress')
                    if (dragStatus == 'play') {
                        pausePlay = 'play'
                        mediaBtn.removeClass('f_play').removeClass('f_replay').addClass('f_pause')
                    } else {
                        pausePlay = 'pause'
                        mediaBtn.removeClass('f_pause').removeClass('f_replay').addClass('f_play')
                    }
                }
            }
            break;

        case 2:
            mediaLevelTwo.pause();
            mediaLevelTwo.currentTime = (_y / scrubberHeight) * mediaLevelTwo.duration
            if (mediaLevelTwo.currentTime >= mediaLevelTwo.duration) { } else {
                if (pausePlay == 'replay') {
                    playBack.dispatchCustomEvent('pageprogress')
                    if (dragStatus == 'play') {
                        pausePlay = 'play'
                        mediaBtn.removeClass('f_play').removeClass('f_replay').addClass('f_pause')
                    } else {
                        pausePlay = 'pause'
                        mediaBtn.removeClass('f_pause').removeClass('f_replay').addClass('f_play')
                    }
                }
            }
            break;
    }


    checkCCStatus();
}

PlaybackView.prototype.scrubberUp = function (e) {
    e.stopPropagation()
    var _y = 0
    var parentY = parseInt(scrubber.parent().offset().top)
    var childMargin = scrubber.css('margin-top')
    var childY = parseInt(childMargin.substr(0, childMargin.length - 2))
    var currentY = parentY + childY


    if (e.originalEvent.touches) {
        touch = e.originalEvent.touches[0]
        $(document).off('touchmove', playBack.scrubberMousemove)
        $(document).off('touchend', playBack.scrubberUp)
        _y = Math.round((touchPageY / Number($('html').css('zoom'))) - currentY)
    } else {
        $(document).off('mousemove', playBack.scrubberMousemove)
        $(document).off('mouseup', playBack.scrubberUp)
        _y = (Math.round((e.pageY / Number($('html').css('zoom'))) - currentY))
    }

    switch (mediaLevel) {
        case undefined:
            currentMedia.currentTime = (_y / scrubberHeight) * currentMedia.duration;
            break;

        case 1:
            mediaLevelOne.currentTime = (_y / scrubberHeight) * mediaLevelOne.duration;
            break;

        case 2:
            mediaLevelTwo.currentTime = (_y / scrubberHeight) * mediaLevelTwo.duration;
            break;
    }
    playBack.checkPlayPause()
}

PlaybackView.prototype.scrubberMousemove = function (e) {
    var _y = 0
    var parentY = parseInt(scrubber.parent().offset().top)
    var childMargin = scrubber.css('margin-top')
    var childY = parseInt(childMargin.substr(0, childMargin.length - 2))
    var currentY = parentY + childY
    if (e.originalEvent.touches) {
        touch = e.originalEvent.touches[0]
        playBack.updateProgressbar(touch.pageY)
        touchPageY = touch.pageY
        _y = Math.round((touchPageY / Number($('html').css('zoom'))) - currentY)
    } else {
        playBack.updateProgressbar(e.pageY)
        _y = (Math.round((e.pageY / Number($('html').css('zoom'))) - currentY))
    }
    switch (mediaLevel) {
        case undefined:
            currentMedia.currentTime = (_y / scrubberHeight) * currentMedia.duration

            if (currentMedia.currentTime >= currentMedia.duration) { } else {
                if (pausePlay == 'replay') {
                    playBack.dispatchCustomEvent('pageprogress')
                    if (dragStatus == 'play') {
                        pausePlay = 'play'
                        mediaBtn.removeClass('f_play').removeClass('f_replay').addClass('f_pause')
                    } else {
                        pausePlay = 'pause'
                        mediaBtn.removeClass('f_pause').removeClass('f_replay').addClass('f_play')
                    }
                }
            }
            break;

        case 1:
            mediaLevelOne.currentTime = (_y / scrubberHeight) * mediaLevelOne.duration

            if (mediaLevelOne.currentTime >= mediaLevelOne.duration) { } else {
                if (pausePlay == 'replay') {
                    playBack.dispatchCustomEvent('pageprogress')
                    if (dragStatus == 'play') {
                        pausePlay = 'play'
                        mediaBtn.removeClass('f_play').removeClass('f_replay').addClass('f_pause')
                    } else {
                        pausePlay = 'pause'
                        mediaBtn.removeClass('f_pause').removeClass('f_replay').addClass('f_play')
                    }
                }
            }
            break;

        case 2:
            mediaLevelTwo.currentTime = (_y / scrubberHeight) * mediaLevelTwo.duration;

            if (mediaLevelTwo.currentTime >= mediaLevelTwo.duration) { } else {
                if (pausePlay == 'replay') {
                    playBack.dispatchCustomEvent('pageprogress')
                    if (dragStatus == 'play') {
                        pausePlay = 'play'
                        mediaBtn.removeClass('f_play').removeClass('f_replay').addClass('f_pause')
                    } else {
                        pausePlay = 'pause'
                        mediaBtn.removeClass('f_pause').removeClass('f_replay').addClass('f_play')
                    }
                }
            }
            break;
    }

    checkCCStatus();
}

PlaybackView.prototype.updateProgressbar = function (_y) {
    var parentY = parseInt(scrubber.parent().offset().top)
    var childMargin = scrubber.css('margin-top')
    var childY = parseInt(childMargin.substr(0, childMargin.length - 2))
    var currentY = parentY + childY
    var _height = Math.round(_y - currentY)

    if (_height <= 0) {
        _height = 0
    }


    if (scrubberHeight <= _height) {
        _height = scrubberHeight
    }
    playbackProgress.css({
        height: _height
    })

    checkCCStatus();
   /*  if (_bgmAudio) {
        _bgmAudio.currentTime = 0;
        _bgmAudio.pause();
        _bgmAudio.loop = false;
    } */
}

PlaybackView.prototype.updatePlaybackTime = function () {
    var progressWidth;
    var circle = $(".js-audio").find('#seekbar'), getCircle = circle.get(0), totalLength = getCircle.getTotalLength();
    mediaEndFlag = false;
    switch (mediaLevel) {
        case undefined:
            progressWidth = Math.round((currentMedia.currentTime / currentMedia.duration) * scrubberHeight);
            updatePlayback(currentMedia);
            break;

        case 1:
            progressWidth = Math.round((mediaLevelOne.currentTime / mediaLevelOne.duration) * scrubberHeight);
            updatePlayback(mediaLevelOne);
            break;

        case 2:
            progressWidth = Math.round((mediaLevelTwo.currentTime / mediaLevelTwo.duration) * scrubberHeight);
            updatePlayback(mediaLevelTwo);
            break;
    }

    playbackProgress.css({
        height: progressWidth
    })

    function updatePlayback(audio) {
        let currentTime = audio.currentTime, maxduration = audio.duration, calc = totalLength - (currentTime / maxduration * totalLength);

        circle.attr('stroke-dashoffset', calc);

        let value = Math.floor((currentTime / maxduration) * 100);

        var slider = $('.js-audio').find('.audio__slider');
        $(slider).roundSlider('setValue', value);
    }

    checkCCStatus();

    // update seekbar from tweenMax
    if (playBack.audioSync) {
        //console.log("sync");
        switch (mediaLevel) {
            case undefined:
                updateCurrentTime(currentMedia.currentTime)
                break;

            case 1:
                updateCurrentTime(mediaLevelOne.currentTime)
                break;

            case 2:
                updateCurrentTime(mediaLevelTwo.currentTime)
                break;
        }
    }

    if (pausePlay == "pause") {
        $(".js-audio").removeClass('paused');
        $(".js-audio").addClass('playing');
    } else {
        $(".js-audio").removeClass('playing');
        $(".js-audio").addClass('paused');
    }

}

PlaybackView.prototype.mediaEnded = function () {
    var circle = $(".js-audio").find('#seekbar'), getCircle = circle.get(0), totalLength = getCircle.getTotalLength();

    if (strictNavigation) {
        playBack.dispatchCustomEvent('pagecompleted');
    }



    forceAudioPause = true;
    mediaEndFlag = true;

    pausePlay = 'replay';
    mediaBtn.removeClass('f_play').removeClass('f_pause').addClass('f_replay');
    $('#f_mediaBtn').attr('title','Replay')
    $(".js-audio").removeClass('playing');
}

PlaybackView.prototype.pauseAudio = function () {
    pausePlay = 'pause';
    playBack.checkPlayPause();
    $(".js-audio").removeClass('playing');
    $(".js-audio").addClass('paused');
}

PlaybackView.prototype.ccTextView = function () {
    for (var i = 0; i < ccObj.length; i++) {
        var startTime = ccObj[i].startTime
        var endTime = ccObj[i].endTime

        if (!popupMedia) {

        } else {

        }

        switch (mediaLevel) {
            case undefined:
                if (startTime <= currentMedia.currentTime && endTime >= currentMedia.currentTime) {
                    $('#f_ccContainer').find('p').html(ccObj[i].text);
                }
                break;

            case 1:
                if (startTime <= mediaLevelOne.currentTime && endTime >= mediaLevelOne.currentTime) {
                    $('#f_ccContainer').find('p').html(ccObj[i].text);
                }
                break;

            case 2:
                if (startTime <= mediaLevelTwo.currentTime && endTime >= mediaLevelTwo.currentTime) {
                    $('#f_ccContainer').find('p').html(ccObj[i].text);
                }
                break;
        }
    }
}

PlaybackView.prototype.showCCText = function () {
    if (ccObj != null) {
        $('#f_ccContainer').css({
            'display': 'block'
        })
    }
}
PlaybackView.prototype.hideCCText = function () {
    $('#f_ccContainer').css({
        'display': 'none'
    })
}

PlaybackView.prototype.addCustomEvent = function (evet, callback) {
    this.events_Obj.push({
        'eventName': evet,
        'funcCallBack': callback
    })
}

PlaybackView.prototype.dispatchCustomEvent = function (arg) {
    for (var i = 0; i < this.events_Obj.length; i++) {
        if (this.events_Obj[i].eventName == arg) {
            this.events_Obj[i].funcCallBack()
            break
        }
    }
}

function checkCCStatus() {
    if (settingInfo.ccRequired)
        playBack.ccTextView()
}


function enableForceNavigation() {
    if (!strictNavigation) {
        playBack.dispatchCustomEvent('pagecompleted')
    }
}



//------------ page tween animation common functions -------
function updateCurrentTime(_currTime) {
    switch (mediaLevel) {
        case undefined:
            if (_tweenTimeline != undefined) {
                _tweenTimeline.seek(_currTime)
            }
            break;
        case 1:
            if (_popTweenTimeline != undefined) {
                _popTweenTimeline.seek(_currTime);
            }
            break;

        case 2:
            break;
    }
}

function checkStartAnimation() {
    setTimeout(function () { initPageAnimations(); }, 100);

    if (_controller._audioRequired) {

        switch (mediaLevel) {
            case undefined:
                currentMedia.addEventListener('timeupdate', checkTimeUpdate);
                break;

            case 1:
                mediaLevelOne.addEventListener('timeupdate', checkTimeUpdate);
                break;

            case 2:
                break;
        }
    } else {

    }
}

function checkTimeUpdate() {
    if (!_checkAudioFlag) {
        if (!popupMedia) {

        } else {

        }

        switch (mediaLevel) {
            case undefined:
                if (currentMedia.currentTime > 0.1) {
                    currentMedia.removeEventListener('timeupdate', checkTimeUpdate);
                    initPageAnimations();
                    _checkAudioFlag = true;
                }
                break;

            case 1:
                if (mediaLevelOne.currentTime > 0.1) {
                    mediaLevelOne.removeEventListener('timeupdate', checkTimeUpdate);
                    initPageAnimations();
                    _checkAudioFlag = true;
                }
                break;

            case 2:
                if (mediaLevelTwo.currentTime > 0.1) {
                    mediaLevelTwo.removeEventListener('timeupdate', checkTimeUpdate);
                    initPageAnimations();
                    _checkAudioFlag = true;
                }
                break;
        }
    }
}