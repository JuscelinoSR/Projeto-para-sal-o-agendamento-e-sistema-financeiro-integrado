const menuButton = document.querySelector('[data-menu-button]');
const mobileNav = document.querySelector('[data-mobile-nav]');
const header = document.querySelector('[data-elevate]');

function closeMenu() {
  document.body.classList.remove('menu-open');
  mobileNav?.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
}

menuButton?.addEventListener('click', () => {
  const isOpen = mobileNav?.classList.toggle('is-open');
  document.body.classList.toggle('menu-open', Boolean(isOpen));
  menuButton.setAttribute('aria-expanded', String(Boolean(isOpen)));
});

mobileNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

function updateHeader() {
  header?.classList.toggle('is-elevated', window.scrollY > 8);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth > 980) {
    closeMenu();
  }
});
