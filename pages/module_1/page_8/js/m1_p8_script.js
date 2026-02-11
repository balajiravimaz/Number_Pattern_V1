// ---------- setting start ---------------
var _preloadData, _pageData;
var _pagePreloadArray = {
  image: 1,
  audio: 1,
  video: 1,
  data: -1,
}; // item not availble please assign value 1.
var jsonSRC = "pages/module_1/page_8/data/m1_p8_data.json?v=";
_pageAudioSync = true;
_forceNavigation = false;
_audioRequired = false;
_videoRequired = false;
storeCurrentAudioTime = 0;
_popupAudio = false;
_reloadRequired = true;
_globalCicked = 0;
_currentAudio = null;
_isPlayed = false;
_checkAudioFlag = false;
_tweenTimeline = null;
_popTweenTimeline = null;
var lastPatternId = null;
var patterns = null;
var allPatterns = null;

var currentPatternIndex = 0;
var totalPatterns = 0;

var _audioIndex = 0;
_videoId = null;
_audioId = null;
// ---------- setting end ---------------
var sectionCnt = 0;
var totalSection = 0;
var prevSectionCnt = -1;
var sectionTopPos = [];
var playMainAudio = false;
// ------------------ common function start ------------------------------------------------------------------------
$(document).ready(function () {
  //console.log('Page ready')
  _preloadData = new PagePreload();
  _preloadData.initObj(_pagePreloadArray, jsonSRC);
  _preloadData.addCustomEvent("ready", _pageLoaded);
  //console.log('Page ready 1', _preloadData)
});

function _pageLoaded() {
  //console.log('_pageLoaded')
  _pageData = _preloadData.jsonData;
  if (_audioRequired) {
    _audioId = _pageData.mainAudio.audioSRC;
    _audioIndex = _pageData.mainAudio.audioIndex;
  }

  if (_videoRequired) _videoId = "courseVideo";

  //addSlideData();
  // console.log(_pageData.sections, _pageData.sections[0].backBtnSrc, "pageDAtat")
  addSectionData();
  initPageAnimations();
  appState.pageCount = 4;
  $('.introInfo').attr('data-popup', 'introPopup-8');
  $("#f_header").css({ backgroundImage: `url(${_pageData.sections[0].headerImg})` });
  $("#f_header").find("#f_courseTitle").css({ backgroundImage: `url(${_pageData.sections[0].headerText})` });
  $(".home_btn").css({ backgroundImage: `url(${_pageData.sections[0].backBtnSrc})` });
  // playBtnSounds(_pageData.sections[sectionCnt - 1].endAudio);
  //   showEndAnimations();
  checkGlobalAudio();
  assignAudio(
    _audioId,
    _audioIndex,
    _pageAudioSync,
    _forceNavigation,
    _videoId,
    _popupAudio,
    _reloadRequired
  );
  pagePreLoad();
}

// ------------------ common function end ------------------------------------------------------------------------

