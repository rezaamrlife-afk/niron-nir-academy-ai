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
  return `You are NIRON, an expert IELTS and CEFR language intelligence engine.
You receive a vocabulary or grammar input and return a structured JSON analysis for language learners.
Always respond with ONLY a valid JSON object — no markdown, no backticks, no explanation outside the JSON.
The JSON must follow the exact schema provided by the user.`;
}

// ── User prompt ──────────────────────────────────────────────────────────────
function buildUserPrompt(topic, cefr, ielts, type) {
  const isGrammar = type === 'grammar';
  return `Analyse the ${isGrammar ? 'grammar structure' : 'vocabulary item'}: "${topic}"
CEFR level of the learner: ${cefr}
IELTS target band: ${ielts}
Input type: ${type}

Return ONLY this JSON object with all fields populated. Do not include any text outside the JSON.

{
  "diagnosis": {
    "cefr_level": "${cefr}",
    "proficiency_label": "<e.g. Upper-Intermediate>",
    "ielts_estimate": "<e.g. 6.5>",
    "competence_note": "<one sentence about learner's ability with this item at ${cefr}>",
    "skill_gaps": ["<gap 1>", "<gap 2>", "<gap 3>"]
  },
  "analysis": {
    "type": "${isGrammar ? 'Grammar Structure' : 'Lexical Item'}",
    "cefr_mapping": "<how this item maps to CEFR ${cefr}>",
    "ielts_relevance": "<how this item appears in IELTS Band ${ielts} tasks>",
    "difficulty_note": "<what makes this item challenging at ${cefr}>",
    "key_features": ["<feature 1>", "<feature 2>", "<feature 3>", "<feature 4>"]
  },
  "core_content": {
    "definition": "<clear academic definition of '${topic}'>",
    "word_family": ["<base>", "<form 2>", "<form 3>", "<form 4>"],
    "collocations": ["<collocation 1>", "<collocation 2>", "<collocation 3>"],
    "synonyms": ["<synonym 1>", "<synonym 2>", "<synonym 3>"],
    "register": "<formal/neutral/informal and context>",
    "usage_contexts": ["<context 1>", "<context 2>", "<context 3>"]
  },
  "ielts_application": {
    "writing_task2_example": "<full example sentence using '${topic}' in IELTS Writing Task 2 style>",
    "speaking_part3_example": "<example question or answer using '${topic}' in IELTS Speaking Part 3 style>",
    "academic_usage_note": "<specific advice for using '${topic}' at Band ${ielts}>",
    "band_descriptor": "<Band ${ielts} — specific lexical/grammatical descriptor>"
  },
  "error_intelligence": {
    "common_errors": [
      {
        "error": "<typical learner error with '${topic}'>",
        "correction": "<correct form or usage>",
        "rule": "<underlying linguistic rule>"
      },
      {
        "error": "<second typical error>",
        "correction": "<correct form>",
        "rule": "<rule>"
      }
    ],
    "avoidance_tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
  },
  "practice": {
    "controlled": ["<controlled practice item 1>", "<item 2>", "<item 3>"],
    "guided": ["<guided task 1>", "<task 2>", "<task 3>"],
    "free_production": ["<free production task 1>", "<task 2>"],
    "transformation": ["<transformation drill 1>", "<drill 2>", "<drill 3>"]
  },
  "pathway": {
    "current_stage": "<Stage name matching ${cefr} level>",
    "progression_items": ["Recognition", "Controlled", "Semi-Controlled", "Free Production", "IELTS Application"],
    "ielts_readiness": "<readiness statement for Band ${ielts}>",
    "recommendation": "<specific next step recommendation>",
    "next_steps": ["<step 1>", "<step 2>", "<step 3>", "<step 4>"]
  },
  "definitions": [
    {
      "word": "<key term 1 related to '${topic}'>",
      "meaning": "<learner-friendly definition appropriate for ${cefr}>",
      "example": "<natural example sentence>"
    },
    {
      "word": "<key term 2>",
      "meaning": "<definition>",
      "example": "<example>"
    },
    {
      "word": "<key term 3>",
      "meaning": "<definition>",
      "example": "<example>"
    },
    {
      "word": "<key term 4>",
      "meaning": "<definition>",
      "example": "<example>"
    },
    {
      "word": "<key term 5>",
      "meaning": "<definition>",
      "example": "<example>"
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

  const { topic, cefr_level, ielts_band, type } = req.body || {};
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
          { role: 'user',   content: buildUserPrompt(topic, cefr_level, ielts_band, type) },
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
