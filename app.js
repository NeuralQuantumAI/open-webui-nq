// VibeCaaS iOS PWA JavaScript

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

// PWA Install Prompt
let deferredPrompt;
const installPrompt = document.getElementById('installPrompt');
const installBtn = document.getElementById('installBtn');
const dismissBtn = document.getElementById('dismissBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install prompt after 30 seconds
    setTimeout(() => {
        if (!window.matchMedia('(display-mode: standalone)').matches) {
            installPrompt.classList.add('show');
        }
    }, 30000);
});

installBtn?.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response: ${outcome}`);
        deferredPrompt = null;
        installPrompt.classList.remove('show');
    }
});

dismissBtn?.addEventListener('click', () => {
    installPrompt.classList.remove('show');
});

// Tab Navigation
const tabItems = document.querySelectorAll('.tab-item');
const tabContents = document.querySelectorAll('.tab-content');

tabItems.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Add haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
        
        // Update active states
        tabItems.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// Side Menu
const menuBtn = document.getElementById('menuBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');

menuBtn?.addEventListener('click', () => {
    sideMenu.classList.add('active');
    overlay.classList.add('active');
});

closeMenuBtn?.addEventListener('click', closeSideMenu);
overlay?.addEventListener('click', closeSideMenu);

function closeSideMenu() {
    sideMenu.classList.remove('active');
    overlay.classList.remove('active');
}

// Notification Handler
const notificationBtn = document.getElementById('notificationBtn');
const notificationBadge = document.getElementById('notificationBadge');

notificationBtn?.addEventListener('click', () => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('VibeCaaS', {
                    body: 'Notifications enabled!',
                    icon: '/icons/icon-192.png'
                });
            }
        });
    }
    
    // Clear badge
    notificationBadge.style.display = 'none';
});

// Get Started Button
const getStartedBtn = document.getElementById('getStartedBtn');
getStartedBtn?.addEventListener('click', () => {
    // Switch to discover tab
    tabItems.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    
    document.querySelector('[data-tab="discover"]').classList.add('active');
    document.getElementById('discover').classList.add('active');
});

// Image Upload Preview
const imageInput = document.getElementById('imageInput');
const mediaPreview = document.getElementById('mediaPreview');

imageInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            mediaPreview.innerHTML = '';
            mediaPreview.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

// Form Submission
const createForm = document.querySelector('.create-form');
createForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const textarea = createForm.querySelector('.post-textarea');
    const content = textarea.value.trim();
    
    if (content) {
        // Simulate post creation
        showToast('Post shared successfully!');
        textarea.value = '';
        mediaPreview.innerHTML = '';
        
        // Switch to home tab
        tabItems.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        document.querySelector('[data-tab="home"]').classList.add('active');
        document.getElementById('home').classList.add('active');
    }
});

// Action Buttons
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Add haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
        
        // Toggle like state for heart button
        if (this.textContent.includes('❤️')) {
            const count = parseInt(this.textContent.match(/\d+/)[0]);
            if (this.classList.contains('liked')) {
                this.textContent = `❤️ ${count - 1}`;
                this.classList.remove('liked');
                this.style.color = 'var(--text-secondary)';
            } else {
                this.textContent = `❤️ ${count + 1}`;
                this.classList.add('liked');
                this.style.color = 'var(--ios-red)';
            }
        }
    });
});

// Message Items
document.querySelectorAll('.message-item').forEach(item => {
    item.addEventListener('click', () => {
        showToast('Opening chat...');
    });
});

// Community Cards
document.querySelectorAll('.community-card .btn-secondary').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (this.textContent === 'Join') {
            this.textContent = 'Joined';
            this.style.background = 'var(--ios-green)';
            this.style.color = 'white';
            showToast('Joined community!');
        } else {
            this.textContent = 'Join';
            this.style.background = 'var(--ios-gray-5)';
            this.style.color = 'var(--ios-blue)';
        }
    });
});

// Trending Cards
document.querySelectorAll('.trending-card').forEach(card => {
    card.addEventListener('click', () => {
        const topic = card.querySelector('h3').textContent;
        showToast(`Exploring ${topic}`);
    });
});

// Profile Menu Items
document.querySelectorAll('.profile-menu .menu-item').forEach(item => {
    item.addEventListener('click', function() {
        const label = this.querySelector('span:nth-child(2)').textContent;
        
        if (label === 'Install App' && deferredPrompt) {
            deferredPrompt.prompt();
        } else if (label === 'Sign Out') {
            if (confirm('Are you sure you want to sign out?')) {
                showToast('Signed out successfully');
                // Reset to welcome state
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } else {
            showToast(`Opening ${label}...`);
        }
    });
});

// Toast Notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-tertiary);
        color: var(--text-primary);
        padding: 12px 24px;
        border-radius: 20px;
        box-shadow: 0 4px 12px var(--shadow);
        z-index: 5000;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

// Pull to Refresh (for mobile)
let startY = 0;
let isPulling = false;

const contentArea = document.querySelector('.content-area');

contentArea?.addEventListener('touchstart', (e) => {
    if (contentArea.scrollTop === 0) {
        startY = e.touches[0].pageY;
        isPulling = true;
    }
});

contentArea?.addEventListener('touchmove', (e) => {
    if (!isPulling) return;
    
    const currentY = e.touches[0].pageY;
    const diff = currentY - startY;
    
    if (diff > 0 && contentArea.scrollTop === 0) {
        e.preventDefault();
        
        if (diff > 100) {
            // Trigger refresh
            const refreshIndicator = document.createElement('div');
            refreshIndicator.className = 'pull-to-refresh show';
            refreshIndicator.innerHTML = '🔄';
            contentArea.appendChild(refreshIndicator);
            
            setTimeout(() => {
                refreshIndicator.classList.remove('show');
                setTimeout(() => {
                    contentArea.removeChild(refreshIndicator);
                    showToast('Feed refreshed!');
                }, 300);
            }, 1000);
            
            isPulling = false;
        }
    }
});

contentArea?.addEventListener('touchend', () => {
    isPulling = false;
});

// Update time in status bar
function updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    const timeElement = document.querySelector('.time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

updateTime();
setInterval(updateTime, 60000);

// Search functionality
const searchInput = document.querySelector('.search-input');
searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length > 2) {
        // Simulate search
        console.log('Searching for:', query);
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + K for search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('[data-tab="discover"]')?.click();
        setTimeout(() => {
            document.querySelector('.search-input')?.focus();
        }, 100);
    }
    
    // Cmd/Ctrl + N for new post
    if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        document.querySelector('[data-tab="create"]')?.click();
        setTimeout(() => {
            document.querySelector('.post-textarea')?.focus();
        }, 100);
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    showToast('Back online!');
});

window.addEventListener('offline', () => {
    showToast('You are offline');
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check if running as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
        document.body.classList.add('pwa-mode');
    }
    
    // Set theme based on system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
    }
    
    // Listen for theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (e.matches) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
    
    console.log('VibeCaaS iOS PWA initialized');
});

// Smooth scroll behavior
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

// Add CSS animation for fade out
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);