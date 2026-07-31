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
    <span class="concept-label">GERÃ‡EK PROJE</span>
    <button class="image-quote" data-quick-product="${project.title}"><span>Bu iÅŸe benzer fiyat sor</span>${icons.arrow}</button>
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
<a class="skip-link" href="#main">Ä°Ã§eriÄŸe geÃ§</a>
<div class="loader" id="loader" aria-label="Site yÃ¼kleniyor">
  <div class="loader-logo">${brandMark}</div>
  <div class="loader-name">PANOMETAL54</div>
  <div class="loader-line"><span id="loaderBar"></span></div>
</div>
<header class="site-header" id="siteHeader">
  <a class="brand" href="#top" aria-label="PanoMetal54 ana sayfa">
    <span class="brand-mark">${brandMark}</span>
    <span class="brand-copy"><strong>PANOMETAL54</strong><small>METAL PANO & KAYNAK Ä°ÅžLERÄ° Â· SAKARYA</small></span>
  </a>
  <nav class="desktop-nav" aria-label="Ana menÃ¼">
    <a href="#projeler">Projeler</a>
    <a href="#hizmetler">Hizmetler</a>
    <a href="#surec">NasÄ±l Ã‡alÄ±ÅŸÄ±r?</a>
    <a href="#hakkimizda">HakkÄ±mÄ±zda</a>
  </nav>
  <div class="header-actions">
    <button class="button button-ghost hide-small" data-open-quote>Fiyat Sor</button>
    <button class="button button-dark" data-whatsapp-general>${icons.whatsapp}<span>WhatsApp</span></button>
    <button class="menu-toggle" id="menuToggle" aria-label="MenÃ¼yÃ¼ aÃ§" aria-expanded="false"><i></i><i></i></button>
  </div>
  <div class="mobile-menu" id="mobileMenu">
    <a href="#projeler">Projeler</a><a href="#hizmetler">Hizmetler</a><a href="#surec">NasÄ±l Ã‡alÄ±ÅŸÄ±r?</a><a href="#hakkimizda">HakkÄ±mÄ±zda</a><a href="#sss">SÄ±k Sorulanlar</a>
    <button class="button button-orange" data-open-quote>Ãœcretsiz fiyat gÃ¶rÃ¼ÅŸmesi</button>
  </div>
