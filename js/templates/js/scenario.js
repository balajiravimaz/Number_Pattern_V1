var _curScenarioBtn = null;
var _scenarioData = null;
var _pageCont = null;
var _scenarioOpen = false;

function generateDefaultPopup(_data, _curBtn, _pageD) {
  _curScenarioBtn = _curBtn;
  _scenarioData = _data;
  _pageCont = _pageD;

  generatePopup(_scenarioData, _curScenarioBtn, _pageCont);

  $(".popup_close").hide();

  $(".popup_section").append(
    '<button type="button" class="scenarioContinueBtn">Continue</button>'
  );

  $(".scenarioContinueBtn")
    .off("click mouseenter mouseleave")
    .on(
      "click mouseenter mouseleave",
      {
        param: _pageCont
      },
      hideScenarioPopup
    );
}

function generateScenarioPopup(_data, _curBtn, _pageD) {
  _curScenarioBtn = _curBtn;
  _scenarioData = _data;
  _pageCont = _pageD;

  $(".popup_container").empty();

  //--------------- adding popup content elements ---------------
  $(".popup_container").append(
    '<div class="scenario_holder"><div class="scrollbar_outer"><div class="scenario_header"><div class="scenario_title"><p>' +
      _scenarioData.titleText +
      '</p></div><div class="scenario_instruciton"><p>' +
      _scenarioData.instruction +
      '</p></div></div><div class="scenario_section"></div></div></div>'
  );

/*   $(".scenario_holder").css({
    "background-image": "url(" + _scenarioData.bgImage.imageSRC + ")"
  }); */

  $(".scenario_section").append(
    '<div class="char_holder" id="char_0"><button type="button" class="charBtn" aria-label="' +
      _scenarioData.characters[0].name +
      '"></button><div class="char_name"><p>' +
      _scenarioData.characters[0].name +
      '</p></div></div><div class="scenario_callout"></div><div class="char_holder" id="char_1"><button type="button" class="charBtn" aria-label="' +
      _scenarioData.characters[1].name +
      '"></button><div class="char_name"><p>' +
      _scenarioData.characters[1].name +
      "</p></div></div>"
  );

  $(".scenario_section").append(
    '<button type="button" class="scenarioContinueBtn">Continue</button>'
  );

  $("#char_0")
    .find(".charBtn")
    .css({
      "background-image":
        "url(" + _scenarioData.characters[0].image.imageSRC + ")"
    });
  $("#char_1")
    .find(".charBtn")
    .css({
      "background-image":
        "url(" + _scenarioData.characters[1].image.imageSRC + ")"
    });

  //------ assign audio ------
  enablePopupAudio(_scenarioData, true, 1);

  //------ show popup ------
  $(".popup_container")
    .show()
    .css({
      display: "flex"
    })
    .stop()
    .animate(
      {
        opacity: 1
      },
      400,
      function() {
        _popupAudioPlaying = false;
        //_scenarioOpen = true;
        setFocus($(".scenario_title"), 0);
        //enableScrollBar($('.scroll_holder'), "dark");
        destroyScrollBar($(".scroll_holder"));

        $(".scenarioContinueBtn")
          .off("click mouseenter mouseleave")
          .on(
            "click mouseenter mouseleave",
            {
              param: _pageCont
            },
            hideScenarioPopup
          );

        $(".charBtn")
          .off("click")
          .on(
            "click",
            {
              param: _scenarioData
            },
            showSpeechBubble
          );

        moveToTop();
      }
    );
}

var selectedCharIndx = null;

function showSpeechBubble(e) {
  var popupCont = e.data.param;
  $(".scenario_callout").empty();
  $(".scenario_callout").append(
    '<div class="callout_arrow"><div class="callArrow"></div></div>'
  );
  selectedCharIndx = $(".charBtn").index(this);

  $(".charBtn")
    .off("click")
    .on(
      "click",
      {
        param: popupCont
      },
      showSpeechBubble
    )
    .removeClass("char_selected")
    .removeAttr("tabindex");

  $(this)
    .off("click")
    .addClass("char_selected")
    .attr("tabindex", -1);

  for (
    var i = 0;
    i < popupCont.characters[selectedCharIndx].calloutText.length;
    i++
  ) {
    $(".scenario_callout").append(
      "<p>" + popupCont.characters[selectedCharIndx].calloutText[i] + "</p>"
    );
  }
  _speechBubbleOpened = true;
  updateSpeechBubbleArrow();
  $(".scenario_callout").css({
    opacity: 1
  });

  //------ assign audio ------
  enablePopupAudio(popupCont.characters[selectedCharIndx], true, 1);

  setFocus($(".scenario_callout"), 0);
}

function updateSpeechBubbleArrow() {
  $(".callArrow").removeClass("leftArrow rightArrow topArrow bottomArrow");
  console.log("isMobile", isMobile);

  if (!isMobile) {
    arrowPos();
  } else {
    if (!mobileLandscape) {
      if (isIpad) {
        arrowPos();
      } else {
        if (selectedCharIndx == 0) {
          $(".scenario_callout")
            .find(".callArrow")
            .addClass("topArrow");
          $(".callout_arrow").css({
            left: "50%",
            "margin-left": "-8px",
            right: "unset",
            top: "-16px",
            bottom: "unset"
          });
        } else {
          $(".scenario_callout")
            .find(".callArrow")
            .addClass("bottomArrow");
          $(".callout_arrow").css({
            left: "50%",
            "margin-left": "-8px",
            right: "unset",
            top: "unset",
            bottom: "-16px"
          });
        }
      }
    } else {
      arrowPos();
    }
  }

  //updateScenarioPopupPosition();
}

