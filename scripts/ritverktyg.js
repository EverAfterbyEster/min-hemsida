const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let objects = [];
let dragTarget = null;
let offsetX = 0;
let offsetY = 0;
let selected = null;
let nextTableNumber = 1;
let showAxes = false;
let hasCentered = false;  // HÄR
let nextTableId = 1;
let guests = window.guests || [];
let todoItems = window.todoItems || [];
let summary = window.summary || {};


// === Persistenta räknare för bord ===
// Hjälpfunktioner för fallback när meta saknas i en äldre JSON
function computeNextTableNumberFromObjects(list = []) {
  let maxNum = 0;
  for (const o of list) {
    if (o && (o.type === 'rect' || o.type === 'circle')) {
      if (typeof o.tableNumber === 'number') {
        maxNum = Math.max(maxNum, o.tableNumber);
      } else if (typeof o.label === 'string') {
        const m = o.label.match(/Bord\s+(\d+)/i);
        if (m) maxNum = Math.max(maxNum, parseInt(m[1], 10) || 0);
      }
    }
  }
  return maxNum + 1;
}
function computeNextTableIdFromObjects(list = []) {
  let maxId = 0;
  for (const o of list) {
    if (o && (o.type === 'rect' || o.type === 'circle')) {
      const tid = (typeof o.tableId === 'number') ? o.tableId : 0;
      maxId = Math.max(maxId, tid);
    }
  }
  return maxId + 1;
}


function forceHideOverlays() {
  const ids = ['modalOverlay', 'guestModalOverlay'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = 'none';
      el.style.pointerEvents = 'none';
      el.setAttribute('aria-hidden', 'true');
    }
  });
}

function initSiteNotice() {
  const notice = document.getElementById('siteNotice');
  const closeBtn = document.getElementById('closeSiteNoticeBtn');

  // 1) Nolla ev. kvarhängande overlay (iOS soft refresh / BFCache)
  forceHideOverlays();

  // 2) Visa rutan om den inte stängts i denna session
  const closed = sessionStorage.getItem('siteNoticeClosed') === '1';
  if (notice) {
    notice.style.display = closed ? 'none' : 'block';
    notice.style.pointerEvents = 'auto';
  }

  // 3) Stängknapp (stoppa bubblor så overlay-klicklyssnare aldrig triggas)
  if (closeBtn) {
    const close = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (notice) notice.style.display = 'none';
      sessionStorage.setItem('siteNoticeClosed', '1');
    };
    closeBtn.onclick = close;
    closeBtn.addEventListener('touchend', close, {passive: false});
  }
}

// Kör vid kall start…
document.addEventListener('DOMContentLoaded', initSiteNotice);

// …och när sidan återställs från cache (iOS Safari/Vivaldi)
window.addEventListener('pageshow', (e) => {
  if (e.persisted) setTimeout(initSiteNotice, 0);
});

// Om du någonstans öppnar ett annat modal med overlay:
function showOverlay() {
  const el = document.getElementById('modalOverlay');
  if (!el) return;
  el.style.display = 'block';
  el.style.pointerEvents = 'auto';
  el.setAttribute('aria-hidden', 'false');
}
function hideOverlay() {
  const el = document.getElementById('modalOverlay');
  if (!el) return;
  el.style.display = 'none';
  el.style.pointerEvents = 'none';
  el.setAttribute('aria-hidden', 'true');
}



function resizeCanvas() {
  const scale = window.devicePixelRatio || 1;

  const extraWidth  = window.innerWidth  < 600 ? window.innerWidth * 2 : window.innerWidth * 0.5;
  const extraHeight = window.innerWidth  < 600 ? window.innerHeight    : window.innerHeight * 0.5;

  const w = window.innerWidth  + extraWidth;
  const h = window.innerHeight + extraHeight;

  // Applicera på BÅDA dukarna
  const pairs = [
    [canvas,     ctx],
    [wallCanvas, wctx],
  ];

  for (const [c, cx] of pairs) {
    c.width  = w * scale;
    c.height = h * scale;
    c.style.width  = w + 'px';
    c.style.height = h + 'px';
    cx.setTransform(scale, 0, 0, scale, 0, 0);
  }

  drawAll();      // rita bord etc på bakgrundsduken
  redrawWalls();  // rita befintliga väggar på wallCanvas

  if (!hasCentered) {
    window.scrollTo((w - window.innerWidth) / 2, 0);
    hasCentered = true;
  }
}


window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && measuring) {
      measuring = false;
      measureStart = null;
      alert("Mätning avbruten.");
    }
  });

function drawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fffdf8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#111";
  ctx.font = "bold 32px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.shadowBlur = 1;

  for (const obj of objects) {
    ctx.lineWidth = obj === selected ? 3 : 1;
    ctx.strokeStyle = "#000";

    if (obj.type === "rect") {
      ctx.save();
      ctx.translate(obj.x + obj.w / 2, obj.y + obj.h / 2);
      ctx.rotate((obj.rotation || 0) * Math.PI / 180);
      ctx.fillStyle = obj.color || "#ead8b6";
      ctx.fillRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
      ctx.strokeRect(-obj.w / 2, -obj.h / 2, obj.w, obj.h);
      ctx.fillStyle = "#000";
      ctx.font = "12px sans-serif";
      ctx.fillText(obj.label || "", 0, 0);   // 🟢 mitt i bordet
      ctx.restore();
    } else if (obj.type === "circle") {
      ctx.beginPath();
      ctx.fillStyle = obj.color || "#ead8b6";
      ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#000";
      ctx.font = "12px sans-serif";
      ctx.fillText(obj.label || "", obj.x, obj.y);  // 🟢 mitt i bordet
    } else if (obj.type === "guest") {
      ctx.beginPath();
      ctx.fillStyle = "#fffffe";
      ctx.arc(obj.x, obj.y, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#d4b98c";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "#000";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(obj.name, obj.x, obj.y + 1);
    }
  }

   ctx.save();
   ctx.globalAlpha = 0.15;
   ctx.fillStyle = "#333";
   ctx.font = "bold 48px 'Segoe UI', sans-serif";
   ctx.textAlign = "right";
   ctx.textBaseline = "bottom";
   
   // Flytta ner till ca 95% av canvasens höjd och bredd
   const x = canvas.width * 0.49;
   const y = canvas.height * 0.50;
   
   //ctx.fillText("EverAfterbyEster", x, y);
   if (showAxes) {
    const meterToPx = 80;
    const viewCenterX = window.scrollX + window.innerWidth / 2;
    const viewCenterY = window.scrollY + window.innerHeight / 2;
  
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 3]);
  
    // Rita x-axeln
    ctx.beginPath();
    ctx.moveTo(0, viewCenterY);
    ctx.lineTo(canvas.width, viewCenterY);
    ctx.stroke();
  
    // Rita y-axeln
    ctx.beginPath();
    ctx.moveTo(viewCenterX, 0);
    ctx.lineTo(viewCenterX, canvas.height);
    ctx.stroke();
  
    ctx.setLineDash([]);
    ctx.fillStyle = "#000";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
  
    // Märkningar längs x-axeln
    for (let x = -10; x <= 20; x++) {
      const px = viewCenterX + x * meterToPx;
      if (px < 0 || px > canvas.width) continue;
      ctx.beginPath();
      ctx.moveTo(px, viewCenterY - 5);
      ctx.lineTo(px, viewCenterY + 5);
      ctx.stroke();
      if (x !== 0) ctx.fillText(`${x} m`, px, viewCenterY + 8);
    }
  
    // Märkningar längs y-axeln
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    for (let y = -10; y <= 10; y++) {
      const py = viewCenterY + y * meterToPx;
      if (py < 0 || py > canvas.height) continue;
      ctx.beginPath();
      ctx.moveTo(viewCenterX - 5, py);
      ctx.lineTo(viewCenterX + 5, py);
      ctx.stroke();
      if (y !== 0) ctx.fillText(`${-y} m`, viewCenterX + 8, py);
    }
    ctx.restore();
  }
   ctx.restore();
}

function onTitleChange() {
  const text = document.getElementById('titleInput').value;
  document.getElementById('titleDisplay').textContent = text;
}

