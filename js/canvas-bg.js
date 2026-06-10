class CyberNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.connections = [];
    this.packets = [];
    this.mouse = { x: null, y: null, radius: 120 };
    
    this.colors = {
      node: '#38bdf8', // Cyber Blue
      line: 'rgba(56, 189, 248, 0.08)',
      lineActive: 'rgba(56, 189, 248, 0.25)',
      packet: '#22c55e', // Neon Green
      text: '#64748b'
    };

    this.init();
    this.addEventListeners();
    this.animate();
  }

  init() {
    this.resize();
    this.nodes = [];
    this.packets = [];

    // Node count based on screen width (less nodes on mobile for performance)
    const nodeCount = Math.min(60, Math.floor((this.width * this.height) / 18000));
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        originX: null,
        originY: null,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.5,
        pulse: Math.random() * Math.PI,
        pulseSpeed: 0.02 + Math.random() * 0.02,
        label: this.generateRandomIP(),
        activity: Math.random()
      });
    }

    // Capture original positions
    this.nodes.forEach(n => {
      n.originX = n.x;
      n.originY = n.y;
    });

    // Create packets initially
    for (let i = 0; i < 8; i++) {
      this.spawnPacket();
    }
  }

  generateRandomIP() {
    // Generate simulated server label
    const sub = Math.floor(Math.random() * 254) + 1;
    return `NCV.NODE.0x${sub.toString(16).toUpperCase()}`;
  }

  resize() {
    this.width = this.canvas.offsetWidth;
    this.height = this.canvas.offsetHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  addEventListeners() {
    window.addEventListener('resize', () => {
      // Debounce resize
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.resize();
        this.init();
      }, 200);
    });

    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  spawnPacket() {
    if (this.nodes.length < 2) return;
    
    // Pick two random nodes
    const fromIndex = Math.floor(Math.random() * this.nodes.length);
    let toIndex = Math.floor(Math.random() * this.nodes.length);
    while (toIndex === fromIndex) {
      toIndex = Math.floor(Math.random() * this.nodes.length);
    }
    
    const nodeFrom = this.nodes[fromIndex];
    const nodeTo = this.nodes[toIndex];
    
    // Only connect if distance is reasonable
    const dx = nodeFrom.x - nodeTo.x;
    const dy = nodeFrom.y - nodeTo.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 280) {
      this.packets.push({
        from: nodeFrom,
        to: nodeTo,
        progress: 0,
        speed: (0.8 + Math.random() * 1.2) / dist, // proportional to distance
        size: Math.random() * 1.5 + 1
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // 1. Update and draw nodes
    this.nodes.forEach(node => {
      // Pulse animation
      node.pulse += node.pulseSpeed;
      const pulseRadius = node.radius + Math.sin(node.pulse) * 0.8;
      
      // Physics move
      node.x += node.vx;
      node.y += node.vy;
      
      // Bounce off boundaries
      if (node.x < 0 || node.x > this.width) node.vx *= -1;
      if (node.y < 0 || node.y > this.height) node.vy *= -1;
      
      // Mouse interaction (Repulsion)
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = node.x - this.mouse.x;
        const dy = node.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          const angle = Math.atan2(dy, dx);
          
          // Gently push node away
          node.x += Math.cos(angle) * force * 1.5;
          node.y += Math.sin(angle) * force * 1.5;
        }
      }

      // Draw node core
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.colors.node;
      this.ctx.fill();

      // Draw active node ring
      if (node.activity > 0.7) {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, pulseRadius + 3, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();
      }

      // Draw server name on hover/close-by mouse
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = node.x - this.mouse.x;
        const dy = node.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 60) {
          this.ctx.font = '8px "JetBrains Mono"';
          this.ctx.fillStyle = this.colors.text;
          this.ctx.fillText(node.label, node.x + 6, node.y + 3);
        }
      }
    });

    // 2. Draw connections
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const n1 = this.nodes[i];
        const n2 = this.nodes[j];
        
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 180) {
          // Connections glow when mouse is near
          let lineOpacity = (180 - dist) / 180 * 0.1;
          
          if (this.mouse.x !== null && this.mouse.y !== null) {
            const mDist1 = Math.sqrt((n1.x - this.mouse.x)**2 + (n1.y - this.mouse.y)**2);
            const mDist2 = Math.sqrt((n2.x - this.mouse.x)**2 + (n2.y - this.mouse.y)**2);
            if (mDist1 < this.mouse.radius || mDist2 < this.mouse.radius) {
              lineOpacity *= 2.5;
            }
          }

          this.ctx.beginPath();
          this.ctx.moveTo(n1.x, n1.y);
          this.ctx.lineTo(n2.x, n2.y);
          this.ctx.strokeStyle = `rgba(56, 189, 248, ${lineOpacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }

    // 3. Update and draw packets
    this.packets.forEach((packet, index) => {
      packet.progress += packet.speed;
      
      if (packet.progress >= 1) {
        // Remove completed packets and spawn a new one
        this.packets.splice(index, 1);
        this.spawnPacket();
        return;
      }

      // Calculate position
      const px = packet.from.x + (packet.to.x - packet.from.x) * packet.progress;
      const py = packet.from.y + (packet.to.y - packet.from.y) * packet.progress;

      // Draw packet
      this.ctx.beginPath();
      this.ctx.arc(px, py, packet.size, 0, Math.PI * 2);
      this.ctx.fillStyle = this.colors.packet;
      this.ctx.shadowBlur = 4;
      this.ctx.shadowColor = this.colors.packet;
      this.ctx.fill();
      // Reset shadow
      this.ctx.shadowBlur = 0;
    });

    // Make sure we have enough active packets
    if (this.packets.length < 12 && Math.random() < 0.05) {
      this.spawnPacket();
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Instantiate on load
window.addEventListener('load', () => {
  new CyberNetwork('heroCanvas');
});
