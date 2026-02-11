addVideoResourceContent = function (_pgData) {
   for (var i = 0; i < _pgData.leftSide.content.length; i++) {
      if (typeof _pgData.leftSide.content[i] != "object") {
         $(".left_side").append("<p>" + _pgData.leftSide.content[i] + "</p>");
         $(".left_side p").find('a').addClass('hyperlinks').attr('href', 'javascript:void(null);');
      } else {
         //------ list items ------
         if (_pgData.leftSide.content[i].listItem.type != '') {
            listCnt++;
            generateListItem(_pgData.leftSide.content[i].listItem, $(".left_side"), listCnt);
         }
      }
   }

   //-------- Instruction -----------
   generateInstructionText(_pgData, $(".left_side"));

   //--------------- adding video link ---------------
   $(".left_side").append("<div class='videoLinkHolder'><button p class='videoLink clearFix' aria-label='" + _pgData.videoLinkAltText + " Link'></button></div>");

   //--------------- adding questions ---------------
   for (var j = 0; j < _pgData.questionText.length; j++) {
      $(".left_side").append("<div class='questionContainer'><p class='qNo'>Q" + (j + 1) + ". </p><p>" + _pgData.questionText[j] + "</p></div>");
   }

   $(".videoLink").off('click').on('click', {
      param: _pgData.videoLink
   }, openVideoLink);
   $(".hyperlinks").off('click').on('click', {
      param: _pgData
   }, openHyperlink);
}