var _pgData = null;
var _quizData = null;
var _selectedOptions = [];
var _checkBtn = null;
var _noTimesAttended = 0;
var _correctAns = [];
var _resultFlag = false;

function enableMcmsQuiz(_pData) {
     _noTimesAttended = 0;
     _pgData = _pData;
     _quizData = _pgData.quiz;
     _selectedOptions = [];

     for (var i = 0; i < _quizData.options.length; i++)
          _selectedOptions.push(-1);

     _checkBtn = $('.f_checkBtn');
     _checkBtn.off('click mouseenter mouseleave keyup').on('click mouseenter mouseleave keyup', selectCheckOption);
}

function selectCheckOption(e) {
     switch (e.type) {
          case 'click':
               optionSelected(this);
               break;
          case 'mouseenter':
               _checkBtn.removeClass('f_over');
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
     var currIndx = _checkBtn.index(_this);
     _checkBtn.find('.f_mark').detach();

     if ($(_this).attr('aria-checked') === 'true') {
          _selectedOptions[currIndx] = -1;
          $(_this).removeClass('f_over');
          $(_this).attr('aria-checked', 'false');
     } else {
          _selectedOptions[currIndx] = 1;
          $(_this).addClass('f_over');
          $(_this).attr('aria-checked', 'true');
     }

     //------------ enable submit button ------------
     var tmpCnt = 0;
     for (var i = 0; i < _selectedOptions.length; i++) {
          if (_selectedOptions[i] == 1)
               tmpCnt++;
     }

     if (tmpCnt > 0) {
          enableMcmsSubmitButton();
     } else {
          disableMcmsSubmitButton();
     }
}

function enableMcmsSubmitButton() {
     $(".f_submitBtn").css({
          'opacity': 1,
          'cursor': 'pointer'
     }).off('click').on('click', validateMcms);
     $(".f_submitBtn").attr('aria-disabled', 'false');
}

function disableMcmsSubmitButton() {
     $(".f_submitBtn").css({
          'opacity': 0.5,
          'cursor': 'default'
     }).off('click');
     $(".f_submitBtn").attr('aria-disabled', 'true');
}

function validateMcms() {
     disableMcmsOptions();
     disableMcmsSubmitButton();
     _checkBtn.find('.f_mark').detach();

     //------------ getting correct answer ------------
     _correctAns = [];
     var correctAnsCnt = 0;
     var answeredCnt = 0;

     for (var i = 0; i < _quizData.options.length; i++) {
          if (_quizData.options[i].answer) {
               _correctAns[i] = 1;
               correctAnsCnt++;
          } else {
               _correctAns[i] = -1;
          }
     }

     //------------ validation ------------
     var selectedAnsCnt = 0;
     for (var j = 0; j < _selectedOptions.length; j++) {
          if (_selectedOptions[j] == 1)
               answeredCnt++;

          if (_selectedOptions[j] == 1 && _correctAns[j] == 1)
               selectedAnsCnt++;
     }

     if (correctAnsCnt == selectedAnsCnt && answeredCnt == correctAnsCnt) {
          _resultFlag = true;
          showQuizFeedback('correct');
          addTickMark();
     } else {
          _noTimesAttended++;
          if (_noTimesAttended < _quizData.noOfAttempts) {
               _resultFlag = false;
               showQuizFeedback('firstIncorrect');
               addFirstAttemptMark();
          } else {
               _resultFlag = true;
               showQuizFeedback('incorrect');
               addSecondAttemptMark();
          }
     }
}

function addTickMark() {
     for (var i = 0; i < _quizData.options.length; i++) {
          if (_quizData.options[i].answer)
               _checkBtn.eq(i).append('<div class="f_mark tick"></div>');
     }
}

function addFirstAttemptMark() {
     for (var i = 0; i < _quizData.options.length; i++) {
          if (_selectedOptions[i] == 1 && _correctAns[i] == 1) {
               _checkBtn.eq(i).append('<div class="f_mark tick"></div>');
          } else if (_selectedOptions[i] == 1) {
               _checkBtn.eq(i).append('<div class="f_mark cross"></div>');
          }
     }
}

function addSecondAttemptMark() {
     for (var i = 0; i < _quizData.options.length; i++) {
          if (_selectedOptions[i] == 1 && _correctAns[i] == 1) {
               _checkBtn.eq(i).append('<div class="f_mark tick"></div>');
          } else if (_selectedOptions[i] == 1) {
               _checkBtn.eq(i).append('<div class="f_mark cross"></div>');
          }
     }

     setTimeout(function () {
          for (var j = 0; j < _quizData.options.length; j++) {
               if (_correctAns[j] == 1) {
                    if (_checkBtn.hasClass('f_mark')) {

                    } else {
                         _checkBtn.eq(j).append('<div class="f_mark tick"></div>');
                         _checkBtn.eq(j).addClass('f_marked');
                    }
               }
          }
     }, 600);
}


function disableMcmsOptions() {
     _checkBtn.off('click mouseenter mouseleave keyup').css({
          "cursor": "default"
     }).addClass('disabled');
}

function enableMcmsOptions() {
     if (_noTimesAttended < _quizData.noOfAttempts && !_resultFlag) {
          _checkBtn.off('click mouseenter mouseleave keyup').on('click mouseenter mouseleave keyup', selectCheckOption).removeClass('disabled');
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
          generatePopup(popupCont, $("#f_mediaBtn"), _pgData, undefined, undefined, 'mcms');
     } else {
          generatePopup(popupCont, $(".instruction"), _pgData, undefined, undefined, 'mcms');
          $(".instruction").attr("tabindex", 0);
     }
}

function resetQuiz() {
     _selectedOptions = null;
     _checkBtn.attr('aria-checked', 'false');

     disableMcmsSubmitButton();
}