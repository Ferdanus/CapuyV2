// ONLY goofy emojis allowed for particle effects
const GOOFY_EMOJIS = ['🔥', '💥', '💀', '😼', '😹', '😾', '🙀', '💨', '⚡', '🧨', '👀'];

// DOM elements
const envelopeBox = document.getElementById('envelopeBox');
const envelope = document.getElementById('envelope');
const introHeader = document.getElementById('introHeader');
const flashEffect = document.getElementById('flashEffect');
const emojiOverlay = document.getElementById('emojiOverlay');
const replayZone = document.getElementById('replayZone');
const btnReset = document.getElementById('btnReset');
const canvas = document.getElementById('fireCanvas');
const ctx = canvas.getContext('2d');

let isOpened = false;
let animationFrameId = null;
let fireParticles = [];
let audioCtx = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Web Audio API Sound Synthesizer
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

// Simple & Punchy Meme Boom Sound (Vine Boom style)
function playSoundEffect() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 1. Deep Bass Boom
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.6);

    gain.gain.setValueAtTime(2.0, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.85);

    // 2. Punchy Noise Thud Layer
    const bufferSize = Math.floor(ctx.sampleRate * 0.25);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.linearRampToValueAtTime(80, now + 0.25);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(1.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);
  } catch (e) {
    console.error(e);
  }
}

// Fire & Ember Particles Class
class CuteFireParticle {
  constructor(x, y, isExplosion = false) {
    this.x = x || (canvas.width / 2 + (Math.random() * 220 - 110));
    this.y = y || (canvas.height / 2 + (Math.random() * 100 - 50));
    
    if (isExplosion) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 14 + 5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.size = Math.random() * 20 + 8;
      this.life = 1.0;
      this.decay = Math.random() * 0.03 + 0.015;
    } else {
      this.vx = (Math.random() - 0.5) * 3;
      this.vy = -(Math.random() * 5 + 3);
      this.size = Math.random() * 14 + 6;
      this.life = 1.0;
      this.decay = Math.random() * 0.02 + 0.012;
    }

    const colors = ['#ff0054', '#ff5400', '#ffbd00', '#ff007f', '#ffffff'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.size *= 0.95;
    this.life -= this.decay;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(this.life, 0);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 18;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(this.size, 0.1), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function renderParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (isOpened) {
    // Continuously generate bright flame particles
    for (let i = 0; i < 3; i++) {
      const px = canvas.width / 2 + (Math.random() * 260 - 130);
      const py = canvas.height * 0.65 + (Math.random() * 80 - 40);
      fireParticles.push(new CuteFireParticle(px, py, false));
    }
  }

  for (let i = fireParticles.length - 1; i >= 0; i--) {
    const p = fireParticles[i];
    p.update();
    p.draw();
    if (p.life <= 0 || p.size <= 0.5) {
      fireParticles.splice(i, 1);
    }
  }

  animationFrameId = requestAnimationFrame(renderParticles);
}

// Burst Goofy Emojis
function triggerEmojiExplosion() {
  const count = 38;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'goofy-emoji-burst';
    
    el.textContent = GOOFY_EMOJIS[Math.floor(Math.random() * GOOFY_EMOJIS.length)];

    const angle = (Math.PI * 2 / count) * i + (Math.random() * 0.4 - 0.2);
    const dist = Math.random() * 240 + 110;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist - 70;
    const rot = Math.random() * 720 - 360;

    el.style.left = `${centerX}px`;
    el.style.top = `${centerY}px`;
    el.style.setProperty('--tx', `${tx}px`);
    el.style.setProperty('--ty', `${ty}px`);
    el.style.setProperty('--rot', `${rot}deg`);
    el.style.animationDelay = `${Math.random() * 0.12}s`;

    emojiOverlay.appendChild(el);
    setTimeout(() => el.remove(), 2400);
  }
}

// Open Envelope Trigger
function handleEnvelopeClick() {
  if (isOpened) return;
  isOpened = true;

  getAudioContext();

  // 1. Fold open envelope flap
  envelope.classList.add('opened');

  // 2. Explode prank photo & play sound
  setTimeout(() => {
    playSoundEffect();

    // Smooth shake body
    document.body.classList.add('shake-screen');
    setTimeout(() => document.body.classList.remove('shake-screen'), 3000);

    // Screen flash
    flashEffect.classList.add('active');
    setTimeout(() => flashEffect.classList.remove('active'), 200);

    // Prank card zooms in
    envelope.classList.add('prank-mode');

    // Hide initial cute title
    introHeader.classList.add('hidden-state');

    // Fire blast
    for (let i = 0; i < 90; i++) {
      fireParticles.push(new CuteFireParticle(canvas.width / 2, canvas.height / 2, true));
    }

    // Burst goofy emojis
    triggerEmojiExplosion();

    // Ongoing funny emoji bubbles
    const interval = setInterval(() => {
      if (!isOpened) {
        clearInterval(interval);
        return;
      }
      spawnSingleFloatingEmoji();
    }, 320);

    // Show replay button
    setTimeout(() => {
      replayZone.classList.add('active');
    }, 700);

  }, 600);
}

function spawnSingleFloatingEmoji() {
  const el = document.createElement('div');
  el.className = 'goofy-emoji-burst';
  el.textContent = GOOFY_EMOJIS[Math.floor(Math.random() * GOOFY_EMOJIS.length)];

  const startX = Math.random() * window.innerWidth;
  const startY = window.innerHeight * 0.75 + Math.random() * 80;
  const tx = (Math.random() - 0.5) * 160;
  const ty = -(Math.random() * 320 + 160);
  const rot = Math.random() * 360 - 180;

  el.style.left = `${startX}px`;
  el.style.top = `${startY}px`;
  el.style.setProperty('--tx', `${tx}px`);
  el.style.setProperty('--ty', `${ty}px`);
  el.style.setProperty('--rot', `${rot}deg`);

  emojiOverlay.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

function resetEnvelope() {
  isOpened = false;
  envelope.classList.remove('opened', 'prank-mode');
  introHeader.classList.remove('hidden-state');
  replayZone.classList.remove('active');
  fireParticles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Bind Events
envelopeBox.addEventListener('click', handleEnvelopeClick);
btnReset.addEventListener('click', (e) => {
  e.stopPropagation();
  resetEnvelope();
});

// Run particle render loop
renderParticles();
