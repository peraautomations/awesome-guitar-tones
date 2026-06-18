// github.io feeder: song-tone pages for the most iconic/high-search songs.
// "<song> guitar tone / amp settings" is the highest-volume guitar query class.
// The feeder is high-DA + already Bing/Yandex-indexed, so it can rank for these
// NOW (while the new main domain waits for Google) and DOFOLLOW-funnels each to the
// matching /tone/<slug>/ page + the app. GuitarToneAdapt branded.
const fs = require('fs');
const CAT = JSON.parse(fs.readFileSync('C:/Users/Gaming/Documents/Work/friday/site/app/catalog.json', 'utf8'));
const SITE = 'https://guitartoneadapt.com', APP = SITE + '/app/';
const BASE = 'https://peraautomations.github.io/awesome-guitar-tones';
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// iconic, high-search artists; pick first unique song per (song,artist), cap for quality
const FAMOUS = /metallica|nirvana|guns.?n.?roses|ac.?dc|led zeppelin|pink floyd|hendrix|deftones|slipknot|^tool$|rage against|red hot chili|black sabbath|iron maiden|megadeth|pantera|gojira|green day|blink|foo fighters|radiohead|muse|arctic monkeys|the strokes|john mayer|stevie ray|eric clapton|david gilmour|van halen|pearl jam|soundgarden|alice in chains|queens of the stone|smashing pumpkins|oasis|the beatles|polyphia|periphery|sleep token|bring me the horizon|architects|system of a down|audioslave|the white stripes|weezer/i;
const seen = new Set(), picks = [];
for (const t of CAT) {
  if (!t.slug || !t.song || !t.artist || !t.set || !FAMOUS.test(t.artist)) continue;
  const k = (t.song + '|' + t.artist).toLowerCase();
  if (seen.has(k)) continue; seen.add(k);
  picks.push(t);
}
picks.sort((a, b) => (b.set.gain || 0) - (a.set.gain || 0));
const SEL = picks.slice(0, 40);

const STYLE = 'body{background:#0a0910;color:#F4EFFF;font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:820px;margin:0 auto;padding:22px 18px 70px;line-height:1.6}a{color:#FF9A3D;text-decoration:none}a:hover{text-decoration:underline}nav{font-size:13px;color:#A8A1C4;margin-bottom:6px}h1{font-size:clamp(23px,5vw,32px);margin:10px 0 6px;letter-spacing:-.5px}.intro{color:#A8A1C4;margin-bottom:16px}.tag{display:inline-block;background:rgba(255,154,61,.1);color:#FF9A3D;font-size:12px;font-weight:700;padding:4px 11px;border-radius:99px;margin-bottom:6px;border:1px solid rgba(255,154,61,.25)}.eqbox{background:linear-gradient(165deg,#221a2e,#120e19);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:16px;margin:12px 0;font-size:15px}.eqbox b{color:#FF9A3D}.gear{font-size:14px;color:#C9C2E0;margin:10px 0}.gear b{color:#F4EFFF}.cta{display:block;text-align:center;background:linear-gradient(135deg,#FF9A3D,#FF5E2B);color:#190d02;font-weight:800;font-size:16px;padding:15px;border-radius:14px;margin:18px 0}.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:9px}.g a{background:#15111f;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:11px 14px;color:#F4EFFF;font-weight:700;font-size:14px}.g a b{display:block;color:#726B92;font-size:12px;font-weight:500;margin-top:2px}.g a:hover{border-color:#FF9A3D;text-decoration:none}.foot{margin-top:28px;color:#726B92;font-size:12.5px;border-top:1px solid rgba(255,255,255,.08);padding-top:16px}.foot a{color:#FF9A3D}';
const head = (title, desc, canon, ld) => '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(title) + '</title><meta name="description" content="' + esc(desc) + '"><link rel="canonical" href="' + canon + '"><meta property="og:title" content="' + esc(title) + '"><meta property="og:description" content="' + esc(desc) + '"><meta property="og:image" content="' + SITE + '/og.png"><meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#0a0910">' + (ld ? '<script type="application/ld+json">' + JSON.stringify(ld).replace(/</g, '\\u003c') + '</' + 'script>' : '') + '<style>' + STYLE + '</style></head><body>';

