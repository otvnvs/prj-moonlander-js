export class InputHandler {
    constructor() {
        this.keys = {};
        this.touch = { left: false, right: false, thrust: false };

        // Keyboard Listeners
        window.addEventListener('keydown', e => this.keys[e.key] = true);
        window.addEventListener('keyup', e => this.keys[e.key] = false);

        // Mobile Touch Listeners
        window.addEventListener('touchstart', e => this.handleTouch(e, true), { passive: false });
        window.addEventListener('touchend', e => this.handleTouch(e, false), { passive: false });
    }

    handleTouch(e, isPressed) {
        // Prevent scrolling while playing
        if (e.cancelable) e.preventDefault();

        const touches = e.touches;
        // Reset touch states
        this.touch.left = false;
        this.touch.right = false;
        this.touch.thrust = false;

        if (isPressed) {
            for (let i = 0; i < touches.length; i++) {
                const tx = touches[i].pageX;
                const ty = touches[i].pageY;
                const width = window.innerWidth;
                const height = window.innerHeight;

                // Split screen into interaction zones
                if (ty > height * 0.7) {
                    this.touch.thrust = true; // Bottom 30% is thrust
                } else if (tx < width / 2) {
                    this.touch.left = true;   // Top-Left is rotate CCW
                } else {
                    this.touch.right = true;  // Top-Right is rotate CW
                }
            }
        }
    }

    isThrusting() {
        return this.keys[' '] || this.keys['ArrowUp'] || this.touch.thrust;
    }

    isRotatingLeft() {
        return this.keys['ArrowLeft'] || this.touch.left;
    }

    isRotatingRight() {
        return this.keys['ArrowRight'] || this.touch.right;
    }

    isResetting() {
        return this.keys['r'] || this.keys['R'];
    }
}

