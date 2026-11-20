/**
 * NIRON — i18n core
 *
 * Supported UI languages: English (en), Persian (fa), Turkish (tr). Nothing else.
 *
 * Usage:   t('nav.system', 'System')
 *   key       — stable dictionary key, e.g. 'nav.system'
 *   fallback  — the English text already in the app (used when no dictionary has the key)
 *
 * Lookup order (English is always the fallback):
 *   1. dictionary of the active language (fa | tr)
 *   2. English dictionary
 *   3. the `fallback` argument
 *   4. the key itself
 *
 * The active language is read at call time from window._selectedLang
 * (null | 'fa' | 'tr', set by setLang() in index.html). Anything else means English.
 *
 * Markup hooks (applied by NIRON_I18N.apply(), which setLang() calls):
 *   data-i18n="key"                         -> element.textContent = t(key)
 *   data-i18n-attr="aria-label:key;..."     -> attribute = t(key)
 * Translated elements get lang="fa" / lang="tr" (correct fonts, joining and Turkish casing);
 * the attributes are removed again for English.
 *
 * Step 2 scope: navbar (incl. mobile menu and bottom tab bar), hero and output-tab labels.
 * AI-generated ELT learning content is never translated here and stays in English.
 */
(function (root) {
  'use strict';

  var SUPPORTED = ['en', 'fa', 'tr'];

  var DICT = {
    en: {
      // Navbar
      "nav.sub": "Language Intelligence",
      "nav.system": "System",
      "nav.engines": "Engines",
      "nav.intelligence": "Intelligence",
      "nav.ecosystem": "Ecosystem",
      "nav.journey": "Journey",
      "nav.vocab_hub": "Vocab Hub",
      "nav.lab": "Lab",
      "nav.light": "Light",
      "nav.dark": "Dark",
      "nav.focus": "Focus",
      "nav.exit": "Exit",
      "nav.login": "Log In",
      "nav.member": "NIRON Member",
      "nav.my_account": "My Account",
      "nav.saved": "Saved Outputs",
      "nav.dashboard": "Dashboard",
      "nav.signout": "Sign Out",
      "nav.menu": "Menu",
      "nav.toggle_theme": "Toggle light/dark theme",

      // Mobile menu
      "mob.account": "Account",
      "mob.signup": "Sign Up",
      "mob.settings": "Settings",
      "mob.light_mode": "Light Mode",
      "mob.focus_mode": "Focus Mode",
      "mob.language": "Language",
      "mob.learning_tools": "Learning Tools",
      "mob.journey": "NIRON Journey",
      "mob.vocab_hub": "Vocabulary Hub",
      "mob.lab": "Learning Lab",
      "mob.ecosystem": "NIR Ecosystem",
      "mob.sister": "Sister App: NIRA",

      // Hero
      "hero.badge": "Adaptive Language Intelligence System",
      "hero.tag_a": "Vocabulary & Grammar",
      "hero.tag_b": "Intelligence",
      "hero.desc": "NIRON is not a language tool. It is an adaptive language intelligence system that transforms any vocabulary or grammar input into structured, measurable, production-ready language development.",
      "hero.activate": "Activate Intelligence",
      "hero.explore": "Explore Engines",
      "hero.p_aria": "Sample NIRON Grammar practice output at CEFR level B2",
      "hero.p_title": "Intelligence Interface",
      "hero.p_sample": "SAMPLE OUTPUT",
      "hero.p_type": "Type",
      "hero.p_vocab": "Vocabulary",
      "hero.p_grammar": "Grammar",
      "hero.p_cefr_level": "CEFR Level",

      // Output tabs
      "out.diagnosis": "Diagnosis",
      "out.analysis": "Analysis",
      "out.practice": "Practice",
      "out.pathway": "Pathway",
      "out.definitions": "Definitions",
      "out.controlled": "CONTROLLED PRACTICE",
    },
    fa: {
      // Navbar
      "nav.sub": "هوش زبانی",
      "nav.system": "سامانه",
      "nav.engines": "موتورها",
      "nav.intelligence": "هوش",
      "nav.ecosystem": "اکوسیستم",
      "nav.journey": "سفر",
      "nav.vocab_hub": "مرکز واژگان",
      "nav.lab": "آزمایشگاه",
      "nav.light": "روشن",
      "nav.dark": "تیره",
      "nav.focus": "تمرکز",
      "nav.exit": "خروج",
      "nav.login": "ورود",
      "nav.member": "عضو NIRON",
      "nav.my_account": "حساب من",
      "nav.saved": "خروجی‌های ذخیره‌شده",
      "nav.dashboard": "داشبورد",
      "nav.signout": "خروج از حساب",
      "nav.menu": "منو",
      "nav.toggle_theme": "تغییر پوسته روشن/تیره",

      // Mobile menu
      "mob.account": "حساب کاربری",
      "mob.signup": "ثبت‌نام",
      "mob.settings": "تنظیمات",
      "mob.light_mode": "حالت روشن",
      "mob.focus_mode": "حالت تمرکز",
      "mob.language": "زبان",
      "mob.learning_tools": "ابزارهای یادگیری",
      "mob.journey": "سفر NIRON",
      "mob.vocab_hub": "مرکز واژگان",
      "mob.lab": "آزمایشگاه یادگیری",
      "mob.ecosystem": "اکوسیستم NIR",
      "mob.sister": "برنامه خواهر: NIRA",

      // Hero
      "hero.badge": "سامانه هوش زبانی تطبیقی",
      "hero.tag_a": "واژگان و دستور زبان",
      "hero.tag_b": "هوشمند",
      "hero.desc": "NIRON فقط یک ابزار زبانی نیست؛ یک سامانهٔ هوش زبانی تطبیقی است که هر ورودی واژگانی یا دستوری را به رشدی زبانیِ ساختاریافته، قابل‌سنجش و آمادهٔ کاربرد در عمل تبدیل می‌کند.",
      "hero.activate": "فعال‌سازی هوش",
      "hero.explore": "کاوش موتورها",
      "hero.p_aria": "نمونه‌ای از خروجی تمرین دستور زبان NIRON در سطح B2 (CEFR)",
      "hero.p_title": "رابط هوشمند",
      "hero.p_sample": "نمونه خروجی",
      "hero.p_type": "نوع",
      "hero.p_vocab": "واژگان",
      "hero.p_grammar": "دستور زبان",
      "hero.p_cefr_level": "سطح CEFR",

      // Output tabs
      "out.diagnosis": "تشخیص",
      "out.analysis": "تحلیل",
      "out.practice": "تمرین",
      "out.pathway": "مسیر یادگیری",
      "out.definitions": "تعاریف",
      "out.controlled": "تمرین کنترل‌شده",
    },
    tr: {
      // Navbar
      "nav.sub": "Dil Zekâsı",
      "nav.system": "Sistem",
      "nav.engines": "Motorlar",
      "nav.intelligence": "Zekâ",
      "nav.ecosystem": "Ekosistem",
      "nav.journey": "Yolculuk",
      "nav.vocab_hub": "Kelime Merkezi",
      "nav.lab": "Lab",
      "nav.light": "Açık",
      "nav.dark": "Koyu",
      "nav.focus": "Odak",
      "nav.exit": "Çıkış",
      "nav.login": "Giriş Yap",
      "nav.member": "NIRON Üyesi",
      "nav.my_account": "Hesabım",
      "nav.saved": "Kayıtlı Çıktılar",
      "nav.dashboard": "Panel",
      "nav.signout": "Oturumu Kapat",
      "nav.menu": "Menü",
      "nav.toggle_theme": "Açık/koyu temayı değiştir",

      // Mobile menu
      "mob.account": "Hesap",
      "mob.signup": "Kayıt Ol",
      "mob.settings": "Ayarlar",
      "mob.light_mode": "Açık Mod",
      "mob.focus_mode": "Odak Modu",
      "mob.language": "Dil",
      "mob.learning_tools": "Öğrenme Araçları",
      "mob.journey": "NIRON Yolculuğu",
      "mob.vocab_hub": "Kelime Merkezi",
      "mob.lab": "Öğrenme Laboratuvarı",
      "mob.ecosystem": "NIR Ekosistemi",
      "mob.sister": "Kardeş Uygulama: NIRA",

      // Hero
      "hero.badge": "Uyarlanabilir Dil Zekâsı Sistemi",
      "hero.tag_a": "Kelime ve Dilbilgisi",
      "hero.tag_b": "Zekâsı",
      "hero.desc": "NIRON bir dil aracı değildir. Herhangi bir kelime veya dilbilgisi girdisini yapılandırılmış, ölçülebilir ve üretime hazır dil gelişimine dönüştüren uyarlanabilir bir dil zekâsı sistemidir.",
      "hero.activate": "Zekâyı Etkinleştir",
      "hero.explore": "Motorları Keşfet",
      "hero.p_aria": "CEFR B2 seviyesinde örnek NIRON Dilbilgisi alıştırması çıktısı",
      "hero.p_title": "Zekâ Arayüzü",
      "hero.p_sample": "ÖRNEK ÇIKTI",
      "hero.p_type": "Tür",
      "hero.p_vocab": "Kelime",
      "hero.p_grammar": "Dilbilgisi",
      "hero.p_cefr_level": "CEFR Seviyesi",

      // Output tabs
      "out.diagnosis": "Tanı",
      "out.analysis": "Analiz",
      "out.practice": "Alıştırma",
      "out.pathway": "Yol Haritası",
      "out.definitions": "Tanımlar",
      "out.controlled": "KONTROLLÜ ALIŞTIRMA",
    }
  };

  function has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function getLang() {
    var l = root._selectedLang;
    return (l === 'fa' || l === 'tr') ? l : 'en';
  }

  function lookup(lang, key) {
    var d = DICT[lang];
    if (d && has(d, key)) {
      var v = d[key];
      if (typeof v === 'string' && v !== '') return v;
    }
    return undefined;
  }

  function t(key, fallback) {
    key = String(key);
    var lang = getLang();
    var v = lookup(lang, key);
    if (v === undefined && lang !== 'en') v = lookup('en', key);
    if (v !== undefined) return v;
    return (fallback === undefined || fallback === null) ? key : String(fallback);
  }

  // Translate every [data-i18n] / [data-i18n-attr] element inside `scope` (default: whole document).
  function apply(scope) {
    var doc = root.document;
    scope = scope || doc;
    if (!scope || !scope.querySelectorAll) return;
    var lang = getLang();
    var i, el, nodes;

    nodes = scope.querySelectorAll('[data-i18n]');
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      var txt = t(el.getAttribute('data-i18n'), el.textContent);
      if (el.textContent !== txt) el.textContent = txt;
      if (lang === 'en') {
        if (el.hasAttribute('data-i18n-lang')) {
          el.removeAttribute('lang'); el.removeAttribute('dir'); el.removeAttribute('data-i18n-lang');
        }
      } else {
        el.setAttribute('lang', lang);
        el.setAttribute('data-i18n-lang', '1');
        // The page itself stays LTR. A Persian string that embeds Latin words (NIRON, CEFR, ...)
        // would show in scrambled order inside an LTR parent, so only those strings are
        // rendered as an isolated RTL run. Pure-Persian and Turkish elements are untouched.
        if (lang === 'fa' && /[A-Za-z]/.test(txt)) el.setAttribute('dir', 'rtl');
        else el.removeAttribute('dir');
      }
    }

    nodes = scope.querySelectorAll('[data-i18n-attr]');
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      var pairs = el.getAttribute('data-i18n-attr').split(';');
      for (var j = 0; j < pairs.length; j++) {
        var p = pairs[j].split(':');
        if (p.length !== 2) continue;
        var attr = p[0].trim(), key = p[1].trim();
        el.setAttribute(attr, t(key, el.getAttribute(attr) || ''));
      }
    }
  }

  var api = { t: t, apply: apply, getLang: getLang, supported: SUPPORTED.slice(), dict: DICT };

  root.NIRON_I18N = api;
  root.t = t;

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
