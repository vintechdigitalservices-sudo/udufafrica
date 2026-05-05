// --- 1. CONFIGURATION & STATE ---
// Language feature removed completely

// ================================
// PRELOADER (Homepage Only Logic) - FIXED FOR REFRESH
// ================================

// Run this immediately, before DOMContentLoaded
(function() {
    // Check if we're on homepage
    const isHomepage = window.location.pathname === "/" || 
                       window.location.pathname.endsWith("index.html") || 
                       window.location.pathname === "/index.html";
    
    // Get preloader element
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    // If not homepage, hide preloader immediately
    if (!isHomepage) {
        preloader.style.display = 'none';
        preloader.remove();
        return;
    }
    
    // Check if this is a page refresh using modern API
    let isPageRefresh = false;
    
    // Use Navigation Timing API if available
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
        isPageRefresh = navigationEntries[0].type === 'reload';
    } 
    // Fallback for older browsers
    else if (performance && performance.navigation) {
        isPageRefresh = performance.navigation.type === 1;
    }
    
    // Check if user came from internal link
    const cameFromInternal = document.referrer && 
                             document.referrer.includes(window.location.hostname);
    
    // Check if this is back/forward navigation
    let isBackForward = false;
    if (navigationEntries.length > 0) {
        isBackForward = navigationEntries[0].type === 'back_forward';
    } else if (performance && performance.navigation) {
        isBackForward = performance.navigation.type === 2;
    }
    
    // Check if user has visited during this session
    const hasVisited = sessionStorage.getItem('uduf_hasVisited');
    
    // Determine if we should SHOW preloader
    // Show only for: fresh visit OR page refresh
    // Hide for everything else
    const shouldShowPreloader = (isHomepage && !cameFromInternal && !isBackForward) && 
                                (!hasVisited || isPageRefresh);
    
    // If we should NOT show preloader, hide it immediately
    if (!shouldShowPreloader) {
        preloader.style.display = 'none';
        preloader.remove();
        return;
    }
    
    // Set session flag for future visits
    if (!hasVisited) {
        sessionStorage.setItem('uduf_hasVisited', 'true');
    }
    
    // Ensure preloader is visible for animation
    preloader.style.display = 'flex';
    preloader.style.opacity = '1';
    preloader.style.visibility = 'visible';
    
    // Initially hide all text elements to prevent flashing
    const text1 = document.getElementById("text1");
    const text2 = document.getElementById("text2");
    const text3 = document.getElementById("text3");
    
    if (text1) {
        text1.style.opacity = "0";
        text1.classList.remove("slide-right", "slide-left");
    }
    if (text2) {
        text2.style.opacity = "0";
        text2.classList.remove("slide-right", "slide-left");
    }
    if (text3) {
        text3.style.opacity = "0";
        text3.classList.remove("slide-right", "slide-left");
    }
})();

// Main preloader animation (only runs after DOM is loaded)
document.addEventListener("DOMContentLoaded", function() {
    const preloader = document.getElementById("preloader");
    
    // If preloader doesn't exist or was already removed, exit
    if (!preloader || preloader.style.display === 'none') return;
    
    const text1 = document.getElementById("text1");
    const text2 = document.getElementById("text2");
    const text3 = document.getElementById("text3");
    
    // Animation sequence:
    // 1. "get inspired" slides in first
    // 2. "take action" slides in second  
    // 3. "transform African" slides in third
    
    // Ensure all texts start hidden
    if (text1) {
        text1.style.opacity = "0";
        text1.classList.remove("slide-right", "slide-left");
    }
    if (text2) {
        text2.style.opacity = "0";
        text2.classList.remove("slide-right", "slide-left");
    }
    if (text3) {
        text3.style.opacity = "0";
        text3.classList.remove("slide-right", "slide-left");
    }
    
    // Force a reflow to ensure styles are applied
    void preloader.offsetWidth;
    
    // First text appears: "get inspired"
    setTimeout(() => {
        if (text1) {
            text1.style.opacity = "1";
            text1.classList.add("slide-right");
        }
    }, 50);
    
    // Second text appears: "take action" (after first text slides out)
    setTimeout(() => {
        if (text1) {
            text1.classList.remove("slide-right");
            text1.style.opacity = "0";
        }
        if (text2) {
            text2.style.opacity = "1";
            text2.classList.add("slide-left");
        }
    }, 2000);
    
    // Third text appears: "transform African" (after second text slides out)
    setTimeout(() => {
        if (text2) {
            text2.classList.remove("slide-left");
            text2.style.opacity = "0";
        }
        if (text3) {
            text3.style.opacity = "1";
            text3.classList.add("slide-left");
        }
    }, 4000);
    
    // Remove preloader after all animations complete
    setTimeout(() => {
        // Fade out effect
        preloader.style.transition = "opacity 0.6s ease";
        preloader.style.opacity = "0";
        
        // Remove from DOM after fade out
        setTimeout(() => {
            if (preloader.parentNode) {
                preloader.remove();
            }
        }, 600);
    }, 6200);
});

