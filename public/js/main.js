/**
 * LemonMind Agency — Vanilla JavaScript
 * High performance, zero framework overhead, fully responsive.
 * Sophisticated entrance animations & micro-interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mark DOM as JS-ready for progressive enhancement
  document.documentElement.classList.add('js-ready');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // 1. Instant & Smooth Scroll Reveal for Team Cards (Optimized for Fast Scrolling)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const allCards = document.querySelectorAll('.amal-gold-card, .team-card');

  const resetAllCardsTransform = () => {
    allCards.forEach((card) => {
      if (card.style.transform) {
        card.style.transform = '';
      }
    });
  };

  // High-Performance Scroll Guard: Prevents hover/tilt glitches during fast scrolling
  let scrollEndTimer = null;
  window.addEventListener('scroll', () => {
    if (!document.body.classList.contains('is-scrolling')) {
      document.body.classList.add('is-scrolling');
    }
    resetAllCardsTransform();

    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      document.body.classList.remove('is-scrolling');
    }, 100);
  }, { passive: true });

  window.addEventListener('blur', resetAllCardsTransform);
  document.addEventListener('mouseleave', resetAllCardsTransform);

  if (revealElements.length > 0) {
    const isMobile = window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;
    
    const markVisible = (el) => {
      if (el.classList.contains('is-revealed')) return;
      el.classList.add('is-visible');
      setTimeout(() => {
        el.classList.add('is-revealed');
      }, 320);
    };

    if (isMobile || prefersReduced) {
      revealElements.forEach(markVisible);
    } else if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              markVisible(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '300px 0px 300px 0px',
          threshold: 0.01
        }
      );

      revealElements.forEach((el) => {
        revealObserver.observe(el);
      });
    } else {
      revealElements.forEach(markVisible);
    }

    // High-speed resilience fallback on first scroll
    const handleInitialScroll = () => {
      revealElements.forEach(markVisible);
      window.removeEventListener('scroll', handleInitialScroll);
    };
    window.addEventListener('scroll', handleInitialScroll, { passive: true, once: true });

    // High-speed resilience fallback timer
    setTimeout(() => {
      revealElements.forEach(markVisible);
    }, 350);
  }

  // 2. Dynamic Specular Sheen & Subtle 3D Card Perspective (Desktop Only)
  if (!prefersReduced && isDesktopPointer) {
    // Specular sheen on gold surfaces and panels
    const surfaces = document.querySelectorAll('.gold-surface, .identity-panel.gold');
    surfaces.forEach((surface) => {
      surface.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch' || document.body.classList.contains('is-scrolling')) return;
        const rect = surface.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        surface.style.setProperty('--mouse-x', `${x}%`);
        surface.style.setProperty('--mouse-y', `${y}%`);
      });

      surface.addEventListener('pointerleave', () => {
        surface.style.setProperty('--mouse-x', '50%');
        surface.style.setProperty('--mouse-y', '30%');
      });
    });

    // Subtle 3D perspective tilt on interactive cards (controlled, max 2.5 degrees)
    allCards.forEach((card) => {
      let isHovered = false;

      card.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'touch' || document.body.classList.contains('is-scrolling')) return;
        isHovered = true;
      });

      card.addEventListener('pointermove', (e) => {
        if (!isHovered || e.pointerType === 'touch' || document.body.classList.contains('is-scrolling')) {
          if (card.style.transform) card.style.transform = '';
          return;
        }
        const rect = card.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        const rotX = (-normY * 3.5).toFixed(2);
        const rotY = (normX * 3.5).toFixed(2);

        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px) scale3d(1.008, 1.008, 1.008)`;
      });

      const handleCardLeave = () => {
        isHovered = false;
        card.style.transform = '';
      };

      card.addEventListener('pointerleave', handleCardLeave);
      card.addEventListener('pointercancel', handleCardLeave);
    });

    // 3. Subtle Magnetic Micro-Movement on Buttons & Action Elements
    const magneticElements = document.querySelectorAll(
      '.gold-cta-button, .team-card-arrow-circle, .header-nav-link, .back-link-btn'
    );

    magneticElements.forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const maxOffset = btn.classList.contains('team-card-arrow-circle') ? 4 : 5;
        const dx = Math.max(-maxOffset, Math.min(maxOffset, (e.clientX - centerX) * 0.16));
        const dy = Math.max(-maxOffset, Math.min(maxOffset, (e.clientY - centerY) * 0.16));

        btn.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      });

      btn.addEventListener('pointerleave', () => {
        btn.style.transform = '';
      });
    });

    // 4. Minimal Luxury Custom Cursor (Desktop Only)
    if (window.innerWidth >= 1024) {
      initCustomCursor();
    }
  }

  // 5. NFC Card Swipe Flip Support
  const flipper = document.getElementById('nfcCardFlipper');
  if (flipper) {
    let touchStartX = 0;
    let touchStartY = 0;

    flipper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    flipper.addEventListener('touchend', (e) => {
      const diffX = e.changedTouches[0].screenX - touchStartX;
      const diffY = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
        toggleCardFlip();
      }
    }, { passive: true });
  }

  // 6. Keyboard shortcut: 'Escape' to go back to the team grid
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const backBtn = document.querySelector('.back-link-btn');
      if (backBtn) {
        backBtn.click();
      }
    }
  });

  // 6. Update current year dynamically in footer
  const yearEls = document.querySelectorAll('[data-current-year]');
  const currentYear = new Date().getFullYear();
  yearEls.forEach((el) => {
    el.textContent = currentYear;
  });

  // 7. Initialize 4D / 3D Luxury Interactive Background
  initLuxury4DBackground();

  // 8. Initialize Cinematic Card Click Portal Transition
  initCardPortalTransitions();

  // 9. Initialize Brand Signature Cinematic Intro
  initBrandIntro();
});

/**
 * Minimal luxury cursor with smooth interpolation and reactive aura
 */
