/**
 * NIRON — Groq API Proxy
 * Route: POST /api/grok
 *
 * Receives: { topic, cefr_level, ielts_band, type }
 * Returns:  { status: 'ok', output: { diagnosis, analysis, core_content,
 *              ielts_application, error_intelligence, practice, pathway, definitions } }
 *
 * API key is read from process.env.GROQ_API_KEY — never exposed to the browser.
 */

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL    = 'llama-3.3-70b-versatile';

// ── System prompt ────────────────────────────────────────────────────────────
function buildSystemPrompt() {
  return `You are NIRON AI, an advanced English Language Intelligence System for learning and teaching English.

ROLE:
You analyse English vocabulary items or grammar structures and return structured, educationally rich JSON output for language learners at specific CEFR levels preparing for IELTS.

SAFETY AND VALIDATION (MANDATORY FIRST STEP):
Before generating output, silently verify:
- Is the input a real English word, phrase, or grammar structure?
- Is the analysis appropriate for the given CEFR level?
- Will the output be educationally accurate and safe?
If the input is invalid or unclear, return a safe, simplified, pedagogically appropriate analysis instead. Never refuse — always adapt.

OUTPUT RULES (ABSOLUTE):
- Respond with ONLY valid JSON — no markdown, no backticks, no text outside the JSON
- Follow the exact schema provided in the user message — no extra keys, no missing keys
- Never change key names or nesting structure
- All string values must be complete, meaningful, and educationally accurate
- Arrays must always contain the exact number of items shown in the schema

CONTENT QUALITY:
- Match complexity to the learner's CEFR level
- A1/A2: simple, concrete, everyday language
- B1/B2: clear academic language with moderate complexity
- C1/C2: sophisticated, nuanced, idiomatic academic English
- All IELTS examples must reflect the correct band descriptor style
- Practice items must be genuinely useful for the learner's level

TRANSLATION FIELD (OPTIONAL):
If mother_language is provided (fa = Persian, tr = Turkish), add a translation field where specified in the schema.
- Translation is always supplementary — never replaces English content
- Use simple learner-friendly language in the target language
- If mother_language is null or absent, omit all translation fields entirely`;
}

// ── User prompt ──────────────────────────────────────────────────────────────
function buildUserPrompt(topic, cefr, ielts, type, motherLang) {
  const isGrammar  = type === 'grammar';
  const hasLang    = motherLang === 'fa' || motherLang === 'tr';
  const langName   = motherLang === 'fa' ? 'Persian (Farsi)' : motherLang === 'tr' ? 'Turkish' : '';

  const translationNote = hasLang
    ? `\nMother Language Mode is ON (${langName}). For the "definitions" array, add a "translation" field to each item with a simple ${langName} explanation of the meaning. Do NOT add translation fields to any other section.`
    : '\nMother Language Mode is OFF. Do NOT include any translation fields.';

  return `Analyse the ${isGrammar ? 'grammar structure' : 'vocabulary item'}: "${topic}"
CEFR level: ${cefr}
IELTS target band: ${ielts}
Input type: ${type}${translationNote}

Return ONLY this JSON object. All fields must be fully populated. No text outside the JSON.
STRICT RULE FOR DEFINITIONS: Every item in the "definitions" array must be a real vocabulary word or phrase. Grammar terms (noun, verb, tense, clause, auxiliary, structure, form, grammar, modal, etc.) are FORBIDDEN in the "word" field.

{
  "diagnosis": {
    "cefr_level": "${cefr}",
    "proficiency_label": "<proficiency label for ${cefr}, e.g. Upper-Intermediate>",
    "ielts_estimate": "<estimated IELTS band, e.g. 6.5>",
    "competence_note": "<one clear sentence describing learner ability with '${topic}' at ${cefr}>",
    "skill_gaps": ["<specific gap 1>", "<specific gap 2>", "<specific gap 3>"]
  },
  "analysis": {
    "type": "${isGrammar ? 'Grammar Structure' : 'Lexical Item'}",
    "cefr_mapping": "<explain how '${topic}' maps to CEFR ${cefr} expectations>",
    "ielts_relevance": "<explain where '${topic}' appears in IELTS Band ${ielts} tasks>",
    "difficulty_note": "<explain what makes '${topic}' challenging for ${cefr} learners>",
    "key_features": ["<linguistic feature 1>", "<feature 2>", "<feature 3>", "<feature 4>"]
  },
  "core_content": {
    "definition": "<precise academic definition of '${topic}'>",
    "word_family": ["<base form>", "<second form>", "<third form>", "<fourth form>"],
    "collocations": ["<natural collocation 1>", "<collocation 2>", "<collocation 3>"],
    "synonyms": ["<synonym 1>", "<synonym 2>", "<synonym 3>"],
    "register": "<describe register: formal/neutral/informal and context of use>",
    "usage_contexts": ["<context 1>", "<context 2>", "<context 3>"]
  },
  "ielts_application": {
    "writing_task2_example": "<complete sentence using '${topic}' in IELTS Writing Task 2 academic style>",
    "speaking_part3_example": "<IELTS Speaking Part 3 question or response using '${topic}'>",
    "academic_usage_note": "<targeted advice for using '${topic}' at Band ${ielts}>",
    "band_descriptor": "<Band ${ielts} — specific descriptor for this lexical or grammatical item>"
  },
  "error_intelligence": {
    "common_errors": [
      {
        "error": "<typical learner error with '${topic}'>",
        "correction": "<correct form or usage>",
        "rule": "<underlying linguistic rule that explains the correction>"
      },
      {
        "error": "<second typical learner error>",
        "correction": "<correct form>",
        "rule": "<rule>"
      }
    ],
    "avoidance_tips": ["<practical tip 1>", "<practical tip 2>", "<practical tip 3>"]
  },
  "practice": {
    "controlled": ["<controlled practice item 1>", "<item 2>", "<item 3>"],
    "guided": ["<guided production task 1>", "<task 2>", "<task 3>"],
    "free_production": ["<free production task 1>", "<task 2>"],
    "transformation": ["<transformation drill 1>", "<drill 2>", "<drill 3>"]
  },
  "pathway": {
    "current_stage": "<stage name appropriate for ${cefr}>",
    "progression_items": ["Recognition", "Controlled", "Semi-Controlled", "Free Production", "IELTS Application"],
    "ielts_readiness": "<readiness statement for Band ${ielts} using '${topic}'>",
    "recommendation": "<specific, actionable next step for this learner>",
    "next_steps": ["<step 1>", "<step 2>", "<step 3>", "<step 4>"]
  },
  "definitions": [
    {
      "word": "<vocabulary item 1 — must be a real English word or phrase directly related to '${topic}'. NEVER a grammar term (noun/verb/tense/clause/grammar/structure/form). Only concrete vocabulary.>",
      "meaning": "<learner-friendly definition suitable for ${cefr}>",
      "example": "<natural example sentence>"${hasLang ? `,\n      "translation": "<simple ${langName} explanation of meaning>"` : ''}
    },
    {
      "word": "<vocabulary item 2 — same rule: real word or phrase, NOT a grammar term>",
      "meaning": "<definition>",
      "example": "<example>"${hasLang ? `,\n      "translation": "<${langName} explanation>"` : ''}
    },
    {
      "word": "<vocabulary item 3 — same rule: real word or phrase, NOT a grammar term>",
      "meaning": "<definition>",
      "example": "<example>"${hasLang ? `,\n      "translation": "<${langName} explanation>"` : ''}
    },
    {
      "word": "<vocabulary item 4 — same rule: real word or phrase, NOT a grammar term>",
      "meaning": "<definition>",
      "example": "<example>"${hasLang ? `,\n      "translation": "<${langName} explanation>"` : ''}
    },
    {
      "word": "<vocabulary item 5 — same rule: real word or phrase, NOT a grammar term>",
      "meaning": "<definition>",
      "example": "<example>"${hasLang ? `,\n      "translation": "<${langName} explanation>"` : ''}
    }
  ]
}`;
}