function updateFloatingButtons() {
  const floatingButtons = document.getElementById('floatingButtons');
  const buttons = floatingButtons.querySelectorAll('button');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  const axesBtn = floatingButtons.querySelector('button[onclick="toggleAxes()"]');
  if (axesBtn) axesBtn.disabled = false;
  
  if (!selected) {
    // No selection – disable everything EXCEPT axes + fullscreen
    floatingButtons.classList.add('disabled');
    buttons.forEach(btn => {
      const keep = (btn === axesBtn || btn === fullscreenBtn);
      btn.disabled = !keep;
    });
    return;
  }
  

  floatingButtons.classList.remove('disabled');
  
  // Enable/disable buttons based on selected type
  buttons.forEach(btn => {
    // Låt dessa två ALLTID vara aktiva
    if (btn === axesBtn || btn === fullscreenBtn) {
      btn.disabled = false;
      return;
    }
  
    const action = btn.getAttribute('onclick');
  
    if (selected && selected.type === "guest") {
      btn.disabled = !["removeSelected()", "renameTable()"].includes(action);
    } else if (selected && selected.type === "circle") {
      btn.disabled = (action === "rotateSelected()");
    } else {
      // rect/other eller ingen selection -> slå av övriga
      btn.disabled = !selected; // om inget valt, disable
    }
  });
  
}

// Sum-button
function canSummarize() {
  // Condition: At least 1 table or guest needed to summarize
  return objects.some(o => o.type === 'rect' || o.type === 'circle' || o.type === 'guest');
}

function updateSumButtonState() {
  setSumButtonEnabled(canSummarize());
}
// === AUTO-PLACE GUESTS AROUND A NEW TABLE ===
// === AUTO-PLACE GUESTS AROUND A NEW TABLE ===
function autoAddGuestsForTable(table) {
    const seatCount = table.seats || 0;
    if (!seatCount) return;
  
    if (table.type === "rect") {
      const cx = table.x + table.w / 2;
      const cy = table.y + table.h / 2;
      const halfW = table.w / 2;
      const halfH = table.h / 2;
  
      const perSide = Math.floor(seatCount / 2);
      const yOffset = 46; // luft från bordskant
  
      const ang = (table.rotation || 0) * Math.PI / 180;
      const cos = Math.cos(ang), sin = Math.sin(ang);
  
      // smarta gap (lika stora, men aldrig mindre än minsta tillåtna)
      function gapCenters(n) {
        if (n <= 1) return [0];
        const GUEST_R  = 20;   // matcha radie i drawAll()
        const MIN_GAP  = 8;
        const DIAM     = 2 * GUEST_R;
        const MIN_STEP = DIAM + MIN_GAP;
  
        const naturalStep = (2 * halfW) / (n + 1);
        let step, start;
        if (naturalStep >= MIN_STEP) {
          step  = naturalStep;
          start = -halfW + step;
        } else {
          step  = MIN_STEP;
          const total = step * (n + 1);
          start = -total / 2 + step;
        }
        const xs = [];
        for (let i = 0; i < n; i++) xs.push(start + i * step);
        return xs;
      }
  
      const xs   = gapCenters(perSide);
      const topY = -halfH - yOffset;  // lokalt Y (ovansida)
      const botY =  halfH + yOffset;  // lokalt Y (undersida)
  
      // skapa gäster med lokala coords och beräkna deras startpositioner
      xs.forEach((lx) => {
        // ovansida
        let gx = cx + (lx * cos - topY * sin);
        let gy = cy + (lx * sin + topY * cos);
        objects.push({
          type: "guest", name: "Gäst",
          x: gx, y: gy,
          parentId: table.tableId,
          _localX: lx, _localY: topY
        });
  
        // undersida
        gx = cx + (lx * cos - botY * sin);
        gy = cy + (lx * sin + botY * cos);
        objects.push({
          type: "guest", name: "Gäst",
          x: gx, y: gy,
          parentId: table.tableId,
          _localX: lx, _localY: botY
        });
      });
  
    } else if (table.type === "circle") {
      const cx = table.x, cy = table.y;
      const rSeat = table.r + 48;     // avstånd från bordets centrum
      const start = -Math.PI / 2;
  
      for (let i = 0; i < seatCount; i++) {
        const a  = start + i * (2 * Math.PI / seatCount);
        const lx = rSeat * Math.cos(a);
        const ly = rSeat * Math.sin(a);
        // rotation för cirkel används också (om du någon gång lägger till)
        const ang = (table.rotation || 0) * Math.PI / 180;
        const cos = Math.cos(ang), sin = Math.sin(ang);
        const gx  = cx + (lx * cos - ly * sin);
        const gy  = cy + (lx * sin + ly * cos);
  
        objects.push({
          type: "guest", name: "Gäst",
          x: gx, y: gy,
          parentId: table.tableId,
          _localX: lx, _localY: ly
        });
      }
    }
  }
  



function setSumButtonEnabled(enabled) {
  document.querySelectorAll('.sum-btn').forEach(btn => {
    btn.disabled = !enabled;
    btn.setAttribute('aria-disabled', String(!enabled));
  });
}
// HIT
function updateGuestsForTable(table) {
    const cx = (table.type === "rect") ? table.x + table.w/2 : table.x;
    const cy = (table.type === "rect") ? table.y + table.h/2 : table.y;
    const ang = (table.rotation || 0) * Math.PI / 180;
    const cos = Math.cos(ang), sin = Math.sin(ang);
  
    for (const g of objects) {
      if (g.type !== "guest" || g.parentId !== table.tableId) continue;
      const lx = g._localX, ly = g._localY; // lokala (bord-centrerade) koordinater
      g.x = cx + (lx * cos - ly * sin);
      g.y = cy + (lx * sin + ly * cos);
    }
  }
  

function addSelectedTable() {
  const type = document.getElementById("tableType").value;
  const standardHeight = 75;
  let obj = null;

  switch (type) {
    case "round-6":
      obj = { type: "circle", x: 150, y: 150, r: 60, seats: 6 };
      break;
    case "round-8":
      obj = { type: "circle", x: 150, y: 150, r: 70, seats: 8 };
      break;
    case "rect-4":
      obj = { type: "rect", x: 150, y: 150, w: 100, h: standardHeight, seats: 4, rotation: 0 };
      break;
    case "rect-6":
      obj = { type: "rect", x: 150, y: 150, w: 144, h: standardHeight, seats: 6, rotation: 0 };
      break;
    case "rect-8":
      obj = { type: "rect", x: 150, y: 150, w: 192, h: standardHeight, seats: 8, rotation: 0 };
      break;
  }

  if (obj) {
    obj.tableNumber = nextTableNumber++;
    obj.tableId     = nextTableId++;
    obj.label       = `Bord ${obj.tableNumber} – ${obj.seats} platser`;  // 🟢 nytt
  
    objects.push(obj);
  
    // <-- Lägg till gäster automatiskt för det nya bordet
    autoAddGuestsForTable(obj);
  
    drawAll();
    updateSumButtonState();
  }
  
  onPlanChanged();
}

function addGuest() {
  const promptText = (window.t && typeof t === "function")
    ? t("prompt_guest_name")
    : "Namn på gäst?"; // fallback om t saknas

  const name = window.prompt(promptText) || "";
  if (!name) {
    onPlanChanged();
    return;
  }
  objects.push({ type: "guest", x: 300, y: 300, name });
  drawAll();
  updateSumButtonState();
  onPlanChanged();
}


function removeSelected() {
  if (selected) {
    const index = objects.indexOf(selected);
    if (index > -1) objects.splice(index, 1);
    selected = null;
    drawAll();
    updateFloatingButtons();
    updateSumButtonState();

    // If there are no more tables (rectangles or circles) on the canvas, reset numbering
    const hasAnyTable = objects.some(obj => obj.type === 'rect' || obj.type === 'circle');
    if (!hasAnyTable) {
      nextTableNumber = 1;
    }
  }
  onPlanChanged();
}

function rotateSelected() {
  if (selected && selected.type === "rect") {
    selected.rotation = ((selected.rotation || 0) + 90) % 360;

    updateGuestsForTable(selected);
    drawAll();

  }
  onPlanChanged();
}

function renameTable() {
  if (!selected) return;

  if (selected.type === "guest") {
    const input = prompt("Ange nytt namn för gästen:", selected.name || "");
    if (input !== null) {
      const trimmed = input.trim();
      if (trimmed) {
        selected.name = trimmed;
        drawAll();
      }
    }
    return;
    onPlanChanged();
  }

  if (selected.type === "rect" || selected.type === "circle") {
    const input = prompt("Ange nytt namn för bordet:", selected.label || "");
    if (input !== null) {
      const trimmed = input.trim();
      if (trimmed) {
        selected.label = trimmed;
        drawAll();
      }
    }
  }
}