function initCustomCursor() {
  const dot = document.createElement('div');
  dot.className = 'lm-cursor-dot';
  dot.setAttribute('aria-hidden', 'true');

  const ring = document.createElement('div');
  ring.className = 'lm-cursor-ring';
  ring.setAttribute('aria-hidden', 'true');

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isMoving = false;
  let isHovering = false;
  let isVisible = false;

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      ringX = mouseX;
      ringY = mouseY;
      dot.classList.add('is-active');
      ring.classList.add('is-active');
    }

    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;

    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(renderRing);
    }
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.22;
    ringY += (mouseY - ringY) * 0.22;

    ring.style.left = `${ringX.toFixed(1)}px`;
    ring.style.top = `${ringY.toFixed(1)}px`;

    const dist = Math.abs(mouseX - ringX) + Math.abs(mouseY - ringY);
    if (dist > 0.1) {
      requestAnimationFrame(renderRing);
    } else {
      isMoving = false;
    }
  }

  // Hover expansion over interactive elements
  const interactiveSelectors = 'a, button, .amal-gold-card, .team-card, .header-brand, input, select';
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(interactiveSelectors);
    if (target && !isHovering) {
      isHovering = true;
      ring.classList.add('is-hovering');
      dot.classList.add('is-hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(interactiveSelectors);
    if (target && isHovering) {
      const nextTarget = e.relatedTarget ? e.relatedTarget.closest(interactiveSelectors) : null;
      if (!nextTarget) {
        isHovering = false;
        ring.classList.remove('is-hovering');
        dot.classList.remove('is-hovering');
      }
    }
  });

  // Fade out cursor when mouse leaves the window
  document.addEventListener('mouseleave', () => {
    dot.classList.remove('is-active');
    ring.classList.remove('is-active');
    isVisible = false;
  });

  document.addEventListener('mouseenter', () => {
    dot.classList.add('is-active');
    ring.classList.add('is-active');
    isVisible = true;
  });
}

/**
 * Generates and downloads an RFC 2426 compliant vCard (.vcf)
 */
function downloadVCard(firstName, lastName, profession, phone, email) {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName};${firstName};;;`,
    `FN:${firstName} ${lastName}`,
    `TITLE:${profession}`,
    'ORG:Lemon Mind Digital',
    `TEL;TYPE=CELL:${phone}`,
    `EMAIL;TYPE=INTERNET:${email}`,
    'URL:https://lemonmind.agency/',
    'END:VCARD'
  ].join('\r\n');

  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${firstName}-${lastName}.vcf`;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 150);
}

/**
 * Toggles the 3D card flip between Front (Recto) and Back (Verso)
 */
