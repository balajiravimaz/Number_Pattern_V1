var _service;
var Services = function() {
    _service = this;
    this.events_Obj = [];
    this.jsonCnt = 0;
    this.totalJson = 8;
    this.menuData = {};
    this.ccTextData = {};
    this.glossaryData = {};
    this.resourceData = {};
    this.refrenceData = {};
    this.transcriptData = {};
    this.preloadData = {};
    this.settingData = {};
}


Services.prototype.sartLoadingJson = function() {
    this.loadMenuJson();
    this.loadCCTextJson();
    this.loadGlossaryTextJson();
    this.loadResourceTextJson();
    this.loadRefrenceTextJson();
    this.loadTranscriptTextJson();
    this.loadPreloadTextJson();
    this.loadSettingsJson();
}

Services.prototype.loadMenuJson = function() {
    $.getJSON('js/json/f_menu_config.json?v=' + (new Date().getTime()), function(json) {
        _service.menuData = json;
        Services.jsonLoaded.call(_service);
    })
}

Services.prototype.loadCCTextJson = function() {
    $.getJSON('js/json/f_cc_text.json?v=' + (new Date().getTime()), function(json) {
        _service.ccTextData = json;
        Services.jsonLoaded.call(_service);
    })
}

Services.prototype.loadGlossaryTextJson = function() {
    $.getJSON('js/json/f_glossary_text.json?v=' + (new Date().getTime()), function(json) {
        _service.glossaryData = json;
        Services.jsonLoaded.call(_service);
    })
}

Services.prototype.loadResourceTextJson = function() {
    $.getJSON('js/json/f_resource_text.json?v=' + (new Date().getTime()), function(json) {
        _service.resourceData = json;
        Services.jsonLoaded.call(_service);
    })
}

Services.prototype.loadRefrenceTextJson = function() {
    $.getJSON('js/json/f_refrence_text.json?v=' + (new Date().getTime()), function(json) {
        _service.refrenceData = json;
        Services.jsonLoaded.call(_service);
    })
}

Services.prototype.loadTranscriptTextJson = function() {
    $.getJSON('js/json/f_transcript_text.json?v=' + (new Date().getTime()), function(json) {
        _service.transcriptData = json;
        Services.jsonLoaded.call(_service);
    })
}

Services.prototype.loadPreloadTextJson = function() {
    $.getJSON('js/json/f_preload_data.json?v=' + (new Date().getTime()), function(json) {
        _service.preloadData = json;
        Services.jsonLoaded.call(_service);
    })
}

Services.prototype.loadSettingsJson = function() {
    $.getJSON('js/json/f_settings.json?v=' + (new Date().getTime()), function(json) {
        _service.settingData = json;
        Services.jsonLoaded.call(_service);
    })
}

Services.jsonLoaded = function() {
    this.jsonCnt++;
    if (this.totalJson == this.jsonCnt) {
        this.dispatchCustomEvent("jsonLoadCompleted");
    }
}

Services.prototype.addCustomEvent = function(evet, callback) {
    this.events_Obj.push({
        "eventName": evet,
        "funcCallBack": callback
    });
};

Services.prototype.dispatchCustomEvent = function(arg) {
    this.events_Obj[0].funcCallBack();
};


Services.prototype.getMenuData = function() {
    return this.menuData;
}

Services.prototype.getCCTextData = function() {
    return this.ccTextData;
}

Services.prototype.getGlossaryData = function() {
    return this.glossaryData;
}

Services.prototype.getResourceData = function() {
    return this.resourceData;
}
Services.prototype.getRefrenceData = function() {
    return this.refrenceData;
}
Services.prototype.getTranscriptData = function() {
    return this.transcriptData;
}

Services.prototype.getPreloadData = function() {
    return this.preloadData;
}

Services.prototype.getSettingData = function() {
    return this.settingData;
}