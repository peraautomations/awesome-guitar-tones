// github.io feeder: guitar-comparison pages + a free-tools page.
// High-DA host (Bing/Yandex crawl it heavily) — each page DOFOLLOW-links the new
// /guitar-vs/ and /tools/ pages on guitartoneadapt.com, giving Google fresh
// discovery links to that content from a trusted, fast-crawled domain.
// Targets "<guitar> vs <guitar>" + "online guitar tuner/metronome/transpose" queries.
const fs = require('fs');
const CATALOG = 'C:/Users/Gaming/Documents/Work/friday/site/app/catalog.json';
const CAT = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
const SITE = 'https://guitartoneadapt.com', APP = SITE + '/app/';
const BASE = 'https://peraautomations.github.io/awesome-guitar-tones';
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const count = terms => CAT.filter(t => t.gear && terms.some(x => (t.gear || '').toLowerCase().includes(x))).length;

const STYLE = 'body{background:#0a0910;color:#F4EFFF;font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:860px;margin:0 auto;padding:22px 18px 70px;line-height:1.6}a{color:#FF9A3D;text-decoration:none}a:hover{text-decoration:underline}nav{font-size:13px;color:#A8A1C4;margin-bottom:6px}h1{font-size:clamp(25px,5vw,34px);margin:10px 0 6px;letter-spacing:-.5px}.intro{color:#A8A1C4;margin-bottom:18px}.tag{display:inline-block;background:rgba(255,154,61,.1);color:#FF9A3D;font-size:12px;font-weight:700;padding:4px 11px;border-radius:99px;margin-bottom:6px;border:1px solid rgba(255,154,61,.25)}.cols{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px 0}.col{background:#15111f;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:15px}.col h3{font-size:17px;margin:0 0 8px}.col p{font-size:14px;color:#C9C2E0;margin:0 0 8px}.col .k{font-size:12.5px;color:#726B92}.cta{display:block;text-align:center;background:linear-gradient(135deg,#FF9A3D,#FF5E2B);color:#190d02;font-weight:800;font-size:16px;padding:15px;border-radius:14px;margin:18px 0}.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:9px}.g a{background:#15111f;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px 14px;color:#F4EFFF;font-weight:700}.g a b{display:block;color:#726B92;font-size:12px;font-weight:500;margin-top:2px}.g a:hover{border-color:#FF9A3D;text-decoration:none}.foot{margin-top:30px;color:#726B92;font-size:12.5px;border-top:1px solid rgba(255,255,255,.08);padding-top:16px}.foot a{color:#FF9A3D}';
const head = (title, desc, canon, ld) => '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(title) + '</title><meta name="description" content="' + esc(desc) + '"><link rel="canonical" href="' + canon + '"><meta property="og:title" content="' + esc(title) + '"><meta property="og:description" content="' + esc(desc) + '"><meta property="og:image" content="' + SITE + '/og.png"><meta name="theme-color" content="#0a0910">' + (ld ? '<script type="application/ld+json">' + JSON.stringify(ld).replace(/</g, '\\u003c') + '</' + 'script>' : '') + '<style>' + STYLE + '</style></head><body>';

