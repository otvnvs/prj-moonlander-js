export class Lander {
    constructor(canvasWidth) {
        this.particles = [];
        this.reset(canvasWidth);
    }

    reset(canvasWidth) {
        this.x = canvasWidth / 2;
        this.y = 50;
        this.vx = 0;
        this.vy = 0;
        this.angle = -Math.PI / 2;
        this.fuel = 1000;
        this.gravity = 0.015;
        this.particles = [];
    }

    thrust() {
        if (this.fuel <= 0) return;
        
        // Newtonian thrust
        this.vx += Math.cos(this.angle) * 0.05;
        this.vy += Math.sin(this.angle) * 0.05;
        this.fuel -= 2;

        // Create 2 particles per frame of thrust
        for(let i=0; i<2; i++) {
            this.particles.push({
                x: this.x - Math.cos(this.angle) * 10,
                y: this.y - Math.sin(this.angle) * 10,
                vx: (Math.random() - 0.5) * 0.5 - Math.cos(this.angle) * 2,
                vy: (Math.random() - 0.5) * 0.5 - Math.sin(this.angle) * 2,
                life: 1.0 // Alpha value
            });
        }
    }

    update(isThrusting, isRotatingLeft, isRotatingRight) {
        if (isThrusting) this.thrust();
        if (this.fuel > 0) {
            if (isRotatingLeft) this.angle -= 0.05;
            if (isRotatingRight) this.angle += 0.05;
        }

        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;

        // Update and fade particles
        this.particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
            if (p.life <= 0) this.particles.splice(i, 1);
        });
    }

draw(ctx) {
    // 1. Draw Particles (unchanged)
    ctx.fillStyle = "#00ff41";
    this.particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillRect(p.x, p.y, 2, 2);
    });
    ctx.globalAlpha = 1.0;

    // 2. Draw Ship
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI/2); // Offset for vertical orientation
    ctx.strokeStyle = "#00ff41";
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    // --- Ascent Stage (The Cabin) ---
    ctx.rect(-5, -12, 10, 8); 

    // --- Descent Stage (The Main Body) ---
    ctx.moveTo(-7, -4);
    ctx.lineTo(7, -4);
    ctx.lineTo(9, 2);
    ctx.lineTo(-9, 2);
    ctx.closePath();

    // --- Landing Gear (Legs) ---
    // Left Leg
    ctx.moveTo(-7, 2);  ctx.lineTo(-12, 8); 
    ctx.moveTo(-14, 8); ctx.lineTo(-10, 8); // Foot pad
    
    // Right Leg
    ctx.moveTo(7, 2);   ctx.lineTo(12, 8);
    ctx.moveTo(10, 8);  ctx.lineTo(14, 8);  // Foot pad

    ctx.stroke();
    ctx.restore();
}


}

