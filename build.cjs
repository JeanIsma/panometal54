const fs = require('node:fs');
const path = require('node:path');
const business = require('./src/config.js');
const root = __dirname;
const siteUrl = new URL(business.siteUrl);
if (siteUrl.protocol !== 'https:') throw new Error('SITE_URL must use HTTPS.');
if (!siteUrl.pathname.endsWith('/')) siteUrl.pathname += '/';
const pages = [
  {slug:'', file:'home.html', title:'Sakarya Su Sayacı Kapağı ve Doğalgaz Panosu | PanoMetal54',
    description:'Sakarya’da su sayacı kapağı, su saati panosu ve doğalgaz panosu imalatı ve montajı. Ölçünüzü paylaşın, PanoMetal54 ile WhatsApp üzerinden fiyat görüşün.'},
  {slug:'su-sayaci-kapagi/', file:'water.html', title:'Sakarya Su Sayacı Kapağı ve Su Saati Panosu | PanoMetal54',
    description:'Sakarya’da ölçüye göre su sayacı kapağı ve su saati panosu. Uygulama fotoğraflarını inceleyin; ölçü ve fotoğrafla PanoMetal54’ten fiyat isteyin.',
    label:'Su Sayacı Kapağı', service:'Su sayacı kapağı ve panosu imalatı ve montajı'},
  {slug:'dogalgaz-panosu/', file:'gas.html', title:'Sakarya Doğalgaz Panosu ve Sayaç Dolabı | PanoMetal54',
    description:'Sakarya’da sayaç ve tesisat yerleşimine göre doğalgaz panosu imalatı ve montajı. Ölçü ve fotoğrafınızı PanoMetal54 ile paylaşarak fiyat görüşün.',
    label:'Doğalgaz Panosu', service:'Doğalgaz sayaç panosu imalatı ve montajı'}
];
const read = file => fs.readFileSync(path.join(root, 'src', file), 'utf8');
const escapeHtml = value => String(value).replace(/[&<>"']/g, character =>
  ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]));
function interpolate(text, values) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error('Missing template value: ' + key);
    return values[key];
  });
}
function schema(page, canonical) {
  const graph = [{
    '@type':'LocalBusiness', '@id':siteUrl.href+'#business',
    name:business.name, alternateName:business.brand, url:siteUrl.href,
    telephone:business.phone,
    logo:new URL('images/brand/sayac-kapak-logo.png', siteUrl).href,
    image:new URL('images/projects/water-panel-main.jpg', siteUrl).href,
    description:'Sakarya’da su sayacı kapakları ve doğalgaz panoları imalatı ve montajı.',
    address:{'@type':'PostalAddress', addressLocality:business.city, addressCountry:'TR'},
    areaServed:{'@type':'City', name:business.city},
    sameAs:[business.instagram,business.facebook],
    knowsAbout:['Su sayacı kapağı','Su saati panosu','Doğalgaz panosu']
  }, {
    '@type':'WebSite', '@id':siteUrl.href+'#website', name:business.brand+' · '+business.name,
    url:siteUrl.href, inLanguage:'tr-TR'
  }];
  if (page.service) graph.push({
    '@type':'Service', name:page.label, serviceType:page.service, url:canonical,
    provider:{'@id':siteUrl.href+'#business'}, areaServed:{'@type':'City', name:business.city}
  }, {
    '@type':'BreadcrumbList', itemListElement:[
      {'@type':'ListItem', position:1, name:'Ana Sayfa', item:siteUrl.href},
      {'@type':'ListItem', position:2, name:page.label, item:canonical}
    ]
  });
  return JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c');
}
for (const output of ['dist','docs']) {
  const directory = path.join(root,output);
  fs.rmSync(directory,{recursive:true,force:true});
  fs.mkdirSync(directory,{recursive:true});
  fs.cpSync(path.join(root,'public'),directory,{recursive:true});
  for (const file of ['styles.css','main.js']) fs.copyFileSync(path.join(root,'src',file),path.join(directory,file));
  for (const page of pages) {
    const canonical = new URL(page.slug,siteUrl).href;
    const values = {
      base:page.slug?'../':'./', title:escapeHtml(page.title),
      description:escapeHtml(page.description), canonical:escapeHtml(canonical),
      shareImage:escapeHtml(new URL('images/brand/social-preview.jpg',siteUrl).href),
      phone:business.phone, phoneDisplay:business.phoneDisplay, whatsapp:business.whatsapp,
      instagram:business.instagram, facebook:business.facebook,
      waterCurrent:page.slug==='su-sayaci-kapagi/'?'aria-current="page"':'',
      gasCurrent:page.slug==='dogalgaz-panosu/'?'aria-current="page"':'',
      schema:schema(page,canonical),
      defaultProduct:page.slug==='dogalgaz-panosu/'?'Doğalgaz panosu':'Su sayacı kapağı / panosu'
    };
    values.header = interpolate(read('partials/header.html'),values);
    values.footer = interpolate(read('partials/footer.html'),values);
    values.content = interpolate(read('pages/'+page.file),values);
    const target = path.join(directory,page.slug,'index.html');
    fs.mkdirSync(path.dirname(target),{recursive:true});
    fs.writeFileSync(target,interpolate(read('partials/document.html'),values));
  }
  const urls = pages.map(page=>'<url><loc>'+new URL(page.slug,siteUrl).href+'</loc></url>').join('\n');
  fs.writeFileSync(path.join(directory,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls+'\n</urlset>\n');
  fs.writeFileSync(path.join(directory,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+new URL('sitemap.xml',siteUrl).href+'\n');
  fs.writeFileSync(path.join(directory,'.nojekyll'),'');
  fs.writeFileSync(path.join(directory,'README-UPLOAD.txt'),'Static website. GitHub Pages publishes main /docs.\n');
}
console.log('Built 3 crawlable Turkish pages in dist/ and docs/. Canonical URL: '+siteUrl.href);