// Backup: Ensure preloader is removed if something goes wrong
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader && preloader.parentNode) {
        // If preloader is still visible 10 seconds after load, force remove it
        setTimeout(() => {
            if (preloader.parentNode) {
                preloader.remove();
            }
        }, 10000);
    }
});
// --- 3. MENU LOGIC ---
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const overlay = document.getElementById('overlay');

function toggleMenu() {
    hamburger.classList.toggle('active');
    nav.classList.toggle('show');
    overlay.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('show') ? 'hidden' : '';
}

if (hamburger) hamburger.addEventListener('click', toggleMenu);
if (overlay) overlay.addEventListener('click', toggleMenu);

// --- 4. HERO SLIDER LOGIC ---
document.addEventListener('DOMContentLoaded', function () {
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroTextContainers = document.querySelectorAll('.hero-text-container');
    const heroDots = document.querySelectorAll('.hero-slider-dot');

    let currentHeroSlide = 0;
    const totalHeroSlides = heroSlides.length;
    let heroSlideInterval;

    function showHeroSlide(index) {
        // Hide all slides and text containers
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroTextContainers.forEach(container => {
            container.classList.remove('active');
            // Reset animation state for next time
            container.style.opacity = "0";
            container.style.transform = "translateX(100px)";
        });
        heroDots.forEach(dot => dot.classList.remove('active'));

        // Show current slide and text container
        heroSlides[index].classList.add('active');
        heroTextContainers[index].classList.add('active');

        // Trigger slide-in animation
        setTimeout(() => {
            heroTextContainers[index].style.opacity = "1";
            heroTextContainers[index].style.transform = "translateX(0)";
        }, 50);

        heroDots[index].classList.add('active');

        currentHeroSlide = index;
    }

    function nextHeroSlide() {
        let nextIndex = (currentHeroSlide + 1) % totalHeroSlides;
        showHeroSlide(nextIndex);
    }

    // Initialize hero slider
    showHeroSlide(0);

    // Start auto-slide (7 seconds)
    heroSlideInterval = setInterval(nextHeroSlide, 7000);

    // Add click events to dots
    heroDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(heroSlideInterval);
            showHeroSlide(index);
            // Restart auto-slide
            heroSlideInterval = setInterval(nextHeroSlide, 7000);
        });
    });
});

// Language translation feature completely removed

// --- 6. INTERSECTION OBSERVERS FOR ANIMATIONS ---

// Animation Trigger for the Mission Header
const missionHeaderObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-now');
        }
    });
}, { threshold: 0.1 });

// Start watching the mission header
const missionHeader = document.querySelector('.mission-header h2');
if (missionHeader) {
    missionHeaderObserver.observe(missionHeader);
}

// Animation Trigger for the Mission/About Card
const missionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-now');
        }
    });
}, { threshold: 0.1 });

// Start watching the box
const aboutCard = document.querySelector('.mission-box');
if (aboutCard) {
    missionObserver.observe(aboutCard);
}

// Trigger for the Event Section Slide-in from Left
const eventSlideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('slide-in-active');
        }
    });
}, { threshold: 0.15 });

