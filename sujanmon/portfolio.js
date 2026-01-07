// Simple portfolio functionality
document.addEventListener('DOMContentLoaded', function() {
    // Video controls
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    
    // Initialize Vimeo Player
    let player = null;
    
    function initVimeoPlayer() {
        if (typeof Vimeo !== 'undefined') {
            const iframe = document.getElementById('showreel-video');
            player = new Vimeo.Player(iframe);
            
            // Set up play button
            playBtn.addEventListener('click', function() {
                player.play().catch(function(error) {
                    console.error('Error playing video:', error);
                });
            });
            
            // Set up pause button
            pauseBtn.addEventListener('click', function() {
                player.pause().catch(function(error) {
                    console.error('Error pausing video:', error);
                });
            });
        } else {
            // Retry after a short delay
            setTimeout(initVimeoPlayer, 100);
        }
    }
    
    // Initialize Vimeo player
    initVimeoPlayer();
    
    // Add smooth scrolling for anchor links (if any are added later)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add a simple fade-in effect for sections
    const fadeSections = document.querySelectorAll('section');
    
    const fadeInOnScroll = function() {
        fadeSections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionVisible = 150;
            
            if (sectionTop < window.innerHeight - sectionVisible) {
                section.style.opacity = "1";
                section.style.transform = "translateY(0)";
            }
        });
    };
    
    // Set initial state for fade sections
    fadeSections.forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(20px)";
        section.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    });
    
    // Check on scroll
    window.addEventListener('scroll', fadeInOnScroll);
    
    // Initial check
    fadeInOnScroll();
    
    // Add hover effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});