function saveAsImage() {
  const scale    = window.devicePixelRatio || 1;
  const pxPerM   = 80;
  const pad      = 20;
  const maxPadM  = 50;
  const maxPad   = maxPadM * pxPerM;

  // height reserved for the title area (in CSS-px)
  const titleArea = 40;

  // half-size on mobile
  const isMobile = window.innerWidth <= 600;
  const baseMinW = 15 * pxPerM;
  const baseMinH = 10 * pxPerM;
  const minW     = isMobile ? baseMinW / 2 : baseMinW;
  const minH     = isMobile ? baseMinH / 2 : baseMinH;

  const worldW = canvas.width  / scale;
  const worldH = canvas.height / scale;

  let regionX0, regionY0, regionX1, regionY1;
  const padPx = Math.min(pad, maxPad);

  // 1) Determine our crop region (same logic as before)
  if (objects.length === 0) {
    regionX0 = 0;
    regionY0 = 0;
    regionX1 = Math.min(minW, worldW);
    regionY1 = Math.min(minH, worldH);
  } else {
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;
    for (const obj of objects) {
      if (obj.type === 'circle' || obj.type === 'guest') {
        const r = obj.type === 'guest' ? 20 : obj.r;
        minX = Math.min(minX, obj.x - r);
        minY = Math.min(minY, obj.y - r);
        maxX = Math.max(maxX, obj.x + r);
        maxY = Math.max(maxY, obj.y + r);
      } else {
        const angle = (obj.rotation||0) * Math.PI/180;
        const cx = obj.x + obj.w/2, cy = obj.y + obj.h/2;
        const dx = Math.abs(Math.cos(angle)*obj.w/2)
                 + Math.abs(Math.sin(angle)*obj.h/2);
        const dy = Math.abs(Math.sin(angle)*obj.w/2)
                 + Math.abs(Math.cos(angle)*obj.h/2);
        minX = Math.min(minX, cx - dx);
        minY = Math.min(minY, cy - dy);
        maxX = Math.max(maxX, cx + dx);
        maxY = Math.max(maxY, cy + dy);
      }
    }

    // width
    if (maxX <= minW) {
      regionX0 = 0;
      regionX1 = Math.min(minW, worldW);
    } else {
      regionX0 = Math.max(0, minX - padPx);
      regionX1 = Math.min(worldW, maxX + padPx);
    }
    // height
    if (maxY <= minH) {
      regionY0 = 0;
      regionY1 = Math.min(minH, worldH);
    } else {
      regionY0 = Math.max(0, minY - padPx);
      regionY1 = Math.min(worldH, maxY + padPx);
    }
  }

  // 2) Draw into an offscreen canvas that’s taller by titleArea
  const w = regionX1 - regionX0;
  const h = regionY1 - regionY0;
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width  = w * scale;
  exportCanvas.height = (h + titleArea) * scale;
  const ec = exportCanvas.getContext('2d');

  // Om du vill ha extra skärpa vid nedskalning av tunna linjer:
  // ec.imageSmoothingEnabled = false;

  ec.setTransform(scale, 0, 0, scale, 0, 0);

  // 2a) fill the top stripe with the canvas bg
  ec.fillStyle = '#fffdf8';
  ec.fillRect(0, 0, w, titleArea);

  // 2b) draw the table‐layout region below (BÅDA lager)
  // Baslagret
  ec.drawImage(
    canvas,
    regionX0 * scale, regionY0 * scale,
    w * scale,         h * scale,
    0,                 titleArea,
    w,                 h
  );

  // Vägglagret ovanpå (om det finns)
  const wallCanvas = document.getElementById('wallCanvas');
  if (wallCanvas) {
    ec.drawImage(
      wallCanvas,
      regionX0 * scale, regionY0 * scale,
      w * scale,         h * scale,
      0,                 titleArea,
      w,                 h
    );
  }

  // (Valfritt) Om du har fler lager, t.ex. gridCanvas/labelsCanvas, rita dem här ovanpå på samma sätt.

  // 3) Stamp the title into that top stripe
  ec.save();
  ec.fillStyle    = '#111';
  ec.font         = "bold 24px 'Segoe UI', sans-serif";
  ec.textAlign    = 'center';
  ec.textBaseline = 'middle';
  ec.fillText(
    document.getElementById('titleInput').value,
    w / 2,
    titleArea / 2
  );
  ec.restore();

  // 4) Trigger download
  const link = document.createElement('a');
  link.download = 'bordsplacering.png';
  link.href     = exportCanvas.toDataURL('image/png');
  link.click();
}


function createGuestList() {
  const guests = objects.filter(o => o.type === "guest");
  if (guests.length === 0) {
    alert("Inga gäster tillagda ännu.");
    return;
  }

  const ul = document.getElementById('guestList');
  ul.innerHTML = '';  // töm tidigare lista

  guests.forEach((g, i) => {
    const li = document.createElement('li');
    li.textContent = `${i + 1}. ${g.name}`;
    ul.appendChild(li);
  });

  document.getElementById('guestModalOverlay').style.display = 'block';
  document.getElementById('guestListContainer').style.display = 'block';
}

function closeGuestList() {
  document.getElementById('guestModalOverlay').style.display = 'none';
  document.getElementById('guestListContainer').style.display = 'none';
}

function createChecklist() {
  document.getElementById('modalOverlay').style.display = 'block';
  document.getElementById('checklistContainer').style.display = 'block';
}

function closeChecklist() {
  document.getElementById('modalOverlay').style.display = 'none';
  document.getElementById('checklistContainer').style.display = 'none';
}

function i18nText(key){
  const lang = document.documentElement.getAttribute('lang') || 'sv';
  const dict = { btn_remove: { sv: 'Ta bort', en: 'Remove' } };
  return (dict[key] && dict[key][lang]) || dict[key]?.sv || key;
}

function addChecklistItem() {
  const ul    = document.getElementById('checklist');
  const input = document.getElementById('newChecklistItem');
  const text  = (input.value || '').trim();
  if (!text) return;

  // <li>
  const li = document.createElement('li');

  // <label><input> <span>Text</span></label>
  const label = document.createElement('label');

  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.dataset.id = text.toLowerCase().replace(/\s+/g, '-'); // t.ex. "clothes" -> "clothes"

  const span = document.createElement('span');
  span.textContent = text;

  label.append(cb, ' ', span);

  // <button class="remove-item"><span data-i18n="btn_remove">Remove</span></button>
  const btn = document.createElement('button');
  btn.className = 'remove-item';
  const btnSpan = document.createElement('span');
  btnSpan.setAttribute('data-i18n', 'btn_remove');
  btnSpan.textContent = 'Remove'; // översätts till "Ta bort" när svenskt språk är aktivt
  btn.appendChild(btnSpan);
  btn.addEventListener('click', removeChecklistItem);

  // Montera och rensa fältet
  li.append(label, btn);
  ul.appendChild(li);
  input.value = '';

  // Om du har en funktion som applicerar översättningar, kör den på den nya raden
  if (window.applyTranslations) applyTranslations(li);
  if (window.updateI18n)       updateI18n(li);
}


function removeChecklistItem(event) {
  const li = event.target.closest('li');
  if (li) li.remove();
}

