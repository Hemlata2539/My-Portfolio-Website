const tabs = document.querySelectorAll('.tab-btn');
const sections = Array.from(tabs).map(t => document.getElementById(t.dataset.target)).filter(Boolean);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const tabsNav = document.getElementById('tabs');
let lastActiveId = null;

function setActive(id){
  if (id === lastActiveId) return;
  lastActiveId = id;
  tabs.forEach(t => t.classList.toggle('active', t.dataset.target === id));

  const activeTab = Array.from(tabs).find(t => t.dataset.target === id);
  if (activeTab && tabsNav) {
    activeTab.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'nearest'
    });
  }
}

/* --- active tab tracking (unchanged) --- */
const tabObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      setActive(entry.target.id);
    }
  });
}, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

sections.forEach(s => tabObserver.observe(s));

/* --- scroll-reveal: pages fade + rise into view once --- */
const revealTargets = document.querySelectorAll('.page, .sticky-note');

if (reduceMotion) {
  revealTargets.forEach(el => el.classList.add('in-view'));
} else {
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));
}

/* --- reading progress bar --- */
const progressBar = document.getElementById('progress-bar');

function updateProgress(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + '%';
}

if (progressBar){
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking){
      window.requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  updateProgress();
}

/* --- gentle hero parallax on scroll --- */
const heroInner = document.querySelector('.hero');
if (heroInner && !reduceMotion) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroInner.style.transform = `translateY(${y * 0.08}px)`;
      heroInner.style.opacity = String(Math.max(1 - y / 700, 0.35));
    }
  }, { passive: true });
}