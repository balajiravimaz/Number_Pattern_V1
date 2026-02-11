var previousPanel = null;

function generateAccordian(_pData) {
     var listCnt = 0;

     //-------- Popup button -----------
     for (var k = 0; k < _pData.accordianPopup.button.length; k++) {
          $(".accordian_container").append('<button aria-expanded="false" class="accordion-trigger" aria-controls="panel' + k + '" id="accordion' + k + 'id"><span class="accordion-title">' + _pData.accordianPopup.button[k].text + '<span class="accordion-icon"></span></span></button><div id="panel' + k + '" role="region" aria-labelledby="accordion' + k + 'id" class="accordion-panel"><div class="panel_left_side"></div></div>');

          //-------- paragraph content -----------
          for (var l = 0; l < _pData.accordianPopup.content[k].text.length; l++) {
               if (typeof _pData.accordianPopup.content[k].text[l] != "object") {
                    $('.accordion-panel').eq(k).find(".panel_left_side").append("<p>" + _pData.accordianPopup.content[k].text[l] + "</p>");
                    $('.accordion-panel').eq(k).find(".panel_left_side").find("p").find('a').addClass('hyperlinks').attr('href', 'javascript:void(null);');
               } else {
                    //------ list items ------
                    if (_pData.accordianPopup.content[k].text[l].listItem.type != '') {
                         listCnt++;
                         generateListItem(_pData.accordianPopup.content[k].text[l].listItem, $('.accordion-panel').eq(k).find(".panel_left_side"), listCnt);
                    }
               }

          }

          if (_pData.accordianPopup.content[k].image != undefined) {
               $('.accordion-panel').eq(k).append("<div class='panel_right_side'><img class='image_Frame' src='" + _pData.accordianPopup.content[k].image.imageSRC + "'></div>");

               $('.accordion-panel').eq(k).find('img').css({
                    'width': _pData.accordianPopup.content[k].image.width
               })
          }
     }

     $('.accordion-trigger').off('click').on('click', {
          param: _pData
     }, showAccordian);
}

function showAccordian(e) {
     var eventType = e.type;
     var targetButton = $(this);
     var pData = e.data.param;

     switch (eventType) {
          case "click":
               var isExpanded = targetButton.attr('aria-expanded') == 'true';
               var activePanel = $("#" + targetButton.attr('aria-controls'));
               var popupCont = pData.accordianPopup.content[$(".accordion-trigger").index(this)];

               if (isExpanded) {
                    hidePanel(activePanel);
               } else {
                    if (previousPanel == null) {
                         openPanel(activePanel, targetButton, popupCont);
                    } else {
                         //---- previous panel hide ----
                         hidePanel(previousPanel, pData);

                         //---- current panel show ----
                         openPanel(activePanel, targetButton, popupCont);
                    }
               }
               break;

          case "mouseenter":
               break;

          case "mouseleave":
               break;

          case "keydown":
               break;
     }
}

function openPanel(_panel, _targetButton, popupCont) {
     _panel.show();
     _panel.css('height', 'auto');
     var tmpH = _panel.outerHeight();
     _panel.css('height', '0');
     _panel.stop().animate({
          'height': tmpH
     }, 350, function () {
          previousPanel = _panel;
          var tmp = _panel.find('.panel_left_side').children();
          setFocus($(tmp[0]), 0);
          enablePopupAudio(popupCont, true, 1);
          //updateAccordianAudio(popupCont);
     });

     _targetButton.attr('aria-expanded', 'true');
}

function hidePanel(_panel, _pData) {
     resetMainAudio(_pData);
     _panel.stop().animate({
          'height': 0
     }, 300, function () {
          _panel.hide();
          previousPanel = null;
     });
     $("#" + _panel.attr('aria-labelledby')).attr('aria-expanded', 'false');
}


//--------- audio ---------------
function updateAccordianAudio(_data) {
     currentMedia.pause();
     currentMedia.removeEventListener('timeupdate', checkTimeUpdate);

     updatePopupAudio(_data)
}

function stopAccordianAudio() {
     if (_popTweenTimeline) {
          _popTweenTimeline.kill();
     }
     _popTweenTimeline = null;
     
     mediaLevelOne.pause();
     _popupAudio = false;
     _reloadRequired = false;
     popupMedia = false;
}