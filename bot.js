const puppeteer = require('puppeteer');

const ROOM = 'https://chatlet.com/friends';

const hyperLove = [
  "SOULMATES DÉTECTÉS. C'est littéralement le destin.",
  "L'univers vous a créés l'un pour l'autre.",
  "Même Roméo & Juliette sont jaloux.",
  "Cupidon vient de prendre sa retraite.",
  "Twin flames confirmés. Absolument incassable.",
  "La chimie est HORS NORME.",
];
const positive = [
  "Les étoiles ont littéralement écrit ça.",
  "Même Netflix vous shippe.",
  "Soulmates confirmés par le bot.",
  "Certifié couple en puissance.",
  "La chimie est détectée.",
];
const negative = [
  "Bestie, juste... non.",
  "Même un meuble IKEA dure plus longtemps.",
  "Le vibe a dit absolument pas.",
  "Les red flags sont en train d'agiter.",
  "L'univers a dit non merci.",
];
const brutal = [
  "LMAOOO t'as cru ?? Absolument pas.",
  "C'est un crime contre l'amour lui-même.",
  "L'univers RIT de toi.",
  "Cupidon vient de vomir dans sa bouche.",
  "Félicitations, t'as cassé l'algorithme de l'amour.",
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
