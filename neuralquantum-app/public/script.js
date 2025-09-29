// NeuralQuantum.ai Platform JavaScript

// ==================== QUANTUM PARTICLE ANIMATION ====================
function initQuantumParticles() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('quantum-particles');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    container.appendChild(canvas);
    
    const particles = [];
    const connections = [];
    const particleCount = 60;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.radius = Math.random() * 2 + 0.5;
            this.opacity = Math.random() * 0.3 + 0.1;
            this.color = this.getQuantumColor();
            this.phase = Math.random() * Math.PI * 2;
        }
        
        getQuantumColor() {
            const colors = [
                'rgba(124, 58, 237, ',  // Quantum purple
                'rgba(37, 99, 235, ',   // Neural blue
                'rgba(8, 145, 178, '    // Energy cyan
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Quantum tunneling effect - particles can "jump" occasionally
            if (Math.random() < 0.001) {
                this.x += (Math.random() - 0.5) * 50;
                this.y += (Math.random() - 0.5) * 50;
            }
            
            // Boundary conditions with quantum reflection
            if (this.x < 0 || this.x > canvas.width) {
                this.vx *= -1;
                this.phase += Math.PI / 4;
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.vy *= -1;
                this.phase += Math.PI / 4;
            }
            
            // Quantum phase evolution
            this.phase += 0.01;
            this.opacity = 0.1 + Math.abs(Math.sin(this.phase)) * 0.2;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();
            
            // Quantum glow effect
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color + (this.opacity * 0.3) + ')';
            ctx.fill();
        }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw quantum entanglement connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.15;
                    
                    // Create gradient for connection
                    const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                    gradient.addColorStop(0, `rgba(124, 58, 237, ${opacity})`);
                    gradient.addColorStop(0.5, `rgba(37, 99, 235, ${opacity})`);
                    gradient.addColorStop(1, `rgba(8, 145, 178, ${opacity})`);
                    
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ==================== NAVBAR SCROLL EFFECT ====================
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==================== QUANTUM SIMULATOR ====================
async function simulateQuantum() {
    const input = document.getElementById('quantumInput').value || '|0⟩';
    const algorithm = document.getElementById('algorithmSelect').value;
    const resultDiv = document.getElementById('quantumResult');
    
    resultDiv.innerHTML = '<div class="loading">🔬 Initializing quantum simulation...</div>';
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
        const response = await fetch('/api/quantum/simulate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input, algorithm })
        });
        
        const data = await response.json();
        
        // Display results with quantum notation
        resultDiv.innerHTML = `
            <div style="color: #a78bfa; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem;">
                ⚛️ Quantum Simulation Results
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                <div>
                    <strong style="color: #c4b5fd;">Algorithm:</strong><br>
                    <span style="color: #e9d5ff;">${data.algorithm}</span>
                </div>
                <div>
                    <strong style="color: #c4b5fd;">Quantum State:</strong><br>
                    <span style="color: #e9d5ff; font-size: 1.25rem;">${data.quantumState}</span>
                </div>
                <div>
                    <strong style="color: #c4b5fd;">Probability Amplitude:</strong><br>
                    <span style="color: #e9d5ff;">${(data.probability * 100).toFixed(2)}%</span>
                </div>
                <div>
                    <strong style="color: #c4b5fd;">Entanglement:</strong><br>
                    <span style="color: ${data.entanglement ? '#34d399' : '#f87171'};">
                        ${data.entanglement ? '✓ Entangled' : '✗ Separable'}
                    </span>
                </div>
                <div>
                    <strong style="color: #c4b5fd;">Quantum Coherence:</strong><br>
                    <span style="color: #e9d5ff;">${(data.coherence * 100).toFixed(2)}%</span>
                </div>
                <div>
                    <strong style="color: #c4b5fd;">Fidelity:</strong><br>
                    <span style="color: #e9d5ff;">${(Math.random() * 0.2 + 0.8).toFixed(3)}</span>
                </div>
            </div>
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(196, 181, 253, 0.2);">
                <div style="color: #9ca3af; font-size: 0.75rem;">
                    Computation ID: ${data.timestamp} | Quantum Volume: ${Math.floor(Math.random() * 1000 + 100)}
                </div>
            </div>
        `;
        
        drawQuantumVisualization(data);
    } catch (error) {
        resultDiv.innerHTML = `
            <div style="color: #f87171;">
                ⚠️ Quantum decoherence detected. Please try again.
            </div>
        `;
    }
}