function toggleCardFlip() {
  const flipper = document.getElementById('nfcCardFlipper');
  if (!flipper) return;

  // Add gold-edge glow during the rotation
  flipper.classList.add('is-flipping');

  const isFlipped = flipper.classList.toggle('is-flipped');

  // Remove the glow after the rotation completes
  setTimeout(() => {
    flipper.classList.remove('is-flipping');
  }, 380);

  const frontBtn = document.getElementById('btnViewFront');
  const backBtn = document.getElementById('btnViewBack');
  if (frontBtn && backBtn) {
    if (isFlipped) {
      frontBtn.classList.remove('active');
      backBtn.classList.add('active');
    } else {
      frontBtn.classList.add('active');
      backBtn.classList.remove('active');
    }
  }
}

function setCardFace(face) {
  const flipper = document.getElementById('nfcCardFlipper');
  if (!flipper) return;

  const frontBtn = document.getElementById('btnViewFront');
  const backBtn = document.getElementById('btnViewBack');

  // Determine if we're actually changing face
  const currentlyFlipped = flipper.classList.contains('is-flipped');
  const wantsFlip = face === 'back';
  if (currentlyFlipped === wantsFlip) return;

  // Add gold-edge glow during rotation
  flipper.classList.add('is-flipping');

  if (face === 'back') {
    flipper.classList.add('is-flipped');
    if (frontBtn) frontBtn.classList.remove('active');
    if (backBtn) backBtn.classList.add('active');
  } else {
    flipper.classList.remove('is-flipped');
    if (frontBtn) frontBtn.classList.add('active');
    if (backBtn) backBtn.classList.remove('active');
  }

  // Remove glow after rotation completes
  setTimeout(() => {
    flipper.classList.remove('is-flipping');
  }, 380);
}

/**
 * Web Share API with instant fallback to clipboard copy
 */
function sharePersonalCard(name, profession) {
  const shareData = {
    title: `${name} — ${profession} | LemonMind Agency`,
    text: `Carte de visite digitale NFC de ${name} (${profession}) chez LemonMind Agency :`,
    url: window.location.href,
  };

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    navigator.share(shareData).catch(() => {});
  } else {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showNfcToast('✓ Lien de la carte copié dans le presse-papiers !');
      }).catch(() => {
        promptCopyFallback(window.location.href);
      });
    } else {
      promptCopyFallback(window.location.href);
    }
  }
}

function promptCopyFallback(text) {
  const input = document.createElement('input');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  showNfcToast('✓ Lien de la carte copié !');
}

/**
 * Floating luxury toast notification
 */
function showNfcToast(message) {
  let toast = document.querySelector('.nfc-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'nfc-toast';
    toast.innerHTML = `<span class="nfc-toast-icon">★</span><span class="nfc-toast-msg"></span>`;
    document.body.appendChild(toast);
  }

  toast.querySelector('.nfc-toast-msg').textContent = message;
  toast.classList.add('is-visible');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2800);
}

/**
 * 4D / 3D Luxury Atmospheric Canvas
 * Combines 3D spatial geometry with 4th-dimensional harmonic time oscillations (t)
 * Multi-layer golden dust constellation + breathing harmonic caustic ribbons
 */