const G = {
  strat: { name: 'Fender Stratocaster', terms: ['strat'], slug: 'fender-stratocaster', voice: 'bright, glassy and percussive with the famous in-between "quack"', best: 'blues, funk, surf and bright rock', pu: 'three single-coils' },
  lp: { name: 'Gibson Les Paul', terms: ['les paul'], slug: 'gibson-les-paul', voice: 'thick, warm and powerful with rolled-off highs and pushed mids', best: 'rock, hard rock and metal', pu: 'two humbuckers' },
  tele: { name: 'Fender Telecaster', terms: ['telecaster', 'tele '], slug: 'fender-telecaster', voice: 'twangy, bright and cutting with a tight bridge bite', best: 'country, indie and roots rock', pu: 'two single-coils' },
  sg: { name: 'Gibson SG', terms: ['gibson sg', 'sg standard'], slug: 'gibson-sg', voice: 'aggressive and mid-forward — rawer and brighter than a Les Paul', best: 'rock and hard rock', pu: 'two humbuckers' },
  single: { name: 'single-coils', terms: ['single coil', 'single-coil'], slug: 'single-coil-guitars', voice: 'bright, clear and dynamic — they stay clean longer and cut', best: 'cleans, funk and country', pu: 'single-coils' },
  hb: { name: 'humbuckers', terms: ['humbucker'], slug: 'humbucker-guitars', voice: 'hotter, darker and thicker — more mids and lows, drives the amp harder', best: 'rock, metal and thick leads', pu: 'humbuckers' },
};
const PAIRS = [['strat', 'lp'], ['single', 'hb'], ['strat', 'tele'], ['lp', 'sg'], ['tele', 'lp']];
const vsSlug = (a, b) => G[a].slug.replace(/-guitars$/, '') + '-vs-' + G[b].slug.replace(/-guitars$/, '');

const urls = [];
fs.mkdirSync('docs/guitar', { recursive: true });
for (const [aK, bK] of PAIRS) {
  const a = G[aK], b = G[bK];
  const slug = vsSlug(aK, bK);
  const canon = BASE + '/guitar/' + slug + '.html';
  const target = SITE + '/guitar-vs/' + slug + '/';
  const title = a.name + ' vs ' + b.name + ' — Tone & Which to Pick';
  const desc = a.name + ' (' + a.voice.split(',')[0] + ') vs ' + b.name + ' (' + b.voice.split(',')[0] + '): how they sound, what each is best for, and which to choose. Adapt any tone to your rig free.';
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: a.name + ' or ' + b.name + '?', acceptedAnswer: { '@type': 'Answer', text: a.name + ' is ' + a.voice + '; best for ' + a.best + '. ' + b.name + ' is ' + b.voice + '; best for ' + b.best + '.' } }] };
  const card = g => '<div class="col"><h3>' + esc(g.name) + '</h3><p>' + esc(g.voice) + '.</p><p class="k"><b>Pickups:</b> ' + esc(g.pu) + '</p><p class="k"><b>Best for:</b> ' + esc(g.best) + '</p></div>';
  const html = head(title, desc, canon, ld) +
    '<nav><a href="' + BASE + '/">‹ Guitar tones</a> · <a href="' + BASE + '/guitars.html">All comparisons</a> · <a href="' + SITE + '/">GuitarToneAdapt</a></nav>' +
    '<div class="tag">⚖️ Guitar comparison</div><h1>' + esc(a.name) + ' vs ' + esc(b.name) + '</h1>' +
    '<p class="intro">Two different voices. The <b>' + esc(a.name) + '</b> is ' + esc(a.voice) + '. The <b>' + esc(b.name) + '</b> is ' + esc(b.voice) + '.</p>' +
    '<div class="cols">' + card(a) + card(b) + '</div>' +
    '<p>The same record needs different amp settings on each guitar. <a href="' + target + '">See the full ' + esc(a.name) + ' vs ' + esc(b.name) + ' breakdown</a> — including how each one re-dials your gain and EQ.</p>' +
    '<a class="cta" href="' + target + '">🎛️ Get any tone on YOUR guitar — free →</a>' +
    '<div class="foot">Pick <b>' + esc(a.name) + '</b> for ' + esc(a.best) + ', <b>' + esc(b.name) + '</b> for ' + esc(b.best) + '. Or adapt any tone to the guitar you own at <a href="' + APP + '">GuitarToneAdapt</a> · <a href="' + SITE + '/guitar-vs/">all guitar comparisons</a>.</div></body></html>';
  fs.writeFileSync('docs/guitar/' + slug + '.html', html);
  urls.push(canon);
}
// guitars hub
const hub = head('Guitar Comparisons — Strat vs Les Paul, Single-Coil vs Humbucker', 'Classic guitar tone face-offs: Stratocaster vs Les Paul, single-coil vs humbucker, Telecaster vs Les Paul and more — sound, best uses and which to pick.', BASE + '/guitars.html') +
  '<nav><a href="' + BASE + '/">‹ Guitar tones</a> · <a href="' + SITE + '/">GuitarToneAdapt</a></nav>' +
  '<div class="tag">⚖️ Guitar comparisons</div><h1>Guitar comparisons</h1>' +
  '<p class="intro">Classic guitar tone face-offs — sound, best uses and which to pick. Then adapt any tone to the guitar you own, free.</p>' +
  '<div class="g">' + PAIRS.map(([a, b]) => '<a href="' + BASE + '/guitar/' + vsSlug(a, b) + '.html">' + esc(G[a].name) + ' vs ' + esc(G[b].name) + '<b>tone &amp; pick →</b></a>').join('') + '</div>' +
  '<div class="foot"><a href="' + SITE + '/guitar-vs/">Full guitar comparisons on GuitarToneAdapt →</a></div></body></html>';
