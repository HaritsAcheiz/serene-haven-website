// Chat Widget Functionality
let chatWidget = null;
let chatIcon = null;
let chatWindow = null;
let chatMessages = null;
let chatInput = null;
let chatSend = null;
let chatClose = null;

// N8N Webhook URL - Replace with your actual webhook URL
const N8N_WEBHOOK_URL = '__N8N_WEBHOOK_URL__';

// Initialize chat widget when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeChatWidget();
    initializeGalleryCarousel();
    initializeNavigation();
});

function initializeChatWidget() {
    chatWidget = document.getElementById('chatWidget');
    chatIcon = document.getElementById('chatIcon');
    chatWindow = document.getElementById('chatWindow');
    chatMessages = document.getElementById('chatMessages');
    chatInput = document.getElementById('chatInput');
    chatSend = document.getElementById('chatSend');
    chatClose = document.getElementById('chatClose');

    if (!chatWidget) return;

    // Chat icon click event
    chatIcon.addEventListener('click', function() {
        toggleChatWindow();
    });

    // Close button click event
    if (chatClose) {
        chatClose.addEventListener('click', function() {
            closeChatWindow();
        });
    }

    // Send button click event
    if (chatSend) {
        chatSend.addEventListener('click', function() {
            sendMessage();
        });
    }

    // Enter key press event
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

function toggleChatWindow() {
    if (chatWindow.classList.contains('active')) {
        closeChatWindow();
    } else {
        openChatWindow();
    }
}

function openChatWindow() {
    chatWindow.classList.add('active');
    if (chatInput) {
        chatInput.focus();
    }
}

function closeChatWindow() {
    chatWindow.classList.remove('active');
}

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessageToChat(message, 'user');
    
    // Clear input
    chatInput.value = '';

    // Send message to N8N webhook
    sendToN8N(message);
}

function addMessageToChat(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = message;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.textContent = 'Typing...';
    typingDiv.id = 'typing-indicator';
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getChatSessionId() {
    let sessionId = sessionStorage.getItem('chatSessionId');

    // If no session ID exists, generate one and store it
    if (!sessionId) {
        sessionId = generateUUID();
        sessionStorage.setItem('chatSessionId', sessionId);
        console.log('New chat session started:', sessionId); // For debugging
    } else {
        console.log('Continuing chat session:', sessionId); // For debugging
    }
    return sessionId;
}

async function sendToN8N(message) {
    try {
        showTypingIndicator();

        // Get the session ID (will create if it doesn't exist)
        const sessionId = getChatSessionId();

        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                timestamp: new Date().toISOString(),
                source: 'website_chat',
                page: window.location.pathname,
                sessionId: sessionId // <-- ADD THIS LINE to send the session ID
            })
        });

        if (response.ok) {
            const data = await response.json();

            removeTypingIndicator();

            if (data[0].output.chatMessage) {
                addMessageToChat(data[0].output.chatMessage, 'bot');
            } else {
                addMessageToChat('Thank you for your message! We will get back to you soon.', 'bot');
            }
        } else {
            throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error sending message to n8n:', error);
        removeTypingIndicator();
        addMessageToChat('Sorry, there was an error sending your message. Please try again later.', 'bot');
    }
}

// Gallery carousel functionality
function initializeGalleryCarousel() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slides = document.querySelectorAll('.gallery-slide');
    let currentSlide = 0;

    if (!prevBtn || !nextBtn || slides.length === 0) return;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto-advance slides every 5 seconds
    setInterval(nextSlide, 5000);
}

// Navigation functionality
function initializeNavigation() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle (if needed)
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const recruitmentForm = document.querySelector('.recruitment-form');
    
    if (recruitmentForm) {
        recruitmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Here you can send the form data to your backend or n8n webhook
            console.log('Form submitted:', data);
            
            // Show success message
            alert('Thank you for your application! We will review it and get back to you soon.');
            
            // Reset form
            this.reset();
        });
    }
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Scroll animations (optional enhancement)
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .team-member, .gallery-item').forEach(el => {
        observer.observe(el);
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeScrollAnimations);

