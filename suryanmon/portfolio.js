// Portfolio functionality
document.addEventListener('DOMContentLoaded', function() {
    // Vimeo Player Setup
    let player = null;
    
    function initVimeoPlayer() {
        const iframe = document.getElementById('showreel-video');
        if (iframe && typeof Vimeo !== 'undefined') {
            player = new Vimeo.Player(iframe);
            
            // Play button
            document.getElementById('play-btn').addEventListener('click', function() {
                player.play().catch(function(error) {
                    console.log('Play error:', error);
                });
            });
            
            // Pause button
            document.getElementById('pause-btn').addEventListener('click', function() {
                player.pause().catch(function(error) {
                    console.log('Pause error:', error);
                });
            });
            
            // Fullscreen button
            document.getElementById('fullscreen-btn').addEventListener('click', function() {
                player.requestFullscreen().catch(function(error) {
                    console.log('Fullscreen error:', error);
                });
            });
            
            console.log('Vimeo player initialized');
        } else if (!player) {
            setTimeout(initVimeoPlayer, 500);
        }
    }
    
    // Initialize Vimeo player
    if (document.getElementById('showreel-video')) {
        initVimeoPlayer();
    }
    
    // Project card animations
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Skill category animations
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        category.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        category.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Fade in animation for sections
    const sections = document.querySelectorAll('section');
    
    const fadeInOnScroll = function() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionVisible = 150;
            
            if (sectionTop < window.innerHeight - sectionVisible) {
                section.style.opacity = "1";
                section.style.transform = "translateY(0)";
            }
        });
    };
    
    // Set initial state for sections
    sections.forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(20px)";
        section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });
    
    // Check on scroll
    window.addEventListener('scroll', fadeInOnScroll);
    
    // Initial check
    fadeInOnScroll();
    
    // Add active state to nav links (if navigation is added later)
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks.length > 0) {
        window.addEventListener('scroll', function() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Spacebar to play/pause video
        if (e.code === 'Space' && player) {
            e.preventDefault();
            player.getPaused().then(function(paused) {
                if (paused) {
                    player.play();
                } else {
                    player.pause();
                }
            });
        }
        
        // F for fullscreen
        if (e.code === 'KeyF' && player) {
            e.preventDefault();
            player.requestFullscreen();
        }
    });
    
    // Initialize
    console.log('Portfolio loaded successfully');
});
