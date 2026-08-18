/**
 * NIRON — Vocabulary Hub API Proxy
 * Route: POST /api/vocab
 *
 * Independent module. Does NOT touch /api/grok (the CORE engine).
 *
 * Receives: { source_type, value, cefr_level, ielts_target, count, mother_language }
 *   source_type:     'word' | 'phrase' | 'topic'
 *   value:           input text
 *   cefr_level:      'A1'..'C2'
 *   ielts_target:    '5'..'9'   (optional)
 *   count:           3 | 5 | 7   (only used when source_type === 'topic'; fallback 5)
 *   mother_language: null | 'fa' | 'tr'
 *
 * Returns: { status:'ok', words: [ { word, pos, meaning, example,
 *            collocations[], register, cefr, ielts_relevance, translation? } ] }
 *
 * API key is read from process.env.GROQ_API_KEY — never exposed to the browser.
 */

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL    = 'openai/gpt-oss-120b';

// ── System prompt ────────────────────────────────────────────────────────────
function buildSystemPrompt() {
  return `You are NIRON Vocabulary Hub, an English vocabulary learning engine for CEFR and IELTS learners.
You turn an input (word, phrase, or topic) into structured vocabulary learning data as STRICT JSON.

OUTPUT RULES (ABSOLUTE):
- Respond with ONLY valid JSON — no markdown, no backticks, no text outside the JSON.
- Follow the exact schema given in the user message — no extra keys, no missing keys.
- Every "word" must be a real English vocabulary word or phrase — never a grammar term (noun, verb, tense, clause, etc.).
- Match difficulty and explanation style to the learner's CEFR level.
- All example sentences must be natural, correct, and useful for the learner's level.
- "register" must be exactly one of: formal, neutral, informal.`;
}

// ── User prompt ──────────────────────────────────────────────────────────────
// Branching (word / phrase / topic) is decided HERE in JS, not by the model.
function buildUserPrompt(sourceType, value, cefr, ielts, count, motherLang) {
  const hasLang  = motherLang === 'fa' || motherLang === 'tr';
  const langName = motherLang === 'fa' ? 'Persian (Farsi)' : motherLang === 'tr' ? 'Turkish' : '';
  const transField = hasLang
    ? `,\n      "translation": "<simple ${langName} explanation of the meaning>"`
    : '';
  const transNote = hasLang
    ? `Mother Language Mode is ON (${langName}). Add a "translation" field to every item with a simple ${langName} explanation of the meaning.`
    : `Mother Language Mode is OFF. Do NOT include any translation field.`;

  const ieltsLine = ielts ? `IELTS target band: ${ielts}` : '';

  // Decide how many items to produce — backend-enforced
  let n, intro;
  if (sourceType === 'word') {
    n = 1;
    intro = `Expand this single English word into one detailed vocabulary entry: "${value}".`;
  } else if (sourceType === 'phrase') {
    n = 1;
    intro = `Treat this English phrase as a single concept and produce one vocabulary entry: "${value}".`;
  } else {
    n = count;
    intro = `Generate exactly ${count} useful English vocabulary items related to the topic: "${value}".`;
  }

  // Build schema with exactly n items
  const items = [];
  for (let i = 0; i < n; i++) {
    const label = sourceType === 'topic'
      ? `vocabulary word or phrase ${i + 1} related to '${value}'`
      : `the vocabulary item for "${value}"`;
    items.push(`    {
      "word": "<${label}>",
      "pos": "<part of speech: noun / verb / adjective / adverb / phrase>",
      "meaning": "<learner-friendly definition suitable for ${cefr}>",
      "example": "<natural example sentence using the word>",
      "collocations": ["<collocation 1>", "<collocation 2>", "<collocation 3>"],
      "register": "<formal / neutral / informal>",
      "cefr": "${cefr}",
      "ielts_relevance": "<one short sentence on how this word is useful in IELTS${ielts ? ` Band ${ielts}` : ''}>"${transField}
    }`);
  }

  return `${intro}
CEFR level: ${cefr}
${ieltsLine}
${transNote}

Return ONLY this JSON object. All fields must be fully populated. No text outside the JSON.

{
  "words": [
${items.join(',\n')}
  ]
}`;
}

// ── JSON extractor ───────────────────────────────────────────────────────────
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

// ── Validate ─────────────────────────────────────────────────────────────────
function isValidOutput(obj) {
  return obj && typeof obj === 'object' && Array.isArray(obj.words) && obj.words.length > 0;
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

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ status: 'error', error: 'GROQ_API_KEY not configured on server.' });
  }

  let { source_type, value, cefr_level, ielts_target, count, mother_language } = req.body || {};

  // ── Backend validation & deterministic defaults ──
  if (!value || !cefr_level) {
    return res.status(400).json({ status: 'error', error: 'Missing required params: value, cefr_level' });
  }
  if (!['word', 'phrase', 'topic'].includes(source_type)) {
    source_type = 'topic';            // safe default
  }
  if (![3, 5, 7].includes(count)) {
    count = 5;                         // fallback
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
          { role: 'user',   content: buildUserPrompt(source_type, value, cefr_level, ielts_target || null, count, mother_language || null) },
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
      error:  'Groq response did not match Vocab schema. Raw: ' + rawContent.slice(0, 200),
    });
  }

  return res.status(200).json({ status: 'ok', words: output.words });
}
