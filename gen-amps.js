// github.io feeder: amp-settings pages mirroring the main site's /amp-settings/.
// High-DA host (Bing/Yandex crawl it heavily, sends referrals), indexes faster than
// the new domain; each page DOFOLLOW-links the matching /amp-settings/ + /tone/ pages.
// Targets "<amp> settings" queries. GuitarToneAdapt branded.
const fs = require('fs'), path = require('path');
const CATALOG = 'C:/Users/Gaming/Documents/Work/friday/site/app/catalog.json';
const CAT = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
const SITE = 'https://guitartoneadapt.com', APP = SITE + '/app/';
const BASE = 'https://peraautomations.github.io/awesome-guitar-tones';
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const AMPS = [
  ['Marshall JCM800', 'marshall-jcm800', ['jcm800', 'jcm 800']],
  ['Mesa/Boogie Dual Rectifier', 'mesa-dual-rectifier', ['rectifier', 'recto']],
  ['Fender Twin Reverb', 'fender-twin-reverb', ['twin reverb']],
  ['Mesa/Boogie Mark Series', 'mesa-mark', ['mark iic', 'mark ii', 'mark iv', 'mark v']],
  ['Hiwatt', 'hiwatt', ['hiwatt']],
  ['Vox AC30', 'vox-ac30', ['ac30', 'ac 30']],
  ['Peavey 5150', 'peavey-5150', ['5150']],
  ['Roland JC-120', 'roland-jc-120', ['jc-120', 'jc120', 'jazz chorus']],
  ['Bogner', 'bogner', ['bogner']],
  ['Marshall Plexi', 'marshall-plexi', ['plexi', 'super lead']],
  ['Peavey 6505', 'peavey-6505', ['6505']],
  ['Diezel', 'diezel', ['diezel']],
  ['Marshall DSL', 'marshall-dsl', ['dsl40', 'dsl100', 'marshall dsl']],
  ['Fender Hot Rod Deluxe', 'fender-hot-rod-deluxe', ['hot rod deluxe', 'hot rod deville']],
  ['Marshall Silver Jubilee', 'marshall-silver-jubilee', ['jubilee', '2555']],
  ['Fender Bassman', 'fender-bassman', ['bassman']],
  ['ENGL', 'engl', ['engl']],
  ['Orange Rockerverb', 'orange-rockerverb', ['rockerverb']],
  ['Fender Deluxe Reverb', 'fender-deluxe-reverb', ['deluxe reverb']],
  ['Soldano SLO-100', 'soldano-slo', ['soldano', 'slo-100']],
  ['Fender Champ', 'fender-champ', ['fender champ', 'tweed champ']],
];
const K = ['gain', 'bass', 'mid', 'treble', 'presence'];
const r5 = v => Math.round(v * 2) / 2;
const avg = items => { const s = {}; K.forEach(k => s[k] = 0); let n = 0; items.forEach(t => { if (t.set) { K.forEach(k => s[k] += t.set[k] || 0); n++; } }); const o = {}; K.forEach(k => o[k] = n ? r5(s[k] / n) : 0); return o; };

const STYLE = 'body{background:#0a0910;color:#F4EFFF;font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:860px;margin:0 auto;padding:22px 18px 70px;line-height:1.6}' +
  'a{color:#FF9A3D;text-decoration:none}a:hover{text-decoration:underline}nav{font-size:13px;color:#A8A1C4;margin-bottom:6px}' +
  'h1{font-size:clamp(25px,5vw,34px);margin:10px 0 6px;letter-spacing:-.5px}.intro{color:#A8A1C4;margin-bottom:18px}' +
  '.tag{display:inline-block;background:rgba(255,154,61,.1);color:#FF9A3D;font-size:12px;font-weight:700;padding:4px 11px;border-radius:99px;margin-bottom:6px;border:1px solid rgba(255,154,61,.25)}' +
  '.eqbox{background:linear-gradient(165deg,#221a2e,#120e19);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:16px;margin:12px 0;font-size:15px}' +
  '.eqbox b{color:#FF9A3D}' +
  '.cta{display:block;text-align:center;background:linear-gradient(135deg,#FF9A3D,#FF5E2B);color:#190d02;font-weight:800;font-size:16px;padding:15px;border-radius:14px;margin:18px 0}' +
  '.song{display:block;background:#15111f;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:11px 14px;margin:7px 0}.song:hover{border-color:#FF9A3D;text-decoration:none}' +
  '.song b{font-size:14.5px;color:#F4EFFF}.song .eq{font-size:11.5px;color:#726B92;margin-top:3px;font-variant-numeric:tabular-nums}' +
  '.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:9px}.g a{background:#15111f;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px 14px;color:#F4EFFF;font-weight:700}.g a b{display:block;color:#726B92;font-size:12px;font-weight:500;margin-top:2px}.g a:hover{border-color:#FF9A3D;text-decoration:none}' +
  '.foot{margin-top:30px;color:#726B92;font-size:12.5px;border-top:1px solid rgba(255,255,255,.08);padding-top:16px}.foot a{color:#FF9A3D}';
const head = (title, desc, canon, ld) => '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<title>' + esc(title) + '</title><meta name="description" content="' + esc(desc) + '"><link rel="canonical" href="' + canon + '">' +
  '<meta property="og:title" content="' + esc(title) + '"><meta property="og:description" content="' + esc(desc) + '"><meta property="og:image" content="' + SITE + '/og.png"><meta name="theme-color" content="#0a0910">' +
  (ld ? '<script type="application/ld+json">' + JSON.stringify(ld).replace(/</g, '\\u003c') + '</' + 'script>' : '') + '<style>' + STYLE + '</style></head><body>';

