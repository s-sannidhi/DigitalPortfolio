// AOS
AOS.init({ duration: 800, offset: 100, once: true });

// Typed.js
new Typed('#typed', {
    strings: ['Developer', 'Creator', 'Innovator'],
    typeSpeed: 50,
    backSpeed: 30,
    loop: true,
    backDelay: 2000
});

// Particles.js — reads CSS variable set by theme.js if loaded first, else falls back to default
const accentHex = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c4a574';
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: accentHex },
        shape: { type: 'circle' },
        opacity: {
            value: 0.5,
            random: true,
            anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
        },
        size: {
            value: 3,
            random: true,
            anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: accentHex,
            opacity: 0.3,
            width: 1.5
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: { enable: true, rotateX: 600, rotateY: 1200 }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: 'push' },
            resize: true
        },
        modes: {
            grab: { distance: 200, line_linked: { opacity: 0.8 } },
            push: { particles_nb: 4 }
        }
    },
    retina_detect: true
});

// Scroll spy for nav dots
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navDots = document.querySelectorAll('.nav-dot a');
    let current = '';
    sections.forEach(section => {
        if (pageYOffset >= section.offsetTop - 60) current = section.getAttribute('id');
    });
    navDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-section') === current) dot.classList.add('active');
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

// Section visibility observer (fade-in on scroll)
const sectionObserver = new IntersectionObserver(
    (entries) => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }),
    { root: null, threshold: 0.1, rootMargin: '0px' }
);
document.querySelectorAll('section').forEach(section => sectionObserver.observe(section));

// Reveal animation
function reveal() {
    document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 150) el.classList.add('active');
    });
}
window.addEventListener('scroll', reveal);