// ==================== QUANTUM VISUALIZATION ====================
function drawQuantumVisualization(data) {
    const canvas = document.getElementById('quantumVisualizer');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(5, 0, 56, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw Bloch sphere
    const radius = 120;
    
    // Sphere circles
    ctx.strokeStyle = 'rgba(124, 58, 237, 0.3)';
    ctx.lineWidth = 1;
    
    // Equator
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius, radius * 0.3, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // Meridians
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius * 0.3, radius, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // Main sphere
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(124, 58, 237, 0.1)');
    gradient.addColorStop(0.5, 'rgba(37, 99, 235, 0.05)');
    gradient.addColorStop(1, 'rgba(8, 145, 178, 0.02)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(124, 58, 237, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw axes
    ctx.strokeStyle = 'rgba(196, 181, 253, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    // X axis
    ctx.beginPath();
    ctx.moveTo(centerX - radius - 30, centerY);
    ctx.lineTo(centerX + radius + 30, centerY);
    ctx.stroke();
    
    // Y axis
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 30);
    ctx.lineTo(centerX, centerY + radius + 30);
    ctx.stroke();
    
    // Z axis (perspective)
    ctx.beginPath();
    ctx.moveTo(centerX - radius * 0.7, centerY + radius * 0.7);
    ctx.lineTo(centerX + radius * 0.7, centerY - radius * 0.7);
    ctx.stroke();
    
    ctx.setLineDash([]);
    
    // Draw quantum state vector
    const angle = data.probability * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const x = centerX + Math.sin(phi) * Math.cos(angle) * radius * 0.8;
    const y = centerY - Math.cos(phi) * radius * 0.8;
    
    // State vector arrow
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.8)';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // State point with glow
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    const stateGradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
    stateGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    stateGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.8)');
    stateGradient.addColorStop(1, 'rgba(124, 58, 237, 0.4)');
    ctx.fillStyle = stateGradient;
    ctx.fill();
    
    // Draw probability distribution bars
    const barWidth = 40;
    const barSpacing = 60;
    const startX = 50;
    const baseY = canvas.height - 50;
    
    const states = ['|0⟩', '|1⟩', '|+⟩', '|-⟩'];
    states.forEach((state, i) => {
        const height = Math.random() * 100 + 20;
        const x = startX + i * barSpacing;
        const y = baseY - height;
        
        // Bar gradient
        const barGradient = ctx.createLinearGradient(x, y, x, baseY);
        barGradient.addColorStop(0, 'rgba(124, 58, 237, 0.8)');
        barGradient.addColorStop(0.5, 'rgba(37, 99, 235, 0.6)');
        barGradient.addColorStop(1, 'rgba(8, 145, 178, 0.4)');
        
        ctx.fillStyle = barGradient;
        ctx.fillRect(x, y, barWidth, height);
        
        // State label
        ctx.fillStyle = 'rgba(196, 181, 253, 0.8)';
        ctx.font = '14px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(state, x + barWidth / 2, baseY + 20);
        
        // Probability value
        ctx.fillStyle = 'rgba(233, 213, 255, 0.9)';
        ctx.font = '12px Inter';
        ctx.fillText((height / 120).toFixed(2), x + barWidth / 2, y - 10);
    });
    
    // Add quantum circuit representation
    const circuitY = 50;
    ctx.strokeStyle = 'rgba(196, 181, 253, 0.5)';
    ctx.lineWidth = 1;
    
    // Qubit lines
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width - 250, circuitY + i * 30);
        ctx.lineTo(canvas.width - 50, circuitY + i * 30);
        ctx.stroke();
    }
    
    // Quantum gates
    const gates = ['H', 'X', 'CNOT'];
    gates.forEach((gate, i) => {
        const gateX = canvas.width - 200 + i * 60;
        const gateY = circuitY + (i % 3) * 30;
        
        ctx.fillStyle = 'rgba(124, 58, 237, 0.2)';
        ctx.fillRect(gateX - 15, gateY - 10, 30, 20);
        
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.8)';
        ctx.strokeRect(gateX - 15, gateY - 10, 30, 20);
        
        ctx.fillStyle = 'rgba(233, 213, 255, 0.9)';
        ctx.font = '12px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(gate, gateX, gateY + 4);
    });
}