const eventBox = document.querySelector('.event-background-box');
if (eventBox) {
    eventSlideObserver.observe(eventBox);
}
/* ============================= */
/* STATS SECTION COUNT-UP WITH "+" SUFFIX */
/* ============================= */
document.addEventListener("DOMContentLoaded", () => {
  const statsSection = document.querySelector('.stats-section');
  const statNumbers = document.querySelectorAll('.stat-number');

  function countUp(el) {
    const target = +el.getAttribute('data-target');
    const suffix = el.getAttribute('data-suffix') || '+';
    let current = 0;
    const increment = Math.ceil(target / 100); // adjust speed

    function update() {
      current += increment;
      if (current < target) {
        el.textContent = current.toLocaleString() + suffix; // adds comma formatting
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString() + suffix; // ensures correct final value
      }
    }

    update();
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(num => {
            if (!num.classList.contains('counted')) {
              countUp(num);
              num.classList.add('counted');
            }
          });
        } else {
          statNumbers.forEach(num => num.classList.remove('counted'));
        }
      });
    },
    { threshold: 0.3 }
  );

  if (statsSection) observer.observe(statsSection);
});
// --- 7. UPCOMING EVENTS SLIDER LOGIC - FIXED FOR CLICKABILITY ---
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.event-slide');
    const nextBtn = document.getElementById('nextEvent');
    const prevBtn = document.getElementById('prevEvent');

    let currentSlide = 0;
    let slideInterval = setInterval(nextSlide, 6000);

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
        updateDots();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(slideInterval);
            nextSlide();
            slideInterval = setInterval(nextSlide, 6000);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(slideInterval);
            prevSlide();
            slideInterval = setInterval(nextSlide, 6000);
        });
    }
    
    // Initialize the slider
    showSlide(currentSlide);
});

