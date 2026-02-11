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
  appState.pageCount = _controller.pageCnt - 1;
  $('.introInfo').attr('data-popup', 'introPopup-10');
  $("#f_header").css({ backgroundImage: `url(${_pageData.sections[0].headerImg})` });
  $("#f_header").find("#f_courseTitle").css({ backgroundImage: `url(${_pageData.sections[0].headerText})` });
  $(".home_btn").css({ backgroundImage: `url(${_pageData.sections[0].backBtnSrc})` });
  $(".home_btn").attr("data-tooltip", "Back");
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

      let instText = '';
      for (let k = 0; k < _pageData.sections[sectionCnt - 1].iText.length; k++) {
        instText += `<p tabindex="0" id="inst_${k + 1}" aria-label="${removeTags(_pageData.sections[sectionCnt - 1].iText[k])}">${_pageData.sections[sectionCnt - 1].iText[k]}</p>`
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
        initSnakeGame();
      });

      $("#homeBack").on("click", function () {
        if (window.stopSnakeIdle) {
          window.stopSnakeIdle();
        }
        jumtoPage(2)

      });

      $(".flipTextAudio").on("click", replayLastAudio);
    }
  }
  var courseAudio = document.getElementById("courseAudio")
  $(courseAudio).off("ended")
  $(courseAudio).on("ended", function () {
    resetSimulationAudio();
    window.enableCaterpillarMovement();
  })
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
    initSnakeGame();

  } finally {
    Object.defineProperty(document, "body", {
      value: originalBody,
      configurable: true
    });
  }
}