function initLuxury4DBackground() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Ensure canvas exists
  let canvas = document.getElementById('luxury4DCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'luxury4DCanvas';
    canvas.className = 'luxury-4d-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // 3D Particles / Constellation nodes (Brightened & more luminous)
  const NUM_POINTS = width > 768 ? 64 : 36;
  const points = [];
  const BOX_X = 650;
  const BOX_Y = 450;
  const BOX_Z = 350;

  for (let i = 0; i < NUM_POINTS; i++) {
    points.push({
      x: (Math.random() - 0.5) * BOX_X * 2,
      y: (Math.random() - 0.5) * BOX_Y * 2,
      z: (Math.random() - 0.5) * BOX_Z * 2,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      vz: (Math.random() - 0.5) * 0.28,
      baseRadius: Math.random() * 2.2 + 1.3,
      phase: Math.random() * Math.PI * 2,
      goldHue: Math.random() > 0.4 ? 'gold' : 'champagne'
    });
  }

  // Mouse Parallax Lerp
  let mouseTargetX = 0;
  let mouseTargetY = 0;
  let mouseCurrentX = 0;
  let mouseCurrentY = 0;

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    mouseTargetX = (e.clientX / width - 0.5) * 0.45;
    mouseTargetY = (e.clientY / height - 0.5) * 0.35;
  }, { passive: true });

  // Warp pulse trigger when a card is clicked
  let warpFactor = 1.0;
  let targetWarp = 1.0;
  window.__triggerLuxuryWarp = () => {
    targetWarp = 4.8;
    setTimeout(() => { targetWarp = 1.0; }, 220);
  };

  const FOCAL = 480;
  let time = 0;
  let isRunning = true;

  document.addEventListener('visibilitychange', () => {
    isRunning = !document.hidden;
    if (isRunning) requestAnimationFrame(render);
  });

  function render() {
    if (!isRunning) return;

    time += 0.016 * warpFactor;
    warpFactor += (targetWarp - warpFactor) * 0.12;

    // Smooth lerp mouse rotation
    mouseCurrentX += (mouseTargetX - mouseCurrentX) * 0.04;
    mouseCurrentY += (mouseTargetY - mouseCurrentY) * 0.04;

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    // 4D Lissajous continuous rotation + mouse 3D tilt
    const rotY = Math.sin(time * 0.25) * 0.12 + mouseCurrentX;
    const rotX = Math.cos(time * 0.2) * 0.08 + mouseCurrentY;

    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

    // Render 4D Harmonic Caustic Ribbon in the background
    drawCausticWave(ctx, width, height, time, rotY);

    // Project and sort 3D points
    const projected = [];

    for (let i = 0; i < points.length; i++) {
      const p = points[i];

      // Organic brownian drift
      p.x += p.vx * warpFactor;
      p.y += p.vy * warpFactor;
      p.z += p.vz * warpFactor;

      // Wrap-around 3D bounds
      if (p.x < -BOX_X) p.x = BOX_X;
      if (p.x > BOX_X) p.x = -BOX_X;
      if (p.y < -BOX_Y) p.y = BOX_Y;
      if (p.y > BOX_Y) p.y = -BOX_Y;
      if (p.z < -BOX_Z) p.z = BOX_Z;
      if (p.z > BOX_Z) p.z = -BOX_Z;

      // 3D Rotation Matrix
      // Rotate around Y
      let x1 = p.x * cosY + p.z * sinY;
      let z1 = -p.x * sinY + p.z * cosY;
      // Rotate around X
      let y1 = p.y * cosX - z1 * sinX;
      let z2 = p.y * sinX + z1 * cosX;

      // Perspective Projection with enhanced brightness & clarity
      const depth = FOCAL + z2;
      if (depth > 20) {
        const scale = FOCAL / depth;
        const sx = centerX + x1 * scale;
        const sy = centerY + y1 * scale;
        const alpha = Math.max(0.20, Math.min(1.0, (1 - z2 / BOX_Z) * 0.70 + Math.sin(time * 1.5 + p.phase) * 0.22));

        projected.push({
          sx,
          sy,
          z: z2,
          scale,
          alpha,
          radius: p.baseRadius * scale,
          hue: p.goldHue
        });
      }
    }

    // Draw delicate golden filament lines between close points (brightened)
    const maxDist = width > 768 ? 135 : 95;
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const p1 = projected[i];
        const p2 = projected[j];
        const dx = p1.sx - p2.sx;
        const dy = p1.sy - p2.sy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const lineAlpha = (1 - dist / maxDist) * 0.38 * ((p1.alpha + p2.alpha) / 2);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 215, 80, ${lineAlpha.toFixed(3)})`;
          ctx.lineWidth = 1.0;
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.stroke();
        }
      }
    }

    // Draw 3D Golden Stardust Nodes (luminous aura)
    for (let i = 0; i < projected.length; i++) {
      const p = projected[i];

      // Soft glow halo for closer nodes
      if (p.scale > 0.85) {
        ctx.beginPath();
        const glowRad = p.radius * 4.0;
        const grad = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, glowRad);
        grad.addColorStop(0, `rgba(255, 235, 160, ${(p.alpha * 0.70).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
        ctx.fillStyle = grad;
        ctx.arc(p.sx, p.sy, glowRad, 0, Math.PI * 2);
        ctx.fill();
      }

      // Crisp center node
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, Math.max(1.0, p.radius), 0, Math.PI * 2);
      if (p.hue === 'gold') {
        ctx.fillStyle = `rgba(255, 215, 60, ${p.alpha.toFixed(3)})`;
      } else {
        ctx.fillStyle = `rgba(255, 245, 210, ${p.alpha.toFixed(3)})`;
      }
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/**
 * 4D Harmonic Caustic Wave
 * Creates an organic breathing golden wave ribbon modulated by time (brightened & luminous)
 */