// Sync dots with slider
function updateDots() {
    const dots = document.querySelectorAll('.dot');
    const activeSlide = document.querySelector('.event-slide.active');
    const allSlides = Array.from(document.querySelectorAll('.event-slide'));
    const currentIndex = allSlides.indexOf(activeSlide);

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// --- 8. FIX FOR ALL CTA BUTTON CLICKABILITY ---
document.addEventListener('DOMContentLoaded', function() {
    // Make ALL CTA buttons clickable by overriding CSS issues
    const allCtaButtons = document.querySelectorAll('.event-cta, .btn-donate, .btn-volunteer, .btn-know-more, .btn-create-event, .focus-item');
    
    allCtaButtons.forEach(button => {
        // Ensure buttons are always clickable
        button.style.pointerEvents = 'auto';
        button.style.cursor = 'pointer';
        button.style.position = 'relative';
        button.style.zIndex = '100';
    });
    
    // Specifically fix the event slide CTA buttons
    const eventCtaButtons = document.querySelectorAll('.event-cta');
    eventCtaButtons.forEach(button => {
        button.style.pointerEvents = 'auto !important';
        button.style.cursor = 'pointer !important';
        button.style.zIndex = '1000 !important';
    });
    
    // Fix for event slides - ensure they don't block clicks
    const eventSlides = document.querySelectorAll('.event-slide');
    eventSlides.forEach(slide => {
        // Remove pointer-events: none from all slides
        slide.style.pointerEvents = 'auto';
        
        // Make sure the overlay content is clickable
        const overlay = slide.querySelector('.event-overlay');
        if (overlay) {
            overlay.style.pointerEvents = 'auto';
            overlay.style.zIndex = '10';
        }
        
        // Make sure the CTA button in each slide is extra clickable
        const ctaButton = slide.querySelector('.event-cta');
        if (ctaButton) {
            ctaButton.style.pointerEvents = 'auto';
            ctaButton.style.cursor = 'pointer';
            ctaButton.style.zIndex = '1000';
            ctaButton.style.position = 'relative';
        }
    });
    
    // Add a CSS fix dynamically
    const styleFix = document.createElement('style');
    styleFix.textContent = `
        /* Fix for CTA button clickability */
        .event-slide { pointer-events: auto !important; }
        .event-slide::before { pointer-events: none !important; }
        .event-overlay { pointer-events: auto !important; z-index: 10 !important; }
        .event-cta { 
            pointer-events: auto !important; 
            cursor: pointer !important; 
            z-index: 1000 !important;
            position: relative !important;
        }
                
        /* Fix for focus area buttons */
        .focus-item { 
            pointer-events: auto !important; 
            cursor: pointer !important; 
        }
        
        /* Fix for other buttons */
        .btn-know-more, .btn-create-event { 
            pointer-events: auto !important; 
            cursor: pointer !important; 
        }
        
        /* Ensure active slide is on top */
        .event-slide.active { z-index: 2 !important; }
        .event-slide:not(.active) { z-index: 1 !important; opacity: 0 !important; }
    `;
    document.head.appendChild(styleFix);
    
    console.log('CTA buttons fixed - all links should now work properly');
});

// =====================================================================
// ==================== BEGIN VOLUNTEERS SECTION =======================
// =====================================================================
// This entire block handles the volunteers network visualization with:
// - Header animation on page load
// - 3D spherical arrangement of volunteer profile images
// - Dynamic SVG network lines connecting neighboring nodes
// - Continuous smooth rotation animation
// - Staggered cycling of volunteer profiles every 8 seconds
// - Responsive resize handling
// =====================================================================
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('network-nodes');
  const svg = document.getElementById('network-svg');


const volunteers = [
  // === ORIGINAL MEMBERS (Preserved) ===
  {name:'Eke Chukwuemelie', brand:'CEO, WeCare Nursing Services', img:'chukwuemelie.jpg'},
  {name:'Ezuma Smart Chinedu', brand:'Founder & President', img:'ezuma.webp'},
  {name:'Mary Nancy Edeh-okoye', brand:'CEO, Made-Nice Fashion', img:'mary.webp'},
  {name:'Christopher Uchenna', brand:'CEO, GEEP CHRIS BRIDGE', img:'christopher.webp'},
  {name:'Amarachi Nina', brand:'Chairperson Planning Comitee', img:'nina.webp'},
  {name:'Gloria Ezeudo Odinaka', brand:'Member', img:'gloria.webp'},
  {name:'Amarachi Okpara Onwuamaegbu', brand:'CEO, House of Maramuna', img:'a.okpala.webp'},
  {name:'Achukwu Onyinye Jane', brand:'CEO, Ranky Jane NIG LTD', img:'jane.webp'},
  {name:'Paul Steve', brand:'Member', img:'paul.webp'},
  {name:'Precious Leonard Ani', brand:'Fashion designer', img:'review2.webp'},
  {name:'Mgbadigha Miracle Chisom', brand:'Entrepreneur', img:'miracle.webp'},
  {name:'DB Joshua Ikechukwu', brand:'CEO, Dream-Care Global', img:'joshua.webp'},
  {name:'Charles Osobie', brand:'Business Development Manager (FMCG)', img:'osobie-charles.webp'},
  {name:'Ezeudo Udochukwu Henry', brand:'Bookpreneur', img:'henry.webp'},
  {name:'Onyia Amara Rebecca', brand:'Online marketer', img:'onyia.webp'},
  {name:'Nwankwo Chioma Vivian', brand:'Entrepreneur', img:'vivian.webp'},
  {name:'Ohagwu ikenna valentine', brand:'Engineer. MTN fiber x', img:'valentine.webp'},
  {name:'Augustus Obiozo', brand:'Member, Board of Directors', img:'augustus.jpg'},
  {name:'Edwin Obioma Ngwuoke', brand:'Vice President 1', img:'edwin.jpg'},
  {name:'Owan Erico Itesi', brand:'Director of Media', img:'owan.jpg'},
  {name:'Onuigbo Chidubem Godwin', brand:'Assistant Director of Assets', img:'chidubem.jpg'},
  {name:'Chira Chinyere Christiana', brand:'Director of Finance', img:'chira.jpg'},
  {name:'Joshua C. Iheanacho', brand:'Vice President 2', img:'joshua_iheanacho.jpg'},
  {name:'Chukwuemeke Chimaobi Emmanuel', brand:'CEO Vintech Digital Services', img:'anchor.jpg'}
  
];
  const radius = 240; 
  const totalNodes = 10; 
  const rotationSpeed = 0.002;
  const tiltAngle = 0.4;
  
  let rotationY = 0;
  let nodes = [];

  function createNodes() {
    if (!container) return;
    
    container.innerHTML = '';
    nodes = []; 
    
    // Shuffle and select random volunteers
    const shuffled = [...volunteers].sort(() => 0.5 - Math.random());

    for (let i = 0; i < totalNodes; i++) {
      const data = shuffled[i];
      const nodeEl = document.createElement('div');
      nodeEl.className = 'node has-image';
      
      nodeEl.innerHTML = `
        <img src="${data.img}">
        <div class="node-name">
          <div class="name-line">${data.name}</div>
          <div class="brand-line">${data.brand}</div>
        </div>
      `;
      
      container.appendChild(nodeEl);
      
      // Fibonacci sphere distribution for even spacing
      const phi = Math.acos(1 - 2 * (i + 0.5) / totalNodes);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      
      nodes.push({
        el: nodeEl,
        phi: phi,
        theta: theta,
        x: 0,
        y: 0,
        z: 0,
        currentDataIndex: volunteers.indexOf(data)
      });
    }
    
    arrangeNodes();
  }

  function arrangeNodes() {
    if (!container || nodes.length === 0) return;
    
    const cx = container.clientWidth / 2;
    const cy = container.clientHeight / 2;

    // Position nodes on sphere
    nodes.forEach((node) => {
      const currentTheta = node.theta + rotationY;
      
      // Calculate 3D position on sphere
      let x = radius * Math.sin(node.phi) * Math.cos(currentTheta);
      let y = radius * Math.cos(node.phi);
      let z = radius * Math.sin(node.phi) * Math.sin(currentTheta);
      
      // Apply tilt rotation around X-axis
      const cosX = Math.cos(tiltAngle);
      const sinX = Math.sin(tiltAngle);
      const rotatedY = y * cosX - z * sinX;
      const rotatedZ = y * sinX + z * cosX;

      node.x = x + cx;
      node.y = rotatedY + cy;
      node.z = rotatedZ;
      
      // Scale based on depth (closer = larger)
      const depthScale = (rotatedZ + radius) / (2 * radius);
      const scale = depthScale * 0.4 + 0.6;
      const opacity = Math.max(0.3, depthScale);
      
      node.el.style.left = `${node.x}px`;
      node.el.style.top = `${node.y}px`;
      node.el.style.transform = `translate(-50%, -50%) scale(${scale})`;
      node.el.style.zIndex = Math.round(scale * 100);
      node.el.style.opacity = opacity;
    });

    drawNetworkLines();
  }

  function drawNetworkLines() {
    svg.innerHTML = '';
    
    // Calculate optimal connection distance for spherical mesh
    // For 10 nodes on a sphere, connect nodes within ~1.8x diameter
    const connectionThreshold = radius * 1.75;
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];
        
        // Calculate 3D distance
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const dz = nodeA.z - nodeB.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Only connect nearby nodes to form sphere surface
        if (distance < connectionThreshold) {
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          
          line.setAttribute("x1", nodeA.x);
          line.setAttribute("y1", nodeA.y);
          line.setAttribute("x2", nodeB.x);
          line.setAttribute("y2", nodeB.y);
          
          // Line opacity based on average depth
          const avgZ = (nodeA.z + nodeB.z) / 2;
          const lineOpacity = Math.max(0.1, (avgZ + radius) / (2 * radius) * 0.6);
          
          line.setAttribute("stroke", `rgba(100, 200, 255, ${lineOpacity})`);
          line.setAttribute("stroke-width", "1.5");
          line.setAttribute("class", "network-line");
          
          svg.appendChild(line);
        }
      }
    }
  }

  function swapNodeImage(node) {
    const delay = 3000 + Math.random() * 6000;
    
    setTimeout(() => {
      // Fade out
      node.el.style.transition = 'opacity 1s ease';
      node.el.style.opacity = '0';
      
      setTimeout(() => {
        // Get available volunteers (not currently displayed)
        const usedIndices = nodes.map(n => n.currentDataIndex);
        const availableIndices = volunteers
          .map((_, idx) => idx)
          .filter(idx => !usedIndices.includes(idx));
        
        if (availableIndices.length > 0) {
          // Pick random available volunteer
          const newIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
          const newData = volunteers[newIndex];
          
          // Update node data
          node.currentDataIndex = newIndex;
          node.el.querySelector('img').src = newData.img;
          node.el.querySelector('.name-line').textContent = newData.name;
          node.el.querySelector('.brand-line').textContent = newData.brand;
        }
        
        // Fade in
        node.el.style.opacity = '1';
        
        // Schedule next swap
        swapNodeImage(node);
      }, 1000);
    }, delay);
  }

  function startImageSwapping() {
    nodes.forEach(node => swapNodeImage(node));
  }

  function animate() {
    rotationY += rotationSpeed;
    arrangeNodes();
    requestAnimationFrame(animate);
  }

  // Initialize
  createNodes();
  animate();
  startImageSwapping();
  
  window.addEventListener('resize', arrangeNodes);
});
// =====================================================================
// ===================== END VOLUNTEERS SECTION ========================
// =====================================================================

