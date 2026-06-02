/* gemini.js — Gemini API 유틸리티
   Next.js 전환 시 → API Route(/api/gemini)로 프록시하면 키가 서버에서만 노출됨 */

var GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY;

var LANG_NAMES = {
  'ja':    '일본어 (Japanese)',
  'zh-CN': '중국어 간체 (Simplified Chinese)',
  'zh-TW': '중국어 번체 (Traditional Chinese)',
  'en':    '영어 (English)',
  'th':    '태국어 (Thai)',
};

/* ── Gemini API 공통 호출 ────────────────────────────────────── */
function callGemini(prompt, callback) {
  fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(d) {
    var parts = d.candidates && d.candidates[0] && d.candidates[0].content
      ? d.candidates[0].content.parts : [];
    // thinking 파트 제외하고 실제 텍스트 파트만 추출
    var textPart = parts.filter(function(p) { return !p.thought && p.text; })[0] || parts[0];
    var text = textPart ? textPart.text.trim() : '';
    callback(null, text);
  })
  .catch(function(e) { callback(e, ''); });
}

/* ── JSON 안전 파싱 ──────────────────────────────────────────────
   Gemini가 JSON 문자열 값 안에 literal 줄바꿈을 넣는 경우 수정.
   문자 단위로 파싱하여 문자열 내부의 줄바꿈만 공백으로 교체.
────────────────────────────────────────────────────────────────── */
function fixJsonNewlines(str) {
  var result = '';
  var inStr = false;
  for (var i = 0; i < str.length; i++) {
    var c = str[i];
    if (c === '\\' && inStr) {        // 이스케이프 시퀀스 통째로 통과
      result += c + str[++i];
      continue;
    }
    if (c === '"') { inStr = !inStr; result += c; continue; }
    if ((c === '\n' || c === '\r') && inStr) { result += ' '; continue; }
    result += c;
  }
  return result;
}

function safeParseJSON(text) {
  var clean = text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
  return JSON.parse(fixJsonNewlines(clean));
}

/* ── 번역 ────────────────────────────────────────────────────────
   한국어 → 대상 언어. 의료 상담 문맥에 맞게 번역.
────────────────────────────────────────────────────────────────── */
function geminiTranslate(text, targetLangCode, callback) {
  if (!text || !text.trim()) { callback(''); return; }
  var langName = LANG_NAMES[targetLangCode] || targetLangCode;
  var prompt = '다음은 성형외과 병원 상담사가 외국인 환자에게 보낼 한국어 메시지입니다.\n'
    + langName + '로 자연스럽고 정중하게 번역해주세요.\n'
    + '번역문만 반환하고 설명은 하지 마세요.\n\n'
    + text;
  callGemini(prompt, function(err, result) {
    callback(err ? '' : result);
  });
}

/* ── AI 코칭 추천 답변 생성 ──────────────────────────────────────
   환자의 마지막 메시지 기반으로 3가지 톤의 답변을 생성.
   JSON 배열로 반환.
────────────────────────────────────────────────────────────────── */
function geminiGenerateCoaching(patientMsg, patientMsgKo, proc, targetLangCode, callback) {
  var langName = LANG_NAMES[targetLangCode] || targetLangCode;
  var prompt = '당신은 성형외과 병원(올래성형외과) 상담 코치입니다.\n'
    + '환자 관심 시술: ' + (proc || '미정') + '\n'
    + '환자 마지막 메시지(원문): ' + patientMsg + '\n'
    + '환자 마지막 메시지(한국어): ' + patientMsgKo + '\n\n'
    + '상담사가 보낼 한국어 답변 3개를 생성하고, 각각 ' + langName + '로도 번역해주세요.\n'
    + '톤: 친절한(친절), 전문적인(전문적), 간결한(간결)\n'
    + '컴플라이언스: 효과 보장 표현 금지, 부작용 안내 포함 가능\n'
    + '중요1: ko, ja 각 값은 반드시 한 줄로 작성하세요 (줄바꿈 없이).\n'
    + '중요2: 번역 결과는 반드시 "ja"라는 키 이름을 사용하세요 (다른 언어 코드 사용 금지).\n\n'
    + '코드블록 없이 JSON 배열만 반환:\n'
    + '[{"tone":"친절","ko":"한국어답변","ja":"' + langName + '번역"},{"tone":"전문적","ko":"한국어답변","ja":"번역"},{"tone":"간결","ko":"한국어답변","ja":"번역"}]';

  callGemini(prompt, function(err, result) {
    if (err || !result) { callback(null); return; }
    try {
      var parsed = safeParseJSON(result);
      var toneMeta = {
        '친절':   { toneBg:'#D1FAE5', toneTc:'#065F46' },
        '전문적': { toneBg:'#EEF2FF', toneTc:'#0D1B3E' },
        '간결':   { toneBg:'#F3F4F6', toneTc:'#374151' },
      };
      parsed.forEach(function(s) {
        // Gemini가 "ja" 대신 다른 키(zh, en, th 등)를 쓰는 경우 대응
        if (!s.ja) {
          var altKey = Object.keys(s).filter(function(k){ return k !== 'tone' && k !== 'ko'; })[0];
          if (altKey) s.ja = s[altKey];
        }
        var meta = toneMeta[s.tone] || toneMeta['간결'];
        s.toneBg = meta.toneBg;
        s.toneTc = meta.toneTc;
      });
      callback(parsed);
    } catch(e) {
      callback(null);
    }
  });
}
