function textAreaOnchange(e) {
  var _data = e.data.param;
  var textLen = $(this).val();

  //------------ enable submit button ------------
  if (textLen.length > 0) {
    enableReviewSubmitButton(_data);
  } else {
    disableReviewSubmitButton();
  }
}

function enableReviewSubmitButton(_data) {
  $(".f_submitBtn")
    .css({
      opacity: 1,
      cursor: "pointer"
    })
    .off("click")
    .on(
      "click", {
        param: _data
      },
      validateReviewQuiz
    );
  $(".f_submitBtn").attr("aria-disabled", "false");
}

function disableReviewSubmitButton() {
  $(".f_submitBtn")
    .css({
      opacity: 0.5,
      cursor: "default"
    })
    .off("click");
  $(".f_submitBtn").attr("aria-disabled", "true");
}

function validateReviewQuiz(e) {
  var _data = e.data.param;

  disableReviewSubmitButton();

  setTimeout(function () {
    var listCnt = 0;
    for (var i = 0; i < _data.quiz.displayAnswer.length; i++) {
      if (typeof _data.quiz.displayAnswer[i] != "object") {
        $(".resultArea").append("<p>" + _data.quiz.displayAnswer[i] + "</p>");
        //----------create equation----------
        createEquation($(".resultArea p").eq(i), _data);
      } else {
        //------ list items ------
        if (_data.quiz.displayAnswer[i].listItem.type != "") {
          listCnt++;
          generateListItem(
            _data.quiz.displayAnswer[i].listItem,
            $(".resultArea"),
            listCnt
          );
        }
      }
    }
    if (_data.quiz.displayAnswerImage != undefined) {
      generateDecorativeImage(_data.quiz.displayAnswerImage.images, $(".resultArea"));
    }

    $(".resultArea").show();
    $("#reviewInput").hide();
  }, 200);

  generatePopup(_data.quiz.feedback, $("#f_mediaBtn"), _data);
}