document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal-up");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  reveals.forEach(el => observer.observe(el));
});
const revealItems = document.querySelectorAll('.reveal-up');

const revealOnScroll = () => {
  revealItems.forEach(item => {
    const top = item.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      item.classList.add('active');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();
const cards = document.querySelectorAll(".testimonial-card");
let index = 0;

function showCard(i) {
  cards.forEach(card => card.classList.remove("active"));
  cards[i].classList.add("active");
}

function nextCard() {
  index = (index + 1) % cards.length;
  showCard(index);
}

function prevCard() {
  index = (index - 1 + cards.length) % cards.length;
  showCard(index);
}

document.getElementById("slideUpBtn").onclick = prevCard;
document.getElementById("slideDownBtn").onclick = nextCard;

// Auto slide
setInterval(nextCard, 7000);

// Reveal on load
window.addEventListener("load", () => {
  document.querySelector(".reveal-up").classList.add("active");
});
// Trigger reveal animation on scroll, every time element enters viewport
const revealElements = document.querySelectorAll('.reveal-up');

window.addEventListener('scroll', () => {
  const triggerBottom = window.innerHeight * 0.85;

  revealElements.forEach(el => {
    const top = el.getBoundingClientRect().top;

    if (top < triggerBottom && top + el.offsetHeight > 0) {
      // Element is in viewport, add animation
      el.classList.add('active');
    } else {
      // Element out of viewport, remove animation to allow retrigger
      el.classList.remove('active');
    }
  });
});
document.getElementById("year").textContent = new Date().getFullYear();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
}, { threshold: 0.15 });

document.querySelectorAll(".footer-animate")
  .forEach(el => observer.observe(el));
  /* ================================
     PROGRAMS SECTION - "Know More" Click Glow Effect
     Highlights the program card with an orange gradient when clicked
  ================================= */
  
  const buttons = document.querySelectorAll('.know-more');

  buttons.forEach(btn => {
    btn.addEventListener('click', function () {
      const card = this.closest('.program-card');

      card.classList.add('active');

      setTimeout(() => {
        card.classList.remove('active');
      }, 800);
    });
  });

  /* ================================
     PROGRAMS SECTION - Slide Up Animation on Scroll
     Adds/removes .show class to cards when they enter viewport
  ================================= */
  
  const programCards = document.querySelectorAll('.program-card');

  function checkCardsInView() {
    const triggerBottom = window.innerHeight * 0.85;

    programCards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;

      if (cardTop < triggerBottom) {
        card.classList.add('show');
      } else {
        card.classList.remove('show');
      }
    });
  }

  window.addEventListener('scroll', checkCardsInView);
  window.addEventListener('load', checkCardsInView);

