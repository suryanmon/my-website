// Portfolio functionality
document.addEventListener('DOMContentLoaded', function() {
    // YouTube Player Setup
    let player = null;
    let playerReady = false;

    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    // Called automatically by YouTube API when ready
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('showreel-video', {
            events: {
                onReady: function() {
                    playerReady = true;
                    console.log('YouTube player initialized');
                }
            }
        });
    };

    // Play button
    document.getElementById('play-btn').addEventListener('click', function() {
        if (playerReady) player.playVideo();
    });

    // Pause button
    document.getElementById('pause-btn').addEventListener('click', function() {
        if (playerReady) player.pauseVideo();
    });

    // Fullscreen button
    document.getElementById('fullscreen-btn').addEventListener('click', function() {
        const iframe = document.getElementById('showreel-video');
        const requestFS = iframe.requestFullscreen || iframe.webkitRequestFullscreen || iframe.mozRequestFullScreen;
        if (requestFS) requestFS.call(iframe);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (!playerReady) return;

        // Spacebar to play/pause
        if (e.code === 'Space') {
            e.preventDefault();
            const state = player.getPlayerState();
            if (state === YT.PlayerState.PLAYING) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
        }

        // F for fullscreen
        if (e.code === 'KeyF') {
            e.preventDefault();
            const iframe = document.getElementById('showreel-video');
            const requestFS = iframe.requestFullscreen || iframe.webkitRequestFullscreen || iframe.mozRequestFullScreen;
            if (requestFS) requestFS.call(iframe);
        }
    });

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
            if (sectionTop < window.innerHeight - 150) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    };

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    window.addEventListener('scroll', fadeInOnScroll);
    fadeInOnScroll();

    // Nav active state
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks.length > 0) {
        window.addEventListener('scroll', function() {
            let current = '';
            sections.forEach(section => {
                if (scrollY >= section.offsetTop - 150) {
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

    console.log('Portfolio loaded successfully');
});
