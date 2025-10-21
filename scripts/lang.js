// lang.js

const DICT = {
    sv: {
      sum_heading: "Sammanställning",
      item_chair_cover: "Stolsöverdrag",
      item_chair_bow: "Stolsrosetter",
      item_name_tags: "Namnskyltar",
      item_napkins_pack: "Servetter (50-pack)",
      cloth_small: "Liten duk",
      cloth_medium: "Mellanduk",
      cloth_large: "Stor duk",
      cloth_round_medium: "Runt bord mellanduk",
      cloth_round_large: "Runt bord stor duk",
      lights_big: "Ljusslinga stor",
      lights_small: "Ljusslinga liten",
      paper_lantern: "Rislampa",
      drapery_fabric: "Draperingstyg",
      note_pack_50: "1 pack räcker till upp till 50 gäster",
      dims_small_rect: "Dukens dimensioner 180 × 140 cm",
      dims_medium_rect: "Dukens dimensioner 240 × 150 cm",
      dims_large_rect: "Dukens dimensioner 300 × 150 cm",
      dims_round_medium: "Dukens dimensioner 195 cm rund",
      dims_round_large: "Dukens dimensioner 210–220 cm rund",
      dims_drapery: "Dimensioner 75 cm x 800 cm",
      nav_home: "Hem",
      nav_tool: "Ritverktyg",
      nav_gallery: "Galleri",
      nav_contact: "Kontakt",
      intro_heading: "Kom igång med planeringen",
      intro_start: "Starta ritverktyget",
  
      title_placeholder: "Skriv din rubrik här",
  
      opt_round6: "Runt bord – 6 platser",
      opt_round8: "Runt bord – 8 platser",
      opt_rect4:  "Rektangulärt bord – 4 platser",
      opt_rect6:  "Rektangulärt bord – 6 platser",
      opt_rect8:  "Rektangulärt bord – 8 platser",
  
      btn_add_table: "Lägg till bord",
      btn_add_guest: "Lägg till gäst",
      btn_save_As_Image: "Spara bild",
      btn_create_GuestList: "Skapa gästlista",
      btn_open_Checklist: "Skapa checklista",
  
      btn_save_json:   "Spara som (.json)",
      title_save_json: "Spara som JSON",
      btn_load_json:   "Ladda upp (.json)",
      title_load_json: "Ladda upp JSON",
  
      btn_calculate_totals:  "Sammanställ",
      title_calculate_totals:"Visa sammanställning",

      table_label: "Bord",
      guest: "Gäst",
      prompt_guest_name: "Namn på gäst?" ,

      guestlist_title: "Gästlista",
      btn_export_sheet: "Exportera kalkylblad",       // eller "Exportera CSV" om det faktiskt blir .csv
      title_export_sheet: "Exportera till kalkylblad",
      btn_close: "Stäng",
      guestlist_title: "Gästlista",
      checklist_title: "Checklista",
  btn_remove: "Ta bort",
  check_lokal: "Lokal",
  check_invitations: "Inbjudningar",
  check_catering: "Catering",
  check_decorations: "Dekorationer",
  check_music: "Musik",
  check_photographer: "Fotograf",
  check_transport: "Transport",
  check_accommodation: "Boende",
  check_entertainment: "Underhållning",
  check_food_drink: "Mat & Dryck",
  check_attire_beauty: "Klädsel & Skönhet",
  check_budget: "Budget",

  check_item_placeholder: "Ny punkt",
  btn_add_item: "Lägg till",
  btn_download: "Ladda ner",
  title_download: "Ladda ner checklistan",

  summary_title: "Sammanställning",
summary_totals: "Totalt",
summary_tables_one: "bord",
summary_tables_other: "bord",
summary_guests_one: "gäst",
summary_guests_other: "gäster",

// sektioner (exempel)
summary_section_linens: "Textil",
summary_section_measure: "Mått",
summary_section_other: "Övrigt",

// artiklar (exempel – lägg till/ta bort efter vad du visar)
item_tablecloth_one: "duk",
item_tablecloth_other: "dukar",
item_chair_cover_one: "stolsöverdrag",
item_chair_cover_other: "stolsöverdrag",   // samma i plural funkar
item_runner_one: "löpare",
item_runner_other: "löpare",
item_napkin_one: "servett",
item_napkin_other: "servetter",

// enheter
unit_meter_short: "m",
unit_cm_short: "cm",

// knappar
btn_close: "Stäng",
intro_lead: "Skapa layouter, prova idéer och spara dina versioner.",
intro_examples: "Se exempel",

home_feat_fast: "Snabbt och enkelt",
home_feat_fast_desc: "Dra-och-släpp, smarta mått och snygg export.",
home_feat_share: "Delbart",
home_feat_share_desc: "Dela med kollegor eller kunder med en länk.",
home_feat_templates: "Färdiga mallar",
home_feat_templates_desc: "Kom igång på några sekunder.",
print: "Skriv ut",
download_sheet: "Hämta kalkylark",
cancel: "Avbryt",
btn_open_help: "Öppna hjälp",
btn_howto: "Hur gör man?",
btn_draw_wall: "Rita vägg",
title_draw_wall: "Rita vägg",
help_close: "Stäng",
help_title: "Hur använder jag ritverktyget?",
help_intro: "Så här gör du för att använda ritverktyget:",
help_step1: "Välj bordstyp i menyn och klicka ”Lägg till bord”.",
help_step2: "Dra borden dit du vill på planen.",
help_step3: "Lägg till gäster.",
help_step4: "Klicka på ”Sammanställ” för en översikt.",
help_step5: "Använd gäst- och checklistan som stöd.",
templates_menu: "— Mallar —",
tpl_round50: "Runda 8-platsers – 50 gäster",
tpl_round100: "Runda 8-platsers – 100 gäster",
tpl_round64circle: "8 runda bord i ring (64 platser)",
tpl_banquet96: "Bankett: rektangulära 8-platsers – 96 platser (3×4)",
tpl_headPlusRounds56: "Honnör + runda bord – ~56 gäster",
wall_help_title: "Rita vägg",
wall_help_step1_html: "Klicka i ritytan för att <strong>starta</strong> väggen.",
wall_help_step2_html: "Klicka igen för att <strong>avsluta segmentet</strong> och fortsätta från slutpunkten.",
wall_help_step3_html: "Håll <kbd>Shift</kbd> för att <strong>låsa</strong> horisontellt/vertikalt.",
wall_help_step4_html: "Tryck <kbd>Esc</kbd> för att avbryta pågående segment.",
wall_help_step5_html: "Tryck <kbd>Backspace</kbd> för att ångra senaste vägg.",
wall_help_dont_show: "Visa inte igen",
ok_got_it: "Ok, jag fattar",
title_placeholder: "Skriv din rubrik här",
// SV
about_title: "Om",
about_lead: "Det här är ett enkelt planeringsverktyg för bordsplaceringar. Allt är gratis att använda och det finns inget att köpa.",

about_what_title: "Vad är detta?",
about_what_html: "Ritverktyget låter dig skapa bordsplaner snabbt och enkelt – dra &amp; släpp bord, lägg till gäster och exportera vid behov. Verktyget kan användas fritt.",

about_privacy_title: "Integritet",
about_privacy_html: "Vi använder <strong>Simple Analytics</strong> för övergripande statistik. Vi spårar inte enskilda användare – vi ser bara ungefär hur många som besöker sidan och från vilka länder.",

about_local_title: "Lokala filer",
about_local_html: "Alla gästlistor och liknande sparas som <code>.json</code>-filer på din egen dator. Vi lagrar inga kopior på en server.",

about_who_title: "Vem står bakom?",
about_who_html: "Detta är inte ett företag, utan ett litet ideellt/hobbydrivet projekt.",

about_contact_html: "Har du frågor eller idéer? <a href=\"./kontakt.html\">Kontakta oss här</a>.",
// SV
terms_title: "Villkor",
terms_last_updated_label: "Senast uppdaterad:",
terms_1_title: "1. Användning",
terms_1_html: "Webbplatsen och ritverktyget är gratis att använda. Det finns ingen inloggning och ingenting att köpa.",
terms_2_title: "2. Ditt innehåll",
terms_2_html: "Du ansvarar själv för den information du matar in i verktyget (t.ex. namn i gästlistor). Säkerhetskopiera gärna dina filer regelbundet.",
terms_3_title: "3. Lagring av data",
terms_3_html: "Gästlistor och bordsplaner sparas som lokala <code>.json</code>-filer på din egen dator. Vi tar inte emot, och lagrar inte, kopior av dina filer.",
terms_4_title: "4. Integritet",
terms_4_html: "Vi samlar inte in personuppgifter. Vi använder Simple Analytics enbart för aggregerad besöksstatistik utan att identifiera enskilda användare. Gästlistor och filer från ritverktyget sparas lokalt hos dig. Webbplatsen hostas på GitHub Pages, som kan föra tekniska serverloggar.",
terms_5_title: "5. Ansvarsbegränsning",
terms_5_html: "Verktyget tillhandahålls i befintligt skick (<em>“as is”</em>) utan garantier. Vi kan inte hållas ansvariga för förlust av data, avbrott eller andra typer av skador som kan uppstå vid användning av webbplatsen.",
terms_6_title: "6. Tillgänglighet och ändringar",
terms_6_html: "Vi kan när som helst uppdatera funktioner eller dessa villkor. Större ändringar kommer att framgå här.",
terms_7_title: "7. Kontakt",
terms_7_html: "Frågor? <a href=\"./kontakt.html\">Kontakta oss</a>.",
terms_trademark_html: "”Simple Analytics” är ett varumärke som tillhör respektive ägare.",
// SV
contact_title: "Kontakt",
contact_owner: "Sidansvarig",
contact_email: "E-post",
contact_instagram: "Instagram",
contact_email_aria: "Skicka e-post till everafterbyester snabel-a gmail punkt com",
contact_instagram_aria: "Öppna Instagram: EverAfterbyEster",
contact_cta_email: "Kontakta oss",
contact_cta_email_aria: "Öppna e-post: everafterbyester snabel-a gmail punkt com",
contact_cta_ig: "Följ på Instagram",
contact_cta_ig_aria: "Öppna Instagram: EverAfterbyEster",
products_heading: 'Paket & priser',
    products_lead: 'Välj antal för de paket du behöver. Du kan alltid ändra senare – totalsumman uppdateras automatiskt.',
    nav_products: 'Produkter',
    btn_download_CSV: 'Ladda ner kalkylark',
    footer_brand: "Planeringsverktyg",
footer_about: "Om",
footer_terms: "Villkor",
footer_contact: "Kontakt",

    },
  
    en: {
      sum_heading: "Summary",
      item_chair_cover: "Chair covers",
      item_chair_bow: "Chair bows",
      item_name_tags: "Name tags",
      item_napkins_pack: "Napkins (50-pack)",
      cloth_small: "Small tablecloth",
      cloth_medium: "Medium tablecloth",
      cloth_large: "Large tablecloth",
      cloth_round_medium: "Round table – medium cloth",
      cloth_round_large: "Round table – large cloth",
      lights_big: "String lights (large)",
      lights_small: "String lights (small)",
      paper_lantern: "Paper lantern",
      drapery_fabric: "Drapery fabric",
      note_pack_50: "1 pack covers up to 50 guests",
      dims_small_rect: "Cloth dimensions 180 × 140 cm",
      dims_medium_rect: "Cloth dimensions 240 × 150 cm",
      dims_large_rect: "Cloth dimensions 300 × 150 cm",
      dims_round_medium: "Cloth dimensions Ø 195 cm",
      dims_round_large: "Cloth dimensions Ø 210–220 cm",
      dims_drapery: "Dimensions 75 cm x 800 cm",
      nav_home: "Home",
      nav_tool: "Planner",
      nav_gallery: "Gallery",
      nav_contact: "Contact",
      intro_heading: "Get started with planning",
      intro_start: "Open the planner",
  
      title_placeholder: "Enter your title",
  
      opt_round6: "Round table – 6 seats",
      opt_round8: "Round table – 8 seats",
      opt_rect4:  "Rectangular table – 4 seats",
      opt_rect6:  "Rectangular table – 6 seats",
      opt_rect8:  "Rectangular table – 8 seats",
  
      btn_add_table: "Add table",
      btn_add_guest: "Add guest",
      btn_save_As_Image: "Save image",
      btn_create_GuestList: "Create guestlist",   // liten språkjustering
      btn_open_Checklist: "Create checklist",
  
      btn_save_json:   "Export JSON",              // rekommenderat
      title_save_json: "Export as a .json file",
      btn_load_json:   "Import JSON",
      title_load_json: "Import a .json file",
  
      btn_calculate_totals:  "View summary",
      title_calculate_totals:"View summary",

      table_label: "Table",
      guest: "Guest",

      prompt_guest_name: "Guest name?",

      guestlist_title: "Guest list",
      btn_export_sheet: "Export spreadsheet",         // alt: "Export CSV"
      title_export_sheet: "Export to a spreadsheet",
      btn_close: "Close",
      guestlist_title: "Guestlist",
      checklist_title: "Checklista",
      checklist_title: "Checklist",
      btn_remove: "Remove",
      check_lokal: "Venue",
      check_invitations: "Invitations",
      check_catering: "Catering",
      check_decorations: "Decorations",
      check_music: "Music",
      check_photographer: "Photographer",
      check_transport: "Transport",
      check_accommodation: "Accommodation",
      check_entertainment: "Entertainment",
      check_food_drink: "Food & Drink",
      check_attire_beauty: "Attire & Beauty",
      check_budget: "Budget",
    
      check_item_placeholder: "New item",
      btn_add_item: "Add",
      btn_download: "Download",
      title_download: "Download the checklist",

      summary_title: "Summary",
summary_totals: "Totals",
summary_tables_one: "table",
summary_tables_other: "tables",
summary_guests_one: "guest",
summary_guests_other: "guests",

summary_section_linens: "Linens",
summary_section_measure: "Measurements",
summary_section_other: "Other",

item_tablecloth_one: "tablecloth",
item_tablecloth_other: "tablecloths",
item_chair_cover_one: "chair cover",
item_chair_cover_other: "chair covers",
item_runner_one: "runner",
item_runner_other: "runners",
item_napkin_one: "napkin",
item_napkin_other: "napkins",

unit_meter_short: "m",
unit_cm_short: "cm",

btn_close: "Close",
intro_lead: "Create layouts, try ideas and save your versions.",
intro_examples: "See examples",

home_feat_fast: "Fast and easy",
home_feat_fast_desc: "Drag-and-drop, smart measurements and neat export.",
home_feat_share: "Shareable",
home_feat_share_desc: "Share with colleagues or clients via a link.",
home_feat_templates: "Ready-made templates",
home_feat_templates_desc: "Get started in seconds.",
print: "Print",
download_sheet: "Download spreadsheet",
cancel: "Cancel",
btn_open_help: "Open help",
btn_howto: "How it works", // alt: "Help"
btn_draw_wall: "Draw wall",
title_draw_wall: "Draw wall",
help_close: "Close",
help_title: "How to use the drawing tool",
help_intro: "Here's how to use the drawing tool:",
help_step1: "Choose a table type in the menu and click “Add table”.",
help_step2: "Drag the tables to where you want them on the floor plan.",
help_step3: "Add guests.",
help_step4: "Click “Summarize” to see an overview.",
help_step5: "Use the guest list and checklist as a guide.",
templates_menu: "— Templates —",
tpl_round50: "Round 8-seaters – 50 guests",
tpl_round100: "Round 8-seaters – 100 guests",
tpl_round64circle: "8 round tables in a circle (64 seats)",
tpl_banquet96: "Banquet: rectangular 8-seaters – 96 seats (3×4)",
tpl_headPlusRounds56: "Head table + round tables – ~56 guests",
wall_help_title: "Draw wall",
wall_help_step1_html: "Click in the drawing area to <strong>start</strong> the wall.",
wall_help_step2_html: "Click again to <strong>end the segment</strong> and continue from the endpoint.",
wall_help_step3_html: "Hold <kbd>Shift</kbd> to <strong>lock</strong> horizontally/vertically.",
wall_help_step4_html: "Press <kbd>Esc</kbd> to cancel the current segment.",
wall_help_step5_html: "Press <kbd>Backspace</kbd> to undo the last wall.",
wall_help_dont_show: "Don't show again",
ok_got_it: "Got it",
title_placeholder: "Type your title here",
// EN
about_title: "About",
about_lead: "This is a simple planning tool for seating charts. Everything is free to use and there’s nothing to buy.",

about_what_title: "What is this?",
about_what_html: "The drawing tool lets you create seating plans quickly and easily — drag &amp; drop tables, add guests, and export when needed. The tool is free to use.",

about_privacy_title: "Privacy",
about_privacy_html: "We use <strong>Simple Analytics</strong> for aggregate statistics. We don’t track individual users — we only see roughly how many people visit the site and from which countries.",

about_local_title: "Local files",
about_local_html: "All guest lists and similar data are saved as <code>.json</code> files on your own computer. We don’t store copies on a server.",

about_who_title: "Who’s behind this?",
about_who_html: "This isn’t a company — it’s a small, non-profit/hobby project.",

about_contact_html: "Got questions or ideas? <a href=\"./kontakt.html\">Contact us here</a>.",
// EN
terms_title: "Terms",
terms_last_updated_label: "Last updated:",
terms_1_title: "1. Use",
terms_1_html: "The website and drawing tool are free to use. There is no login and nothing to buy.",
terms_2_title: "2. Your content",
terms_2_html: "You are responsible for the information you enter into the tool (e.g., names in guest lists). We recommend backing up your files regularly.",
terms_3_title: "3. Data storage",
terms_3_html: "Guest lists and seating plans are saved as local <code>.json</code> files on your own computer. We do not receive or store copies of your files.",
terms_4_title: "4. Privacy",
terms_4_html: "We do not collect personal data. We use Simple Analytics only for aggregated visit statistics without identifying individual users. Guest lists and files from the drawing tool are stored locally by you. The website is hosted on GitHub Pages, which may keep technical server logs.",
terms_5_title: "5. Limitation of liability",
terms_5_html: "The tool is provided <em>“as is”</em> without warranties. We cannot be held liable for data loss, interruptions, or other damages arising from use of the website.",
terms_6_title: "6. Availability and changes",
terms_6_html: "We may update features or these terms at any time. Major changes will be noted here.",
terms_7_title: "7. Contact",
terms_7_html: "Questions? <a href=\"./kontakt.html\">Contact us</a>.",
terms_trademark_html: "“Simple Analytics” is a trademark of its respective owner.",
// EN
contact_title: "Contact",
contact_owner: "Site owner",
contact_email: "Email",
contact_instagram: "Instagram",
contact_email_aria: "Send email to everafterbyester at gmail dot com",
contact_instagram_aria: "Open Instagram: EverAfterbyEster",
contact_cta_email: "Contact us",
contact_cta_email_aria: "Open email: everafterbyester at gmail dot com",
contact_cta_ig: "Follow on Instagram",
contact_cta_ig_aria: "Open Instagram: EverAfterbyEster",
products_heading: 'Packages & pricing',
    products_lead: 'Choose quantities for the packages you need. You can change later — the total updates automatically.',
    nav_products: 'Products',
    btn_download_CSV: 'Download spreadsheet',
    footer_brand: "Planning Tool",
footer_about: "About",
footer_terms: "Terms",
footer_contact: "Contact",

    }
  };
  
  function detectInitialLang() {
    const saved = localStorage.getItem("lang");
    if (saved) return saved;
    const nav = (navigator.language || "en").toLowerCase();
    return nav.startsWith("sv") ? "sv" : "en";
  }
  

  // Enkelt t() som du redan använder