// ── JSON extractor — handles model wrapping response in markdown fences ───────
function extractJSON(text) {
  try { return JSON.parse(text.trim()); } catch (_) {}
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()); } catch (_) {}
  }
  const start = text.indexOf('{');
  const end   = text.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch (_) {}
  }
  return null;
}

// ── Validate required top-level keys ─────────────────────────────────────────
function isValidOutput(obj) {
  if (!obj || typeof obj !== 'object') return false;
  const required = ['diagnosis', 'analysis', 'practice', 'pathway', 'definitions'];
  return required.every(k => k in obj);
}

// ── Main handler ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin',  req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // API key — server-side only
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ status: 'error', error: 'GROQ_API_KEY not configured on server.' });
  }

  const { topic, cefr_level, ielts_band, type, mother_language } = req.body || {};
  if (!topic || !cefr_level || !ielts_band || !type) {
    return res.status(400).json({ status: 'error', error: 'Missing required params: topic, cefr_level, ielts_band, type' });
  }

  // Call Groq
  let groqResponse;
  try {
    groqResponse = await fetch(GROQ_ENDPOINT, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model:       GROQ_MODEL,
        temperature: 0.4,
        max_tokens:  3000,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user',   content: buildUserPrompt(topic, cefr_level, ielts_band, type, mother_language || null) },
        ],
      }),
    });
  } catch (networkErr) {
    return res.status(502).json({ status: 'error', error: `Network error reaching Groq: ${networkErr.message}` });
  }

  if (!groqResponse.ok) {
    const errText = await groqResponse.text().catch(() => '');
    return res.status(502).json({
      status: 'error',
      error:  `Groq API returned ${groqResponse.status}: ${errText.slice(0, 200)}`,
    });
  }

  let groqData;
  try {
    groqData = await groqResponse.json();
  } catch (_) {
    return res.status(502).json({ status: 'error', error: 'Failed to parse Groq API response.' });
  }

  const rawContent = groqData?.choices?.[0]?.message?.content;
  if (!rawContent) {
    return res.status(502).json({ status: 'error', error: 'Groq returned empty content.' });
  }

  const output = extractJSON(rawContent);
  if (!isValidOutput(output)) {
    return res.status(502).json({
      status: 'error',
      error:  'Groq response did not match NIRON schema. Raw: ' + rawContent.slice(0, 200),
    });
  }

  return res.status(200).json({ status: 'ok', output, saved: false, id: null });
}
