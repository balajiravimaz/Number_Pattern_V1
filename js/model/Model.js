var _services;
var _model;

var Model = function() {
    this.events_Obj = [];
    _model = this;

    this.menuData = {};
    this.ccTextData = {};
    this.glossaryData = {};
    this.resourceData = {};
    this.refrenceData = {};
    this.transcriptData = {};
    this.preloadData = {};
    this.settingData = {};

    _services = new Services();
    _services.addCustomEvent("jsonLoadCompleted", this.jsonLoadComplete);
}

Model.prototype.loadJson = function() {
    _services.sartLoadingJson();
}

Model.prototype.jsonLoadComplete = function() {
    _model.dispatchCustomEvent("ready");
}

Model.prototype.addCustomEvent = function(evet, callback) {
    this.events_Obj.push({
        "eventName": evet,
        "funcCallBack": callback
    });
};

Model.prototype.dispatchCustomEvent = function(arg) {
    this.saveMenuData();
    this.saveCCTextData();
    this.saveGlossaryData();
    this.saveResourceData();
    this.saveRefrenceData();
    this.saveTranscriptData();
    this.savePreloadData();
    this.saveSettingData();
    this.events_Obj[0].funcCallBack();
};

Model.prototype.saveMenuData = function() {
    this.menuData = _services.getMenuData();
}

Model.prototype.saveCCTextData = function() {
    this.ccTextData = _services.getCCTextData();
}

Model.prototype.saveGlossaryData = function() {
    this.glossaryData = _services.getGlossaryData();
}

Model.prototype.saveResourceData = function() {
    this.resourceData = _services.getResourceData();
}
Model.prototype.saveRefrenceData = function() {
    this.refrenceData = _services.getRefrenceData();
}

Model.prototype.saveTranscriptData = function() {
    this.transcriptData = _services.getTranscriptData();
}

Model.prototype.savePreloadData = function() {
    this.preloadData = _services.getPreloadData();
}

Model.prototype.saveSettingData = function() {
    this.settingData = _services.getSettingData();
}