// bestallning.js
function summarizeOrder() {
  // Count guests for chair covers
  const adjustableOverdrag = objects.filter(o => o.type === "guest").length;
  const servetterPack = Math.ceil(adjustableOverdrag / 50) || 0;

  // Map tables to cloth sizes
  let litenDuk = 0, mellanDuk = 0, storDuk = 0, runtMellanDuk = 0, runtStorDuk = 0;

  objects.forEach(o => {
    if (o.type === "rect") {
      switch (o.seats) {
        case 4: litenDuk++; break;
        case 6: mellanDuk++; break;
        case 8: storDuk++; break;
      }
    } else if (o.type === "circle") {
      if (o.seats >= 8) runtStorDuk++; else runtMellanDuk++;
    }
  });

  const summaryBox = document.getElementById("summaryBox");
  summaryBox.innerHTML = `
    <p><strong><span data-i18n="sum_heading">Sammanställning</span>:</strong></p>

    <div class="quantity-control">
  <label><span data-i18n="item_chair_cover">Stolsöverdrag</span>:</label>

  <!-- Bilden på stolsöverdrag -->
  <div class="item-image">
    <img src="stolsoverdrag.jpeg" alt="Stolsöverdrag" style="width:60px; height:auto; margin:4px 0;">
  </div>

  <div>
    <button onclick="updateOverdrag(-1)">–</button>
    <span id="overdragCount">${adjustableOverdrag}</span>
    <button onclick="updateOverdrag(1)">+</button>
  </div>
</div>


    <div class="quantity-control">
  <label><span data-i18n="item_chair_bow">Stolsrosetter</span>:</label>
  <!-- Bilden på stolsrosett -->
  <div class="item-image">
    <img src="stolsrosett.jpeg" alt="Stolsrosett" style="width:60px; height:auto; margin:4px 0;">
  </div>
  <div>
    <button onclick="updateRosett(-1)">–</button>
    <span id="rosettCount">${adjustableOverdrag}</span>
    <button onclick="updateRosett(1)">+</button>
  </div>

  <!-- Rullista för färgval -->
  <div class="color-select">
    <label for="rosettColor">Färg:</label>
    <select id="rosettColor" name="rosettColor">
      <option value="vit">Vit</option>
      <option value="röd">Röd</option>
      <option value="blå">Blå</option>
      <option value="lila">Lila</option>
      <option value="grön">Grön</option>
    </select>
  </div>
</div>

<div class="quantity-control">
  <label><span data-i18n="item_name_tags">Namnskyltar</span>:</label>

  <div class="item-image">
    <img src="namnskylt.jpeg" alt="Namnskylt" style="width:60px; height:auto; margin:4px 0;">
  </div>

  <div>
    <button onclick="updateNamnskylt(-1)">–</button>
    <span id="namnskyltCount">${adjustableOverdrag}</span>
    <button onclick="updateNamnskylt(1)">+</button>
  </div>
</div>


    <!-- NEW: Servetter (50-pack) -->
    <div class="quantity-control">
      <label><span data-i18n="item_napkins_pack">Servetter (50-pack)</span>:</label>

      <div class="item-image">
        <img src="servetter.jpeg" alt="Servetter" style="width:60px; height:auto; margin:4px 0;">
      </div>

      <div>
        <button onclick="updateServetter(-1)">–</button>
        <span id="servetterCount">${servetterPack}</span>
        <button onclick="updateServetter(1)">+</button>
      </div>

      <!-- Val för servettfärg/typ -->
      <div class="color-select">
        <label for="servettColor">Färg:</label>
        <select id="servettColor" name="servettColor">
          <option value="vit">Vit</option>
          <option value="ivory">Ivory</option>
          <option value="svart">Svart</option>
          <option value="röd">Röd</option>
          <option value="blå">Blå</option>
          <option value="grön">Grön</option>
          <option value="lila">Lila</option>
          <option value="mönstrad">Mönstrad</option>
        </select>
      </div>

      <small><span data-i18n="note_pack_50">1 pack räcker till upp till 50 gäster</span></small>
    </div>



    <div class="quantity-control">
      <label><span data-i18n="cloth_small">Liten duk</span>:</label>
      <div class="item-image">
    <img src="duk.jpeg" alt="duk" style="width:60px; height:auto; margin:4px 0;">
  </div>
      <div>
        <button onclick="updateDuk('liten', -1)">–</button>
        <span id="litenDukCount">${litenDuk}</span>
        <button onclick="updateDuk('liten', 1)">+</button>
      </div>
      <small><span data-i18n="dims_small_rect">Dukens dimensioner 180 × 140 cm</span></small>
    </div>

    <div class="quantity-control">
      <label><span data-i18n="cloth_medium">Mellanduk</span>:</label>
      <div class="item-image">
    <img src="duk.jpeg" alt="duk" style="width:60px; height:auto; margin:4px 0;">
  </div>
      <div>
        <button onclick="updateDuk('mellan', -1)">–</button>
        <span id="mellanDukCount">${mellanDuk}</span>
        <button onclick="updateDuk('mellan', 1)">+</button>
      </div>
      <small><span data-i18n="dims_medium_rect">Dukens dimensioner 240 × 150 cm</span></small>
    </div>

    <div class="quantity-control">
      <label><span data-i18n="cloth_large">Stor duk</span>:</label>
      <div class="item-image">
    <img src="duk.jpeg" alt="duk" style="width:60px; height:auto; margin:4px 0;">
  </div>
      <div>
        <button onclick="updateDuk('stor', -1)">–</button>
        <span id="storDukCount">${storDuk}</span>
        <button onclick="updateDuk('stor', 1)">+</button>
      </div>
      <small><span data-i18n="dims_large_rect">Dukens dimensioner 300 × 150 cm</span></small>
    </div>

    <div class="quantity-control">
      <label><span data-i18n="cloth_round_medium">Runt bord mellanduk</span>:</label>
      <div class="item-image">
    <img src="duk.jpeg" alt="duk" style="width:60px; height:auto; margin:4px 0;">
  </div>
      <div>
        <button onclick="updateDuk('runtMellan', -1)">–</button>
        <span id="runtMellanDukCount">${runtMellanDuk}</span>
        <button onclick="updateDuk('runtMellan', 1)">+</button>
      </div>
      <small><span data-i18n="dims_round_medium">Dukens dimensioner 195 cm rund</span></small>
    </div>

    <div class="quantity-control">
      <label><span data-i18n="cloth_round_large">Runt bord stor duk</span>:</label>
      <div class="item-image">
    <img src="duk.jpeg" alt="duk" style="width:60px; height:auto; margin:4px 0;">
  </div>
      <div>
        <button onclick="updateDuk('runtStor', -1)">–</button>
        <span id="runtStorDukCount">${runtStorDuk}</span>
        <button onclick="updateDuk('runtStor', 1)">+</button>
      </div>
      <small><span data-i18n="dims_round_large">Dukens dimensioner 210–220 cm rund</span></small>
    </div>

    <div class="quantity-control">
  <label><span data-i18n="lights_big">Ljusslinga stor</span>:</label>

  <!-- Bilden på stolsöverdrag -->
  <div class="item-image">
    <img src="ljusslingastor.jpeg" alt="ljusslingastor" style="width:60px; height:auto; margin:4px 0;">
  </div>
  <div>
    <button onclick="updateLjusslinga30(-1)">–</button>
    <span id="ljusslinga30Count">0</span>
    <button onclick="updateLjusslinga30(1)">+</button>
  </div>
</div>

<div class="quantity-control">
  <label><span data-i18n="lights_small">Ljusslinga liten</span>:</label>
<!-- Bilden på stolsöverdrag -->
  <div class="item-image">
    <img src="ljusslingaliten.jpeg" alt="ljusslingaliten" style="width:60px; height:auto; margin:4px 0;">
  </div>
  <div>
    <button onclick="updateLjusslingaliten(-1)">–</button>
    <span id="ljusslingalitenCount">0</span>
    <button onclick="updateLjusslingaliten(1)">+</button>
  </div>
</div>

<div class="quantity-control">
  <label><span data-i18n="paper_lantern">Rislampa</span>:</label>
<!-- Bilden på stolsöverdrag -->
  <div class="item-image">
    <img src="rislampa.jpeg" alt="rislampa" style="width:60px; height:auto; margin:4px 0;">
  </div>
  <div>
    <button onclick="updaterislampa(-1)">–</button>
    <span id="rislampaCount">0</span>
    <button onclick="updaterislampa(1)">+</button>
  </div>
</div>

<div class="quantity-control">
  <label><span data-i18n="drapery_fabric">Draperingstyg</span>:</label>
<!-- Bilden på stolsöverdrag -->
  <div class="item-image">
    <img src="draperingstyg.jpeg" alt="draperingstyg" style="width:60px; height:auto; margin:4px 0;">
  </div>
  <div>
    <button onclick="updatedraperingstyg(-1)">–</button>
    <span id="draperingstygCount">0</span>
    <button onclick="updatedraperingstyg(1)">+</button>
  </div>
  <small><span data-i18n="dims_drapery">Dimensioner 75 cm x 800 cm</span></small>
</div>


    <button type="button" id="printSheetBtn" class="primary">Skriv ut</button>
  <button type="button" id="downloadSheetBtn">Hämta kalkylark</button>
  <button type="button" onclick="document.getElementById('summaryBox').style.display='none'">Avbryt</button>
  `;
  if (typeof applyLang === "function") { try { applyLang(document.documentElement.lang || "sv"); } catch(e){} }

  summaryBox.style.display = "block";

  // koppla utskriftsknappen
  document.getElementById('printSheetBtn')?.addEventListener('click', printKalkylark);
document.getElementById('downloadSheetBtn')?.addEventListener('click', downloadCSV);

}

function getSummaryDataFromDOM() {
  const box = document.getElementById('summaryBox');
  const rows = [];
  if (!box) return rows;

  box.querySelectorAll('.quantity-control').forEach(q => {
    const name = (q.querySelector('label')?.textContent || 'Post')
      .replace(/:\s*$/, '').trim();

    // hitta antal
    const rawCount =
      q.querySelector('[data-qty]')?.textContent ??
      q.querySelector('[id$="Count"]')?.textContent ??
      q.querySelector('span')?.textContent ?? '0';
    const count = parseInt(String(rawCount).trim(), 10) || 0;

    // hitta mått (texten i <small>), rensa bort prefixet
    let dims = q.querySelector('small')?.textContent?.trim() || '';
    dims = dims.replace(/^Dukens dimensioner\s*/i, '').replace(/\s{2,}/g, ' ');

    // Om raden är stolsöverdrag och du vill visa vald kvalitet i stället för mått:
    if (/stolsöverdrag/i.test(name) && !dims) {
      dims = 'Stolsöverdrag'; // eller lämna '—'
    }

    rows.push({ name, count, dims: dims || '—' });
  });

  return rows;
}

function printKalkylark() {
  // ta bara med rader där count > 0
  let rows = getSummaryDataFromDOM()
    .filter(r => (parseInt(r.count, 10) || 0) > 0);

  if (rows.length === 0) {
    alert('Inget att skriva ut – alla rader har 0.');
    return;
  }
  
  const title = document.getElementById('titleInput')?.value?.trim() || 'Bordsplan';
  const now = new Date().toLocaleString('sv-SE');

  const esc = s => String(s).replace(/[&<>"']/g, m => (
    { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]
  ));

  const html = `
<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<title>Kalkylark – ${esc(title)}</title>
<style>
  body{font-family: Georgia, serif; margin:24px;}
  h1{font-size:20px; margin:0 0 12px;}
  .meta{margin:0 0 16px; color:#555;}
  table{border-collapse:collapse; width:100%;}
  th,td{border:1px solid #999; padding:8px; text-align:left; vertical-align:top;}
  th{background:#f2e9dc;}
  td:nth-child(2){text-align:right; width:90px;}
  @media print { @page { margin: 16mm; } body { margin: 0; } }
</style>
</head>
<body>
  <h1>Kalkylark</h1>
  <p class="meta"><strong>Rubrik:</strong> ${esc(title)}<br><strong>Skapat:</strong> ${esc(now)}</p>
  <table>
    <thead><tr><th>Artikel</th><th>Antal</th><th>Mått</th></tr></thead>
    <tbody>
      ${rows.map(r => `<tr><td>${esc(r.name)}</td><td>${r.count}</td><td>${esc(r.dims)}</td></tr>`).join('')}
    </tbody>
  </table>
  <script>
    window.addEventListener('load', function(){
      window.print();
      setTimeout(function(){ window.close(); }, 100);
    });
  </script>
</body>
</html>`;

  const w = window.open('', '_blank');
  if (!w) {
    alert('Popup blockerar fönstret. Tillåt popupfönster för denna sida och försök igen.');
    return;
  }
  w.document.open(); w.document.write(html); w.document.close();
}

