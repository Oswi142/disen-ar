/* =========================
   HERO CAROUSEL
========================= */

let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');
const slideInterval = 7000;
let autoSlideInterval = null;
let isHovering = false;

function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, slideInterval);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

function showSlide(index) {
    if (!slides.length) return;

    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    const slide = slides[index];
    const indicator = indicators[index];

    if (slide) {
        slide.classList.add('active');
    }
    if (indicator) {
        indicator.classList.add('active');
    }
}

function nextSlide() {
    if (!slides.length) return;
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function goToSlide(index) {
    if (!slides.length) return;
    currentSlide = index;
    showSlide(currentSlide);
    
    // Reset timer on manual interaction
    stopAutoSlide();
    if (!isHovering) {
        startAutoSlide();
    }
}

// Initialize
if (slides.length > 1) {
    startAutoSlide();
}

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
});

/* Pause carousel on hover */
const hero = document.querySelector('.hero');
if (hero && slides.length > 1) {
    hero.addEventListener('mouseenter', () => {
        isHovering = true;
        stopAutoSlide();
    });
    hero.addEventListener('mouseleave', () => {
        isHovering = false;
        startAutoSlide();
    });
}

/* =========================
   HAMBURGER MENU
========================= */

let isMenuOpen = false; // Track menu state

function initializeHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update menu state
            isMenuOpen = hamburger.classList.contains('active');

            // Always show navbar when opening menu
            const navbar = document.querySelector('.navbar');
            if (navbar && isMenuOpen) {
                navbar.classList.remove('nav-hidden');
            }
        });
    }
}

function bindNavLinkScroll() {
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.navBound === 'true') {
            return;
        }
        link.dataset.navBound = 'true';
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

function initializeNavInteractions() {
    initializeHamburgerMenu();
    bindNavLinkScroll();
}

// Initialize nav interactions when navbar is injected
document.addEventListener('navbar:loaded', initializeNavInteractions);

/* Close menu on link click */
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            isMenuOpen = false;
        }
    }
});

/* Close menu when clicking outside */
document.addEventListener('click', (e) => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (
        hamburger &&
        navMenu &&
        !hamburger.contains(e.target) &&
        !navMenu.contains(e.target)
    ) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        isMenuOpen = false;
    }
});


/* =========================
   SMOOTH SCROLL
========================= */
/* =========================
   HERO PARALLAX EFFECT
========================= */

const allHeroContents = document.querySelectorAll('.hero-content'); // Select all
let heroSection = document.querySelector('.hero');

function updateParallax() {
    if (!allHeroContents.length || !heroSection) return;

    const scrolled = window.pageYOffset;
    const heroHeight = heroSection.offsetHeight;

    // Only apply effect while hero is visible
    if (scrolled < heroHeight) {
        const translateY = scrolled * 0.15;
        // Apply to ALL hero content elements
        allHeroContents.forEach(content => {
            content.style.transform = `translateY(${translateY}px)`;
        });
    }
}

window.addEventListener('scroll', updateParallax);
updateParallax();

/* =========================
   HIDE/SHOW NAVBAR ON SCROLL
========================= */

let lastScrollTop = 0;
const scrollThreshold = 100; // Increased threshold

function handleNavbarVisibility() {
    const navbarElement = document.querySelector('.navbar');
    if (!navbarElement) {
        setTimeout(handleNavbarVisibility, 50);
        return;
    }

    // Don't hide navbar if menu is open
    if (isMenuOpen) {
        return;
    }

    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollTop <= 100) {
        navbarElement.classList.remove('nav-hidden');
        lastScrollTop = currentScrollTop;
        return;
    }

    const scrollDifference = Math.abs(currentScrollTop - lastScrollTop);
    
    if (scrollDifference < 5) {
        return;
    }

    if (currentScrollTop > lastScrollTop) {
        navbarElement.classList.add('nav-hidden');
    } 
    else {
        navbarElement.classList.remove('nav-hidden');
    }

    lastScrollTop = currentScrollTop;
}

let scrollTimer;
function throttledScrollHandler() {
    if (!scrollTimer) {
        scrollTimer = setTimeout(() => {
            handleNavbarVisibility();
            scrollTimer = null;
        }, 50);
    }
}

window.addEventListener('scroll', throttledScrollHandler, { passive: true });

setTimeout(() => {
    handleNavbarVisibility();
}, 100);

function playVideo() {
    const video = document.querySelector('.video-about-video');
    const playButton = document.querySelector('.video-about-play-button');

    if (video && playButton) {
        video.classList.add('active');
        playButton.style.display = 'none';
        video.play();
    }
}

