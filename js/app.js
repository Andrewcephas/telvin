// BlueTell Interactive Static Features
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }
    
    // Typing effect
    const typingTexts = [
        "A modern digital brand built around connection",
        "Simplifying complex ideas into clear communication",
        "Creating identities that inspire trust",
        "Your partner for life"
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingElement = document.getElementById('typingText');
    
    function typeEffect() {
        if (!typingElement) return;
        const currentText = typingTexts[textIndex];
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        if (!isDeleting && charIndex === currentText.length) {
            setTimeout(() => isDeleting = true, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
        }
        setTimeout(typeEffect, isDeleting ? 50 : 100);
    }
    typeEffect();
    
    // Typing Game
    const typingGameTexts = [
        "BlueTell connects people through clear communication.",
        "Innovation drives our passion for digital solutions.",
        "Your success is our priority every single day.",
        "We build brands that people trust and remember."
    ];
    let currentGameText = typingGameTexts[0];
    let gameStartTime = null;
    let gameInterval = null;
    
    const textDisplay = document.getElementById('textDisplay');
    const textInput = document.getElementById('textInput');
    const wpmDisplay = document.getElementById('wpm');
    const accuracyDisplay = document.getElementById('accuracy');
    const timeDisplay = document.getElementById('time');
    const startBtn = document.getElementById('startGame');
    const resetBtn = document.getElementById('resetGame');
    
    if (textDisplay) {
        textDisplay.textContent = currentGameText;
    }
    
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            currentGameText = typingGameTexts[Math.floor(Math.random() * typingGameTexts.length)];
            if (textDisplay) textDisplay.textContent = currentGameText;
            if (textInput) {
                textInput.value = '';
                textInput.disabled = false;
                textInput.focus();
            }
            gameStartTime = new Date().getTime();
            if (gameInterval) clearInterval(gameInterval);
            gameInterval = setInterval(updateGameStats, 100);
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            currentGameText = typingGameTexts[0];
            if (textDisplay) textDisplay.textContent = currentGameText;
            if (textInput) {
                textInput.value = '';
                textInput.disabled = true;
            }
            if (gameInterval) clearInterval(gameInterval);
            if (wpmDisplay) wpmDisplay.textContent = '0';
            if (accuracyDisplay) accuracyDisplay.textContent = '100%';
            if (timeDisplay) timeDisplay.textContent = '0s';
            gameStartTime = null;
        });
    }
    
    function updateGameStats() {
        if (!gameStartTime || !textInput) return;
        const currentTime = new Date().getTime();
        const timeElapsed = (currentTime - gameStartTime) / 1000;
        if (timeDisplay) timeDisplay.textContent = Math.floor(timeElapsed) + 's';
        
        const typedText = textInput.value;
        const wordsTyped = typedText.trim().split(/\s+/).filter(w => w.length > 0).length;
        const wpm = timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0;
        if (wpmDisplay) wpmDisplay.textContent = wpm;
        
        let correctChars = 0;
        for (let i = 0; i < typedText.length && i < currentGameText.length; i++) {
            if (typedText[i] === currentGameText[i]) correctChars++;
        }
        const accuracy = typedText.length > 0 ? Math.round((correctChars / typedText.length) * 100) : 100;
        if (accuracyDisplay) accuracyDisplay.textContent = accuracy + '%';
    }
    
    if (textInput) {
        textInput.disabled = true;
        textInput.addEventListener('input', () => {
            const typed = textInput.value;
            if (typed === currentGameText) {
                if (gameInterval) clearInterval(gameInterval);
                alert('Great job! You completed the text!');
            }
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            setTimeout(() => {
                alert('Message sent successfully!');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1000);
        });
    }
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: targetPosition - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
});