// Plural: tCount("summary_guests", 3) -> "guests"

function applyLang(lang) {
  const dict = DICT[lang] || DICT.en;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    const val = dict[key];
    if (val != null) el.textContent = val;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const val = dict[key];
    if (val != null) el.setAttribute("placeholder", val);
  });
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.dataset.i18nTitle;
    const val = dict[key];
    if (val != null) el.setAttribute("title", val);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach(el => {
    const key = el.dataset.i18nAriaLabel;
    const val = dict[key];
    if (val != null) el.setAttribute("aria-label", val);
  });
  document.querySelectorAll("[data-i18n-value]").forEach(el => {
    const key = el.dataset.i18nValue;
    const val = dict[key];
    if (val != null) el.setAttribute("value", val);
  });

  const btn = document.getElementById("lang-toggle");
  if (btn) {
    btn.textContent = lang === "sv" ? "EN" : "SV";
    btn.onclick = () => {
      const next = (document.documentElement.lang || "sv") === "sv" ? "en" : "sv";
      localStorage.setItem("lang", next);
      applyLang(next);
    };
  }

  document.documentElement.lang = lang;
  localStorage.setItem("lang", lang);
  window.dispatchEvent(new CustomEvent("app:lang-changed", { detail: { lang } }));
}

function detectInitialLang() {
  const stored = localStorage.getItem("lang");
  if (stored) return stored;
  const nav = (navigator.language || "en").toLowerCase();
  return nav.startsWith("sv") ? "sv" : "en";
}

