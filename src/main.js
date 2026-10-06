(() => {
  'use strict';
  const quote = document.querySelector('#quote-dialog');
  const photo = document.querySelector('#photo-dialog');
  const form = document.querySelector('#quote-form');
  let selectedProduct = document.body.dataset.product;
  const setQuoteProduct = value => {
    for (const input of form.querySelectorAll('[name="product"]')) input.checked = input.value === value;
  };
  setQuoteProduct(selectedProduct);
  const tabs = [...document.querySelectorAll('[data-product-tab]')];
  const selectProduct = tab => {
    for (const item of tabs) {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(item.getAttribute('aria-controls'));
      panel.hidden = !active;
      panel.classList.toggle('is-entering', active);
    }
    selectedProduct = tab.dataset.productTab === 'gas' ? 'Doğalgaz panosu' : 'Su sayacı kapağı / panosu';
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectProduct(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectProduct(tabs[next]); tabs[next].focus(); }
    });
  });
  document.querySelectorAll('[data-quote]').forEach(button => {
    button.addEventListener('click', () => {
      setQuoteProduct(button.dataset.quote || selectedProduct);
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
        const b = dialog.getBoundingClientRect();
        if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) dialog.close();
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
  document.querySelectorAll('[data-year]').forEach(element => { element.textContent = String(new Date().getFullYear()); });
})();