// -------- adding slide data ------------
function addSectionData() {
  totalSection = _pageData.sections.length;
  for (let n = 0; n < _pageData.sections.length; n++) {
    sectionCnt = n + 1;
    if (sectionCnt == 1) {
      playBtnSounds(_pageData.sections[sectionCnt - 1].introAudio);
      audioEnd(function () {
        // $(".dummy-patch").hide();
        resetSimulationAudio();
      })
      $("#section-" + sectionCnt)
        .find(".content-holder")
        .find(".col-left")
        .find(".content")
        .find(".content-bg")
        .find(".content-style")
        .append(
          '<div class="inst"><p tabindex="0" aria-label="' +
          removeTags(_pageData.sections[sectionCnt - 1].iText) +
          '">' +
          _pageData.sections[sectionCnt - 1].iText +
          "</p><button class='intro-audio' data-audio='" + _pageData.sections[sectionCnt - 1].introAudio + "'> </button></div>"
        );


      /* $('#section-' + sectionCnt).find('.content-holder').find('.col-left').find('.content').find('.content-bg').find('.content-style').append(_pageData.sections[sectionCnt - 1].headerTitle);*/

      /*let titletext = $('#section-' + sectionCnt).find('.content-holder').find('.col-left').find('.content').find('.content-bg').find('.content-style').text()
            $('#section-' + sectionCnt).find('.content-holder').find('.col-left').find('.content').find('.content-bg').find('.content-style').find('h1').attr('aria-label', titletext)*/

      // $('#section-' + sectionCnt).find('.content-holder').find('.col-left').find('.content').find('.content-bg').find('.content-style')

      //    let textObject = '', listObject = '';


      // console.log(_pageData.sections[sectionCnt - 1].content.numberObjects, _pageData.sections[sectionCnt - 1].content.numberObjects.length, "lneght")

      const numberObjects =
        _pageData.sections[sectionCnt - 1].content.numberObjects;
      patterns = _pageData.sections[sectionCnt - 1].content.numberObjects;

      // pick ONE random pattern
      const pattern = getRandomPattern(numberObjects);

      let htmlContent = "";
      htmlContent += `<div class="game-area">`;
      htmlContent += `<div class="shelf">${getShelfHTML(pattern)}</div>`;
      htmlContent += `<div class="cups">${getCupHTML(pattern)}</div>`;
      htmlContent += `</div>`;



      let headerConent = "";
      let popupDiv = "";

      headerConent += `<div class="confetti"></div>`;
      popupDiv += '<div class="popup">';
      popupDiv += '<div class="popup-wrap">';

      popupDiv += '<div class="popBtns">';
      popupDiv += '<button id="refresh" data-tooltip="Replay"></button>';
      popupDiv += '<button id="homeBack" data-tooltip="Back"></button>';
      popupDiv += "</div>";
      popupDiv += "</div>";
      popupDiv += "</div>";
      popupDiv += '<div class="greetingsPop">';
      popupDiv += '<div class="popup-wrap">';
      popupDiv += "</div>";
      popupDiv += "</div>";
      popupDiv += `<div id="introPopup-8"><div class="popup-content">
                    <button class="introPopAudio mute" onclick="togglePopAudio(this, '${_pageData.sections[sectionCnt - 1].infoAudio}')"></button>
                    <button class="introPopclose" data-tooltip="Close" onClick="closeIntroPop('introPopup-8')"></button>
                    <img src="${_pageData.sections[sectionCnt - 1].infoImg}" alt="">
                </div>
            </div>`;

      popupDiv += `<div id="home-popup" class="popup-home" role="dialog" aria-label="Exit confirmation" aria-hidden="false">
    <div class="popup-content modal-box">
      <h2 class="modal-title">Oops!</h2>
      <div class="modal-message">
        <p>If you leave the pattern game then you have to start from beginning.</p>     
        <p class="modal-question">Are you sure you want to leave?</p>   
      </div>      
      <div class="modal-buttons">
        <button id="stay-btn" class="modal-btn" onClick="stayPage()">Stay</button>
        <button id="leave-btn" class="modal-btn" onClick="leavePage()">Leave</button>
      </div>
    </div>
  </div>`;

      $("#section-" + sectionCnt)
        .find(".content-holder")
        .find(".col-left")
        .find(".content")
        .find(".content-bg")
        .find(".content-style")
        .append(
          popupDiv +
          headerConent +
          '<div class="body"><div class="animat-container"> <div class="dummy-patch"></div>' +
          htmlContent +
          "</div> </div>"
        );

      $('.intro-audio').off('click').on('click', onClickAudioHandler);
      // enableDragAndDrop({
      //   cupsSelector: ".cups .cup",
      //   slotsSelector: ".shelf .slot",

      //   onCorrectDrop: (cup, slot) => {
      //     cup.classList.remove("success");
      //     void cup.offsetWidth;
      //     cup.classList.add("success");
      //     playFeedbackAudio(_pageData.sections[sectionCnt - 1].correctAudio);
      //   },

      //   onWrongDrop: (cup) => {
      //     playFeedbackAudio(_pageData.sections[sectionCnt - 1].wrongAudio);
      //   },

      //   onGameCompleted: () => {
      //     console.log("Game Completed");
      //     setTimeout(function () {
      //       playBtnSounds(_pageData.sections[sectionCnt - 1].finalAudio);
      //       showEndAnimations();
      //     }, 1000)
      //   }
      // });



      // $(".flip-card").on("click", onClickHanlder);



      // $("#refresh").on("click", restartActivity);
      // $("#home,#homeBack").on("click", jumtoPage)        

      totalPatterns = _pageData.sections[sectionCnt - 1].content.numberObjects.length;
      allPatterns = _pageData.sections[sectionCnt - 1].content.numberObjects;


      const gameArea = document.querySelector(".game-area");
      gameArea.classList.add("is-fading");

      loadPattern(0);

      requestAnimationFrame(() => {
        gameArea.classList.remove("is-fading");
      });

      $("#refresh").on("click", function () {
        jumtoPage(_controller.pageCnt);
      });
      $("#homeBack").on("click", function () {
        jumtoPage(_controller.pageCnt - 1)
      });

      // $("#home").on("click", function () {
      //   playClickThen();
      //   $("#home-popup").css('display', 'flex');
      //   AudioController.pause();
      // });
      // $(".music").on("click", function (event) {
      //   playClickThen();
      //   let el = event.currentTarget;
      //     toggleAudio(el);
      // });
      // _currentAudio = _pageData.sections[sectionCnt - 1].content.flipObjects[0].instAudio;

      $(".flipTextAudio").on("click", replayLastAudio);

      // document.querySelector("#info").addEventListener("click", function (event) {
      //   playClickThen();
      //   AudioController.pause();
      //   const el = event.currentTarget;
      //   // console.log("its wokring")
      //   $("#introPopup-1").css('display', 'flex')
      //   $("#introPopup-1").css('opacity', '1')
      //   $(".introPopAudio").removeClass('playing');
      //   $(".introPopAudio").addClass('mute');

      //   // $(".introPopAudio").on("click",function(){  
      //   //     console.log("its working");

      //   // })       
      // });

      // setCSS(sectionCnt);
    }
  }
}