document.addEventListener('click', (e) => {
  if (e.target?.id === 'printSheetBtn' && (e.altKey || e.metaKey)) {
    e.preventDefault();
    downloadCSV();
  }
});

function downloadCSV() {
  // ta bara med rader där count > 0
  let rows = getSummaryDataFromDOM()
    .filter(r => (parseInt(r.count, 10) || 0) > 0);

  if (rows.length === 0) {
    alert('Inget att hämta – alla rader har 0.');
    return;
  }

  const sep = ';';
  const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const header = ['Artikel','Antal','Mått','Kommentar'].map(esc).join(sep);

  const body = rows.map(r => {
    let kommentar = '';
    if (/stolsrosetter/i.test(r.name)) {
      const färg = document.getElementById('rosettColor')?.value || '';
      if (färg) kommentar = `Färg: ${färg}`;
    } else if (/servetter/i.test(r.name)) {
      const färg = document.getElementById('servettColor')?.value || '';
      if (färg) kommentar = `Färg/typ: ${färg}`;
    }

    return [esc(r.name), esc(r.count), esc(r.dims), esc(kommentar)].join(sep);
  }).join('\r\n');
  
  const csv = '\uFEFF' + header + '\r\n' + body;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'kalkylark.csv';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
}

function updateOverdrag(delta) {
  const span = document.getElementById("overdragCount");
  if (!span) return;
  let count = parseInt(span.textContent, 10);
  count = Math.max(0, count + delta);
  span.textContent = count;
}