const out = [], urls = [];
fs.mkdirSync('docs/amp', { recursive: true });
for (const [name, slug, terms] of AMPS) {
  const items = CAT.filter(t => t.gear && terms.some(tm => (t.gear || '').toLowerCase().includes(tm)));
  if (items.length < 2) continue;
  items.sort((a, b) => (b.set.gain || 0) - (a.set.gain || 0));
  const a = avg(items);
  const canon = BASE + '/amp/' + slug + '.html';
  const title = name + ' Settings — Starting EQ + ' + items.length + ' Famous Tones';
  const desc = 'Where to start on a ' + name + ': gain ' + a.gain + ', bass ' + a.bass + ', mid ' + a.mid + ', treble ' + a.treble + ', presence ' + a.presence + ' — averaged from ' + items.length + ' famous tones. Adapt to your own rig, free.';
  const ld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', name: title, description: desc, url: canon },
    { '@type': 'ItemList', numberOfItems: items.length, itemListElement: items.slice(0, 50).map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.song + ' — ' + t.artist, url: SITE + '/tone/' + t.slug + '/' })) }] };
  const songs = items.slice(0, 40).map(t => '<a class="song" href="' + SITE + '/tone/' + esc(t.slug) + '/"><b>' + esc(t.song) + ' — ' + esc(t.artist) + '</b><div class="eq">gain ' + t.set.gain + ' · bass ' + t.set.bass + ' · mid ' + t.set.mid + ' · treble ' + t.set.treble + ' · presence ' + t.set.presence + '</div></a>').join('');
  const html = head(title, desc, canon, ld) +
    '<nav><a href="' + BASE + '/">‹ Guitar tones</a> · <a href="' + BASE + '/amps.html">All amps</a> · <a href="' + SITE + '/">GuitarToneAdapt</a></nav>' +
    '<div class="tag">🎚️ Amp settings</div><h1>' + esc(name) + ' settings</h1>' +
    '<p class="intro">Real starting points for a ' + esc(name) + ', averaged from ' + items.length + ' famous recordings made on one.</p>' +
    '<div class="eqbox">All-rounder start: <b>gain ' + a.gain + '</b> · bass ' + a.bass + ' · mid ' + a.mid + ' · treble ' + a.treble + ' · presence ' + a.presence + ' <span style="color:#726B92">(out of 10)</span></div>' +
    '<a class="cta" href="' + SITE + '/amp-settings/' + slug + '/">🎛️ Full ' + esc(name) + ' cheat sheet + adapt to YOUR rig →</a>' +
    '<h3 style="color:#A8A1C4;font-size:15px;text-transform:uppercase;letter-spacing:.5px;margin-top:24px">' + items.length + ' famous tones on a ' + esc(name) + '</h3>' + songs +
    '<div class="foot">Settings are community-researched estimates. Adapt any to the gear you own at <a href="' + APP + '">GuitarToneAdapt</a> · <a href="' + SITE + '/amp-settings/">all amp settings</a>.</div></body></html>';
  fs.writeFileSync('docs/amp/' + slug + '.html', html);
  out.push({ slug, name, n: items.length });
  urls.push(canon);
}
// amps hub
const hub = head('Guitar Amp Settings — Starting EQ for ' + out.length + ' Classic Amps', 'Starting-point settings for Marshall JCM800, Mesa Rectifier, Vox AC30, Peavey 5150 and more — averaged from famous tones, adaptable to your own rig free.', BASE + '/amps.html') +
  '<nav><a href="' + BASE + '/">‹ Guitar tones</a> · <a href="' + SITE + '/">GuitarToneAdapt</a></nav>' +
  '<div class="tag">🎚️ Amp settings</div><h1>Guitar amp settings</h1>' +
  '<p class="intro">Starting-point EQ for classic amps, computed from the famous tones recorded on them. Pick your amp, then adapt any tone to the rig you own — free.</p>' +
  '<div class="g">' + out.map(m => '<a href="' + BASE + '/amp/' + m.slug + '.html">' + esc(m.name) + '<b>' + m.n + ' tones →</b></a>').join('') + '</div>' +
  '<div class="foot"><a href="' + SITE + '/amp-settings/">All amp cheat sheets on GuitarToneAdapt →</a></div></body></html>';
fs.writeFileSync('docs/amps.html', hub);
urls.push(BASE + '/amps.html');

// merge into existing sitemap (keep artist pages)
let existing = [];
try { const sm = fs.readFileSync('docs/sitemap.xml', 'utf8'); existing = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]); } catch (e) {}
const all = [...new Set([...existing, ...urls])];
const today = '2026-06-18';
const smOut = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  all.map(u => '  <url><loc>' + u + '</loc><lastmod>' + today + '</lastmod><changefreq>weekly</changefreq><priority>' + (u === BASE + '/' ? '1.0' : '0.7') + '</priority></url>').join('\n') + '\n</urlset>\n';
fs.writeFileSync('docs/sitemap.xml', smOut);
fs.writeFileSync('/tmp/ghio-amp-urls.json', JSON.stringify(urls));
console.log('generated', out.length, 'amp feeder pages + hub. new urls:', urls.length, '| sitemap total:', all.length);