function playFeedbackAudio(_audio) {
  $(".dummy-patch").show();
  playBtnSounds(_audio)
  audioEnd(function () {
    $(".dummy-patch").hide();
  })
}

function onClickAudioHandler(e) {
  $("#courseAudio")[0].pause();
  playClickThen();
  $('.dummy-box').show();
  e.stopPropagation();
  const audioSrc = $(this).data('audio');
  if (!audioSrc) {
    console.log('No audio src found');
    return;
  }

  const audio = document.getElementById('courseAudio');
  if (!audio) {
    console.log('Audio element not found');
    return;
  }

  audio.src = audioSrc;
  audio.currentTime = 0;

  audio.play().catch(err => {
    console.error('Audio play failed:', err);
  });

  audio.addEventListener('ended', function () {
    console.log('Audio finished playing');
    resetSimulationAudio();
    $('.dummy-box').hide();
  });
}

function getRandomPattern(patterns) {
  if (!Array.isArray(patterns) || patterns.length === 0) return null;

  const lastId = getLastPatternId();

  let availablePatterns = patterns;

  if (!isNaN(lastId) && patterns.length > 1) {
    availablePatterns = patterns.filter(
      p => p.patternId !== lastId
    );
  }

  const selected =
    availablePatterns[Math.floor(Math.random() * availablePatterns.length)];

  saveLastPatternId(selected.patternId);

  return selected;
}




function loadPattern(index) {
  const pattern = allPatterns[index];
  if (!pattern) return;

  $(".dummy-patch").show();

  const cupsEl = document.querySelector(".cups");
  const shelfEl = document.querySelector(".shelf");

  cupsEl.innerHTML = getCupHTML(pattern);
  shelfEl.innerHTML = getShelfHTML(pattern);

  // ⬅️ MUST be after DOM update
  initPageAnimations();
  enableDragAndDrop({
    cupsSelector: ".cups .cup",
    slotsSelector: ".shelf .slot",

    onCorrectDrop: (cup, slot) => {
      cup.classList.remove("success");
      void cup.offsetWidth;
      cup.classList.add("success");
      playFeedbackAudio(_pageData.sections[sectionCnt - 1].correctAudio);
    },

    onWrongDrop: (cup) => {
      playFeedbackAudio(_pageData.sections[sectionCnt - 1].wrongAudio);
    },

    onGameCompleted: () => {
      setTimeout(function () {
        handlePatternCompleted();
      }, 500)
    }
  });

}