</header>
<main id="main">
  <section class="hero" id="top">
    <div class="hero-photo" aria-hidden="true">
      <img src="./images/projects/hero-gazebo.jpg" alt="" fetchpriority="high">
      <div class="hero-photo-overlay"></div>
      <div class="hero-photo-caption"><span></span>GERÃ‡EK Ä°Åž FOTOÄžRAFI</div>
    </div>
    <div class="hero-content container">
      <div class="hero-copy-block">
        <div class="hero-badge"><span></span>Sakaryaâ€™da gerÃ§ek Ã¼retim iÅŸleri</div>
        <h1>PanoMetal54 ile<br><em>gerÃ§ek metal Ã§Ã¶zÃ¼mler.</em></h1>
        <p class="hero-lead">Bu sitede yalnÄ±zca gerÃ§ek iÅŸ fotoÄŸraflarÄ±mÄ±zdan gelen hizmetler yer alÄ±r: su sayacÄ± panosu, metal dolap, raf sistemi, kapÄ± ve korkuluk, bahÃ§e metal iÅŸleri, baca muhafazasÄ± ve Ã¶zel Ã¼retim kaynak iÅŸleri.</p>
        <div class="hero-actions">
          <button class="button button-orange button-large" data-open-quote>FotoÄŸraf gÃ¶nder, fiyat sor ${icons.arrow}</button>
          <button class="button button-light button-large" data-phone>${icons.phone} Hemen ara</button>
        </div>
        <p class="hero-note">Ä°nsanlar bize en hÄ±zlÄ± ÅŸekilde WhatsApp Ã¼zerinden ulaÅŸsÄ±n diye butonlar aktif bÄ±rakÄ±ldÄ±.</p>
        <div class="social-inline"><a href="${business.instagram}" target="_blank" rel="noopener noreferrer">${icons.instagram}<span>Instagram / panometal54</span></a><a href="${business.facebook}" target="_blank" rel="noopener noreferrer">${icons.facebook}<span>Facebook / panometal54</span></a></div>
      </div>
      <aside class="hero-quote-card">
        <div class="quote-card-top"><span>HIZLI TEKLÄ°F</span><strong>60 saniye</strong></div>
        <h2>Hangi iÅŸ iÃ§in fiyat istiyorsunuz?</h2>
        <div class="quick-choices" id="quickChoices">
          ${["Su sayacÄ± panosu", "Metal dolap / pano", "KapÄ± / korkuluk", "Raf sistemi", "BahÃ§e metal iÅŸi", "Ã–zel Ã¼retim parÃ§a"].map((v, i) => `<button class="quick-choice ${i === 0 ? "active" : ""}" data-choice="${v}">${v}<span>+</span></button>`).join("")}
        </div>
        <button class="button button-dark full" id="quickQuoteButton">Devam et ${icons.arrow}</button>
        <div class="quote-assurance"><span>${icons.measure}</span><p>YaklaÅŸÄ±k Ã¶lÃ§Ã¼ veya telefon fotoÄŸrafÄ± ilk deÄŸerlendirme iÃ§in yeterlidir.</p></div>
      </aside>
    </div>
    <div class="hero-trustbar">
      <div class="container trustbar-inner">
        <div><strong>${business.experienceYears} yÄ±l</strong><span>Kaynak ve metal tecrÃ¼besi</span></div>
        <div><strong>GerÃ§ek iÅŸler</strong><span>Sadece gÃ¶nderdiÄŸiniz fotoÄŸraflardaki hizmetler</span></div>
        <div><strong>WhatsApp Ã¶ncelikli</strong><span>HÄ±zlÄ± dÃ¶nÃ¼ÅŸ iÃ§in</span></div>
        <div><strong>${business.city}</strong><span>${business.serviceArea}</span></div>
      </div>
    </div>
  </section>

  <section class="section intro-strip">
    <div class="container intro-strip-grid">
      <div class="section-label reveal">PANOMETAL54</div>
      <div class="intro-strip-copy reveal"><h2>HazÄ±r katalog deÄŸil.<br>GerÃ§ek iÅŸ fotoÄŸrafÄ± var,<br><span>aynÄ± Ã§izgide Ã¼retim var.</span></h2></div>
      <div class="intro-strip-text reveal"><p>Bu sitedeki tÃ¼m hizmet alanlarÄ± doÄŸrudan paylaÅŸtÄ±ÄŸÄ±nÄ±z fotoÄŸraflara gÃ¶re dÃ¼zenlendi. Yani burada gÃ¶rmediÄŸiniz ayrÄ± bir servis eklenmedi. Ä°nsanlar gÃ¶rdÃ¼ÄŸÃ¼ iÅŸ Ã¼zerinden karar verebilir.</p><button class="text-link" data-open-quote>Projenizi WhatsApp'tan gÃ¶nderin ${icons.arrow}</button></div>
    </div>
  </section>

  <section class="section inspiration-section" id="projeler">
    <div class="container">
      <div class="section-heading reveal">
        <div><span class="section-label">GERÃ‡EK Ä°ÅžLERÄ°MÄ°Z</span><h2>FotoÄŸraflardan seÃ§ilen<br>en iyi gÃ¶rÃ¼nen iÅŸler.</h2></div>
        <p>Bu bÃ¶lÃ¼mde yalnÄ±zca sizden gelen iÅŸ fotoÄŸraflarÄ± kullanÄ±ldÄ±. ZiyaretÃ§iler burada gerÃ§ek Ã¼retim Ã¶rneklerini gÃ¶rÃ¼r.</p>
      </div>
      <div class="inspiration-grid">${featuredProjects.map(projectCard).join("")}</div>
      <div class="inspiration-cta reveal"><div><span>${icons.spark}</span><p>BeÄŸendiÄŸiniz iÅŸin benzerini istiyorsanÄ±z fotoÄŸrafÄ±nÄ±zÄ± gÃ¶nderin.</p></div><button class="button button-dark" data-whatsapp-photo>WhatsAppâ€™tan fotoÄŸraf gÃ¶nder ${icons.arrow}</button></div>
    </div>
  </section>

  <section class="section solutions-section" id="hizmetler">
    <div class="container">
      <div class="section-heading light reveal">
        <div><span class="section-label">SUNDUÄžUMUZ HÄ°ZMETLER</span><h2>FotoÄŸraflarda gÃ¶rÃ¼nen<br>iÅŸ gruplarÄ±.</h2></div>
        <p>Su sayacÄ± panolarÄ±, metal dolaplar, raf sistemleri, kapÄ± ve korkuluk, bahÃ§e iÅŸleri, baca muhafazasÄ± ve Ã¶zel stand Ã§Ã¶zÃ¼mleri.</p>
      </div>
      <div class="solutions-grid">${serviceCards.map(solutionCard).join("")}</div>
    </div>
  </section>

  <section class="journey" id="surec" aria-label="PanoMetal54 Ã¼retim sÃ¼reci">
    <div class="journey-sticky">
      <canvas id="world-canvas" aria-label="Fikirden montaja uzanan Ã¼Ã§ boyutlu Ã¼retim sÃ¼reci"></canvas>
      <div class="journey-shade"></div>
      <div class="journey-title"><span class="section-label">FÄ°KÄ°RDEN MONTAJA</span><h2>DÃ¶rt adÄ±mda<br>net ve saÄŸlam sÃ¼reÃ§.</h2></div>
      <div class="process-panels">
        <article class="process-panel" data-process="0"><span class="process-index">01</span><div><h3>FotoÄŸraf veya ihtiyacÄ± alÄ±yoruz.</h3><p>MÃ¼ÅŸteri iÅŸi anlatÄ±r, varsa mevcut alanÄ± veya istediÄŸi Ã¼rÃ¼nÃ¼ fotoÄŸrafla gÃ¶nderir.</p></div></article>
        <article class="process-panel" data-process="1"><span class="process-index">02</span><div><h3>Ã–lÃ§Ã¼ ve plan belirlenir.</h3><p>ÃœrÃ¼nÃ¼n Ã¶lÃ§Ã¼sÃ¼, kullanÄ±m amacÄ± ve hangi malzemeyle Ã¼retileceÄŸi netleÅŸtirilir.</p></div></article>
        <article class="process-panel" data-process="2"><span class="process-index">03</span><div><h3>Ãœretim ve kaynak yapÄ±lÄ±r.</h3><p>Kesim, hazÄ±rlÄ±k, kaynak ve montaja hazÄ±r hale getirme aÅŸamalarÄ± tamamlanÄ±r.</p></div></article>
        <article class="process-panel" data-process="3"><span class="process-index">04</span><div><h3>Teslim ve kurulum.</h3><p>Ä°ÅŸ tamamlandÄ±ktan sonra teslim edilir, gerekiyorsa yerine montajÄ± yapÄ±lÄ±r.</p></div></article>
      </div>
      <div class="journey-progress">${[0, 1, 2, 3].map((_, i) => `<span data-dot="${i}"></span>`).join("")}</div>
    </div>
  </section>

  <section class="section master-section" id="hakkimizda">
    <div class="container master-grid">
      <div class="master-visual reveal">
        <img src="./images/projects/gate-decorative.jpg" alt="PanoMetal54 dekoratif metal kapÄ± iÅŸi" loading="lazy">
        <div class="master-visual-card"><span>${business.experienceYears}</span><p>yÄ±llÄ±k kaynak ve metal iÅŸleme tecrÃ¼besi</p></div>
      </div>
      <div class="master-copy reveal">
        <span class="section-label">NEDEN PANOMETAL54?</span>
        <h2>GÃ¶sterdiÄŸimiz iÅŸ,<br>yapabildiÄŸimiz iÅŸtir.</h2>
        <p class="large-copy">PanoMetal54 iÃ§in site, paylaÅŸÄ±lan gerÃ§ek iÅŸ fotoÄŸraflarÄ± Ã¼zerinden yeniden dÃ¼zenlendi. BÃ¶ylece ziyaretÃ§i doÄŸrudan hangi iÅŸleri yaptÄ±ÄŸÄ±nÄ±zÄ± gÃ¶rÃ¼r ve size WhatsApp Ã¼zerinden hÄ±zlÄ±ca ulaÅŸÄ±r.</p>
        <div class="master-points">
          <div><strong>01</strong><span>FotoÄŸraflarda olan iÅŸ kollarÄ± Ã¶n plana Ã§Ä±karÄ±ldÄ±.</span></div>
          <div><strong>02</strong><span>WhatsApp iletiÅŸimi ana kanal olarak bÄ±rakÄ±ldÄ±.</span></div>
          <div><strong>03</strong><span>Instagram ve Facebook hesabÄ± marka gÃ¼veni iÃ§in gÃ¶sterildi.</span></div>
          <div><strong>04</strong><span>Su panosu, dolap, raf, kapÄ± ve Ã¶zel parÃ§alar aÃ§Ä±kÃ§a ayrÄ±ldÄ±.</span></div>
        </div>
        <div class="master-actions"><button class="button button-orange" data-open-quote>WhatsApp ile gÃ¶rÃ¼ÅŸÃ¼n ${icons.arrow}</button><button class="button button-outline-dark" data-phone>${icons.phone} Telefon</button></div>
      </div>
    </div>
  </section>

  <section class="section conversion-section">
    <div class="container conversion-grid">
      <div class="conversion-copy reveal"><span class="section-label">FÄ°YAT ALMAK KOLAY</span><h2>FotoÄŸrafÄ± yolla,<br>Ã¶lÃ§Ã¼yÃ¼ yaz,<br>WhatsApp'tan konuÅŸalÄ±m.</h2></div>
      <div class="conversion-steps">
        <article class="reveal"><span>1</span><div><h3>Ä°ÅŸi seÃ§</h3><p>Sitedeki gerÃ§ek iÅŸlerden size en yakÄ±n olanÄ± seÃ§in.</p></div></article>
        <article class="reveal"><span>2</span><div><h3>FotoÄŸraf ve Ã¶lÃ§Ã¼ gÃ¶nder</h3><p>Yeni iÅŸinizin fotoÄŸrafÄ±nÄ± veya alan gÃ¶rÃ¼ntÃ¼sÃ¼nÃ¼ paylaÅŸÄ±n.</p></div></article>
        <article class="reveal"><span>3</span><div><h3>FiyatÄ± Ã¶ÄŸren</h3><p>Malzeme, Ã¶lÃ§Ã¼ ve teslimat detayÄ±na gÃ¶re hÄ±zlÄ± deÄŸerlendirme alÄ±n.</p></div></article>
      </div>
      <div class="conversion-action reveal"><button class="button button-white button-large" data-open-quote>Åžimdi fiyat isteyin ${icons.arrow}</button><p>Ã–ncelikli iletiÅŸim kanalÄ± WhatsApp'tÄ±r.</p></div>
    </div>
  </section>

  <section class="section faq-section" id="sss">
    <div class="container faq-grid">
      <div class="faq-title reveal"><span class="section-label">SIK SORULANLAR</span><h2>Ä°letiÅŸime geÃ§meden<br>Ã¶nce merak edilenler.</h2><button class="text-link" data-open-quote>Fiyat istemek iÃ§in baÅŸla ${icons.arrow}</button></div>
      <div class="faq-list reveal" id="faqList">
        ${[
          ["Sitede olmayan bir iÅŸi de sorabilir miyim?", "Bu versiyonda yalnÄ±zca gÃ¶nderdiÄŸiniz fotoÄŸraflardan Ã§Ä±kan iÅŸ gruplarÄ± Ã¶ne Ã§Ä±karÄ±ldÄ±. Yine de benzer metal iÅŸleri WhatsApp Ã¼zerinden sorabilirsiniz."],
          ["FiyatÄ± nasÄ±l Ã¶ÄŸrenebilirim?", "YaklaÅŸÄ±k Ã¶lÃ§Ã¼, adet ve iÅŸin fotoÄŸrafÄ± gÃ¶nderildiÄŸinde ilk deÄŸerlendirme yapÄ±labilir. Nihai fiyat malzeme ve detaylara gÃ¶re netleÅŸir."],
          ["WhatsApp ile mi ulaÅŸmak gerekiyor?", "Evet, sitede WhatsApp Ã¶ncelikli iletiÅŸim kanalÄ± olarak bÄ±rakÄ±ldÄ±. Telefon ve sosyal medya baÄŸlantÄ±larÄ± da ayrÄ±ca gÃ¶sterilebilir."],
          ["Instagram ve Facebook hesabÄ± var mÄ±?", "Evet, marka adÄ± panometal54 olarak sosyal medya hesaplarÄ± gÃ¶sterildi. Ancak fiyat ve iÅŸ takibi iÃ§in en hÄ±zlÄ± yol WhatsApp'tÄ±r."],
          ["Su sayacÄ± panosu ve metal dolap Ã¶zel Ã¶lÃ§Ã¼ olur mu?", "Evet. GÃ¶rseldeki Ã¶rnekler gibi pano, dolap ve koruma Ã§Ã¶zÃ¼mleri Ã¶lÃ§Ã¼ye gÃ¶re deÄŸerlendirilebilir."],
          ["Sakarya dÄ±ÅŸÄ±nda iÅŸ alÄ±yor musunuz?", "Ä°ÅŸin bÃ¼yÃ¼klÃ¼ÄŸÃ¼ne ve teslimat durumuna gÃ¶re Ã§evre bÃ¶lgeler ayrÄ±ca konuÅŸulabilir."]
        ].map((item, i) => `<article class="faq-item ${i === 0 ? "open" : ""}"><button class="faq-question" aria-expanded="${i === 0}"><span>${item[0]}</span><i>+</i></button><div class="faq-answer"><p>${item[1]}</p></div></article>`).join("")}
      </div>
    </div>
  </section>

  <section class="final-cta">
    <div class="final-spark" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
    <div class="container final-cta-inner">
      <span class="section-label">PANOMETAL54 Ä°LE Ä°LETÄ°ÅžÄ°M</span>
      <h2>Ä°htiyacÄ±nÄ±zdaki metal iÅŸi<br><em>WhatsApp'tan konuÅŸalÄ±m.</em></h2>
      <p>FotoÄŸrafÄ±, Ã§izimi veya yaklaÅŸÄ±k Ã¶lÃ§Ã¼yÃ¼ gÃ¶nderin. UygunluÄŸu ve fiyatÄ± doÄŸrudan PanoMetal54 ile konuÅŸun.</p>
      <div class="final-actions"><button class="button button-orange button-large" data-whatsapp-photo>${icons.whatsapp} WhatsAppâ€™tan fotoÄŸraf gÃ¶nder</button><button class="button button-light button-large" data-phone>${icons.phone} Hemen ara</button></div>
      <div class="final-info"><span>${business.city}, ${business.country}</span><span>${business.experienceYears} yÄ±llÄ±k tecrÃ¼be</span><span>GerÃ§ek iÅŸ fotoÄŸraflarÄ±yla sunum</span></div>
      <div class="social-inline center"><a href="${business.instagram}" target="_blank" rel="noopener noreferrer">${icons.instagram}<span>Instagram</span></a><a href="${business.facebook}" target="_blank" rel="noopener noreferrer">${icons.facebook}<span>Facebook</span></a></div>
    </div>
  </section>
