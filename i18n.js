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
 * Scope so far: navbar (incl. mobile menu and bottom tab bar), hero, output-tab labels, the interface
 * input panel, result-tab labels, loader/toast/error messages. Other sections are added step by step.
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

      // Interface input panel
      "in.title": "LANGUAGE INTELLIGENCE ENGINE",
      "in.sub": "Enter any word, phrase, or grammar structure. NIRON generates a full diagnostic learning intelligence output.",
      "in.params": "System Parameters",
      "in.ielts_band": "IELTS Target Band",
      "in.type": "Intelligence Type",
      "in.mixed": "Mixed Intelligence",
      "in.input": "Input",
      "in.input_hint": "Word / phrase / grammar structure",
      "in.placeholder": "e.g.  'investigate'\nor  'present perfect'\nor  'climate change vocabulary'",
      "in.select_level": "Select Level",
      "in.select_band": "Select Band",
      "in.cefr_a1": "A1 — Beginner",
      "in.cefr_a2": "A2 — Elementary",
      "in.cefr_b1": "B1 — Intermediate",
      "in.cefr_b2": "B2 — Upper-Intermediate",
      "in.cefr_c1": "C1 — Advanced",
      "in.cefr_c2": "C2 — Mastery",
      "in.band_5": "Band 5 — Modest",
      "in.band_5_5": "Band 5.5",
      "in.band_6": "Band 6 — Competent",
      "in.band_6_5": "Band 6.5",
      "in.band_7": "Band 7 — Good",
      "in.band_7_5": "Band 7.5",
      "in.band_8": "Band 8 — Very Good",
      "in.band_9": "Band 9 — Expert",
      "in.err_cefr": "Please select your CEFR level",
      "in.err_ielts": "Please select your IELTS target band",
      "in.err_topic": "Please enter a word, phrase, or structure",
      "in.generate": "GENERATE INTELLIGENCE",
      "in.processing": "PROCESSING…",
      "in.copy": "Copy",
      "in.print": "Print",
      "in.save": "Save",
      "in.clear": "Clear",
      "in.saved_title": "Saved ✓",
      "in.saved_offline_title": "Saved offline ✓",
      "in.save_failed_title": "Save failed — try again",
      "in.copied": "COPIED",
      "in.empty_1": "Configure parameters",
      "in.empty_2": "and activate intelligence",
      "in.empty_3": "to begin",

      // Loader messages
      "load.0": "Processing Language Intelligence...",
      "load.1": "Analysing vocabulary...",
      "load.2": "Evaluating grammar...",
      "load.3": "Building CEFR diagnosis...",
      "load.4": "Checking language accuracy...",
      "load.5": "Preparing recommendations...",
      "load.6": "Generating personalised feedback...",

      // Toasts
      "msg.generated": "Content generated",
      "msg.gen_failed": "Generation failed — please try again",
      "msg.saved": "Output saved",
      "msg.saved_offline": "Saved offline — will sync when you are back online",
      "msg.save_failed": "Could not save — please try again",

      // Errors
      "err.processing": "INTELLIGENCE PROCESSING ERROR",

      // Print
      "print.title": "NIRON Output",

      // Result labels
      "res.diag_layer": "DIAGNOSIS LAYER",
      "res.analysis_layer": "ANALYSIS LAYER",
      "res.core": "CORE LANGUAGE INTELLIGENCE",
      "res.ielts_app": "IELTS & ACADEMIC APPLICATION",
      "res.error_intel": "ERROR INTELLIGENCE",
      "res.guided": "GUIDED PRODUCTION",
      "res.free": "FREE PRODUCTION TASKS",
      "res.transform": "TRANSFORMATION TASKS",
      "res.pathway": "LEARNING PATHWAY",
      "res.next_step": "NEXT STEP ENGINE",
      "res.defs_layer": "VOCABULARY / DEFINITIONS LAYER",
      "res.ielts_target": "IELTS Target",
      "res.band_target": "Band Target",
      "res.input_type": "Input Type",
      "res.intel_mode": "Intelligence Mode",
      "res.type_grammar": "Grammar Structure",
      "res.type_lexical": "Lexical Item",
      "res.competence": "COMPETENCE NOTE",
      "res.skill_gaps": "SKILL GAPS IDENTIFIED",
      "res.cefr_mapping": "CEFR MAPPING",
      "res.ielts_rel": "IELTS RELEVANCE",
      "res.challenge": "CHALLENGE FACTORS",
      "res.features": "KEY LINGUISTIC FEATURES",
      "res.definition": "COGNITIVE DEFINITION",
      "res.translation": "TRANSLATION",
      "res.word_family": "WORD FAMILY",
      "res.collocations": "KEY COLLOCATIONS",
      "res.synonyms": "GRADED SYNONYMS",
      "res.register": "REGISTER",
      "res.usage": "USAGE CONTEXTS",
      "res.writing2": "IELTS WRITING TASK 2",
      "res.speaking3": "IELTS SPEAKING PART 3",
      "res.academic_note": "ACADEMIC USAGE NOTE",
      "res.band_desc": "BAND DESCRIPTORS SUPPORTED",
      "res.common_errors": "COMMON ERRORS",
      "res.error": "Error:",
      "res.correction": "Correction:",
      "res.rule": "Rule:",
      "res.avoid": "AVOIDANCE TIPS",
      "res.current_stage": "CURRENT STAGE",
      "res.progression": "PROGRESSION TRACK",
      "res.readiness": "IELTS READINESS",
      "res.recommendation": "RECOMMENDATION",
      "res.learn_next": "LEARN NEXT",
      "res.cefr_defs": "CEFR-AWARE DEFINITIONS",
      "res.defs_intro": "Key vocabulary items drawn from your topic — with learner-friendly meanings and example sentences.",
      "res.no_defs": "No definitions available for this topic.",
      "res.word": "Word",
      "res.pronounce": "Pronounce",
      "res.meaning": "MEANING",
      "res.example": "EXAMPLE",

      // Progression stage names
      "stage.recognition": "Recognition",
      "stage.controlled": "Controlled",
      "stage.semi": "Semi-Controlled",
      "stage.free": "Free Production",
      "stage.ielts": "IELTS Application",
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

      // Interface input panel
      "in.title": "موتور هوش زبانی",
      "in.sub": "هر واژه، عبارت یا ساختار دستوری را وارد کنید. NIRON یک خروجی کامل تشخیصی و آموزشی تولید می‌کند.",
      "in.params": "پارامترهای سامانه",
      "in.ielts_band": "باند هدف آیلتس",
      "in.type": "نوع هوشمندی",
      "in.mixed": "هوشمندی ترکیبی",
      "in.input": "ورودی",
      "in.input_hint": "واژه / عبارت / ساختار دستوری",
      "in.placeholder": "مثال:  'investigate'\nیا  'present perfect'\nیا  'climate change vocabulary'",
      "in.select_level": "انتخاب سطح",
      "in.select_band": "انتخاب باند",
      "in.cefr_a1": "A1 — مبتدی",
      "in.cefr_a2": "A2 — ابتدایی",
      "in.cefr_b1": "B1 — متوسط",
      "in.cefr_b2": "B2 — بالاتر از متوسط",
      "in.cefr_c1": "C1 — پیشرفته",
      "in.cefr_c2": "C2 — تسلط",
      "in.band_5": "باند 5 — محدود",
      "in.band_5_5": "باند 5.5",
      "in.band_6": "باند 6 — توانا",
      "in.band_6_5": "باند 6.5",
      "in.band_7": "باند 7 — خوب",
      "in.band_7_5": "باند 7.5",
      "in.band_8": "باند 8 — بسیار خوب",
      "in.band_9": "باند 9 — خبره",
      "in.err_cefr": "لطفاً سطح CEFR خود را انتخاب کنید",
      "in.err_ielts": "لطفاً باند هدف آیلتس خود را انتخاب کنید",
      "in.err_topic": "لطفاً یک واژه، عبارت یا ساختار وارد کنید",
      "in.generate": "تولید خروجی هوشمند",
      "in.processing": "در حال پردازش…",
      "in.copy": "کپی",
      "in.print": "چاپ",
      "in.save": "ذخیره",
      "in.clear": "پاک کردن",
      "in.saved_title": "ذخیره شد ✓",
      "in.saved_offline_title": "آفلاین ذخیره شد ✓",
      "in.save_failed_title": "ذخیره ناموفق بود — دوباره تلاش کنید",
      "in.copied": "کپی شد",
      "in.empty_1": "پارامترها را تنظیم کنید",
      "in.empty_2": "و هوشمندی را فعال کنید",
      "in.empty_3": "تا آغاز شود",

      // Loader messages
      "load.0": "در حال پردازش هوش زبانی...",
      "load.1": "در حال تحلیل واژگان...",
      "load.2": "در حال ارزیابی دستور زبان...",
      "load.3": "در حال ساخت تشخیص CEFR...",
      "load.4": "در حال بررسی دقت زبانی...",
      "load.5": "در حال آماده‌سازی توصیه‌ها...",
      "load.6": "در حال تولید بازخورد شخصی‌سازی‌شده...",

      // Toasts
      "msg.generated": "محتوا تولید شد",
      "msg.gen_failed": "تولید ناموفق بود — لطفاً دوباره تلاش کنید",
      "msg.saved": "خروجی ذخیره شد",
      "msg.saved_offline": "به‌صورت آفلاین ذخیره شد — با بازگشت اینترنت همگام می‌شود",
      "msg.save_failed": "ذخیره ممکن نشد — لطفاً دوباره تلاش کنید",

      // Errors
      "err.processing": "خطا در پردازش هوشمند",

      // Print
      "print.title": "خروجی NIRON",

      // Result labels
      "res.diag_layer": "لایهٔ تشخیص",
      "res.analysis_layer": "لایهٔ تحلیل",
      "res.core": "هوش زبانی اصلی",
      "res.ielts_app": "کاربرد آیلتس و آکادمیک",
      "res.error_intel": "هوشمندی خطاها",
      "res.guided": "تولید هدایت‌شده",
      "res.free": "تکالیف تولید آزاد",
      "res.transform": "تکالیف تبدیل",
      "res.pathway": "مسیر یادگیری",
      "res.next_step": "موتور گام بعدی",
      "res.defs_layer": "لایهٔ واژگان / تعاریف",
      "res.ielts_target": "هدف آیلتس",
      "res.band_target": "هدف باند",
      "res.input_type": "نوع ورودی",
      "res.intel_mode": "حالت هوشمندی",
      "res.type_grammar": "ساختار دستوری",
      "res.type_lexical": "واحد واژگانی",
      "res.competence": "یادداشت توانش",
      "res.skill_gaps": "شکاف‌های مهارتی شناسایی‌شده",
      "res.cefr_mapping": "نگاشت CEFR",
      "res.ielts_rel": "ارتباط با آیلتس",
      "res.challenge": "عوامل دشواری",
      "res.features": "ویژگی‌های زبانی کلیدی",
      "res.definition": "تعریف شناختی",
      "res.translation": "ترجمه",
      "res.word_family": "خانوادهٔ واژگانی",
      "res.collocations": "هم‌آیی‌های کلیدی",
      "res.synonyms": "مترادف‌های درجه‌بندی‌شده",
      "res.register": "سبک زبانی",
      "res.usage": "بافت‌های کاربرد",
      "res.writing2": "آیلتس رایتینگ تسک 2",
      "res.speaking3": "آیلتس اسپیکینگ پارت 3",
      "res.academic_note": "یادداشت کاربرد آکادمیک",
      "res.band_desc": "توصیفگرهای باند پشتیبانی‌شده",
      "res.common_errors": "خطاهای رایج",
      "res.error": "خطا:",
      "res.correction": "اصلاح:",
      "res.rule": "قاعده:",
      "res.avoid": "نکات پیشگیری",
      "res.current_stage": "مرحلهٔ فعلی",
      "res.progression": "مسیر پیشرفت",
      "res.readiness": "آمادگی آیلتس",
      "res.recommendation": "توصیه",
      "res.learn_next": "یادگیری بعدی",
      "res.cefr_defs": "تعاریف متناسب با CEFR",
      "res.defs_intro": "واژه‌های کلیدی برگرفته از موضوع شما — با معنی‌های ساده برای زبان‌آموز و جمله‌های نمونه.",
      "res.no_defs": "برای این موضوع تعریفی موجود نیست.",
      "res.word": "واژه",
      "res.pronounce": "تلفظ",
      "res.meaning": "معنی",
      "res.example": "مثال",

      // Progression stage names
      "stage.recognition": "شناسایی",
      "stage.controlled": "کنترل‌شده",
      "stage.semi": "نیمه‌کنترل‌شده",
      "stage.free": "تولید آزاد",
      "stage.ielts": "کاربرد آیلتس",
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

      // Interface input panel
      "in.title": "DİL ZEKÂSI MOTORU",
      "in.sub": "Herhangi bir kelime, ifade veya dilbilgisi yapısı girin. NIRON eksiksiz bir tanılayıcı öğrenme zekâsı çıktısı üretir.",
      "in.params": "Sistem Parametreleri",
      "in.ielts_band": "IELTS Hedef Bandı",
      "in.type": "Zekâ Türü",
      "in.mixed": "Karma Zekâ",
      "in.input": "Girdi",
      "in.input_hint": "Kelime / ifade / dilbilgisi yapısı",
      "in.placeholder": "örn.  'investigate'\nveya  'present perfect'\nveya  'climate change vocabulary'",
      "in.select_level": "Seviye Seçin",
      "in.select_band": "Band Seçin",
      "in.cefr_a1": "A1 — Başlangıç",
      "in.cefr_a2": "A2 — Temel",
      "in.cefr_b1": "B1 — Orta",
      "in.cefr_b2": "B2 — Orta-Üstü",
      "in.cefr_c1": "C1 — İleri",
      "in.cefr_c2": "C2 — Ustalık",
      "in.band_5": "Band 5 — Sınırlı",
      "in.band_5_5": "Band 5.5",
      "in.band_6": "Band 6 — Yeterli",
      "in.band_6_5": "Band 6.5",
      "in.band_7": "Band 7 — İyi",
      "in.band_7_5": "Band 7.5",
      "in.band_8": "Band 8 — Çok İyi",
      "in.band_9": "Band 9 — Uzman",
      "in.err_cefr": "Lütfen CEFR seviyenizi seçin",
      "in.err_ielts": "Lütfen IELTS hedef bandınızı seçin",
      "in.err_topic": "Lütfen bir kelime, ifade veya yapı girin",
      "in.generate": "ZEKÂYI ÜRET",
      "in.processing": "İŞLENİYOR…",
      "in.copy": "Kopyala",
      "in.print": "Yazdır",
      "in.save": "Kaydet",
      "in.clear": "Temizle",
      "in.saved_title": "Kaydedildi ✓",
      "in.saved_offline_title": "Çevrimdışı kaydedildi ✓",
      "in.save_failed_title": "Kaydedilemedi — tekrar deneyin",
      "in.copied": "KOPYALANDI",
      "in.empty_1": "Parametreleri ayarlayın",
      "in.empty_2": "ve zekâyı etkinleştirin",
      "in.empty_3": "başlamak için",

      // Loader messages
      "load.0": "Dil Zekâsı işleniyor...",
      "load.1": "Kelimeler analiz ediliyor...",
      "load.2": "Dilbilgisi değerlendiriliyor...",
      "load.3": "CEFR tanısı oluşturuluyor...",
      "load.4": "Dil doğruluğu kontrol ediliyor...",
      "load.5": "Öneriler hazırlanıyor...",
      "load.6": "Kişiselleştirilmiş geri bildirim üretiliyor...",

      // Toasts
      "msg.generated": "İçerik oluşturuldu",
      "msg.gen_failed": "Oluşturma başarısız — lütfen tekrar deneyin",
      "msg.saved": "Çıktı kaydedildi",
      "msg.saved_offline": "Çevrimdışı kaydedildi — çevrimiçi olunca eşitlenecek",
      "msg.save_failed": "Kaydedilemedi — lütfen tekrar deneyin",

      // Errors
      "err.processing": "ZEKÂ İŞLEME HATASI",

      // Print
      "print.title": "NIRON Çıktısı",

      // Result labels
      "res.diag_layer": "TANI KATMANI",
      "res.analysis_layer": "ANALİZ KATMANI",
      "res.core": "TEMEL DİL ZEKÂSI",
      "res.ielts_app": "IELTS VE AKADEMİK UYGULAMA",
      "res.error_intel": "HATA ZEKÂSI",
      "res.guided": "YÖNLENDİRMELİ ÜRETİM",
      "res.free": "SERBEST ÜRETİM GÖREVLERİ",
      "res.transform": "DÖNÜŞÜM GÖREVLERİ",
      "res.pathway": "ÖĞRENME YOL HARİTASI",
      "res.next_step": "SONRAKİ ADIM MOTORU",
      "res.defs_layer": "KELİME / TANIMLAR KATMANI",
      "res.ielts_target": "IELTS Hedefi",
      "res.band_target": "Band Hedefi",
      "res.input_type": "Girdi Türü",
      "res.intel_mode": "Zekâ Modu",
      "res.type_grammar": "Dilbilgisi Yapısı",
      "res.type_lexical": "Sözcüksel Öğe",
      "res.competence": "YETERLİK NOTU",
      "res.skill_gaps": "TESPİT EDİLEN BECERİ AÇIKLARI",
      "res.cefr_mapping": "CEFR EŞLEMESİ",
      "res.ielts_rel": "IELTS İLGİSİ",
      "res.challenge": "ZORLUK FAKTÖRLERİ",
      "res.features": "TEMEL DİLSEL ÖZELLİKLER",
      "res.definition": "BİLİŞSEL TANIM",
      "res.translation": "ÇEVİRİ",
      "res.word_family": "KELİME AİLESİ",
      "res.collocations": "TEMEL EŞDİZİMLİLİKLER",
      "res.synonyms": "DERECELENDİRİLMİŞ EŞ ANLAMLILAR",
      "res.register": "ÜSLUP DÜZEYİ",
      "res.usage": "KULLANIM BAĞLAMLARI",
      "res.writing2": "IELTS YAZMA GÖREVİ 2",
      "res.speaking3": "IELTS KONUŞMA BÖLÜM 3",
      "res.academic_note": "AKADEMİK KULLANIM NOTU",
      "res.band_desc": "DESTEKLENEN BAND TANIMLAYICILARI",
      "res.common_errors": "YAYGIN HATALAR",
      "res.error": "Hata:",
      "res.correction": "Düzeltme:",
      "res.rule": "Kural:",
      "res.avoid": "KAÇINMA İPUÇLARI",
      "res.current_stage": "MEVCUT AŞAMA",
      "res.progression": "İLERLEME ÇİZELGESİ",
      "res.readiness": "IELTS HAZIRLIĞI",
      "res.recommendation": "ÖNERİ",
      "res.learn_next": "SONRA ÖĞREN",
      "res.cefr_defs": "CEFR UYUMLU TANIMLAR",
      "res.defs_intro": "Konunuzdan alınan temel kelimeler — öğrenci dostu anlamlar ve örnek cümlelerle.",
      "res.no_defs": "Bu konu için tanım bulunmuyor.",
      "res.word": "Kelime",
      "res.pronounce": "Telaffuz et",
      "res.meaning": "ANLAM",
      "res.example": "ÖRNEK",

      // Progression stage names
      "stage.recognition": "Tanıma",
      "stage.controlled": "Kontrollü",
      "stage.semi": "Yarı Kontrollü",
      "stage.free": "Serbest Üretim",
      "stage.ielts": "IELTS Uygulaması",
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
