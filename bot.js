const puppeteer = require('puppeteer');

const ROOM = 'https://chatlet.com/friends';

const hyperLove = [
  "SOULMATES DETECTED. This is literally fate.",
  "The universe created you two for each other.",
  "Wedding bells are already ringing.",
  "Even Romeo & Juliet are jealous.",
  "This love is LEGENDARY. Historians will write about you.",
  "Cupid just retired. His job here is done.",
  "You two are the definition of perfection.",
  "True love exists and YOU are the proof.",
  "The stars aligned just for this moment.",
  "This is the kind of love songs are written about.",
  "Netflix wants to make a movie about you two.",
  "Even Disney couldn't script this better.",
  "Twin flames confirmed. Absolutely unbreakable.",
  "Love at its purest form. I'm emotional.",
  "The algorithm is crying tears of joy.",
  "You two belong together. PERIOD.",
  "This is once-in-a-lifetime love.",
  "God spent extra time on this match.",
  "The chemistry is OFF THE CHARTS.",
  "Relationship goals don't even come close to this."
];

const positive = [
  "The stars literally wrote this.",
  "Even Netflix ships you two.",
  "Your kids will be adorable.",
  "Science can't explain this love.",
  "Soulmates confirmed by the bot.",
  "The universe lowkey obsessed.",
  "Cupid gave you full marks.",
  "This ship has already sailed.",
  "Love at first algo.",
  "Certified couple material.",
  "You two radiate good vibes together.",
  "The compatibility is real.",
  "Solid match, I approve.",
  "Pretty cute ngl.",
  "There's definitely something here.",
  "The potential is strong with this one.",
  "I see good things for you two.",
  "Chemistry detected.",
  "Worth a shot for sure.",
  "The vibes are immaculate.",
  "The way you two fit together is honestly breathtaking.",
  "This match has main character energy.",
  "I can feel the tension from here and I'm just a bot.",
  "The butterflies are real. Very very real.",
  "This is the kind of connection people write poems about.",
  "You two could light up a whole room without trying.",
  "The pull between you two is undeniable.",
  "Even the algorithm got goosebumps on this one.",
  "This is slow burn energy done right.",
  "Every love story needs a beginning — this is yours.",
  "The spark is real and it's not going out anytime soon.",
  "You two are dangerously compatible.",
  "This match has me rooting for you unironically.",
  "The tension? Electric. The potential? Infinite.",
  "I'd bet on this match and I never bet.",
  "Whatever this is, don't let it slip away.",
  "You two could be each other's favorite person.",
  "This hits different. Like, genuinely different.",
  "The chemistry is the kind you can't fake.",
  "I'm not saying it's fate but... it's fate."
];

const negative = [
  "Bestie, just... no.",
  "Even IKEA furniture lasts longer.",
  "My calculator is embarrassed.",
  "A goldfish would make a better match.",
  "Love is blind but not THAT blind.",
  "The vibe said absolutely not.",
  "Not even close, sorry.",
  "Statistically a disaster.",
  "The math ain't mathing.",
  "Bold choice. Wrong one.",
  "I've seen better matches on a dumpster fire.",
  "Even autocorrect couldn't fix this.",
  "This ain't it chief.",
  "The red flags are waving.",
  "Yikes. Just yikes.",
  "Maybe in another universe... but not this one.",
  "Hard pass from the algorithm.",
  "The universe said no thanks.",
  "This is giving disaster energy.",
  "You're better off alone tbh.",
  "The compatibility left the chat.",
  "Bestie, I'm concerned. For both of you.",
  "The only thing compatible here is the mutual disappointment.",
  "This match is aging like milk in the sun.",
  "I've seen better chemistry in a middle school science class.",
  "Your horoscopes aren't compatible, your personalities aren't compatible, NOTHING is compatible.",
  "The red flags aren't waving — they're doing a full parade.",
  "Even your Wi-Fi passwords probably don't match.",
  "This is the human equivalent of mixing bleach and ammonia.",
  "I ran this twice thinking it was a glitch. It's not.",
  "The algorithm tried its best and still got this. That says it all.",
  "You two would argue about whether water is wet.",
  "This ship didn't just sink — it never left the dock.",
  "The only sparks here would start a fire you can't put out.",
  "Somewhere out there, your actual match is wondering where you are.",
  "This has 'messy situationship' written all over it.",
  "Not even a good playlist could save this vibe.",
  "The energy is off. The timing is off. Everything is off.",
  "I'd say give it a chance but I respect you too much.",
  "The universe tried to warn you. This is me finishing the job."
];