/* FOCUS AREA NEW FEATURES*/
document.querySelectorAll(".focus-header").forEach(header => {

    header.addEventListener("click", () => {

        const item = header.parentElement;

        document.querySelectorAll(".focus-item").forEach(el => {
            if (el !== item) {
                el.classList.remove("active");
            }
        });

        item.classList.toggle("active");

    });

});
// ============================================
// DESKTOP TESTIMONIAL CAROUSEL - FETCHES FROM JSON
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Only initialize if we're on desktop (window width >= 992)
  if (window.innerWidth >= 992) {
    initDesktopTestimonialCarousel();
  }
  
  // Re-initialize on resize if crossing the 992px threshold
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth >= 992) {
        // Check if carousel already exists and has content
        const track = document.getElementById('testimonialTrack');
        if (track && track.children.length === 0) {
          initDesktopTestimonialCarousel();
        }
      }
    }, 250);
  });
});

let autoSlideInterval;
let currentIndex = 0;
let totalSlides = 0;

async function initDesktopTestimonialCarousel() {
  try {
    // Fetch testimonials from JSON file
    const response = await fetch('testimonials.json');
    const testimonials = await response.json();
    
    // Initialize carousel with fetched testimonials
    createDesktopCarousel(testimonials);
  } catch (error) {
    console.error('Error loading testimonials:', error);
    // Fallback: Use hardcoded testimonials if JSON fetch fails
    const fallbackTestimonials = getFallbackTestimonials();
    createDesktopCarousel(fallbackTestimonials);
  }
}

