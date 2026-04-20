# prj-neon-lander

A modular, physics-based Lunar Lander simulation built with vanilla JavaScript and HTML5 Canvas.

**[Launch Mission (Live Demo)](https://otvnvs.github.io/prj-moonlander-js/)**

## Architecture: ES6 Modules
Unlike standard single-file scripts, this project is built using a **modular architecture** to demonstrate clean code organization and scalability:

- **`main.js`**: The central engine that coordinates the game loop and state transitions.
- **`lander.js`**: Handles Newtonian physics, rotational inertia, and particle-based thruster exhaust.
- **`terrain.js`**: Uses procedural generation to create unique, jagged lunar landscapes with designated landing zones.
- **`ui.js`**: Manages the phosphor-style vector interface, HUD, and mission result screens.
- **`stars.js` & `asteroid.js`**: Independent modules for environmental hazards and atmospheric twinkling effects.

## Mission Objectives
- **Soft Landing:** You must touch down on the flashing pad at a vertical velocity of less than 0.5 units.
- **Attitude Control:** Ensure your craft is upright (within 0.2 radians) or risk structural collapse.
- **Fuel Management:** Points are awarded based on your remaining fuel. Efficiency is key.
- **Hazard Avoidance:** Watch the upper atmosphere for incoming meteorites.

## Technical Highlights
- **Linear Interpolation (Lerp):** Used to calculate precise terrain height for pixel-perfect collision detection.
- **Phosphor Persistence:** Implemented a custom frame-buffer clearing method to simulate the glowing "ghosting" effect of vintage CRT monitors.
- **State Machine:** Logic-driven transitions between `INTRO`, `FLYING`, `LANDED`, and `CRASHED` states.
- **Responsive Controls:** Unified keyboard and touch-input handling for cross-device play.

## Deployment
1. Clone the repository:
   ```bash
   git clone https://github.com
   ```
