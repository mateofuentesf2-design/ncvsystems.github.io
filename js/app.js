document.addEventListener('DOMContentLoaded', () => {
  // --- HEADER SCROLL EFFECT ---
  const header = document.querySelector('.header-global');
  const scrollThreshold = 20;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check in case of refresh

  // --- MOBILE MENU TOGGLE ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
      
      // Toggle icon representation
      if (navMenu.classList.contains('active')) {
        menuToggle.innerHTML = '&#x2715;'; // Close symbol (X)
      } else {
        menuToggle.innerHTML = '&#x2630;'; // Hamburger symbol
      }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '&#x2630;';
      });
    });
  }

  // --- ACTIVE LINK DETECTION ---
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Normalize paths to check matching
    // Handle home specifically
    if (href === '/' || href === '/index.html') {
      if (currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/ncvsystems.github.io/')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    } else {
      // For pages like /neurocore/ or /neurocore/index.html
      const cleanHref = href.replace(/^\/|\/$/g, ''); // Remove leading/trailing slashes
      if (currentPath.includes(cleanHref) && cleanHref !== '') {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });

  // --- NETWORK STATUS WIDGET ANIMATOR (Footer) ---
  const encBadge = document.querySelector('.enc-badge');
  if (encBadge) {
    // Periodically simulate security handshakes or updates
    const securityCodes = ['AES-GCM-256', 'ECDHE-RSA-AES256', 'CHACHA20-POLY1305', 'TLSv1.3 // SECURE'];
    let index = 0;
    
    setInterval(() => {
      // Randomize display a bit to make it look alive
      if (Math.random() > 0.4) {
        index = (index + 1) % securityCodes.length;
        encBadge.textContent = `ENC: ${securityCodes[index]}`;
        encBadge.style.opacity = '0.5';
        setTimeout(() => {
          encBadge.style.opacity = '1';
        }, 150);
      }
    }, 8000);
  }

  // Log to signify system load
  console.log(`
  [NCV SYSTEMS // CORE INTERFACE TERMINAL INITIALIZED]
  -----------------------------------------
  STATUS: SECURE
  PROTOCOL: HTTPS
  SOVEREIGNTY LEVEL: MAXIMUM
  -----------------------------------------
  `);
});
