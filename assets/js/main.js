document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    const applyTheme = (theme) => {
        body.setAttribute('data-bs-theme', theme);
        if (themeIcon) {
            themeIcon.classList.toggle('fa-moon', theme === 'light');
            themeIcon.classList.toggle('fa-sun', theme === 'dark');
        }
        localStorage.setItem('portfolioTheme', theme);
    };

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = body.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    const savedTheme = localStorage.getItem('portfolioTheme') || 'dark';
    applyTheme(savedTheme);

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    });

    const revealElements = document.querySelectorAll('.fade-up');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    revealElements.forEach(el => revealObserver.observe(el));

    const heroCard = document.querySelector('.hero-figure');
    if (heroCard) {
        heroCard.addEventListener('mousemove', (event) => {
            const rect = heroCard.getBoundingClientRect();
            const x = (event.clientX - rect.left - rect.width / 2) / 18;
            const y = (event.clientY - rect.top - rect.height / 2) / 18;
            heroCard.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
        heroCard.addEventListener('mouseleave', () => {
            heroCard.style.transform = '';
        });
    }

    const contactForm = document.getElementById('contact-form');
    const contactSubmit = document.getElementById('contact-submit');
    const contactAlert = document.getElementById('contact-alert');

    if (contactForm && contactSubmit && contactAlert) {
        // Remplacez ces valeurs par vos identifiants EmailJS
        // - user ID : depuis EmailJS > Compte
        // - service ID : depuis EmailJS > Services
        // - template ID : depuis EmailJS > Modèles
        const EMAILJS_USER_ID = 'YOUR_EMAILJS_USER_ID';
        const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
        const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            contactAlert.innerHTML = '';
            contactSubmit.disabled = true;

            const originalText = contactSubmit.dataset.originalText || contactSubmit.textContent;
            contactSubmit.dataset.originalText = originalText;
            contactSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Envoi...';

            if (EMAILJS_USER_ID.includes('YOUR_') || EMAILJS_SERVICE_ID.includes('YOUR_') || EMAILJS_TEMPLATE_ID.includes('YOUR_')) {
                contactAlert.innerHTML = '<div class="alert alert-warning rounded-4 shadow-sm">Configuration EmailJS manquante. Remplacez les identifiants dans <code>assets/js/main.js</code>.</div>';
                contactSubmit.disabled = false;
                contactSubmit.innerHTML = originalText;
                return;
            }

            emailjs.init(EMAILJS_USER_ID);
            const formData = new FormData(contactForm);
            const payload = {
                from_name: formData.get('name'),
                from_email: formData.get('email'),
                message: formData.get('message'),
                reply_to: formData.get('email'),
                to_email: 'aya.lahrar24@ump.ac.ma'
            };

            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload)
                .then(() => {
                    contactAlert.innerHTML = '<div class="alert alert-success rounded-4 shadow-sm">Message envoyé avec succès. Je vous répondrai bientôt.</div>';
                    contactForm.reset();
                })
                .catch(() => {
                    contactAlert.innerHTML = '<div class="alert alert-danger rounded-4 shadow-sm">Une erreur est survenue. Veuillez réessayer plus tard.</div>';
                })
                .finally(() => {
                    contactSubmit.disabled = false;
                    contactSubmit.innerHTML = originalText;
                });
        });
    }
});
