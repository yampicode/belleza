
document.addEventListener('DOMContentLoaded', function () {
  // Selectores
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenu = document.getElementById('closeMenu');
  const overlay = document.getElementById('overlay');
  const body = document.body;

  // Evitar errores si faltan elementos
  if (!menuToggle || !mobileMenu || !overlay) {
    console.warn('Elementos del menú no encontrados, menú móvil desactivado.');
    return;
  }

  // Focusable elements para trap de foco
  const focusableSelector = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
  let savedScrollY = 0;

  function lockScroll() {
    savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    body.style.top = `-${savedScrollY}px`;
    body.classList.add('no-scroll');
  }

  function unlockScroll() {
    body.classList.remove('no-scroll');
    body.style.top = '';
    // Restaurar scroll
    window.scrollTo(0, savedScrollY);
  }

  function openMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    lockScroll();

    // poner foco en el primer elemento focoable dentro del menú
    const focusable = Array.from(mobileMenu.querySelectorAll(focusableSelector))
                          .filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1);
    if (focusable.length) {
      focusable[0].focus();
    } else {
      // si no hay nada, enfocar el botón cerrar
      if (closeMenu) closeMenu.focus();
    }

    // añadir listener para trap/escape
    document.addEventListener('keydown', onKeydown);
  }

  function closeMenuFn() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    unlockScroll();

    // devolver foco al toggle
    menuToggle.focus();

    document.removeEventListener('keydown', onKeydown);
  }

  function onKeydown(e) {
    // ESC
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (mobileMenu.classList.contains('open')) {
        e.preventDefault();
        closeMenuFn();
      }
      return;
    }

    // Trap foco dentro del menú cuando está abierto
    if (e.key === 'Tab' && mobileMenu.classList.contains('open')) {
      const focusable = Array.from(mobileMenu.querySelectorAll(focusableSelector))
                            .filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1);
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // Listeners seguros
  menuToggle.addEventListener('click', function () {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    if (expanded) closeMenuFn(); else openMenu();
  });

  if (closeMenu) closeMenu.addEventListener('click', closeMenuFn);
  overlay.addEventListener('click', closeMenuFn);

  // cerrar al clicar cualquier enlace del menú
  const links = mobileMenu.querySelectorAll('a[href^="#"], a[href^="/"]');
  links.forEach(link => {
    link.addEventListener('click', closeMenuFn);
  });

  // Asegurar que si el usuario cambia pestaña (visibilitychange) reestablecemos el scroll / estado
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden' && mobileMenu.classList.contains('open')) {
      // cerrar para evitar estados raros al volver
      closeMenuFn();
    }
  });
});