function createDesktopCarousel(testimonials) {
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('testimonialDots');
  
  if (!track) return;
  
  // Clear any existing content
  track.innerHTML = '';
  
  // Populate track with testimonial cards
  testimonials.forEach(testimonial => {
    const card = createDesktopTestimonialCard(testimonial);
    track.appendChild(card);
  });
  
  // Carousel state
  currentIndex = 0;
  const cardsPerView = 3;
  totalSlides = Math.ceil(testimonials.length / cardsPerView);
  
  // Create dots
  createDots(totalSlides, dotsContainer, currentIndex);
  
  // Add arrow event listeners
  const leftArrow = document.querySelector('.desktop-arrow-left');
  const rightArrow = document.querySelector('.desktop-arrow-right');
  
  leftArrow.addEventListener('click', () => {
    goToPreviousSlide();
    resetAutoSlide(); // Reset timer when manually navigated
  });
  
  rightArrow.addEventListener('click', () => {
    goToNextSlide();
    resetAutoSlide(); // Reset timer when manually navigated
  });
  
  // Add dot click listeners
  const dots = document.querySelectorAll('.desktop-dot');
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoSlide(); // Reset timer when manually navigated
    });
  });
  
  // Initial position
  updateCarousel(currentIndex, track, cardsPerView, testimonials.length);
  
  // Start auto-slide (every 5 seconds)
  startAutoSlide();
  
  // Pause auto-slide when hovering over carousel
  const carouselWrapper = document.querySelector('.desktop-carousel-wrapper');
  carouselWrapper.addEventListener('mouseenter', pauseAutoSlide);
  carouselWrapper.addEventListener('mouseleave', resumeAutoSlide);
}

function createDesktopTestimonialCard(testimonial) {
  const card = document.createElement('div');
  card.className = 'desktop-testimonial-card';
  
  // Format phone number if exists
  const phoneHTML = testimonial.phone ? `<a href="tel:${testimonial.phone}">${testimonial.phone}</a>` : '';
  
  card.innerHTML = `
    <div class="testimonial-logo">
      <img src="logo.webp" alt="UDUF Africa Logo" loading="lazy">
    </div>
    <p class="testimonial-text">${testimonial.text}</p>
    <div class="testimonial-author">
      <img src="${testimonial.image}" alt="${testimonial.name}" loading="lazy">
      <div>
        <h4>${testimonial.name}</h4>
        <span>${testimonial.title}</span>
        ${phoneHTML}
      </div>
    </div>
  `;
  
  return card;
}

