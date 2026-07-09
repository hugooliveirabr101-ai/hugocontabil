/* =========================================================
   HUGO OLIVEIRA — INTERAÇÕES DO PORTFÓLIO
   Menu, animações, navegação, galeria e controles flutuantes.
   Sem bibliotecas externas.
   ========================================================= */

'use strict';

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const menuLinks = [...document.querySelectorAll('.menu a')];
const backToTop = document.querySelector('.back-to-top');

function closeMenu() {
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Abrir menu');
  menu?.classList.remove('open');
  document.body.classList.remove('menu-open');
}

menuToggle?.addEventListener('click', () => {
  const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(opening));
  menuToggle.setAttribute('aria-label', opening ? 'Fechar menu' : 'Abrir menu');
  menu?.classList.toggle('open', opening);
  document.body.classList.toggle('menu-open', opening);
});

menuLinks.forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

function updateFloatingControls() {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
  backToTop?.classList.toggle('visible', window.scrollY > 700);
}

window.addEventListener('scroll', updateFloatingControls, { passive: true });
updateFloatingControls();

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Animações discretas ao entrar na área visível.
const revealItems = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach(item => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -35px' });

  revealItems.forEach(item => revealObserver.observe(item));
}

// Destaque automático do item do menu correspondente à seção visível.
const sectionLinks = menuLinks
  .map(link => ({ link, id: link.getAttribute('href')?.replace('#', '') }))
  .filter(item => item.id);

const trackedSections = sectionLinks
  .map(item => document.getElementById(item.id))
  .filter(Boolean);

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    menuLinks.forEach(link => link.classList.remove('active'));
    sectionLinks.find(item => item.id === visible.target.id)?.link.classList.add('active');
  }, { threshold: [0.18, 0.35, 0.55], rootMargin: '-18% 0px -58%' });

  trackedSections.forEach(section => sectionObserver.observe(section));
}

// Galeria com visualização ampliada.
const lightbox = document.querySelector('#lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxCaption = lightbox?.querySelector('p');
const lightboxClose = lightbox?.querySelector('.lightbox-close');

function closeLightbox() {
  if (lightbox?.open) lightbox.close();
}

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const thumbnail = item.querySelector('img');
    if (!lightbox || !lightboxImage || !lightboxCaption || !thumbnail) return;

    lightboxImage.src = item.dataset.full || thumbnail.src;
    lightboxImage.alt = thumbnail.alt || 'Imagem ampliada';
    lightboxCaption.textContent = item.dataset.caption || '';
    lightbox.showModal();
    lightboxClose?.focus();
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});
