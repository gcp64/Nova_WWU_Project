const canvas = document.getElementById('fx-canvas');
const ctx = canvas.getContext('2d');
let width, height;

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ==========================================
// 1. DIGITAL RAIN / TACET SNOW
// ==========================================
// Upward floating digital particles, like dust in a Tacet Field
const particles = [];
const particleCount = 100;

class TacetParticle {
    constructor() {
        this.reset();
        this.y = Math.random() * height; // Start anywhere
    }
    reset() {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.speed = Math.random() * 2 + 0.5;
        this.size = Math.random() * 2;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.8 ? '#BD00FF' : '#00F0FF';
    }
    update() {
        this.y -= this.speed;
        if (this.y < -10) this.reset();
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size * 3); // Rectangular "data" bits
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) particles.push(new TacetParticle());

// ==========================================
// 2. BLACK HOLE PARTICLE SYSTEM (Discord Section)
// ==========================================
let bhBtn = document.querySelector('.join-btn');
let bhParticles = [];

class BHParticle {
    constructor() {
        this.reset();
    }
    reset() {
        const angle = Math.random() * Math.PI * 2;
        const dist = 200 + Math.random() * 500;
        this.x = width / 2 + Math.cos(angle) * dist;
        this.y = height / 2 + Math.sin(angle) * dist;
        this.vx = 0;
        this.vy = 0;
        this.size = Math.random() * 3 + 0.5;
        this.color = Math.random() > 0.5 ? '#5865F2' : '#bd00ff';
        this.friction = 0.92;
    }
    update(targetX, targetY) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const angle = Math.atan2(dy, dx);
        const force = 1000 / (dist + 50); // Stronger Attraction

        this.vx += Math.cos(angle) * force * 0.8;
        this.vy += Math.sin(angle) * force * 0.8;

        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;

        if (dist < 30) this.reset(); // Suck in
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.6 + Math.random() * 0.4; // Twinkle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < 200; i++) bhParticles.push(new BHParticle());

function drawBlackHole() {
    const discordSec = document.getElementById('discord');
    if (!discordSec) return;
    const rect = discordSec.getBoundingClientRect();

    // Check if near viewport
    if (rect.top < height && rect.bottom > 0) {
        // Attempt to find button position
        if (!bhBtn) bhBtn = document.querySelector('.join-btn');
        if (bhBtn) {
            const btnRect = bhBtn.getBoundingClientRect();
            const targetX = btnRect.left + btnRect.width / 2;
            const targetY = btnRect.top + btnRect.height / 2;

            bhParticles.forEach(p => {
                p.update(targetX, targetY);
                p.draw();
            });

            // Draw connecting lines for "Network" feel
            ctx.strokeStyle = 'rgba(88, 101, 242, 0.05)';
            ctx.beginPath();
            bhParticles.forEach((p, i) => {
                if (i % 10 === 0) { // Only some connect
                    ctx.lineTo(p.x, p.y);
                }
            });
            ctx.stroke();
        }
    }
}



// ==========================================
// 3. SIMULATED AUDIO VISUALIZER (Decor)
// ==========================================
function drawVisualizer() {
    const bars = 50;
    const barWidth = width / bars;

    ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';

    for (let i = 0; i < bars; i++) {
        // Simulated frequency data
        const time = Date.now() * 0.002;
        const heightFactor = Math.abs(Math.sin(time + i * 0.2) + Math.cos(time * 0.5 + i * 0.1)) * 0.5;
        const barHeight = heightFactor * 100;

        const x = i * barWidth;
        const y = height - barHeight;

        ctx.fillRect(x, y, barWidth - 2, barHeight);

        // Reflection
        ctx.fillStyle = 'rgba(0, 240, 255, 0.03)';
        ctx.fillRect(x, height, barWidth - 2, barHeight * 0.5);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.1)'; // Reset
    }
}


// ==========================================
// MAIN LOOP
// ==========================================
function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw Tacet Rain
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw "Scanline"
    ctx.fillStyle = 'rgba(0, 240, 255, 0.02)';
    ctx.fillRect(0, (Date.now() / 5) % height, width, 2);

    // Draw Visualizer
    drawVisualizer();

    // Draw Black Hole ONLY when visible
    drawBlackHole();

    requestAnimationFrame(animate);
}
animate();