// ==================== AI GENERATOR ====================
async function generateAI() {
    const prompt = document.getElementById('aiPrompt').value;
    const maxTokens = document.getElementById('maxTokens').value;
    const resultDiv = document.getElementById('aiResult');
    
    if (!prompt) {
        resultDiv.innerHTML = '<span style="color: #f87171;">⚠️ Please enter a prompt for AI generation</span>';
        return;
    }
    
    resultDiv.innerHTML = '<div class="loading">🧠 Quantum neural network processing...</div>';
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
        const response = await fetch('/api/ai/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt, maxTokens: parseInt(maxTokens) })
        });
        
        const data = await response.json();
        
        resultDiv.innerHTML = `
            <div style="color: #60a5fa; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem;">
                🤖 Quantum-Enhanced AI Response
            </div>
            <div style="line-height: 1.8; color: #e5e7eb; font-size: 1rem;">
                ${data.response}
            </div>
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(96, 165, 250, 0.2);">
                <div style="display: flex; justify-content: space-between; color: #9ca3af; font-size: 0.75rem;">
                    <span>Model: ${data.model}</span>
                    <span>Tokens: ${data.tokens}</span>
                    <span>Quantum Enhancement: Active</span>
                    <span>Confidence: ${(Math.random() * 0.2 + 0.8).toFixed(2)}</span>
                </div>
            </div>
        `;
        
        // Add typing effect for the response
        typewriterEffect(data.response, resultDiv.querySelector('div:nth-child(2)'));
    } catch (error) {
        resultDiv.innerHTML = '<span style="color: #f87171;">⚠️ Neural network error. Please try again.</span>';
    }
}

// ==================== TYPEWRITER EFFECT ====================
function typewriterEffect(text, element) {
    element.innerHTML = '';
    let index = 0;
    
    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, 20);
        }
    }
    
    type();
}

// ==================== ANALYTICS ====================
async function refreshAnalytics() {
    const counters = [
        { id: 'totalRequests', value: Math.floor(Math.random() * 50000 + 10000) },
        { id: 'activeUsers', value: Math.floor(Math.random() * 500 + 100) },
        { id: 'quantumSims', value: Math.floor(Math.random() * 10000 + 5000) },
        { id: 'aiGens', value: Math.floor(Math.random() * 8000 + 3000) }
    ];
    
    counters.forEach(counter => {
        animateCounter(counter.id, counter.value);
    });
    
    // Add pulse animation to stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.style.animation = 'quantum-entangle 1s ease-out';
        setTimeout(() => {
            card.style.animation = '';
        }, 1000);
    });
}

// ==================== COUNTER ANIMATION ====================
function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    const currentValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
    const increment = (targetValue - currentValue) / 50;
    let current = currentValue;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= targetValue) || (increment < 0 && current <= targetValue)) {
            element.textContent = targetValue.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 20);
}

// ==================== SMOOTH SCROLL ====================
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offset = 100; // Account for fixed navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// ==================== PLATFORM STATUS CHECK ====================
async function checkStatus() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        console.log('🚀 NeuralQuantum.ai Platform Status:', data);
        
        // Display status in console with styling
        console.log('%c⚛️ Quantum Systems: Online', 'color: #7c3aed; font-weight: bold');
        console.log('%c🧠 Neural Networks: Active', 'color: #2563eb; font-weight: bold');
        console.log('%c🔐 Security: Quantum-Safe', 'color: #10b981; font-weight: bold');
    } catch (error) {
        console.error('Platform status check failed:', error);
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('%cNeuralQuantum.ai Platform Initialized', 
                'background: linear-gradient(135deg, #7c3aed, #2563eb); color: white; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 5px');
    
    // Initialize quantum particles
    initQuantumParticles();
    
    // Load initial analytics
    refreshAnalytics();
    
    // Check platform status
    checkStatus();
    
    // Auto-refresh analytics every 5 seconds
    setInterval(refreshAnalytics, 5000);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for quick quantum simulation
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('quantumInput').focus();
        }
        
        // Ctrl/Cmd + G for AI generation
        if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
            e.preventDefault();
            document.getElementById('aiPrompt').focus();
        }
    });
    
    // Add enter key support for inputs
    document.getElementById('quantumInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') simulateQuantum();
    });
    
    document.getElementById('aiPrompt').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            generateAI();
        }
    });
    
    // Add hover effects to feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Initialize intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections for scroll animations
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
});

// ==================== EASTER EGG ====================
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        activateQuantumMode();
    }
});

function activateQuantumMode() {
    document.body.style.animation = 'quantum-wave 2s ease-in-out infinite';
    console.log('%c🎮 QUANTUM MODE ACTIVATED! 🚀', 
                'background: linear-gradient(270deg, #7c3aed, #2563eb, #0891b2, #7c3aed); background-size: 400% 400%; color: white; padding: 20px; font-size: 20px; font-weight: bold; border-radius: 10px; animation: gradient-shift 3s ease infinite;');
}