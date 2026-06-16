// ====== CONFIGURATION EMAILJS ======
const SERVICE_ID = "service_4oywrlt";
const TEMPLATE_ID = "template_6je910l";

if (typeof emailjs !== 'undefined') {
  emailjs.init("INtZifFaMD80O403k");
} else {
  console.error("EmailJS n'a pas pu être chargé (vérifiez la connexion internet / le CDN).");
}

// ====== ÉTAT GLOBAL ======
const PRICE = 49.99;
let selected = { fr: false, en: false };
let qty = { fr: 1, en: 1 };
let currentLang = "fr";
let selectedCountry = null; // objet { code, fr, en }

// ============================================================
// VERSIONS / QUANTITÉS / TOTAL
// ============================================================
function toggleVersion(lang) {
  selected[lang] = !selected[lang];
  document.getElementById('card-' + lang).classList.toggle('selected', selected[lang]);
  renderQty();
}

function renderQty() {
  const hasSel = selected.fr || selected.en;
  const sec = document.getElementById('qty-section');
  sec.style.display = hasSel ? 'block' : 'none';

  const block = document.getElementById('qty-block');
  block.innerHTML = '';

  ['fr', 'en'].forEach(lang => {
    if (!selected[lang]) return;
    const label = i18nGet(currentLang, lang === 'fr' ? 'version.fr' : 'version.en');
    const unit = i18nGet(currentLang, 'qty.unit');
    block.innerHTML += `
      <div class="qty-row">
        <span class="qty-lang">${label}</span>
        <div class="qty-controls">
          <button type="button" class="qty-btn" onclick="changeQty('${lang}',-1)">−</button>
          <div class="qty-num" id="qnum-${lang}">${qty[lang]}</div>
          <button type="button" class="qty-btn" onclick="changeQty('${lang}',1)">+</button>
          <span class="qty-unit">${unit}</span>
        </div>
      </div>`;
  });

  updateTotal();
}

function changeQty(lang, delta) {
  qty[lang] = Math.max(1, qty[lang] + delta);
  document.getElementById('qnum-' + lang).textContent = qty[lang];
  updateTotal();
}

function updateTotal() {
  let total = 0;
  let parts = [];
  if (selected.fr) { total += qty.fr * PRICE; parts.push(qty.fr + ' × FR'); }
  if (selected.en) { total += qty.en * PRICE; parts.push(qty.en + ' × EN'); }
  const detailSuffix = i18nGet(currentLang, 'total.detail');
  document.getElementById('total-amount').textContent = total.toFixed(2).replace('.', ',') + ' €';
  document.getElementById('total-detail').textContent =
    parts.length ? parts.join(' + ') + ' · 49,99 € ' + detailSuffix : '';
}

function buildOrderSummary() {
  let lines = [];
  let total = 0;

  if (selected.fr) {
    const subtotal = qty.fr * PRICE;
    total += subtotal;
    lines.push(`- Version Française : ${qty.fr} exemplaire(s) — ${subtotal.toFixed(2).replace('.', ',')} €`);
  }
  if (selected.en) {
    const subtotal = qty.en * PRICE;
    total += subtotal;
    lines.push(`- Version Anglaise : ${qty.en} exemplaire(s) — ${subtotal.toFixed(2).replace('.', ',')} €`);
  }

  return {
    summary: lines.join('\n'),
    total: total.toFixed(2).replace('.', ',') + ' €'
  };
}

// ============================================================
// SÉCURITÉ — NETTOYAGE DES CHAMPS AVANT ENVOI
// ============================================================
// Objectif : empêcher l'injection de balises/scripts et l'injection
// d'en-têtes email (header injection) via des retours à la ligne
// dans des champs censés être sur une seule ligne (nom, email, ville, pays).
function sanitizeSingleLine(value, maxLength) {
  if (!value) return '';
  return value
    .replace(/<[^>]*>/g, '')        // retire toute balise HTML/JS (<script>, <img onerror=...>, etc.)
    .replace(/[\r\n]+/g, ' ')        // retire les retours à la ligne (anti header-injection email)
    .replace(/[\x00-\x1F\x7F]/g, '') // retire les caractères de contrôle invisibles
    .trim()
    .slice(0, maxLength);
}