const brutal = [
  "LMAOOO you thought?? Absolutely not.",
  "This is a crime against love itself.",
  "Even my code is cringing right now.",
  "Delete this from your memory immediately.",
  "The audacity to even ask. Wow.",
  "I'm calling the police on this match.",
  "This is so bad I need therapy.",
  "Not even desperation could justify this.",
  "The universe is LAUGHING at you.",
  "Cupid just threw up in his mouth.",
  "This match is an insult to mathematics.",
  "I've seen roadkill with better chemistry.",
  "Absolutely catastrophic. Seek help.",
  "Even your imaginary friend wouldn't ship this.",
  "This is the worst thing I've ever calculated.",
  "Love is dead and this match killed it.",
  "I'm embarrassed FOR you.",
  "This is a hate crime against romance.",
  "Not even alcohol could make this work.",
  "Congratulations, you broke the love algorithm."
];

function buildReply(a, b) {
  const pct = Math.floor(Math.random() * 100) + 1;
  let pool, emoji, suffix;
  if (pct >= 95)      { pool = hyperLove; emoji = '💘✨'; suffix = `${pct}% !!! `; }
  else if (pct >= 50) { pool = positive;  emoji = '💕';   suffix = `${pct}% — `; }
  else if (pct >= 6)  { pool = negative;  emoji = '💔';   suffix = `${pct}% — `; }
  else                { pool = brutal;    emoji = '☠️';   suffix = `${pct}% ... `; }
  const phrase = pool[Math.floor(Math.random() * pool.length)];
  return `${emoji} ${a} & ${b} — ${suffix}${phrase}`;
}

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function startRoom(browser) {
  console.log(`\n========== [LoveBot] Démarrage ${ROOM} ==========`);
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
  );

  try {
    console.log(`[LoveBot] Navigation...`);
    await page.goto(ROOM, { waitUntil: 'networkidle2', timeout: 45000 });
    console.log(`[LoveBot] ✓ Page chargée`);

    await page.evaluate(() => {
      localStorage.setItem('displayName', 'Docteur Love');
      localStorage.setItem('profileColor', '#FF69B4');
    });
    await page.reload({ waitUntil: 'networkidle2', timeout: 45000 });
    console.log(`[LoveBot] ✓ Pseudo défini`);

    await page.waitForSelector('button.button.joinChat', { timeout: 20000 });
    await page.click('button.button.joinChat');
    console.log(`[LoveBot] ✓ joinChat cliqué`);
    await wait(4000);

    await page.waitForSelector('button.button.toggleChat', { timeout: 25000 });
    await page.click('button.button.toggleChat');
    console.log(`[LoveBot] ✓ Panneau chat ouvert`);
    await wait(2000);

    const inputExists = await page.$('.input');
    console.log(`[LoveBot] .input trouvé : ${!!inputExists}`);

    await page.exposeFunction('botBuildReply', buildReply);

    await page.evaluate(() => {
      const seen = new Set();

      function parseNames(text) {
        const content = text.replace(/^!love\s+/i, '').trim();
        const sepMatch = content.match(/^(.+?)\s*(?:,|\band\b|&)\s*(.+)$/i);
        if (sepMatch) return [sepMatch[1].trim(), sepMatch[2].trim()];
        const words = content.split(/\s+/);
        if (words.length >= 2) return [words[0], words.slice(1).join(' ')];
        return null;
      }

      async function sendMessage(text) {
        const input = document.querySelector('.input');
        if (!input) { console.log('[LoveBot] ❌ .input non trouvé'); return; }
        input.focus();
        input.value = text;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await new Promise(r => setTimeout(r, 300));
        ['keydown', 'keypress', 'keyup'].forEach(type => {
          input.dispatchEvent(new KeyboardEvent(type, {
            key: 'Enter', code: 'Enter', keyCode: 13, which: 13,
            bubbles: true, cancelable: true
          }));
        });
        console.log('[LoveBot] ✅ Message envoyé :', text);
      }

      async function handleChat(data) {
        let text = null;
        if (typeof data === 'string') {
          try { const p = JSON.parse(data); if (p?.chat) text = p.chat; } catch {}
          if (!text) text = data;
        } else if (data?.chat) {
          text = data.chat;
        }
        if (!text) return;
        text = text.trim();

        if (text.includes('💘') || text.includes('💕') || text.includes('💔') || text.includes('☠️')) return;
        if (!text.toLowerCase().startsWith('!love')) return;

        const key = text.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        setTimeout(() => seen.delete(key), 5000);

        const names = parseNames(text);
        if (!names) { console.log('[LoveBot] ❌ Noms non parsés :', text); return; }

        const [a, b] = names;
        console.log('[LoveBot] 💘 Match :', a, '&', b);
        const reply = await window.botBuildReply(a, b);
        setTimeout(() => sendMessage(reply), 800);
      }

      // Observer DOM
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType !== 1) continue;
            const msgEl = node.matches?.('div.message') ? node : node.querySelector?.('div.message');
            if (!msgEl) continue;
            const content = msgEl.querySelector('.span.content');
            if (!content) continue;
            handleChat(content.textContent.trim());
          }
        }
      });

      const container = document.querySelector('.messages') || document.querySelector('.chat') || document.body;
      observer.observe(container, { childList: true, subtree: true });
      console.log('[LoveBot] DOM observer actif sur :', container.className || 'body');

      // Hook RTCDataChannel
      const hookedChannels = new WeakSet();
      const origAEL = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type, fn, opts) {
        if (this instanceof RTCDataChannel && type === 'message' && typeof fn === 'function') {
          if (!hookedChannels.has(this)) {
            hookedChannels.add(this);
            console.log('[LoveBot] ✓ DataChannel hooké');
          }
          return origAEL.call(this, type, function(ev) {
            handleChat(ev.data);
            return fn.call(this, ev);
          }, opts);
        }
        return origAEL.call(this, type, fn, opts);
      };

      console.log('[LoveBot] ✓ Injections complètes');
    });

    console.log(`\n✅ [LoveBot] ACTIF sur ${ROOM}\n`);

    page.on('close', () => {
      console.log(`[LoveBot] Page fermée — reconnexion dans 15s`);
      setTimeout(() => startRoom(browser), 15000);
    });

    page.on('pageerror', err => {
      if (err.message.includes('RTCPeerConnection')) return;
      console.log(`[LoveBot] Erreur page :`, err.message);
    });

  } catch (err) {
    console.error(`[LoveBot] ❌ Erreur :`, err.message);
    await page.close().catch(() => {});
    console.log(`[LoveBot] Retry dans 20s...`);
    setTimeout(() => startRoom(browser), 20000);
  }
}

// Serveur HTTP minimal pour Render — lancé une seule fois
const http = require('http');
const server = http.createServer((req, res) => res.end('ok'));
server.on('error', (err) => {
  if (err.code !== 'EADDRINUSE') console.error('[LoveBot] HTTP error:', err.message);
});
server.listen(process.env.PORT || 3000, () => {
  console.log(`[LoveBot] HTTP sur port ${process.env.PORT || 3000}`);
});

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.PUPPETEER_EXEC_PATH || undefined,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ]
  });

  browser.on('disconnected', async () => {
    console.log('[LoveBot] Browser crashé — redémarrage dans 15s');
    setTimeout(main, 15000);
  });

  await startRoom(browser);
}

main();
