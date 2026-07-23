document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-loaded');
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const currentUrl = new URL(window.location.href);
            const targetUrl = new URL(link.href, window.location.href);

            if (!href || 
                href.startsWith('#') || 
                href.startsWith('mailto:') || 
                href.startsWith('tel:') || 
                link.target === '_blank' ||
                (targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search)) {
                return;
            }

            // Navegadores con View Transitions: dejar el crossfade nativo (sin pantalla en blanco).
            if ('startViewTransition' in document) {
                return;
            }

            e.preventDefault();
            document.body.classList.remove('page-loaded');

            setTimeout(() => {
                window.location.href = href;
            }, 380);
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll(
        '.hero-content, .section-title, .section-main-title, ' +
        '.bento-grid, .bento-card, ' +
        '.service-list, .service-item, .service-area-title, ' +
        '.mission-content, .mission-badge, .mission-title, .testimonial, ' +
        '.about-content, .about-title, .about-description, ' +
        '.team-grid, .team-member, .team-title, ' +
        '.values-grid, .value-card, .values-title, ' +
        '.services-grid, .service-card, ' +
        '.contact-grid, .contact-info, .contact-form, .contact-title, .quote-template-card, ' +
        '.map-container, .map-title, .map-placeholder, ' +
        '.stacked-container, .stack-card, ' +
        '.footer-content, .footer-left, .footer-right, ' +
        '.logo-carousel, .video-about, ' +
        '.hero-about-container, .hero-about-badge, .hero-about-title, ' +
        '.video-about-main, .video-about-thumbnail, ' +
        '.mission-vision-container, .mission-vision-grid, .first-text-about, .second-text-about, ' +
        '.flip-card, .mission-about, .vision-about, ' +
        '.values-text, .scrolling-values, .scrolling-text, .years-text'
    );
    
    elementsToAnimate.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Subrayado de palabras en Fraunces (.hero-accent / .af-accent) según dirección de scroll.
    // Se excluyen las de los títulos de héroe (hero-title / hero-about-title), fijas arriba.
    const accentWords = document.querySelectorAll('.hero-accent, .af-accent');
    const underlineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('is-underlined', entry.isIntersecting);
        });
    }, { threshold: 0.9, rootMargin: '0px 0px -8% 0px' });

    accentWords.forEach(word => {
        if (word.closest('.hero-title') || word.closest('.hero-about-title')) return;
        word.classList.add('underline-scroll');
        underlineObserver.observe(word);
    });

    // Escalonado: cada tarjeta de un grupo entra con un leve retardo en cascada
    ['.stack-card', '.service-card', '.value-card', '.team-member', '.bento-card'].forEach(sel => {
        document.querySelectorAll(sel).forEach(card => {
            if (!card.parentElement) return;
            const siblings = Array.from(card.parentElement.querySelectorAll(':scope > ' + sel));
            const i = siblings.indexOf(card);
            if (i > 0) card.style.transitionDelay = Math.min(i * 90, 360) + 'ms';
        });
    });

    // Contador animado en los stats (Nosotros): +11, 2015...
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const countObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });

        document.querySelectorAll('.qs-stat p:first-child').forEach(el => {
            const m = el.textContent.trim().match(/^([^\d]*)(\d[\d.]*)(.*)$/);
            if (!m) return; // salta valores no numéricos como "Cold Foil"
            el.dataset.prefix = m[1];
            el.dataset.target = m[2];
            el.dataset.suffix = m[3];
            countObserver.observe(el);
        });

        function animateCount(el) {
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';
            const target = parseFloat(el.dataset.target);
            const duration = 1100;
            const start = performance.now();
            function tick(now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = prefix + Math.round(target * eased) + suffix;
                if (p < 1) requestAnimationFrame(tick);
                else el.textContent = prefix + el.dataset.target + suffix;
            }
            requestAnimationFrame(tick);
        }
    }
});
