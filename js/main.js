import { Lander } from './lander.js';
import { Terrain } from './terrain.js';
import { UIManager } from './ui.js';
import { Starfield } from './stars.js';
import { Asteroid } from './asteroid.js';
import { InputHandler } from './input.js';

// --- Initialization ---
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Standard PDP-11 Aspect Ratio
canvas.width = 600;
canvas.height = 400;

const player = new Lander(canvas.width);
const moon = new Terrain(canvas.width, canvas.height);
const ui = new UIManager(canvas.width, canvas.height);
const stars = new Starfield(canvas.width, canvas.height);
const hazard = new Asteroid(canvas.width, canvas.height);
const input = new InputHandler();

let gameState = "INTRO"; // INTRO, FLYING, LANDED, CRASHED
let score = 0;

// --- Core Game Logic ---

function checkCollision() {
    // 1. ASTEROID COLLISION
    if (hazard.active) {
        const dist = Math.hypot(player.x - hazard.x, player.y - hazard.y);
        if (dist < hazard.size + 8) {
            gameState = "CRASHED";
            return;
        }
    }

    // 2. TERRAIN COLLISION
    const segmentWidth = canvas.width / (moon.points.length - 1);
    const index = Math.floor(player.x / segmentWidth);
    
    // Bounds check
    if (index < 0 || index >= moon.points.length - 1) {
        gameState = "CRASHED";
        return;
    }

    const p1 = moon.points[index];
    const p2 = moon.points[index + 1];

    // Find height of jagged ground at player's X
    const t = (player.x - p1.x) / (p2.x - p1.x);
    const terrainY = p1.y + t * (p2.y - p1.y);

    // Collision check (8px offset for the landing legs)
    if (player.y >= terrainY - 8) {
        // Capture conditions BEFORE snapping velocity to 0
        const isOnPad = p1.isPad && p2.isPad;
        const isSlow = player.vy < 0.5;
        const isUpright = Math.abs(player.angle + Math.PI / 2) < 0.2;

        // Snap to surface & stop movement
        player.y = terrainY - 8;
        player.vx = 0;
        player.vy = 0;

        if (isOnPad && isSlow && isUpright) {
            gameState = "LANDED";
            // Calculate Score: Bonus + remaining fuel
            score += 500 + Math.floor(player.fuel);
        } else {
            gameState = "CRASHED";
        }
    }
}

function resetMission() {
    gameState = "FLYING";
    player.reset(canvas.width);
    moon.generate(canvas.width, canvas.height);
    hazard.reset();
}

// --- Main Loop ---

function loop() {
    // 1. Phosphor Persistence Effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameState === "INTRO") {
        stars.draw(ctx);
        moon.draw(ctx);
        ui.drawIntro(ctx);
        if (input.isThrusting()) resetMission();
    } 

    else if (gameState === "FLYING") {
        // Update via Input Module
        player.update(
            input.isThrusting(), 
            input.isRotatingLeft(), 
            input.isRotatingRight()
        );
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
        // Results (LANDED or CRASHED)
        stars.draw(ctx);
        moon.draw(ctx);
        hazard.draw(ctx);
        player.draw(ctx);
        ui.drawResult(ctx, gameState, score);

        if (input.isResetting()) {
            // Reset score if they crashed, or keep it if they landed
            if (gameState === "CRASHED") score = 0; 
            resetMission();
        }
    }

    requestAnimationFrame(loop);
}

// Ignition
loop();

