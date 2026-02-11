
var _refrenceData;
var _refrenceView;
var _refrenceSelectedLetter = 0;
var _refrenceSelectedWord = 0

var RefrenceView = function () {
    this.data = {};
    _refrenceView = this;
}

RefrenceView.prototype.createRefrence = function (_data) {
    _refrenceData = _data;
    $('#f_refrenceContent').find('div').remove();
    console.log("_refrenceData.length",_refrenceData.length)
    if (_refrenceData.length > 0) {
        for (var i = 0; i < _refrenceData.length; i++) {
			//console.log('_refrenceData :: ', _refrenceData[i])
			$('#f_refrenceContent').append('<div class="f_refrenceRow"><div class="f_refrenceColumn1"><p>' + _refrenceData[i].col1 + '</p></div></div>');
            /*$('#f_refrenceContent').append('<div class="f_refrenceRow"><div class="f_refrenceColumn1"><p>' + _refrenceData[i].col1 + '</p></div></div>');

            if (_refrenceData[i].col2.length > 0) {
                $('#f_refrenceContent .f_refrenceRow').append('<div class="f_refrenceColumn2"><p>' + _refrenceData[i].col2 + '</p></div>')
            } else {
                $('.f_refrenceColumn1').css({ 'width': '100%', 'padding': '5px 20px' });
            }*/
        }
    }
}