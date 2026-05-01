gsap.registerPlugin(ScrollTrigger);

// --- LOADER (CYBERPUNK SCRAMBLE) ---
const termLog = document.getElementById('term-log');
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
const originalLogs = ["INITIALIZING...", "LOADING ASSETS...", "CONNECTING TO BLACK SHORES...", "SYSTEM ONLINE"];
let logIdx = 0;

// Text Scramble Effect
function scrambleText(element, finalText, callback) {
    let iterations = 0;
    const interval = setInterval(() => {
        element.innerText = finalText
            .split("")
            .map((letter, index) => {
                if (index < iterations) {
                    return finalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");

        if (iterations >= finalText.length) {
            clearInterval(interval);
            if (callback) callback();
        }
        iterations += 1 / 2; // Scramble speed
    }, 30);
}

function nextLog() {
    if (logIdx < originalLogs.length) {
        scrambleText(termLog, originalLogs[logIdx], () => {
            setTimeout(() => {
                logIdx++;
                nextLog();
            }, 400);
        });
    } else {
        // Init Complete
        const progress = document.querySelector('.feature-progress');
        progress.style.width = "100%";

        setTimeout(() => {
            gsap.to('#loader', {
                opacity: 0,
                duration: 0.8,
                onComplete: () => {
                    document.getElementById('loader').remove();
                    initSiteAnimations();
                }
            });
        }, 500);
    }
}
// Start Loader
nextLog();


// --- MAIN ANIMATIONS ---
function initSiteAnimations() {
    // 1. Hero Reveal
    const tl = gsap.timeline();
    tl.to('.hero-content', { opacity: 1, duration: 1 })
        .from('.hero-title', { y: 100, opacity: 0, duration: 1.5, ease: "power4.out" }, "-=0.5")
        .to('.arabic-subtitle', { opacity: 1, y: 0, duration: 1 }, "-=1")
        .from('.hero-btn', { scale: 0, opacity: 0, duration: 0.5, ease: "back.out(1.7)" }, "-=0.5")
        .to('nav', { opacity: 1, y: 0, duration: 0.8 }, "-=1");

    // 2. Story Section (ScrollTrigger)
    // Parallax Title
    gsap.to('.story-title-block', {
        scrollTrigger: {
            trigger: '.story-section',
            start: "top center",
            end: "bottom top",
            scrub: 1
        },
        y: -100 // Move up faster
    });

    // Cards Entrance
    gsap.from('.story-visual-block', {
        scrollTrigger: {
            trigger: '.story-section',
            start: "top 70%"
        },
        x: -100,
        opacity: 0,
        rotate: -10,
        duration: 1.5,
        ease: "power3.out"
    });

    gsap.from('.story-text-block', {
        scrollTrigger: {
            trigger: '.story-section',
            start: "top 60%"
        },
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2
    });

    // 3. Discord Black Hole Scale
    gsap.from('.discord-content', {
        scrollTrigger: {
            trigger: '.discord-section',
            start: "top center",
            toggleActions: "play reverse play reverse"
        },
        scale: 0.8,
        opacity: 0.5,
        duration: 1
    });

    // 4. Footer & Ticker Reveal
    gsap.from('.ticker-wrap', {
        scrollTrigger: {
            trigger: '.hero',
            start: "bottom center"
        },
        y: -20,
        opacity: 0,
        duration: 0.5
    });

    gsap.from('.footer-col', {
        scrollTrigger: {
            trigger: 'footer',
            start: "top 90%"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
    });
}


// --- SMOOTH SCROLL (INERTIA + SKEW) ---
// Note: Keeping manual smooth scroll for that "weighty" game feel
const content = document.getElementById('smooth-content');
let currentScroll = 0;
let targetScroll = 0;
let skew = 0;

function updateHeight() {
    document.body.style.height = content.getBoundingClientRect().height + 'px';
}
setInterval(updateHeight, 200);
window.addEventListener('resize', updateHeight);

window.addEventListener('scroll', () => {
    targetScroll = window.scrollY;
});

function animateScroll() {
    // Tighter Lerp (0.1 instead of 0.08)
    currentScroll += (targetScroll - currentScroll) * 0.1;

    // Velocity Skew
    let diff = targetScroll - currentScroll;
    skew = diff * 0.005;
    skew = Math.min(Math.max(skew, -3), 3); // Reduced clamping for subtle feel

    content.style.transform = `translateY(-${currentScroll}px) skewY(${skew}deg)`;

    // Parallax Hero BG
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        heroBg.style.transform = `scale(1.1) translateY(${currentScroll * 0.5}px)`;
    }

    requestAnimationFrame(animateScroll);
}
animateScroll();


// --- MOUSE PHYSICS & MAGNETIC BUTTONS ---
const cursor = document.getElementById('cursor');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
});

function animateCursor() {
    // Snappier Cursor (0.2)
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    if (cursor) {
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
    }
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Magnetic
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        // Stronger Magnetic Pull
        gsap.to(btn, { x: x * 0.5, y: y * 0.5, duration: 0.3 });
        cursor.classList.add('hovered');
    });
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        cursor.classList.remove('hovered');
    });
});