const urls = [];
fs.mkdirSync('docs/song', { recursive: true });
for (const t of SEL) {
  const s = t.set;
  const canon = BASE + '/song/' + t.slug + '.html';
  const target = SITE + '/tone/' + t.slug + '/';
  const title = t.song + ' by ' + t.artist + ' — Guitar Tone & Amp Settings';
  const eqStr = 'gain ' + s.gain + ', bass ' + s.bass + ', mid ' + s.mid + ', treble ' + s.treble + ', presence ' + s.presence;
  const desc = 'Get the ' + t.song + ' (' + t.artist + ') guitar tone: amp settings (' + eqStr + ')' + (t.gear ? ', gear (' + String(t.gear).slice(0, 40) + ')' : '') + ' — then adapt it to your own rig free.';
  const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: title, description: desc, url: canon,
    about: { '@type': 'MusicRecording', name: t.song, byArtist: { '@type': 'MusicGroup', name: t.artist } } };
  const html = head(title, desc, canon, ld) +
    '<nav><a href="' + BASE + '/">‹ Guitar tones</a> · <a href="' + BASE + '/amps.html">Amps</a> · <a href="' + SITE + '/">GuitarToneAdapt</a></nav>' +
    '<div class="tag">🎸 Song tone</div><h1>' + esc(t.song) + ' — guitar tone &amp; amp settings</h1>' +
    '<p class="intro">How to get the <b>' + esc(t.song) + '</b> tone by <b>' + esc(t.artist) + '</b> — the researched amp settings and gear, adaptable to whatever you own.</p>' +
    '<div class="eqbox">Amp starting point: <b>gain ' + s.gain + '</b> · bass ' + s.bass + ' · mid ' + s.mid + ' · treble ' + s.treble + ' · presence ' + s.presence + (s.reverb != null ? ' · reverb ' + s.reverb : '') + ' <span style="color:#726B92">(out of 10)</span></div>' +
    (t.gear ? '<p class="gear"><b>Guitar/gear:</b> ' + esc(t.gear) + (t.amp ? ' · <b>Amp:</b> ' + esc(t.amp) : '') + (t.pu ? ' · <b>Pickups:</b> ' + esc(t.pu) : '') + '</p>' : '') +
    '<a class="cta" href="' + target + '">🎛️ Get this exact tone on YOUR guitar &amp; amp — free →</a>' +
    '<p>These are the original-rig settings. Different guitar or amp? <a href="' + target + '">GuitarToneAdapt re-dials ' + esc(t.song) + '</a> for the gear you actually own — gain and EQ compensated automatically.</p>' +
    '<div class="foot">Community-researched estimate. More: <a href="' + APP + '">adapt any tone free</a> · <a href="' + BASE + '/songs.html">all song tones</a> · <a href="' + SITE + '/tones/">495 tones</a>.</div></body></html>';
  fs.writeFileSync('docs/song/' + t.slug + '.html', html);
  urls.push(canon);
}
// songs hub
const hub = head('Famous Song Guitar Tones — Amp Settings for ' + SEL.length + ' Classics', 'Guitar tone & amp settings for iconic songs — Master of Puppets, Smells Like Teen Spirit, Comfortably Numb and more. Researched settings, adaptable to your rig free.', BASE + '/songs.html') +
  '<nav><a href="' + BASE + '/">‹ Guitar tones</a> · <a href="' + SITE + '/">GuitarToneAdapt</a></nav>' +
  '<div class="tag">🎸 Song tones</div><h1>Famous song guitar tones</h1>' +
  '<p class="intro">Amp settings and gear behind iconic songs — adapt any to the guitar and amp you own, free.</p>' +
  '<div class="g">' + SEL.map(t => '<a href="' + BASE + '/song/' + t.slug + '.html">' + esc(t.song) + '<b>' + esc(t.artist) + ' →</b></a>').join('') + '</div>' +
  '<div class="foot"><a href="' + SITE + '/tones/">All 495 song tones on GuitarToneAdapt →</a></div></body></html>';
fs.writeFileSync('docs/songs.html', hub);
urls.push(BASE + '/songs.html');

// merge sitemap
let existing = [];
try { existing = [...fs.readFileSync('docs/sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]); } catch (e) {}
const all = [...new Set([...existing, ...urls])];
const smOut = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  all.map(u => '  <url><loc>' + u + '</loc><lastmod>2026-06-19</lastmod><changefreq>weekly</changefreq><priority>' + (u === BASE + '/' ? '1.0' : '0.7') + '</priority></url>').join('\n') + '\n</urlset>\n';
fs.writeFileSync('docs/sitemap.xml', smOut);
fs.writeFileSync('/tmp/ghio-song-urls.json', JSON.stringify(urls));
console.log('generated', SEL.length, 'song-tone feeder pages + hub, sitemap total', all.length);