function initSnakeGame() {
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

  // Visual Configuration
  let headScale = 1;
  let eatingAnimation = null;
  let waveAnimation = null;
  let waveStartTime = 0;
  const WAVE_DURATION = 800;

  /* =========================
     GAME CONFIG & STATE
  ========================= */
  const BASE_TILE_COUNT = 10;
  let tileCountX = 10;
  let tileCountY = 10;
  let tileSize = 0;
  let particles = [];
  let dpr = 1;

  // Idle System
  let idleTimer = null;
  let isIdle = false;
  const IDLE_DURATION = 10000;
  let idleAudioInstance = null;

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
  let victoryTriggered = false; // ✅ ADD THIS: Prevents the victory loop
  // ⭐ UPDATED: Movement Animation System (Smooth without jerks)
  const MOVE_DURATION = 300;
  let moveStartTime = 0;
  let isMoving = false;
  let pendingMove = null;

  function idleStartTimer() {
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
    stopIdleSoundNow();
    isIdle = false;

    if (isGameActive && !isGameEnded) {
      idleTimer = setTimeout(triggerIdleState, IDLE_DURATION);
    }
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
      if (!isIdle || !isGameActive || isGameEnded) return;

      // Clear existing timer before creating new one
      if (idleTimer) {
        clearTimeout(idleTimer);
        idleTimer = null;
      }

      idleTimer = setTimeout(triggerIdleState, IDLE_DURATION);
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
    // 1. Force canvas to fit parent visually (Fixes "going outside" issue)
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    // 2. Measure the parent container exactly
    const rect = gameWrapper.getBoundingClientRect();

    // Safety: If element is hidden or collapsed, stop here
    if (rect.width === 0 || rect.height === 0) {
      return;
    }

    // 3. Set internal resolution (High DPI support)
    dpr = window.devicePixelRatio || 1;

    // Set drawing buffer size to match parent pixels
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // 4. Apply scaling for coordinate system
    // (Changing width/height resets context, so we apply scale freshly here)
    ctx.scale(dpr, dpr);

    const logicalWidth = rect.width;
    const logicalHeight = rect.height;

    // 5. Grid Calculations (Preserve clip shape alignment)
    // We calculate tile size based on the smaller dimension to keep tiles square
    tileSize = Math.min(logicalWidth, logicalHeight) / (BASE_TILE_COUNT + 1);

    // Calculate how many tiles fit in the respective dimensions
    tileCountX = Math.floor(logicalWidth / tileSize) - 1;
    tileCountY = Math.floor(logicalHeight / tileSize) - 1;

    // 6. Recalculate Offsets to perfectly center the grid
    gridOffsetX = (logicalWidth - (tileCountX * tileSize)) / 2;
    gridOffsetY = (logicalHeight - (tileCountY * tileSize)) / 2;

    // Force a redraw immediately so the user doesn't see a blank flash
    if (!isGameActive && snake.length > 0) {
      render();
    }
  }

  function clearCanvas() {
    const rect = gameWrapper.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
  }

  function drawGrid() {
    ctx.save();
    const radius = 3;
    ctx.fillStyle = "#b0b0b0";
    for (let y = 0; y <= tileCountY; y++) {
      for (let x = 0; x <= tileCountX; x++) {
        const px = gridOffsetX + (x * tileSize) - (tileSize / 2);
        const py = gridOffsetY + (y * tileSize) - (tileSize / 2);
        ctx.beginPath();
        ctx.arc(px + tileSize / 2, py + tileSize / 2, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawText(text, x, y) {
    ctx.save();
    ctx.font = `bold ${tileSize * 0.5}px Alphakind`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 5;
    ctx.shadowColor = "rgba(255,255,255,0.8)";
    ctx.shadowBlur = 4;
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

  // ⭐ UPDATED: Smoother easing function to prevent jerks
  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function drawSnake() {
    // ⭐ UPDATED: Smooth interpolation without jerks
    let t = 1;
    if (isMoving && !isGameEnded) {
      const elapsed = performance.now() - moveStartTime;
      let rawT = Math.min(1, elapsed / MOVE_DURATION);
      t = easeInOutCubic(rawT); // Smooth acceleration and deceleration
    }

    const baseBodySize = tileSize * 1.02;

    for (let i = snake.length - 1; i >= 0; i--) {
      const curr = snake[i];
      const prev = (prevSnake[i]) ? prevSnake[i] : curr;

      // Interpolate position
      const animX = lerp(prev.x, curr.x, t);
      const animY = lerp(prev.y, curr.y, t);

      let x = gridOffsetX + (animX * tileSize);
      let y = gridOffsetY + (animY * tileSize);
      const cx = x + tileSize / 2;
      const cy = y + tileSize / 2;

      // --- HEAD DRAWING ---
      if (i === 0) {
        ctx.save();
        ctx.translate(cx, cy);

        // Determine facing direction based on movement
        let lookDirX = 1;
        if (snake.length > 1) {
          // Compare current target position to neck position
          if (curr.x < snake[1].x) lookDirX = -1;
        }

        if (lookDirX === -1) ctx.scale(-1, 1);

        let currentScale = headScale;
        // Idle Pulse only when NOT moving
        if (isIdle && !eatingAnimation && !waveAnimation && !isMoving) {
          currentScale = Math.sin(Date.now() / 300) * 0.1 + 1.1;
        }

        const scaledHeadSize = tileSize * 1.4 * currentScale;
        ctx.drawImage(headImg, -scaledHeadSize / 2, (-scaledHeadSize / 2) - tileSize * 0.15, scaledHeadSize, scaledHeadSize);
        ctx.restore();
      }
      // --- BODY DRAWING ---
      else {
        let currentSegmentScale = 1;

        // Wave Animation
        if (waveAnimation) {
          const now = performance.now();
          const elapsedWave = now - waveStartTime;
          const progress = elapsedWave / WAVE_DURATION;
          const peakIndex = progress * (snake.length + 2);
          const dist = Math.abs(peakIndex - i);
          if (dist < 1.5) {
            currentSegmentScale = 1 + 0.3 * Math.cos(dist * Math.PI / 3);
          }
        }

        const drawnSize = baseBodySize * currentSegmentScale;
        ctx.drawImage(bodyImg, cx - drawnSize / 2, cy - drawnSize / 2, drawnSize, drawnSize);

        if (numberSequence[i - 1] != null) {
          ctx.save();
          if (currentSegmentScale > 1) {
            ctx.font = `bold ${tileSize * 0.5 * currentSegmentScale}px Alphakind`;
          }
          drawText(numberSequence[i - 1], cx, cy);
          ctx.restore();
        }
      }
    }
  }

  function triggerWave() {
    if (waveAnimation) cancelAnimationFrame(waveAnimation);
    waveStartTime = performance.now();
    waveAnimation = requestAnimationFrame(function loop() {
      if (performance.now() - waveStartTime < WAVE_DURATION) {
        waveAnimation = requestAnimationFrame(loop);
      } else {
        waveAnimation = null;
      }
    });
  }

  function drawFood() {
    if (isGameEnded) return;

    const polygon = getPolygonPoints();
    const now = Date.now();

    foods.forEach(f => {
      if (f.eaten) return;

      const cx = gridOffsetX + f.x * tileSize + tileSize / 2;
      const cy = gridOffsetY + f.y * tileSize + tileSize / 2;

      if (!isPointInPolygon(cx, cy, polygon)) return;

      const age = now - f.spawnTime;
      let scale = 1;
      if (age < 400) {
        const t = age / 400;
        scale = Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1 + 1;
        if (scale > 1) scale = 1;
        if (age < 50) scale = 0;
      } else {
        scale = 1 + 0.05 * Math.sin(now / 300);
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
        ctx.font = `bold ${tileSize * 0.45 * scale}px Alphakind`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(f.value, cx, cy);
      }
    });
  }

  /* =========================
     MAIN RENDER LOOP
  ========================= */
  function gameLoop() {
    render();

    // ⭐ UPDATED: Simple animation completion check
    if (isMoving && performance.now() - moveStartTime >= MOVE_DURATION) {
      isMoving = false;

      // Execute pending move if exists
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

    // Boundary checks
    if (!canMoveToTile(newX, newY)) return;
    if (newX < 0 || newX >= tileCountX || newY < 0 || newY >= tileCountY) return;

    const newHead = { x: newX, y: newY };

    // Self-collision check
    if (snake.some((s, index) => index !== 0 && s.x === newHead.x && s.y === newHead.y)) return;

    const hitFood = foods.find(f => f.x === newHead.x && f.y === newHead.y);

    // Start smooth animation
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
      triggerWave();
      animateEating();

      numberSequence.push(nextValue);
      nextValue++;

      // Play Correct Audio
      playBtnSounds(_pageData.sections[sectionCnt - 1].correctAudio);

      // --- CHECK WIN CONDITION ---
      if (nextValue > currentPattern.end) {
        // ✅ STOP INFINITE LOOP (Level 1: Prevent Function Re-entry)
        if (victoryTriggered) return;
        victoryTriggered = true;

        isGameActive = false;
        isGameEnded = true;

        // ✅ STOP INFINITE LOOP (Level 2: Prevent Callback Re-execution)
        // This variable is trapped in the closure and ensures the final block runs exactly once
        let finalSequenceCompleted = false;

        // Wait for correct audio to end, then play victory sequence
        audioEnd(function () {
          $(".animations").addClass("show");
          setTimeout(function () {
            $(".animations").removeClass("show");
          }, 2500);

          playBtnSounds(_pageData.sections[sectionCnt - 1].greatJobAudio);

          audioEnd(function () {
            // Check the closure flag to ensure we don't loop if 'finalAudio' triggers audioEnd again
            if (finalSequenceCompleted) return;
            finalSequenceCompleted = true;

            if (typeof showEndAnimations === 'function') {
              showEndAnimations(); // ✅ Calls only once now guaranteed
            }
          });
        });
        return;
      }

      // --- CONTINUE GAME (Spawn new food AFTER audio) ---
      // ✅ Pause game inputs
      // isGameActive = false;

      // ✅ Wait for correct audio to finish before spawning
      audioEnd(function () {
        if (!isGameEnded && !foodsSpawned) {
          foodsSpawned = true;
          spawnFoods();
          // isGameActive = true; // ✅ Resume game inputs
        }
      });

    } else if (hitFood && !hitFood.correct) {
      snake.shift();
      snake = prevSnake;
      isMoving = false;

      playBtnSounds(_pageData.sections[sectionCnt - 1].wrongAudio);
      isGameActive = false;

      audioEnd(function () {
        inCorrectFood();
        isGameActive = true;
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

    if (isGameEnded) {
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
    $(".inst").append(`<p>${_pageData.sections[sectionCnt - 1].finalText}</p>`)
    const rect = gameWrapper.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const now = performance.now();

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
      const waveY = Math.sin((now / 400) + (i * 0.5)) * (tileSize * 0.1);
      const py = cy + waveY;

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
        x: Math.floor(Math.random() * tileCountX),
        y: Math.floor(Math.random() * tileCountY)
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
    // ⭐ FIX 2: Prevent double spawning if foods already exist
    if (foods.length > 0) return;

    const correctPos = randomEmptyCell();
    let wrongPos;
    let attempts = 0;
    do {
      wrongPos = randomEmptyCell();
      attempts++;
    } while (attempts < 100 && wrongPos.x === correctPos.x && wrongPos.y === correctPos.y);

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
  }

  // ⭐ UPDATED: Core movement execution function
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
    victoryTriggered = false; // ✅ RESET HERE

    resizeCanvas();
    spawnFoods();
    foodsSpawned = true;
    requestAnimationFrame(gameLoop);
  }

  function inCorrectFood() {
    if (isGameEnded) return;
    if (foods.length === 0) return;

    const correctFood = foods.find(f => f.correct);
    const wrongFood = foods.find(f => !f.correct);

    if (!correctFood || !wrongFood) {
      spawnFoods();
      return;
    }

    const newCorrectPos = randomEmptyCell();
    let newWrongPos;
    let attempts = 0;
    do {
      newWrongPos = randomEmptyCell();
      attempts++;
    } while (
      attempts < 100 &&
      newWrongPos.x === newCorrectPos.x &&
      newWrongPos.y === newCorrectPos.y
    );

    const now = Date.now();
    foods = [
      { ...newCorrectPos, value: correctFood.value, correct: true, spawnTime: now },
      { ...newWrongPos, value: wrongFood.value, correct: false, spawnTime: now }
    ];
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
      { x: 4, y: 5 }, { x: 3, y: 5 }, { x: 2, y: 5 }, { x: 1, y: 5 }, { x: 0, y: 5 }
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

  function startGame() {
    currentPattern = getNextPattern();
    snake = initSnake(currentPattern);
    nextValue = currentPattern.start + snake.length - 1;
    foods = [];

    isGameActive = false;
    isGameEnded = false;
    isMoving = false;
    pendingMove = null;
    foodsSpawned = false; // ⭐ Reset spawn flag
    victoryTriggered = false; // ⭐ Reset victory flag



    resizeCanvas();
    spawnFoods();
    foodsSpawned = true; // ⭐ Mark initial foods as spawned
    requestAnimationFrame(gameLoop);
  }

  // ⭐ UPDATED: Direction input handler with smooth pending system
  function setDirection(dirKey) {
    idleStartTimer();

    if (!isGameActive || isGameEnded) return;

    let dirVec = { x: 0, y: 0 };
    if (dirKey === "up") dirVec = { x: 0, y: -1 };
    if (dirKey === "down") dirVec = { x: 0, y: 1 };
    if (dirKey === "left") dirVec = { x: -1, y: 0 };
    if (dirKey === "right") dirVec = { x: 1, y: 0 };

    // Prevent 180-degree turns
    if (snake.length > 1) {
      const head = snake[0];
      const neck = snake[1];
      if (head.x + dirVec.x === neck.x && head.y + dirVec.y === neck.y) return;
    }

    // ⭐ UPDATED: Store pending or execute immediately
    if (isMoving) {
      pendingMove = dirVec;
    } else {
      executeMove(dirVec);
    }
  }

  window.enableCaterpillarMovement = function () {
    console.log("Caterpillar inputs unlocked");
    isGameActive = true;
    idleStartTimer();
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
    if (!isGameActive || isGameEnded || isIdle) return; // Prevent duplicate trigger

    // Clear any existing timer first
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
  $("#home-popup").hide();
}
function leavePage() {
  playClickThen();
  if (window.stopSnakeIdle) {
    window.stopSnakeIdle();
  }
  var audio = document.getElementById("simulationAudio");
  if (audio) {
    // Stop audio whether it's playing or paused
    audio.pause();
    audio.currentTime = 0;
  }

  jumtoPage(2);
}

function jumtoPage(pageNo) {
  playClickThen();

  _controller.pageCnt = pageNo;
  console.log(pageNo, "pageNumber");

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
//   closePopup('introPopup-1');
//   console.log("Audio ending");
//   pageVisited();

//   $audio.on("timeupdate", function () {
//     var currentTime = this.currentTime;
//     $(".greetingsPop").css("visibility", "visible");
//     $(".greetingsPop").css("opacity", "1");

//     if (currentTime >= 5) {
//       $(".confetti").addClass("show");
//       // $(".confetti").show();
//       setTimeout(function () {
//         $(".greetingsPop").css("visibility", "hidden");
//         $(".greetingsPop").css("opacity", "0");
//         $(".popup").css("visibility", "visible");
//         $(".popup").css("opacity", "1");
//       }, 1500)
//       setTimeout(function () {
//         $(".confetti").removeClass("show");
//         // $(".confetti").hide();                
//       }, 2000);

//       $audio.off("timeupdate");
//     }

//   });
// }

function showEndAnimations() {
  var $audio = $("#simulationAudio");

  // Remove any existing timeupdate listeners
  $audio.off("timeupdate");

  playBtnSounds(_pageData.sections[sectionCnt - 1].finalAudio);

  closePopup('introPopup-1');
  // console.log("Audio ending");
  pageVisited();

  $(".popup").css({
    visibility: "visible",
    opacity: "1",
    display: "flex"
  });

  const showEndAnimationsHandler = function () {
    const audioEl = $audio[0];



    // ✅ Only trigger after 2 seconds
    if (audioEl.currentTime > 2) {

      $(".confetti").addClass("show");

      setTimeout(function () {
        $(".confetti").removeClass("show");
      }, 2000);

      // ✅ Run only once
      $audio.off("timeupdate", showEndAnimationsHandler);
    }
  };

  $audio.on("timeupdate", showEndAnimationsHandler);
}


function closeIntroPop(ldx) {
  playClickThen();
  // AudioController.play();
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

  _tweenTimeline.add(animateFadeIn($(".inst").find("#inst_1"), 0.5).play(), 0.1);
  _tweenTimeline.add(animateFadeOut($(".inst").find("#inst_1"), 0.5).play(), 4);
  _tweenTimeline.add(animateFadeIn($(".inst").find("#inst_2"), 0.5).play(), 4.2);
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