function handlePatternCompleted() {
  const gameArea = document.querySelector(".game-area");
  console.log("Pattern completed! Loading next pattern...");

  gameArea.classList.add("is-fading");
  setTimeout(() => {
    currentPatternIndex++;

    if (currentPatternIndex < allPatterns.length) {
      loadPattern(currentPatternIndex);

      requestAnimationFrame(() => {
        gameArea.classList.remove("is-fading");
      });
    } else {
      setTimeout(function () {
        showEndAnimations();
        playBtnSounds(_pageData.sections[sectionCnt - 1].finalAudio);
      }, 500)
    }
  }, 1000);
  // setTimeout(function(){
  //   $(".dummy-patch").hide();
  // })
}



function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getCupHTML(pattern) {
  let html = "";

  if (!pattern || !Array.isArray(pattern.items)) return html;

  // shuffle but NEVER allow correct order
  const shuffledItems = shuffleItemsAvoidCorrect(
    pattern.items,
    pattern.sequence
  );

  for (let i = 0; i < shuffledItems.length; i++) {
    const item = shuffledItems[i];

    html += `
    <div class="cupContain" id="cupContain-${i + 1}">
      <div class="cup" draggable="true" data-value="${item.value}">
        <img src="${item.img}" />
      </div>
      </div>
    `;
  }

  return html;
}

function getShelfHTML(pattern) {
  let html = "";

  for (let i = 0; i < pattern.sequence.length; i++) {
    html += `
      <div class="slot" data-value="${pattern.sequence[i]}"></div>
    `;
  }

  return html;
}


function isSameOrder(items, sequence) {
  if (items.length !== sequence.length) return false;

  for (let i = 0; i < items.length; i++) {
    if (items[i].value !== sequence[i]) {
      return false;
    }
  }
  return true;
}

function shuffleItemsAvoidCorrect(items, sequence) {
  let shuffled;
  let attempts = 0;

  do {
    shuffled = shuffleArray(items);
    attempts++;
  } while (isSameOrder(shuffled, sequence) && attempts < 10);

  return shuffled;
}



function saveLastPatternId(id) {
  localStorage.setItem("lastPatternId", id);
}

function getLastPatternId() {
  return Number(localStorage.getItem("lastPatternId"));
}



function resetCupPosition(cup) {
  cup.style.left = `${cup.dataset.startX}px`;
  cup.style.top = `${cup.dataset.startY}px`;
}

// function enableDragAndDrop({
//   cupsSelector,
//   slotsSelector,
//   onCorrectDrop,
//   onWrongDrop,
//   onGameCompleted
// }) {
//   const cups = document.querySelectorAll(cupsSelector);
//   const slots = document.querySelectorAll(slotsSelector);

//   let activeCup = null;
//   let dragImg = null;
//   let offsetX = 0;
//   let offsetY = 0;

//   cups.forEach(cup => {
//     cup.addEventListener("pointerdown", startDrag);
//   });

//   function startDrag(e) {
//     if (activeCup) return;
//     e.preventDefault();
//     playClickThen();

//     activeCup = e.currentTarget;
//     const img = activeCup.querySelector("img");

//     // clone image
//     dragImg = img.cloneNode(true);
//     dragImg.style.position = "fixed";
//     dragImg.style.width = img.offsetWidth + "px";
//     dragImg.style.height = img.offsetHeight + "px";
//     dragImg.style.pointerEvents = "none";
//     dragImg.style.zIndex = "9999";

//     document.body.appendChild(dragImg);

//     const rect = img.getBoundingClientRect();
//     offsetX = e.clientX - rect.left;
//     offsetY = e.clientY - rect.top;

//     moveAt(e.clientX, e.clientY);

