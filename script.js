/* ===================== SHIRT ARTWORK (shared path) ===================== */
const SHIRT_PATH = "M115 20 C115 8 135 2 150 10 C165 2 185 8 185 20 L230 50 L205 88 L188 72 L188 300 L112 300 L112 72 L95 88 L70 50 Z";

function shirtSVGMarkup(color, printText, printColor, printSize){
  printSize = printSize || 22;
  return `
    <path d="${SHIRT_PATH}" fill="${color}" stroke="#0e0e10" stroke-width="7" stroke-linejoin="round"/>
    <text x="150" y="160" text-anchor="middle" font-family="Archivo Black" font-size="${printSize}"
          fill="${printColor}" style="text-transform:uppercase;">
      ${wrapTextTspans(printText, 150, 150, printSize)}
    </text>
  `;
}

/* very small helper to wrap long captions onto 2 lines inside the svg text */
function wrapTextTspans(text, x, startY, size){
  const words = text.trim().split(/\s+/);
  const lines = [];
  let line = "";
  words.forEach(w=>{
    const test = line ? line + " " + w : w;
    if(test.length > 12 && line){ lines.push(line); line = w; }
    else{ line = test; }
  });
  if(line) lines.push(line);
  if(lines.length > 3) lines.length = 3;
  const lineHeight = size + 6;
  const totalH = lineHeight * lines.length;
  const firstY = startY - totalH/2 + lineHeight*0.8;
  return lines.map((l,i)=>`<tspan x="${x}" y="${firstY + i*lineHeight}">${l}</tspan>`).join("");
}

/* ===================== PRODUCT DATA ===================== */
const PRODUCTS = [
  {id:'p1', name:'Big Delulu Energy', price:799, color:'#c8f000', print:'BIG DELULU ENERGY', printColor:'#0e0e10'},
  {id:'p2', name:'Not My Villain Era', price:849, color:'#18181b', print:'NOT MY VILLAIN ERA', printColor:'#ff3fa4'},
  {id:'p3', name:'Certified Bestie', price:749, color:'#f4f1e6', print:'CERTIFIED BESTIE', printColor:'#0e0e10'},
  {id:'p4', name:'Feral Friday', price:799, color:'#ff3fa4', print:'FERAL FRIDAY', printColor:'#0e0e10'},
  {id:'p5', name:'Main Character Szn', price:899, color:'#18181b', print:'MAIN CHARACTER SZN', printColor:'#c8f000'},
  {id:'p6', name:'No Thoughts Just Vibes', price:749, color:'#c8f000', print:'NO THOUGHTS JUST VIBES', printColor:'#0e0e10'},
];

const COLORWAYS = ['#c8f000', '#ff3fa4', '#18181b', '#f4f1e6', '#3fa9ff'];

/* ===================== HERO COLLAGE ===================== */
const collageEl = document.getElementById('hero-collage');
const collageSpots = ['c1','c2','c3','c4','c5'];
PRODUCTS.slice(0,5).forEach((p, i)=>{
  const div = document.createElement('div');
  div.className = 'collage-shirt ' + collageSpots[i];
  div.innerHTML = `<svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg">${shirtSVGMarkup(p.color, p.print, p.printColor, 24)}</svg>`;
  collageEl.appendChild(div);
});

/* ===================== MARQUEE ===================== */
const marqueeItems = ["GEN-Z APPROVED", "NO CAP, ALL COTTON", "SLAY OR NOTHING", "MADE FOR THE FERAL & FABULOUS", "PRINT ON DEMAND", "DELULU IS THE SOLULU"];
const marqueeTrack = document.getElementById('marquee-track');
for(let r=0; r<2; r++){
  marqueeItems.forEach(t=>{
    const span = document.createElement('span');
    span.textContent = t + "  ✦";
    marqueeTrack.appendChild(span);
  });
}

/* ===================== MOOD SLIDER (public placeholder images) ===================== */
const MOOD_IMAGES = [
  {seed:'delulu-street-1', cap:'street energy'},
  {seed:'delulu-city-2', cap:'main character walk'},
  {seed:'delulu-vibe-3', cap:'group chat core'},
  {seed:'delulu-fit-4', cap:'no thoughts'},
  {seed:'delulu-color-5', cap:'brat summer'},
  {seed:'delulu-mood-6', cap:'feral friday'},
  {seed:'delulu-lofi-7', cap:'soft delulu'},
  {seed:'delulu-neon-8', cap:'unhinged glow'},
];
const moodTrack = document.getElementById('mood-track');
for(let r=0; r<2; r++){
  MOOD_IMAGES.forEach(m=>{
    const fig = document.createElement('figure');
    fig.innerHTML = `<img src="https://picsum.photos/seed/${m.seed}/460/600" alt="Mood board reference: ${m.cap}" loading="lazy">
                      <figcaption>${m.cap}</figcaption>`;
    moodTrack.appendChild(fig);
  });
}