function exportChecklistCSV() {
  const rows = [["id", "item", "done"]];      // header
  const items = document.querySelectorAll("#checklist li");

  items.forEach(li => {
    const cb   = li.querySelector('input[type="checkbox"]');
    const span = li.querySelector('label span');
    const id   = cb?.getAttribute('data-id') || "";
    const text = (span?.textContent || "").trim().replace(/\s+/g, " ");
    const done = cb?.checked ? "true" : "false";
    rows.push([id, text, done]);
  });

  // CSV (med BOM så Excel öppnar ÅÄÖ korrekt)
  const csv = "\uFEFF" + rows
    .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = "checklist.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}


async function downloadChecklist() {
  const container   = document.getElementById('checklistContainer');
  const closeBtn    = document.getElementById('closeChecklistBtn');
  const downloadBtn = document.getElementById('downloadChecklistBtn');
  const controlsDiv = container.querySelector('.controls');
  const removeBtns  = Array.from(container.querySelectorAll('.remove-item'));
  
  // 1) Hide UI chrome
  closeBtn.style.display    = 'none';
  downloadBtn.style.display = 'none';
  controlsDiv.style.display = 'none';
  removeBtns.forEach(btn => btn.style.display = 'none');

  // 2) Temporarily remove height/overflow constraints *and* horizontal clipping
  const oldMaxH      = container.style.maxHeight;
  const oldOverflowY = container.style.overflowY;
  const oldOverflowX = container.style.overflowX;
  container.style.maxHeight = 'none';
  container.style.overflowY = 'visible';
  container.style.overflowX = 'visible';   // ← allow all text to show
  container.scrollTop       = 0;            // scroll to top

  try {
    // 3) Capture full expanded modal
    const c = await html2canvas(container, {
      backgroundColor: '#fff',
      scale: 2
    });

    // 4) Download PNG as before
    const dataURL = c.toDataURL('image/png');
    const a       = document.createElement('a');
    a.href        = dataURL;
    a.download    = 'checklista.png';

    if (typeof a.download === 'undefined') {
      window.open(dataURL, '_blank');
    } else {
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

  } catch (err) {
    console.error('Could not capture checklist:', err);
    alert('Något gick fel vid nedladdningen. Prova igen.');
  } finally {
    // 5) Restore UI & scrolling + clipping
    closeBtn.style.display     = '';
    downloadBtn.style.display  = '';
    controlsDiv.style.display  = '';
    removeBtns.forEach(btn => btn.style.display = '');
    container.style.maxHeight  = oldMaxH;
    container.style.overflowY  = oldOverflowY;
    container.style.overflowX  = oldOverflowX;
  }
}

// --- Nedladdningsfunktion för gästlistan ---
// Ersätt din nuvarande downloadGuestList med denna
async function downloadGuestList() {
  const container   = document.getElementById('guestListContainer');
  const closeBtn    = container.querySelector('.close-modal');
  const downloadBtn = container.querySelector('button[onclick="downloadGuestList()"]');

  // 1) Göm UI-krom
  const oldCloseDisp    = closeBtn?.style.display;
  const oldDownloadDisp = downloadBtn?.style.display;
  if (closeBtn)    closeBtn.style.display = 'none';
  if (downloadBtn) downloadBtn.style.display = 'none';

  // 2) Ta bort begränsningar så hela listan renderas
  const oldMaxH      = container.style.maxHeight;
  const oldOverflowY = container.style.overflowY;
  const oldOverflowX = container.style.overflowX;
  const oldScrollTop = container.scrollTop;
  container.style.maxHeight = 'none';
  container.style.overflowY = 'visible';
  container.style.overflowX = 'visible';
  container.scrollTop = 0;   // scrolla till toppen

  try {
    // 3) Fota modalen
    const c = await html2canvas(container, {
      backgroundColor: '#fff',
      scale: 2,
      useCORS: true
    });

    // 4) Ladda ner PNG
    const url = c.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gastlista.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) {
    console.error('Could not capture guest list:', err);
    alert('Något gick fel vid nedladdningen. Prova igen.');
  } finally {
    // 5) Återställ allt
    if (closeBtn)    closeBtn.style.display    = oldCloseDisp ?? '';
    if (downloadBtn) downloadBtn.style.display = oldDownloadDisp ?? '';
    container.style.maxHeight = oldMaxH;
    container.style.overflowY = oldOverflowY;
    container.style.overflowX = oldOverflowX;
    container.scrollTop = oldScrollTop;
  }
}

// Exportera gästlista som CSV eller Excel (.xls)
function exportGuestList(fmt = 'csv') {
  const guests = objects.filter(o => o.type === 'guest');
  if (guests.length === 0) {
    alert('Inga gäster tillagda ännu.');
    return;
  }

  // Karta: tableId -> visningsnamn (label eller "Bord X")
  const tableMap = new Map();
  for (const o of objects) {
    if (o.type === 'rect' || o.type === 'circle') {
      tableMap.set(o.tableId, o.label || (`Bord ${o.tableNumber || ''}`));
    }
  }

  if (fmt === 'csv') {
    // Semikolon ger snygg import i svensk Excel (decimal = ,)
    const SEP = ';';
    const rows = [];
    rows.push(['Namn', 'Bord'].join(SEP));
    for (const g of guests) {
      const tableName = g.parentId ? (tableMap.get(g.parentId) || '') : '';
      rows.push([g.name || 'Gäst', tableName].map(v => csvCell(v, SEP)).join(SEP));
    }
    const bom = '\uFEFF'; // BOM så Excel fattar UTF-8
    const csv = bom + rows.join('\r\n');
    downloadFile('gastlista.csv', 'text/csv;charset=utf-8', csv);

  

  } else {
    alert('Okänt exportformat: ' + fmt);
  }

  // --- helpers ---
  function csvCell(val, sep) {
    if (val == null) val = '';
    val = String(val);
    const needsQuote = val.includes('"') || val.includes('\n') || val.includes('\r') || val.includes(sep);
    if (val.includes('"')) val = val.replace(/"/g, '""');
    return needsQuote ? `"${val}"` : val;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function downloadFile(filename, mime, data) {
    const blob = new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
}


function toggleAxes() {
  showAxes = !showAxes;
  drawAll();
}

canvas.addEventListener("mousedown", (e) => {
  const mx = e.offsetX, my = e.offsetY;
  selected = null;
  for (let i = objects.length - 1; i >= 0; i--) {
    const obj = objects[i];
    if (obj.type === "rect") {
      const angle = (obj.rotation || 0) * Math.PI / 180;
      const cx = obj.x + obj.w / 2, cy = obj.y + obj.h / 2;
      const dx = mx - cx, dy = my - cy;
      const rx = dx * Math.cos(-angle) - dy * Math.sin(-angle);
      const ry = dx * Math.sin(-angle) + dy * Math.cos(-angle);
      if (rx >= -obj.w / 2 && rx <= obj.w / 2 && ry >= -obj.h / 2 && ry <= obj.h / 2) {
        dragTarget = obj;
        selected = obj;
        offsetX = rx;
        offsetY = ry;
        drawAll();
        updateFloatingButtons();
        return;
      }
    } else if (obj.type === "circle" || obj.type === "guest") {
      const dx = mx - obj.x, dy = my - obj.y;
      const r = obj.type === "guest" ? 20 : obj.r;
      if (dx * dx + dy * dy <= r * r) {
        dragTarget = obj;
        selected = obj;
        offsetX = dx;
        offsetY = dy;
        drawAll();
        updateFloatingButtons();
        return;
      }
    }
  }
  drawAll();
  updateFloatingButtons();
});

canvas.addEventListener("mousemove", (e) => {
  if (!dragTarget) return;
  if (dragTarget.type === "rect") {
    const angle = (dragTarget.rotation || 0) * Math.PI / 180;
    const mx = e.offsetX, my = e.offsetY;
    dragTarget.x = mx - (offsetX * Math.cos(angle) + offsetY * Math.sin(angle)) - dragTarget.w / 2;
    dragTarget.y = my - (-offsetX * Math.sin(angle) + offsetY * Math.cos(angle)) - dragTarget.h / 2;
  } else {
    dragTarget.x = e.offsetX - offsetX;
    dragTarget.y = e.offsetY - offsetY;
  }
  if (dragTarget.type === "rect" || dragTarget.type === "circle") {
    updateGuestsForTable(dragTarget);
  }
  drawAll();
});

canvas.addEventListener("mouseup", () => {
  if (!dragTarget && selected) {
    // Clear selection when clicking empty space
    selected = null;
    drawAll();
    updateFloatingButtons();
  }
  dragTarget = null;
  onPlanChanged();
});

canvas.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const mx = touch.clientX - rect.left;
  const my = touch.clientY - rect.top;

  selected = null;
  for (let i = objects.length - 1; i >= 0; i--) {
    const obj = objects[i];
    if (obj.type === "rect") {
      const angle = (obj.rotation || 0) * Math.PI / 180;
      const cx = obj.x + obj.w / 2, cy = obj.y + obj.h / 2;
      const dx = mx - cx, dy = my - cy;
      const rx = dx * Math.cos(-angle) - dy * Math.sin(-angle);
      const ry = dx * Math.sin(-angle) + dy * Math.cos(-angle);
      if (rx >= -obj.w / 2 && rx <= obj.w / 2 && ry >= -obj.h / 2 && ry <= obj.h / 2) {
        dragTarget = obj;
        selected = obj;
        offsetX = rx;
        offsetY = ry;
        drawAll();
        updateFloatingButtons();
        return;
      }
    } else if (obj.type === "circle" || obj.type === "guest") {
      const dx = mx - obj.x, dy = my - obj.y;
      const r = obj.type === "guest" ? 20 : obj.r;
      if (dx * dx + dy * dy <= r * r) {
        dragTarget = obj;
        selected = obj;
        offsetX = dx;
        offsetY = dy;
        drawAll();
        updateFloatingButtons();
        return;
      }
    }
  }
  drawAll();
  updateFloatingButtons();
}, { passive: true });

canvas.addEventListener("touchmove", (e) => {
    // Logga om vi drar ett objekt eller inte
    const active = !!dragTarget;
    console.log("touchmove, dragging?", active);
  
    // Hämta första touchen
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const mx = touch.clientX - rect.left;
    const my = touch.clientY - rect.top;
  
    // Om inget objekt är aktivt, släpp igenom scroll
    if (!dragTarget) {
      return;  // inga preventDefault → containern scrollar
    }
  
    // Förhindra sid-scroll bara när vi drar ett objekt
    e.preventDefault();
  
    // --- din befintliga drag-logik ---
    if (dragTarget.type === "rect") {
      const angle = (dragTarget.rotation || 0) * Math.PI / 180;
      dragTarget.x = mx - (offsetX * Math.cos(angle) + offsetY * Math.sin(angle)) - dragTarget.w / 2;
      dragTarget.y = my - (-offsetX * Math.sin(angle) + offsetY * Math.cos(angle)) - dragTarget.h / 2;
    } else {
      dragTarget.x = mx - offsetX;
      dragTarget.y = my - offsetY;
    }
    if (dragTarget.type === "rect" || dragTarget.type === "circle") {
      updateGuestsForTable(dragTarget);
    }
  
    drawAll();
  }, { passive: false });

canvas.addEventListener("touchend", () => {
  if (dragTarget) {
    // 👇 autospara bara om dragTarget faktiskt flyttats
    onPlanChanged();
  }
  dragTarget = null;
});

function drawScalebars() {
  const cmToPx = 0.8; // 1 cm = 0.8 px
  const mToPx = cmToPx * 100; // 1 meter = 80 px

  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#000";
  ctx.lineWidth = 1;
  ctx.font = "10px sans-serif";

  // Horisontell skalstock centrerad
  const startX = 200;
  const endX = 1400;
  const baseY = canvas.height - 40;

  ctx.textAlign = "center";
  for (let m = 0; m <= (endX - startX) / mToPx; m++) {
    const x = startX + m * mToPx;
    if (x > endX) break;
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.lineTo(x, baseY + 10);
    ctx.stroke();
    ctx.fillText(m + " m", x, baseY + 22);
  }

  // Vertikal skalstock centrerad
  const startY = 100;
  const endY = 600;
  const baseX = 60;

  ctx.textAlign = "left";
  for (let m = 0; m <= (endY - startY) / mToPx; m++) {
    const y = startY + m * mToPx;
    if (y > endY) break;
    ctx.beginPath();
    ctx.moveTo(baseX - 10, y);
    ctx.lineTo(baseX, y);
    ctx.stroke();
    ctx.fillText(m + " m", baseX + 5, y + 3);
  }
}

// ALLT TILL MARKERING ÄR FÖR TESTA STÄNG KNAPP //

function bindClose() {
  const btn = document.getElementById('closeSiteNoticeBtn');
  if (!btn) return;

  // Remove any old listeners in a single shot
  const clone = btn.cloneNode(true);
  btn.parentNode.replaceChild(clone, btn);

  // Pointer events cover mouse + touch
  clone.addEventListener('pointerup', hideSiteNotice, { passive: false });
}

function hideSiteNotice(e) {
  e.preventDefault();
  const notice = document.getElementById('siteNotice');
  if (notice) notice.style.display = 'none'; // or: notice.hidden = true;
}

// 3. Don’t rebind here anymore
function showSiteNotice() {
  const notice = document.getElementById('siteNotice');
  if (notice) {
    notice.style.display = 'block'; // or: notice.hidden = false;
  }
}

// HIT //

document.addEventListener('DOMContentLoaded', () => {
  const hamBtn   = document.querySelector('.hamburger');
  const toolbar  = document.querySelector('toolbar');
  console.log("Found toolbar:", toolbar);

  bindClose();
  showSiteNotice();

  // open modal
  document
    .getElementById('openChecklistBtn')
    .addEventListener('click', createChecklist);

  // add item
  document
    .getElementById('addChecklistItemBtn')
    .addEventListener('click', addChecklistItem);

  // download
  document
    .getElementById('downloadChecklistBtn')
    .addEventListener('click', downloadChecklist);

  // close modal via “×” button or backdrop
  document
    .getElementById('closeChecklistBtn')
    .addEventListener('click', closeChecklist);
  document
    .getElementById('modalOverlay')
    .addEventListener('click', closeChecklist);

  document.querySelectorAll('#checklist .remove-item')
    .forEach(btn => btn.addEventListener('click', removeChecklistItem));

  // Aktivera sammanställningsknappen (bygg + öppna modal)
// Aktivera sammanställningsknappen (bygg + öppna modal)
document.querySelectorAll('.sum-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();

    // 1) Bygg sammanställningen (bestallning.js)
    if (typeof window.summarizeOrder === 'function') {
      window.summarizeOrder(); // fyller #summaryBox eller #userFormBox
    }

    // 2) Hämta HTML (fallback: userFormBox)
    const summaryBox = document.getElementById('summaryBox');
    const userFormBox = document.getElementById('userFormBox');
    const html =
      (summaryBox && summaryBox.innerHTML.trim()) ? summaryBox.innerHTML :
      (userFormBox && userFormBox.innerHTML.trim()) ? userFormBox.innerHTML :
      '<p>Inget att sammanställa ännu.</p>';

    // 3) Öppna modalen
    if (typeof window.openSummary === 'function') {
      window.openSummary(html);
      return;
    }

    // Fallback om openSummary inte finns
    const modal   = document.getElementById('summaryModal');
    const content = document.getElementById('summaryContent');
    const overlay = document.getElementById('modalOverlay');
    if (!modal || !content || !overlay) return;

    content.innerHTML = html;

    overlay.style.display = 'block';
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const closeBtn = document.getElementById('closeSummary');
    const close = () => {
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    };
    overlay.onclick = close;
    if (closeBtn) closeBtn.onclick = close;
  });
});




  updateSumButtonState();
  updateFloatingButtons();

  if (hamBtn && toolbar) {
    // 1) Toggle open/close on hamburger
    hamBtn.addEventListener('click', () => {
      const isOpen = toolbar.classList.toggle('active');
      hamBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // 2) Close menu after clicking any action button
    toolbar.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        toolbar.classList.remove('active');
        hamBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
});

window.addEventListener('load', () => {
  resizeCanvas();
  updateFloatingButtons();
});

window.addEventListener('orientationchange', () => {
  resizeCanvas();
});

// ÄVEN DENNA ÄR FÖR STÄNGKNAPP-PROBLEM //

window.addEventListener('pageshow', e => {
  if (e.persisted) {
    // Only run when coming from the back/forward cache
    // e.g. ensure the notice is hidden if user closed it
    const dismissed = localStorage.getItem('noticeDismissed') === '1';
    if (!dismissed) showSiteNotice();
  }
});

/***** Steg A: Autospara + Spara/Ladda JSON *****/
const STORAGE_KEY = "weddingPlan-v1";

/** 1) Hämta sparad plan lokalt */
function loadPlanFromLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** 2) Uppdatera visuell statusrad */
function updateSaveStatus(msg) {
  const el = document.getElementById("saveStatus");
  if (!el) return;
  el.textContent = msg || ("✔ Senast sparad " + new Date().toLocaleTimeString());
}

/** 3) Autospara (anropa vid varje förändring i planeringen) */
let __saveTimer;
function onPlanChanged() {
  const plan = getCurrentPlan(); // TODO: returnera din aktuella plan (objekt)
  if (!plan) return;

  clearTimeout(__saveTimer);
  __saveTimer = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    updateSaveStatus();
  }, 800);
}