//     document.addEventListener("pointermove", onMove);
//     document.addEventListener("pointerup", endDrag);
//   }

//   function moveAt(x, y) {
//     dragImg.style.left = x - offsetX + "px";
//     dragImg.style.top = y - offsetY + "px";
//   }

//   function onMove(e) {
//     moveAt(e.clientX, e.clientY);
//   }

//   function endDrag(e) {
//     document.removeEventListener("pointermove", onMove);
//     document.removeEventListener("pointerup", endDrag);

//     let dropped = false;

//     slots.forEach(slot => {
//       const rect = slot.getBoundingClientRect();

//       if (
//         e.clientX > rect.left &&
//         e.clientX < rect.right &&
//         e.clientY > rect.top &&
//         e.clientY < rect.bottom
//       ) {
//         dropped = true;
//         handleDrop(slot);
//       }
//     });

//     const cupRef = activeCup;

//     dragImg.remove();
//     dragImg = null;
//     activeCup = null;

//     // if (!dropped && cupRef) {
//     //   onWrongDrop?.(cupRef);
//     // }
//   }

//   function handleDrop(slot) {
//     if (!activeCup || slot.children.length > 0) {
//       onWrongDrop?.(activeCup);
//       return;
//     }

//     const cupValue = activeCup.dataset.value;
//     const slotValue = slot.dataset.value;

//     if (cupValue === slotValue) {
//       slot.appendChild(activeCup);

//       // 🔒 FULLY DISABLE FUTURE DRAG
//       activeCup.style.pointerEvents = "none";
//       activeCup.style.touchAction = "none";
//       activeCup.removeEventListener("pointerdown", startDrag);

//       onCorrectDrop?.(activeCup, slot);

//       if (isGameCompleted(slots)) {
//         onGameCompleted?.();
//       }
//     }

//     else {
//       onWrongDrop?.(activeCup);
//     }
//   }
// }


// function isGameCompleted(slots) {
//   return [...slots].every(slot =>
//     slot.children.length === 1 &&
//     slot.children[0].dataset.value === slot.dataset.value
//   );
// }