document.addEventListener("DOMContentLoaded", () => {
  applyLang(detectInitialLang());
});

window.t = function (key, fallback = key) {
  const lang = document.documentElement.lang || "sv";
  const dict = (DICT[lang] || DICT.en);
  return (dict && key in dict) ? dict[key] : fallback;
};

window.tCount = function (baseKey, n) {
  const lang = document.documentElement.lang || "sv";
  const dict = (DICT[lang] || DICT.en);
  const key = n === 1 ? `${baseKey}_one` : `${baseKey}_other`;
  return dict[key] || baseKey;
};
function applyI18n(root = document) {
  // Vanlig text: <span data-i18n="key"></span>
  root.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });

  // HTML: <li data-i18n-html="key_with_html"></li>
  root.querySelectorAll("[data-i18n-html]").forEach(el => {
    const key = el.getAttribute("data-i18n-html");
    el.innerHTML = t(key); // OK eftersom strängarna kommer från din egen ordbok
  });

  // (valfritt) Attribut och plural – lägg till här om du använder dem
}

// Kör vid start + vid språkbyte
document.addEventListener("DOMContentLoaded", () => {
  const stored = (() => { try { return localStorage.getItem("lang"); } catch { return null; }})();
  if (stored) document.documentElement.lang = stored;
  applyI18n();
});