</main>
<footer class="site-footer">
  <div class="container footer-top"><a class="brand footer-brand" href="#top"><span class="brand-mark">${brandMark}</span><span class="brand-copy"><strong>PANOMETAL54</strong><small>METAL PANO & KAYNAK Ä°ÅžLERÄ°</small></span></a><p>GerÃ§ek iÅŸ fotoÄŸraflarÄ±yla gÃ¼ven veren, WhatsApp odaklÄ± metal Ã¼retim sitesi.</p></div>
  <div class="container footer-grid"><div><span>HÄ°ZMET</span><a href="#projeler">Su sayacÄ± panolarÄ±</a><a href="#hizmetler">Metal dolaplar</a><a href="#hizmetler">KapÄ± ve korkuluk</a><a href="#hizmetler">Raf ve Ã¶zel Ã¼retim</a></div><div><span>Ä°LETÄ°ÅžÄ°M</span><button data-phone>${business.phoneDisplay}</button><button data-whatsapp-general>WhatsApp</button><a href="${business.instagram}" target="_blank" rel="noopener noreferrer">Instagram / panometal54</a><a href="${business.facebook}" target="_blank" rel="noopener noreferrer">Facebook / panometal54</a></div><div><span>MENÃœ</span><a href="#surec">NasÄ±l Ã§alÄ±ÅŸÄ±r?</a><a href="#hakkimizda">HakkÄ±mÄ±zda</a><a href="#sss">SÄ±k sorulanlar</a><button data-open-quote>Fiyat sor</button></div></div>
  <div class="container footer-bottom"><span>Â© ${new Date().getFullYear()} PanoMetal54</span><span>panometal54</span></div>