function enableDragAndDrop({ cupsSelector, slotsSelector, onCorrectDrop, onWrongDrop, onGameCompleted }) {
  const cups = document.querySelectorAll(cupsSelector);
  const slots = document.querySelectorAll(slotsSelector);

  let activeCup = null;
  let dragImg = null;
  let offsetX = 0;
  let offsetY = 0;

  // Store original positions for all cups
  cups.forEach(cup => {
    cup._originalParent = cup.parentElement;
    // We don't strictly need data-startX/Y for the drag logic here 
    // because we calculate offset dynamically on click, but keeping it as per your code.
    const rect = cup.getBoundingClientRect();
    cup.dataset.startX = rect.left + window.scrollX;
    cup.dataset.startY = rect.top + window.scrollY;

    cup.addEventListener("pointerdown", startDrag);
  });

  function startDrag(e) {
    if (activeCup) return;
    e.preventDefault();
    // playClickThen(); // Assuming this is defined globally in your project

    activeCup = e.currentTarget;
    const img = activeCup.querySelector("img");

    // 1. Hide the ENTIRE original cup (not just the image) so it looks like it moved
    activeCup.style.opacity = "0";

    // 2. Create drag image (clone)
    dragImg = img.cloneNode(true);

    // 3. Fix Styling to ensure "Perfect Position"
    dragImg.style.position = "fixed";
    dragImg.style.width = img.getBoundingClientRect().width + "px"; // Use rect width for accuracy
    dragImg.style.height = img.getBoundingClientRect().height + "px";
    dragImg.style.pointerEvents = "none";
    dragImg.style.zIndex = "9999";

    // IMPORTANT: Reset margins and transforms to prevent cursor offset issues
    dragImg.style.margin = "0";
    dragImg.style.padding = "0";
    dragImg.style.transform = "none";
    dragImg.style.display = "block"; // Prevents inline spacing issues

    document.body.appendChild(dragImg);

    // 4. Calculate offset strictly based on the image's current screen position
    const rect = img.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // Move drag image to follow cursor immediately
    moveAt(e.clientX, e.clientY);

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", endDrag);
  }

  function moveAt(x, y) {
    if (!dragImg) return;
    // This keeps the image exactly under the cursor where you clicked
    dragImg.style.left = (x - offsetX) + "px";
    dragImg.style.top = (y - offsetY) + "px";
  }

  function onMove(e) {
    moveAt(e.clientX, e.clientY);
  }

  function endDrag(e) {
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerup", endDrag);

    // Remove drag image visually
    if (dragImg) {
      dragImg.remove();
      dragImg = null;
    }

    // Make the original visible again immediately.
    // If we drop successfully, it moves. If we fail, it stays/animates.
    if (activeCup) {
      activeCup.style.opacity = "1";
    }

    let droppedOnSlot = false;

    slots.forEach(slot => {
      const rect = slot.getBoundingClientRect();
      if (e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom) {
        droppedOnSlot = true;
        handleDrop(slot);
      }
    });

    // Note: If droppedOnSlot is false, the activeCup (which is now opacity: 1)
    // simply appears back at its original position because we never moved it in the DOM.
    // This satisfies "otherwise it should go back original position".

    if (!droppedOnSlot) {
      activeCup = null;
    }
  }

  function handleDrop(slot) {
    if (!activeCup) return;

    // STOP if slot already has a cup
    if (slot.children.length > 0) {
      activeCup = null; // Reset if slot is full
      return;
    }

    const cupValue = activeCup.dataset.value;
    const slotValue = slot.dataset.value;

    // Append cup to slot visually first
    slot.appendChild(activeCup);

    // Disable dragging while cup is in slot (temporarily)
    activeCup.style.pointerEvents = "none";
    activeCup.style.touchAction = "none";
    activeCup.removeEventListener("pointerdown", startDrag);

    if (cupValue === slotValue) {
      onCorrectDrop?.(activeCup, slot); // <- call first
      activeCup = null; // <- then null
      if (isGameCompleted(slots)) {
        onGameCompleted?.();
      }
    } else {
      // Logic for Wrong Drop
      onWrongDrop?.(activeCup);

      const cupRef = activeCup;
      activeCup = null; // Release reference so new drags can start if needed

      shakeCup(cupRef, () => {
        setTimeout(() => {
          animateBack(cupRef);
        }, 500);
      });
    }
  }

  function shakeCup(cup, onComplete) {
    if (!cup) return;

    cup.style.transition = "transform 0.08s ease";
    cup.style.transform = "translateX(-5px)";

    setTimeout(() => { cup.style.transform = "translateX(5px)"; }, 80);
    setTimeout(() => { cup.style.transform = "translateX(0)"; }, 160);
    setTimeout(() => {
      cup.style.transition = "";
      onComplete && onComplete();
    }, 200);
  }

  function animateBack(cup) {
    if (!cup || !cup._originalParent) return;

    const originalParent = cup._originalParent;
    const DURATION = 800; // Reduced duration slightly for snappier feel

    const firstRect = cup.getBoundingClientRect();
    originalParent.appendChild(cup); // Move back in DOM
    const lastRect = cup.getBoundingClientRect();

    const deltaX = firstRect.left - lastRect.left;
    const deltaY = firstRect.top - lastRect.top;

    cup.style.pointerEvents = "none";
    cup.style.transition = "none";
    cup.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    // Force reflow
    cup.getBoundingClientRect();

    requestAnimationFrame(() => {
      cup.style.transition = `transform ${DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`;
      cup.style.transform = "translate(0, 0)";
    });

    setTimeout(() => {
      cup.style.transition = "";
      cup.style.transform = "";
      cup.style.pointerEvents = "";
      cup.addEventListener("pointerdown", startDrag);
    }, DURATION);
  }
  function isGameCompleted(slots) {
    return [...slots].every(slot => {
      const cup = slot.querySelector(".cup");
      return cup && cup.dataset.value === slot.dataset.value;
    });
  }

}



