class ComponentLoader {
    constructor() {
        this.loadComponentsCSS();

        this.navbarHTML = `
        <nav class="navbar">
            <div class="nav-container">
                <a href="index.html" class="logo">Diseñ-ar</a>
                <div class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <ul class="nav-menu">
                    <li><a href="index.html" class="nav-link">Home</a></li>
                    <li><a href="about.html" class="nav-link">Nosotros</a></li>
                    <li><a href="services.html" class="nav-link">Servicios</a></li>
                    <li><a href="contact.html" class="nav-link btn-contact">Contáctanos</a></li>
                </ul>
            </div>
        </nav>
        `;

        this.footerHTML = `
        <footer class="footer">
            <div class="footer-container">
                <div class="footer-content">
                    <div class="footer-left">
                        <div class="footer-logo">
                            <img
                                src="./assets/disenar-logo.png"
                                alt="DISEÑ-AR Logo"
                                style="width: 160px; height: auto;"
                                loading="lazy"
                                decoding="async"
                            >
                        </div>

                        <p class="footer-tagline">Diseña tu estilo, crea con pasión.</p>

                        <div class="footer-contact">
                            <h4>Contacto</h4>
                            <p class="contact-label">Email</p>
                            <a href="mailto:info@disenar.com" class="contact-email">producciondisenarsrl@gmail.com</a>

                            <p class="contact-label office-label">Nuestras Oficinas</p>
                            <p class="contact-address">Francisco Pizarro entre Parque Ex Combatientes y 15 de Agosto, Cochabamba</p>
                        </div>
                    </div>

                    <div class="footer-right">
                        <div class="footer-links">
                            <div class="footer-column">
                                <h4>Páginas</h4>
                                <ul>
                                    <li><a href="index.html">Home</a></li>
                                    <li><a href="about.html">Nosotros</a></li>
                                    <li><a href="services.html">Servicios</a></li>
                                </ul>
                            </div>

                            <div class="footer-column">
                                <h4>Servicios</h4>
                                <ul>
                                    <li><a href="services.html">Nuestros Servicios</a></li>
                                    <li><a href="services.html#materiales">Materiales</a></li>
                                </ul>
                            </div>

                            <div class="footer-column">
                                <h4>Cotizaciones</h4>
                                <ul>
                                    <li><a href="contact.html">Contáctanos</a></li>
                                </ul>
                            </div>
                        </div>

                        <div class="footer-bottom">
                            <p>© Copyright 2026 | Design & Developed By DISEÑ-AR</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer-big-text">DISEÑ-AR</div>
        </footer>
        `;
    }

    loadNavbar() {
        const navbarPlaceholder = document.getElementById('navbar-placeholder');
        if (navbarPlaceholder) {
            navbarPlaceholder.innerHTML = this.navbarHTML;
            this.initializeNavbar();
            document.dispatchEvent(new Event('navbar:loaded'));
        }
    }

    loadFooter() {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = this.footerHTML;
        }
    }

    initializeNavbar() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    loadComponentsCSS() {
        const existingLink = document.querySelector('link[href="components.css"]');
        if (!existingLink) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'components.css';
            document.head.appendChild(link);
        }
        if (!document.getElementById('brand-font')) {
            const font = document.createElement('link');
            font.id = 'brand-font';
            font.rel = 'stylesheet';
            font.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,600;1,9..144,700&display=swap';
            document.head.appendChild(font);
        }
    }

    loadAll() {
        this.loadNavbar();
        this.loadFooter();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loader = new ComponentLoader();
    loader.loadAll();
});

(function() {
    const link = document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'icon';
    link.href = './assets/favicon.svg';
    document.head.appendChild(link);
})();