/** 4) Exportera som .json (används av “Spara som”-knappen) */
function exportPlanJSON() {
  const plan = getCurrentPlan() || loadPlanFromLocal() || {};
  const blob = new Blob([JSON.stringify(plan, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "minplan.json";
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

/** 5) Importera .json (återställ plan) */
function importPlanJSON(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const plan = JSON.parse(String(e.target.result));
      // Spara lokalt (så export funkar direkt)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
      // Återställ i appen:
      restorePlan(plan); // TODO: implementera – bygg upp bord/gäster/checklista från objektet
      updateSaveStatus("✔ Planen har laddats");
      alert("Planen har laddats.");
    } catch {
      alert("Ogiltig fil – kunde inte läsa planen.");
    }
  };
  reader.readAsText(file);
}

/** 6) Init knappar + auto-restore på sidladdning */
window.addEventListener("DOMContentLoaded", () => {
  // Knappar
  const saveBtn = document.getElementById("saveJsonBtn");
  const loadBtn = document.getElementById("loadJsonBtn");
  const loadInput = document.getElementById("loadJsonInput");

  saveBtn && saveBtn.addEventListener("click", exportPlanJSON);
  loadBtn && loadBtn.addEventListener("click", () => loadInput && loadInput.click());
  loadInput && loadInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) importPlanJSON(file);
    // rensa input så man kan ladda samma fil igen
    e.target.value = "";
  });

  // Auto-restore vid start (om något finns sparat lokalt)
  const saved = loadPlanFromLocal();
  if (saved) {
    try {
      restorePlan(saved); // TODO: applicera planen på din canvas/state
      updateSaveStatus("✔ Plan återställd");
    } catch (err) {
      console.warn("Kunde inte återställa plan från localStorage:", err);
    }
  }
});

