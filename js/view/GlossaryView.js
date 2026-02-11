var _glossaryData;
var _glossaryView;
var _glossarySelectedLetter = 0;
var _glossarySelectedWord = 0

var GlossaryView = function () {
    this.data = {};
    _glossaryView = this;
}

GlossaryView.prototype.createGlossary = function (_data) {
    _glossaryData = _data;
    
    // $('#f_glossaryContainer').find('#f_glossaryContent').html('')
}

GlossaryView.prototype.createGlossaryWords = function () {
    // $('#f_glossaryContainer').find('#f_glossaryContent').html('')
    let htmlObj = '';
    let btnObject='';
    console.log(_glossaryData.length)
    for(let k=0;k< _glossaryData.length;k++){
        // console.log(_glossaryData[k].terms)
            btnObject +='<button class="btn" id="btn-'+(k+1)+'" aria-label="'+_glossaryData[k].terms.btnTitle+'">'+_glossaryData[k].terms.btnTitle+'</button>'
        
    }
    //htmlObj ='<div class="wrap">'+btnObject+'</div>'
    //$('#f_glossaryContainer').find('#f_glossaryContent').append('<div id="glossarybtns">'+htmlObj+'</div>');
    //$(".btn").on("click", showPopupGlossary)
    showPopupGlossary(false);
    this.showGlossaryDescription();

}

GlossaryView.prototype.showGlossaryDescription = function (moduleNo) {
}

function showPopupGlossary(evt) {
    // var eventType = evt.type;z
    if (evt.type == 'click') {
       
 
        let targetButton = $(this);
        var id = $(this).attr('id');
        var arr = id.split('-')
        var num1 = Number(arr[arr.length - 1]) - 1;
        $('#f_glossaryContainer').find('#f_glossaryContent').find('#glossarybtns').find('.btn').removeClass('active')
        targetButton.addClass('active visited');
        // console.log(num1)
    } else {
        $('#f_glossaryContainer').find('#f_glossaryContent').find('#glossarybtns').find('#btn-1').addClass('active visited')
        num1 = 0;
    }
           
        $("#f_glossaryPopup").find('#f_glossaryContainer').find('#f_glossaryContent').find("#glossaryPopup").remove();        
 
    let tableContent = '';
    let htmlObj = '';
    // for(let k=0;k< _glossaryData.length;k++){
 
    tableContent += '<table id="table-' + (num1 + 1) + '">'
    tableContent += '<thead><tr>'
    for (let i = 0; i < _glossaryData[num1].terms.tableTitle.length; i++) {
        tableContent += '<th scope="row" aria-label="" tabindex="0">' + _glossaryData[num1].terms.tableTitle[i] + '</th>';
    }
    tableContent += '</tr></thead>';
    tableContent += '<tbody>'
    for (let j = 0; j < _glossaryData[num1].terms.table.length; j++) {
        tableContent += "<tr>";
        tableContent += '<td tabindex="0" aria-label="' + removeTags(_glossaryData[num1].terms.table[j].term) + '">' + _glossaryData[num1].terms.table[j].term + '</td><td tabindex="0" aria-label="' + removeTags(_glossaryData[num1].terms.table[j].definition) + '">' + _glossaryData[num1].terms.table[j].definition + '</td>';
        tableContent += "</tr>";
    }
    tableContent += '</tbody>'
    tableContent += '</table>';
    // }
    // htmlObj +
    // console.log(html)
    $('#f_glossaryContainer').find('#f_glossaryContent').append('<div id="glossaryPopup">' + tableContent + '</div>');
 
    $('#f_glossaryContainer').find('#f_glossaryContent').find("#glossaryPopup").find('table th:first').focus();
 
    $('#f_glossaryContainer').find('#f_glossaryContent').find("#glossaryPopup").find('table tr:last td:last').focus(function () {
        $(this).keydown(function (e) {
            if (e.which == 9) {
                let indx = num1;
                indx = indx + 1;
                //console.log(indx+' < '+_pageData.sections[sectionCnt-1].content.length)
                if (indx < _glossaryData[num1].terms.tableTitle.length) {
                    $('#f_glossaryContainer').find('#f_glossaryContent').find("#glossarybtns").find('#btn-' + indx).focus()
                }
            }
        })
    })
}
function showGlossaryWords() {
    _glossarySelectedLetter = parseInt($(this).attr('id').split('_')[1])
    _glossarySelectedWord = 0
    _glossaryView.createGlossaryWords();
}

function clickGlossaryWord() {
    _glossarySelectedWord = parseInt($(this).attr('id').split('_')[1]);
    _glossaryView.showGlossaryDescription();
}

function removeTags(str) {
    if ((str === null) || (str === '')) {
        return false;
    } else {
        str = str.toString();
        str = str.replace(/(<([^>]+)>)/ig, '');
        str = str.split("EY").join("E Y");
        return str
    }
}