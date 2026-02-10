const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("start-screen");
const proposalScreen = document.getElementById("proposal-screen");
const celebrationScreen = document.getElementById("celebration-screen");
const promiseScreen = document.getElementById("promise-screen");

const startBtn = document.getElementById("start-btn");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* START GAME */
startBtn.onclick = () => {
    startScreen.classList.add("hidden");
    startGame();
};

function startGame() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    setTimeout(() => {
        proposalScreen.classList.remove("hidden");
    }, 3000);
}

/* NO BUTTON RUN */
noBtn.onmouseover = () => {
    noBtn.style.position = "absolute";
    noBtn.style.left = Math.random()*80 + "%";
    noBtn.style.top = Math.random()*80 + "%";
};

/* YES BUTTON */
yesBtn.onclick = () => {
    proposalScreen.classList.add("hidden");
    celebrationScreen.classList.remove("hidden");

    const music = document.getElementById("celebration-music");
    music.volume = 0.6;
    music.play();

    const title = celebrationScreen.querySelector("h1");
    setInterval(() => {
        title.classList.remove("beat");
        void title.offsetWidth;
        title.classList.add("beat");
    }, 1000);

    confettiBurst();
    setInterval(createFloatingHearts, 600);
    typeMessage();
};

/* TYPING */
const text = `Hey Himakshi ❤️
Thank you meri life ka hissa banne ke liye 🫶
Tumhari presence sab kuch better bana deti hai 💕
I am really lucky to have you 😌`;

function typeMessage() {
    const el = document.getElementById("typed-message");
    el.innerHTML = "";
    let i = 0;
    const typing = setInterval(() => {
        el.innerHTML += text[i];
        i++;
        if (i >= text.length) {
            clearInterval(typing);
            document.getElementById("final-line").style.opacity = 1;
            setTimeout(showPromiseBtn, 2000);
        }
    }, 40);
}

function showPromiseBtn() {
    const btn = document.getElementById("promise-btn");
    btn.style.opacity = 1;
    btn.style.pointerEvents = "auto";
}

/* LONG PRESS */
let holdTimer;
const promiseBtn = document.getElementById("promise-btn");

promiseBtn.onmousedown = startHold;
promiseBtn.ontouchstart = startHold;
promiseBtn.onmouseup = cancelHold;
promiseBtn.ontouchend = cancelHold;

function startHold() {
    promiseBtn.classList.add("hold");
    holdTimer = setTimeout(openPromiseScreen, 3000);
}

function cancelHold() {
    promiseBtn.classList.remove("hold");
    clearTimeout(holdTimer);
}

function openPromiseScreen() {
    celebrationScreen.classList.add("hidden");
    promiseScreen.classList.remove("hidden");
    startFireworks();
}

/* EFFECTS */
function createFloatingHearts() {
    const h = document.createElement("div");
    h.className = "heart";
    h.innerText = "❤️";
    h.style.left = Math.random()*100 + "vw";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 6000);
}

function confettiBurst() {
    for (let i = 0; i < 30; i++) {
        createFirework();
    }
}

function startFireworks() {
    setInterval(createFirework, 800);
}

function createFirework() {
    for (let i = 0; i < 20; i++) {
        const f = document.createElement("div");
        f.className = "firework";
        f.style.left = Math.random()*window.innerWidth + "px";
        f.style.top = Math.random()*window.innerHeight + "px";
        f.style.setProperty("--x", Math.random()*200-100 + "px");
        f.style.setProperty("--y", Math.random()*200-100 + "px");
        document.body.appendChild(f);
        setTimeout(() => f.remove(), 1500);
    }
}
