
var _resourceData;
var _resourceView;
var _resourceSelectedLetter = 0;
var _resourceSelectedWord = 0

var ResourcesView = function () {
    this.data = {};
    _resourceView = this;
}

ResourcesView.prototype.createResources = function (_data) {
    _resourceData = _data;
    $('#f_resourceContent').find('div').remove();
    var pdfIcon = "<div class='pdf'></div>";
    var linkIcon = "<div class='link'></div>";
    var docIcon = "<div class='doc'></div>";
    if (_resourceData.length > 0) {
        for (var i = 0; i < _resourceData.length; i++) {
			//console.log('_resourceData :: ', _resourceData[i])
		      if (_resourceData[i].type == "link") {
                // write code for Adding Icon
                $('#f_resourceContent').append('<div class="f_resourceRow"><div class="f_resourceColumn1">' + linkIcon + '<p>' + _resourceData[i].col1 + '</p></div></div>');
            } else if (_resourceData[i].type == "pdf") {
                // write code for Adding Icon
                $('#f_resourceContent').append('<div class="f_resourceRow"><div class="f_resourceColumn1">' + pdfIcon + '<p>' + _resourceData[i].col1 + '</p></div></div>');
            } else if (_resourceData[i].type == "doc") {
                // write code for Adding Icon
                $('#f_resourceContent').append('<div class="f_resourceRow"><div class="f_resourceColumn1">' + docIcon + '<p>' + _resourceData[i].col1 + '</p></div></div>');
            }
            /*$('#f_resourceContent').append('<div class="f_resourceRow"><div class="f_resourceColumn1"><p>' + _resourceData[i].col1 + '</p></div></div>');

            if (_resourceData[i].col2.length > 0) {
                $('#f_resourceContent .f_resourceRow').append('<div class="f_resourceColumn2"><p>' + _resourceData[i].col2 + '</p></div>')
            } else {
                $('.f_resourceColumn1').css({ 'width': '100%', 'padding': '5px 20px' });
            }*/
        }
    }
}