/** =======================
 *  KOPPLA DITT STATE HÄR
 *  =======================
 *  Implementera dessa två så de stämmer med din app.
 *  - getCurrentPlan(): returnera ETT objekt med allt som behövs.
 *  - restorePlan(plan): bygg upp UI från objektet (töm befintligt, rita upp, etc.).
 */

// EXEMPEL: Skelett – byt till dina riktiga datastrukturer.
function getCurrentPlan() {
  return {
    schemaVersion: 1,
    meta: {
      title: document.getElementById("titleInput")?.value || "",
      nextTableNumber: (typeof nextTableNumber === 'number' ? nextTableNumber : 1),
      nextTableId: (typeof nextTableId === 'number' ? nextTableId : 1)
    },
    tables: objects,
    guests: guests,
    todo: todoItems,
    summary: summary
  };
}


function restorePlan(plan) {
  // Titel
  const titleInput = document.getElementById("titleInput");
  if (titleInput) titleInput.value = plan?.meta?.title || "";

  // Skriv tillbaka dina arrayer/objekt
  objects   = Array.isArray(plan?.tables) ? plan.tables : [];
  guests    = Array.isArray(plan?.guests) ? plan.guests : [];
  todoItems = Array.isArray(plan?.todo)   ? plan.todo   : [];
  summary   = plan?.summary || {};
  // Återställ räknare för bord (med fallback om saknas i äldre filer)
if (typeof plan?.meta?.nextTableNumber === "number") {
  nextTableNumber = plan.meta.nextTableNumber;
} else {
  nextTableNumber = computeNextTableNumberFromObjects(objects);
}
if (typeof plan?.meta?.nextTableId === "number") {
  nextTableId = plan.meta.nextTableId;
} else {
  nextTableId = computeNextTableIdFromObjects(objects);
}


  // Rita om UI/canvas efter restore
  if (typeof drawAll === "function") drawAll();
  if (typeof updateSumButtonState === "function") updateSumButtonState();

  // Synka localStorage så export blir korrekt direkt
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

(function(){
  const openBtn = document.getElementById('openHelpBtn');
  const closeBtn = document.getElementById('closeHelpBtn');
  const modal = document.getElementById('helpModal');
  const overlay = document.getElementById('modalOverlay');

  if (!openBtn || !modal || !overlay) return;

  function openHelp(){
    modal.setAttribute('aria-hidden', 'false');
    overlay.style.display = 'block';
  }
  function closeHelp(){
    modal.setAttribute('aria-hidden', 'true');
    overlay.style.display = 'none';
  }

  openBtn.addEventListener('click', openHelp);
  closeBtn?.addEventListener('click', closeHelp);
  overlay.addEventListener('click', closeHelp);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeHelp(); });
})();
(function(){
  const btn   = document.getElementById('fullscreenBtn');
  const icon  = document.getElementById('fullscreenIcon');
  // Rätta target: canvas-viewport (fallback till .canvas-wrap om du byter tillbaka senare)
  const wrap  = document.querySelector('.canvas-viewport') || document.querySelector('.canvas-wrap');

  if (!btn || !icon || !wrap) return;

  function inFS(){
    return document.fullscreenElement === wrap ||
           document.webkitFullscreenElement === wrap ||
           document.body.classList.contains('is-pseudo-fs');
  }
  function updateUI(){
    if (inFS()){
      icon.textContent = 'fullscreen_exit';
      btn.title = (window.t?.('btn_fullscreen_exit','Avsluta helskärm'));
      btn.setAttribute('aria-label', btn.title);
    } else {
      icon.textContent = 'fullscreen';
      btn.title = (window.t?.('btn_fullscreen_enter','Helskärm'));
      btn.setAttribute('aria-label', btn.title);
    }
  }
  async function enterFS(){
    try{
      if (wrap.requestFullscreen) {
        await wrap.requestFullscreen({ navigationUI: 'hide' });
      } else if (wrap.webkitRequestFullscreen) {
        wrap.webkitRequestFullscreen();
      } else {
        throw new Error('no FS api');
      }
    } catch(e){
      document.documentElement.classList.add('is-pseudo-fs');
      document.body.classList.add('is-pseudo-fs');
    }
    updateUI();
  }
  async function exitFS(){
    try{
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitFullscreenElement && document.webkitExitFullscreen){
        document.webkitExitFullscreen();
      }
    } catch(e){ /* ignore */ }
    document.documentElement.classList.remove('is-pseudo-fs');
    document.body.classList.remove('is-pseudo-fs');
    updateUI();
  }
  btn.addEventListener('click', () => inFS() ? exitFS() : enterFS());
  document.addEventListener('fullscreenchange', updateUI);
  window.addEventListener('app:lang-changed', updateUI);
  updateUI();
})();

// === Sammanställning → modal ===
(function () {
  const btn = document.getElementById('sumButtonMobile');
  const modal = document.getElementById('summaryModal');
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('summaryContent');
  const closeBtn = document.getElementById('closeSummary');
  if (!btn || !modal || !overlay || !content || !closeBtn) return;

  function openSummary(htmlOrNode) {
    content.innerHTML = '';
    if (typeof htmlOrNode === 'string') content.innerHTML = htmlOrNode;
    else if (htmlOrNode instanceof Node) content.appendChild(htmlOrNode);

    overlay.style.display = 'block';
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeSummary() {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');
    modal.style.display = 'none';
    overlay.style.display = 'none';
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    // Livrem: om legacy-boxen finns, göm den också
    const legacyBox = document.getElementById('summaryBox');
    if (legacyBox) legacyBox.style.display = 'none';
  }

  // 1) X och overlay stänger på samma sätt
  overlay.addEventListener('click', closeSummary);
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    closeSummary();
  });

  // 2) Delegera klick inne i sammanställningen (print / csv / avbryt)
 // --- inne i IIFE:t “Sammanställning → modal” ---
function onSummaryClick(e) {
  const t = e.target.closest('button,a');
  if (!t) return;

  const id    = t.id || '';
  const act   = t.dataset.action || ''; // <— NYTT: läs data-action om du sätter det i HTML
  const label = (t.textContent || '').trim().toLowerCase();

  // PRINT
  if (
    id === 'printSheetBtn' ||
    act === 'print' ||
    label === 'skriv ut' ||
    label === 'skriv ut kalkylark' ||
    label === 'print' ||
    label === 'print spreadsheet'
  ) {
    e.preventDefault();
    if (typeof window.printKalkylark === 'function') window.printKalkylark();
    return;
  }

  // DOWNLOAD
  if (
    id === 'downloadSheetBtn' ||
    act === 'download' ||
    label.includes('kalkylark') ||
    label.includes('spreadsheet') ||
    label.startsWith('download')
  ) {
    e.preventDefault();
    if (typeof window.downloadCSV === 'function') window.downloadCSV();
    return;
  }

  // CANCEL  ←— DET HÄR VAR FELET: lägg till 'cancel' (eng.)
  if (
    id === 'cancelSummaryBtn' ||
    act === 'cancel' ||
    label === 'avbryt' ||
    label === 'cancel'
  ) {
    e.preventDefault();
    closeSummary();
    return;
  }
}
content.addEventListener('click', onSummaryClick);


  // 3) Exponera globalt för befintlig logik
  window.openSummary = openSummary;
  window.closeSummary = closeSummary;

  // 4) ESC ska stänga
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeSummary();
  });

  // 5) Öppna via “Sammanställ”-knappen
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const legacyBox = document.getElementById('summaryBox');
    if (legacyBox && legacyBox.innerHTML.trim()) {
      openSummary(legacyBox.innerHTML);
      return;
    }
    // Alternativ: openSummary(buildSummaryHTML());
  });
})();
// --- Väggverktyg ---
const wallCanvas = document.getElementById('wallCanvas');
const wctx = wallCanvas.getContext('2d');
const wallBtn = document.getElementById('wallToolBtn');
// ===== Hjälpmodal "Rita vägg" =====
const WALL_HELP_KEY = 'wallHelp:dontShow';
const wallHelpEl   = document.getElementById('wallHelp');
const wallHelpOk   = document.getElementById('wallHelpOk');
const wallHelpDont = document.getElementById('wallHelpDontShow');