function updateDuk(type, delta) {
  const idMap = {
    liten: "litenDukCount",
    mellan: "mellanDukCount",
    stor: "storDukCount",
    runtMellan: "runtMellanDukCount",
    runtStor: "runtStorDukCount"
  };

  const spanId = idMap[type];
  if (!spanId) return;

  const span = document.getElementById(spanId);
  if (!span) return;

  let count = parseInt(span.textContent, 10);
  count = Math.max(0, count + delta);
  span.textContent = count;
}
  
function updateRosett(delta) {
  const span = document.getElementById("rosettCount");
  if (!span) return;
  let count = parseInt(span.textContent, 10);
  count = Math.max(0, count + delta);
  span.textContent = count;
}

function updateLjusslinga30(delta) {
  const span = document.getElementById("ljusslinga30Count");
  if (!span) return;
  let count = parseInt(span.textContent, 10);
  count = Math.max(0, count + delta);
  span.textContent = count;
}
function updateLjusslingaliten(delta) {
  const span = document.getElementById("ljusslingalitenCount");
  if (!span) return;
  let count = parseInt(span.textContent, 10);
  count = Math.max(0, count + delta);
  span.textContent = count;
}

function updaterislampa(delta) {
  const span = document.getElementById("rislampaCount");
  if (!span) return;
  let count = parseInt(span.textContent, 10);
  count = Math.max(0, count + delta);
  span.textContent = count;
}

function updatedraperingstyg(delta) {
  const span = document.getElementById("draperingstygCount");
  if (!span) return;
  let count = parseInt(span.textContent, 10);
  count = Math.max(0, count + delta);
  span.textContent = count;
}
function updateServetter(delta) {
  const span = document.getElementById("servetterCount");
  if (!span) return;
  let count = parseInt(span.textContent, 10) || 0;
  count = Math.max(0, count + delta);
  span.textContent = count;
}

function updateNamnskylt(delta) {
  const span = document.getElementById("namnskyltCount");
  if (!span) return;
  let count = parseInt(span.textContent, 10) || 0;
  count = Math.max(0, count + delta);
  span.textContent = count;
}
