(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('menu');
  var brand = document.querySelector('.brand');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var desktop = window.matchMedia('(min-width: 960px)');

  /* ---------- Header: borda ao rolar ---------- */
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  function isOpen() {
    return toggle.getAttribute('aria-expanded') === 'true';
  }

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  }

  toggle.addEventListener('click', function () {
    setMenu(!isOpen());
  });

  nav.addEventListener('click', function (event) {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', function (event) {
    if (!isOpen()) return;

    if (event.key === 'Escape') {
      setMenu(false);
      toggle.focus();
      return;
    }

    if (event.key === 'Tab') {
      var focusable = [brand, toggle].concat(Array.prototype.slice.call(nav.querySelectorAll('a[href]')));
      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  function onBreakpointChange(event) {
    if (event.matches) setMenu(false);
  }
  if (desktop.addEventListener) {
    desktop.addEventListener('change', onBreakpointChange);
  } else {
    desktop.addListener(onBreakpointChange);
  }

  /* ---------- Item ativo do menu ---------- */
  if ('IntersectionObserver' in window) {
    var sections = navLinks
      .map(function (link) { return document.querySelector(link.getAttribute('href')); })
      .filter(Boolean);

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------- Revelar ao rolar ---------- */
  var revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  /* ---------- WhatsApp flutuante: some perto de outros botões ---------- */
  var floatButton = document.querySelector('.wa-float');
  var watched = document.querySelectorAll('.hero__actions, #contato, .site-footer');

  if (floatButton && 'IntersectionObserver' in window) {
    var visibleCount = 0;
    var floatObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visibleCount += entry.isIntersecting ? 1 : -1;
      });
      floatButton.classList.toggle('is-hidden', visibleCount > 0);
    });
    watched.forEach(function (el) { floatObserver.observe(el); });
  }

  /* ---------- Ano do rodapé ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();