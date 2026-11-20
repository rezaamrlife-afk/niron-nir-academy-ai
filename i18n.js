/**
 * NIRON — i18n core (Step 1)
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
 * Dictionaries are intentionally EMPTY in this step: no UI text is translated yet,
 * so t() always returns the English fallback. Entries are added in later steps.
 * AI-generated ELT learning content stays in English and never goes through t().
 */
(function (root) {
  'use strict';

  var SUPPORTED = ['en', 'fa', 'tr'];

  var DICT = {
    en: {},
    fa: {},
    tr: {}
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

  var api = { t: t, getLang: getLang, supported: SUPPORTED.slice(), dict: DICT };

  root.NIRON_I18N = api;
  root.t = t;

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
