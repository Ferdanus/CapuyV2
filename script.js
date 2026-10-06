// Love and cute cat emojis for particle effects
const LOVE_EMOJIS = ['💖', '💕', '💗', '💓', '✨', '🌸', '🐱', '😻', '😽', '🥺', '🎀', '🌷', '🥰', '🐾', '🤍', '🍰'];

// DOM elements
const envelopeBox = document.getElementById('envelopeBox');
const envelope = document.getElementById('envelope');
const introHeader = document.getElementById('introHeader');
const flashEffect = document.getElementById('flashEffect');
const emojiOverlay = document.getElementById('emojiOverlay');
const replayZone = document.getElementById('replayZone');
const btnReset = document.getElementById('btnReset');
const canvas = document.getElementById('loveCanvas');
const ctx = canvas.getContext('2d');

let isOpened = false;
let animationFrameId = null;
let particles = [];
let audioCtx = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Web Audio API Audio Context
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Sweet Magical Sparkle Chime / Harp Arpeggio Sound
function playMagicalChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Sweet pentatonic / major chime notes (C5, E5, G5, B5, C6, E6)
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // Soft sparkling envelope
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.35, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 1.25);
    });
  } catch (e) {
    console.error(e);
  }
}

// Sparkle & Heart Particle Class
class HeartSparkleParticle {
  constructor(x, y, isBurst = false) {
    this.x = x || (canvas.width / 2 + (Math.random() * 240 - 120));
    this.y = y || (canvas.height / 2 + (Math.random() * 100 - 50));
    
    if (isBurst) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 10 + 3;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 2;
      this.size = Math.random() * 14 + 6;
      this.life = 1.0;
      this.decay = Math.random() * 0.02 + 0.012;
    } else {
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = -(Math.random() * 3 + 1.5);
      this.size = Math.random() * 10 + 4;
      this.life = 1.0;
      this.decay = Math.random() * 0.015 + 0.008;
    }

    const colors = ['#ff758f', '#ff4d6d', '#ffb3c1', '#ffd166', '#c77dff', '#ffffff'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.isHeart = Math.random() > 0.4;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.size *= 0.97;
    this.life -= this.decay;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(this.life, 0);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.color;

    if (this.isHeart) {
      // Draw cute mini heart shape
      const s = Math.max(this.size, 0.1);
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.bezierCurveTo(this.x - s / 2, this.y - s / 2, this.x - s, this.y + s / 3, this.x, this.y + s);
      ctx.bezierCurveTo(this.x + s, this.y + s / 3, this.x + s / 2, this.y - s / 2, this.x, this.y);
      ctx.fill();
    } else {
      // Draw soft star sparkle
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(this.size / 2, 0.1), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

function renderCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (isOpened) {
    // Continuously float soft gentle sparkles from bottom
    for (let i = 0; i < 2; i++) {
      const px = canvas.width / 2 + (Math.random() * 280 - 140);
      const py = canvas.height * 0.7 + (Math.random() * 60 - 30);
      particles.push(new HeartSparkleParticle(px, py, false));
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw();
    if (p.life <= 0 || p.size <= 0.5) {
      particles.splice(i, 1);
    }
  }

  animationFrameId = requestAnimationFrame(renderCanvas);
}

// Burst Cute Love & Cat Emojis
function triggerLoveEmojiBurst() {
  const count = 42;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'love-emoji-burst';
    
    el.textContent = LOVE_EMOJIS[Math.floor(Math.random() * LOVE_EMOJIS.length)];

    const angle = (Math.PI * 2 / count) * i + (Math.random() * 0.4 - 0.2);
    const dist = Math.random() * 240 + 100;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist - 80;
    const rot = Math.random() * 360 - 180;

    el.style.left = `${centerX}px`;
    el.style.top = `${centerY}px`;
    el.style.setProperty('--tx', `${tx}px`);
    el.style.setProperty('--ty', `${ty}px`);
    el.style.setProperty('--rot', `${rot}deg`);
    el.style.animationDelay = `${Math.random() * 0.15}s`;

    emojiOverlay.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }
}

// Open Envelope
function handleEnvelopeClick() {
  if (isOpened) return;
  isOpened = true;

  getAudioContext();

  // 1. Fold open envelope flap
  envelope.classList.add('opened');

  // 2. Sweet photo reveals & chime sound plays
  setTimeout(() => {
    playMagicalChime();

    // Soft pink flash
    flashEffect.classList.add('active');
    setTimeout(() => flashEffect.classList.remove('active'), 350);

    // Sweet card zooms in
    envelope.classList.add('sweet-mode');

    // Hide intro header
    introHeader.classList.add('hidden-state');

    // Sparkle burst
    for (let i = 0; i < 70; i++) {
      particles.push(new HeartSparkleParticle(canvas.width / 2, canvas.height / 2, true));
    }

    // Burst cute love and cat emojis
    triggerLoveEmojiBurst();

    // Continuous floating cute cat & heart bubbles
    const interval = setInterval(() => {
      if (!isOpened) {
        clearInterval(interval);
        return;
      }
      spawnSingleFloatingEmoji();
    }, 380);

    // Show replay button
    setTimeout(() => {
      replayZone.classList.add('active');
    }, 700);

  }, 600);
}

function spawnSingleFloatingEmoji() {
  const el = document.createElement('div');
  el.className = 'love-emoji-burst';
  el.textContent = LOVE_EMOJIS[Math.floor(Math.random() * LOVE_EMOJIS.length)];

  const startX = Math.random() * window.innerWidth;
  const startY = window.innerHeight * 0.8 + Math.random() * 80;
  const tx = (Math.random() - 0.5) * 140;
  const ty = -(Math.random() * 300 + 160);
  const rot = Math.random() * 240 - 120;

  el.style.left = `${startX}px`;
  el.style.top = `${startY}px`;
  el.style.setProperty('--tx', `${tx}px`);
  el.style.setProperty('--ty', `${ty}px`);
  el.style.setProperty('--rot', `${rot}deg`);

  emojiOverlay.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

function resetEnvelope() {
  isOpened = false;
  envelope.classList.remove('opened', 'sweet-mode');
  introHeader.classList.remove('hidden-state');
  replayZone.classList.remove('active');
  particles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Bind Events
envelopeBox.addEventListener('click', handleEnvelopeClick);
btnReset.addEventListener('click', (e) => {
  e.stopPropagation();
  resetEnvelope();
});

// Run particle loop
renderCanvas();