fs.writeFileSync('docs/guitars.html', hub);
urls.push(BASE + '/guitars.html');

// free tools page — dofollow-links the 3 high-volume tool pages
const TOOLS = [
  ['Free Online Guitar Tuner', SITE + '/tools/tuner/', 'A microphone-based chromatic tuner with standard, Drop D, half-step and alternate tunings. No sign-up.'],
  ['Chord Transposer & Capo Calculator', SITE + '/tools/transpose/', 'Paste any chord progression and shift it to a new key, or find the right capo fret to keep easy shapes.'],
  ['Online Metronome', SITE + '/tools/metronome/', 'Tap-tempo metronome with accents — practice tighter timing at any BPM, free in your browser.'],
];
const toolsHtml = head('Free Online Guitar Tools — Tuner, Metronome, Chord Transposer', 'Free browser guitar tools: an accurate microphone tuner, a tap-tempo metronome and a chord transposer with capo calculator. No sign-up, no download.', BASE + '/tools.html', { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: TOOLS.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t[0], url: t[1] })) }) +
  '<nav><a href="' + BASE + '/">‹ Guitar tones</a> · <a href="' + SITE + '/">GuitarToneAdapt</a></nav>' +
  '<div class="tag">🧰 Free guitar tools</div><h1>Free online guitar tools</h1>' +
  '<p class="intro">Free, no sign-up, runs in your browser — a tuner, a metronome and a chord transposer.</p>' +
  TOOLS.map(t => '<div class="col" style="margin:10px 0"><h3><a href="' + t[1] + '">' + esc(t[0]) + ' →</a></h3><p>' + esc(t[2]) + '</p></div>').join('') +
  '<a class="cta" href="' + APP + '">🎛️ And get any famous tone on your own rig — free →</a>' +
  '<div class="foot"><a href="' + SITE + '/tools/">All free guitar tools on GuitarToneAdapt →</a></div></body></html>';
fs.writeFileSync('docs/tools.html', toolsHtml);
urls.push(BASE + '/tools.html');

// merge sitemap
let existing = [];
try { const sm = fs.readFileSync('docs/sitemap.xml', 'utf8'); existing = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]); } catch (e) {}
const all = [...new Set([...existing, ...urls])];
const today = '2026-06-18';
const smOut = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  all.map(u => '  <url><loc>' + u + '</loc><lastmod>' + today + '</lastmod><changefreq>weekly</changefreq><priority>' + (u === BASE + '/' ? '1.0' : '0.7') + '</priority></url>').join('\n') + '\n</urlset>\n';
fs.writeFileSync('docs/sitemap.xml', smOut);
fs.writeFileSync('/tmp/ghio-gear-urls.json', JSON.stringify(urls));
console.log('generated', urls.length, 'feeder pages (guitar-vs + tools), sitemap total', all.length);