function createDots(totalSlides, container, currentIndex) {
  if (!container) return;
  
  container.innerHTML = '';
  
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = `desktop-dot ${i === currentIndex ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetAutoSlide();
    });
    container.appendChild(dot);
  }
}

function updateCarousel(index, track, cardsPerView, totalItems) {
  const maxIndex = Math.ceil(totalItems / cardsPerView) - 1;
  const safeIndex = Math.min(Math.max(index, 0), maxIndex);
  currentIndex = safeIndex;
  
  // Calculate translation percentage
  const translateX = safeIndex * 100;
  track.style.transform = `translateX(-${translateX}%)`;
  
  // Update dots
  updateDots(safeIndex);
}

function updateDots(index) {
  const dots = document.querySelectorAll('.desktop-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

// Navigation functions
function goToNextSlide() {
  if (currentIndex < totalSlides - 1) {
    const track = document.getElementById('testimonialTrack');
    const cardsPerView = 3;
    const totalItems = track.children.length;
    currentIndex++;
    updateCarousel(currentIndex, track, cardsPerView, totalItems);
  } else {
    // Loop back to first slide
    goToSlide(0);
  }
}

function goToPreviousSlide() {
  if (currentIndex > 0) {
    const track = document.getElementById('testimonialTrack');
    const cardsPerView = 3;
    const totalItems = track.children.length;
    currentIndex--;
    updateCarousel(currentIndex, track, cardsPerView, totalItems);
  } else {
    // Loop to last slide
    const track = document.getElementById('testimonialTrack');
    const cardsPerView = 3;
    const totalItems = track.children.length;
    const lastSlide = Math.ceil(totalItems / cardsPerView) - 1;
    goToSlide(lastSlide);
  }
}

function goToSlide(index) {
  const track = document.getElementById('testimonialTrack');
  const cardsPerView = 3;
  const totalItems = track.children.length;
  const maxIndex = Math.ceil(totalItems / cardsPerView) - 1;
  const safeIndex = Math.min(Math.max(index, 0), maxIndex);
  updateCarousel(safeIndex, track, cardsPerView, totalItems);
}

// Auto-slide functions
function startAutoSlide() {
  if (autoSlideInterval) clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(() => {
    goToNextSlide();
  }, 5000); // 5 seconds
}

function pauseAutoSlide() {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }
}

function resumeAutoSlide() {
  if (!autoSlideInterval) {
    startAutoSlide();
  }
}

function resetAutoSlide() {
  pauseAutoSlide();
  startAutoSlide();
}

// Fallback testimonials in case JSON fails to load
function getFallbackTestimonials() {
  return [
    {
      name: "Christopher Uchenna",
      title: "CEO – GEEPCHRIS BRIDGE",
      text: "I love UDUF Africa.",
      image: "review1.webp",
      phone: "07061507103"
    },
    {
      name: "Precious Leonard Ani",
      title: "Fashion Designer",
      text: "UDUF AFRICA is one organization that selflessly builds and equips individuals to the best they can ever be. Personally, this is a platform from where I got to learn life skills, entrepreneurship and leadership.",
      image: "review2.webp",
      phone: "09061749840"
    },
    {
      name: "Elijah Nwachukwu",
      title: "Software Developer",
      text: "After the teachings and insights shared, I knew UDUF Africa was where I needed to be. The networking was great.",
      image: "review3.webp",
      phone: "09165201092"
    },
    {
      name: "Ezuma Amara Rebecca",
      title: "Entrepreneur",
      text: "Uduf is an organization that has shaped my life as a young person, refining my values and mind and helping me to focus more on positive things that ensures my growth.",
      image: "user3.webp",
      phone: "08104044527"
    },
    {
      name: "Mgbadigha Miracle Chisom",
      title: "Entrepreneur",
      text: "I bless the day I joined uduf Africa, they brought out a part in me that I never knew existed, the growth part both in business and other areas of life.",
      image: "miracle.webp",
      phone: "08160357692"
    },
    {
      name: "DB Joshua Ikechukwu",
      title: "CEO, Dream-Care Global",
      text: "Being part of UDUF Africa has helped me build myself leadership skills and self confidence for the past 4 years now and still counting.",
      image: "joshua.webp",
      phone: "08142861390"
    }
  ];
}