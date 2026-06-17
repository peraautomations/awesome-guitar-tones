// Build github.io "feeder" artist pages from the main ToneAdapt catalog.
// github.io is a high-authority host Bing/Yandex already crawl heavily and Google
// indexes fast — so these pages get discovered/ranked far sooner than the new
// guitartoneadapt.com domain, and every page DOFOLLOW-links the matching
// /tone/ + /artist/ pages on the main site (accelerating its discovery + sending
// real referral clicks). Targets high-intent "how to get <artist>'s guitar tone".
const fs = require('fs'), path = require('path');
const CATALOG = 'C:/Users/Gaming/Documents/Work/friday/site/app/catalog.json';
const CAT = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
const SITE = 'https://guitartoneadapt.com', APP = SITE + '/app/';
const BASE = 'https://peraautomations.github.io/awesome-guitar-tones';
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = s => String(s || '').toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const byArtist = {};
CAT.forEach(t => { if (!t.slug || !t.artist) return; const a = slugify(t.artist); if (!a) return; (byArtist[a] = byArtist[a] || { name: t.artist, items: [] }).items.push(t); });
const artists = Object.entries(byArtist).filter(([, v]) => v.items.length >= 3)
  .sort((x, y) => y[1].items.length - x[1].items.length);

const STYLE = 'body{background:#0a0910;color:#F4EFFF;font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:860px;margin:0 auto;padding:22px 18px 70px;line-height:1.6}' +
  'a{color:#FF9A3D;text-decoration:none}a:hover{text-decoration:underline}nav{font-size:13px;color:#A8A1C4;margin-bottom:6px}' +
  'h1{font-size:clamp(25px,5vw,34px);margin:10px 0 6px;letter-spacing:-.5px}.intro{color:#A8A1C4;margin-bottom:18px}' +
  '.tag{display:inline-block;background:rgba(255,154,61,.1);color:#FF9A3D;font-size:12px;font-weight:700;padding:4px 11px;border-radius:99px;margin-bottom:6px;border:1px solid rgba(255,154,61,.25)}' +
  '.cta{display:block;text-align:center;background:linear-gradient(135deg,#FF9A3D,#FF5E2B);color:#190d02;font-weight:800;font-size:16px;padding:15px;border-radius:14px;margin:18px 0}' +
  '.song{display:block;background:#15111f;border:1px solid rgba(255,255,255,.08);border-radius:13px;padding:13px 15px;margin:8px 0}.song:hover{border-color:#FF9A3D;text-decoration:none}' +
  '.song b{font-size:15.5px;color:#F4EFFF}.song .gear{font-size:12.5px;color:#A8A1C4;margin-top:3px}.song .eq{font-size:11.5px;color:#726B92;margin-top:4px;font-variant-numeric:tabular-nums}' +
  '.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:9px}.g a{background:#15111f;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px 14px;color:#F4EFFF;font-weight:700}.g a b{display:block;color:#726B92;font-size:12px;font-weight:500;margin-top:2px}.g a:hover{border-color:#FF9A3D;text-decoration:none}' +
  '.foot{margin-top:30px;color:#726B92;font-size:12.5px;border-top:1px solid rgba(255,255,255,.08);padding-top:16px}.foot a{color:#FF9A3D}';

function head(title, desc, canon, ld) {
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + esc(title) + '</title><meta name="description" content="' + esc(desc) + '">' +
    '<link rel="canonical" href="' + canon + '"><meta property="og:title" content="' + esc(title) + '"><meta property="og:description" content="' + esc(desc) + '">' +
    '<meta property="og:image" content="' + SITE + '/og.png"><meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#0a0910">' +
    (ld ? '<script type="application/ld+json">' + JSON.stringify(ld).replace(/</g, '\\u003c') + '</' + 'script>' : '') +
    '<style>' + STYLE + '</style></head><body>';
}

