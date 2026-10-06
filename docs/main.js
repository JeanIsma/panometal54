(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#site-nav');
  const setMenu = open => {
    menu.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  };
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      setMenu(false); menu.focus();
    }
  });
  const quote = document.querySelector('#quote-dialog');
  const photo = document.querySelector('#photo-dialog');
  const product = document.querySelector('#product');
  product.value = document.body.dataset.product;
  const form = document.querySelector('#quote-form');
  document.querySelectorAll('[data-quote]').forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.quote) product.value = button.dataset.quote;
      quote.showModal();
    });
  });
  document.querySelectorAll('[data-photo]').forEach(button => {
    button.addEventListener('click', () => {
      const image = button.querySelector('img');
      document.querySelector('#enlarged-photo').src = image.src;
      document.querySelector('#enlarged-photo').alt = image.alt;
      document.querySelector('#photo-caption').textContent = button.dataset.caption || image.alt;
      photo.showModal();
    });
  });
  [quote,photo].forEach(dialog => {
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target === dialog) {
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
      }
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const lines = ['Merhaba Özcan Usta, '+fields.get('product')+' için fiyat almak istiyorum.'];
    if (fields.get('width')) lines.push('Yaklaşık en: '+fields.get('width')+' cm');
    if (fields.get('height')) lines.push('Yaklaşık boy: '+fields.get('height')+' cm');
    if (String(fields.get('district') || '').trim()) lines.push('İlçe: '+fields.get('district').trim());
    if (String(fields.get('note') || '').trim()) lines.push('Not: '+fields.get('note').trim());
    lines.push('Uygulama alanının fotoğrafını bu görüşmede paylaşacağım.');
    const phone = document.body.dataset.whatsapp.replace(/\D/g,'');
    window.location.assign('https://wa.me/'+phone+'?text='+encodeURIComponent(lines.join('\n')));
  });
  document.querySelectorAll('[data-year]').forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });
})();