function stayPage() {
  playClickThen();
  AudioController.play();
  $("#home-popup").hide();
}
function leavePage() {
  playClickThen();
  var audio = document.getElementById("simulationAudio");
  if (audio) {
    // Stop audio whether it's playing or paused
    audio.pause();
    audio.currentTime = 0;
  }

  jumtoPage(5);
}

function jumtoPage(pageNo) {
  playClickThen();

  _controller.pageCnt = pageNo;

  _controller.updateViewNow();
}


var activeAudio = null;

function playBtnSounds(soundFile) {
  if (!soundFile) {
    console.warn("Audio source missing!");
    return;
  }

  console.log("calling audios");

  const audio = document.getElementById("simulationAudio");

  // Stop previous audio if it exists
  if (activeAudio && !activeAudio.paused) {
    activeAudio.pause();
    // Do NOT reset src yet, let it finish
  }

  audio.loop = false;
  audio.src = soundFile;
  audio.load();

  activeAudio = audio;

  audio.play().catch((err) => {
    console.warn("Audio play error:", err);
  });
}



function resetSimulationAudio() {


  const audioElement = document.getElementById("simulationAudio");
  if (!audioElement) return;

  audioElement.pause();

  audioElement.src = "";
  audioElement.removeAttribute("src");

  const source = audioElement.querySelector("source");
  if (source) source.src = "";

  audioElement.load();
  audioElement.onended = null;
}





function audioEnd(callback) {
  const audio = document.getElementById("simulationAudio");
  audio.onended = null;
  audio.onended = () => {
    if (typeof callback === "function") callback();
  };
}


function toggleAudio(el) {
  playClickThen();
  // console.log(event, "current e")
  // const el = event.currentTarget; 
  const audio = document.getElementById("audio_src");

  // console.log(el, "Target class");

  if (audio.paused) {
    audio.muted = false;
    audio.play();
    el.classList.remove("mute");
    el.classList.add("playing");
    _controller._globalMusicPlaying = true;
  } else {
    audio.pause();
    el.classList.remove("playing");
    el.classList.add("mute");
    _controller._globalMusicPlaying = false;
  }
}

var AudioController = (() => {
  const audio = document.getElementById("simulationAudio");

  const hasAudio = () => audio && audio.src;

  return {
    play() {
      if (hasAudio()) audio.play();
    },
    pause() {
      if (hasAudio()) audio.pause();
    }
  };
})();






function restartActivity() {
  $(".popup").css("opacity", "0");
  setTimeout(function () {
    $(".popup").css("display", "none");
  }, 500);
  _globalCicked = 0;
  restartPage();
}

function showEndAnimations() {
  var $audio = $("#simulationAudio");
  closePopup('introPopup-1');
  console.log("Audio ending");
  pageVisited();

  $audio.on("timeupdate", function () {
    var currentTime = this.currentTime;
    $(".greetingsPop").css("visibility", "visible");
    $(".greetingsPop").css("opacity", "1");

    if (currentTime >= 1) {
      $(".confetti").addClass("show");
      // $(".confetti").show();
      setTimeout(function () {
        $(".greetingsPop").css("visibility", "hidden");
        $(".greetingsPop").css("opacity", "0");
        $(".popup").css("visibility", "visible");
        $(".popup").css("opacity", "1");
      }, 1500)
      setTimeout(function () {
        $(".confetti").removeClass("show");
        // $(".confetti").hide();                
      }, 2000);

      $audio.off("timeupdate");
    }

  });
}

function closeIntroPop(ldx) {
  playClickThen();
  AudioController.play();
  document.getElementById(ldx).style.display = 'none';
  let audio = document.getElementById("popupAudio");
  if (audio.src) {
    audio.pause();
    audio.currentTime = 0;
  }
}

function replayLastAudio() {
  playClickThen();
  console.log(_currentAudio, "Audio plaing");
  playBtnSounds(_currentAudio);
  disableButtons();
  audioEnd(function () {
    resetSimulationAudio();
    enableButtons();
  })
}


function enableButtons() {
  $(".flip-card").prop("disabled", false);
  $(".flipTextAudio").prop("disabled", false);
}

