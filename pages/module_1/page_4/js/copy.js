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
  let isWrongAction = false; // <--- NEW: Strictly locks controls during wrong audio
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

  /* =========================
     CANVAS & RENDERING
  ========================= */
  function resizeCanvas() {
    const rect = gameWrapper.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      requestAnimationFrame(resizeCanvas);
      return;
    }

    // FIX 2: Use device pixel ratio for sharp rendering on retina displays
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale canvas back to display size
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    // Scale context to match device pixel ratio
    ctx.scale(dpr, dpr);

    // Re-enable high-quality rendering after scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    tileSize = Math.min(rect.width, rect.height) / (BASE_TILE_COUNT + 1);
    tileCountX = Math.floor(rect.width / tileSize) - 1;
    tileCountY = Math.floor(rect.height / tileSize) - 1;

    const usedWidth = tileCountX * tileSize;
    const usedHeight = tileCountY * tileSize;
    gridOffsetX = (rect.width - usedWidth) / 2;
    gridOffsetY = (rect.height - usedHeight) / 2;

    render();
  }

  function clearCanvas() {
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
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
        // Circle
        drawW = tileSize * 1.0;  // ✅ Full tile size for perfect circle
        drawH = tileSize * 1.0;
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
        // Circle
        drawW = tileSize * 0.85; // ✅ Slightly larger for visibility
        drawH = tileSize * 0.85;
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

    // Polygon Clipping
    const dpr = window.devicePixelRatio || 1;
    const polygon = getPolygonPoints(canvas.width / dpr, canvas.height / dpr);
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
    const dpr = window.devicePixelRatio || 1;
    const polygon = getPolygonPoints(canvas.width / dpr, canvas.height / dpr);
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
    // ✅ Safety check - never spawn if game is not active
    if (!isGameActive) {
      console.log("Spawn blocked - game not active");
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

        // 1. Cancel any previous spawn timers to prevent double-generation
        if (spawnTimer) clearTimeout(spawnTimer);
        spawnTimer = null;

        snakePattern.push(hitFood.shape);
        nextShapeIndex++;
        hitFood.eaten = true;

        // Visuals
        const cx = gridOffsetX + hitFood.x * tileSize + tileSize / 2;
        const cy = gridOffsetY + hitFood.y * tileSize + tileSize / 2;
        createParticles(cx, cy, "#FFD700");
        triggerWave();

        // 2. Clear food immediately so it disappears
        foods = [];

        // Win Check - Do this BEFORE playing audio
        const hasWon = snakePattern.length >= TARGET_LENGTH;

        if (hasWon) {
          isGameActive = false;
          // ✅ Clear all timers and foods to prevent any spawning
          if (spawnTimer) {
            clearTimeout(spawnTimer);
            spawnTimer = null;
          }
          foods = []; // ✅ Clear foods so nothing draws on canvas

          // ✅ CORRECTED FLOW for final food:
          // 1. Play correctAudio (eating sound)
          isCorrectFinal(() => {
            // 2. After correctAudio ends, center snake
            setTimeout(function () {
              $(".animations").removeClass("show");
            }, 500)
            // 3. Then play finalAudio
            playBtnSounds(_pageData.sections[sectionCnt - 1].greatJob);
            audioEnd(function () {
              showEndAnimations();              
            })
            // 4. Show end animations
            $(".animations").addClass("show");
            centerCompletedSnake();

          });

          animateEating();
          animateFoodToHead(hitFood);

          return;
        }

        // Audio & Animation for continuing game
        isCorrect();  // ✅ Don't pass food parameter
        animateEating();
        animateFoodToHead(hitFood);

        // 3. ✅ ONLY spawn once with timeout, after animations
        spawnTimer = setTimeout(() => {
          // ✅ Double check game is still active
          if (!isGameActive) {
            spawnTimer = null;
            return;
          }
          spawnFoods();
          render();
          spawnTimer = null;
        }, 500);

      } else {
        // === WRONG FOOD ===

        // 1. LOCK CONTROLS IMMEDIATELY
        isWrongAction = true;     // Locks setDirection
        isProcessingMove = true;  // Double lock

        // 2. Revert the move (Snake stays in place)
        snake.shift();
        prevSnake = []; // Stop any sliding animation

        // 3. Play Audio
        playBtnSounds(_pageData.sections[sectionCnt - 1].wrongAudio);

        // 4. Wait for Audio to End before unlocking
        audioEnd(() => {
          inCorrectFood();

          // UNLOCK EVERYTHING
          isWrongAction = false;
          isProcessingMove = false;
        });

        render();
        return;
      }
    } else {
      // Empty Move
      snake.pop();
    }

    moveStartTime = performance.now();
    isMovingAnim = true;
    render();
  }



  function inCorrectFood() {
    spawnFoods();
    render();
  }

  // ✅ NEW: Center the completed snake horizontally after game ends
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

    // Render the centered snake
    render();

    console.log("Snake centered with", snakeLength, "segments including all 6 pattern shapes");
  }

  // ✅ Track correct audio to prevent overlaps
  let correctAudioInstance = null;

  function isCorrect() {
    if (typeof playBtnSounds === 'function' && typeof _pageData !== 'undefined') {
      // ✅ Stop any previous correct audio before playing new one
      if (correctAudioInstance) {
        correctAudioInstance.pause();
        correctAudioInstance.currentTime = 0;
        correctAudioInstance = null;
      }

      // Play new audio and track it
      const audioPath = _pageData.sections[sectionCnt - 1].correctAudio;
      correctAudioInstance = new Audio(audioPath);
      correctAudioInstance.play().catch(e => console.log("Audio error:", e));
      correctAudioInstance.onended = () => {
        correctAudioInstance = null;
      };
    }
  }

  // ✅ NEW: Special function for final correct food with callback
  function isCorrectFinal(callback) {
    if (typeof playBtnSounds === 'function' && typeof _pageData !== 'undefined') {
      // ✅ Stop any previous correct audio before playing new one
      if (correctAudioInstance) {
        correctAudioInstance.pause();
        correctAudioInstance.currentTime = 0;
        correctAudioInstance = null;
      }

      // Play correct audio and track it
      const audioPath = _pageData.sections[sectionCnt - 1].correctAudio;
      correctAudioInstance = new Audio(audioPath);
      correctAudioInstance.play().catch(e => console.log("Audio error:", e));
      correctAudioInstance.onended = () => {
        correctAudioInstance = null;
        // ✅ Call the callback after audio ends
        if (callback) callback();
      };
    } else {
      // ✅ If no audio system, call callback immediately
      if (callback) callback();
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
      // ✅ Don't spawn foods yet - wait for game to be enabled
      // spawnFoods();
      render();
    });
  }

  window.enableCaterpillarMovement = function () {
    console.log("Caterpillar inputs unlocked");
    isGameActive = true;
    // ✅ NOW spawn foods when game becomes active
    spawnFoods();
    render();
    resetIdleTimer();
  };

  /* =========================
     INPUT HANDLING
  ========================= */
  function setDirection(dirKey) {
    // 1. HARD STOP: If we are in the middle of a "Wrong" action/audio, ignore EVERYTHING.
    if (isWrongAction) return;

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
      if (!isWrongAction) isProcessingMove = false;
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
}