function drawCausticWave(ctx, width, height, time, rotY) {
  const steps = 30;
  const baseY = height * 0.42;
  const amplitude = Math.min(height * 0.15, 110);

  ctx.save();
  ctx.beginPath();

  for (let i = 0; i <= steps; i++) {
    const normX = i / steps;
    const x = normX * width;
    // 4th dimension wave formula: combination of spatial frequency and time oscillation
    const wave1 = Math.sin(normX * 3.5 + time * 0.6 + rotY) * amplitude;
    const wave2 = Math.cos(normX * 6.2 - time * 0.4) * (amplitude * 0.4);
    const y = baseY + wave1 + wave2;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  // Broad ambient gold glow
  ctx.strokeStyle = 'rgba(255, 215, 60, 0.16)';
  ctx.lineWidth = 8;
  ctx.stroke();

  // Vibrant core ribbon
  ctx.strokeStyle = 'rgba(255, 235, 160, 0.32)';
  ctx.lineWidth = 2.4;
  ctx.stroke();

  // Secondary luminous counter-wave
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const normX = i / steps;
    const x = normX * width;
    const wave = Math.sin(normX * 4.2 - time * 0.5) * (amplitude * 0.6);
    const y = baseY + 40 + wave;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = 'rgba(255, 245, 195, 0.20)';
  ctx.lineWidth = 2.0;
  ctx.stroke();

  ctx.restore();
}

/**
 * Cinematic Luxury Card Click Transition (Portal Effect)
 * Fast, ultra-responsive, haute-couture tactile interaction
 */
function initCardPortalTransitions() {
  const cards = document.querySelectorAll('.amal-gold-card, .team-card');
  if (cards.length === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Create portal flash overlay if not existing
  let overlay = document.querySelector('.portal-flash-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'portal-flash-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);
  }

  // Restore page visual state on browser back/forward navigation (bfcache)
  window.addEventListener('pageshow', () => {
    document.body.classList.remove('body-portal-active');
    if (overlay) overlay.classList.remove('is-active');
    cards.forEach((c) => c.classList.remove('card-portal-active'));
  });

  cards.forEach((card) => {
    const href = card.getAttribute('href');
    if (!href) return;

    // Instant prefetch on pointerenter / touchstart for zero-latency page loading
    const prefetchTarget = () => {
      if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    };
    card.addEventListener('pointerenter', prefetchTarget, { once: true, passive: true });
    card.addEventListener('touchstart', prefetchTarget, { once: true, passive: true });

    card.addEventListener('click', (e) => {
      // Don't intercept modified clicks (Cmd/Ctrl + click to open new tab, etc.)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.which === 2 || prefersReduced) {
        return;
      }

      e.preventDefault();

      // Get click center coordinates for radial bloom
      const rect = card.getBoundingClientRect();
      const clickX = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
      const clickY = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--portal-x', `${clickX.toFixed(1)}%`);
      document.documentElement.style.setProperty('--portal-y', `${clickY.toFixed(1)}%`);

      // Trigger instant luxury card spring & specular laser beam
      card.classList.add('card-portal-active');

      // Fast background dimming (smooth GPU opacity, zero blur lag)
      document.body.classList.add('body-portal-active');

      // Trigger 4D Background Warp
      if (typeof window.__triggerLuxuryWarp === 'function') {
        window.__triggerLuxuryWarp();
      }

      // Atmospheric champagne flash cut
      setTimeout(() => {
        overlay.classList.add('is-active');
      }, 70);

      // Fast, ultra-responsive luxury navigation
      setTimeout(() => {
        window.location.href = href;
      }, 160);
    });
  });
}

/**
 * Brand Signature Intro Animation Controller
 * Plays on every page load or refresh.
 * Seamlessly fades into website between 1.8s and 2.4s.
 */
function initBrandIntro() {
  const intro = document.getElementById('brandIntro');
  if (!intro) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hideDelay = prefersReduced ? 1000 : 1850;
  const removeDelay = hideDelay + 600;

  setTimeout(() => {
    intro.classList.add('is-hiding');
  }, hideDelay);

  setTimeout(() => {
    intro.remove();
  }, removeDelay);
}