function disableButtons() {
  $(".flip-card").prop("disabled", true);
  $(".flipTextAudio").prop("disabled", true);
}

function resetToggle() {
  $(".flip-card").removeClass('flipped');
}

// -------- update CSS ------------
function setCSS(sectionCnt) {
  _wrapperWidth = $("#f_wrapper").outerWidth();
  _wrapperHeight = $("#f_wrapper").outerHeight();
  // ---- checking device width and height ----
  if (_wrapperWidth > 768) {
    for (var i = 0; i < _pageData.imgCollage.desktop.length; i++) {
      $("#section-1")
        .find(".bg-img")
        .eq(i)
        .css({
          "background-image":
            "url(" + _pageData.imgCollage.desktop[i].imageSRC + ")",
          "background-size": "cover",
        });
    }
  } else {
    for (var j = 0; j < _pageData.imgCollage.portrait.length; j++) {
      $("#section-1")
        .find(".bg-img")
        .eq(j)
        .css({
          "background-image":
            "url(" + _pageData.imgCollage.portrait[j].imageSRC + ")",
          "background-size": "cover",
        });
    }
  }
}

// -------- animations ------------
//function updateCurrentTime(_currTime) {
//    _tweenTimeline.seek(_currTime)
//}

/*
function removeTags(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();
    return str.replace(/(<([^>]+)>)/ig, '');
}*/
function removeTags(str) {
  //console.log('removeTags 0', str)
  if (str === null || str === "") {
    return false;
  } else {
    str = _controller.removeTags(str);
    return str;
  }
}
function initPageAnimations() {
  if (_tweenTimeline) {
    _tweenTimeline.kill();
  }
  _tweenTimeline = new TimelineLite();

  mainAnimation();
  if (_pageAudioSync && !_pageData.mainAudio.isEmptyAudio) {
    withAudioSync();
  } else {
    withoutAudioSync();
  }
}

function mainAnimation() {
  $(".f_page_content").animate(
    {
      opacity: 1,
    },
    300
  );
}

function withAudioSync() {
  _tweenTimeline.play();

  _tweenTimeline.add(animateFadeIn($("h1"), 0.5).play(), 0.5);

  _tweenTimeline.add(animateFadeIn($(".ost"), 0.5).play(), 0.1);
  _tweenTimeline.add(animateFadeOut($(".ost"), 0.5).play(), 4.5);
  _tweenTimeline.add(animateFadeOut($(".dummy-patch"), 0.5).play(), 4);
  // _tweenTimeline.add(animateFadeIn($(".inst"), 0.5).play(), 5);

  var box = [1, 2, 3];
  for (let k = 0; k < box.length; k++) {
    _tweenTimeline.add(animateFadeIn($(".cupContain").eq(k), 0.5, 0).play(), box[k]);
  }

  _tweenTimeline.add(
    animateFadeIn($(".animat-container"), 0.5, 0).play(),
    0.3
  );

  var rightListTiming = [0.3];
  // for (var k = 0; k < rightListTiming.length; k++) {
  //   _tweenTimeline.add(
  //     animateFadeIn(
  //       $(".animat-container").find(".flip-container").eq(k),
  //       0.5,
  //       0
  //     ).play(),
  //     rightListTiming[k]
  //   );
  // }
}

// function withoutAudioSync() {
//   _tweenTimeline.play();
//   _tweenTimeline.add(animateFadeIn($("h1"), 0.5).play(), 0.5);
//   _tweenTimeline.add(animateFadeIn($(".animat-container"), 0.5, 0).play(), 0.1);
//   let time = 1,
//     t = 0,
//     pTag = 0,
//     listTag = 0,
//     divTag = 0;
//   let time1 = time;
//   for (let j = 0; j < _pageData.sections[0].content.listText.length; j++) {
//     t = time1 + j * 0.5;
//     _tweenTimeline.add(
//       animateFromRight(
//         $(".animat-container").find(".list li").eq(listTag),
//         0.5,
//         0
//       ).play(),
//       t
//     );
//     listTag++;
//   }
// }
// -------- resize page details ------------
/*window.onresize = function() {
    //setCSS()
}*/