// Pour les champs multi-lignes (le récapitulatif de commande, généré par nous-mêmes,
// n'a pas besoin d'être nettoyé car il ne provient pas d'une saisie libre).
function sanitizeFormFields() {
  const fullnameEl = document.getElementById('fullname');
  const emailEl = document.getElementById('email');
  const cityEl = document.getElementById('city');
  const countryOtherEl = document.getElementById('country-other');

  fullnameEl.value = sanitizeSingleLine(fullnameEl.value, 80);
  emailEl.value = sanitizeSingleLine(emailEl.value, 100);
  cityEl.value = sanitizeSingleLine(cityEl.value, 60);

  if (countryOtherEl) {
    const cleaned = sanitizeSingleLine(countryOtherEl.value, 60);
    countryOtherEl.value = cleaned;
    if (selectedCountry && selectedCountry.code === 'other') {
      document.getElementById('country').value = cleaned;
    }
  }
}

// ============================================================
// SÉLECTEUR DE PAYS AVEC DRAPEAUX
// ============================================================
function renderCountryList(filter = '') {
  const list = document.getElementById('country-list');
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const f = norm(filter);

  const filtered = COUNTRIES.filter(c => norm(c[currentLang]).includes(f));
  const otherMatches = norm(OTHER_COUNTRY[currentLang]).includes(f);

  let html = '';

  if (filtered.length === 0 && !otherMatches) {
    const emptyLabel = currentLang === 'fr' ? 'Aucun pays trouvé' : 'No country found';
    list.innerHTML = `<div class="country-option-empty">${emptyLabel}</div>`;
    return;
  }

  html += filtered
    .sort((a, b) => a[currentLang].localeCompare(b[currentLang]))
    .map(c => {
      const isSelected = selectedCountry && selectedCountry.code === c.code;
      return `
        <div class="country-option${isSelected ? ' selected' : ''}" data-code="${c.code}" onclick="selectCountry('${c.code}')">
          <span class="fi fi-${c.code}"></span>
          <span>${c[currentLang]}</span>
        </div>`;
    }).join('');

  if (otherMatches) {
    const isSelected = selectedCountry && selectedCountry.code === 'other';
    html += `
      <div class="country-option country-option-other${isSelected ? ' selected' : ''}" data-code="other" onclick="selectCountry('other')">
        <i class="ti ti-pencil" aria-hidden="true" style="font-size:14px;"></i>
        <span>${OTHER_COUNTRY[currentLang]}</span>
      </div>`;
  }

  list.innerHTML = html;
}

function selectCountry(code) {
  if (code === 'other') {
    selectedCountry = OTHER_COUNTRY;
    document.getElementById('country').value = '';
    document.getElementById('country-trigger-content').innerHTML =
      `<i class="ti ti-pencil" aria-hidden="true" style="font-size:14px;color:#8a7e6e;"></i><span>${OTHER_COUNTRY[currentLang]}</span>`;
    showOtherCountryInput();
    closeCountryList();
    // Focus sur le champ libre pour saisie immédiate
    setTimeout(() => {
      const input = document.getElementById('country-other');
      if (input) input.focus();
    }, 0);
    return;
  }

  const country = COUNTRIES.find(c => c.code === code);
  if (!country) return;
  selectedCountry = country;

  document.getElementById('country').value = country.en; // valeur envoyée à EmailJS (anglais = stable)
  document.getElementById('country-trigger-content').innerHTML =
    `<span class="fi fi-${country.code}"></span><span>${country[currentLang]}</span>`;

  hideOtherCountryInput();
  closeCountryList();
}

function showOtherCountryInput() {
  let wrap = document.getElementById('country-other-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'country-other-wrap';
    wrap.className = 'form-group country-other-wrap';
    wrap.innerHTML = `<input type="text" id="country-other" data-i18n-placeholder="form.countryOtherPh" placeholder="${i18nGet(currentLang, 'form.countryOtherPh')}" maxlength="60" />`;
    document.getElementById('country-select').insertAdjacentElement('afterend', wrap);

    document.getElementById('country-other').addEventListener('input', function () {
      document.getElementById('country').value = this.value.trim();
    });
  }
  wrap.style.display = 'block';
}

function hideOtherCountryInput() {
  const wrap = document.getElementById('country-other-wrap');
  if (wrap) wrap.style.display = 'none';
}

