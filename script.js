// ============================================================
// STICKH TECHH INDUSTRY — shared behaviour
// ============================================================

// ---- Barcode bar generator (deterministic pseudo-random) ----
function seededRandom(seed){
  let s = seed;
  return function(){
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildBarcode(el){
  const seed = parseInt(el.dataset.seed || '7', 10);
  const rand = seededRandom(seed);
  const count = parseInt(el.dataset.bars || '46', 10);
  el.innerHTML = '';
  for(let i=0;i<count;i++){
    const w = rand() > 0.78 ? 3 : (rand() > 0.4 ? 1 : 2);
    const bar = document.createElement('span');
    bar.style.width = w + 'px';
    bar.style.opacity = rand() > 0.9 ? '0.35' : '1';
    el.appendChild(bar);
  }
}

document.querySelectorAll('.barcode-strip').forEach(buildBarcode);

// ---- QR-ish grid filler ----
document.querySelectorAll('.qr-grid').forEach((grid, gi) => {
  const rand = seededRandom(gi + 3);
  for(let i=0;i<36;i++){
    const cell = document.createElement('i');
    if(rand() > 0.52) cell.classList.add('off');
    grid.appendChild(cell);
  }
});

// ---- Mobile nav ----
const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const navClose = document.querySelector('.mobile-nav .close-btn');
if(navToggle && mobileNav){
  navToggle.addEventListener('click', () => mobileNav.classList.add('open'));
  navClose && navClose.addEventListener('click', () => mobileNav.classList.remove('open'));
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));
}

// ---- Scroll reveal ----
const revealEls = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window && revealEls.length){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// ---- Contact form (front-end only, no backend wired up) ----
const contactForm = document.getElementById('contact-form');
if(contactForm){
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    setTimeout(() => {
      status.classList.add('show');
      status.textContent = 'Message received — our team will get back to you shortly.';
      btn.textContent = 'Send message';
      contactForm.reset();
    }, 700);
  });
}
