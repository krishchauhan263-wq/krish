/* =========================
   DOM ELEMENTS
========================= */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startScreen = document.getElementById('start-screen');
const proposalScreen = document.getElementById('proposal-screen');
const celebrationScreen = document.getElementById('celebration-screen');
const promiseScreen = document.getElementById('promise-screen');

const startBtn = document.getElementById('start-btn');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

const loveMeter = document.getElementById('love-fill');
const promiseBtn = document.getElementById('promise-btn');

/* =========================
   GAME STATE
========================= */
let gameState = 'START'; // START, PLAYING, PROPOSAL
let score = 0;
const WIN_SCORE = 15;

let player;
let hearts = [];
let particles = [];
let animationId;

/* =========================
   RESIZE HANDLING
========================= */
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (player) player.y = canvas.height - 100;
}
window.addEventListener('resize', resize);

/* =========================
   PLAYER OBJECT
========================= */
class Player {
    constructor() {
        this.w = 100;
        this.h = 80;
        this.x = canvas.width / 2 - this.w / 2;
        this.y = canvas.height - 100;
        this.dx = 0;
    }

    update() {
        this.x += this.dx;
        if (this.x < 0) this.x = 0;
        if (this.x + this.w > canvas.width) {
            this.x = canvas.width - this.w;
        }
    }

    draw() {
        ctx.fillStyle = '#ff4d6d';
        ctx.beginPath();
        ctx.arc(this.x + this.w / 2, this.y, this.w / 2, 0, Math.PI);
        ctx.fill();
    }
}

/* =========================
   HEART OBJECT
========================= */
class Heart {
    constructor() {
        this.size = Math.random() * 20 + 20;
        this.x = Math.random() * (canvas.width - this.size);
        this.y = -this.size;
        this.speed = Math.random() * 3 + 2;
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        ctx.fillStyle = '#ff4d6d';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

/* =========================
   PARTICLE EFFECT
========================= */
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.dx = (Math.random() - 0.5) * 4;
        this.dy = (Math.random() - 0.5) * 4;
        this.life = 100;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.life -= 2;
    }

    draw() {
        ctx.globalAlpha = this.life / 100;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

/* =========================
   INPUT HANDLING
========================= */
window.addEventListener('mousemove', e => {
    if (player) {
        player.x = e.clientX - player.w / 2;
    }
});

/* =========================
   GAME FUNCTIONS
========================= */
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'PLAYING') {
        player.update();
        player.draw();

        if (Math.random() < 0.025) {
            hearts.push(new Heart());
        }

        hearts.forEach((heart, index) => {
            heart.update();
            heart.draw();

            if (
                heart.y + heart.size > player.y &&
                heart.x > player.x &&
                heart.x < player.x + player.w
            ) {
                hearts.splice(index, 1);
                score++;
                createParticles(heart.x, heart.y);
                updateScore();

                if (score >= WIN_SCORE) {
                    triggerProposal();
                }
            } else if (heart.y > canvas.height) {
                hearts.splice(index, 1);
            }
        });

        particles.forEach((p, i) => {
            p.update();
            p.draw();
            if (p.life <= 0) particles.splice(i, 1);
        });
    }

    animationId = requestAnimationFrame(updateGame);
}

function createParticles(x, y) {
    for (let i = 0; i < 5; i++) {
        particles.push(new Particle(x, y));
    }
}

function updateScore() {
    loveMeter.style.width = `${(score / WIN_SCORE) * 100}%`;
}

function triggerProposal() {
    gameState = 'PROPOSAL';
    proposalScreen.classList.remove('hidden');
}

function startGame() {
    resize();
    player = new Player();
    hearts = [];
    particles = [];
    score = 0;
    updateScore();
    gameState = 'PLAYING';

    startScreen.classList.add('hidden');
    updateGame();
}

/* =========================
   EVENT LISTENERS
========================= */
startBtn.addEventListener('click', startGame);

/* =========================
   NO BUTTON RUN
========================= */
function moveNoButton() {
    noBtn.style.position = 'fixed';
    noBtn.style.left = Math.random() * 80 + '%';
    noBtn.style.top = Math.random() * 80 + '%';
}
noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('touchstart', moveNoButton);

/* =========================
   YES BUTTON / CELEBRATION
========================= */
yesBtn.addEventListener('click', () => {
    proposalScreen.classList.add('hidden');
    celebrationScreen.classList.remove('hidden');

    const music = document.getElementById('celebration-music');
    music.volume = 0.6;
    music.play();

    const title = celebrationScreen.querySelector('h1');
    setInterval(() => {
        title.classList.remove('beat');
        void title.offsetWidth;
        title.classList.add('beat');
    }, 1000);

    confettiBurst();
    setInterval(createFloatingHearts, 600);
    typeMessage();
});

/* =========================
   TYPING EFFECT
========================= */
const messageText = `Hey Himakshi ❤️
Bas itna kehna tha ki thank you meri life ka part banne ke liye 🫶
Tumhari presence sab kuch better bana deti hai 💕
Sach mein lucky hoon jo tum meri ho 😌`;

function typeMessage() {
    const el = document.getElementById('typed-message');
    el.innerHTML = '';
    let i = 0;

    const typing = setInterval(() => {
        el.innerHTML += messageText[i];
        i++;

        if (i >= messageText.length) {
            clearInterval(typing);
            document.getElementById('final-line').style.opacity = 1;

            setTimeout(() => {
                promiseBtn.style.opacity = 1;
                promiseBtn.style.pointerEvents = 'auto';
            }, 2000);
        }
    }, 40);
}

/* =========================
   FLOATING HEARTS
========================= */
function createFloatingHearts() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerText = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 6000);
}

/* =========================
   CONFETTI
========================= */
function confettiBurst() {
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'firework';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = Math.random() * window.innerHeight + 'px';
        confetti.style.setProperty('--x', Math.random() * 200 - 100 + 'px');
        confetti.style.setProperty('--y', Math.random() * 200 - 100 + 'px');
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 1500);
    }
}

/* =========================
   PROMISE BUTTON (HOLD)
========================= */
let holdTimer;

function startHold() {
    promiseBtn.classList.add('hold');
    holdTimer = setTimeout(openPromiseScreen, 3000);
}

function cancelHold() {
    promiseBtn.classList.remove('hold');
    clearTimeout(holdTimer);
}

promiseBtn.addEventListener('mousedown', startHold);
promiseBtn.addEventListener('touchstart', startHold);
promiseBtn.addEventListener('mouseup', cancelHold);
promiseBtn.addEventListener('mouseleave', cancelHold);
promiseBtn.addEventListener('touchend', cancelHold);

/* =========================
   PROMISE SCREEN + FIREWORKS
========================= */
function openPromiseScreen() {
    celebrationScreen.classList.add('hidden');
    promiseScreen.classList.remove('hidden');
    startFireworks();
}

function startFireworks() {
    setInterval(() => {
        for (let i = 0; i < 20; i++) {
            const fw = document.createElement('div');
            fw.className = 'firework';
            fw.style.left = Math.random() * window.innerWidth + 'px';
            fw.style.top = Math.random() * window.innerHeight + 'px';
            fw.style.setProperty('--x', Math.random() * 200 - 100 + 'px');
            fw.style.setProperty('--y', Math.random() * 200 - 100 + 'px');
            document.body.appendChild(fw);

            setTimeout(() => fw.remove(), 1500);
        }
    }, 1200);
}

/* =========================
   INITIALIZE
========================= */
resize();
