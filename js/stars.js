export class Starfield {
    constructor(width, height, count = 50) {
        this.stars = [];
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * width,
                y: Math.random() * height * 0.7, // Keep stars in the upper 70% of sky
                size: Math.random() * 1.5,
                phase: Math.random() * Math.PI * 2, // Random starting point for twinkle
                speed: 0.02 + Math.random() * 0.05
            });
        }
    }

    draw(ctx) {
        ctx.fillStyle = "#00ff41";
        this.stars.forEach(s => {
            // Update phase for twinkle
            s.phase += s.speed;
            // Calculate brightness (alpha) using a Sine wave for smooth pulsing
            const opacity = 0.2 + (Math.sin(s.phase) + 1) * 0.4;
            
            ctx.globalAlpha = opacity;
            ctx.fillRect(s.x, s.y, s.size, s.size);
        });
        ctx.globalAlpha = 1.0;
    }
}

