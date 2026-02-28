// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Preloader with smooth fade-out and scale effect
    window.addEventListener('load', () => {
        gsap.to('#preloader', { 
            opacity: 0, 
            scale: 0.95,
            duration: 2.5, 
            ease: 'power2.inOut',
            onComplete: () => {
                document.getElementById('preloader').style.visibility = 'hidden';
                document.getElementById('preloader').style.display = 'none';
            }
        });
    });

    // Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.top-nav')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // Close menu when pressing Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Event builder functionality
    const builderForm = document.getElementById('builder-form');
    if (builderForm) {
        const steps = builderForm.querySelectorAll('.step');
        let current = 0;
        const finalStepEl = builderForm.querySelector('.final-step');
        function showStep(index) {
            // hide all steps
            steps.forEach((step, i) => {
                step.style.display = i === index ? 'block' : 'none';
            });
            // if index equals steps.length, show final
            if (finalStepEl) {
                finalStepEl.style.display = index === steps.length ? 'block' : 'none';
            }
            // mark option button if value stored
            if (index < steps.length) {
                const stepEl = steps[index];
                const stepIndex = stepEl.getAttribute('data-step');
                let name;
                if (stepIndex === '1') name = 'event_type';
                else if (stepIndex === '2') name = 'guests';
                else if (stepIndex === '3') name = 'location';
                if (name) {
                    const val = builderForm.elements[name].value;
                    if (val) {
                        stepEl.querySelectorAll('.option-btn').forEach(b => {
                            b.classList.toggle('selected', b.dataset.value === val);
                        });
                    }
                }
            }
            current = index;
        }
        showStep(0);

        builderForm.addEventListener('click', (e) => {
            // option buttons
            if (e.target.matches('.option-btn')) {
                const btn = e.target;
                const stepEl = btn.closest('.step');
                // mark selected only one per step
                stepEl.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                // store value in hidden input
                const stepIndex = stepEl.getAttribute('data-step');
                let name;
                if (stepIndex === '1') name = 'event_type';
                else if (stepIndex === '2') name = 'guests';
                else if (stepIndex === '3') name = 'location';
                if (name) {
                    builderForm.elements[name].value = btn.dataset.value;
                }
            }
            if (e.target.matches('.next-btn')) {
                e.preventDefault();
                // if this step contains options, ensure one is selected
                const stepEl = steps[current];
                const opts = stepEl.querySelectorAll('.option-btn');
                if (opts.length && !stepEl.querySelector('.option-btn.selected')) {
                    // no selection: maybe flash
                    return;
                }
                if (current < steps.length - 1) showStep(current + 1);
            }
            if (e.target.matches('.prev-btn')) {
                e.preventDefault();
                if (current > 0) showStep(current - 1);
            }
        });

        builderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // here you could send form data via fetch/AJAX
            showStep(steps.length); // show final-step
        });
    }


    // Lazy load videos (observer)
    const videos = document.querySelectorAll('video[loading="lazy"]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.play();
            } else {
                entry.target.pause();
            }
        });
    });
    videos.forEach(video => observer.observe(video));

    // Testimonials auto-scroll
    const testimonialsContainer = document.getElementById('testimonialsContainer');
    if (testimonialsContainer) {
        let autoScroll = true;
        const speed = 0.5; // px per frame
        function step() {
            if (autoScroll) {
                testimonialsContainer.scrollLeft += speed;
                if (testimonialsContainer.scrollLeft >= testimonialsContainer.scrollWidth - testimonialsContainer.clientWidth) {
                    testimonialsContainer.scrollLeft = 0;
                }
            }
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);

        testimonialsContainer.addEventListener('mouseenter', () => { autoScroll = false; });
        testimonialsContainer.addEventListener('mouseleave', () => { autoScroll = true; });
        testimonialsContainer.addEventListener('wheel', (e) => {
            autoScroll = false;
            testimonialsContainer.scrollLeft += e.deltaY;
        });
        testimonialsContainer.addEventListener('touchstart', () => { autoScroll = false; });
        testimonialsContainer.addEventListener('touchend', () => { autoScroll = true; });
        testimonialsContainer.addEventListener('mousedown', () => { autoScroll = false; });
        document.addEventListener('mouseup', () => { autoScroll = true; });
    }

    // Scroll-triggered animations using GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);

        // Animate section headings
        const sectionHeadings = document.querySelectorAll('.authority-headline, .info-section h2');
        sectionHeadings.forEach((heading) => {
            gsap.from(heading, {
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 85%',
                    toggleActions: 'play reverse play reverse',
                },
                duration: 0.8,
                opacity: 0,
                y: 30,
                ease: 'power2.out'
            });
        });

        // Animate CTA buttons
        const ctaButtons = document.querySelectorAll('.cta-button, .option-btn, .submit-btn');
        ctaButtons.forEach((btn) => {
            gsap.from(btn, {
                scrollTrigger: {
                    trigger: btn.closest('section') || btn,
                    start: 'top 80%',
                    toggleActions: 'play reverse play reverse',
                },
                duration: 0.8,
                opacity: 0,
                y: 20,
                ease: 'power2.out'
            });
        });

        // Animate service cards with stagger effect
        const serviceItems = document.querySelectorAll('.service-item');
        serviceItems.forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    end: 'top 20%',
                    toggleActions: 'play reverse play reverse',
                },
                duration: 0.8,
                opacity: 0,
                y: 40,
                ease: 'power2.out',
                delay: index * 0.08
            });
        });

        // Animate service images inside cards
        const serviceImages = document.querySelectorAll('.service-item img');
        serviceImages.forEach((img, index) => {
            gsap.from(img, {
                scrollTrigger: {
                    trigger: img.closest('.service-item'),
                    start: 'top 80%',
                    end: 'top 20%',
                    toggleActions: 'play reverse play reverse',
                },
                duration: 0.8,
                opacity: 0,
                ease: 'power2.out',
                delay: index * 0.08
            });
        });

        // Animate info section blocks
        const infoBlocks = document.querySelectorAll('.info-block');
        infoBlocks.forEach((block, index) => {
            gsap.from(block, {
                scrollTrigger: {
                    trigger: block,
                    start: 'top 80%',
                    toggleActions: 'play reverse play reverse',
                },
                duration: 0.8,
                opacity: 0,
                y: 40,
                ease: 'power2.out'
            });
        });

        // Animate info text headings (h3 elements in info-text)
        const infoHeadings = document.querySelectorAll('.info-text h3');
        infoHeadings.forEach((heading, index) => {
            gsap.from(heading, {
                scrollTrigger: {
                    trigger: heading.closest('.info-block'),
                    start: 'top 75%',
                    toggleActions: 'play reverse play reverse',
                },
                duration: 0.8,
                opacity: 0,
                y: 30,
                ease: 'power2.out',
                delay: 0.1
            });
        });

        // Animate info text paragraphs
        const infoParagraphs = document.querySelectorAll('.info-text p');
        infoParagraphs.forEach((para, index) => {
            gsap.from(para, {
                scrollTrigger: {
                    trigger: para.closest('.info-block'),
                    start: 'top 75%',
                    toggleActions: 'play reverse play reverse',
                },
                duration: 0.8,
                opacity: 0,
                y: 30,
                ease: 'power2.out',
                delay: 0.2
            });
        });

        // Animate info images
        const infoImages = document.querySelectorAll('.info-image');
        infoImages.forEach((img, index) => {
            gsap.from(img, {
                scrollTrigger: {
                    trigger: img.closest('.info-block'),
                    start: 'top 80%',
                    toggleActions: 'play reverse play reverse',
                },
                duration: 0.8,
                opacity: 0,
                y: 40,
                ease: 'power2.out'
            });
        });
    }
});