/* ===================== SHOP GRID ===================== */
const shopGrid = document.getElementById('shop-grid');
let cartCount = 0;

PRODUCTS.forEach(p=>{
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="shirt-stage">
      <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg">${shirtSVGMarkup(p.color, p.print, p.printColor, 20)}</svg>
    </div>
    <h3>${p.name}</h3>
    <span class="price-tag">₹${p.price}</span>
    <div class="card-actions">
      <button class="btn-ghost" data-download="${p.id}">Download ↓</button>
      <button class="btn-add" data-add="${p.id}">Add to bag</button>
    </div>
  `;
  shopGrid.appendChild(card);
});

shopGrid.addEventListener('click', (e)=>{
  const addId = e.target.getAttribute('data-add');
  const dlId = e.target.getAttribute('data-download');
  if(addId){
    cartCount++;
    document.getElementById('cart-count').textContent = cartCount;
    const p = PRODUCTS.find(x=>x.id===addId);
    showToast(`Added "${p.name}" to bag ✓`);
  }
  if(dlId){
    const p = PRODUCTS.find(x=>x.id===dlId);
    downloadShirtPNG(p.color, p.print, p.printColor, `delulu-${p.id}-${slug(p.name)}.png`);
  }
});

/* ===================== CUSTOMIZE STUDIO ===================== */
const previewSvg = document.getElementById('preview-svg');
const customTextInput = document.getElementById('custom-text');
const swatchesEl = document.getElementById('swatches');
let selectedColor = COLORWAYS[0];

COLORWAYS.forEach((c, i)=>{
  const sw = document.createElement('button');
  sw.className = 'swatch' + (i===0 ? ' active' : '');
  sw.style.background = c;
  sw.setAttribute('aria-label', 'Colourway ' + (i+1));
  sw.addEventListener('click', ()=>{
    selectedColor = c;
    [...swatchesEl.children].forEach(el=>el.classList.remove('active'));
    sw.classList.add('active');
    renderPreview();
  });
  swatchesEl.appendChild(sw);
});

function textColorFor(hex){
  // rough luminance check so print text stays legible against the chosen colourway
  const r = parseInt(hex.substr(1,2),16), g = parseInt(hex.substr(3,2),16), b = parseInt(hex.substr(5,2),16);
  const lum = (0.299*r + 0.587*g + 0.114*b)/255;
  return lum > 0.6 ? '#0e0e10' : '#f4f1e6';
}

function renderPreview(){
  const text = customTextInput.value || 'MAIN CHARACTER SZN';
  previewSvg.innerHTML = shirtSVGMarkup(selectedColor, text, textColorFor(selectedColor), 22);
}
customTextInput.addEventListener('input', renderPreview);
renderPreview();

document.getElementById('download-custom').addEventListener('click', ()=>{
  const text = customTextInput.value || 'MAIN CHARACTER SZN';
  downloadShirtPNG(selectedColor, text, textColorFor(selectedColor), `delulu-custom-fit.png`);
});

/* ===================== CANVAS DOWNLOAD ===================== */
function downloadShirtPNG(color, text, printColor, filename){
  const canvas = document.createElement('canvas');
  canvas.width = 600; canvas.height = 640;
  const ctx = canvas.getContext('2d');
  const scale = 2; // path coords were designed on a 300x320 viewbox
  ctx.scale(scale, scale);

  const path = new Path2D(SHIRT_PATH);
  ctx.fillStyle = color;
  ctx.fill(path);
  ctx.lineWidth = 7;
  ctx.strokeStyle = '#0e0e10';
  ctx.lineJoin = 'round';
  ctx.stroke(path);

  document.fonts.load('900 22px "Archivo Black"').then(()=>{
    ctx.fillStyle = printColor;
    ctx.textAlign = 'center';
    ctx.font = '900 22px "Archivo Black"';
    const words = text.toUpperCase().trim().split(/\s+/);
    const lines = [];
    let line = '';
    words.forEach(w=>{
      const test = line ? line + ' ' + w : w;
      if(test.length > 12 && line){ lines.push(line); line = w; } else { line = test; }
    });
    if(line) lines.push(line);
    if(lines.length > 3) lines.length = 3;
    const lineHeight = 28;
    const totalH = lineHeight * lines.length;
    const startY = 150 - totalH/2 + lineHeight*0.8;
    lines.forEach((l,i)=> ctx.fillText(l, 150, startY + i*lineHeight));

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Mockup downloaded ✓');
  });
}

/* ===================== TOAST ===================== */
let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> t.classList.remove('show'), 2200);
}

function slug(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }