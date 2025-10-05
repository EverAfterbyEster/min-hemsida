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