function openWallHelp() {
  if (!wallHelpEl) return;
  wallHelpEl.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeWallHelp() {
  if (!wallHelpEl) return;
  wallHelpEl.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (wallHelpDont?.checked) try { localStorage.setItem(WALL_HELP_KEY, '1'); } catch {}
}
function maybeShowWallHelp() {
  if (!localStorage.getItem(WALL_HELP_KEY)) openWallHelp();
}

// event för att stänga
wallHelpOk?.addEventListener('click', closeWallHelp);
wallHelpEl?.addEventListener('click', e => {
  if (e.target.matches('[data-close], .modal__backdrop, .modal__close')) closeWallHelp();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && wallHelpEl?.getAttribute('aria-hidden') === 'false') closeWallHelp();
});


let wallToolActive = false;
let tempStart = null;              // startpunkt för pågående segment
const walls = [];                  // {a:{x,y}, b:{x,y}}-objekt

function toggleWallTool() {
  wallToolActive = !wallToolActive;
  wallCanvas.classList.toggle('active', wallToolActive);
  wallBtn?.classList.toggle('btn--primary', wallToolActive);
  wallBtn?.setAttribute('aria-pressed', String(wallToolActive));

  if (wallToolActive) {
    // <-- Visa hjälpen när verktyget slås PÅ
    maybeShowWallHelp();
  } else {
    tempStart = null;
    redrawWalls(); // rensar preview
  }
}

wallBtn?.addEventListener('click', toggleWallTool);

// — Koordinater som tar hänsyn till ev. CSS-skalning
function getPosFromEvent(e) {
  if (typeof e.offsetX === 'number') {
    return { x: e.offsetX, y: e.offsetY };   // redan i “CSS-pixlar”
  }
  const rect = wallCanvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}



// — Snappa mot horisontellt/vertikalt om Shift hålls
function snapHV(a, b, shift) {
  if (!shift) return b;
  const dx = Math.abs(b.x - a.x);
  const dy = Math.abs(b.y - a.y);
  return dx >= dy ? { x: b.x, y: a.y } : { x: a.x, y: b.y };
}

function drawSegment(a, b, dashed = false) {
  wctx.save();
  wctx.lineWidth = 5;              // "väggtjocklek" i px – anpassa vid behov
  wctx.lineCap  = 'round';
  if (dashed) wctx.setLineDash([10, 6]);
  wctx.beginPath();
  wctx.moveTo(a.x, a.y);
  wctx.lineTo(b.x, b.y);
  wctx.stroke();
  wctx.restore();
}

function redrawWalls(previewEnd = null) {
  wctx.clearRect(0, 0, wallCanvas.width, wallCanvas.height);
  // Riktiga väggar
  for (const seg of walls) drawSegment(seg.a, seg.b, false);
  // Preview-linje
  if (tempStart && previewEnd) drawSegment(tempStart, previewEnd, true);
}

// Använd Pointer Events så det funkar med mus/penna/pekskärm
wallCanvas.addEventListener('pointerdown', (e) => {
  if (!wallToolActive) return;
  wallCanvas.setPointerCapture(e.pointerId);
  const pos = getPosFromEvent(e);
  if (!tempStart) {
    tempStart = pos;
  } else {
    const end = snapHV(tempStart, pos, e.shiftKey);
    walls.push({ a: tempStart, b: end });
    tempStart = end; // kedja vidare om man klickar igen
    redrawWalls();
  }
});

wallCanvas.addEventListener('pointermove', (e) => {
  if (!wallToolActive || !tempStart) return;
  const end = snapHV(tempStart, getPosFromEvent(e), e.shiftKey);
  redrawWalls(end);
});

document.addEventListener('keydown', (e) => {
  if (!wallToolActive) return;
  if (e.key === 'Escape') {        // avbryt pågående segment
    tempStart = null;
    redrawWalls();
  }
  if (e.key === 'Backspace') {     // ångra senaste vägg
    e.preventDefault();
    walls.pop();
    redrawWalls();
  }
});

// (Frivilligt) Exponera vid behov:
window.__walls = walls;

document.addEventListener('DOMContentLoaded', () => {
  // ===== Off-canvas verktyg =====
  const toggle = document.getElementById('toolsToggle');
  const toolbar = document.getElementById('toolbar');
  const backdrop = document.getElementById('toolsBackdrop');

  function setToolsOpen(open) {
    document.body.classList.toggle('tools-open', open);
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
    if (backdrop) backdrop.hidden = !open;
  }

  toggle?.addEventListener('click', () => {
    setToolsOpen(!document.body.classList.contains('tools-open'));
  });
  backdrop?.addEventListener('click', () => setToolsOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setToolsOpen(false);
  });

  // ===== Stäng menyn efter kommando i #toolbar (mobil) =====
if (toolbar) {
  // Stäng efter knapp/länk/”role=button”-klick i verktygslådan
  toolbar.addEventListener('click', (e) => {
    if (!document.body.classList.contains('tools-open')) return;

    const actionable = e.target.closest(
      'button, a, [role="button"], input[type="submit"]'
    );
    if (!actionable) return;

    // Om du vill *hålla* menyn öppen för något element, ge det data-keep-menu
    if (actionable.closest('[data-keep-menu]')) return;

    // Låt kommandot köra först (öppna modal, trigga filväljare, etc), stäng sen
    setTimeout(() => setToolsOpen(false), 0);
  });

  // (valfritt) Stäng även när man väljer i dropdowns – t.ex. bordstyp
  toolbar.addEventListener('change', (e) => {
    if (!document.body.classList.contains('tools-open')) return;
    const el = e.target;
    if (el.matches('select') && !el.closest('[data-keep-menu]')) {
      setTimeout(() => setToolsOpen(false), 0);
    }
  });
}


  // ===== Kortare titel-placeholder i telefonläge =====
  const titleInput = document.getElementById('titleInput');
  function applyTitlePlaceholder() {
    if (!titleInput) return;
    const isPhone = matchMedia('(max-width:700px)').matches;
    // kort & tydligt i mobil
    if (isPhone) {
      titleInput.placeholder = 'Titel';
      titleInput.maxLength = 36;
      titleInput.setAttribute('autocomplete', 'on');
      titleInput.setAttribute('enterkeyhint', 'done');
    } else {
      titleInput.placeholder = 'Skriv din rubrik här';
      titleInput.removeAttribute('maxLength');
      titleInput.removeAttribute('enterkeyhint');
    }
  }
  applyTitlePlaceholder();
  addEventListener('resize', applyTitlePlaceholder);

  // ===== Auto-göm header vid nedåt-scroll, visa vid uppåt =====
  let lastY = window.scrollY;
  addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > lastY && y > 64) {
      document.body.classList.add('header-hide');
    } else {
      document.body.classList.remove('header-hide');
    }
    lastY = y;
  }, { passive: true });

  
    // ...din befintliga kod...
  
    // ===== Mät appbarens höjd (inkl. margin) så canvas kan fylla resten
    const appbar = document.querySelector('[data-page="ritverktyg"] .appbar');
    function setAppbarHeightVar(){
      if(!appbar) return;
      const cs = getComputedStyle(appbar);
      const h = appbar.offsetHeight
              + parseFloat(cs.marginTop || 0)
              + parseFloat(cs.marginBottom || 0);
      document.documentElement.style.setProperty('--appbar-h', `${Math.round(h)}px`);
    }
    setAppbarHeightVar();
    addEventListener('resize', setAppbarHeightVar);

    // ===== Mallar =====
// ===== Mallar – viewport-box (storlek + scroll) =====
function getViewportBox(){
  const vp = document.querySelector('html[data-page="ritverktyg"] .canvas-viewport');
  if (vp) {
    return {
      el: vp,
      w: vp.clientWidth,
      h: vp.clientHeight,
      left: vp.scrollLeft,
      top: vp.scrollTop,
      scrollW: vp.scrollWidth,
      scrollH: vp.scrollHeight
    };
  }
  // fallback
  return { el: window, w: innerWidth, h: innerHeight, left: 0, top: 0, scrollW: innerWidth, scrollH: innerHeight };
}

