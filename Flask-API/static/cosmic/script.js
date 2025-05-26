document.addEventListener('DOMContentLoaded', () => {
  // Setup the canvas for particle animation
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas dimensions
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  
  // Mouse position
  let mouse = {
    x: null,
    y: null,
    radius: 150 // Mouse influence radius
  };
  
  // Update mouse position
  window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });
  
  // Reset mouse position when out of canvas
  window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
  });
  
  // Particle class
  class Particle {
    constructor() {
      // Initial position
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      
      // Size
      this.size = Math.random() * 3 + 1;
      
      // Velocity - FURTHER REDUCED for even slower movement
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
      
      // Colors - Changed to be more cosmic/sky themed
      this.color = `rgba(173, 216, 230, ${Math.random() * 0.5 + 0.5})`;
      
      // Visibility
      this.visible = true;
      this.visibilityTimer = 0;
      this.disappearTime = Math.floor(Math.random() * 300) + 1000; // Increased time visible
    }
    
    // Update particle position
    update() {
      // Handle visibility timing
      this.visibilityTimer++;
      
      // Toggle visibility randomly
      if (this.visibilityTimer > this.disappearTime) {
        this.visible = !this.visible;
        this.visibilityTimer = 0;
        this.disappearTime = Math.floor(Math.random() * 300) + (this.visible ? 800 : 200); // Longer visible periods
      }
      
      // Only update position if visible
      if (this.visible) {
        // Check for mouse proximity
        if (mouse.x !== undefined && mouse.y !== undefined) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Influence particle movement based on mouse position
          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            
            // Push particles away from cursor (reduced strength)
            this.vx -= forceDirectionX * force * 0.1;
            this.vy -= forceDirectionY * force * 0.1;
          }
        }
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Boundary checks
        if (this.x < 0 || this.x > canvas.width) {
          this.vx = -this.vx;
        }
        
        if (this.y < 0 || this.y > canvas.height) {
          this.vy = -this.vy;
        }
      }
    }
    
    // Draw particle
    draw() {
      if (this.visible) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
  }
  
  // Create particles array
  const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000)); // Reduced count
  let particles = [];
  
  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  
  // Connect particles with lines - ENHANCED to light up when near cursor
  function connectParticles() {
    const maxDistance = 150;
    const highlightDistance = 100; // Define a distance for highlighting
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        if (!particles[i].visible || !particles[j].visible) continue;
        
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          let lineColor = `rgba(173, 216, 230, ${(1 - (distance / maxDistance)) * 0.5})`;
          let lineWidth = 1;
          
          // Highlight lines near the mouse
          if (mouse.x !== undefined && mouse.y !== undefined) {
            const dxMouseI = mouse.x - particles[i].x;
            const dyMouseI = mouse.y - particles[i].y;
            const distanceMouseI = Math.sqrt(dxMouseI * dxMouseI + dyMouseI * dyMouseI);
            
            const dxMouseJ = mouse.x - particles[j].x;
            const dyMouseJ = mouse.y - particles[j].y;
            const distanceMouseJ = Math.sqrt(dxMouseJ * dxMouseJ + dyMouseJ * dyMouseJ);
            
            if (distanceMouseI < highlightDistance || distanceMouseJ < highlightDistance) {
              const highlightOpacity = 1 - (Math.min(distanceMouseI, distanceMouseJ) / highlightDistance);
              lineColor = `rgba(255, 255, 255, ${highlightOpacity * 0.8})`; // Brighter color when near cursor
              lineWidth = 1.5; // Slightly thicker line
            }
          }
          
          // Draw line between particles
          ctx.beginPath();
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = lineWidth;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }
  
  // Animation loop
  function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw each particle
    for (const particle of particles) {
      particle.update();
      particle.draw();
    }
    
    // Connect particles with lines
    connectParticles();
    
    // Request next frame
    requestAnimationFrame(animate);
  }
  
  // Initialize and start animation
  initParticles();
  animate();

  // Form submission handling (mock implementation)
  const form = document.getElementById('classificationForm');
  const resultContainer = document.getElementById('resultContainer');
  const resultText = document.getElementById('resultText');

  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent actual form submission
    
    const textInput = e.target.email_body.value;
    
    // Mock classification - in a real app, this would be an API call
    setTimeout(() => {
      // Simple mock classification based on text length
      let classification;
      if (textInput.toLowerCase().includes('spam') || textInput.toLowerCase().includes('offer') || textInput.toLowerCase().includes('free')) {
        classification = "Spam";
      } else if (textInput.toLowerCase().includes('meeting') || textInput.toLowerCase().includes('report')) {
        classification = "Business";
      } else if (textInput.toLowerCase().includes('hello') || textInput.toLowerCase().includes('hi') || textInput.length < 20) {
        classification = "Personal";
      } else {
        classification = "Other";
      }
      
      // Display result
      resultText.textContent = `Classification: ${classification}`;
      resultContainer.style.display = 'block';
    }, 500); // Simulate processing time
  });
});