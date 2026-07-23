document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    
    const closeBtn = document.createElement('div');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '&times;';
    
    const content = document.createElement('div');
    content.className = 'lightbox-content';
    

    overlay.appendChild(closeBtn);
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    const targetImages = document.querySelectorAll('.bento-card-img, .service-thumb, .testimonial-image');

    const getScrollbarWidth = () => {
        return window.innerWidth - document.documentElement.clientWidth;
    };

    const preventScroll = (e) => {
        // Permitir el scroll dentro de la galería del lightbox
        if (e.target.closest && e.target.closest('.lightbox-gallery')) return;

        const keys = [' ', 'PageUp', 'PageDown', 'End', 'Home', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (e.type === 'keydown' && !keys.includes(e.key)) return;
        
        e.preventDefault();
    };

    const toggleScrollLock = (lock) => {
        const options = { passive: false };
        if (lock) {
            window.addEventListener('wheel', preventScroll, options);
            window.addEventListener('touchmove', preventScroll, options);
            window.addEventListener('keydown', preventScroll, options);
        } else {
            window.removeEventListener('wheel', preventScroll);
            window.removeEventListener('touchmove', preventScroll);
            window.removeEventListener('keydown', preventScroll);
        }
    };

    const openLightbox = (src, triggerElement) => {
        content.innerHTML = '';
        content.classList.remove('is-gallery');
        if (triggerElement.tagName.toLowerCase() === 'video') {
            const video = document.createElement('video');
            video.src = src;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.controls = true;
            video.playsinline = true;
            content.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = src;
            content.appendChild(img);
        }
        overlay.classList.add('active');
        
        toggleScrollLock(true);
        
        const serviceItem = triggerElement.closest('.service-item');
        if (serviceItem) {
            serviceItem.classList.add('lightbox-open-item');
        }
    };

    let currentGalleryTrigger = null;
    let zoomedFromGallery = false;

    const closeLightbox = () => {
        // Si venimos de ampliar una foto dentro de la galería, volver a la galería
        if (zoomedFromGallery && currentGalleryTrigger) {
            zoomedFromGallery = false;
            openGallery(currentGalleryTrigger);
            return;
        }
        currentGalleryTrigger = null;
        overlay.classList.remove('active');
        
        toggleScrollLock(false);
        
        document.querySelectorAll('.service-item').forEach(item => {
            item.classList.remove('lightbox-open-item');
        });

        setTimeout(() => {
            content.innerHTML = '';
            content.classList.remove('is-gallery');
            
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                navbar.style.paddingRight = '';
            }
        }, 300);
    };

    const placeholderPhoto = (material, i) => {
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='500'>`+
            `<rect width='400' height='500' fill='#f1efe9'/>`+
            `<g fill='none' stroke='#c9c2b4' stroke-width='2' opacity='0.5'>`+
            Array.from({length:34},(_,k)=>`<line x1='${-500+k*32}' y1='0' x2='${k*32}' y2='500'/>`).join('')+
            `</g>`+
            `<text x='200' y='245' font-family='monospace' font-size='20' font-weight='700' fill='#8a8272' text-anchor='middle'>${material}</text>`+
            `<text x='200' y='275' font-family='monospace' font-size='13' fill='#a49c8c' text-anchor='middle'>etiqueta ejemplo ${i}</text>`+
            `</svg>`;
        return 'data:image/svg+xml,' + encodeURIComponent(svg);
    };

    const openGallery = (trigger) => {
        currentGalleryTrigger = trigger;
        const material = trigger.getAttribute('data-material') || 'Material';
        const raw = (trigger.getAttribute('data-gallery') || '').trim();
        let photos = raw ? raw.split('|').map(s => s.trim()).filter(Boolean) : [];
        if (!photos.length) {
            photos = Array.from({length:6},(_,i)=>`./assets/gallery/ejemplo-${i+1}.jpg`);
        }
        content.classList.add('is-gallery');
        content.innerHTML = '';
        const panel = document.createElement('div');
        panel.className = 'lightbox-gallery';
        panel.innerHTML = `<div class='lightbox-gallery-head'><h3>${material}</h3>`+
            `<span>Etiquetas producidas con este material</span></div>`+
            `<div class='lightbox-gallery-grid'>`+
            photos.map(p=>`<img src='${p}' alt='Etiqueta ${material}' loading='lazy'>`).join('')+
            `</div>`;
        content.appendChild(panel);
        // Click en una foto de la galería para ampliarla
        panel.querySelectorAll('.lightbox-gallery-grid img').forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                zoomedFromGallery = true;
                openLightbox(img.src, img);
            });
        });
        overlay.classList.add('active');
        toggleScrollLock(true);
        const serviceItem = trigger.closest('.service-item');
        if (serviceItem) serviceItem.classList.add('lightbox-open-item');
    };

    document.querySelectorAll('.service-gallery-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            openGallery(trigger);
        });
    });

    targetImages.forEach(image => {
        if (image.closest('.service-gallery-trigger')) return;
        image.addEventListener('click', (e) => {
            e.stopPropagation();
            let src = image.src;
            if (image.tagName.toLowerCase() === 'video') {
                src = image.src || image.getAttribute('src');
                if (!src) {
                    const sourceChild = image.querySelector('source');
                    if (sourceChild) {
                        src = sourceChild.src || sourceChild.getAttribute('src');
                    }
                }
            }
            openLightbox(src, image);
        });
    });

    overlay.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
    
    content.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeLightbox();
        }
    });
});
