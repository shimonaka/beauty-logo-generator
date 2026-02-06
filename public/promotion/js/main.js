document.addEventListener('DOMContentLoaded', function () {
    console.log('IT Brain Promo LP Loaded');

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple reveal animation on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target); // Keep observing if you want it to trigger every time
            }
        });
    }, observerOptions);

    // Initial simple animation style injection
    const style = document.createElement('style');
    style.textContent = `
        .section, .product-card, .reason-item, .hero__content, .hero__visual {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('.section, .product-card, .reason-item, .hero__content, .hero__visual').forEach(el => {
        observer.observe(el);
    });
});