</footer>
<div class="mobile-contact-bar"><button data-phone>${icons.phone}<span>Ara</span></button><button data-open-quote>${icons.spark}<span>Fiyat Sor</span></button><button data-whatsapp-general>${icons.whatsapp}<span>WhatsApp</span></button></div>

<div class="modal-backdrop" id="quoteModal" aria-hidden="true">
  <div class="quote-modal" role="dialog" aria-modal="true" aria-labelledby="quoteTitle">
    <button class="modal-close" data-close-modal aria-label="Kapat">${icons.close}</button>
    <div class="quote-modal-head"><span>ÃœCRETSÄ°Z Ã–N DEÄžERLENDÄ°RME</span><h2 id="quoteTitle">Projenizi kÄ±saca anlatÄ±n.</h2><p>Formun sonunda bilgileriniz WhatsApp mesajÄ±na dÃ¶nÃ¼ÅŸtÃ¼rÃ¼lÃ¼r. FotoÄŸrafÄ± WhatsApp iÃ§inde ekleyebilirsiniz.</p></div>
    <div class="quote-progress"><span id="quoteProgressBar"></span></div>
    <div class="quote-body" id="quoteBody"></div>
  </div>
</div>
<div class="modal-backdrop" id="contactWarning" aria-hidden="true">
  <div class="small-modal" role="dialog" aria-modal="true"><button class="modal-close" data-close-modal aria-label="Kapat">${icons.close}</button><span class="section-label">Ä°LETÄ°ÅžÄ°M BÄ°LGÄ°SÄ° GEREKÄ°YOR</span><h2>Telefon ve WhatsApp numarasÄ±nÄ± ekleyin.</h2><p>Website yayÄ±na alÄ±nmadan Ã¶nce <code>src/config.js</code> dosyasÄ±ndaki <strong>phone</strong> ve <strong>whatsapp</strong> alanlarÄ±nÄ± doldurun. Åžu anda numara uydurulmadÄ±ÄŸÄ± iÃ§in iletiÅŸim butonu devre dÄ±ÅŸÄ±dÄ±r.</p><button class="button button-dark full" data-close-modal>Tamam</button></div>
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
document.querySelectorAll("[data-whatsapp-general]").forEach(btn => btn.addEventListener("click", () => useContact("whatsapp", "Merhaba Ã–zcan Usta, bir metal iÅŸ iÃ§in bilgi ve fiyat almak istiyorum.")));
document.querySelectorAll("[data-whatsapp-photo]").forEach(btn => btn.addEventListener("click", () => useContact("whatsapp", "Merhaba Ã–zcan Usta, yaptÄ±rmak istediÄŸim iÅŸin fotoÄŸrafÄ±nÄ± ve yaklaÅŸÄ±k Ã¶lÃ§Ã¼lerini gÃ¶ndermek istiyorum.")));

