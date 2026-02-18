// ---------- setting start ---------------
var _preloadData, _pageData;
var _pagePreloadArray = {
  image: 1,
  audio: -1,
  video: 1,
  data: -1,
}; // item not availble please assign value 1.
var jsonSRC = "pages/module_1/page_5/data/m1_p5_data.json?v=";
_pageAudioSync = true;
_forceNavigation = false;
_audioRequired = true;
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
var _isSimulationPaused = false;
var gameStarted = false;
var idleMonitoringEnabled = false;

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
  // console.log(_controller._globalMusicPlaying, "asldkfjasldkj")
  // if (_controller._globalMusicPlaying) {
  //   $(".music").addClass("playing")
  // } else {
  //   $(".music").addClass("mute")
  // }
  $(".playPause").show();
  appState.pageCount = _controller.pageCnt - 1;
  $('.introInfo').attr('data-popup', 'introPopup-10');
  $("#f_header").css({ backgroundImage: `url(${_pageData.sections[0].headerImg})` });
  $("#f_header").find("#f_courseTitle").css({ backgroundImage: `url(${_pageData.sections[0].headerText})` });
  $(".home_btn").css({ backgroundImage: `url(${_pageData.sections[0].backBtnSrc})` });
  $(".home_btn").attr("data-tooltip", "Back");
  // playBtnSounds(_pageData.sections[sectionCnt - 1].endAudio);
  //   showEndAnimations();
  // checkGlobalAudio();
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

      playBtnSounds(_pageData.sections[sectionCnt - 1].content.replayAudios[0], function () {

        // This runs when Audio 1 ends
        $('.inst p:first-child').hide();
        $('p:nth-child(2)').show();

        playBtnSounds(_pageData.sections[sectionCnt - 1].content.replayAudios[1], function () {
          // This runs when Audio 2 ends
          gameStarted = true;
          resetSimulationAudio();
          $(".wrapTextaudio").addClass("paused");
          window.enableCaterpillarControls();
          window.startCaterpillarIdle();
        });

      });
      let instText = '';
      for (let k = 0; k < _pageData.sections[sectionCnt - 1].iText.length; k++) {
        instText += `<p tabindex="0" id="inst_${k + 1}" 
aria-label="${removeTags(_pageData.sections[sectionCnt - 1].iText[k])}">
${_pageData.sections[sectionCnt - 1].iText[k]} 
<button class="wrapTextaudio playing" 
id="wrapTextaudio_${k}" 
onClick="replayLastAudio(this, '${_pageData.sections[sectionCnt - 1].content.replayAudios[k]}')">
</button>
</p>`;

      }
      $("#section-" + sectionCnt)
        .find(".content-holder")
        .find(".col-left")
        .find(".content")
        .find(".content-bg")
        .find(".content-style")
        .append(
          '<div class="inst">' + instText + '</div>'
        );

      const numberObjects =
        _pageData.sections[sectionCnt - 1].content.numberObjects;

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

      // ⭐ FIXED: Removed extra 'popupDiv +=' here
      popupDiv += `<div id="introPopup-10"><div class="popup-content">
      <button class="introPopAudio mute" onclick="togglePopAudio(this, '${_pageData.sections[sectionCnt - 1].infoAudio}')"></button>
      <button class="introPopclose" data-tooltip="Close" onClick="closeIntroPop('introPopup-10')"></button>
      <img src="${_pageData.sections[sectionCnt - 1].infoImg}" alt="">
      </div>
      </div>`;

      popupDiv += `<div id="home-popup" class="popup-home" role="dialog" aria-label="Exit confirmation" aria-hidden="false">
    <div class="popup-content modal-box">
      <h2 class="modal-title">Oops!</h2>
      <div class="modal-message">
        <p>If you leave the number pattern simulation then you have to start from beginning.</p>     
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
          '<div class="body"><div class="animations"></div><div class="animat-container"> <div class="dummy-patch"></div></div> </div>'
        );

      const mountEl = $("#section-" + sectionCnt)
        .find(".content-holder")
        .find(".col-left")
        .find(".content")
        .find(".content-bg")
        .find(".content-style")
        .find(".body")
        .find(".animat-container")[0];

      initSnakeGameAtMount(mountEl);

      $("#refresh").on("click", function () {
        jumtoPage(_controller.pageCnt);
        console.log("working");
        initCaterpillarGame();
      });

      $("#homeBack").on("click", function () {
        if (window.stopSnakeIdle) {
          window.stopSnakeIdle();
        }
        jumtoPage(2)

      });

      // $(".flipTextAudio").on("click", replayLastAudio);
    }
  }
  // var courseAudio = document.getElementById("courseAudio")
  // $(courseAudio).off("ended")
  // $(courseAudio).on("ended", function () {
  //   // resetSimulationAudio();
  //   // $(".wrapTextaudio").addClass("paused");
  //   // window.enableCaterpillarMovement();
  // })
}


function initSnakeGameAtMount(mountEl) {
  if (!mountEl || !mountEl.appendChild) {
    throw new Error("Invalid mount element");
  }

  const originalBody = document.body;

  try {
    Object.defineProperty(document, "body", {
      value: mountEl,
      configurable: true
    });

    // 🔽 this runs your existing game code
    initCaterpillarGame();

  } finally {
    Object.defineProperty(document, "body", {
      value: originalBody,
      configurable: true
    });
  }
}





function initCaterpillarGame() {
  /* =========================
     DOM CREATION
  ========================= */
  function createElement(tag, className, parent) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (parent) parent.appendChild(el);
    return el;
  }

  let numberSequence = [];
  const app = createElement("div", "game-container", document.body);
  const gameWrapper = createElement("div", "game-wrapper", app);
  const canvas = createElement("canvas", null, gameWrapper);
  const ctx = canvas.getContext("2d");

  // ✅ Enable high-quality rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.webkitImageSmoothingEnabled = true;
  ctx.mozImageSmoothingEnabled = true;
  ctx.msImageSmoothingEnabled = true;

  // Visual Configuration
  let headScale = 1;
  let eatingAnimation = null;

  // ✅ Wrong food animation state
  let wrongFoodAnimation = null;
  let wrongFoodData = null;

  // ✅ NEW: Food animation control
  let foodAnimationEnabled = true;

  /* =========================
     GAME CONFIG & STATE
  ========================= */
  let shouldDrawVictoryLine = false;
  
  // ✅ FIXED: Use constant grid size that never changes
  const FIXED_TILE_COUNT_X = 10;
  const FIXED_TILE_COUNT_Y = 10;
  
  let tileSize = 0;
  let particles = [];
  let dpr = 1;

  // Idle System
  let idleTimer = null;
  let isIdle = false;
  const IDLE_DURATION = 5000;
  let idleAudioInstance = null;
  let idleMonitoringEnabled = false;

  // Offsets
  let gridOffsetX = 0;
  let gridOffsetY = 0;

  const PATTERNS = [
    { start: 1, end: 10 },
    { start: 11, end: 20 }
  ];

  let currentPattern;
  let nextValue;
  let foods = [];

  // Snake Data
  let snake = [];
  let prevSnake = [];

  // State Flags
  let isGameActive = false;
  let isGameEnded = false;
  let foodsSpawned = false;
  let victoryTriggered = false;

  const MOVE_DURATION = 250;
  let moveStartTime = 0;
  let isMoving = false;
  let pendingMove = null;

  function idleStartTimer() {
    if (!idleMonitoringEnabled) return;
    if (!isGameActive || isGameEnded) return;

    if (idleTimer) clearTimeout(idleTimer);
    if (isIdle) {
      stopIdleSoundNow();
      isIdle = false;
    }

    idleTimer = setTimeout(triggerIdleState, IDLE_DURATION);
  }

  function idleStopTimer() {
    clearTimeout(idleTimer);
    idleTimer = null;
    stopIdleSoundNow();
    isIdle = false;
  }

  /* =========================
     CONTROLS DOM
  ========================= */
  const controls = createElement("div", "controls", app);

  function createButton(dir, parent = controls) {
    const btn = createElement("button", null, parent);
    btn.dataset.dir = dir;
    const img = document.createElement("img");
    img.src = `pages/module_1/page_5/images/${dir}.png`;
    img.style.height = "auto";
    btn.appendChild(img);
    return btn;
  }

  createButton("up");
  const mid = createElement("div", "middle", controls);
  createButton("left", mid);
  createButton("right", mid);
  createButton("down");

  /* =========================
     AUDIO HANDLERS
  ========================= */
  function playIdleSoundNow() {
    if (!isIdle || !isGameActive || isGameEnded) return;

    if (idleAudioInstance) {
      idleAudioInstance.pause();
      idleAudioInstance.currentTime = 0;
      idleAudioInstance = null;
    }

    const audioPath = _pageData.sections[sectionCnt - 1].idleAudio;
    idleAudioInstance = new Audio(audioPath);

    idleAudioInstance.onended = () => {
      setTimeout(() => {
        if (isIdle && idleMonitoringEnabled && !isGameEnded) {
          playIdleSoundNow();
        }
      }, 5000);
    };

    idleAudioInstance.play().catch(e => console.log("Idle audio error:", e));
  }

  function stopIdleSoundNow() {
    if (idleAudioInstance) {
      idleAudioInstance.pause();
      idleAudioInstance.currentTime = 0;
      idleAudioInstance = null;
    }
  }

  /* =========================
     PARTICLES
  ========================= */
  function createParticles(x, y, color) {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const speed = Math.random() * 5 + 2;
      particles.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0, color: color
      });
    }
  }

  function drawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
      if (p.life <= 0) {
        particles.splice(i, 1);
      } else {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, tileSize * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }
  }

  /* =========================
     CANVAS HELPERS
  ========================= */
  function resizeCanvas() {
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const rect = gameWrapper.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) {
      requestAnimationFrame(resizeCanvas);
      return;
    }

    dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const logicalWidth = rect.width;
    const logicalHeight = rect.height;

    // ✅ FIXED: Calculate tile size to fit the fixed grid exactly
    const gridWidth = FIXED_TILE_COUNT_X;
    const gridHeight = FIXED_TILE_COUNT_Y;
    
    // Add padding around the grid
    const paddingRatio = 0.85; // Grid takes 85% of available space
    const availableWidth = logicalWidth * paddingRatio;
    const availableHeight = logicalHeight * paddingRatio;
    
    // Calculate tile size to fit the grid
    tileSize = Math.min(
      availableWidth / gridWidth,
      availableHeight / gridHeight
    );

    // ✅ Calculate offsets to center the fixed-size grid
    const totalGridWidth = gridWidth * tileSize;
    const totalGridHeight = gridHeight * tileSize;
    
    gridOffsetX = (logicalWidth - totalGridWidth) / 2;
    gridOffsetY = (logicalHeight - totalGridHeight) / 2;

    if (snake.length > 0) {
      render();
    }
  }

  function clearCanvas() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  function drawGrid() {
    ctx.save();
    const radius = 3;
    const color = "#b0b0b0";
    ctx.fillStyle = color;
    
    // ✅ FIXED: Draw grid using fixed dimensions
    for (let y = 0; y <= FIXED_TILE_COUNT_Y; y++) {
      for (let x = 0; x <= FIXED_TILE_COUNT_X; x++) {
        const px = gridOffsetX + (x * tileSize);
        const py = gridOffsetY + (y * tileSize);
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawText(text, x, y, scale = 1) {
    ctx.save();
    const fontSize = tileSize * 0.5 * scale;
    ctx.font = `bold ${fontSize}px Times New Roman`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = Math.max(6, fontSize * 0.2);
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;
    ctx.strokeText(text, x, y);

    ctx.fillStyle = "#000000";
    ctx.fillText(text, x, y);

    ctx.restore();
  }

  /* =========================
     ASSETS & RENDERING
  ========================= */
  const headImg = new Image();
  headImg.src = "pages/module_1/page_5/images/head.png";
  const bodyImg = new Image();
  bodyImg.src = "pages/module_1/page_5/images/body.png";

  function lerp(start, end, t) {
    return start + (end - start) * t;
  }

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function drawSnake() {
    let t = 1;
    if (isMoving && !isGameEnded) {
      const elapsed = performance.now() - moveStartTime;
      let rawT = Math.min(1, elapsed / MOVE_DURATION);
      t = easeInOutCubic(rawT);
    }

    const baseBodySize = tileSize * 1.0;

    for (let i = snake.length - 1; i >= 0; i--) {
      const curr = snake[i];
      const prev = (prevSnake[i]) ? prevSnake[i] : curr;

      const animX = lerp(prev.x, curr.x, t);
      const animY = lerp(prev.y, curr.y, t);

      let x = gridOffsetX + (animX * tileSize);
      let y = gridOffsetY + (animY * tileSize);
      const cx = x + tileSize / 2;
      const cy = y + tileSize / 2;

      if (i === 0) {
        ctx.save();
        ctx.translate(cx, cy);

        let offsetX = 0;
        let offsetY = 0;
        let lookDirX = 1;

        if (snake.length > 1) {
          const next = snake[1];
          const dx = curr.x - next.x;
          const dy = curr.y - next.y;

          const overlapAmount = tileSize * 0.15;
          offsetX = -dx * overlapAmount;
          offsetY = -dy * overlapAmount;

          if (dx < 0) lookDirX = -1;
        }

        if (lookDirX === -1) ctx.scale(-1, 1);

        let currentScale = headScale;
        if (isIdle && !eatingAnimation && !isMoving) {
          currentScale = Math.sin(Date.now() / 300) * 0.1 + 1.1;
        }

        const scaledHeadSize = tileSize * 1.25 * currentScale;
        const verticalAdjust = -tileSize * 0.15;
        ctx.drawImage(headImg, (-scaledHeadSize / 2) + offsetX * (lookDirX === -1 ? -1 : 1), (-scaledHeadSize / 2) + offsetY + verticalAdjust, scaledHeadSize, scaledHeadSize);
        ctx.restore();
      } else {
        const currentSegmentScale = 1;
        const drawnSize = baseBodySize * currentSegmentScale;
        ctx.drawImage(bodyImg, cx - drawnSize / 2, cy - drawnSize / 2, drawnSize, drawnSize);

        if (numberSequence[i - 1] != null) {
          drawText(numberSequence[i - 1], cx, cy, currentSegmentScale);
        }
      }
    }
  }

  function drawFood() {
    if (isGameEnded) return;

    const polygon = getPolygonPoints();
    const now = Date.now();

    // ✅ FIXED: Filter based on fixed grid dimensions
    foods = foods.filter(f => {
      if (f.eaten) return false;
      if (f.x >= FIXED_TILE_COUNT_X || f.y >= FIXED_TILE_COUNT_Y) return false;
      if (!canMoveToTile(f.x, f.y)) return false;
      return true;
    });

    foods.forEach(f => {
      if (f.eaten) return;

      const cx = gridOffsetX + f.x * tileSize + tileSize / 2;
      const cy = gridOffsetY + f.y * tileSize + tileSize / 2;

      if (!isPointInPolygon(cx, cy, polygon)) return;

      const age = now - f.spawnTime;
      let scale = 1;

      if (foodAnimationEnabled) {
        if (age < 400) {
          const t = age / 400;
          scale = Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1 + 1;
          if (scale > 1) scale = 1;
          if (age < 50) scale = 0;
        } else {
          scale = 1 + 0.05 * Math.sin(now / 300);
        }
      }

      const radius = tileSize * 0.45 * scale;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(0, radius), 0, Math.PI * 2);
      ctx.fillStyle = "#ffd17c";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#c08737";
      ctx.stroke();

      if (scale > 0.5) {
        ctx.fillStyle = "#000";
        ctx.font = `bold ${tileSize * 0.45 * scale}px "Times New Roman"`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(f.value, cx, cy);
      }
    });

    if (wrongFoodData && wrongFoodAnimation) {
      const now = performance.now();
      const elapsed = now - wrongFoodAnimation.startTime;
      const progress = Math.min(elapsed / wrongFoodAnimation.duration, 1);

      let offsetX = 0;
      let offsetY = 0;
      let alpha = 1;

      if (progress < 0.3) {
        const shakeProgress = progress / 0.3;
        const shakeIntensity = tileSize * 0.15 * (1 - shakeProgress);
        offsetX = Math.sin(shakeProgress * Math.PI * 8) * shakeIntensity;
        offsetY = Math.cos(shakeProgress * Math.PI * 8) * shakeIntensity * 0.5;
      } else {
        const moveProgress = (progress - 0.3) / 0.7;
        const easeOut = 1 - Math.pow(1 - moveProgress, 3);

        offsetX = wrongFoodAnimation.dirX * tileSize * 3 * easeOut;
        offsetY = wrongFoodAnimation.dirY * tileSize * 3 * easeOut;
        alpha = 1 - moveProgress;
      }

      const cx = gridOffsetX + wrongFoodData.x * tileSize + tileSize / 2 + offsetX;
      const cy = gridOffsetY + wrongFoodData.y * tileSize + tileSize / 2 + offsetY;

      ctx.save();
      ctx.globalAlpha = alpha;

      const radius = tileSize * 0.45;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(0, radius), 0, Math.PI * 2);
      ctx.fillStyle = "#ffd17c";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#c08737";
      ctx.stroke();

      ctx.fillStyle = "#000";
      ctx.font = `bold ${tileSize * 0.45}px Times New Roman`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(wrongFoodData.value, cx, cy);

      ctx.restore();

      if (progress >= 1) {
        wrongFoodAnimation = null;
        wrongFoodData = null;
      } else {
        requestAnimationFrame(render);
      }
    }
  }

  /* =========================
     MAIN RENDER LOOP
  ========================= */
  function gameLoop() {
    render();

    if (isMoving && performance.now() - moveStartTime >= MOVE_DURATION) {
      isMoving = false;

      if (pendingMove) {
        const move = pendingMove;
        pendingMove = null;
        executeMove(move);
      }
    }

    requestAnimationFrame(gameLoop);
  }

  function executeMove(dir) {
    if (!isGameActive || isGameEnded || isMoving) return;

    const head = snake[0];
    const newX = head.x + dir.x;
    const newY = head.y + dir.y;

    // ✅ FIXED: Use fixed grid dimensions
    if (!canMoveToTile(newX, newY)) return;
    if (newX < 0 || newX >= FIXED_TILE_COUNT_X || newY < 0 || newY >= FIXED_TILE_COUNT_Y) return;

    const newHead = { x: newX, y: newY };

    if (snake.some((s, index) => index !== 0 && s.x === newHead.x && s.y === newHead.y)) return;

    const hitFood = foods.find(f => f.x === newHead.x && f.y === newHead.y);

    prevSnake = snake.map(s => ({ ...s }));
    snake.unshift(newHead);
    isMoving = true;
    moveStartTime = performance.now();

    if (hitFood && hitFood.correct) {
      hitFood.eaten = true;
      foods = [];
      foodsSpawned = false;

      const cx = gridOffsetX + hitFood.x * tileSize + tileSize / 2;
      const cy = gridOffsetY + hitFood.y * tileSize + tileSize / 2;
      createParticles(cx, cy, "#FFD700");
      animateEating();

      numberSequence.push(nextValue);
      nextValue++;

      isGameActive = false;
      idleStopTimer();

      $(".wrapTextaudio").prop("disabled", true);
      playBtnSounds(_pageData.sections[sectionCnt - 1].correctAudio);
      $(".wrapTextaudio").each(function () {
        if ($(this).hasClass("playing")) {
          $(this).removeClass("playing").addClass("paused");
        }
      });
      updateText(_pageData.sections[sectionCnt - 1].content.correctFeedback.text, _pageData.sections[sectionCnt - 1].content.correctFeedback.audioSrc);

      if (nextValue > currentPattern.end) {
        if (victoryTriggered) return;
        victoryTriggered = true;

        isGameActive = false;
        isGameEnded = true;

        let finalSequenceCompleted = false;

        $(".wrapTextaudio").prop("disabled", true);
        audioEnd(function () {
          shouldDrawVictoryLine = true;

          $(".animations").addClass("show");

          setTimeout(function () {
            $(".animations").removeClass("show");
            $(".greetingsPop").css({ visibility: "visible", opacity: "1" });
          }, 2500);

          playBtnSounds(_pageData.sections[sectionCnt - 1].greatJobAudio);

          audioEnd(function () {
            if (finalSequenceCompleted) return;
            finalSequenceCompleted = true;

            if (typeof showEndAnimations === 'function') {
              showEndAnimations();
            }
          });
        });
        return;
      }

      audioEnd(function () {
        if (!isGameEnded && !foodsSpawned) {
          foodsSpawned = true;
          spawnFoods();
          isGameActive = true;
          $(".wrapTextaudio").prop("disabled", false);
          idleStartTimer();
        }
      });

    } else if (hitFood && !hitFood.correct) {
      snake.shift();
      snake = prevSnake;
      isMoving = false;
      idleStopTimer();

      wrongFoodData = { ...hitFood };

      const foodDx = hitFood.x - head.x;
      const foodDy = hitFood.y - head.y;
      const magnitude = Math.sqrt(foodDx * foodDx + foodDy * foodDy) || 1;

      wrongFoodAnimation = {
        startTime: performance.now(),
        duration: 800,
        dirX: foodDx / magnitude,
        dirY: foodDy / magnitude
      };

      foods = foods.filter(f => f !== hitFood);

      $(".wrapTextaudio").prop("disabled", true);
      $(".wrapTextaudio").each(function () {
        if ($(this).hasClass("playing")) {
          $(this).removeClass("playing").addClass("paused");
        }
      });
      playBtnSounds(_pageData.sections[sectionCnt - 1].wrongAudio);
      updateText(_pageData.sections[sectionCnt - 1].content.wrongFeedback.text, _pageData.sections[sectionCnt - 1].content.wrongFeedback.audioSrc);
      isGameActive = false;

      requestAnimationFrame(render);

      audioEnd(function () {
        inCorrectFood();
        $(".wrapTextaudio").prop("disabled", false);
        isGameActive = true;
        idleStartTimer();
      });
      return;
    } else {
      snake.pop();
    }
  }

  function render() {
    clearCanvas();

    const rect = gameWrapper.getBoundingClientRect();
    const polygon = getPolygonPoints(rect.width, rect.height);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(polygon[0][0], polygon[0][1]);
    for (let i = 1; i < polygon.length; i++) ctx.lineTo(polygon[i][0], polygon[i][1]);
    ctx.closePath();
    ctx.clip();

    drawGrid();
    drawFood();
    drawParticles();

    if (isGameEnded && shouldDrawVictoryLine) {
      drawEndGameVictoryLine();
    } else {
      drawSnake();
    }

    ctx.restore();
  }

  /* =========================
     END GAME: DRAW FULL PATTERN
  ========================= */
  function drawEndGameVictoryLine() {
    $(".inst").text('');
    $(".inst").append(`<p>${_pageData.sections[sectionCnt - 1].finalText} <button class="wrapTextaudio playing" id="wrapTextaudio_2" onClick="replayLastAudio(this)"></button></p>`)
    const rect = gameWrapper.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const startNum = currentPattern.start;
    const endNum = currentPattern.end;

    const displayNumbers = [];
    for (let i = endNum; i >= startNum; i--) {
      displayNumbers.push(i);
    }

    const totalItems = displayNumbers.length + 1;
    const totalWidth = totalItems * tileSize;
    const startX = cx - (totalWidth / 2) + (tileSize / 2);

    for (let i = 0; i < totalItems; i++) {
      const px = startX + (i * tileSize);
      const py = cy;

      const isHead = (i === totalItems - 1);

      if (isHead) {
        const size = tileSize * 1.5;
        ctx.drawImage(headImg, px - size / 2, py - size / 2, size, size);
      } else {
        const size = tileSize * 1.1;
        ctx.drawImage(bodyImg, px - size / 2, py - size / 2, size, size);
        drawText(displayNumbers[i], px, py);
      }
    }
  }

  /* =========================
     POLYGON LOGIC
  ========================= */
  const clipPolygon = [
    [0, 15], [0, 0], [15, 0], [85, 0], [100, 0], [100, 15],
    [100, 65], [82, 65], [82, 100], [15, 100], [0, 100], [0, 85]
  ];

  function getPolygonPoints() {
    const rect = gameWrapper.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    return clipPolygon.map(([px, py]) => [px / 100 * w, py / 100 * h]);
  }

  function isPointInPolygon(x, y, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];
      const intersect = ((yi > y) !== (yj > y)) &&
        (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 0.00001) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function canMoveToTile(tileX, tileY) {
    const polygon = getPolygonPoints();
    const corners = [
      { cx: gridOffsetX + tileX * tileSize, cy: gridOffsetY + tileY * tileSize },
      { cx: gridOffsetX + (tileX + 1) * tileSize, cy: gridOffsetY + tileY * tileSize },
      { cx: gridOffsetX + tileX * tileSize, cy: gridOffsetY + (tileY + 1) * tileSize },
      { cx: gridOffsetX + (tileX + 1) * tileSize, cy: gridOffsetY + (tileY + 1) * tileSize }
    ];
    return corners.every(c => isPointInPolygon(c.cx, c.cy, polygon));
  }

  /* =========================
     GAME MOVEMENT & LOGIC
  ========================= */
  function randomEmptyCell() {
    let pos, attempts = 0;
    do {
      pos = {
        x: Math.floor(Math.random() * FIXED_TILE_COUNT_X),
        y: Math.floor(Math.random() * FIXED_TILE_COUNT_Y)
      };
      attempts++;
    } while (
      attempts < 100 &&
      (!canMoveToTile(pos.x, pos.y) ||
        snake.some(s => s.x === pos.x && s.y === pos.y) ||
        foods.some(f => f.x === pos.x && f.y === pos.y))
    );
    return pos;
  }

  function spawnFoods() {
    if (isGameEnded && foods.length > 0) {
      console.log("Spawn blocked - game ended");
      return;
    }

    function getAllValidCells() {
      const validCells = [];

      // ✅ FIXED: Use fixed grid dimensions
      for (let x = 0; x < FIXED_TILE_COUNT_X; x++) {
        for (let y = 0; y < FIXED_TILE_COUNT_Y; y++) {
          if (!canMoveToTile(x, y)) continue;
          if (snake.some(s => s.x === x && s.y === y)) continue;
          if (foods.some(f => f.x === x && f.y === y)) continue;

          validCells.push({ x, y });
        }
      }

      return validCells;
    }

    function getRandomPosition(excludePositions = []) {
      const validCells = getAllValidCells();

      const availableCells = validCells.filter(cell => {
        return !excludePositions.some(ex => ex.x === cell.x && ex.y === cell.y);
      });

      if (availableCells.length === 0) {
        console.warn("No available cells for food spawn");
        return randomEmptyCell();
      }

      const randomIndex = Math.floor(Math.random() * availableCells.length);
      return availableCells[randomIndex];
    }

    const correctPos = getRandomPosition();
    const wrongPos = getRandomPosition([correctPos]);

    let wrongValue;
    const possibleValues = [];
    for (let i = currentPattern.start; i <= currentPattern.end; i++) {
      possibleValues.push(i);
    }
    const validWrongOptions = possibleValues.filter(val =>
      val !== nextValue && !numberSequence.includes(val)
    );

    if (validWrongOptions.length > 0) {
      wrongValue = validWrongOptions[Math.floor(Math.random() * validWrongOptions.length)];
    } else {
      wrongValue = nextValue + 1 + Math.floor(Math.random() * 3);
    }

    const now = Date.now();
    foods = [
      { ...correctPos, value: nextValue, correct: true, spawnTime: now },
      { ...wrongPos, value: wrongValue, correct: false, spawnTime: now }
    ];

    console.log(`Foods spawned - Correct: (${correctPos.x}, ${correctPos.y}), Wrong: (${wrongPos.x}, ${wrongPos.y})`);
  }

  function startGame() {
    currentPattern = getNextPattern();
    snake = initSnake(currentPattern);
    nextValue = currentPattern.start + snake.length - 1;
    foods = [];

    isGameActive = false;
    isGameEnded = false;
    isMoving = false;
    pendingMove = null;
    foodsSpawned = false;
    victoryTriggered = false;
    shouldDrawVictoryLine = false;

    resizeCanvas();
    spawnFoods();
    foodsSpawned = true;
    requestAnimationFrame(gameLoop);
  }

  function inCorrectFood() {
    $(".wrapTextaudio").prop("disabled", false);
    if (isGameEnded) return;
    spawnFoods();
    render();
  }

  function animateEating() {
    if (eatingAnimation) cancelAnimationFrame(eatingAnimation);
    const duration = 200;
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      if (elapsed < duration) {
        headScale = 1 + 0.3 * Math.sin((elapsed / duration) * Math.PI);
        eatingAnimation = requestAnimationFrame(step);
      } else {
        headScale = 1;
        eatingAnimation = null;
      }
    }
    requestAnimationFrame(step);
  }

  /* =========================
     INIT & INPUTS
  ========================= */
  function initSnake(pattern) {
    numberSequence = [];
    const body = [
      { x: 6, y: 5 },
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
      { x: 2, y: 5 }
    ];
    prevSnake = body.map(b => ({ ...b }));
    for (let i = 1; i < body.length; i++) {
      numberSequence.push(pattern.start + i - 1);
    }
    return body;
  }

  function getNextPattern() {
    let p;
    do {
      p = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
    } while (p === currentPattern);
    return p;
  }

  function setDirection(dirKey) {
    idleStartTimer();

    if (!isGameActive || isGameEnded) return;

    let dirVec = { x: 0, y: 0 };
    if (dirKey === "up") dirVec = { x: 0, y: -1 };
    if (dirKey === "down") dirVec = { x: 0, y: 1 };
    if (dirKey === "left") dirVec = { x: -1, y: 0 };
    if (dirKey === "right") dirVec = { x: 1, y: 0 };

    if (snake.length > 1) {
      const head = snake[0];
      const neck = snake[1];
      if (head.x + dirVec.x === neck.x && head.y + dirVec.y === neck.y) return;
    }

    if (isMoving) {
      pendingMove = dirVec;
    } else {
      executeMove(dirVec);
    }
  }

  window.enableCaterpillarMovement = function () {
    console.log("Caterpillar inputs unlocked");
    isGameActive = true;
  };

  document.addEventListener("keydown", e => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
      e.preventDefault();
    }
    if (e.key === "ArrowUp") setDirection("up");
    if (e.key === "ArrowDown") setDirection("down");
    if (e.key === "ArrowLeft") setDirection("left");
    if (e.key === "ArrowRight") setDirection("right");
  });

  document.querySelectorAll(".controls button").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      setDirection(btn.dataset.dir)
    });
  });

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("orientationchange", resizeCanvas);

  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.addEventListener("mozfullscreenchange", handleFullscreenChange);
  document.addEventListener("MSFullscreenChange", handleFullscreenChange);

  document.addEventListener("mousemove", idleStartTimer);
  document.addEventListener("mousedown", idleStartTimer);
  document.addEventListener("mouseup", idleStartTimer);
  document.addEventListener("click", idleStartTimer);
  document.addEventListener("touchstart", idleStartTimer);
  document.addEventListener("touchmove", idleStartTimer);
  document.addEventListener("touchend", idleStartTimer);
  document.addEventListener("keydown", idleStartTimer);
  document.addEventListener("scroll", idleStartTimer);

  // ✅ FIXED: Simplified fullscreen handler - only resize, don't respawn
  function handleFullscreenChange() {
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
    console.log(`Fullscreen ${isFullscreen ? 'ENTERED' : 'EXITED'}`);

    setTimeout(() => {
      resizeCanvas(); // Only resize - positions stay the same
      render(); // Re-render with new tile size
    }, 100);
  }

  window.handleCaterpillarFullscreenChange = handleFullscreenChange;

  /* =========================
     IDLE LOGIC
  ========================= */
  function resetIdleTimer() {
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
    stopIdleSoundNow();
    if (isIdle) isIdle = false;
    if (isGameActive && !isGameEnded) {
      idleTimer = setTimeout(triggerIdleState, IDLE_DURATION);
    }
  }

  function triggerIdleState() {
    if (!isGameActive || isGameEnded) return;
    if (isIdle) return;

    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }

    isIdle = true;
    playIdleSoundNow();
  }

  let imagesLoaded = 0;
  headImg.onload = bodyImg.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 2) startGame();
  };

  /* =========================
     EXTERNAL CONTROL API
  ========================= */
  window.enableCaterpillarControls = function () {
    console.log("Caterpillar enabled");
    isGameActive = true;
    isGameEnded = false;
    idleStartTimer();
  };

  window.disableCaterpillarControls = function () {
    console.log("Caterpillar disabled");
    isGameActive = false;
    idleStopTimer();
  };

  window.startFoodAnimation = function () {
    foodAnimationEnabled = true;
    console.log("Food animation started");
  };

  window.stopFoodAnimation = function () {
    foodAnimationEnabled = false;
    console.log("Food animation stopped");
  };

  window.startCaterpillarIdle = function () {
    console.log("Idle monitoring enabled");
    idleMonitoringEnabled = true;

    if (isGameActive && !isGameEnded) {
      idleTimer = setTimeout(triggerIdleState, IDLE_DURATION);
    }
  };

  window.cleanupCaterpillarGame = function () {
    idleMonitoringEnabled = false;
    idleStopTimer();
  };
}


// Simulation play and pause



function enableAll() {
  playClickThen();
  if (gameStarted) {
    window.enableCaterpillarControls();
    window.startCaterpillarIdle();
  }
  window.startFoodAnimation()
  $(".home_btn, .music,.introInfo,#full-screen, .wrapTextaudio").prop("disabled", false);
  const audio = document.getElementById("audio_src");
  if (_controller._globalMusicPlaying) {
    audio.muted = false;
    audio.play();
  }

  $(".dummy-patch").show();

}



function disableAll() {
  playClickThen();
  window.disableCaterpillarControls();
  window.disableCaterpillarControls();
  window.cleanupCaterpillarGame();
  window.stopFoodAnimation()
  $(".home_btn, .music,.introInfo,#full-screen,.wrapTextaudio").prop("disabled", true);
  const audio = document.getElementById("audio_src");
  if (_controller._globalMusicPlaying) {
    audio.pause();
  }
  $(".dummy-patch").hide();
}


function updateText(txt, audio) {


  $("#simulationAudio").on("ended", function () {
    $(".wrapTextaudio")
      .removeClass("playing")
      .addClass("paused");
    // console.log("audio ended");
  });



  let text = `
    <p tabindex="0" aria-label="${removeTags(txt)}">
      ${txt}
      <button 
        class="wrapTextaudio paused"
        onclick="replayLastAudio(this, '${audio}')">
      </button>
    </p>
  `;


  $(".inst").html(text);
  $(".wrapTextaudio")
    .removeClass("paused")
    .addClass("playing");
}




function playFeedbackAudio(_audio) {
  $(".dummy-patch").show();
  playBtnSounds(_audio)
  audioEnd(function () {
    $(".dummy-patch").hide();
  })
}




function stayPage() {
  playClickThen();
  // AudioController.play();

  // Resume simulation audio if it was playing before popup
  if (typeof resumeSimulationAudio === 'function') {
    resumeSimulationAudio();
  }

  $("#home-popup").hide();
}

function leavePage() {
  playClickThen();

  if (window.stopSnakeIdle) {
    window.stopSnakeIdle();
  }

  $(".playPause").hide();

  var audio = document.getElementById("simulationAudio");
  if (audio) {
    // Stop audio whether it's playing or paused
    audio.pause();
    audio.currentTime = 0;
  }

  // Clear the manual pause flag since we're leaving
  if (typeof isManuallyPaused !== 'undefined') {
    isManuallyPaused = false;
  }
  if (typeof simulationWasPlaying !== 'undefined') {
    simulationWasPlaying = false;
  }

  jumtoPage(2);
}

function jumtoPage(pageNo) {
  playClickThen();

  _controller.pageCnt = pageNo;
  console.log(pageNo, "pageNumber");

  _controller.updateViewNow();
}



function playPauseSimulation(btn) {
  playClickThen();
  var audio = document.getElementById("simulationAudio");

  // Check if audio is loaded and has actual source
  var hasAudio = audio.firstChild && audio.firstChild.src;

  _isSimulationPaused = !_isSimulationPaused;

  if (_isSimulationPaused) {
    // Pause state
    if (hasAudio && !audio.paused && !audio.ended) {
      audio.pause();
    }
    disableAll();
    btn.classList.remove("play");
    btn.classList.add("pause");
    btn.dataset.tooltip = "Play";
  } else {
    // Play state
    if (hasAudio && audio.paused && !audio.ended) {
      audio.play().catch(() => { });
    }
    enableAll();
    btn.classList.remove("pause");
    btn.classList.add("play");
    btn.dataset.tooltip = "Pause";
  }
}

var activeAudio = null;

function playBtnSounds(soundFile, callback) {
  const audio = document.getElementById("simulationAudio");
  audio.muted = false;

  if (!soundFile) {
    console.warn("Audio source missing!");
    if (callback) callback();
    return;
  }

  // Clear previous onended
  audio.onended = null;

  // Stop previous audio
  if (activeAudio && !activeAudio.paused) {
    activeAudio.pause();
  }

  audio.loop = false;

  // Remove old <source> if exists
  while (audio.firstChild) {
    audio.removeChild(audio.firstChild);
  }

  // Create new <source> element
  const source = document.createElement("source");
  source.src = soundFile;
  source.type = "audio/mpeg";
  audio.appendChild(source);
  audio.load();

  activeAudio = audio;

  // When audio ends
  audio.onended = () => {
    audio.onended = null;
    // Remove source after finish
    while (audio.firstChild) {
      audio.removeChild(audio.firstChild);
    }
    audio.load(); // reset player
    if (typeof callback === "function") {
      callback();
    }
  };

  console.log("Playing:", soundFile);
  audio.play().catch((err) => {
    console.warn("Audio play error:", err);
  });
}


function resetSimulationAudio() {
  console.log("Balajia");

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



// function showEndAnimations() {
//   var $audio = $("#simulationAudio");

//   // Remove any existing timeupdate listeners
//   $audio.off("timeupdate");

//   playBtnSounds(_pageData.sections[sectionCnt - 1].finalAudio);

//   closePopup('introPopup-1');
//   // console.log("Audio ending");
//   pageVisited();

//   $(".popup").css({
//     visibility: "visible",
//     opacity: "1",
//     display: "flex"
//   });

//   const showEndAnimationsHandler = function () {
//     const audioEl = $audio[0];



//     // ✅ Only trigger after 2 seconds
//     if (audioEl.currentTime > 2) {

//       $(".confetti").addClass("show");

//       setTimeout(function () {
//         $(".confetti").removeClass("show");
//       }, 2000);

//       // ✅ Run only once
//       $audio.off("timeupdate", showEndAnimationsHandler);
//     }
//   };

//   $audio.on("timeupdate", showEndAnimationsHandler);
// }


var isEndAnimationTriggered = false;

function showEndAnimations() {

  if (window.stopSnakeIdle) {
    window.stopSnakeIdle();
  }

  if (isEndAnimationTriggered) return;
  isEndAnimationTriggered = true;

  // console.log("showEndAnimations initiated");

  // Cleanup previous states
  closePopup('introPopup-1');
  pageVisited();
  $(".confetti").addClass("show");

  const finalAudioSource = _pageData.sections[sectionCnt - 1].finalAudio;
  const $audio = $("#simulationAudio");

  // Remove previous timeupdate listeners to prevent stacking
  $audio.off("timeupdate");

  if (finalAudioSource) {
    // Play the final audio
    playBtnSounds(finalAudioSource);

    // Logic: Show popup 2 seconds INTO the final audio
    $audio.on("timeupdate", function () {
      // Using 'this' refers to the audio DOM element
      if (this.currentTime > 2) {
        // Trigger Visuals
        $(".greetingsPop").css({ visibility: "hidden", opacity: "0" });
        $(".popup").css({ visibility: "visible", opacity: "1", display: "flex" });
        $(".confetti").removeClass("show");

        // IMPORTANT: Remove listener so this block runs only once
        $(this).off("timeupdate");
      }
    });
  } else {
    // Fallback if no audio exists
    $(".popup").css({ visibility: "visible", opacity: "1", display: "flex" });
  }
}

// function closeIntroPop(ldx) {
//   playClickThen();
//   // AudioController.play();
//   document.getElementById(ldx).style.display = 'none';
//   let audio = document.getElementById("popupAudio");
//   if (audio.src) {
//     audio.pause();
//     audio.currentTime = 0;
//   }
// }


function replayLastAudio(btnElement, audioSrc) {
  playClickThen();

  if (typeof idleStopTimer === 'function') {
    idleStopTimer();
  }
  const courseAudio = document.getElementById("courseAudio");
  const simulationAudio = document.getElementById("simulationAudio");

  let activeAudio = null;

  if (courseAudio && !courseAudio.paused && !courseAudio.ended) {
    activeAudio = courseAudio;
  } else if (simulationAudio && !simulationAudio.paused && !simulationAudio.ended) {
    activeAudio = simulationAudio;
  }

  // If something playing → toggle mute
  if (activeAudio) {
    activeAudio.muted = !activeAudio.muted;
    updateButtonUI(btnElement, !activeAudio.muted);
    return;
  }

  // Nothing playing → play passed audio
  if (audioSrc) {
    playBtnSounds(audioSrc);
    audioEnd(function () {
      // ✅ Restart idle timer after replay ends
      if (typeof idleStartTimer === 'function') {
        idleStartTimer();
      }
    });
    resetAllButtons();
    updateButtonUI(btnElement, true);

    if (simulationAudio) {
      simulationAudio.onended = function () {
        updateButtonUI(btnElement, false);
      };
    }
  }
}


function stopAllAudios() {
  const courseAudio = document.getElementById("courseAudio");
  const simulationAudio = document.getElementById("simulationAudio");

  [courseAudio, simulationAudio].forEach(audio => {
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false; // unmute when new audio plays
    }
  });

  // Reset wrapText button UI
  resetAllButtons();
}



function updateButtonUI(btn, isPlaying) {
  if (isPlaying) {
    btn.classList.remove("paused");
    btn.classList.add("playing");
  } else {
    btn.classList.remove("playing");
    btn.classList.add("paused");
  }
}

function resetAllButtons() {
  document.querySelectorAll(".wrapTextaudio").forEach(btn => {
    btn.classList.remove("playing");
    btn.classList.add("paused");
  });
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

  _tweenTimeline.add(animateFadeIn($(".inst").find("#inst_1"), 0.5).play(), 0.1);
  // _tweenTimeline.add(animateFadeOut($(".inst").find("#inst_1"), 0.5).play(), 4);
  // _tweenTimeline.add(animateFadeIn($(".inst").find("#inst_2"), 0.5).play(), 4.2);
  _tweenTimeline.add(animateFadeOut($(".ost"), 0.5).play(), 4.5);
  _tweenTimeline.add(animateFadeOut($(".dummy-patch"), 0.5).play(), 7);
  // _tweenTimeline.add(animateFadeIn($(".inst"), 0.5).play(), 5);

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