function arrowPos() {
  if (selectedCharIndx == 0) {
    $(".scenario_callout")
      .find(".callArrow")
      .addClass("leftArrow");
    $(".callout_arrow").css({
      left: "-16px",
      "margin-left": "0",
      right: "unset",
      top: "40px",
      bottom: "unset"
    });
  } else {
    $(".scenario_callout")
      .find(".callArrow")
      .addClass("rightArrow");
    $(".callout_arrow").css({
      left: "unset",
      right: "-16px",
      top: "40px",
      bottom: "unset",
      "margin-left": "0"
    });
  }
}

function hideScenarioPopup(e) {
  switch (e.type) {
    case "click":
      var _data = e.data.param;

      $(".charBtn").removeClass("char_selected");

      $(".popup_container")
        .stop()
        .animate(
          {
            opacity: 0
          },
          300,
          function() {
            _scenarioOpen = false;
            $(".popup_container").hide();
            setTimeout(function() {
              resetMainAudio(_data);
            }, 100);
            enableScrollBar($('.scroll_holder'), "dark");
            destroyScrollBar($(".popup_container"));
            setFocus(_curScenarioBtn);

            var selectedIndx = parseInt(
              _curScenarioBtn.attr("id").split("_")[1]
            );

            $("#scenarioBtn_" + (selectedIndx + 1))
              .off("click mouseenter mouseleave")
              .on("click mouseenter mouseleave", selectedScenarioPopup)
              .css({
                opacity: 1,
                cursor: "pointer"
              });

            removeButtonDisabled($("#scenarioBtn_" + (selectedIndx + 1)));
          }
        );
      break;
    case "mouseenter":
      break;
    case "mouseleave":
      break;
  }
}

//----------------------------------- hint popup -----------------------
function showHintPopup(e) {
  switch (e.type) {
    case "click":
      var _data = e.data.param;
      var _hintData = _data.hintPopup;
      _hintPopupOpened = true;

      $(this)
        .off("click")
        .css({
          cursor: "default"
        });

      $(".hint_popup_container").empty();

      $(".hint_popup_container").append(
        "<div class='hint_holder'><div class='scrollbar_hintOuter'><div class='hintPopup_section'></div></div></div>"
      );

      for (var i = 0; i < _hintData.content.length; i++) {
        if (typeof _hintData.content[i] == "object") {
          if (_hintData.content[i][0].type == "number") {
            $(".hintPopup_section").append(
              "<ol class='list_items_number list'></ol>"
            );
          } else {
            $(".hintPopup_section").append("<ul class='list_items list'></ul>");
          }

          //-------- list items -----------
          for (var j = 1; j < _hintData.content[i].length; j++) {
            $(".hintPopup_section")
              .find(".list")
              .append("<li>" + _hintData.content[i][j] + "</li>");
            $(".hintPopup_section .list li")
              .find("a")
              .addClass("hyperlinks")
              .attr("href", "javascript:void(null);");
          }
        } else {
          $(".hintPopup_section").append("<p>" + _hintData.content[i] + "</p>");
          $(".hintPopup_section p")
            .find("a")
            .addClass("hyperlinks")
            .attr("href", "javascript:void(null);");
        }
      }

      $(".scrollbar_hintOuter").append(
        '<div class="continueBtnHolder"><button type="button" class="hintContinueBtn">Continue</button></div>'
      );

      setTimeout(function() {
        if (_scenarioOpen) enablePopupAudio(_hintData, true, 2);
        else enablePopupAudio(_hintData, true, 1);

        $(".hint_popup_container")
          .show()
          .css({
            display: "flex"
          })
          .stop()
          .animate(
            {
              opacity: 1
            },
            400,
            function() {
              $(".hyperlinks")
                .off("click")
                .on(
                  "click",
                  {
                    param: _data
                  },
                  openHyperlink
                );
              $(".hintContinueBtn")
                .off("click")
                .on(
                  "click",
                  {
                    param: _pageData
                  },
                  closeHintPopup
                );
              setFocus($(".hintPopup_section p").eq(0), 0);
            }
          );
      }, 100);

      break;
    case "mouseenter":
      $(this).addClass("hint_over");
      break;
    case "mouseleave":
      $(this).removeClass("hint_over");
      break;
  }
}

//--------------- close popup ---------------
function closeHintPopup(e) {
  switch (e.type) {
    case "click":
      $(".hint_popup_container")
        .stop()
        .animate(
          {
            opacity: 0
          },
          300,
          function() {
            _hintPopupOpened = false;
            $(".hint_popup_container").hide();
            setTimeout(function() {
                console.log(_scenarioOpen)
                if (_scenarioOpen) {
                    resetAudio(2);
                } else {
                    resetAudio(1);
                }
            //   resetMainAudio(_pageData);
            }, 100);

            $("#f_hintBtn")
              .off("click mouseenter mouseleave")
              .on(
                "click mouseenter mouseleave",
                {
                  param: _pageData
                },
                showHintPopup
              )
              .css({
                cursor: "pointer"
              });

            disableScrollBar($(".scroll_holder"), false);
            destroyScrollBar($(".popup_container"));
            setFocus($("#f_hintBtn"), 0);
          }
        );

      break;
    case "mouseenter":
      break;
    case "mouseleave":
      break;
  }
}

// -------- resize page details ------------
$(window).resize(function() {
  setTimeout(function() {
    updateCSS();
    if (_speechBubbleOpened) updateSpeechBubbleArrow();
  }, 50);
});