let selectedQuickChoice = "Su sayacÄ± panosu";
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
    const options = ["Su sayacÄ± panosu", "Metal dolap / pano", "KapÄ± / korkuluk", "Raf sistemi", "BahÃ§e metal iÅŸi", "Baca muhafazasÄ±", "Ã–zel Ã¼retim parÃ§a"];
    quoteBody.innerHTML = `${stepHeader}<h3>Hangi iÅŸ iÃ§in fiyat istiyorsunuz?</h3><div class="modal-choice-grid">${options.map(v => `<button class="modal-choice ${quote.productType === v ? "selected" : ""}" data-set-product="${v}"><span>${v}</span><i>+</i></button>`).join("")}</div><button class="button button-dark full" data-next-step ${quote.productType ? "" : "disabled"}>Devam et ${icons.arrow}</button>`;
  } else if (quote.step === 1) {
    const usages = ["Ev", "Apartman", "BahÃ§e", "Ä°ÅŸ yeri", "AtÃ¶lye / depo", "DÄ±ÅŸ mekÃ¢n", "DiÄŸer"];
    quoteBody.innerHTML = `${stepHeader}<h3>Bu iÅŸ nerede kullanÄ±lacak?</h3><div class="modal-choice-grid compact">${usages.map(v => `<button class="modal-choice ${quote.usage === v ? "selected" : ""}" data-set-usage="${v}"><span>${v}</span><i>+</i></button>`).join("")}</div><div class="modal-nav"><button class="button button-ghost" data-prev-step>Geri</button><button class="button button-dark" data-next-step ${quote.usage ? "" : "disabled"}>Devam et ${icons.arrow}</button></div>`;
  } else if (quote.step === 2) {
    quoteBody.innerHTML = `${stepHeader}<h3>YaklaÅŸÄ±k Ã¶lÃ§Ã¼ ve detay</h3><p class="form-help">BilmiyorsanÄ±z Ã¶lÃ§Ã¼leri boÅŸ bÄ±rakabilirsiniz.</p><div class="form-grid three"><label>GeniÅŸlik (cm)<input name="width" inputmode="decimal" value="${quote.width}"></label><label>YÃ¼kseklik (cm)<input name="height" inputmode="decimal" value="${quote.height}"></label><label>Derinlik (cm)<input name="depth" inputmode="decimal" value="${quote.depth}"></label></div><div class="form-grid"><label>Adet<input name="quantity" inputmode="numeric" value="${quote.quantity}"></label><label class="wide">AÃ§Ä±klama<textarea name="details" rows="4" placeholder="Ä°ÅŸi kÄ±saca anlatÄ±n...">${quote.details}</textarea></label></div><div class="upload-hint">${icons.spark}<div><strong>FotoÄŸrafÄ± son adÄ±m sonrasÄ± WhatsApp mesajÄ±na ekleyebilirsiniz.</strong><span>Telefon ekran gÃ¶rÃ¼ntÃ¼sÃ¼ de olur.</span></div></div><div class="modal-nav"><button class="button button-ghost" data-prev-step>Geri</button><button class="button button-dark" data-next-step>Devam et ${icons.arrow}</button></div>`;
  } else {
    quoteBody.innerHTML = `${stepHeader}<h3>Size nasÄ±l ulaÅŸalÄ±m?</h3><div class="form-grid"><label>Ad soyad<input name="name" value="${quote.name}" autocomplete="name"></label><label>Telefon<input name="phone" value="${quote.phone}" inputmode="tel" autocomplete="tel"></label><label>Ä°lÃ§e<input name="district" value="${quote.district}" autocomplete="address-level2"></label><label>Ä°letiÅŸim tercihi<select name="contact"><option ${quote.contact === "WhatsApp" ? "selected" : ""}>WhatsApp</option><option ${quote.contact === "Telefon" ? "selected" : ""}>Telefon</option></select></label></div><div class="quote-summary"><span>Talep Ã¶zeti</span><strong>${quote.productType}</strong><p>${quote.usage}${quote.width || quote.height ? ` Â· ${quote.width || "-"} Ã— ${quote.height || "-"} Ã— ${quote.depth || "-"} cm` : ""}</p></div><div class="modal-nav"><button class="button button-ghost" data-prev-step>Geri</button><button class="button button-orange" data-submit-quote>${icons.whatsapp} WhatsApp mesajÄ±nÄ± hazÄ±rla</button></div>`;
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
    const message = `Merhaba Ã–zcan Usta, fiyat almak istiyorum.\n\nÄ°ÅŸ tÃ¼rÃ¼: ${quote.productType}\nKullanÄ±m alanÄ±: ${quote.usage || "-"}\nYaklaÅŸÄ±k Ã¶lÃ§Ã¼: ${quote.width || "-"} Ã— ${quote.height || "-"} Ã— ${quote.depth || "-"} cm\nAdet: ${quote.quantity || "1"}\nDetay: ${quote.details || "-"}\nAd soyad: ${quote.name || "-"}\nTelefon: ${quote.phone || "-"}\nÄ°lÃ§e: ${quote.district || "-"}\nÄ°letiÅŸim tercihi: ${quote.contact || "WhatsApp"}\n\nFotoÄŸrafÄ± bu mesajÄ±n ardÄ±ndan gÃ¶ndereceÄŸim.`;
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
