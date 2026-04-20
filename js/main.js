import { Lander } from './lander.js';
import { Terrain } from './terrain.js';
import { UIManager } from './ui.js';
import { Starfield } from './stars.js';
import { Asteroid } from './asteroid.js';

// --- Initialization ---
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 400;

const player = new Lander(canvas.width);
const moon = new Terrain(canvas.width, canvas.height);
const ui = new UIManager(canvas.width, canvas.height);
const stars = new Starfield(canvas.width, canvas.height);
const hazard = new Asteroid(canvas.width, canvas.height);

const keys = {};
let gameState = "INTRO"; // INTRO, FLYING, LANDED, CRASHED

let score = 0


// --- Input Handling ---
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// --- Core Game Logic ---

function checkCollision() {
    // 1. ASTEROID COLLISION (Circle-based)
    if (hazard.active) {
        const dist = Math.hypot(player.x - hazard.x, player.y - hazard.y);
        if (dist < hazard.size + 8) {
            gameState = "CRASHED";
            return;
        }
    }

    // 2. TERRAIN COLLISION (Line-based)
    const segmentWidth = canvas.width / (moon.points.length - 1);
    const index = Math.floor(player.x / segmentWidth);
    
    // Bounds check
    if (index < 0 || index >= moon.points.length - 1) {
        gameState = "CRASHED";
        return;
    }

    const p1 = moon.points[index];
    const p2 = moon.points[index + 1];

    // Linear Interpolation: Find height of jagged ground at player's X
    const t = (player.x - p1.x) / (p2.x - p1.x);
    const terrainY = p1.y + t * (p2.y - p1.y);

    // Collision check (lander height offset is 8 for the legs)
    if (player.y >= terrainY - 8) {
        const isOnPad = p1.isPad && p2.isPad;
        const isSlow = player.vy < 0.5;
        const isUpright = Math.abs(player.angle + Math.PI / 2) < 0.2;

        // Snap to surface
        player.y = terrainY - 8;
        player.vx = 0;
        player.vy = 0;

        if (isOnPad && isSlow && isUpright) {
            score += 500;// + Math.floor(player.fuel);
            gameState = "LANDED";
        } else {
            gameState = "CRASHED";
        }
    }
}

function resetGame() {
    gameState = "FLYING";
    player.reset(canvas.width);
    moon.generate(canvas.width, canvas.height);
    hazard.reset();
}

// --- Main Loop ---

function loop() {
    // 1. Phosphor Persistence Blur
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameState === "INTRO") {
        stars.draw(ctx);
        moon.draw(ctx);
        ui.drawIntro(ctx);
        if (keys[' ']) resetGame();
    } 

    else if (gameState === "FLYING") {
        // Update
        player.update(keys[' '], keys['ArrowLeft'], keys['ArrowRight']);
        hazard.update();
        checkCollision();

        // Draw
        stars.draw(ctx);
        moon.draw(ctx);
        hazard.draw(ctx);
        player.draw(ctx);
        ui.drawHUD(ctx, player, score);
    } 

    else {
        // LANDED or CRASHED
        stars.draw(ctx);
        moon.draw(ctx);
        hazard.draw(ctx);
        player.draw(ctx);
        ui.drawResult(ctx, gameState, score);

        if (keys['r'] || keys['R']) resetGame();
    }

    requestAnimationFrame(loop);
}

// Start Engine
loop();