function initializeServiceAreaToggle() {
    const items = document.querySelectorAll('.service-item');
    if (!items.length) return;

    const mq = window.matchMedia('(max-width: 768px)');

    items.forEach(item => {
        if (item.dataset.serviceBound === 'true') {
            return;
        }
        item.dataset.serviceBound = 'true';
        item.addEventListener('click', () => {
            if (!mq.matches) {
                return;
            }
            const wasOpen = item.classList.contains('is-open');
            items.forEach(other => other.classList.remove('is-open'));
            if (!wasOpen) {
                item.classList.add('is-open');
            }
        });
    });

    mq.addEventListener('change', () => {
        if (!mq.matches) {
            items.forEach(item => item.classList.remove('is-open'));
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeServiceAreaToggle);

/* =========================
   QUOTE TEMPLATE INTERACTIVE FUNCTIONALITY
========================= */
function initializeQuoteTemplateInteractive() {
    const asuntoInput = document.getElementById('tpl-asunto');
    const empresaInput = document.getElementById('tpl-empresa');
    const tipoSelect = document.getElementById('tpl-tipo');
    const medidasInput = document.getElementById('tpl-medidas');
    const cantidadInput = document.getElementById('tpl-cantidad');
    const materialInput = document.getElementById('tpl-material');
    const arteSelect = document.getElementById('tpl-arte');
    const fechaInput = document.getElementById('tpl-fecha');

    const copyBtn = document.getElementById('btn-copy-template');
    const sendWhatsapp = document.getElementById('send-whatsapp');
    const sendEmail = document.getElementById('send-email');

    if (!empresaInput) return; // Exit if not on contact.html

    // Auto-update subject line when company name changes, if user hasn't edited subject manually
    let isSubjectEdited = false;
    asuntoInput.addEventListener('input', () => {
        isSubjectEdited = true;
    });

    empresaInput.addEventListener('input', () => {
        if (!isSubjectEdited) {
            asuntoInput.value = 'Cotización de etiquetas - ' + empresaInput.value;
        }
    });

    function getCompiledText() {
        const asunto = asuntoInput.value.trim() || 'Cotización de etiquetas';
        const empresa = empresaInput.value.trim() || '_____';
        const tipo = tipoSelect.value || '_____';
        const medidas = medidasInput.value.trim() || '_____';
        const cantidad = cantidadInput.value.trim() || '_____';
        const material = materialInput.value.trim() || '_____';
        const arte = arteSelect.value || '_____';
        const fecha = fechaInput.value.trim() || '_____';

        return `Asunto: ${asunto}

Empresa / contacto: ${empresa}
Tipo de etiqueta: ${tipo}
Medidas y forma: ${medidas}
Cantidad: ${cantidad}
Material: ${material}
Arte o muestra: ${arte}
Fecha requerida: ${fecha}`;
    }

    function copyToClipboard(text) {
        return navigator.clipboard.writeText(text);
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const text = getCompiledText();
            copyToClipboard(text).then(() => {
                const btnText = copyBtn.querySelector('.btn-text');
                if (!btnText) return;
                const originalText = btnText.textContent;
                copyBtn.classList.add('copied');
                btnText.textContent = '¡Copiado!';
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    btnText.textContent = originalText;
                }, 2500);
            }).catch(err => {
                console.error('Error al copiar al portapapeles: ', err);
            });
        });
    }

    if (sendWhatsapp) {
        sendWhatsapp.addEventListener('click', (e) => {
            e.preventDefault();
            const text = getCompiledText();
            copyToClipboard(text).then(() => {
                const phone = '59171436133';
                const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
                window.open(url, '_blank');
            }).catch(err => {
                console.error('Error al procesar WhatsApp: ', err);
                const phone = '59171436133';
                const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
                window.open(url, '_blank');
            });
        });
    }

    if (sendEmail) {
        sendEmail.addEventListener('click', (e) => {
            e.preventDefault();
            const text = getCompiledText();
            const asunto = asuntoInput.value.trim() || 'Cotización de etiquetas';
            copyToClipboard(text).then(() => {
                const mailtoUrl = `mailto:producciondisenarsrl@gmail.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(text)}`;
                window.location.href = mailtoUrl;
            }).catch(err => {
                console.error('Error al procesar correo: ', err);
                const mailtoUrl = `mailto:producciondisenarsrl@gmail.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(text)}`;
                window.location.href = mailtoUrl;
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', initializeQuoteTemplateInteractive);