const out = [], urls = [];
fs.mkdirSync('docs/artist', { recursive: true });
for (const [aslug, v] of artists) {
  const items = v.items.slice().sort((x, y) => (y.set.gain || 0) - (x.set.gain || 0));
  const canon = BASE + '/artist/' + aslug + '.html';
  const title = "How to Get " + v.name + "'s Guitar Tone — Amp Settings for " + items.length + " Songs";
  const desc = 'Real amp settings and gear behind ' + items.length + " of " + v.name + "'s guitar tones — and how to get each on the guitar, amp and pickups you actually own, free.";
  const ld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', name: title, description: desc, url: canon },
    { '@type': 'ItemList', numberOfItems: items.length, itemListElement: items.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.song + ' — ' + v.name, url: SITE + '/tone/' + t.slug + '/' })) },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Guitar tones', item: BASE + '/' },
      { '@type': 'ListItem', position: 2, name: v.name, item: canon } ] } ] };
  const songs = items.map(t => '<a class="song" href="' + SITE + '/tone/' + esc(t.slug) + '/">' +
    '<b>' + esc(t.song) + '</b>' +
    (t.gear ? '<div class="gear">' + esc(String(t.gear).slice(0, 140)) + (String(t.gear).length > 140 ? '…' : '') + '</div>' : '') +
    '<div class="eq">Amp EQ — gain ' + t.set.gain + ' · bass ' + t.set.bass + ' · mid ' + t.set.mid + ' · treble ' + t.set.treble + ' · presence ' + t.set.presence + '</div></a>').join('');
  const html = head(title, desc, canon, ld) +
    '<nav><a href="' + BASE + '/">‹ Guitar tones</a> · <a href="' + BASE + '/artists.html">All artists</a> · <a href="' + SITE + '/">ToneAdapt</a></nav>' +
    '<div class="tag">🎸 Artist tone guide</div>' +
    '<h1>' + esc(v.name) + " guitar tones</h1>" +
    '<p class="intro">The gear and amp settings behind ' + items.length + " famous " + esc(v.name) + ' tones. Don’t own the same rig? <a href="' + SITE + '/artist/' + aslug + '/">ToneAdapt re-dials each one</a> for the exact guitar, amp and pickups you have — free, in your browser.</p>' +
    '<a class="cta" href="' + APP + '">🎛️ Adapt these to YOUR rig — free →</a>' +
    songs +
    '<div class="foot">Settings are community-researched estimates. Full per-song breakdowns + live re-dialing at ' +
    '<a href="' + SITE + '/artist/' + aslug + '/">' + esc(v.name) + ' on ToneAdapt</a> · <a href="' + SITE + '/tones/">all 495 tones</a>.</div></body></html>';
  fs.writeFileSync('docs/artist/' + aslug + '.html', html);
  out.push({ aslug, name: v.name, n: items.length });
  urls.push(canon);
}
// artists hub
const hub = head('Guitar Tone Guides by Artist — Amp Settings for ' + out.length + ' Bands | ToneAdapt',
  'Browse amp settings and gear by artist: Metallica, Pink Floyd, Nirvana, Pantera and more. Each tone adaptable to your own rig free.',
  BASE + '/artists.html') +
  '<nav><a href="' + BASE + '/">‹ Guitar tones</a> · <a href="' + SITE + '/">ToneAdapt</a></nav>' +
  '<div class="tag">🎸 By artist</div><h1>Guitar tones by artist</h1>' +
  '<p class="intro">The gear and amp settings behind famous guitar tones, grouped by the artist who played them. Pick a band, then adapt any tone to the rig you actually own — free.</p>' +
  '<div class="g">' + out.map(a => '<a href="' + BASE + '/artist/' + a.aslug + '.html">' + esc(a.name) + '<b>' + a.n + ' tones →</b></a>').join('') + '</div>' +
  '<div class="foot"><a href="' + SITE + '/tones/">All 495 tones on ToneAdapt →</a></div></body></html>';
fs.writeFileSync('docs/artists.html', hub);
urls.push(BASE + '/artists.html');

// rebuild sitemap (index + artists hub + all artist pages)
const today = '2026-06-17';
const allUrls = [BASE + '/', BASE + '/artists.html', ...out.map(a => BASE + '/artist/' + a.aslug + '.html')];
const sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  allUrls.map(u => '  <url><loc>' + u + '</loc><lastmod>' + today + '</lastmod><changefreq>weekly</changefreq><priority>' + (u === BASE + '/' ? '1.0' : '0.7') + '</priority></url>').join('\n') +
  '\n</urlset>\n';
fs.writeFileSync('docs/sitemap.xml', sm);
fs.writeFileSync('/tmp/ghio-new-urls.json', JSON.stringify(urls));
console.log('generated', out.length, 'artist pages + hub. sitemap urls:', allUrls.length);
console.log(out.slice(0, 12).map(a => a.aslug + '(' + a.n + ')').join(' '), '...');
