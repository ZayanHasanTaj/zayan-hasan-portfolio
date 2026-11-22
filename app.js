(() => {
  const FRAME_COUNT = 235;
  // const FRAME_COUNT = 476;
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });

  const images = new Array(FRAME_COUNT);
  let loadedFrames = new Set();
  let currentFrame = 0;
  let targetFrame = 0;
  let lastRenderedFrame = -1;
  let isTicking = false;

  // const pad = (num, size = 3) => String(num).padStart(size, '0');
  const pad = (num, size = 5) => String(num).padStart(size, '0');
  // const getFrameUrl = (index) => `images/ezgif-frame-${pad(index + 1)}.jpg`;
  // const getFrameUrl = (index) => `images/MyCreated/frame_${pad(index + 2)}.jpg`;
  const getFrameUrl = (index) => `images/My-Created-Ultra-Mood/frame_${pad(index + 2)}.jpg`;
  // const getFrameUrl = (index) => `images/My-Creaded-60fps/frame_${pad(index + 1)}.jpg`;
  // const getFrameUrl = (index) => `images/newimg/frame_${pad(index + 1)}.jpg`;

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (lastRenderedFrame >= 0) {
      drawFrame(lastRenderedFrame);
    }
  }

  function drawFrame(index) {
    const img = images[index];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Find nearest loaded frame to prevent blank screen
      for (let offset = 1; offset < FRAME_COUNT; offset++) {
        const prev = index - offset;
        const next = index + offset;
        if (prev >= 0 && images[prev]?.complete && images[prev]?.naturalWidth > 0) {
          return drawFrame(prev);
        }
        if (next < FRAME_COUNT && images[next]?.complete && images[next]?.naturalWidth > 0) {
          return drawFrame(next);
        }
      }
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    const scale = Math.max(w / imgW, h / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const drawX = (w - drawW) / 2;
    const drawY = (h - drawH) / 2;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      Math.round(drawX * dpr),
      Math.round(drawY * dpr),
      Math.round(drawW * dpr),
      Math.round(drawH * dpr)
    );

    lastRenderedFrame = index;
  }

  function getScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    const maxScroll = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
    if (maxScroll <= 0) return 0;
    return Math.min(Math.max(scrollTop / maxScroll, 0), 1);
  }

  function onScroll() {
    const progress = getScrollProgress();
    targetFrame = progress * (FRAME_COUNT - 1);
    startAnimationLoop();
    updateActiveNav();
  }

  function startAnimationLoop() {
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(updateLoop);
    }
  }

  function updateLoop() {
    const diff = targetFrame - currentFrame;

    if (Math.abs(diff) < 0.005) {
      currentFrame = targetFrame;
      isTicking = false;
    } else {
      currentFrame += diff * 0.085; // Silky inertia dampening
      // currentFrame += diff * 0.2;
      isTicking = true;
    }

    const frameToRender = Math.min(Math.max(Math.round(currentFrame), 0), FRAME_COUNT - 1);
    if (frameToRender !== lastRenderedFrame) {
      drawFrame(frameToRender);
    }

    if (isTicking) {
      requestAnimationFrame(updateLoop);
    }
  }

  // Active navigation link tracking on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollPos = (window.pageYOffset || document.documentElement.scrollTop) + 200;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  function preloadImages() {
    // 1. Load the first frame immediately for instant first-paint
    const firstImg = new Image();
    firstImg.src = getFrameUrl(0);
    images[0] = firstImg;

    firstImg.onload = () => {
      loadedFrames.add(0);
      resizeCanvas();
      drawFrame(0);
    };

    if (typeof firstImg.decode === 'function') {
      firstImg.decode().then(() => {
        if (lastRenderedFrame <= 0) drawFrame(0);
      }).catch(() => {});
    }

    // 2. Preload remaining frames
    for (let i = 1; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      images[i] = img;

      img.onload = () => {
        loadedFrames.add(i);
        if (typeof img.decode === 'function') {
          img.decode().catch(() => {});
        }
        if (Math.round(currentFrame) === i && lastRenderedFrame !== i) {
          drawFrame(i);
        }
      };
    }
  }

  // Event listeners
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    resizeCanvas();
  }, { passive: true });

  // Initialize
  resizeCanvas();
  preloadImages();
  onScroll();
})();

// Direct Contact
const mailButton = document.getElementById("mail-button");

  function updateMailButton() {
    mailButton.classList.toggle("is-visible", window.scrollY > 200);
  }

  window.addEventListener("scroll", updateMailButton, { passive: true });
  updateMailButton();