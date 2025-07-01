// bestallning.js

function summarizeOrder() {
    adjustableOverdrag = objects.filter(o => o.type === "guest").length;
  
    const summaryBox = document.getElementById("summaryBox");
    summaryBox.innerHTML = `
      <p><strong>Beställning:</strong></p>
  
      <div class="quantity-control">
        <label>Stolsöverdrag:</label>
        <div>
          <button onclick="updateOverdrag(-1)">–</button>
          <span id="overdragCount">${adjustableOverdrag}</span>
          <button onclick="updateOverdrag(1)">+</button>
        </div>
      </div>
  
      ${renderDisabledDuk("Liten duk", "litenDukCount", "180 × 140 cm")}
      ${renderDisabledDuk("Mellanduk", "mellanDukCount", "240 × 150 cm")}
      ${renderDisabledDuk("Stor duk", "storDukCount", "300 × 150 cm")}
      ${renderDisabledDuk("Runt bord mellanduk", "runtMellanDukCount", "195 cm rund")}
      ${renderDisabledDuk("Runt bord stor duk", "runtStorDukCount", "210–220 cm rund")}
  
  
      <button onclick="showAddonsForm()">Gå vidare</button>
      <button onclick="document.getElementById('summaryBox').style.display='none'">Avbryt</button>
  
      <small>*Stolsöverdrag kontrolleras av vårt kvalitetsteam men kan ha mindre lagningar på ej synliga ställen. Exempelvis på trampdynan</small>
    `;
  
    summaryBox.style.display = "block";

  }
  function renderDisabledDuk(label, spanId, size) {
    return `
      <div class="quantity-control" style="opacity: 0.5;">
        <label>${label} (Ej tillgänglig)</label>
        <div>
          <button disabled>–</button>
          <span id="${spanId}">0</span>
          <button disabled>+</button>
        </div>
        <small>Dukens dimensioner ${size}</small>
      </div>
    `;
  }
  
  
    const summaryBox = document.getElementById("summaryBox");
    summaryBox.innerHTML = `
      <p><strong>Beställning:</strong></p>
      <div class="quantity-control">
        <label>Stolsöverdrag:</label>
        <div>
          <button onclick="updateOverdrag(-1)">–</button>
          <span id="overdragCount">${adjustableOverdrag}</span>
          <button onclick="updateOverdrag(1)">+</button>
        </div>
      </div>
      <div class="quantity-control">
        <label>Liten duk:</label>
        <div>
          <button onclick="updateDuk('liten', -1)">–</button>
          <span id="litenDukCount">${litenDuk}</span>
          <button onclick="updateDuk('liten', 1)">+</button>
        </div>
        <small>Dukens dimensioner 180 × 140 cm</small>
      </div>
      <div class="quantity-control">
        <label>Mellanduk:</label>
        <div>
          <button onclick="updateDuk('mellan', -1)">–</button>
          <span id="mellanDukCount">${mellanDuk}</span>
          <button onclick="updateDuk('mellan', 1)">+</button>
        </div>
        <small>Dukens dimensioner 240 × 150 cm</small>
      </div>
      <div class="quantity-control">
        <label>Stor duk:</label>
        <div>
          <button onclick="updateDuk('stor', -1)">–</button>
          <span id="storDukCount">${storDuk}</span>
          <button onclick="updateDuk('stor', 1)">+</button>
        </div>
        <small>Dukens dimensioner 300 × 150 cm</small>
      </div>
      <div class="quantity-control">
        <label>Runt bord mellanduk:</label>
        <div>
          <button onclick="updateDuk('runtMellan', -1)">–</button>
          <span id="runtMellanDukCount">${runtMellanDuk}</span>
          <button onclick="updateDuk('runtMellan', 1)">+</button>
        </div>
        <small>Dukens dimensioner 195 cm rund</small>
      </div>
      <div class="quantity-control">
        <label>Runt bord stor duk:</label>
        <div>
          <button onclick="updateDuk('runtStor', -1)">–</button>
          <span id="runtStorDukCount">${runtStorDuk}</span>
          <button onclick="updateDuk('runtStor', 1)">+</button>
        </div>
        <small>Dukens dimensioner 210–220 cm rund</small>
      </div>
  
      <select>
        <option>Stolsöverdrag i toppkvalitet (nya)</option>
        <option>Stolsöverdrag standard*</option>
      </select>
  
      <button onclick="showAddonsForm()">Gå vidare</button>
      <button onclick="document.getElementById('summaryBox').style.display='none'">Avbryt</button>
  
      <small>*Stolsöverdrag kontrolleras av vårt kvalitetsteam men kan ha mindre lagningar på ej synliga ställen. Exempelvis på trampdynan</small>
    `;
  
    summaryBox.style.display = "block";
  
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
  