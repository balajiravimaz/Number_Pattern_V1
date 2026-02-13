// ---------- setting start ---------------
var _preloadData, _pageData;
var _pagePreloadArray = {
  image: 1,
  audio: -1,
  video: 1,
  data: -1,
}; // item not availble please assign value 1.
var jsonSRC = "pages/module_1/page_4/data/m1_p4_data.json?v=";
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
  console.log(_pageData.sections, _pageData.sections[0].backBtnSrc, "pageDAtat")
  addSectionData();
  appState.pageCount = _controller.pageCnt - 1;
  $('.introInfo').attr('data-popup', 'introPopup-9');
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
        console.log("Audio 1 ended. Starting Audio 2...");
        $('.inst p:first-child').hide();
        $('p:nth-child(2)').show();

        playBtnSounds(_pageData.sections[sectionCnt - 1].content.replayAudios[1], function () {
          // This runs when Audio 2 ends
          console.log("Audio 2 ended. Sequence complete.");
          resetSimulationAudio();
          $(".wrapTextaudio").addClass("paused");
          window.enableCaterpillarMovement();
        });

      });

      let instText = '';
      for (let k = 0; k < _pageData.sections[sectionCnt - 1].iText.length; k++) {
        instText += `<p tabindex="0" id="inst_${k + 1}" aria-label="${removeTags(_pageData.sections[sectionCnt - 1].iText[k])}">${_pageData.sections[sectionCnt - 1].iText[k]} <button class="wrapTextaudio playing" id="wrapTextaudio_${k}" onClick="replayLastAudio(this)"></button></p>`
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

      // pick ONE random pattern

      let htmlContent = "";

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
      popupDiv += `<div id="introPopup-9"><div class="popup-content">
      <button class="introPopAudio mute" onclick="togglePopAudio(this, '${_pageData.sections[sectionCnt - 1].infoAudio}')"></button>
      <button class="introPopclose" data-tooltip="Close" onClick="closeIntroPop('introPopup-9')"></button>
      <img src="${_pageData.sections[sectionCnt - 1].infoImg}" alt="">
  </div>
</div>`;

      popupDiv += `<div id="home-popup" class="popup-home" role="dialog" aria-label="Exit confirmation" aria-hidden="false">
    <div class="popup-content modal-box">
      <h2 class="modal-title">Oops!</h2>
      <div class="modal-message">
        <p>If you leave the shapes pattern simulation then you have to start from beginning.</p>     
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
        .find(".animat-container")[0]; // 👈 important

      initSnakeGameAtMount(mountEl);




      // $(".flip-card").on("click", onClickHanlder);



      // $("#refresh").on("click", restartActivity);
      // $("#home,#homeBack").on("click", jumtoPage)  

      $("#refresh").on("click", function () {
        $(".popup").css("opacity", "0");
        $(".popup").css("visibility", "hidden");
        // $(".popup").hide();
        jumtoPage(_controller.pageCnt);
        window.refreshSnakeGame();  // ✅ Use this instead of startGame()
      });
      $("#homeBack").on("click", function () {
        jumtoPage(_controller.pageCnt - 1)
      });
      // $(".flipTextAudio").on("click", replayLastAudio);
    }
  }
  // var courseAudio = document.getElementById("courseAudio")
  // $(courseAudio).off("ended")
  // $(courseAudio).on("ended", function () {

  //   resetSimulationAudio();
  //   $(".wrapTextaudio").addClass("paused");
  //   window.enableCaterpillarMovement();
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

  // --- GLOBAL PATTERN STATE MANAGEMENT ---
  if (typeof window.snakePatternIdx === 'undefined') {
    window.snakePatternIdx = 0;
  } else {
    window.snakePatternIdx = (window.snakePatternIdx + 1) % 2;
  }

  let currentPatternArr = [];
  let snakePattern = [];

  const app = createElement("div", "game-container", document.body);
  const gameWrapper = createElement("div", "game-wrapper", app);
  const canvas = createElement("canvas", null, gameWrapper);
  const ctx = canvas.getContext("2d");

  // FIX 1: Enable high-quality image rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high'; // ✅ Added for better quality
  ctx.webkitImageSmoothingEnabled = true;
  ctx.mozImageSmoothingEnabled = true;
  ctx.msImageSmoothingEnabled = true;

  // Visual State
  let headScale = 1;
  let eatingAnimation = null;

  // Wave Animation
  let waveAnimation = null;
  let waveStartTime = 0;
  const WAVE_DURATION = 800;
  let isEndGameWave = false;

  // Movement Animation
  let prevSnake = [];
  let moveStartTime = 0;
  let isMovingAnim = false;

  // 1. CHANGED: Slower, gentler animation timing
  const MOVE_ANIM_DURATION = 400; // 400ms for a slow, gentle slide
  const MOVE_DELAY = 400;         // Match delay to animation to prevent overlapping inputs

  /* =========================
     GAME CONFIG
  ========================= */
  const BASE_TILE_COUNT = 10;
  let tileCountX = 10;
  let tileCountY = 10;
  let tileSize = 0;
  let particles = [];

  let isWinSequenceTriggered = false;

  // Idle System
  let idleTimer = null;
  let isIdle = false;
  let animationFrameId = null;
  const IDLE_DURATION = 10000;
  let idleAudioInstance = null;

  // Grid Offsets
  let gridOffsetX = 0;
  let gridOffsetY = 0;

  // Game Logic Constants
  const TARGET_LENGTH = 6;
  const INITIAL_LENGTH = 3;

  const PATTERNS = [
    { mode: 1, sequence: ["circle", "square", "circle", "square", "circle", "square"] },
    { mode: 2, sequence: ["rectangle", "circle", "rectangle", "circle", "rectangle", "circle"] }
  ];

  let patternMode = 1;
  let nextShapeIndex = 0;
  let foods = [];
  let snake = [];

  let isGameActive = false;

  // --- STATE VARIABLES ---
  let isProcessingMove = false;
  let isWrongAction = false;
  let isCorrectAction = false; // <--- NEW: Locks controls during correct audio// <--- NEW: Strictly locks controls during wrong audio
  let spawnTimer = null;     // <--- NEW: Prevents double timers



  /* =========================
     CONTROLS
  ========================= */
  const controls = createElement("div", "controls", app);

  function createButton(dir, parent = controls) {
    const btn = createElement("button", null, parent);
    btn.dataset.dir = dir;
    const img = document.createElement("img");
    img.src = `pages/module_1/page_4/images/${dir}.png`;
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
     AUDIO & IDLE
  ========================= */
  function playIdleSoundNow() {
    if (!isIdle || !isGameActive) return;
    if (idleAudioInstance) {
      idleAudioInstance.pause();
      idleAudioInstance.currentTime = 0;
    }
    if (typeof _pageData !== "undefined" && _pageData.sections) {
      const audioPath = _pageData.sections[sectionCnt - 1].idleAudio;
      idleAudioInstance = new Audio(audioPath);
      idleAudioInstance.onended = () => {
        if (!isIdle || !isGameActive) return;
        idleTimer = setTimeout(triggerIdleState, IDLE_DURATION);
      };
      idleAudioInstance.play().catch(e => console.log("Idle audio error:", e));
    }
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
        life: 1.0,
        color: color
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


  // ✅ Store DPR globally to avoid recalculation
  let dpr = window.devicePixelRatio || 1;

  function resizeCanvas() {
    // 1. Force canvas to fit parent visually (Fixes "going outside" issue)
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const rect = gameWrapper.getBoundingClientRect();

    // Safety check: if element is hidden, retry later
    if (rect.width === 0 || rect.height === 0) {
      requestAnimationFrame(resizeCanvas);
      return;
    }

    // Use device pixel ratio for sharp rendering
    dpr = window.devicePixelRatio || 1;

    // Set internal buffer size (High DPI)
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale context to match device pixel ratio
    ctx.setTransform(1, 0, 0, 1, 0, 0); // ✅ Reset transform first
    ctx.scale(dpr, dpr);

    // Re-enable high-quality rendering after scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // --- Grid Calculation Logic ---
    tileSize = Math.min(rect.width, rect.height) / (BASE_TILE_COUNT + 1);

    // Calculate how many tiles fit
    tileCountX = Math.floor(rect.width / tileSize) - 1;
    tileCountY = Math.floor(rect.height / tileSize) - 1;

    // Calculate centering offsets
    const usedWidth = tileCountX * tileSize;
    const usedHeight = tileCountY * tileSize;

    gridOffsetX = (rect.width - usedWidth) / 2;
    gridOffsetY = (rect.height - usedHeight) / 2;

    // Force immediate redraw to update clip path and grid
    render();
  }


  function clearCanvas() {
    // ✅ Save current transform before clearing
    ctx.save();

    // ✅ Reset transform to identity for clearing
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // ✅ Clear entire canvas in device pixels
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ✅ Restore the DPR scaling transform
    ctx.restore();
  }

  function drawGrid() {
    ctx.save();
    const radius = 3;
    const color = "#b0b0b0";
    ctx.fillStyle = color;
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

  /* =========================
     ASSETS
  ========================= */
  const shapeImages = {
    circle: new Image(),
    square: new Image(),
    rectangle: new Image()
  };
  const headImg = new Image();
  const tailImg = new Image();

  tailImg.src = "pages/module_1/page_4/images/tail.png";
  headImg.src = "pages/module_1/page_4/images/head.png";

  function loadShapeImages() {
    if (patternMode === 1) {
      shapeImages.circle.src = "pages/module_1/page_4/images/circle.png";
      shapeImages.square.src = "pages/module_1/page_4/images/square.png";
      shapeImages.rectangle.src = "";
    } else {
      shapeImages.circle.src = "pages/module_1/page_4/images/circle_1.png";
      shapeImages.rectangle.src = "pages/module_1/page_4/images/rect.png";
      shapeImages.square.src = "";
    }
  }

  function getActiveShapes() {
    return patternMode === 1
      ? ["circle", "square"]
      : ["rectangle", "circle"];
  }

  function lerp(start, end, t) {
    return start + (end - start) * t;
  }

  function drawSnake() {
    if (!Array.isArray(snake) || snake.length === 0) return;

    let t = 1;
    if (isMovingAnim) {
      const now = performance.now();
      t = Math.min(1, (now - moveStartTime) / MOVE_ANIM_DURATION);
      if (t >= 1) isMovingAnim = false;
    }

    // ✅ END GAME WAVE ANIMATION - like reference
    if (isEndGameWave) {
      const now = performance.now();

      for (let i = 0; i < snake.length; i++) {
        const seg = snake[i];
        const isHead = (i === 0);

        // Calculate wave offset for this segment
        const waveY = Math.sin((now / 400) + (i * 0.5)) * (tileSize * 0.1);

        const cx = gridOffsetX + seg.x * tileSize + tileSize / 2;
        const cy = gridOffsetY + seg.y * tileSize + tileSize / 2 + waveY; // Apply wave

        if (isHead) {
          // Draw head
          const size = tileSize * 1.15;
          const headX = Math.round(cx - size / 2);
          const headY = Math.round(cy - size / 2);
          const headSize = Math.round(size);
          ctx.drawImage(headImg, headX, headY, headSize, headSize);
        } else if (i === snake.length - 1) {
          // Draw tail
          const tailWidth = tileSize * 1.0;
          const tailHeight = tileSize * 0.5;
          const tailX = Math.round(cx - tailWidth / 2);
          const tailY = Math.round(cy - tailHeight / 2);
          ctx.drawImage(tailImg, tailX, tailY, Math.round(tailWidth), Math.round(tailHeight));
        } else {
          // Draw body with pattern
          const patternIndex = i - 1;
          const shape = snakePattern[patternIndex];
          if (!shape || !shapeImages[shape]) continue;

          let drawW, drawH;
          if (shape === 'rectangle') {
            drawW = tileSize * 1.05;
            drawH = tileSize * 0.65;
          } else if (shape === 'square') {
            drawW = tileSize * 0.95;
            drawH = tileSize * 0.95;
          } else {
            // Circle - Perfect 1:1 ratio
            const circleSize = tileSize * 0.95;
            drawW = circleSize;
            drawH = circleSize;
          }

          const drawX = Math.round(cx - drawW / 2);
          const drawY = Math.round(cy - drawH / 2);
          ctx.drawImage(shapeImages[shape], drawX, drawY, Math.round(drawW), Math.round(drawH));
        }
      }

      // Continue animation
      requestAnimationFrame(render);
      return;
    }

    // --- DRAW BODY ---
    for (let i = 1; i < snake.length - 1; i++) {
      const seg = snake[i];
      const nextSeg = snake[i - 1];

      let drawX = seg.x;
      let drawY = seg.y;

      let nextX = nextSeg.x;
      let nextY = nextSeg.y;

      if (isMovingAnim && prevSnake.length > 0) {
        let prevSeg, prevNextSeg;

        if (snake.length > prevSnake.length) {
          prevSeg = (i === 1) ? prevSnake[0] : prevSnake[i - 1];
          prevNextSeg = (i - 1 === 0) ? prevSnake[0] : prevSnake[i - 2];
          if (i === 1) prevNextSeg = prevSnake[0];
        } else {
          prevSeg = prevSnake[i];
          prevNextSeg = prevSnake[i - 1];
        }

        if (prevSeg) {
          drawX = lerp(prevSeg.x, seg.x, t);
          drawY = lerp(prevSeg.y, seg.y, t);
        }
        if (prevNextSeg) {
          nextX = lerp(prevNextSeg.x, nextSeg.x, t);
          nextY = lerp(prevNextSeg.y, nextSeg.y, t);
        }
      }

      const patternIndex = i - 1;
      const shape = snakePattern[patternIndex];
      if (!shape || !shapeImages[shape]) continue;

      const cx = gridOffsetX + drawX * tileSize + tileSize / 2;
      const cy = gridOffsetY + drawY * tileSize + tileSize / 2;

      const dx = nextX - drawX;
      const dy = nextY - drawY;
      const rotation = Math.atan2(dy, dx);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);

      // FIX 3: Adjusted shape dimensions to prevent edge cutoff
      let drawW, drawH;

      if (shape === 'rectangle') {
        drawW = tileSize * 1.1;  // ✅ Width stays same
        drawH = tileSize * 0.7;  // ✅ Reduced height so it looks like rectangle not square
      } else if (shape === 'square') {
        drawW = tileSize * 1.0;  // ✅ Full tile size for perfect square
        drawH = tileSize * 1.0;
      } else {
        // Circle - CRITICAL: Must be perfectly square for round appearance
        const circleSize = tileSize * 1.0;
        drawW = circleSize;  // ✅ Same width and height for perfect circle
        drawH = circleSize;  // ✅ Same width and height for perfect circle
      }

      // FIX 4: Draw with sub-pixel precision to avoid blurriness
      const drawX_precise = Math.round(-drawW / 2);
      const drawY_precise = Math.round(-drawH / 2);
      const drawW_precise = Math.round(drawW);
      const drawH_precise = Math.round(drawH);

      ctx.drawImage(
        shapeImages[shape],
        drawX_precise,
        drawY_precise,
        drawW_precise,
        drawH_precise
      );

      ctx.restore();
    }

    // --- DRAW TAIL ---
    if (snake.length > 1) {
      const tailIndex = snake.length - 1;
      const tail = snake[tailIndex];
      const beforeTail = snake[tailIndex - 1];

      let drawX = tail.x;
      let drawY = tail.y;
      let refX = beforeTail.x;
      let refY = beforeTail.y;

      if (isMovingAnim && prevSnake.length > 0) {
        let prevTail = prevSnake[prevSnake.length - 1];
        if (snake.length > prevSnake.length) {
          drawX = tail.x;
          drawY = tail.y;
        } else {
          drawX = lerp(prevTail.x, tail.x, t);
          drawY = lerp(prevTail.y, tail.y, t);
          let prevBeforeTail = prevSnake[prevSnake.length - 2];
          refX = lerp(prevBeforeTail.x, beforeTail.x, t);
          refY = lerp(prevBeforeTail.y, beforeTail.y, t);
        }
      }

      const cx = gridOffsetX + drawX * tileSize + tileSize / 2;
      const cy = gridOffsetY + drawY * tileSize + tileSize / 2;

      // ✅ Tail dimensions - short and low like real snake tail
      const tailWidth = tileSize * 1.0;   // ✅ Width to connect properly
      const tailHeight = tileSize * 0.5;  // ✅ 50% of body height - short and low

      ctx.save();
      ctx.translate(cx, cy);

      const dx = refX - drawX;
      const dy = refY - drawY;
      let rotation = Math.atan2(dy, dx);
      ctx.rotate(rotation);

      if (isMovingAnim) {
        const wagSpeed = 0.02;
        const wagAmount = tileSize * 0.15;
        const wagOffset = Math.sin(performance.now() * wagSpeed) * wagAmount;
        ctx.translate(0, wagOffset);
      }

      // ✅ Move tail forward to touch body edge without gap
      const tailForwardOffset = tileSize * 0.15;  // ✅ Slightly increased to ensure connection

      // FIX 5: Use rounded values for crisp rendering
      const tailX = Math.round((-tailWidth / 2) + tailForwardOffset);
      const tailY = Math.round(-tailHeight / 2);
      const tailW = Math.round(tailWidth);
      const tailH = Math.round(tailHeight);

      ctx.drawImage(tailImg, tailX, tailY, tailW, tailH);
      ctx.restore();
    }

    // --- DRAW HEAD ---
    if (snake.length > 0) {
      const head = snake[0];
      let drawX = head.x;
      let drawY = head.y;
      let refX, refY;

      if (isMovingAnim && prevSnake.length > 0) {
        const prevHead = prevSnake[0];
        drawX = lerp(prevHead.x, head.x, t);
        drawY = lerp(prevHead.y, head.y, t);
      }

      const cx = gridOffsetX + drawX * tileSize + tileSize / 2;
      const cy = gridOffsetY + drawY * tileSize + tileSize / 2;

      ctx.save();
      ctx.translate(cx, cy);

      if (snake.length > 1) {
        const neck = snake[1];
        if (isMovingAnim && prevSnake.length > 0) {
          let prevNeck = (snake.length > prevSnake.length) ? prevSnake[0] : prevSnake[1];
          refX = lerp(prevNeck.x, neck.x, t);
          refY = lerp(prevNeck.y, neck.y, t);
        } else {
          refX = neck.x;
          refY = neck.y;
        }

        const dx = drawX - refX;
        const dy = drawY - refY;
        let rotation = Math.atan2(dy, dx);
        ctx.rotate(rotation);
      }

      const size = tileSize * 1.15 * headScale;
      const headOverlapReduction = tileSize * 0.1;

      // FIX 6: Use rounded values for crisp head rendering
      const headX = Math.round((-size / 2) + headOverlapReduction);
      const headY = Math.round(-size / 2);
      const headSize = Math.round(size);

      ctx.drawImage(headImg, headX, headY, headSize, headSize);
      ctx.restore();
    }

    if (isMovingAnim) {
      requestAnimationFrame(render);
    }
  }


  function drawFood() {
    foods.forEach(f => {
      const cx = gridOffsetX + f.x * tileSize + tileSize / 2;
      const cy = gridOffsetY + f.y * tileSize + tileSize / 2;

      if (!shapeImages[f.shape]) return;

      let drawW, drawH;

      // FIX 7: Adjusted food dimensions for proper display
      if (f.shape === 'rectangle') {
        drawW = tileSize * 0.95; // ✅ Width 
        drawH = tileSize * 0.65; // ✅ Reduced to look like rectangle not square
      } else if (f.shape === 'square') {
        drawW = tileSize * 0.8;  // ✅ Consistent size
        drawH = tileSize * 0.8;
      } else {
        // Circle - CRITICAL: Must be perfectly square for round appearance
        const circleSize = tileSize * 0.85;
        drawW = circleSize;  // ✅ Same width and height for perfect circle
        drawH = circleSize;  // ✅ Same width and height for perfect circle
      }

      // FIX 8: Use rounded positions for crisp rendering
      const foodX = Math.round(cx - drawW / 2);
      const foodY = Math.round(cy - drawH / 2);
      const foodW = Math.round(drawW);
      const foodH = Math.round(drawH);

      ctx.drawImage(
        shapeImages[f.shape],
        foodX,
        foodY,
        foodW,
        foodH
      );
    });
  }


  function triggerWave() {
    if (waveAnimation) cancelAnimationFrame(waveAnimation);
    waveStartTime = performance.now();
    function loop() {
      const elapsed = performance.now() - waveStartTime;
      if (elapsed < WAVE_DURATION) {
        render();
        waveAnimation = requestAnimationFrame(loop);
      } else {
        waveAnimation = null;
        render();
      }
    }
    waveAnimation = requestAnimationFrame(loop);
  }

  function render() {
    clearCanvas();
    ctx.save();

    // ✅ Polygon Clipping - use CSS dimensions (not device pixels)
    const rect = gameWrapper.getBoundingClientRect();
    const polygon = getPolygonPoints(rect.width, rect.height);
    ctx.beginPath();
    ctx.moveTo(polygon[0][0], polygon[0][1]);
    for (let i = 1; i < polygon.length; i++) ctx.lineTo(polygon[i][0], polygon[i][1]);
    ctx.closePath();
    ctx.clip();

    drawGrid();
    drawFood();
    drawParticles();
    drawSnake();

    ctx.restore();
  }

  const clipPolygon = [
    [0, 15], [0, 0], [15, 0], [85, 0], [100, 0], [100, 15],
    [100, 65], [82, 65], [82, 100], [15, 100], [0, 100], [0, 85]
  ];

  function getPolygonPoints(w, h) {
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
    const rect = gameWrapper.getBoundingClientRect();
    const polygon = getPolygonPoints(rect.width, rect.height);
    const corners = [
      { cx: gridOffsetX + tileX * tileSize, cy: gridOffsetY + tileY * tileSize },
      { cx: gridOffsetX + (tileX + 1) * tileSize, cy: gridOffsetY + tileY * tileSize },
      { cx: gridOffsetX + tileX * tileSize, cy: gridOffsetY + (tileY + 1) * tileSize },
      { cx: gridOffsetX + (tileX + 1) * tileSize, cy: gridOffsetY + (tileY + 1) * tileSize }
    ];
    return corners.every(c => isPointInPolygon(c.cx, c.cy, polygon));
  }

  /* =========================
     GAMEPLAY LOGIC
  ========================= */
  function randomEmptyCell() {
    if (!Array.isArray(snake)) snake = [];
    if (!Array.isArray(foods)) foods = [];
    let pos, attempts = 0;
    do {
      pos = {
        x: Math.floor(Math.random() * tileCountX),
        y: Math.floor(Math.random() * tileCountY)
      };
      attempts++;
    } while (
      attempts < 100 &&
      (
        !canMoveToTile(pos.x, pos.y) ||
        snake.some(s => s.x === pos.x && s.y === pos.y) ||
        foods.some(f => f.x === pos.x && f.y === pos.y)
      )
    );
    return pos;
  }

  function spawnFoods() {
    // ✅ Only block spawning if game was active and is now ended
    // Allow spawning at initial load (isGameActive = false initially)
    if (isGameActive === false && foods.length > 0) {
      console.log("Spawn blocked - game ended");
      return;
    }

    foods = [];
    const correctPos = randomEmptyCell();
    let wrongPos;
    let attempts = 0;
    do {
      wrongPos = randomEmptyCell();
      attempts++;
    } while (attempts < 100 && wrongPos.x === correctPos.x && wrongPos.y === correctPos.y);

    const shapes = getActiveShapes();
    const safeIndex = nextShapeIndex % currentPatternArr.length;
    const nextShape = currentPatternArr[safeIndex];

    let wrongShape = nextShape;
    while (wrongShape === nextShape) {
      wrongShape = shapes[Math.floor(Math.random() * shapes.length)];
    }

    foods = [
      { ...correctPos, shape: nextShape, correct: true },
      { ...wrongPos, shape: wrongShape, correct: false }
    ];

    $(".wrapTextaudio").prop("disabled", false);
    console.log("Foods spawned:", foods.length);
  }



  function moveSnake(dir) {
    // DOUBLE CHECK: Stop if we are already handling a wrong move
    if (isWrongAction) return;

    const head = snake[0];
    const newX = head.x + dir.x;
    const newY = head.y + dir.y;

    if (!canMoveToTile(newX, newY)) return;
    if (newX < 0 || newX >= tileCountX || newY < 0 || newY >= tileCountY) return;

    const newHead = { x: newX, y: newY };

    // Body Collision Check
    if (snake.some((s, index) => index !== 0 && index !== snake.length - 1 && s.x === newHead.x && s.y === newHead.y)) return;

    const hitFood = foods.find(f => f.x === newHead.x && f.y === newHead.y);

    prevSnake = JSON.parse(JSON.stringify(snake));
    snake.unshift(newHead);

    if (hitFood) {

      if (hitFood.correct) {
        // === CORRECT FOOD ===

        // 1. LOCK CONTROLS IMMEDIATELY
        if (spawnTimer) clearTimeout(spawnTimer);
        spawnTimer = null;

        isCorrectAction = true;
        isProcessingMove = true;

        snakePattern.push(hitFood.shape);
        nextShapeIndex++;
        hitFood.eaten = true;

        // Visuals
        const cx = gridOffsetX + hitFood.x * tileSize + tileSize / 2;
        const cy = gridOffsetY + hitFood.y * tileSize + tileSize / 2;
        createParticles(cx, cy, "#FFD700");
        triggerWave();

        // 2. Clear food immediately
        foods = [];

        // Win Check
        const hasWon = snakePattern.length >= TARGET_LENGTH;

        if (hasWon) {
          // ✅ FIX: Prevent infinite loop / double trigger
          if (isWinSequenceTriggered) return;
          isWinSequenceTriggered = true;

          isGameActive = false;
          $(".replayLastAudio").prop("disabled", true);

          // Trigger Eating Animation & Move
          animateEating();
          animateFoodToHead(hitFood);

          // ✅ LOGIC: Wait for "Correct" sound (from isCorrectFinal), then "Great Job", then "Final"
          isCorrectFinal(() => {

            // 1. Visual updates
            $(".animations").addClass("show");
            centerCompletedSnake();

            // 2. Hide visual after 2.5s (optional, based on your code)
            setTimeout(function () {
              $(".animations").removeClass("show");
              $(".greetingsPop").css({ visibility: "visible", opacity: "1" });
            }, 2500);

            // 3. Update Instruction Text
            $(".inst").html(
              `<p>${_pageData.sections[sectionCnt - 1].finalText} <button class="wrapTextaudio playing" id="wrapTextaudio_2" onClick="replayLastAudio(this)"></button></p>`
            );
            $(".wrapTextaudio").prop("disabled", false);

            // 4. Setup Audio Chain: Great Job -> End Animations
            const audio = document.getElementById("simulationAudio");
            if (audio) {
              // Clean up any stray listeners
              audio.onended = null;

              // Add listener: When "Great Job" finishes, start Final Sequence
              // using 'once: true' to ensure it doesn't stick around
              audio.addEventListener("ended", function () {
                showEndAnimations();
              }, { once: true });
            }

            // 5. Play "Great Job" Audio
            playBtnSounds(_pageData.sections[sectionCnt - 1].greatJob);
          });

          return; // Stop execution here
        }

        // === GAME CONTINUES ===

        animateEating();
        animateFoodToHead(hitFood);

        // Callback: Wait for "Correct" audio to finish, then unlock
        isCorrect(() => {
          isCorrectAction = false;
          isProcessingMove = false;
          spawnFoods();
          render();
        });

      } else {
        // === WRONG FOOD ===
        isWrongAction = true;
        isProcessingMove = true;

        // Revert move
        snake.shift();
        prevSnake = [];

        $(".wrapTextaudio").prop("disabled", true);

        // Play Wrong Audio
        playBtnSounds(_pageData.sections[sectionCnt - 1].wrongAudio);

        // Handle UI buttons
        $(".wrapTextaudio").each(function () {
          if ($(this).hasClass("playing")) {
            $(this).removeClass("playing").addClass("paused");
          }
        });

        // Callback: Wait for audio to end
        audioEnd(() => {
          inCorrectFood();
          $(".wrapTextaudio").prop("disabled", false);
          isWrongAction = false;
          isProcessingMove = false;
        });

        render();
        return;
      }
    }
    else {
      // Empty Move
      snake.pop();
    }

    moveStartTime = performance.now();
    isMovingAnim = true;
    render();
  }


  function playAudioOnce(audioSrc, onEnded) {
    const audio = new Audio(audioSrc);
    audio.play();
    if (onEnded) {
      audio.addEventListener("ended", onEnded, { once: true });
    }
  }


  function inCorrectFood() {
    spawnFoods();
    render();
  }

  // ✅ NEW: Center the completed snake horizontally after game ends with gentle wave animation
  function centerCompletedSnake() {
    if (snake.length === 0) return;

    // Calculate center position for horizontal snake
    const centerY = Math.floor(tileCountY / 2);
    const snakeLength = snake.length;
    const startX = Math.floor((tileCountX - snakeLength) / 2);

    // Rebuild snake horizontally from left to right in center
    const newSnake = [];
    for (let i = 0; i < snakeLength; i++) {
      newSnake.push({
        x: startX + i,
        y: centerY
      });
    }

    // Reverse to keep head at front
    snake = newSnake.reverse();

    // Reset animation states
    prevSnake = [];
    isMovingAnim = false;

    console.log("Snake centered with", snakeLength, "segments including all 6 pattern shapes");

    // ✅ Enable continuous wave animation mode
    isEndGameWave = true;

    // Start continuous animation loop
    function waveLoop() {
      if (isEndGameWave) {
        render();
        requestAnimationFrame(waveLoop);
      }
    }
    requestAnimationFrame(waveLoop);
  }

  // ✅ NEW: Gentle wave animation for end celebration
  function triggerGentleWave() {
    if (waveAnimation) cancelAnimationFrame(waveAnimation);
    waveStartTime = performance.now();
    const GENTLE_WAVE_DURATION = 1500; // 1.5 seconds - slower and gentler

    function loop() {
      const elapsed = performance.now() - waveStartTime;
      if (elapsed < GENTLE_WAVE_DURATION) {
        render();
        waveAnimation = requestAnimationFrame(loop);
      } else {
        waveAnimation = null;
        render();
      }
    }
    waveAnimation = requestAnimationFrame(loop);
  }

  // ✅ Use existing playBtnSounds with audioEnd callback system
  function isCorrect(callback) {
    if (typeof playBtnSounds === 'function' && typeof _pageData !== 'undefined') {
      const audioPath = _pageData.sections[sectionCnt - 1].correctAudio;
      $(".wrapTextaudio").each(function () {
        if ($(this).hasClass("playing")) {
          $(".wrapTextaudio").removeClass("playing");
          $(".wrapTextaudio").addClass("paused");
        } else {
          // ✅ This specific button is paused
        }
      });
      console.log("is correct")
      playBtnSounds(audioPath);
      $(".wrapTextaudio").prop("disabled", true);


      // Use audioEnd to execute callback when audio finishes
      if (callback) {
        audioEnd(callback);

      }
    } else {
      // Fallback if audio system missing
      console.log("is correct gone 2")
      if (callback) setTimeout(callback, 500);
    }
  }

  // ✅ Use playBtnSounds for final correct audio
  function isCorrectFinal(callback) {
    if (typeof playBtnSounds === 'function' && typeof _pageData !== 'undefined') {
      const audioPath = _pageData.sections[sectionCnt - 1].correctAudio;
      $(".wrapTextaudio").prop("disabled", true);
      playBtnSounds(audioPath);
      console.log("final Audio playgin")

      // Use audioEnd to execute callback when audio finishes
      if (callback) {
        audioEnd(callback);
      }
    } else {
      // Fallback if audio system missing
      if (callback) setTimeout(callback, 500);
    }
  }

  function animateEating() {
    if (eatingAnimation) cancelAnimationFrame(eatingAnimation);
    const duration = 200;
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      if (elapsed < duration) {
        headScale = 1 + 0.3 * Math.sin((elapsed / duration) * Math.PI);
        if (!isMovingAnim) render();
        eatingAnimation = requestAnimationFrame(step);
      } else {
        headScale = 1;
        eatingAnimation = null;
        if (!isMovingAnim) render();
      }
    }
    requestAnimationFrame(step);
  }

  function animateFoodToHead(food) {
    const startX = gridOffsetX + food.x * tileSize + tileSize / 2;
    const startY = gridOffsetY + food.y * tileSize + tileSize / 2;
    const head = snake[0];
    const endX = gridOffsetX + head.x * tileSize + tileSize / 2;
    const endY = gridOffsetY + head.y * tileSize + tileSize / 2;
    const duration = 250;
    const start = performance.now();

    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      if (!isMovingAnim) render();

      const cx = startX + (endX - startX) * t;
      const cy = startY + (endY - startY) * t;
      const size = tileSize * 0.6;
      if (shapeImages[food.shape]) {
        ctx.drawImage(shapeImages[food.shape], cx - size / 2, cy - size / 2, size, size);
      }
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* =========================
     INIT LOGIC
  ========================= */
  function loadCurrentPattern() {
    const pattern = PATTERNS[window.snakePatternIdx];
    patternMode = pattern.mode;
    loadShapeImages();
    currentPatternArr = [...pattern.sequence];
  }

  function initSnake() {
    snake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
      { x: 2, y: 5 },
      { x: 1, y: 5 }
    ];
    prevSnake = [];
    isMovingAnim = false;
    snakePattern = currentPatternArr.slice(0, INITIAL_LENGTH);
    nextShapeIndex = INITIAL_LENGTH;
  }

  function waitForImages(callback) {
    const activeKeys = patternMode === 1 ? ['circle', 'square'] : ['circle', 'rectangle'];
    const imagesToCheck = [headImg, tailImg];
    activeKeys.forEach(k => imagesToCheck.push(shapeImages[k]));
    let loaded = 0;
    const total = imagesToCheck.length;
    const check = () => {
      loaded++;
      if (loaded >= total) callback();
    };
    imagesToCheck.forEach(img => {
      if (img.complete) check();
      else {
        img.onload = check;
        img.onerror = check;
      }
    });
  }

  function startGame() {
    loadCurrentPattern();
    waitForImages(() => {
      initSnake();
      foods = [];
      isGameActive = false;
      isProcessingMove = false;
      resizeCanvas();
      // ✅ Spawn foods immediately so user can see shapes at start
      spawnFoods();
      render();
    });
  }

  window.enableCaterpillarMovement = function () {
    console.log("Caterpillar inputs unlocked");
    isGameActive = true;
    // ✅ Foods already spawned, just enable game and reset idle
    render();
    resetIdleTimer();
  };

  /* =========================
     INPUT HANDLING
  ========================= */
  function setDirection(dirKey) {
    // 1. HARD STOP: If we are in the middle of a "Wrong" action/audio, ignore EVERYTHING.
    if (isWrongAction || isCorrectAction) return; // <--- UPDATED: Added isCorrectAction check

    resetIdleTimer();

    // 2. Standard checks
    if (!isGameActive) return;
    if (isProcessingMove) return;

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

    isProcessingMove = true;
    moveSnake(dirVec);

    // Safety unlock for normal moves (cancelled if moveSnake hits wrong food)
    setTimeout(() => {
      // <--- UPDATED: Only unlock if neither Wrong nor Correct action is happening
      if (!isWrongAction && !isCorrectAction) isProcessingMove = false;
    }, MOVE_DELAY);
  }

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

  function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = null;
    stopIdleSoundNow();
    if (isIdle) {
      isIdle = false;
      cancelAnimationFrame(animationFrameId);
      render();
    }
    if (isGameActive) {
      idleTimer = setTimeout(triggerIdleState, IDLE_DURATION);
    }
  }

  // ✅ COMPREHENSIVE ACTIVITY DETECTION - Monitor ALL user interactions
  function setupGlobalActivityListeners() {
    // Track any mouse movement on the page
    document.addEventListener("mousemove", resetIdleTimer, { passive: true });

    // Track any mouse clicks on the page
    document.addEventListener("mousedown", resetIdleTimer, { passive: true });
    document.addEventListener("click", resetIdleTimer, { passive: true });

    // Track any keyboard activity on the page
    document.addEventListener("keydown", resetIdleTimer, { passive: true });
    document.addEventListener("keypress", resetIdleTimer, { passive: true });

    // Track touch events for mobile devices
    document.addEventListener("touchstart", resetIdleTimer, { passive: true });
    document.addEventListener("touchmove", resetIdleTimer, { passive: true });

    // Track scroll events
    document.addEventListener("scroll", resetIdleTimer, { passive: true });

    // Track any pointer events
    document.addEventListener("pointerdown", resetIdleTimer, { passive: true });
    document.addEventListener("pointermove", resetIdleTimer, { passive: true });
  }

  // Call this during initialization
  setupGlobalActivityListeners();

  // ✅ NEW HELPER FUNCTIONS for controlling idle timer externally
  window.startIdleTimer = function () {
    if (!isGameActive) return;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(triggerIdleState, IDLE_DURATION);
  };

  window.stopIdleTimer = function () {
    clearTimeout(idleTimer);
    idleTimer = null;
    stopIdleSoundNow();
    if (isIdle) {
      isIdle = false;
      cancelAnimationFrame(animationFrameId);
      render();
    }
  };

  function triggerIdleState() {
    if (!isGameActive) return;
    isIdle = true;
    clearTimeout(idleTimer);
    idleTimer = null;
    playIdleSoundNow();
    animateIdleLoop();
  }

  function animateIdleLoop() {
    if (!isIdle) return;
    render();
    animationFrameId = requestAnimationFrame(animateIdleLoop);
  }

  // Start initialization
  startGame();

  window.refreshSnakeGame = function () {
    // Clear any running timers
    if (spawnTimer) clearTimeout(spawnTimer);
    if (idleTimer) clearTimeout(idleTimer);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (waveAnimation) cancelAnimationFrame(waveAnimation);
    if (eatingAnimation) cancelAnimationFrame(eatingAnimation);

    // Stop any playing audio
    stopIdleSoundNow();

    // Reset game state
    particles = [];
    foods = [];
    isGameActive = false;
    isProcessingMove = false;
    isWrongAction = false;
    isIdle = false;
    isEndGameWave = false; // ✅ Reset wave animation mode

    // Restart the game
    startGame();
  };
}

// window.startIdleTimer() - Start/restart the idle timer
// window.stopIdleTimer() - Stop the idle timer completely

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

  if (window.stopIdleSoundNow) {
    window.stopIdleSoundNow();
  }

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


var activeAudio = null;

function playBtnSounds(soundFile, callback) {
  const audio = document.getElementById("simulationAudio");

  audio.muted = false;

  if (!soundFile) {
    console.warn("Audio source missing!");
    // If audio is missing but a callback exists, we should probably run it 
    // so the flow doesn't hang, or just return.
    if (callback) callback();
    return;
  }

  // 1. CRITICAL: Clear any existing onended triggers from previous plays
  audio.onended = null;

  // Stop previous audio if it exists
  if (activeAudio && !activeAudio.paused) {
    activeAudio.pause();
  }

  audio.loop = false;
  audio.src = soundFile;
  audio.load();

  activeAudio = audio;

  // 2. If a callback is provided, attach it
  if (typeof callback === "function") {
    audio.onended = () => {
      // Remove self to prevent future loops
      audio.onended = null;
      callback();
    };
  }

  console.log("Playing:", soundFile);
  audio.play().catch((err) => {
    console.warn("Audio play error:", err);
    // Optional: If play fails, should we trigger callback?
    // if (callback) callback(); 
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
//   playBtnSounds(_pageData.sections[sectionCnt - 1].finalAudio);

//   closePopup('introPopup-1');
//   console.log("Audio ending");
//   pageVisited();

//   $audio.on("timeupdate", function () {
//     var currentTime = this.currentTime;
//     // $(".greetingsPop").css("visibility", "visible");
//     // $(".greetingsPop").css("opacity", "1");

//     $(".popup").css("visibility", "visible");
//     $(".popup").css("opacity", "1");
//     $(".confetti").addClass("show");
//     setTimeout(function () {
//       $(".confetti").removeClass("show");
//       // $(".confetti").hide();                
//     }, 1000);

//     // if (currentTime >= 5) {
//     //   $(".confetti").addClass("show");
//     //   // $(".confetti").show();
//     //   setTimeout(function () {
//     //     $(".greetingsPop").css("visibility", "hidden");
//     //     $(".greetingsPop").css("opacity", "0");
//     //     $(".popup").css("visibility", "visible");
//     //     $(".popup").css("opacity", "1");
//     //   }, 1500)
//     //   setTimeout(function () {
//     //     $(".confetti").removeClass("show");
//     //     // $(".confetti").hide();                
//     //   }, 2000);

//     //   $audio.off("timeupdate");
//     // }

//   });
// }



// ✅ REPLACE your existing showEndAnimations function with this:


var isEndAnimationTriggered = false;

function showEndAnimations() {
  if (isEndAnimationTriggered) return;
  isEndAnimationTriggered = true;

  console.log("showEndAnimations initiated");

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

function replayLastAudio(btnElement) {
  playClickThen();

  const courseAudio = document.getElementById("courseAudio");
  const simulationAudio = document.getElementById("simulationAudio");

  const index = parseInt(btnElement.id.split("_")[1]);
  const replayAudios =
    _pageData.sections[sectionCnt - 1].content.replayAudios;

  let activeAudio = null;

  // --------------------------------------------------
  // 1️⃣ Detect active playing audio
  // --------------------------------------------------
  if (courseAudio && !courseAudio.paused && !courseAudio.ended) {
    activeAudio = courseAudio;
  }
  else if (simulationAudio && !simulationAudio.paused && !simulationAudio.ended) {
    activeAudio = simulationAudio;
  }

  // --------------------------------------------------
  // 2️⃣ If something is playing → just toggle mute
  // --------------------------------------------------
  if (activeAudio) {
    activeAudio.muted = !activeAudio.muted;
    updateButtonUI(btnElement, !activeAudio.muted);
    return;
  }

  // --------------------------------------------------
  // 3️⃣ Nothing playing → call playBtnSounds()
  // --------------------------------------------------
  if (replayAudios && replayAudios[index]) {

    playBtnSounds(replayAudios[index]);

    resetAllButtons();
    updateButtonUI(btnElement, true);

    // Optional: reset UI when replay ends
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


// function replayLastAudio() {
//   playClickThen();
//   console.log(_currentAudio, "Audio plaing");
//   playBtnSounds(_currentAudio);
//   disableButtons();
//   audioEnd(function () {
//     resetSimulationAudio();
//     enableButtons();
//   })
// }




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

  _tweenTimeline.add(animateFadeIn($(".inst").find("#inst_1"), 0.5).play(), 0.5);
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
