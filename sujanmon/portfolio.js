// Portfolio Interactive Elements
document.addEventListener('DOMContentLoaded', function() {
    // Navigation buttons
    const navButtons = document.querySelectorAll('.menu-btn, .back-to-menu');
    const playButton = document.getElementById('play-btn');
    const showreelVideo = document.getElementById('showreel-video');
    
    // Initialize Vimeo Player
    let player = null;
    let isVideoPlaying = true;
    
    // Initialize Vimeo player when API is ready
    function initVimeoPlayer() {
        if (typeof Vimeo !== 'undefined') {
            player = new Vimeo.Player(showreelVideo);
            
            // Set initial button state
            player.getPaused().then(function(paused) {
                isVideoPlaying = !paused;
                updatePlayButton();
            }).catch(function(error) {
                console.error('Error getting video state:', error);
            });
        } else {
            // Retry after a short delay
            setTimeout(initVimeoPlayer, 100);
        }
    }
    
    // Update play button text and icon
    function updatePlayButton() {
        const btnText = playButton.querySelector('.btn-text');
        const btnIcon = playButton.querySelector('.btn-icon');
        
        if (isVideoPlaying) {
            btnText.textContent = 'PAUSE SHOWREEL';
            btnIcon.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            btnText.textContent = 'PLAY SHOWREEL';
            btnIcon.innerHTML = '<i class="fas fa-play"></i>';
        }
    }
    
    // Initialize Vimeo player
    initVimeoPlayer();
    
    // Smooth scroll to section
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            if (target) {
                const targetSection = document.getElementById(target);
                if (targetSection) {
                    // Special case for main menu (needs to show video)
                    if (target === 'main-menu') {
                        // Make sure video is visible
                        document.querySelector('.video-container').style.opacity = '1';
                        document.querySelector('.video-container').style.zIndex = '-1';
                    }
                    
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Play button functionality
    playButton.addEventListener('click', function() {
        if (player) {
            if (isVideoPlaying) {
                // Pause the video
                player.pause().then(function() {
                    isVideoPlaying = false;
                    updatePlayButton();
                }).catch(function(error) {
                    console.error('Error pausing video:', error);
                });
            } else {
                // Play the video
                player.play().then(function() {
                    isVideoPlaying = true;
                    updatePlayButton();
                }).catch(function(error) {
                    console.error('Error playing video:', error);
                });
            }
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Play/Pause video with 'P' key
        if (e.key === 'p' || e.key === 'P') {
            playButton.click();
            e.preventDefault();
        }
        
        // Navigate to Projects with '1' key
        if (e.key === '1') {
            document.querySelector('.menu-btn[data-target="projects"]').click();
        }
        
        // Navigate to About with '2' key
        if (e.key === '2') {
            document.querySelector('.menu-btn[data-target="about"]').click();
        }
        
        // Return to menu with 'Escape' key
        if (e.key === 'Escape') {
            document.querySelector('.back-to-menu').click();
        }
    });
    
    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll('.content-section, .project-card, .about-card');
    
    const fadeInOnScroll = function() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            }
        });
    };
    
    // Set initial state for fade elements
    fadeElements.forEach(element => {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    });
    
    // Check on scroll
    window.addEventListener('scroll', fadeInOnScroll);
    
    // Initial check
    fadeInOnScroll();
    
    // Add active state to menu buttons based on scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.menu-btn[data-target]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-target') === current) {
                link.classList.add('active');
            }
        });
    });
});