// ===== Helper: nollställ plan (frivilligt) =====
function resetPlan(){
  if (!confirm('Denna mall ersätter nuvarande ritning. Fortsätt?')) return false;
  objects = [];
  selected = null;
  nextTableNumber = 1;
  nextTableId = 1;
  return true;
}

// ===== Helper: lägg X bord av given typ och returnera de skapade =====
function addTables(count, tableTypeValue){
  const sel = document.getElementById('tableType');
  const prev = objects.length;
  if (sel) sel.value = tableTypeValue;
  for (let i = 0; i < count; i++) addSelectedTable();

  const isRound = tableTypeValue.startsWith('round');
  const created = objects.slice(prev).filter(o => isRound ? o.type === 'circle' : o.type === 'rect');
  return created;
}

// ===== Helper: flytta bord + uppdatera gäster =====
function placeTable(tbl, x, y){
  tbl.x = x;
  tbl.y = y;
  updateGuestsForTable(tbl);
}

// ===== Centrera grid utifrån scroll + clampa mot 0 =====
function placeInCenteredGrid(tables, {cellW=300, cellH=260, cols, jitter=10, margin=40} = {}){
  const vp = getViewportBox();
  const n = tables.length;

  if (!cols){
    const ratio = vp.w / vp.h;
    cols = Math.max(2, Math.min(n, Math.round(Math.sqrt(n * ratio))));
  }
  const rows  = Math.ceil(n / cols);
  const usedW = cols * cellW;
  const usedH = rows * cellH;

  let startX = vp.left + (vp.w - usedW)/2 + cellW/2;
  let startY = vp.top  + (vp.h - usedH)/2 + cellH/2;

  startX = Math.max(margin + cellW/2, Math.round(startX));
  startY = Math.max(margin + cellH/2, Math.round(startY));

  tables.forEach((t, i) => {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const jx = (Math.random()*2 - 1) * jitter;
    const jy = (Math.random()*2 - 1) * jitter;
    placeTable(t, startX + c*cellW + jx, startY + r*cellH + jy);
  });
}

// ===== Ringplacering tar hänsyn till scroll =====
// ===== Placering: ring (cirkulärt) – med “ingen-krock”-radie =====
// ===== Placering: ring (cirkulärt) – större & lägre i canvas =====
function placeInCircle(
  tables,
  { radius, cx, cy, pad = 60, scale = 1.0, margin = 40, minTop = 160 } = {}
){
  const vp  = getViewportBox();
  const n   = Math.max(1, tables.length);
  const tau = Math.PI * 2;

  // Bordradie (för runda bord)
  let rt = 70;
  if (tables[0]) rt = tables[0].r ?? tables[0].radius ?? 70;

  // Minsta R så att borden inte nuddar: chord = 2R sin(pi/n)
  const RminFromTables = n > 1 ? (rt + pad/2) / Math.sin(Math.PI / n) : 0;

  // Basradie från viewport (lite större än tidigare), skala sen upp om du vill
  const baseR = radius ?? Math.min(vp.w, vp.h) * 0.42;
  const R = Math.max(baseR, RminFromTables) * scale;

  // Starta i mitten av synlig vy (inkl. scroll)
  let centerX = (cx ?? (vp.left + vp.w/2));
  let centerY = (cy ?? (vp.top  + vp.h/2));

  // Skjut ned/åt höger så att ringen inte hamnar för nära kanterna
  const topOfRing  = centerY - (R + rt);
  const leftOfRing = centerX - (R + rt);
  if (topOfRing < minTop)      centerY += (minTop - topOfRing);
  if (leftOfRing < margin)     centerX += (margin - leftOfRing);

  // Placera borden på en perfekt cirkel (ingen per-bord-klamp)
  tables.forEach((t, i) => {
    const a = (i / n) * tau - Math.PI/2;
    const x = centerX + Math.cos(a) * R;
    const y = centerY + Math.sin(a) * R;
    placeTable(t, x, y);
  });
}



// ===== Bankett-rader (kolumner × rader), centrerad =====
function placeInRows(tables, {cols=4, cellW=380, cellH=260} = {}){
  placeInCenteredGrid(tables, {cellW, cellH, cols, jitter: 0});
}

// ===== Honnörsbord + runda runt (returnerar alla skapade) =====
function placeHeadPlusRounds(){
  const tables = [];
  const head = addTables(1, 'rect-8')[0];
  if (head){
    const vp = getViewportBox();
    placeTable(head, vp.left + vp.w/2, vp.top + vp.h*0.22);
    tables.push(head);
  }
  const rounds = addTables(7, 'round-8'); // ~56 platser totalt
  placeInCenteredGrid(rounds, {cellW: 320, cellH: 270, cols: 3, jitter: 6});
  tables.push(...rounds);
  return tables;
}

// ===== Namnge nya gäster sekventiellt =====
function renameNewGuests(fromIndex, totalGuests){
  const guests = objects.filter(o => o.type === 'guest').slice(fromIndex);
  guests.forEach((g, i) => (g.name = `Gäst ${i+1}`));
  if (typeof totalGuests === 'number' && guests.length > totalGuests){
    // guests.slice(totalGuests).forEach(g => g._hidden = true);
  }
}

// ===== Scrolla viewport till layoutens mitt =====
function scrollToLayout(tables, pad = 60){
  const vp = getViewportBox();
  if (!vp.el || !tables || !tables.length) return;

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const t of tables){
    if (t.type === 'rect'){
      const w = t.w || t.width  || 260;
      const h = t.h || t.height || 140;
      minX = Math.min(minX, t.x - w/2);
      maxX = Math.max(maxX, t.x + w/2);
      minY = Math.min(minY, t.y - h/2);
      maxY = Math.max(maxY, t.y + h/2);
    } else if (t.type === 'circle'){
      const r = t.r || t.radius || 70;
      minX = Math.min(minX, t.x - r);
      maxX = Math.max(maxX, t.x + r);
      minY = Math.min(minY, t.y - r);
      maxY = Math.max(maxY, t.y + r);
    }
  }
  if (!isFinite(minX)) return;

  const cx = (minX + maxX)/2;
  const cy = (minY + maxY)/2;

  let left = Math.max(0, Math.round(cx - vp.w/2));
  let top  = Math.max(0, Math.round(cy - vp.h/2));

  left = Math.max(0, left - pad);
  top  = Math.max(0, top  - pad);

  left = Math.min(left, Math.max(0, vp.scrollW - vp.w));
  top  = Math.min(top,  Math.max(0, vp.scrollH - vp.h));

  if (vp.el.scrollTo) vp.el.scrollTo({left, top, behavior: 'smooth'});
}

// ===== Kör valda mallar =====
const templateSelect = document.getElementById('templateSelect');
templateSelect?.addEventListener('change', (e) => {
  const v = e.target.value;
  if (!v) return;

  const startGuestIdx = objects.filter(o => o.type === 'guest').length;

  if (!resetPlan()) { e.target.value = ''; return; }

  let created = [];

  if (v === 'round50'){
    created = addTables(Math.ceil(50/8), 'round-8');        // 7 bord
    placeInCenteredGrid(created, {cellW: 320, cellH: 270, jitter: 8});
    renameNewGuests(startGuestIdx, 50);
  }

  if (v === 'round100'){
    created = addTables(Math.ceil(100/8), 'round-8');       // 13 bord
    placeInCenteredGrid(created, {cellW: 320, cellH: 270, jitter: 6});
    renameNewGuests(startGuestIdx, 100);
  }

  if (v === 'round64circle'){
    const tables = addTables(8, 'round-8');
    placeInCircle(tables, { pad: 120, scale: 1.1, minTop: 220 }); // ↓ lite lägre
    renameNewGuests(startGuestIdx, 64);
    scrollToLayout(tables);
  }
  
  

  if (v === 'banquet96'){
    created = addTables(12, 'rect-8');                      // 12×8 = 96
    placeInRows(created, {cols: 4, cellW: 420, cellH: 260});
    renameNewGuests(startGuestIdx, 96);
  }

  if (v === 'headPlusRounds56'){
    created = placeHeadPlusRounds();                        // 1 rekt + 7 runda
    renameNewGuests(startGuestIdx, 56);
  }

  drawAll();
  updateSumButtonState?.();
  onPlanChanged?.();

  scrollToLayout(created);   // <-- centrera vyn kring layouten

  e.target.value = ''; // så man kan välja samma mall igen
});

  });
  

