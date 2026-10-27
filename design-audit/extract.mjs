import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";

const root = new URL("./", import.meta.url).pathname;
const screenshots = `${root}screenshots`;
await mkdir(screenshots, { recursive: true });

const port = 9400 + (process.pid % 400);
const chrome = spawn("google-chrome", [
  "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
  "--hide-scrollbars", `--remote-debugging-port=${port}`, `--user-data-dir=/tmp/istabot-audit-chrome-${process.pid}`,
  "about:blank",
], { stdio: ["ignore", "ignore", "inherit"] });

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
for (let i = 0; i < 50; i++) {
  try { if ((await fetch(`http://127.0.0.1:${port}/json`)).ok) break; } catch {}
  await delay(200);
}

const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
console.log(`Connected to Chrome; ${tabs.length} tab(s).`);
console.log(tabs.map(t => `${t.type}:${t.url}`).join(" | "));
const tab = tabs.find(t => t.type === "page" && t.url === "about:blank") || tabs.find(t => t.type === "page");
const socket = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let seq = 0;
const pending = new Map();
socket.onmessage = ({ data }) => {
  const msg = JSON.parse(data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id); pending.delete(msg.id);
    if (msg.error) reject(new Error(JSON.stringify(msg.error)));
    else resolve(msg.result);
  }
};
const cdp = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++seq; pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) => (await cdp("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.value;

await cdp("Page.enable");
await cdp("Runtime.enable");
await cdp("Network.enable");

const viewports = [
  ["desktop-1440", 1440, 1000], ["laptop-1280", 1280, 900],
  ["tablet-768", 768, 1024], ["mobile-390", 390, 844],
];

const audit = { source: "https://demo.istabot.com", capturedAt: new Date().toISOString(), viewports: {} };
const componentSelectors = {
  navbar: ".navbar-wrapper", hero: ".hero-section", features: "#features", stats: ".stats-section",
  process: "#how-it-works", comparison: "#comparison", pricing: "#pricing", faq: "#faq",
  blog: "#blog", cta: ".cta-section", footer: ".footer-section",
};

for (const [name, width, height] of viewports) {
  console.log(`Capturing ${name}...`);
  await cdp("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 600 });
  await cdp("Page.navigate", { url: "https://demo.istabot.com" });
  await delay(5500);
  await evaluate("document.fonts.ready.then(() => true)");
  await evaluate("scrollTo(0, document.documentElement.scrollHeight); new Promise(r => setTimeout(r, 1200))");
  await evaluate("scrollTo(0, 0); new Promise(r => setTimeout(r, 600))");
  const metrics = await cdp("Page.getLayoutMetrics");
  const size = metrics.cssContentSize;
  console.log(`Page metrics ${Math.round(size.width)}x${Math.round(size.height)}.`);
  const shot = await cdp("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, fromSurface: true,
    clip: { x: 0, y: 0, width, height: Math.min(size.height, 20000), scale: 1 } });
  await writeFile(`${screenshots}/${name}-full.png`, Buffer.from(shot.data, "base64"));
  console.log(`Wrote ${name} (${width}x${Math.round(size.height)}).`);

  audit.viewports[name] = await evaluate(`(() => {
    const selectors = ${JSON.stringify(componentSelectors)};
    const props = ["display","position","width","maxWidth","height","padding","margin","gap","gridTemplateColumns","backgroundColor","backgroundImage","color","borderColor","borderRadius","boxShadow","fontFamily","fontSize","fontWeight","lineHeight","letterSpacing","opacity","overflow"];
    const style = (el) => { const c = getComputedStyle(el); return Object.fromEntries(props.map(p => [p, c[p]])); };
    const components = {};
    for (const [key, selector] of Object.entries(selectors)) {
      const el = document.querySelector(selector); if (!el) continue;
      const r = el.getBoundingClientRect(); components[key] = { selector, rect: { x:r.x, y:r.y+scrollY, width:r.width, height:r.height }, style:style(el) };
    }
    const sample = (selector) => [...document.querySelectorAll(selector)].slice(0,12).map(el => ({tag:el.tagName.toLowerCase(), class:el.className, text:(el.innerText||"").trim().slice(0,120), style:style(el)}));
    return { viewport:{width:innerWidth,height:innerHeight}, page:{width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight}, components,
      headings:sample("h1,h2,h3,h4,h5,h6"), buttons:sample("a[class*='button'],button"), cards:sample("[class*='card']"),
      body:style(document.body), htmlVariables:Object.fromEntries([...getComputedStyle(document.documentElement)].filter(n=>n.startsWith("--")).map(n=>[n,getComputedStyle(document.documentElement).getPropertyValue(n).trim()])) };
  })()`);

  if (name === "desktop-1440") {
    for (const key of Object.keys(componentSelectors)) {
      const rect = audit.viewports[name].components[key]?.rect;
      if (!rect || rect.height <= 0) continue;
      const clip = { x: Math.max(0, rect.x), y: Math.max(0, rect.y), width: Math.min(width, rect.width), height: Math.min(rect.height, 1600), scale: 1 };
      const image = await cdp("Page.captureScreenshot", { format:"png", captureBeyondViewport:true, fromSurface:true, clip });
      await writeFile(`${screenshots}/component-${key}.png`, Buffer.from(image.data, "base64"));
    }

    audit.resources = await evaluate(`performance.getEntriesByType("resource").map(r => ({url:r.name, type:r.initiatorType, size:r.transferSize, decodedSize:r.decodedBodySize})).filter(r => /\\.(css|js|png|jpe?g|webp|svg|woff2?)(\\?|$)/i.test(r.url))`);
    audit.animations = await evaluate(`[...document.getAnimations()].map(a => { const e=a.effect?.target; const t=a.effect?.getTiming?.()||{}; return {tag:e?.tagName, class:e?.className, animationName:getComputedStyle(e).animationName, duration:t.duration, delay:t.delay, iterations:t.iterations, easing:t.easing, playState:a.playState}; })`);
    audit.styleSheets = await evaluate(`[...document.styleSheets].map(s => { let rules=[]; try { rules=[...s.cssRules].map(r=>r.cssText).filter(x=>x.startsWith("@media")||x.startsWith("@keyframes")).slice(0,300) } catch {} return {href:s.href, rules}; })`);
    audit.imageDimensions = await evaluate(`[...document.images].map(i => ({src:i.currentSrc||i.src, alt:i.alt, intrinsicWidth:i.naturalWidth, intrinsicHeight:i.naturalHeight, renderedWidth:i.getBoundingClientRect().width, renderedHeight:i.getBoundingClientRect().height})).filter((x,i,a)=>a.findIndex(y=>y.src===x.src)===i)`);
  }
}

await writeFile(`${root}raw-browser-audit.json`, JSON.stringify(audit, null, 2));
socket.close(); chrome.kill("SIGTERM");
console.log(`Captured ${Object.keys(audit.viewports).length} viewports, ${audit.resources?.length || 0} resources, ${audit.animations?.length || 0} animations.`);
