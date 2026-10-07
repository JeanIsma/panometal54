(() => {
  'use strict';
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  const dialog = document.querySelector('#photo-dialog');
  const image = document.querySelector('#enlarged-photo');
  const caption = document.querySelector('#photo-caption');
  if (!dialog || !image) return;
  let opener;
  const close = () => dialog.close();
  document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
    const source = button.querySelector('img');
    opener = button;
    image.src = source.currentSrc || source.src;
    image.alt = source.alt;
    caption.textContent = source.alt;
    dialog.showModal();
    document.body.classList.add('photo-open');
  }));
  dialog.querySelector('.photo-close').addEventListener('click', close);
  dialog.addEventListener('click', event => { if(event.target === dialog) close(); });
  dialog.addEventListener('close', () => { document.body.classList.remove('photo-open'); opener?.focus(); });
})();
