const puppeteer = require('puppeteer');

const ROOMS = [
  'https://chatlet.com/kids',
  'https://chatlet.com/friends'
];

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

async function startRoom(browser, url) {
  console.log(`\n========== [LoveBot] Démarrage ${url} ==========`);
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
  );

  console.log(`[LoveBot] Navigation vers ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  console.log(`[LoveBot] ✓ Page chargée`);

  // ── 0. Définir le pseudo et la couleur ──────────────
  console.log(`[LoveBot] Définition du pseudo et couleur...`);
  await page.evaluate(() => {
    localStorage.setItem('displayName', 'Docteur Love');
    localStorage.setItem('profileColor', '#FF69B4');
    console.log('[LoveBot] ✓ LocalStorage mis à jour');
  });
  console.log(`[LoveBot] Rechargement de la page...`);
  await page.reload({ waitUntil: 'networkidle2' });
  console.log(`[LoveBot] ✓ Pseudo et couleur définis`);

  // ── 1. Cliquer joinChat ────────────────────────────
  console.log(`[LoveBot] En attente du bouton joinChat...`);
  await page.waitForSelector('button.button.joinChat', { timeout: 15000 });
  console.log(`[LoveBot] ✓ Bouton joinChat trouvé`);
  await page.click('button.button.joinChat');
  console.log(`[LoveBot] ✓ joinChat cliqué`);
  await new Promise(r => setTimeout(r, 2000)); // Pause après joinChat

  // ── 2. Attendre 5 secondes ─────────────────────────
  console.log(`[LoveBot] Attente 5s avant ouverture du panneau...`);
  await new Promise(r => setTimeout(r, 5000));
  console.log(`[LoveBot] ✓ 5s écoulées`);
  await new Promise(r => setTimeout(r, 1500)); // Extra pause pour stabilité

  // ── 3. Ouvrir le panneau d'écriture ────────────────
  console.log(`[LoveBot] En attente du bouton toggleChat...`);
  await page.waitForSelector('button.button.toggleChat', { timeout: 10000 });
  console.log(`[LoveBot] ✓ Bouton toggleChat trouvé`);
  await page.click('button.button.toggleChat');
  console.log(`[LoveBot] ✓ Panneau ouvert`);
  await new Promise(r => setTimeout(r, 2000)); // Pause après toggleChat

  // ── 4. Exposer buildReply au contexte page ────────
  await page.exposeFunction('botBuildReply', buildReply);

  // ── 5. Injecter la logique LoveBot ────────────────
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
      if (!input) { 
        console.log('[LoveBot] ❌ .input non trouvé'); 
        console.log('[LoveBot] Éléments disponibles :', document.querySelectorAll('input').length);
        return; 
      }

      console.log('[LoveBot] 📝 Input trouvé, envoi de :', text);
      input.focus();
      input.value = text;
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(r => setTimeout(r, 200));

      ['keypress', 'keydown', 'keyup'].forEach(type => {
        input.dispatchEvent(new KeyboardEvent(type, {
          key: 'Enter', code: 'Enter', keyCode: 13, which: 13,
          bubbles: true, cancelable: true
        }));
      });

      console.log('[LoveBot] ✅ Message envoyé !');
    }

    async function handleChat(data) {
      let text = null;
      console.log('[LoveBot] handleChat reçu :', data);
      
      if (typeof data === 'string') {
        try { 
          const p = JSON.parse(data); 
          if (p?.chat) text = p.chat; 
          console.log('[LoveBot] JSON parsé :', p);
        } catch (e) {
          console.log('[LoveBot] JSON parse fail :', e.message);
        }
        if (!text) text = data;
      } else if (data?.chat) {
        text = data.chat;
      }
      
      if (!text) {
        console.log('[LoveBot] ⚠️ Pas de texte trouvé dans data');
        return;
      }
      
      text = text.trim();
      console.log('[LoveBot] Texte traité :', text);

      // Ignorer nos propres réponses
      if (
        text.includes('chance!') || text.includes('chance.') ||
        text.includes('!!!') || text.includes('% ...') ||
        text.includes('💘') || text.includes('💕') ||
        text.includes('💔') || text.includes('☠️')
      ) {
        console.log('[LoveBot] ✓ Message ignoré (notre réponse)');
        return;
      }

      if (!text.toLowerCase().startsWith('!love')) {
        console.log('[LoveBot] ✓ Message ignoré (pas !love)');
        return;
      }

      const key = text.toLowerCase();
      if (seen.has(key)) {
        console.log('[LoveBot] ✓ Message ignoré (déjà traité)');
        return;
      }
      
      seen.add(key);
      setTimeout(() => seen.delete(key), 5000);

      const names = parseNames(text);
      if (!names) { 
        console.log('[LoveBot] ❌ Noms non trouvés dans :', text); 
        return; 
      }

      const [a, b] = names;
      console.log('[LoveBot] ✅ Match détecté :', a, '&', b);

      const reply = await window.botBuildReply(a, b);
      console.log('[LoveBot] 📤 Réponse :', reply);

      setTimeout(() => sendMessage(reply), 600);
    }

    // ── Observer le DOM pour lire les nouveaux messages ───
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

    function startObserver() {
      const container = document.querySelector('.messages')
                     || document.querySelector('.chat')
                     || document.body;
      observer.observe(container, { childList: true, subtree: true });
      console.log('[LoveBot] DOM observer actif sur', container.className || 'body');
    }
    startObserver();

    // ── Hook RTCDataChannel ────────────────────────────────
    const hookedChannels = new WeakSet();
    const origAEL = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, fn, opts) {
      if (this instanceof RTCDataChannel && type === 'message' && typeof fn === 'function') {
        if (!hookedChannels.has(this)) {
          hookedChannels.add(this);
          console.log('[LoveBot] DataChannel hooké');
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

  console.log(`\n✅ [LoveBot] ACTIF sur ${url}\n`);

  page.on('close', () => {
    console.log(`[LoveBot] Page fermée : ${url} — reconnexion dans 10s`);
    setTimeout(() => startRoom(browser, url), 10000);
  });

  page.on('pageerror', err => {
    console.log(`[LoveBot] Erreur page ${url} :`, err.message);
  });
}

async function launchBrowser() {
  return puppeteer.launch({
    headless: 'new', // ← 'new' pour Render (production), false pour tester localement
    executablePath: process.env.PUPPETEER_EXEC_PATH || undefined,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ]
  });
}

async function main() {
  // Lancer un browser séparé pour chaque salon
  for (const url of ROOMS) {
    (async () => {
      let browser = await launchBrowser();
      await startRoom(browser, url);
      
      browser.on('disconnected', async () => {
        console.log(`[LoveBot] Browser crashé pour ${url} — redémarrage dans 15s`);
        setTimeout(() => {
          const idx = ROOMS.indexOf(url);
          if (idx !== -1) {
            (async () => {
              let newBrowser = await launchBrowser();
              await startRoom(newBrowser, url);
            })();
          }
        }, 15000);
      });
    })();
  }
}

main();
