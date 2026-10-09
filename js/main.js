/**
 * ============================================================================
 * AHMED HAMDY — FLUTTER DEVELOPER PORTFOLIO
 * Main JavaScript Engine (Vanilla JS, 0 External Libraries)
 * 
 * Modules:
 * 1. Global Particle Canvas (Sky-Cyan Electron Particles & Flowing Trail)
 * 2. Mouse Glow Cursor Follower
 * 3. Sticky Navigation & ScrollSpy (Active Link Indicator)
 * 4. Mobile Hamburger Drawer & Accessibility
 * 5. Hero Dart Code Typing Engine (Syntax Highlighted)
 * 6. Interactive Skills Network Canvas (Nodes, Physics & Connections)
 * 7. 3D Project Card Tilt & Dynamic Spotlight
 * 8. Contact Section Interactive Converging Canvas
 * 9. Scroll Reveal Animations (IntersectionObserver)
 * 10. Copy-to-Clipboard Utility
 * ============================================================================
 */

(function () {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------------------
     1. GLOBAL PARTICLE CANVAS (Sky-Cyan Electrons & Ambient Glow)
     -------------------------------------------------------------------------- */
  const globalCanvasModule = (function () {
    const canvas = document.getElementById('global-particles-canvas');
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrameId = null;
    let isVisible = true;

    // Mouse coordinate tracker with smooth lerp
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, radius: 140 };

    // Particle Array
    const particles = [];
    const MAX_PARTICLES_DESKTOP = 45;
    const MAX_PARTICLES_MOBILE = 20;

    class Particle {
      constructor(w, h) {
        this.reset(w, h, true);
      }

      reset(w, h, randomize = false) {
        this.x = randomize ? Math.random() * w : (Math.random() > 0.5 ? 0 : w);
        this.y = randomize ? Math.random() * h : Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.size = Math.random() * 2.2 + 0.8;
        this.baseAlpha = Math.random() * 0.5 + 0.2;
        this.alpha = this.baseAlpha;
        this.pulseSpeed = 0.02 + Math.random() * 0.02;
        this.pulseAngle = Math.random() * Math.PI * 2;
        // Electron sky-cyan with occasional crimson ember
        this.isCyan = Math.random() > 0.15;
      }

      update(w, h) {
        this.pulseAngle += this.pulseSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.pulseAngle) * 0.18;

        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries smoothly
        if (this.x < -10) this.x = w + 10;
        if (this.x > w + 10) this.x = -10;
        if (this.y < -10) this.y = h + 10;
        if (this.y > h + 10) this.y = -10;

        // Mouse interaction: gentle repulsion / electron field
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 1.5;
          this.y -= Math.sin(angle) * force * 1.5;
        }
      }

      draw(c) {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        if (this.isCyan) {
          c.fillStyle = `rgba(0, 229, 255, ${Math.max(0.05, this.alpha)})`;
          c.shadowColor = '#00E5FF';
          c.shadowBlur = 6;
        } else {
          c.fillStyle = `rgba(188, 2, 2, ${Math.max(0.05, this.alpha * 0.9)})`;
          c.shadowColor = '#BC0202';
          c.shadowBlur = 5;
        }
        c.fill();
        c.restore();
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Adjust particle cap
      const targetCount = width < 768 ? MAX_PARTICLES_MOBILE : MAX_PARTICLES_DESKTOP;
      particles.length = 0;
      for (let i = 0; i < targetCount; i++) {
        particles.push(new Particle(width, height));
      }
    }

    // Connect close electron particles with faint sky-cyan lines
    function drawConnections() {
      const maxDist = width < 768 ? 85 : 125;
      const count = particles.length;

      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.16;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }
    }

    function loop() {
      if (!isVisible) return;

      // Smooth lerp for mouse coordinates
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      ctx.clearRect(0, 0, width, height);

      // Render electron particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(width, height);
        particles[i].draw(ctx);
      }

      drawConnections();

      animationFrameId = requestAnimationFrame(loop);
    }

    function init() {
      resize();
      window.addEventListener('resize', resize, { passive: true });

      window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
      }, { passive: true });

      // Touch coordinates support
      window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          mouse.targetX = e.touches[0].clientX;
          mouse.targetY = e.touches[0].clientY;
        }
      }, { passive: true });

      window.addEventListener('touchend', () => {
        mouse.targetX = -1000;
        mouse.targetY = -1000;
      }, { passive: true });

      // Page visibility pause/resume
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          isVisible = false;
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
        } else {
          isVisible = true;
          loop();
        }
      });

      loop();
    }

    init();
  })();

  /* --------------------------------------------------------------------------
     2. MOUSE GLOW OVERLAY FOLLOWER (Sky-Cyan)
     -------------------------------------------------------------------------- */
  (function initMouseGlow() {
    const mouseGlow = document.getElementById('mouse-glow');
    if (!mouseGlow || prefersReducedMotion) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    }, { passive: true });

    function renderGlow() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      mouseGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(renderGlow);
    }

    renderGlow();
  })();

  /* --------------------------------------------------------------------------
     3. STICKY NAVIGATION & SCROLLSPY
     -------------------------------------------------------------------------- */
  (function initNavigation() {
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function handleScroll() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      // Header glassmorphic background toggle
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Active Section ScrollSpy
      let currentSectionId = '';
      const offset = header ? header.offsetHeight + 100 : 120;

      sections.forEach((section) => {
        const top = section.offsetTop - offset;
        const height = section.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          currentSectionId = section.getAttribute('id');
        }
      });

      if (currentSectionId) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
          }
        });
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  })();

  /* --------------------------------------------------------------------------
     4. MOBILE HAMBURGER MENU & ACCESSIBILITY
     -------------------------------------------------------------------------- */
  (function initMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburgerBtn || !navMenu) return;

    function toggleMenu(forceOpen) {
      const isOpen = typeof forceOpen === 'boolean' 
        ? forceOpen 
        : hamburgerBtn.getAttribute('aria-expanded') === 'true';

      const nextState = !isOpen;
      hamburgerBtn.setAttribute('aria-expanded', String(nextState));
      
      if (nextState) {
        navMenu.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      } else {
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    hamburgerBtn.addEventListener('click', () => toggleMenu());

    // Close when clicking nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          toggleMenu(false);
        }
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburgerBtn.contains(e.target)
      ) {
        toggleMenu(false);
      }
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMenu(false);
        hamburgerBtn.focus();
      }
    });
  })();

  /* --------------------------------------------------------------------------
     5. HERO DART CODE TYPING ENGINE
     -------------------------------------------------------------------------- */
  (function initHeroCodeTyping() {
    const codeContainer = document.getElementById('hero-typing-code');
    if (!codeContainer) return;

    // Flutter / Dart code snippet with semantic tokens for syntax highlighting
    const dartTokens = [
      { type: 'keyword', text: 'import' },
      { type: 'plain', text: ' ' },
      { type: 'string', text: "'package:flutter/material.dart'" },
      { type: 'plain', text: ';\n\n' },

      { type: 'keyword', text: 'class' },
      { type: 'plain', text: ' ' },
      { type: 'class', text: 'AhmedHamdy' },
      { type: 'plain', text: ' ' },
      { type: 'keyword', text: 'extends' },
      { type: 'plain', text: ' ' },
      { type: 'class', text: 'FlutterDeveloper' },
      { type: 'plain', text: ' {\n' },

      { type: 'plain', text: '  ' },
      { type: 'keyword', text: 'final' },
      { type: 'plain', text: ' ' },
      { type: 'class', text: 'String' },
      { type: 'plain', text: ' focus = ' },
      { type: 'string', text: "'Clean Architecture & 60 FPS'" },
      { type: 'plain', text: ';\n\n' },

      { type: 'plain', text: '  ' },
      { type: 'comment', text: '// Core toolkit & state management\n' },

      { type: 'plain', text: '  ' },
      { type: 'keyword', text: 'final' },
      { type: 'plain', text: ' ' },
      { type: 'class', text: 'List' },
      { type: 'plain', text: '<' },
      { type: 'class', text: 'String' },
      { type: 'plain', text: '> stack = [\n' },
      { type: 'plain', text: '    ' },
      { type: 'string', text: "'Flutter'" },
      { type: 'plain', text: ', ' },
      { type: 'string', text: "'Dart'" },
      { type: 'plain', text: ', ' },
      { type: 'string', text: "'Bloc/Cubit'" },
      { type: 'plain', text: ', ' },
      { type: 'string', text: "'Dio & REST'" },
      { type: 'plain', text: ',\n  ];\n\n' },

      { type: 'plain', text: '  @' },
      { type: 'func', text: 'override' },
      { type: 'plain', text: '\n  ' },
      { type: 'class', text: 'Widget' },
      { type: 'plain', text: ' ' },
      { type: 'func', text: 'build' },
      { type: 'plain', text: '(' },
      { type: 'class', text: 'BuildContext' },
      { type: 'plain', text: ' context) {\n' },

      { type: 'plain', text: '    ' },
      { type: 'keyword', text: 'return' },
      { type: 'plain', text: ' ' },
      { type: 'class', text: 'SeamlessMobileExperience' },
      { type: 'plain', text: '(\n' },
      { type: 'plain', text: '      platforms: [' },
      { type: 'string', text: "'iOS'" },
      { type: 'plain', text: ', ' },
      { type: 'string', text: "'Android'" },
      { type: 'plain', text: '],\n' },
      { type: 'plain', text: '      architecture: ' },
      { type: 'class', text: 'Architecture' },
      { type: 'plain', text: '.' },
      { type: 'prop', text: 'clean' },
      { type: 'plain', text: ',\n' },
      { type: 'plain', text: '      quality: ' },
      { type: 'class', text: 'Quality' },
      { type: 'plain', text: '.' },
      { type: 'prop', text: 'productionReady' },
      { type: 'plain', text: ',\n' },
      { type: 'plain', text: '    );\n  }\n}' }
    ];

    let currentTokenIndex = 0;
    let currentCharIndex = 0;
    let currentSpan = null;
    let typingSpeed = 16; // Fast, smooth typing

    function createSpanForToken(token) {
      const span = document.createElement('span');
      if (token.type !== 'plain') {
        span.className = `code-${token.type}`;
      }
      codeContainer.appendChild(span);
      return span;
    }

    function typeNextChar() {
      if (currentTokenIndex >= dartTokens.length) {
        // Typing finished; keep code statically highlighted
        return;
      }

      const token = dartTokens[currentTokenIndex];

      if (!currentSpan) {
        currentSpan = createSpanForToken(token);
      }

      currentSpan.textContent += token.text.charAt(currentCharIndex);
      currentCharIndex++;

      if (currentCharIndex >= token.text.length) {
        currentTokenIndex++;
        currentCharIndex = 0;
        currentSpan = null;
      }

      // Slightly longer pause on newlines and semicolons
      const char = token.text.charAt(currentCharIndex - 1);
      let delay = typingSpeed;
      if (char === '\n') delay = 50;
      else if (char === ';') delay = 40;

      setTimeout(typeNextChar, delay);
    }

    // Start typing after brief intro delay
    setTimeout(typeNextChar, 350);
  })();

  /* --------------------------------------------------------------------------
     6. INTERACTIVE SKILLS NETWORK CANVAS
     -------------------------------------------------------------------------- */
  (function initSkillsNetworkCanvas() {
    const canvas = document.getElementById('skills-canvas');
    const container = document.getElementById('skills-canvas-container');
    const tooltip = document.getElementById('skill-tooltip');
    const tooltipTitle = document.getElementById('tooltip-title');
    const tooltipDesc = document.getElementById('tooltip-desc');
    const activeLabel = document.getElementById('active-skill-label');

    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrameId = null;
    let isInView = false;

    // Mouse coordinates relative to canvas
    const mouse = { x: -1000, y: -1000, isHovering: false };
    let hoveredNode = null;

    // Skills network nodes definition
    const rawSkillsData = [
      { id: 'flutter', label: 'Flutter SDK', desc: 'Core multiplatform UI framework, Impeller & widgets', radius: 36, isCore: true, color: '#BC0202', angle: 0, dist: 0 },
      { id: 'dart', label: 'Dart 3.x', desc: 'Sound null-safety, async streams & pattern matching', radius: 26, isCore: false, color: '#00E5FF', angle: 0.2, dist: 150 },
      { id: 'bloc', label: 'Bloc / Cubit', desc: 'Predictable, reactive state management architecture', radius: 25, isCore: false, color: '#ff2a2a', angle: 0.8, dist: 165 },
      { id: 'clean', label: 'Clean Arch', desc: 'Decoupled domain, data, and presentation layers', radius: 25, isCore: false, color: '#BC0202', angle: 1.4, dist: 155 },
      { id: 'dio', label: 'Dio & REST', desc: 'Networking, interceptors, error handling & caching', radius: 23, isCore: false, color: '#00E5FF', angle: 2.1, dist: 160 },
      { id: 'firebase', label: 'Firebase', desc: 'Auth, Firestore, Cloud Messaging & Analytics', radius: 24, isCore: false, color: '#ffbd2e', angle: 2.7, dist: 175 },
      { id: 'hive', label: 'Hive & SQLite', desc: 'High-speed offline-first local storage & database', radius: 22, isCore: false, color: '#00E5FF', angle: 3.4, dist: 165 },
      { id: 'riverpod', label: 'Riverpod', desc: 'Compile-safe reactive state caching & dependency injection', radius: 22, isCore: false, color: '#ff2a2a', angle: 4.1, dist: 160 },
      { id: 'uiux', label: 'Material 3', desc: 'Pixel-perfect responsive design and custom micro-animations', radius: 23, isCore: false, color: '#BC0202', angle: 4.7, dist: 150 },
      { id: 'git', label: 'Git / CI-CD', desc: 'Version control, automated build workflows & pipelines', radius: 21, isCore: false, color: '#00E5FF', angle: 5.3, dist: 170 },
      { id: 'native', label: 'Platform Channels', desc: 'Native iOS (Swift) & Android (Kotlin) bridge communication', radius: 21, isCore: false, color: '#ff2a2a', angle: 5.9, dist: 160 },
    ];

    class SkillNode {
      constructor(data, centerX, centerY) {
        this.id = data.id;
        this.label = data.label;
        this.desc = data.desc;
        this.baseRadius = data.radius;
        this.radius = data.radius;
        this.isCore = data.isCore;
        this.color = data.color;
        this.angle = data.angle;
        this.orbitDist = data.dist;

        // Position & physics
        this.originX = centerX + Math.cos(this.angle) * this.orbitDist;
        this.originY = centerY + Math.sin(this.angle) * this.orbitDist * 0.75; // Slight ellipse
        this.x = this.originX;
        this.y = this.originY;
        this.vx = 0;
        this.vy = 0;
        this.floatOffset = Math.random() * Math.PI * 2;
        this.floatSpeed = 0.015 + Math.random() * 0.01;
      }

      update(centerX, centerY, time) {
        if (!this.isCore) {
          // Subtle orbital floating oscillation
          const floatX = Math.cos(time * this.floatSpeed + this.floatOffset) * 12;
          const floatY = Math.sin(time * this.floatSpeed + this.floatOffset) * 10;
          this.originX = centerX + Math.cos(this.angle) * this.orbitDist + floatX;
          this.originY = centerY + Math.sin(this.angle) * (this.orbitDist * 0.72) + floatY;
        } else {
          this.originX = centerX;
          this.originY = centerY;
        }

        // Spring physics towards origin
        const spring = 0.05;
        const damping = 0.82;

        const dx = this.originX - this.x;
        const dy = this.originY - this.y;
        this.vx += dx * spring;
        this.vy += dy * spring;

        // Mouse interaction: repel or hover attraction
        if (mouse.isHovering) {
          const mdx = mouse.x - this.x;
          const mdy = mouse.y - this.y;
          const mdist = Math.hypot(mdx, mdy);

          if (mdist < this.radius + 30) {
            // Slight attraction towards cursor on near-touch
            this.vx += mdx * 0.04;
            this.vy += mdy * 0.04;
          }
        }

        this.vx *= damping;
        this.vy *= damping;
        this.x += this.vx;
        this.y += this.vy;

        // Smooth scale transition when hovered
        const targetRadius = (hoveredNode === this) ? this.baseRadius * 1.25 : this.baseRadius;
        this.radius += (targetRadius - this.radius) * 0.15;
      }

      draw(c) {
        c.save();

        // Node Glow Shadow
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        if (this.isCore) {
          c.shadowColor = '#BC0202';
          c.shadowBlur = 24;
          c.fillStyle = '#BC0202';
        } else if (hoveredNode === this) {
          c.shadowColor = this.color;
          c.shadowBlur = 20;
          c.fillStyle = this.color;
        } else {
          c.shadowColor = 'rgba(0, 0, 0, 0.6)';
          c.shadowBlur = 10;
          c.fillStyle = '#161622';
        }

        c.fill();

        // Node Border
        c.lineWidth = this.isCore ? 3 : (hoveredNode === this ? 2.5 : 1.5);
        c.strokeStyle = this.isCore ? '#ff5f56' : (hoveredNode === this ? '#ffffff' : this.color);
        c.stroke();

        // Inner Pulsing Ring for Core
        if (this.isCore) {
          c.beginPath();
          c.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
          c.fillStyle = 'rgba(255, 255, 255, 0.15)';
          c.fill();
        }

        // Text Label
        c.shadowBlur = 0;
        c.font = this.isCore ? 'bold 12px "JetBrains Mono", monospace' : '500 11px "Inter", sans-serif';
        c.fillStyle = (hoveredNode === this || this.isCore) ? '#ffffff' : '#e6e6ea';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(this.label, this.x, this.y);

        c.restore();
      }
    }

    let nodes = [];

    function setupNodes() {
      const centerX = width / 2;
      const centerY = height / 2;

      // Scale orbit distances for responsive screens
      const scaleFactor = Math.min(width, height) / 520;
      nodes = rawSkillsData.map((item) => {
        const copy = { ...item, dist: item.dist * Math.max(0.65, Math.min(1.1, scaleFactor)) };
        return new SkillNode(copy, centerX, centerY);
      });
    }

    function resize() {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      setupNodes();
    }

    function drawLinks() {
      const coreNode = nodes.find((n) => n.isCore);
      if (!coreNode) return;

      // Connect every node to Flutter core
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.isCore) continue;

        const isHighlighted = (hoveredNode === node || hoveredNode === coreNode);

        ctx.beginPath();
        ctx.moveTo(coreNode.x, coreNode.y);
        ctx.lineTo(node.x, node.y);

        if (isHighlighted) {
          ctx.strokeStyle = 'rgba(0, 229, 255, 0.7)';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#00E5FF';
          ctx.shadowBlur = 10;
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
      }

      // Inter-satellite ring links
      for (let i = 1; i < nodes.length; i++) {
        const next = (i === nodes.length - 1) ? 1 : i + 1;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[next].x, nodes[next].y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    let time = 0;
    function render() {
      if (!isInView || prefersReducedMotion) return;

      time++;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      drawLinks();

      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update(centerX, centerY, time);
        nodes[i].draw(ctx);
      }

      animationFrameId = requestAnimationFrame(render);
    }

    function checkHover(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.x;
      const y = clientY - rect.y;
      mouse.x = x;
      mouse.y = y;
      mouse.isHovering = true;

      let found = null;
      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        const dist = Math.hypot(x - node.x, y - node.y);
        if (dist <= node.radius + 6) {
          found = node;
          break;
        }
      }

      hoveredNode = found;

      if (found) {
        activeLabel.textContent = `Node: ${found.label}`;
        tooltipTitle.textContent = found.label;
        tooltipDesc.textContent = found.desc;
        tooltip.style.left = `${found.x}px`;
        tooltip.style.top = `${found.y}px`;
        tooltip.classList.add('visible');
      } else {
        activeLabel.textContent = 'Hover any node';
        tooltip.classList.remove('visible');
      }
    }

    function initListeners() {
      canvas.addEventListener('mousemove', (e) => {
        checkHover(e.clientX, e.clientY);
      });

      canvas.addEventListener('mouseleave', () => {
        mouse.isHovering = false;
        hoveredNode = null;
        tooltip.classList.remove('visible');
        activeLabel.textContent = 'Hover any node';
      });

      canvas.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          checkHover(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      canvas.addEventListener('touchend', () => {
        setTimeout(() => {
          mouse.isHovering = false;
          hoveredNode = null;
          tooltip.classList.remove('visible');
        }, 1500);
      });

      window.addEventListener('resize', () => {
        resize();
        if (isInView) render();
      }, { passive: true });

      // IntersectionObserver: Only render when skills section is visible
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              isInView = true;
              render();
            } else {
              isInView = false;
              if (animationFrameId) cancelAnimationFrame(animationFrameId);
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(container);
    }

    resize();
    initListeners();
  })();

  /* --------------------------------------------------------------------------
     7. 3D PROJECT CARD TILT & DYNAMIC SPOTLIGHT
     -------------------------------------------------------------------------- */
  (function initProject3DTilt() {
    if (prefersReducedMotion) return;

    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach((card) => {
      let bounds = null;

      function updateBounds() {
        bounds = card.getBoundingClientRect();
      }

      function handleMouseMove(e) {
        if (!bounds) updateBounds();

        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        // Normalized offsets from center (-1 to 1)
        const xPercent = (mouseX / bounds.width) * 2 - 1;
        const yPercent = (mouseY / bounds.height) * 2 - 1;

        // Max rotation degrees
        const maxTilt = 10;
        const rotateX = -yPercent * maxTilt;
        const rotateY = xPercent * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;

        // Update spotlight position
        card.style.setProperty('--mouse-x', `${mouseX}px`);
        card.style.setProperty('--mouse-y', `${mouseY}px`);
      }

      function handleMouseLeave() {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        bounds = null;
      }

      card.addEventListener('mouseenter', updateBounds);
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);

      // Mobile Tap Support: toggle expanded details
      card.addEventListener('click', (e) => {
        // Only toggle if not clicking on an anchor tag
        if (e.target.closest('a')) return;
        card.classList.toggle('active-reveal');
      });
    });
  })();

  /* --------------------------------------------------------------------------
     8. CONTACT SECTION INTERACTIVE CONVERGING CANVAS
     -------------------------------------------------------------------------- */
  (function initContactCanvas() {
    const canvas = document.getElementById('contact-canvas');
    const contactSection = document.getElementById('contact');
    const buttonsWrapper = document.getElementById('contact-buttons-wrapper');
    const btnWhatsapp = document.getElementById('btn-whatsapp');
    const btnGmail = document.getElementById('btn-gmail');

    if (!canvas || !contactSection || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrameId = null;
    let isInView = false;
    let isBtnHovered = false;

    // Stream lines and particles converging inward
    const particles = [];
    const PARTICLE_COUNT = 35;

    class ConvergingRay {
      constructor(w, h) {
        this.reset(w, h);
      }

      reset(w, h) {
        // Spawn along perimeter
        const edge = Math.floor(Math.random() * 4);
        if (edge === 0) { // top
          this.x = Math.random() * w;
          this.y = 0;
        } else if (edge === 1) { // bottom
          this.x = Math.random() * w;
          this.y = h;
        } else if (edge === 2) { // left
          this.x = 0;
          this.y = Math.random() * h;
        } else { // right
          this.x = w;
          this.y = Math.random() * h;
        }

        this.speed = Math.random() * 1.5 + 0.8;
        this.length = Math.random() * 25 + 15;
        this.alpha = Math.random() * 0.6 + 0.2;
        this.size = Math.random() * 2 + 1;
        this.isCyan = Math.random() > 0.4;
      }

      update(w, h, targetX, targetY, speedMultiplier) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 40) {
          this.reset(w, h);
          return;
        }

        const angle = Math.atan2(dy, dx);
        const actualSpeed = this.speed * speedMultiplier;
        this.x += Math.cos(angle) * actualSpeed;
        this.y += Math.sin(angle) * actualSpeed;
      }

      draw(c) {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        if (this.isCyan) {
          c.fillStyle = `rgba(0, 229, 255, ${this.alpha})`;
          c.shadowColor = '#00E5FF';
        } else {
          c.fillStyle = `rgba(188, 2, 2, ${this.alpha})`;
          c.shadowColor = '#BC0202';
        }
        c.shadowBlur = 8;
        c.fill();
        c.restore();
      }
    }

    function resize() {
      const rect = contactSection.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new ConvergingRay(width, height));
      }
    }

    function getTargetCenter() {
      if (!buttonsWrapper) return { x: width / 2, y: height / 2 };
      const secRect = contactSection.getBoundingClientRect();
      const wrapRect = buttonsWrapper.getBoundingClientRect();

      return {
        x: wrapRect.left - secRect.left + wrapRect.width / 2,
        y: wrapRect.top - secRect.top + wrapRect.height / 2
      };
    }

    function loop() {
      if (!isInView) return;

      ctx.clearRect(0, 0, width, height);

      const target = getTargetCenter();
      const speedMult = isBtnHovered ? 2.5 : 1;

      // Draw faint converging vector lines toward center
      ctx.beginPath();
      for (let i = 0; i < particles.length; i += 2) {
        const p = particles[i];
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(target.x, target.y);
      }
      ctx.strokeStyle = isBtnHovered ? 'rgba(0, 229, 255, 0.08)' : 'rgba(188, 2, 2, 0.04)';
      ctx.lineWidth = 0.75;
      ctx.stroke();

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(width, height, target.x, target.y, speedMult);
        particles[i].draw(ctx);
      }

      animationFrameId = requestAnimationFrame(loop);
    }

    // Intensify animation on button hover
    [btnWhatsapp, btnGmail].forEach((btn) => {
      if (!btn) return;
      btn.addEventListener('mouseenter', () => { isBtnHovered = true; });
      btn.addEventListener('mouseleave', () => { isBtnHovered = false; });
    });

    window.addEventListener('resize', resize, { passive: true });

    // IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isInView = true;
            loop();
          } else {
            isInView = false;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
          }
        });
      },
      { threshold: 0.1 }
    );

    resize();
    observer.observe(contactSection);
  })();

  /* --------------------------------------------------------------------------
     9. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     -------------------------------------------------------------------------- */
  (function initScrollReveal() {
    if (prefersReducedMotion) return;

    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  })();

  /* --------------------------------------------------------------------------
     10. COPY EMAIL TO CLIPBOARD UTILITY
     -------------------------------------------------------------------------- */
  (function initCopyEmail() {
    const copyBtn = document.getElementById('copy-email-btn');
    const copyText = document.getElementById('copy-btn-text');
    const emailAddress = document.getElementById('email-address-text');
    const notification = document.getElementById('copy-notification');

    if (!copyBtn || !emailAddress) return;

    copyBtn.addEventListener('click', async () => {
      const email = emailAddress.textContent.trim();

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback for older browsers
          const tempInput = document.createElement('input');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        // Visual feedback
        if (copyText) copyText.textContent = 'Copied!';
        if (notification) notification.textContent = '✓ Email copied to clipboard';
        copyBtn.style.background = '#27c93f';

        setTimeout(() => {
          if (copyText) copyText.textContent = 'Copy';
          if (notification) notification.textContent = '';
          copyBtn.style.background = '';
        }, 2500);

      } catch (err) {
        if (notification) notification.textContent = 'Please copy manually: ' + email;
      }
    });
  })();

})();
