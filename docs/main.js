class Lenis {
  constructor() {}
  raf() {}
  scrollTo(target, { offset = 0 } = {}) {
    const top = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}
import { business, featuredProjects, serviceCards } from "./config.js";
import { create3DExperience } from "./scene.js";

const app = document.querySelector("#app");

const icons = {
  arrow: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M14 7l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4H5.8A1.8 1.8 0 0 0 4 5.8C4 13.64 10.36 20 18.2 20a1.8 1.8 0 0 0 1.8-1.8V16l-4.3-1-1.15 2.02a14.1 14.1 0 0 1-7.57-7.57L9 8.3 8 4Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.55A8 8 0 0 1 8.15 18.6L4 20l1.36-4.02A8 8 0 1 1 20 11.55Z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8.4 7.9c.3-.7.62-.72.9-.73h.4c.14 0 .36.05.55.48.18.43.63 1.54.69 1.65.06.11.1.24.02.39-.08.15-.12.24-.24.37-.12.13-.25.29-.36.39-.12.12-.25.25-.1.49.15.24.66 1.08 1.42 1.75.98.87 1.8 1.14 2.06 1.27.25.12.4.1.55-.06.15-.16.64-.75.81-1 .17-.25.34-.21.57-.13.24.08 1.5.71 1.76.84.26.13.43.19.49.29.06.1.06.58-.14 1.14-.2.56-1.16 1.07-1.6 1.14-.4.07-.9.1-1.46-.08-.34-.11-.78-.25-1.34-.5-.23-.1-2.42-.9-4.11-3.16-.47-.62-.99-1.39-1.1-2-.12-.62-.01-1.2.18-1.62Z" fill="currentColor" stroke="none"/></svg>`,
  measure: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 16 12-12 4 4L8 20H4v-4Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m13 7 4 4M10.5 9.5l2 2M8 12l2 2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
  spark: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c.8 5.6 2.4 7.2 8 8-5.6.8-7.2 2.4-8 8-.8-5.6-2.4-7.2-8-8 5.6-.8 7.2-2.4 8-8Z" fill="currentColor"/><path d="M19 16c.3 2.1.9 2.7 3 3-2.1.3-2.7.9-3 3-.3-2.1-.9-2.7-3-3 2.1-.3 2.7-.9 3-3Z" fill="currentColor" opacity=".7"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="17.35" cy="6.7" r="1.2" fill="currentColor"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-7h2.6l.4-3h-3v-1.9c0-.9.3-1.5 1.6-1.5H16V5.1c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2H7.3v3h2.5v7h3.7Z" fill="currentColor"/></svg>`,
  close: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`
};

const brandMark = `<svg viewBox="0 0 56 56" role="img" aria-label="PanoMetal54"><rect x="6" y="6" width="44" height="44" rx="8" fill="none" stroke="currentColor" stroke-width="4"/><path d="M17 39V17h13c5 0 8 2.7 8 7.1S35 31 30 31h-6v8h-7Zm7-14h5.2c1.9 0 2.8-.9 2.8-2.5S31.1 20 29.2 20H24v5Z" fill="currentColor"/><path d="M33.5 36.5h9" stroke="#ff5a1f" stroke-width="3.4" stroke-linecap="round"/><path d="M38 31v11" stroke="#ff5a1f" stroke-width="3.4" stroke-linecap="round"/><circle cx="43.5" cy="15" r="4" fill="#ff5a1f"/></svg>`;

const waUrl = (message) => {
  if (!business.whatsapp) return "#";
  return `https://wa.me/${business.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
};
const phoneUrl = business.phone ? `tel:${business.phone.replace(/\s/g, "")}` : "#";

const projectCard = (project, index) => `
<article class="inspiration-card reveal ${index === 0 ? "featured" : ""}" data-product-id="${project.id}" data-product-type="featured">
  <div class="card-image-wrap">
    <img src="${project.image}" alt="${project.title}" loading="${index < 2 ? "eager" : "lazy"}" decoding="async" style="object-position:${project.imagePosition || "center"}">
    <span class="concept-label">GERÇEK PROJE</span>
    <button class="image-quote" data-quick-product="${project.title}"><span>Bu işe benzer fiyat sor</span>${icons.arrow}</button>
  </div>
  <div class="card-body">
    <div class="card-meta"><span>${String(index + 1).padStart(2, "0")}</span><span>${project.category}</span></div>
    <p class="card-eyebrow">${project.eyebrow}</p>
    <h3>${project.title}</h3>
    <p>${project.description}</p>
    <div class="tag-row">${project.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
  </div>
</article>`;

const solutionCard = (product, index) => `
<article class="solution-card reveal" data-product-id="${product.id}" data-product-type="solution">
  <div class="solution-visual"><img src="${product.image}" alt="${product.title}" loading="lazy"><span class="solution-number">${String(index + 1).padStart(2, "0")}</span></div>
  <div class="solution-copy">
    <span class="solution-category">${product.category}</span>
    <h3>${product.title}</h3>
    <p>${product.description}</p>
    <div class="tag-row">${product.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
    <button class="text-link" data-quick-product="${product.title}">WhatsApp ile fiyat sor ${icons.arrow}</button>
  </div>
</article>`;

app.innerHTML = `
<a class="skip-link" href="#main">İçeriğe geç</a>
<div class="loader" id="loader" aria-label="Site yükleniyor">
  <div class="loader-logo">${brandMark}</div>
  <div class="loader-name">PANOMETAL54</div>
  <div class="loader-line"><span id="loaderBar"></span></div>
</div>
<header class="site-header" id="siteHeader">
  <a class="brand" href="#top" aria-label="PanoMetal54 ana sayfa">
    <span class="brand-mark">${brandMark}</span>
    <span class="brand-copy"><strong>PANOMETAL54</strong><small>METAL PANO & KAYNAK İŞLERİ · SAKARYA</small></span>
  </a>
  <nav class="desktop-nav" aria-label="Ana menü">
    <a href="#projeler">Projeler</a>
    <a href="#hizmetler">Hizmetler</a>
    <a href="#surec">Nasıl Çalışır?</a>
    <a href="#hakkimizda">Hakkımızda</a>
  </nav>
  <div class="header-actions">
    <button class="button button-ghost hide-small" data-open-quote>Fiyat Sor</button>
    <button class="button button-dark" data-whatsapp-general>${icons.whatsapp}<span>WhatsApp</span></button>
    <button class="menu-toggle" id="menuToggle" aria-label="Menüyü aç" aria-expanded="false"><i></i><i></i></button>
  </div>
  <div class="mobile-menu" id="mobileMenu">
    <a href="#projeler">Projeler</a><a href="#hizmetler">Hizmetler</a><a href="#surec">Nasıl Çalışır?</a><a href="#hakkimizda">Hakkımızda</a><a href="#sss">Sık Sorulanlar</a>
    <button class="button button-orange" data-open-quote>Ücretsiz fiyat görüşmesi</button>
  </div>
</header>
<main id="main">
  <section class="hero" id="top">
    <div class="hero-photo" aria-hidden="true">
      <img src="./images/projects/hero-gazebo.jpg" alt="" fetchpriority="high">
      <div class="hero-photo-overlay"></div>
      <div class="hero-photo-caption"><span></span>GERÇEK İŞ FOTOĞRAFI</div>
    </div>
    <div class="hero-content container">
      <div class="hero-copy-block">
        <div class="hero-badge"><span></span>Sakarya’da gerçek üretim işleri</div>
        <h1>PanoMetal54 ile<br><em>gerçek metal çözümler.</em></h1>
        <p class="hero-lead">Bu sitede yalnızca gerçek iş fotoğraflarımızdan gelen hizmetler yer alır: su sayacı panosu, metal dolap, raf sistemi, kapı ve korkuluk, bahçe metal işleri, baca muhafazası ve özel üretim kaynak işleri.</p>
        <div class="hero-actions">
          <button class="button button-orange button-large" data-open-quote>Fotoğraf gönder, fiyat sor ${icons.arrow}</button>
          <button class="button button-light button-large" data-phone>${icons.phone} Hemen ara</button>
        </div>
        <p class="hero-note">İnsanlar bize en hızlı şekilde WhatsApp üzerinden ulaşsın diye butonlar aktif bırakıldı.</p>
        <div class="social-inline"><a href="${business.instagram}" target="_blank" rel="noopener noreferrer">${icons.instagram}<span>Instagram / panometal54</span></a><a href="${business.facebook}" target="_blank" rel="noopener noreferrer">${icons.facebook}<span>Facebook / panometal54</span></a></div>
      </div>
      <aside class="hero-quote-card">
        <div class="quote-card-top"><span>HIZLI TEKLİF</span><strong>60 saniye</strong></div>
        <h2>Hangi iş için fiyat istiyorsunuz?</h2>
        <div class="quick-choices" id="quickChoices">
          ${["Su sayacı panosu", "Metal dolap / pano", "Kapı / korkuluk", "Raf sistemi", "Bahçe metal işi", "Özel üretim parça"].map((v, i) => `<button class="quick-choice ${i === 0 ? "active" : ""}" data-choice="${v}">${v}<span>+</span></button>`).join("")}
        </div>
        <button class="button button-dark full" id="quickQuoteButton">Devam et ${icons.arrow}</button>
        <div class="quote-assurance"><span>${icons.measure}</span><p>Yaklaşık ölçü veya telefon fotoğrafı ilk değerlendirme için yeterlidir.</p></div>
      </aside>
    </div>
    <div class="hero-trustbar">
      <div class="container trustbar-inner">
        <div><strong>${business.experienceYears} yıl</strong><span>Kaynak ve metal tecrübesi</span></div>
        <div><strong>Gerçek işler</strong><span>Sadece gönderdiğiniz fotoğraflardaki hizmetler</span></div>
        <div><strong>WhatsApp öncelikli</strong><span>Hızlı dönüş için</span></div>
        <div><strong>${business.city}</strong><span>${business.serviceArea}</span></div>
      </div>
    </div>
  </section>

  <section class="section intro-strip">
    <div class="container intro-strip-grid">
      <div class="section-label reveal">PANOMETAL54</div>
      <div class="intro-strip-copy reveal"><h2>Hazır katalog değil.<br>Gerçek iş fotoğrafı var,<br><span>aynı çizgide üretim var.</span></h2></div>
      <div class="intro-strip-text reveal"><p>Bu sitedeki tüm hizmet alanları doğrudan paylaştığınız fotoğraflara göre düzenlendi. Yani burada görmediğiniz ayrı bir servis eklenmedi. İnsanlar gördüğü iş üzerinden karar verebilir.</p><button class="text-link" data-open-quote>Projenizi WhatsApp'tan gönderin ${icons.arrow}</button></div>
    </div>
  </section>

  <section class="section inspiration-section" id="projeler">
    <div class="container">
      <div class="section-heading reveal">
        <div><span class="section-label">GERÇEK İŞLERİMİZ</span><h2>Fotoğraflardan seçilen<br>en iyi görünen işler.</h2></div>
        <p>Bu bölümde yalnızca sizden gelen iş fotoğrafları kullanıldı. Ziyaretçiler burada gerçek üretim örneklerini görür.</p>
      </div>
      <div class="inspiration-grid">${featuredProjects.map(projectCard).join("")}</div>
      <div class="inspiration-cta reveal"><div><span>${icons.spark}</span><p>Beğendiğiniz işin benzerini istiyorsanız fotoğrafınızı gönderin.</p></div><button class="button button-dark" data-whatsapp-photo>WhatsApp’tan fotoğraf gönder ${icons.arrow}</button></div>
    </div>
  </section>

  <section class="section solutions-section" id="hizmetler">
    <div class="container">
      <div class="section-heading light reveal">
        <div><span class="section-label">SUNDUĞUMUZ HİZMETLER</span><h2>Fotoğraflarda görünen<br>iş grupları.</h2></div>
        <p>Su sayacı panoları, metal dolaplar, raf sistemleri, kapı ve korkuluk, bahçe işleri, baca muhafazası ve özel stand çözümleri.</p>
      </div>
      <div class="solutions-grid">${serviceCards.map(solutionCard).join("")}</div>
    </div>
  </section>

  <section class="journey" id="surec" aria-label="PanoMetal54 üretim süreci">
    <div class="journey-sticky">
      <canvas id="world-canvas" aria-label="Fikirden montaja uzanan üç boyutlu üretim süreci"></canvas>
      <div class="journey-shade"></div>
      <div class="journey-title"><span class="section-label">FİKİRDEN MONTAJA</span><h2>Dört adımda<br>net ve sağlam süreç.</h2></div>
      <div class="process-panels">
        <article class="process-panel" data-process="0"><span class="process-index">01</span><div><h3>Fotoğraf veya ihtiyacı alıyoruz.</h3><p>Müşteri işi anlatır, varsa mevcut alanı veya istediği ürünü fotoğrafla gönderir.</p></div></article>
        <article class="process-panel" data-process="1"><span class="process-index">02</span><div><h3>Ölçü ve plan belirlenir.</h3><p>Ürünün ölçüsü, kullanım amacı ve hangi malzemeyle üretileceği netleştirilir.</p></div></article>
        <article class="process-panel" data-process="2"><span class="process-index">03</span><div><h3>Üretim ve kaynak yapılır.</h3><p>Kesim, hazırlık, kaynak ve montaja hazır hale getirme aşamaları tamamlanır.</p></div></article>
        <article class="process-panel" data-process="3"><span class="process-index">04</span><div><h3>Teslim ve kurulum.</h3><p>İş tamamlandıktan sonra teslim edilir, gerekiyorsa yerine montajı yapılır.</p></div></article>
      </div>
      <div class="journey-progress">${[0, 1, 2, 3].map((_, i) => `<span data-dot="${i}"></span>`).join("")}</div>
    </div>
  </section>

  <section class="section master-section" id="hakkimizda">
    <div class="container master-grid">
      <div class="master-visual reveal">
        <img src="./images/projects/gate-decorative.jpg" alt="PanoMetal54 dekoratif metal kapı işi" loading="lazy">
        <div class="master-visual-card"><span>${business.experienceYears}</span><p>yıllık kaynak ve metal işleme tecrübesi</p></div>
      </div>
      <div class="master-copy reveal">
        <span class="section-label">NEDEN PANOMETAL54?</span>
        <h2>Gösterdiğimiz iş,<br>yapabildiğimiz iştir.</h2>
        <p class="large-copy">PanoMetal54 için site, paylaşılan gerçek iş fotoğrafları üzerinden yeniden düzenlendi. Böylece ziyaretçi doğrudan hangi işleri yaptığınızı görür ve size WhatsApp üzerinden hızlıca ulaşır.</p>
        <div class="master-points">
          <div><strong>01</strong><span>Fotoğraflarda olan iş kolları ön plana çıkarıldı.</span></div>
          <div><strong>02</strong><span>WhatsApp iletişimi ana kanal olarak bırakıldı.</span></div>
          <div><strong>03</strong><span>Instagram ve Facebook hesabı marka güveni için gösterildi.</span></div>
          <div><strong>04</strong><span>Su panosu, dolap, raf, kapı ve özel parçalar açıkça ayrıldı.</span></div>
        </div>
        <div class="master-actions"><button class="button button-orange" data-open-quote>WhatsApp ile görüşün ${icons.arrow}</button><button class="button button-outline-dark" data-phone>${icons.phone} Telefon</button></div>
      </div>
    </div>
  </section>

  <section class="section conversion-section">
    <div class="container conversion-grid">
      <div class="conversion-copy reveal"><span class="section-label">FİYAT ALMAK KOLAY</span><h2>Fotoğrafı yolla,<br>ölçüyü yaz,<br>WhatsApp'tan konuşalım.</h2></div>
      <div class="conversion-steps">
        <article class="reveal"><span>1</span><div><h3>İşi seç</h3><p>Sitedeki gerçek işlerden size en yakın olanı seçin.</p></div></article>
        <article class="reveal"><span>2</span><div><h3>Fotoğraf ve ölçü gönder</h3><p>Yeni işinizin fotoğrafını veya alan görüntüsünü paylaşın.</p></div></article>
        <article class="reveal"><span>3</span><div><h3>Fiyatı öğren</h3><p>Malzeme, ölçü ve teslimat detayına göre hızlı değerlendirme alın.</p></div></article>
      </div>
      <div class="conversion-action reveal"><button class="button button-white button-large" data-open-quote>Şimdi fiyat isteyin ${icons.arrow}</button><p>Öncelikli iletişim kanalı WhatsApp'tır.</p></div>
    </div>
  </section>

  <section class="section faq-section" id="sss">
    <div class="container faq-grid">
      <div class="faq-title reveal"><span class="section-label">SIK SORULANLAR</span><h2>İletişime geçmeden<br>önce merak edilenler.</h2><button class="text-link" data-open-quote>Fiyat istemek için başla ${icons.arrow}</button></div>
      <div class="faq-list reveal" id="faqList">
        ${[
          ["Sitede olmayan bir işi de sorabilir miyim?", "Bu versiyonda yalnızca gönderdiğiniz fotoğraflardan çıkan iş grupları öne çıkarıldı. Yine de benzer metal işleri WhatsApp üzerinden sorabilirsiniz."],
          ["Fiyatı nasıl öğrenebilirim?", "Yaklaşık ölçü, adet ve işin fotoğrafı gönderildiğinde ilk değerlendirme yapılabilir. Nihai fiyat malzeme ve detaylara göre netleşir."],
          ["WhatsApp ile mi ulaşmak gerekiyor?", "Evet, sitede WhatsApp öncelikli iletişim kanalı olarak bırakıldı. Telefon ve sosyal medya bağlantıları da ayrıca gösterilebilir."],
          ["Instagram ve Facebook hesabı var mı?", "Evet, marka adı panometal54 olarak sosyal medya hesapları gösterildi. Ancak fiyat ve iş takibi için en hızlı yol WhatsApp'tır."],
          ["Su sayacı panosu ve metal dolap özel ölçü olur mu?", "Evet. Görseldeki örnekler gibi pano, dolap ve koruma çözümleri ölçüye göre değerlendirilebilir."],
          ["Sakarya dışında iş alıyor musunuz?", "İşin büyüklüğüne ve teslimat durumuna göre çevre bölgeler ayrıca konuşulabilir."]
        ].map((item, i) => `<article class="faq-item ${i === 0 ? "open" : ""}"><button class="faq-question" aria-expanded="${i === 0}"><span>${item[0]}</span><i>+</i></button><div class="faq-answer"><p>${item[1]}</p></div></article>`).join("")}
      </div>
    </div>
  </section>

  <section class="final-cta">
    <div class="final-spark" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
    <div class="container final-cta-inner">
      <span class="section-label">PANOMETAL54 İLE İLETİŞİM</span>
      <h2>İhtiyacınızdaki metal işi<br><em>WhatsApp'tan konuşalım.</em></h2>
      <p>Fotoğrafı, çizimi veya yaklaşık ölçüyü gönderin. Uygunluğu ve fiyatı doğrudan PanoMetal54 ile konuşun.</p>
      <div class="final-actions"><button class="button button-orange button-large" data-whatsapp-photo>${icons.whatsapp} WhatsApp’tan fotoğraf gönder</button><button class="button button-light button-large" data-phone>${icons.phone} Hemen ara</button></div>
      <div class="final-info"><span>${business.city}, ${business.country}</span><span>${business.experienceYears} yıllık tecrübe</span><span>Gerçek iş fotoğraflarıyla sunum</span></div>
      <div class="social-inline center"><a href="${business.instagram}" target="_blank" rel="noopener noreferrer">${icons.instagram}<span>Instagram</span></a><a href="${business.facebook}" target="_blank" rel="noopener noreferrer">${icons.facebook}<span>Facebook</span></a></div>
    </div>
  </section>
</main>
<footer class="site-footer">
  <div class="container footer-top"><a class="brand footer-brand" href="#top"><span class="brand-mark">${brandMark}</span><span class="brand-copy"><strong>PANOMETAL54</strong><small>METAL PANO & KAYNAK İŞLERİ</small></span></a><p>Gerçek iş fotoğraflarıyla güven veren, WhatsApp odaklı metal üretim sitesi.</p></div>
  <div class="container footer-grid"><div><span>HİZMET</span><a href="#projeler">Su sayacı panoları</a><a href="#hizmetler">Metal dolaplar</a><a href="#hizmetler">Kapı ve korkuluk</a><a href="#hizmetler">Raf ve özel üretim</a></div><div><span>İLETİŞİM</span><button data-phone>${business.phoneDisplay}</button><button data-whatsapp-general>WhatsApp</button><a href="${business.instagram}" target="_blank" rel="noopener noreferrer">Instagram / panometal54</a><a href="${business.facebook}" target="_blank" rel="noopener noreferrer">Facebook / panometal54</a></div><div><span>MENÜ</span><a href="#surec">Nasıl çalışır?</a><a href="#hakkimizda">Hakkımızda</a><a href="#sss">Sık sorulanlar</a><button data-open-quote>Fiyat sor</button></div></div>
  <div class="container footer-bottom"><span>© ${new Date().getFullYear()} PanoMetal54</span><span>panometal54</span></div>
</footer>
<div class="mobile-contact-bar"><button data-phone>${icons.phone}<span>Ara</span></button><button data-open-quote>${icons.spark}<span>Fiyat Sor</span></button><button data-whatsapp-general>${icons.whatsapp}<span>WhatsApp</span></button></div>

<div class="modal-backdrop" id="quoteModal" aria-hidden="true">
  <div class="quote-modal" role="dialog" aria-modal="true" aria-labelledby="quoteTitle">
    <button class="modal-close" data-close-modal aria-label="Kapat">${icons.close}</button>
    <div class="quote-modal-head"><span>ÜCRETSİZ ÖN DEĞERLENDİRME</span><h2 id="quoteTitle">Projenizi kısaca anlatın.</h2><p>Formun sonunda bilgileriniz WhatsApp mesajına dönüştürülür. Fotoğrafı WhatsApp içinde ekleyebilirsiniz.</p></div>
    <div class="quote-progress"><span id="quoteProgressBar"></span></div>
    <div class="quote-body" id="quoteBody"></div>
  </div>
</div>
<div class="modal-backdrop" id="contactWarning" aria-hidden="true">
  <div class="small-modal" role="dialog" aria-modal="true"><button class="modal-close" data-close-modal aria-label="Kapat">${icons.close}</button><span class="section-label">İLETİŞİM BİLGİSİ GEREKİYOR</span><h2>Telefon ve WhatsApp numarasını ekleyin.</h2><p>Website yayına alınmadan önce <code>src/config.js</code> dosyasındaki <strong>phone</strong> ve <strong>whatsapp</strong> alanlarını doldurun. Şu anda numara uydurulmadığı için iletişim butonu devre dışıdır.</p><button class="button button-dark full" data-close-modal>Tamam</button></div>
</div>
<div class="cursor-dot"></div><div class="cursor-ring"></div>
`;

const loader = document.querySelector("#loader");
const loaderBar = document.querySelector("#loaderBar");
let loadValue = 0;
const loadTimer = setInterval(() => {
  loadValue = Math.min(90, loadValue + 8 + Math.random() * 14);
  loaderBar.style.width = `${loadValue}%`;
}, 90);

const openModal = (modal) => {
  document.querySelectorAll(".modal-backdrop.open").forEach(m => m.classList.remove("open"));
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  setTimeout(() => modal.querySelector("button, input, textarea, select")?.focus(), 100);
};
const closeModals = () => {
  document.querySelectorAll(".modal-backdrop.open").forEach(m => {
    m.classList.remove("open");
    m.setAttribute("aria-hidden", "true");
  });
  document.body.classList.remove("modal-open");
};

document.querySelectorAll("[data-close-modal]").forEach(btn => btn.addEventListener("click", closeModals));
document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.addEventListener("click", e => {
  if (e.target === backdrop) closeModals();
}));
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModals(); });

const contactWarning = document.querySelector("#contactWarning");
const useContact = (kind, message = "") => {
  const missingPhone = kind === "phone" && !business.phone;
  const missingWhatsApp = kind === "whatsapp" && !business.whatsapp;
  if (missingPhone || missingWhatsApp) {
    openModal(contactWarning);
    return;
  }
  if (kind === "phone") window.location.href = phoneUrl;
  else window.open(waUrl(message), "_blank", "noopener,noreferrer");
};

document.querySelectorAll("[data-phone]").forEach(btn => btn.addEventListener("click", () => useContact("phone")));
document.querySelectorAll("[data-whatsapp-general]").forEach(btn => btn.addEventListener("click", () => useContact("whatsapp", "Merhaba Özcan Usta, bir metal iş için bilgi ve fiyat almak istiyorum.")));
document.querySelectorAll("[data-whatsapp-photo]").forEach(btn => btn.addEventListener("click", () => useContact("whatsapp", "Merhaba Özcan Usta, yaptırmak istediğim işin fotoğrafını ve yaklaşık ölçülerini göndermek istiyorum.")));

let selectedQuickChoice = "Su sayacı panosu";
document.querySelector("#quickChoices").addEventListener("click", e => {
  const button = e.target.closest("[data-choice]");
  if (!button) return;
  selectedQuickChoice = button.dataset.choice;
  document.querySelectorAll(".quick-choice").forEach(b => b.classList.toggle("active", b === button));
});

const quoteModal = document.querySelector("#quoteModal");
const quoteBody = document.querySelector("#quoteBody");
const quoteProgressBar = document.querySelector("#quoteProgressBar");
const blankQuote = () => ({ step: 0, productType: selectedQuickChoice, usage: "", width: "", height: "", depth: "", quantity: "1", details: "", name: "", phone: "", district: "", contact: "WhatsApp" });
let quote = (() => {
  try { return { ...blankQuote(), ...JSON.parse(localStorage.getItem("panometal54_quote") || "{}") }; }
  catch { return blankQuote(); }
})();
const saveQuote = () => localStorage.setItem("panometal54_quote", JSON.stringify(quote));

function renderQuote() {
  quoteProgressBar.style.width = `${((quote.step + 1) / 4) * 100}%`;
  const stepHeader = `<div class="quote-step-label">ADIM ${quote.step + 1} / 4</div>`;
  if (quote.step === 0) {
    const options = ["Su sayacı panosu", "Metal dolap / pano", "Kapı / korkuluk", "Raf sistemi", "Bahçe metal işi", "Baca muhafazası", "Özel üretim parça"];
    quoteBody.innerHTML = `${stepHeader}<h3>Hangi iş için fiyat istiyorsunuz?</h3><div class="modal-choice-grid">${options.map(v => `<button class="modal-choice ${quote.productType === v ? "selected" : ""}" data-set-product="${v}"><span>${v}</span><i>+</i></button>`).join("")}</div><button class="button button-dark full" data-next-step ${quote.productType ? "" : "disabled"}>Devam et ${icons.arrow}</button>`;
  } else if (quote.step === 1) {
    const usages = ["Ev", "Apartman", "Bahçe", "İş yeri", "Atölye / depo", "Dış mekân", "Diğer"];
    quoteBody.innerHTML = `${stepHeader}<h3>Bu iş nerede kullanılacak?</h3><div class="modal-choice-grid compact">${usages.map(v => `<button class="modal-choice ${quote.usage === v ? "selected" : ""}" data-set-usage="${v}"><span>${v}</span><i>+</i></button>`).join("")}</div><div class="modal-nav"><button class="button button-ghost" data-prev-step>Geri</button><button class="button button-dark" data-next-step ${quote.usage ? "" : "disabled"}>Devam et ${icons.arrow}</button></div>`;
  } else if (quote.step === 2) {
    quoteBody.innerHTML = `${stepHeader}<h3>Yaklaşık ölçü ve detay</h3><p class="form-help">Bilmiyorsanız ölçüleri boş bırakabilirsiniz.</p><div class="form-grid three"><label>Genişlik (cm)<input name="width" inputmode="decimal" value="${quote.width}"></label><label>Yükseklik (cm)<input name="height" inputmode="decimal" value="${quote.height}"></label><label>Derinlik (cm)<input name="depth" inputmode="decimal" value="${quote.depth}"></label></div><div class="form-grid"><label>Adet<input name="quantity" inputmode="numeric" value="${quote.quantity}"></label><label class="wide">Açıklama<textarea name="details" rows="4" placeholder="İşi kısaca anlatın...">${quote.details}</textarea></label></div><div class="upload-hint">${icons.spark}<div><strong>Fotoğrafı son adım sonrası WhatsApp mesajına ekleyebilirsiniz.</strong><span>Telefon ekran görüntüsü de olur.</span></div></div><div class="modal-nav"><button class="button button-ghost" data-prev-step>Geri</button><button class="button button-dark" data-next-step>Devam et ${icons.arrow}</button></div>`;
  } else {
    quoteBody.innerHTML = `${stepHeader}<h3>Size nasıl ulaşalım?</h3><div class="form-grid"><label>Ad soyad<input name="name" value="${quote.name}" autocomplete="name"></label><label>Telefon<input name="phone" value="${quote.phone}" inputmode="tel" autocomplete="tel"></label><label>İlçe<input name="district" value="${quote.district}" autocomplete="address-level2"></label><label>İletişim tercihi<select name="contact"><option ${quote.contact === "WhatsApp" ? "selected" : ""}>WhatsApp</option><option ${quote.contact === "Telefon" ? "selected" : ""}>Telefon</option></select></label></div><div class="quote-summary"><span>Talep özeti</span><strong>${quote.productType}</strong><p>${quote.usage}${quote.width || quote.height ? ` · ${quote.width || "-"} × ${quote.height || "-"} × ${quote.depth || "-"} cm` : ""}</p></div><div class="modal-nav"><button class="button button-ghost" data-prev-step>Geri</button><button class="button button-orange" data-submit-quote>${icons.whatsapp} WhatsApp mesajını hazırla</button></div>`;
  }
}

function captureInputs() {
  quoteBody.querySelectorAll("input, textarea, select").forEach(el => { quote[el.name] = el.value; });
  saveQuote();
}
quoteBody.addEventListener("input", captureInputs);
quoteBody.addEventListener("change", captureInputs);
quoteBody.addEventListener("click", e => {
  const product = e.target.closest("[data-set-product]");
  const usage = e.target.closest("[data-set-usage]");
  if (product) { quote.productType = product.dataset.setProduct; saveQuote(); renderQuote(); return; }
  if (usage) { quote.usage = usage.dataset.setUsage; saveQuote(); renderQuote(); return; }
  if (e.target.closest("[data-next-step]") && !e.target.closest("[data-next-step]").disabled) { captureInputs(); quote.step = Math.min(3, quote.step + 1); saveQuote(); renderQuote(); return; }
  if (e.target.closest("[data-prev-step]")) { captureInputs(); quote.step = Math.max(0, quote.step - 1); saveQuote(); renderQuote(); return; }
  if (e.target.closest("[data-submit-quote]")) {
    captureInputs();
    const message = `Merhaba Özcan Usta, fiyat almak istiyorum.\n\nİş türü: ${quote.productType}\nKullanım alanı: ${quote.usage || "-"}\nYaklaşık ölçü: ${quote.width || "-"} × ${quote.height || "-"} × ${quote.depth || "-"} cm\nAdet: ${quote.quantity || "1"}\nDetay: ${quote.details || "-"}\nAd soyad: ${quote.name || "-"}\nTelefon: ${quote.phone || "-"}\nİlçe: ${quote.district || "-"}\nİletişim tercihi: ${quote.contact || "WhatsApp"}\n\nFotoğrafı bu mesajın ardından göndereceğim.`;
    closeModals();
    useContact("whatsapp", message);
  }
});

function openQuote(productType = "") {
  if (productType) quote.productType = productType;
  quote.step = 0;
  saveQuote();
  renderQuote();
  openModal(quoteModal);
}
document.querySelectorAll("[data-open-quote]").forEach(btn => btn.addEventListener("click", () => openQuote()));
document.querySelector("#quickQuoteButton").addEventListener("click", () => openQuote(selectedQuickChoice));
document.addEventListener("click", e => {
  const quick = e.target.closest("[data-quick-product]");
  if (quick) openQuote(quick.dataset.quickProduct);
});

document.querySelectorAll(".hero-photo img, .inspiration-card img, .master-visual > img, .solution-card img").forEach((img) => {
  img.addEventListener("error", () => {
    img.hidden = true;
    img.parentElement?.classList.add("image-fallback");
  }, { once: true });
});

const faqList = document.querySelector("#faqList");
faqList.addEventListener("click", e => {
  const button = e.target.closest(".faq-question");
  if (!button) return;
  const item = button.closest(".faq-item");
  const wasOpen = item.classList.contains("open");
  faqList.querySelectorAll(".faq-item").forEach(el => {
    el.classList.remove("open");
    el.querySelector(".faq-question").setAttribute("aria-expanded", "false");
  });
  if (!wasOpen) {
    item.classList.add("open");
    button.setAttribute("aria-expanded", "true");
  }
});

const menuToggle = document.querySelector("#menuToggle");
const mobileMenu = document.querySelector("#mobileMenu");
menuToggle.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  menuToggle.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
});
mobileMenu.addEventListener("click", e => {
  if (e.target.closest("a, button")) {
    mobileMenu.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

const header = document.querySelector("#siteHeader");
window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 40), { passive: true });

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let lenis;
if (!reducedMotion && window.innerWidth > 800) {
  lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9 });
  const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener("click", e => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -70, duration: 1.2 }); }
  }));
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -30px" });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

const canvas = document.querySelector("#world-canvas");
const experience = create3DExperience(canvas, {
  onReady() {
    clearInterval(loadTimer);
    loaderBar.style.width = "100%";
    setTimeout(() => loader.classList.add("hidden"), 250);
  }
});
if (experience.failed) {
  clearInterval(loadTimer);
  loaderBar.style.width = "100%";
  setTimeout(() => loader.classList.add("hidden"), 250);
}

const journey = document.querySelector(".journey");
const panels = [...document.querySelectorAll(".process-panel")];
const dots = [...document.querySelectorAll(".journey-progress span")];
function updateJourney() {
  const rect = journey.getBoundingClientRect();
  const range = Math.max(1, journey.offsetHeight - window.innerHeight);
  const progress = Math.max(0, Math.min(1, -rect.top / range));
  experience.setProgress(progress);
  const stage = progress < 0.22 ? 0 : progress < 0.47 ? 1 : progress < 0.73 ? 2 : 3;
  panels.forEach((panel, i) => panel.classList.toggle("active", i === stage));
  dots.forEach((dot, i) => dot.classList.toggle("active", i === stage));
}
window.addEventListener("scroll", updateJourney, { passive: true });
window.addEventListener("resize", updateJourney, { passive: true });
updateJourney();

if (window.matchMedia("(pointer:fine)").matches && !reducedMotion) {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  let mx = -100, my = -100, rx = -100, ry = -100;
  window.addEventListener("pointermove", e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;
  }, { passive: true });
  const animateCursor = () => {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
    requestAnimationFrame(animateCursor);
  };
  requestAnimationFrame(animateCursor);
}