window.setLang = function(lang) {
  document.documentElement.lang = lang;
  try { localStorage.setItem("lang", lang); } catch {}
  applyI18n();
};

function formatIsoDateForLang(iso, lang) {
  if (!iso) return "";
  const d = new Date(iso);
  // Ex: 20 okt 2025 / Oct 20, 2025
  return d.toLocaleDateString(lang || (document.documentElement.lang || "sv"), {
    year: "numeric", month: "short", day: "numeric"
  });
}

function updateLocalizedDates(root = document) {
  const lang = document.documentElement.lang || "sv";
  root.querySelectorAll("[data-date-iso]").forEach(el => {
    el.textContent = formatIsoDateForLang(el.getAttribute("data-date-iso"), lang);
  });
}

// Kör när sidan startar och vid språkbyte
document.addEventListener("DOMContentLoaded", () => {
  // Exempel: sätt datum en gång (eller gör det server/build-side)
  const el = document.getElementById("last-updated");
  if (el && !el.getAttribute("data-date-iso")) {
    el.setAttribute("data-date-iso", "2025-10-20"); // <-- ändra till ditt datum
  }
  applyI18n();
  updateLocalizedDates();
});

const prevSetLang = window.setLang;
window.setLang = function(lang){
  document.documentElement.lang = lang;
  try { localStorage.setItem("lang", lang); } catch {}
  applyI18n();
  updateLocalizedDates();
};
