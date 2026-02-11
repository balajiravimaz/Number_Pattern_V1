var _pgData = null;
var _quizData = null;
var _selectedOption = null;
var _radioBtn = null;
var _noTimesAttended = 0;
var _resultFlag = false;

function enableMcssQuiz(_pData) {
     _noTimesAttended = 0;
     _pgData = _pData;
     _quizData = _pgData.quiz;
     _radioBtn = $('.f_radioBtn');
     _radioBtn.off('click mouseenter mouseleave keyup').on('click mouseenter mouseleave keyup', selectRadioOption);
}

function selectRadioOption(e) {
     switch (e.type) {
          case 'click':
               optionSelected(this);
               break;
          case 'mouseenter':
               _radioBtn.removeClass('f_over');
               $(this).addClass('f_over');
               break;
          case 'mouseleave':
               $(this).removeClass('f_over');
               break;
          case 'keyup':
               var code = e.keyCode || e.which;
               if (code == 13 || code == 32)
                    optionSelected(this);

               break;
     }
}

function optionSelected(_this) {
     //------------ reset all options ------------
     _radioBtn.removeClass('f_over');
     _radioBtn.find('.f_mark').hide();
     _radioBtn.find('.f_mark').detach();
     _radioBtn.attr('aria-checked', 'false');
     _radioBtn.off('click  mouseenter mouseleave keyup').on('click  mouseenter mouseleave keyup', selectRadioOption).css({
          "cursor": "pointer"
     });

     //------------ update selected option ------------
     $(_this).addClass('f_over');
     $(_this).attr('aria-checked', 'true');
     $(_this).off('click  mouseenter mouseleave keyup').css({
          "cursor": "default"
     });

     _selectedOption = _radioBtn.index(_this);


     //------------ enable submit button ------------
     enableMcssSubmitButton();
}

function validateMcss() {
     disableMcssSubmitButton();
     _radioBtn.find('.f_mark').detach();

     //------------ getting correct answer ------------
     var correctAns = null;
     for (var i = 0; i < _quizData.options.length; i++) {
          if (_quizData.options[i].answer) {
               correctAns = i;
               break;
          }
     }

     //------------ validation ------------
     if (correctAns == _selectedOption) {
          _resultFlag = true;
          showQuizFeedback('correct');
          disableMcssOptions(correctAns);
          _radioBtn.eq(_selectedOption).append('<div class="f_mark tick"></div>');
     } else {
          _noTimesAttended++;
          if (_noTimesAttended < _quizData.noOfAttempts) {
               _resultFlag = false;
               disableMcssOptions();
               showQuizFeedback('firstIncorrect');
               _radioBtn.eq(_selectedOption).append('<div class="f_mark cross"></div>');
          } else {
               _resultFlag = true;
               showQuizFeedback('incorrect');
               disableMcssOptions(correctAns);
               _radioBtn.eq(_selectedOption).append('<div class="f_mark cross"></div>');
               _radioBtn.eq(correctAns).append('<div class="f_mark tick"></div>');
          }
     }
}

function enableMcssSubmitButton() {
     $(".f_submitBtn").css({
          'opacity': 1,
          'cursor': 'pointer'
     }).off('click').on('click', validateMcss);
     $(".f_submitBtn").attr('aria-disabled', 'false');
}

function disableMcssSubmitButton() {
     $(".f_submitBtn").css({
          'opacity': 0.5,
          'cursor': 'default'
     }).off('click');
     $(".f_submitBtn").attr('aria-disabled', 'true');
}

function disableMcssOptions(correctAns) {
     _radioBtn.off('click mouseenter mouseleave keyup').css({
          "cursor": "default"
     }).addClass('disabled');

     if (correctAns != undefined)
          _radioBtn.eq(correctAns).addClass('f_marked');
}

function enableMcssOptions() {
     if (_noTimesAttended < _quizData.noOfAttempts && !_resultFlag) {
          _radioBtn.removeClass("disabled");

          for (var i = 0; i < _quizData.options.length; i++) {
               if (i != _selectedOption) {
                    _radioBtn.eq(i).off('click  mouseenter mouseleave keypress').on('click  mouseenter mouseleave keyup', selectRadioOption).css({
                         "cursor": "pointer"
                    }).attr('aria-checked', 'false');
               }
          }

     }
}


function showQuizFeedback(_feedText) {
     var popupCont = null;

     switch (_feedText) {
          case 'correct':
               popupCont = _quizData.feedbackText.correct;
               break;
          case 'firstIncorrect':
               popupCont = _quizData.feedbackText.firstIncorrect;
               break;
          case 'incorrect':
               popupCont = _quizData.feedbackText.incorrect;
               break;
     }

     _popupWidth = _quizData.feedbackText.popupWidth;
     _linkPopupOpened = true;

     if (_feedText == 'incorrect' || _feedText == 'correct') {
          generatePopup(popupCont, $("#f_mediaBtn"), _pgData, undefined, undefined, 'mcss');
     } else {
          generatePopup(popupCont, $(".instruction"), _pgData, undefined, undefined, 'mcss');
          $(".instruction").attr("tabindex", 0);
     }

}

function resetQuiz() {
     _selectedOption = null;
     enableMcssOptions();
     disableMcssSubmitButton();
}