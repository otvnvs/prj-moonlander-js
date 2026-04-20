export class UIManager {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.pGreen = "#00ff41";
    }

    drawIntro(ctx) {
        this.drawOverlay(ctx);
        ctx.fillStyle = this.pGreen;
        ctx.textAlign = "center";

        ctx.font = "bold 28px monospace";
        ctx.fillText("MOON LANDER", this.width / 2, this.height / 2 - 60);

        ctx.font = "14px monospace";
        ctx.fillText("[SPACE]  - MAIN THRUSTERS", this.width / 2, this.height / 2 - 10);
        ctx.fillText("[ARROWS] - ATTITUDE CONTROL", this.width / 2, this.height / 2 + 15);
        ctx.fillText("[R]      - RESET SYSTEM", this.width / 2, this.height / 2 + 40);

        ctx.font = "bold 16px monospace";
        ctx.fillText("PRESS [SPACE] TO BEGIN", this.width / 2, this.height / 2 + 90);
    }

    drawHUD(ctx, lander, score) {
        const isTooFast = lander.vy >= 0.5;
        ctx.textAlign = "left";
        ctx.font = "14px monospace";
        ctx.fillStyle = this.pGreen;

        // Display Score at top right
        ctx.textAlign = "right";
        ctx.fillText(`TOTAL SCORE: ${score}`, this.width - 20, 30);

        // Standard HUD (Fuel/Velocity)
        ctx.textAlign = "left";
        ctx.fillText(`FUEL: ${Math.max(0, lander.fuel.toFixed(0))}`, 20, 30);
        
        ctx.fillStyle = isTooFast ? this.pRed : this.pGreen;
        ctx.fillText(`V-SPEED: ${lander.vy.toFixed(2)}`, 20, 50);
    }

    drawResult(ctx, state, score) {
        this.drawOverlay(ctx);
        ctx.textAlign = "center";
        
        if (state === "LANDED") {
            ctx.fillStyle = this.pGreen;
            ctx.font = "bold 30px monospace";
            ctx.fillText("SUCCESSFUL LANDING", this.width / 2, this.height / 2 - 20);
            ctx.font = "20px monospace";
            ctx.fillText(`MISSION SCORE: ${score}`, this.width / 2, this.height / 2 + 20);
        } else {
            ctx.fillStyle = this.pRed;
            ctx.font = "bold 30px monospace";
            ctx.fillText("CRITICAL FAILURE", this.width / 2, this.height / 2);
        }
        
        ctx.fillStyle = this.pGreen;
        ctx.font = "14px monospace";
        ctx.fillText("PRESS [R] TO REBOOT", this.width / 2, this.height / 2 + 60);
    }

    drawOverlay(ctx) {
        // Subtle scanline dimming
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, this.width, this.height);
    }
}