function toggleCountryList() {
  const sel = document.getElementById('country-select');
  const willOpen = !sel.classList.contains('open');

  // Ferme tout autre dropdown ouvert avant d'ouvrir celui-ci
  closeCountryList();

  if (willOpen) {
    sel.classList.add('open');
    const search = document.getElementById('country-search');
    search.value = '';
    renderCountryList('');
    setTimeout(() => search.focus(), 0);
  }
}

function closeCountryList() {
  document.getElementById('country-select').classList.remove('open');
}

function filterCountries() {
  const val = document.getElementById('country-search').value;
  renderCountryList(val);
}

// Fermer le menu si clic en dehors
document.addEventListener('click', function (e) {
  const sel = document.getElementById('country-select');
  if (!sel) return;
  if (sel.classList.contains('open') && !sel.contains(e.target)) {
    closeCountryList();
  }
});

// ============================================================
// TRADUCTION DE L'INTERFACE (FR / EN)
// ============================================================
function applyTranslations() {
  // Textes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = i18nGet(currentLang, key);
    if (value !== undefined) el.textContent = value;
  });

  // Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const value = i18nGet(currentLang, key);
    if (value !== undefined) el.placeholder = value;
  });

  // Switch visuel
  document.querySelectorAll('[data-lang-opt]').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-lang-opt') === currentLang);
  });

  // Pays sélectionné (réaffiché dans la langue courante)
  if (selectedCountry) {
    if (selectedCountry.code === 'other') {
      document.getElementById('country-trigger-content').innerHTML =
        `<i class="ti ti-pencil" aria-hidden="true" style="font-size:14px;color:#8a7e6e;"></i><span>${OTHER_COUNTRY[currentLang]}</span>`;
    } else {
      document.getElementById('country-trigger-content').innerHTML =
        `<span class="fi fi-${selectedCountry.code}"></span><span>${selectedCountry[currentLang]}</span>`;
    }
  }

  // Recalcule les libellés dynamiques (quantités, total)
  renderQty();

  // <html lang="">
  document.documentElement.lang = currentLang;
}

function toggleLang() {
  currentLang = currentLang === 'fr' ? 'en' : 'fr';
  applyTranslations();
}

// ============================================================
// SOUMISSION DU FORMULAIRE
// ============================================================
const form = document.getElementById('preorderForm');
const errorMsg = document.getElementById('error-msg');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  errorMsg.textContent = '';

  // Nettoyage de sécurité : retire balises HTML, retours à la ligne, caractères de contrôle
  sanitizeFormFields();

  const fullname = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email').value.trim();
  const country = document.getElementById('country').value.trim();
  const city = document.getElementById('city').value.trim();

  if (!fullname || !email || !country || !city) {
    errorMsg.textContent = i18nGet(currentLang, 'form.errorFields');
    return;
  }

  // Validation basique du format email
  const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
  if (!emailPattern.test(email)) {
    errorMsg.textContent = i18nGet(currentLang, 'form.errorEmail');
    return;
  }

  if (!selected.fr && !selected.en) {
    errorMsg.textContent = i18nGet(currentLang, 'form.errorVersion');
    return;
  }

  const order = buildOrderSummary();
  document.getElementById('order_summary').value = order.summary;
  document.getElementById('total').value = order.total;

  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = i18nGet(currentLang, 'form.sending');

  if (typeof emailjs === 'undefined') {
    errorMsg.textContent = i18nGet(currentLang, 'form.errorSend');
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
    console.error("EmailJS non disponible.");
    return;
  }

  emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form)
    .then(() => {
      // Cache le formulaire
      document.getElementById('form-wrap').style.display = 'none';

      // Affiche le message de succès dans la langue active au moment de l'envoi
      const successEl = document.getElementById('success-msg');
      successEl.querySelector('h3').textContent = i18nGet(currentLang, 'success.title');
      successEl.querySelector('p').textContent  = i18nGet(currentLang, 'success.text');
      successEl.style.display = 'block';
    })
    .catch((error) => {
      errorMsg.textContent = i18nGet(currentLang, 'form.errorSend');
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
      console.error(error);
    });
});

// ============================================================
// INITIALISATION
// ============================================================
renderCountryList('');
applyTranslations();
