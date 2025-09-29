// Quantum Particle Animation
function initQuantumParticles() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('quantum-particles');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    container.appendChild(canvas);
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(155, 89, 182, ${0.1 * (1 - distance / 150)})`;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Quantum Simulator
async function simulateQuantum() {
    const input = document.getElementById('quantumInput').value;
    const algorithm = document.getElementById('algorithmSelect').value;
    const resultDiv = document.getElementById('quantumResult');
    
    if (!input) {
        resultDiv.innerHTML = '<span style="color: #ff6b6b;">Please enter a quantum state or value</span>';
        return;
    }
    
    resultDiv.innerHTML = '<div class="loading">Simulating quantum computation...</div>';
    
    try {
        const response = await fetch('/api/quantum/simulate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input, algorithm })
        });
        
        const data = await response.json();
        
        resultDiv.innerHTML = `
            <div style="color: #00d4ff;">Quantum Simulation Results:</div>
            <div style="margin-top: 10px;">
                <strong>Algorithm:</strong> ${data.algorithm}<br>
                <strong>Quantum State:</strong> ${data.quantumState}<br>
                <strong>Probability:</strong> ${(data.probability * 100).toFixed(2)}%<br>
                <strong>Entanglement:</strong> ${data.entanglement ? 'Yes' : 'No'}<br>
                <strong>Coherence:</strong> ${(data.coherence * 100).toFixed(2)}%
            </div>
        `;
        
        drawQuantumVisualization(data);
    } catch (error) {
        resultDiv.innerHTML = '<span style="color: #ff6b6b;">Error: Unable to simulate quantum computation</span>';
    }
}

// Quantum Visualization
function drawQuantumVisualization(data) {
    const canvas = document.getElementById('quantumVisualizer');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw quantum state visualization
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;
    
    // Bloch sphere representation
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(centerX - radius - 20, centerY);
    ctx.lineTo(centerX + radius + 20, centerY);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 20);
    ctx.lineTo(centerX, centerY + radius + 20);
    ctx.stroke();
    
    // Draw quantum state vector
    const angle = data.probability * Math.PI * 2;
    const x = centerX + Math.cos(angle) * radius * 0.8;
    const y = centerY + Math.sin(angle) * radius * 0.8;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#9b59b6';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw state point
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#9b59b6';
    ctx.fill();
    
    // Draw probability amplitude bars
    const barWidth = 30;
    const barSpacing = 40;
    const startX = centerX + radius + 60;
    
    for (let i = 0; i < 4; i++) {
        const height = Math.random() * 100 + 20;
        const x = startX + i * barSpacing;
        const y = centerY + 50 - height;
        
        ctx.fillStyle = `rgba(0, 212, 255, ${0.3 + i * 0.2})`;
        ctx.fillRect(x, y, barWidth, height);
        
        ctx.fillStyle = '#666';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`|${i}⟩`, x + barWidth / 2, centerY + 70);
    }
}

// AI Generator
async function generateAI() {
    const prompt = document.getElementById('aiPrompt').value;
    const maxTokens = document.getElementById('maxTokens').value;
    const resultDiv = document.getElementById('aiResult');
    
    if (!prompt) {
        resultDiv.innerHTML = '<span style="color: #ff6b6b;">Please enter a prompt</span>';
        return;
    }
    
    resultDiv.innerHTML = '<div class="loading">Generating AI response...</div>';
    
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
            <div style="color: #00d4ff;">AI Generated Response:</div>
            <div style="margin-top: 10px; line-height: 1.6;">
                ${data.response}
            </div>
            <div style="margin-top: 15px; color: #666; font-size: 0.9rem;">
                Model: ${data.model} | Tokens: ${data.tokens}
            </div>
        `;
    } catch (error) {
        resultDiv.innerHTML = '<span style="color: #ff6b6b;">Error: Unable to generate AI response</span>';
    }
}

// Analytics
async function refreshAnalytics() {
    try {
        const response = await fetch('/api/analytics');
        const data = await response.json();
        
        // Animate counter update
        animateCounter('totalRequests', data.totalRequests);
        animateCounter('activeUsers', data.activeUsers);
        animateCounter('quantumSims', data.quantumSimulations);
        animateCounter('aiGens', data.aiGenerations);
    } catch (error) {
        console.error('Failed to fetch analytics:', error);
    }
}

// Animate counter
function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    const currentValue = parseInt(element.textContent) || 0;
    const increment = (targetValue - currentValue) / 30;
    let current = currentValue;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= targetValue) || (increment < 0 && current <= targetValue)) {
            element.textContent = targetValue.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 30);
}

// Smooth scroll
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Check platform status
async function checkStatus() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        console.log('Platform Status:', data);
    } catch (error) {
        console.error('Failed to check status:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initQuantumParticles();
    refreshAnalytics();
    checkStatus();
    
    // Auto-refresh analytics every 10 seconds
    setInterval(refreshAnalytics, 10000);
    
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
});