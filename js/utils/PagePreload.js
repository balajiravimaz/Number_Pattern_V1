var _this
var PagePreload = function () {
    this.data = {}
    this.json = ''
    this.jsonData = {}
    this.events_Obj = []
    this.audioLength = 0
    this.audioLoadCount = 0
    this.videoLength = 0
    this.videoLoadCount = 0
    _this = this
}

PagePreload.prototype.initObj = function (_data, _json) {
    this.data = _data
    this.json = _json
    this.audioLength = 0
    this.audioLoadCount = 0
    this.videoLength = 0
    //this.videoLoadCount = 0

    this.preloadData()
}


PagePreload.prototype.preloadData = function () {

    $.get(this.json + '' + (new Date().getTime()), function (data) {
        var obj1;
        if (typeof data == 'string') {
            obj1 = JSON.parse(data);
        } else {
            obj1 = data;
        }
        _this.jsonData = obj1;
        _this.data.data = 1

        if (_this.data.audio != 1)
            _this.preloadAudio()

        if (_this.data.video != 1)
            _this.preloadVideo()

        if (_this.data.image != 1)
            _this.preloadImage()

        _this.checkPreload()

    })
}

PagePreload.prototype.preloadImage = function () {
    var _imgObj = getObjects(_this.jsonData, "imageSRC");
    this.imgLength = _imgObj.length;
    this.imgLoadCount = 0;



    for (var i = 0; i < this.imgLength; i++) {
        //
        var _img = new Image()
        _img.src = _imgObj[i].imageSRC;
        //console.log(_imgObj[i].imageSRC);
        _img.onload = function () {
            _this.imgLoadCount++;
            if (_this.imgLoadCount == _this.imgLength) {
                _this.data.image = 1
                _this.checkPreload()
            }
        }
    }
}

PagePreload.prototype.preloadAudio = function () {
    var _audioObj = getObjects(_this.jsonData, "audioSRC")
    this.audioLength = _audioObj.length
    this.audioLoadCount = 0

    //console.log("audio obj: ", _audioObj, this.audioLength)

    for (var j = 0; j < this.audioLength; j++) {
        var _audio = new Audio()
        _audio.src = _audioObj[j].audioSRC;
        _audio.load()
        _audio.addEventListener('loadeddata', loadAudioEvent)
    }
}

function loadAudioEvent(e) {
    _this.audioLoadCount++;
    if (_this.audioLoadCount == _this.audioLength) {
        _this.data.audio = 1
        _this.checkPreload()
    }
    e.currentTarget.removeEventListener('loadeddata', loadAudioEvent)
}

PagePreload.prototype.preloadVideo = function () {
    var _videoObj = getObjects(_this.jsonData, "videoSRC")
    this.videoLength = _videoObj.length
    this.videoLoadCount = 0

    console.log("video obj: ", _videoObj, this.videoLength)

    for (var k = 0; k < this.videoLength; k++) {
        var _video = document.createElement('video')
        _video.src = _videoObj[k].videoSRC
        _video.load()
        _video.addEventListener('loadeddata', loadVideoEvent)
    }
}

function loadVideoEvent(e) {
    _this.videoLoadCount++;
    if (_this.videoLoadCount == _this.videoLength) {
        _this.data.video = 1
        _this.checkPreload()
    }
    e.currentTarget.removeEventListener('loadeddata', loadVideoEvent)
}


PagePreload.prototype.checkPreload = function () {
    console.log('checkPreload::image ',  this.data.image, 'audio ',  this.data.audio, 'video ',  this.data.video, 'data ',  this.data.data)
    if (this.data.image == 1 && this.data.audio == 1 && this.data.video == 1 && this.data.data == 1) {
        //console.log("despatch")
        this.dispatchCustomEvent('ready')
    }
}

PagePreload.prototype.addCustomEvent = function (evet, callback) {
    this.events_Obj.push({
        'eventName': evet,
        'funcCallBack': callback
    })
}

PagePreload.prototype.dispatchCustomEvent = function (arg) {
    for (var i = 0; i < this.events_Obj.length; i++) {
        if (this.events_Obj[i].eventName == arg) {
            this.events_Obj[i].funcCallBack()
            break
        }
    }
}

function getObjects(obj, key) {
    var objects = [];
    for (var i in obj) {

        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {

            objects = objects.concat(getObjects(obj[i], key));
        } else if (i == key) {
            objects.push(obj);
        }
    }
    return objects;
}