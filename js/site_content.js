/* ================================================================
   site_content.js — 10개 섹션 콘텐츠 에디터
   데이터: mock-data-hospital.js (TODO: 실제 API로 교체)
   AI 재집필: gemini.js (callGemini)
================================================================ */

var curSection = 'hero';
var curLang    = MOCK_CURRENT_LANG;
var _imgPickerCb = null;  // 이미지 피커 콜백
var _imgPickerSel = [];   // 피커 선택 목록

/* ── 섹션 메타 정의 ─────────────────────────────────────────── */
var SECTIONS = [
  { id:'hero',       num:'01', name:'Hero',           icon:'🏠', data:function(){ return MOCK_SEC_HERO; } },
  { id:'decision',   num:'02', name:'DECISION GUIDE', icon:'🧭', data:function(){ return MOCK_SEC_DECISION; } },
  { id:'doctors',    num:'03', name:'의사 소개',        icon:'👨‍⚕️', data:function(){ return MOCK_SEC_DOCTORS; } },
  { id:'treatments', num:'04', name:'시술 메뉴',        icon:'💉', data:function(){ return MOCK_SEC_TREATMENTS; } },
  { id:'cases',      num:'05', name:'REAL CASES',      icon:'📸', data:function(){ return MOCK_SEC_CASES; } },
  { id:'reviews',    num:'06', name:'REAL REVIEWS',    icon:'⭐', data:function(){ return MOCK_SEC_REVIEWS; } },
  { id:'faq',        num:'07', name:'FAQ',              icon:'❓', data:function(){ return MOCK_SEC_FAQ; } },
  { id:'guarantee',  num:'08', name:'서비스 보장',      icon:'🛡',  data:function(){ return MOCK_SEC_GUARANTEE; } },
  { id:'consult',    num:'09', name:'무료 상담 시작',   icon:'💬', data:function(){ return MOCK_SEC_CONSULT; } },
  { id:'footer',     num:'10', name:'푸터',             icon:'📌', data:function(){ return MOCK_SEC_FOOTER; } },
];

/* ── 상태 칩 렌더 헬퍼 ─────────────────────────────────────── */
var STATUS_MAP = {
  collected:  { cls:'chip-gray',  label:'수집됨'       },
  ai_gen:     { cls:'chip-gray',  label:'AI 생성'      },
  no_image:   { cls:'chip-red',   label:'이미지 없음'  },
  done:       { cls:'chip-light', label:'완료'         },
  pending:    { cls:'chip-gray',  label:'검수 대기'    },
};
var TRANS_MAP = {
  none:   { cls:'ts-none',   label:'미번역'    },
  ai:     { cls:'ts-ai',     label:'AI 의역'   },
  review: { cls:'ts-review', label:'검수 대기' },
  done:   { cls:'ts-done',   label:'완료'      },
};

function secChip(status) {
  var m = STATUS_MAP[status] || STATUS_MAP.pending;
  return '<span class="sec-chip ' + m.cls + '">' + m.label + '</span>';
}
function transChip(ts) {
  var m = TRANS_MAP[ts] || TRANS_MAP.none;
  return '<span class="trans-status-chip ' + m.cls + '">' + m.label + '</span>';
}
function getLangLabel() {
  var opt = MOCK_LANG_OPTIONS.find(function(o){ return o.code === curLang; });
  return opt ? opt.flag + ' ' + opt.label : '번역';
}

/* 현재 선택 언어의 번역 객체 반환 — { text, ts } */
function getTrans(tf) {
  if (!tf) return {text:'', ts:'none'};
  if (tf.translations) return tf.translations[curLang] || {text:'', ts:'none'};
  return {text: tf.translated||'', ts: tf.ts||'none'}; // 구형 포맷 호환
}

/* ── 섹션 목록 렌더 ─────────────────────────────────────────── */
function renderSectionList() {
  var list = document.getElementById('section-list');
  if (!list) return;
  list.innerHTML = SECTIONS.map(function(s) {
    var d = s.data();
    var active = s.id === curSection ? ' active' : '';
    return '<div class="section-item' + active + '" onclick="selectSection(\'' + s.id + '\')">'
      + '<div class="sec-num">' + s.num + '</div>'
      + '<span style="font-size:15px">' + s.icon + '</span>'
      + '<span class="sec-name">' + s.name + '</span>'
      + secChip(d.status)
      + '</div>';
  }).join('');
}

/* ── 섹션 선택 ───────────────────────────────────────────────── */
function selectSection(id) {
  curSection = id;
  renderSectionList();
  var sec = SECTIONS.find(function(s){ return s.id === id; });
  if (!sec) return;
  var renderer = RENDERERS[id];
  var panel = document.getElementById('edit-panel');
  if (panel && renderer) {
    panel.innerHTML = renderer(sec.data());
    panel.scrollTop = 0;
  }
}

/* ── 언어 전환 ───────────────────────────────────────────────── */
function renderLangDropdown() {
  var dd = document.getElementById('lang-dropdown');
  if (!dd) return;
  dd.innerHTML = MOCK_LANG_OPTIONS.map(function(o) {
    var active = o.code === curLang ? ' active' : '';
    return '<div class="lang-option' + active + '" onclick="setLang(\'' + o.code + '\')">'
      + o.flag + ' <span>' + o.label + '</span>'
      + '<span style="font-size:11px;color:var(--s400);margin-left:4px">' + o.name + '</span>'
      + '</div>';
  }).join('');
}
function toggleLangDropdown() {
  var dd = document.getElementById('lang-dropdown');
  if (dd) dd.classList.toggle('open');
}
function setLang(code) {
  curLang = code;
  var opt = MOCK_LANG_OPTIONS.find(function(o){ return o.code === code; });
  if (opt) {
    var flagEl  = document.getElementById('lang-flag');
    var labelEl = document.getElementById('lang-label');
    if (flagEl)  flagEl.textContent  = opt.flag;
    if (labelEl) labelEl.textContent = opt.label;
  }
  var dd = document.getElementById('lang-dropdown');
  if (dd) dd.classList.remove('open');
  renderLangDropdown();
  selectSection(curSection); // 패널 재렌더
  updateTransSummary();
}

/* ── 번역 현황 요약 ──────────────────────────────────────────── */
function updateTransSummary() {
  var el = document.getElementById('trans-summary');
  if (!el) return;
  var labels = { none:'미번역', ai:'AI 의역', review:'검수 대기', done:'완료' };
  var counts = { none:0, ai:0, review:0, done:0 };
  // 주요 섹션들의 번역 상태 집계 (Hero 기준 예시)
  function countField(tf) { if (tf) { var tr = getTrans(tf); counts[tr.ts] = (counts[tr.ts]||0) + 1; } }
  countField(MOCK_SEC_HERO.headline); countField(MOCK_SEC_HERO.subtext);
  countField(MOCK_SEC_HERO.lineBtn); countField(MOCK_SEC_HERO.decisionBtn);
  MOCK_SEC_FAQ.items.forEach(function(i){ countField(i.q); countField(i.a); });
  MOCK_SEC_DECISION.items.forEach(function(i){ countField(i.anxiety); });

  var total = counts.none + counts.ai + counts.review + counts.done;
  el.innerHTML = Object.keys(counts).map(function(k) {
    if (counts[k] === 0) return '';
    return '<div style="display:flex;align-items:center;justify-content:space-between">'
      + '<span class="trans-status-chip ts-' + k + '">' + labels[k] + '</span>'
      + '<span style="font-size:12px;font-weight:600;color:var(--s700)">' + counts[k] + '건</span>'
      + '</div>';
  }).join('');

  var overall = document.getElementById('trans-overall');
  if (overall) {
    var pct = total > 0 ? Math.round(counts.done / total * 100) : 0;
    overall.textContent = '번역 ' + pct + '%';
    overall.className = 'sec-chip ' + (pct === 100 ? 'chip-light' : 'chip-gray');
  }
}

/* ── 공통: 번역 필드 렌더 ────────────────────────────────────── */
function tfBlock(label, fieldId, tf, rows) {
  rows = rows || 3;
  var langLbl = getLangLabel();
  var tr = getTrans(tf);
  return '<div class="trans-block">'
    + '<div class="trans-block-label"><span>' + label + '</span></div>'
    + '<div class="trans-row">'
    + '<div class="trans-col">'
    + '<div class="trans-sublabel">🇰🇷 한국어 원문</div>'
    + '<div class="trans-orig">' + (tf.ko || '') + '</div>'
    + '</div>'
    + '<div class="trans-col">'
    + '<div class="trans-sublabel">' + langLbl + ' ' + transChip(tr.ts)
    + '<button class="btn" style="font-size:10px;padding:2px 8px;margin-left:auto" onclick="aiTranslate(\'' + fieldId + '\')" title="AI 의역">✨ AI 의역</button>'
    + '</div>'
    + '<textarea class="trans-input" id="tf-' + fieldId + '" rows="' + rows + '">' + (tr.text || '') + '</textarea>'
    + '</div>'
    + '</div>'
    + '</div>';
}

/* ── 공통: AI 의역 (Gemini) ─────────────────────────────────── */
function aiTranslate(fieldId) {
  var origEl = document.querySelector('#tf-' + fieldId);
  if (!origEl) { showToast('입력 필드를 찾을 수 없습니다.', 'error'); return; }
  // TODO: 실제 원문을 찾아서 번역. 현재는 textarea 위 원문 div에서 읽음
  var transBlock = origEl.closest('.trans-block');
  var origDiv = transBlock ? transBlock.querySelector('.trans-orig') : null;
  var koText = origDiv ? origDiv.textContent.trim() : '';
  if (!koText) { showToast('원문이 없습니다.', 'error'); return; }

  var langOpt = MOCK_LANG_OPTIONS.find(function(o){ return o.code === curLang; });
  var langName = langOpt ? langOpt.name : '일본어';

  origEl.style.background = '#EFF6FF'; origEl.style.borderColor = '#93C5FD';
  var prompt = '당신은 한국 성형외과 병원의 의료 마케팅 전문 카피라이터입니다.\n'
    + '아래 한국어 원문을 ' + langName + '(으)로 자연스럽게 의역해주세요.\n'
    + '- 직역이 아닌 현지 감성에 맞는 의역\n'
    + '- 의료광고 가이드라인 준수\n'
    + '- 번역된 텍스트만 반환 (설명·주석 없이)\n\n'
    + '원문:\n' + koText;

  callGemini(prompt, function(err, result) {
    origEl.style.background = ''; origEl.style.borderColor = '';
    if (err || !result) { showToast('AI 의역 실패. 잠시 후 다시 시도하세요.', 'error'); return; }
    origEl.value = result.trim();
    origEl.style.background = '#F0FDF4'; origEl.style.borderColor = '#6EE7B7';
    setTimeout(function(){ origEl.style.background = ''; origEl.style.borderColor = ''; }, 1500);
    showToast('✓ AI 의역 완료', 'success');
  });
}

/* ── 공통: 이미지 업로드 영역 렌더 ─────────────────────────── */
function imgZone(hasImage, src, label, cb, required) {
  if (hasImage && src) {
    return '<div style="position:relative;display:inline-block">'
      + '<div style="width:120px;height:120px;border-radius:var(--r);background:var(--s100);display:flex;align-items:center;justify-content:center;font-size:40px;border:1px solid var(--s200)">🖼</div>'
      + '<button onclick="' + cb + '" class="btn" style="position:absolute;bottom:6px;right:6px;font-size:11px;padding:3px 8px">교체</button>'
      + '</div>';
  }
  var cls = required ? 'img-upload-req' : 'img-upload-opt';
  return '<div class="' + cls + '" onclick="' + cb + '" style="max-width:300px">'
    + '<div style="font-size:24px;margin-bottom:6px">' + (required ? '📷' : '📁') + '</div>'
    + '<div style="font-size:13px;font-weight:500;color:' + (required ? '#991B1B' : 'var(--s700)') + '">' + label + '</div>'
    + '<div style="font-size:11px;color:' + (required ? '#DC2626' : 'var(--s400)') + ';margin-top:2px">' + (required ? '이미지 직접 업로드 필수 (AI 생성 금지)' : 'PNG, JPG, WebP · 최대 10MB') + '</div>'
    + '</div>';
}

/* ════════════════════════════════════════════════
   섹션 렌더러
════════════════════════════════════════════════ */
var RENDERERS = {};

/* ── 01. Hero ────────────────────────────────────────────────── */
RENDERERS.hero = function(d) {
  return '<div class="edit-panel-head">'
    + '<div class="ep-title">🏠 Hero (최상단)</div>'
    + '<div class="ep-actions">' + secChip(d.status) + '</div>'
    + '</div>'
    + '<div class="ai-inline"><div class="ai-inline-dot"></div>'
    + '<span>AI가 한국 사이트에서 텍스트를 수집했습니다. 헤드라인과 서브텍스트를 확인하고 의역을 검수하세요.</span></div>'
    + '<div style="padding:14px 20px;border-top:1px solid var(--s100)">'
    + '<div style="font-size:12px;font-weight:600;color:var(--s500);margin-bottom:10px;text-transform:uppercase;letter-spacing:.04em">대표 이미지</div>'
    + imgZone(d.image.hasImage, d.image.src, d.image.label, 'openImgPicker(\'hero-img\')', false)
    + '</div>'
    + tfBlock('헤드라인 카피',    'hero-headline',    d.headline,    3)
    + tfBlock('서브텍스트',       'hero-subtext',     d.subtext,     3)
    + tfBlock('LINE 버튼 텍스트', 'hero-lineBtn',     d.lineBtn,     1)
    + tfBlock('불안 선택 버튼',   'hero-decisionBtn', d.decisionBtn, 1)
    + '<div class="save-bar"><span class="save-info">자동 저장됨</span>'
    + '<button class="btn btn-primary" onclick="saveSection(\'hero\')">저장</button></div>';
};

/* ── 02. DECISION GUIDE ─────────────────────────────────────── */
RENDERERS.decision = function(d) {
  var items = d.items.map(function(item, i) {
    var doctors = (MOCK_SEC_DOCTORS.items || []).map(function(doc) {
      return '<option value="' + doc.id + '"' + (item.doctorId === doc.id ? ' selected' : '') + '>' + doc.name.ko + '</option>';
    }).join('');
    return '<div class="list-item">'
      + '<div class="list-item-head">'
      + '<span style="font-size:12px;color:var(--s400);min-width:20px">' + (i+1) + '</span>'
      + '<span style="flex:1">' + (item.anxiety.ko || '(내용 없음)') + '</span>'
      + transChip(getTrans(item.anxiety).ts)
      + '<button onclick="deleteDecisionItem(' + item.id + ')" style="background:none;border:none;color:var(--s400);cursor:pointer;font-size:14px;padding:0 4px">✕</button>'
      + '</div>'
      + '<div class="list-item-body">'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:8px">'
      + '<div><div style="font-size:11px;font-weight:600;color:var(--s400);margin-bottom:4px">🇰🇷 불안 요소</div>'
      + '<input type="text" value="' + (item.anxiety.ko || '') + '" style="width:100%;padding:6px 10px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit" placeholder="불안 요소 텍스트"></div>'
      + '<div><div style="font-size:11px;font-weight:600;color:var(--s400);margin-bottom:4px">' + getLangLabel() + '</div>'
      + '<input type="text" value="' + (getTrans(item.anxiety).text || '') + '" style="width:100%;padding:6px 10px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit" placeholder="의역 텍스트"></div>'
      + '</div>'
      + '<div style="display:flex;align-items:center;gap:8px">'
      + '<span style="font-size:12px;color:var(--s500);flex-shrink:0;white-space:nowrap">추천 의사:</span>'
      + '<select style="width:auto;flex:1;min-width:0;padding:4px 8px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit">' + doctors + '</select>'
      + '</div>'
      + '</div></div>';
  }).join('');

  return '<div class="edit-panel-head">'
    + '<div class="ep-title">🧭 DECISION GUIDE</div>'
    + '<div class="ep-actions">' + secChip(d.status)
    + '<button class="btn" style="font-size:12px" onclick="addDecisionItem()">+ 항목 추가</button>'
    + '</div></div>'
    + '<div class="ai-inline"><div class="ai-inline-dot"></div>'
    + '<span>진료과에 맞게 8개 불안 요소가 AI 생성됐습니다. 내용을 검토하고 추천 의사를 매칭하세요.</span></div>'
    + '<div style="padding:14px 20px">' + items + '</div>'
    + '<div class="save-bar"><span class="save-info">자동 저장됨</span>'
    + '<button class="btn btn-primary" onclick="saveSection(\'decision\')">저장</button></div>';
};

/* ── 03. 의사 소개 ───────────────────────────────────────────── */
RENDERERS.doctors = function(d) {
  var visToggle = '<div class="tog-row" style="padding:14px 20px;border-top:1px solid var(--s100)">'
    + '<div class="tog-sw ' + (d.sectionVisible ? 'on' : 'off') + '" onclick="toggleDoctorSection(this)"></div>'
    + '<div class="tog-info"><div class="tog-title">섹션 노출</div>'
    + '<div class="tog-desc">의사가 1명이면 자동 비노출 처리됩니다</div></div>'
    + '<span style="font-size:12px;color:var(--s500)">' + (d.sectionVisible ? '노출' : '비노출') + '</span>'
    + '</div>';

  var langLbl = getLangLabel();
  var inStyle = 'padding:6px 10px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit;width:100%';
  var gridStyle = 'display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px';
  var subLbl = function(flag, txt){ return '<div style="font-size:10px;font-weight:600;color:var(--s400);margin-bottom:3px">' + flag + ' ' + txt + '</div>'; };

  var cards = d.items.map(function(doc) {
    return '<div class="list-item" style="margin-bottom:10px">'
      + '<div class="list-item-head">'
      + '<span style="font-size:18px">👨‍⚕️</span>'
      + '<span style="flex:1;font-size:13px;font-weight:600;color:var(--navy)">' + doc.name.ko + '</span>'
      + transChip(doc.name.ts)
      + '<div class="order-btns"><button class="order-btn">↑</button><button class="order-btn">↓</button></div>'
      + '<button onclick="deleteDoctor(' + doc.id + ')" style="background:none;border:none;color:var(--s400);cursor:pointer;font-size:14px;padding:0 4px">✕</button>'
      + '</div>'
      + '<div class="list-item-body">'

      /* 사진 + 필드 2열 */
      + '<div style="display:flex;gap:12px;margin-bottom:10px">'
      + imgZone(doc.image != null, doc.image, '의사 프로필 사진', 'openImgPicker(\'doc-' + doc.id + '\')', true)
      + '<div style="flex:1">'

      /* 이름 */
      + '<div style="' + gridStyle + '">'
      + '<div>' + subLbl('🇰🇷', '이름') + '<input type="text" value="' + doc.name.ko + '" placeholder="이름" style="' + inStyle + '"></div>'
      + '<div>' + subLbl(langLbl, '이름') + '<input type="text" value="' + (getTrans(doc.name).text||'') + '" placeholder="' + langLbl + '" style="' + inStyle + '"></div>'
      + '</div>'

      /* 직함 */
      + '<div style="' + gridStyle + '">'
      + '<div>' + subLbl('🇰🇷', '직함') + '<input type="text" value="' + doc.title.ko + '" placeholder="대표원장 등" style="' + inStyle + '"></div>'
      + '<div>' + subLbl(langLbl, '직함') + '<input type="text" value="' + (getTrans(doc.title).text||'') + '" placeholder="' + langLbl + '" style="' + inStyle + '"></div>'
      + '</div>'

      /* 경력 */
      + '<div style="' + gridStyle + '">'
      + '<div>' + subLbl('🇰🇷', '경력') + '<input type="text" value="' + doc.career.ko + '" placeholder="경력" style="' + inStyle + '"></div>'
      + '<div>' + subLbl(langLbl, '경력') + '<input type="text" value="' + (getTrans(doc.career).text||'') + '" placeholder="' + langLbl + '" style="' + inStyle + '"></div>'
      + '</div>'

      + '</div></div>' /* /flex */

      /* 소개 2열 */
      + '<div style="' + gridStyle + ';margin-bottom:8px">'
      + '<div>' + subLbl('🇰🇷', '소개')
      + '<textarea rows="2" style="' + inStyle + ';resize:vertical">' + doc.desc.ko + '</textarea></div>'
      + '<div>' + subLbl(langLbl, '소개')
      + '<textarea rows="2" style="' + inStyle + ';resize:vertical">' + (getTrans(doc.desc).text||'') + '</textarea></div>'
      + '</div>'

      /* 태그 */
      + '<div style="display:flex;gap:4px;flex-wrap:wrap">'
      + doc.tags.map(function(t){ return '<span style="font-size:11px;padding:2px 8px;border-radius:4px;background:var(--s100);color:var(--s700)">' + t + ' <span style="cursor:pointer;color:var(--s400)">✕</span></span>'; }).join('')
      + '<input type="text" placeholder="태그 추가 후 Enter" style="font-size:11px;padding:2px 8px;border:1px dashed var(--s200);border-radius:4px;outline:none;width:120px;font-family:inherit">'
      + '</div></div></div>';
  }).join('');

  return '<div class="edit-panel-head">'
    + '<div class="ep-title">👨‍⚕️ 의사 소개</div>'
    + '<div class="ep-actions">' + secChip(d.status)
    + '<button class="btn" style="font-size:12px" onclick="addDoctor()">+ 의사 추가</button>'
    + '</div></div>'
    + visToggle
    + '<div style="padding:14px 20px">' + cards + '</div>'
    + '<div class="save-bar"><span class="save-info">자동 저장됨</span>'
    + '<button class="btn btn-primary" onclick="saveSection(\'doctors\')">저장</button></div>';
};

/* ── 04. 시술 메뉴 ───────────────────────────────────────────── */
RENDERERS.treatments = function(d) {
  var items = d.items.map(function(t, i) {
    return '<div class="list-item" style="margin-bottom:8px">'
      + '<div class="list-item-head">'
      + '<span style="font-size:18px">' + t.icon + '</span>'
      + '<span style="flex:1;font-size:13px;font-weight:600;color:var(--navy)">' + t.name.ko + '</span>'
      + transChip(getTrans(t.detail).ts)
      + '<div class="order-btns"><button class="order-btn">↑</button><button class="order-btn">↓</button></div>'
      + '<button onclick="deleteTreatment(\'' + t.id + '\')" style="background:none;border:none;color:var(--s400);cursor:pointer;font-size:14px;padding:0 4px">✕</button>'
      + '</div>'
      + '<div class="list-item-body">'
      + '<div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:10px">'
      + imgZone(t.image != null, t.image, '시술 이미지 (없으면 AI 생성)', 'openImgPicker(\'treat-' + t.id + '\')', false)
      + '<div style="flex:1">'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">'
      + '<input type="text" value="' + t.name.ko + '" placeholder="시술명" style="padding:6px 10px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit">'
      + '<input type="text" value="' + (getTrans(t.name).text||'') + '" placeholder="번역본 (' + getLangLabel() + ') 시술명" style="padding:6px 10px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit;background:var(--s50)">'
      + '</div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'
      + '<input type="text" value="' + t.brief.ko + '" placeholder="가격·한줄 요약" style="padding:6px 10px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit">'
      + '<input type="text" value="' + (getTrans(t.brief).text||'') + '" placeholder="번역본 (' + getLangLabel() + ')" style="padding:6px 10px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit;background:var(--s50)">'
      + '</div>'
      + '</div></div>'
      + '<details style="border-top:1px solid var(--s100);padding-top:10px">'
      + '<summary style="font-size:12px;color:var(--blue);cursor:pointer;font-weight:500;list-style:none">📄 팝업 상세 내용 편집 ▸</summary>'
      + '<div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:10px">'
      + '<textarea rows="4" placeholder="한국어 상세" style="width:100%;padding:8px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit;resize:vertical">' + t.detail.ko + '</textarea>'
      + '<textarea rows="4" placeholder="번역본 (' + getLangLabel() + ') 상세" style="width:100%;padding:8px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit;resize:vertical;background:var(--s50)">' + (getTrans(t.detail).text||'') + '</textarea>'
      + '</div></details>'
      + '</div></div>';
  }).join('');

  return '<div class="edit-panel-head">'
    + '<div class="ep-title">💉 시술 메뉴</div>'
    + '<div class="ep-actions">' + secChip(d.status)
    + '<button class="btn" style="font-size:12px" onclick="addTreatment()">+ 시술 추가</button>'
    + '</div></div>'
    + '<div class="ai-inline"><div class="ai-inline-dot"></div>'
    + '<span>이미지가 없는 시술은 AI가 톤에 맞춰 이미지를 생성합니다. REAL CASES는 AI 생성 금지입니다.</span></div>'
    + '<div style="padding:14px 20px">' + items + '</div>'
    + '<div class="save-bar"><span class="save-info">자동 저장됨</span>'
    + '<button class="btn btn-primary" onclick="saveSection(\'treatments\')">저장</button></div>';
};

/* ── 05. REAL CASES ─────────────────────────────────────────── */
RENDERERS.cases = function(d) {
  var items = d.items.map(function(c, i) {
    return '<div class="list-item" style="margin-bottom:8px">'
      + '<div class="list-item-head">'
      + '<span style="font-size:12px;color:var(--s400)">CASE ' + (i+1) + '</span>'
      + '<span style="flex:1;font-size:12px;color:var(--s700)">' + c.category + '</span>'
      + '<button onclick="deleteCase(' + c.id + ')" style="background:none;border:none;color:var(--s400);cursor:pointer;font-size:14px">✕</button>'
      + '</div>'
      + '<div class="list-item-body" style="display:flex;gap:12px;align-items:flex-start">'
      + imgZone(c.image != null, c.image, '시술 사진 업로드', 'openImgPicker(\'case-' + c.id + '\')', true)
      + '<div style="flex:1">'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'
      + '<input type="text" value="' + c.desc.ko + '" placeholder="설명 (시술·연령·다운타임 등)" style="padding:6px 10px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit">'
      + '<input type="text" value="' + (getTrans(c.desc).text||'') + '" placeholder="번역본 (' + getLangLabel() + ')" style="padding:6px 10px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit;background:var(--s50)">'
      + '</div>'
      + '</div></div></div>';
  }).join('');

  return '<div class="edit-panel-head">'
    + '<div class="ep-title">📸 REAL CASES</div>'
    + '<div class="ep-actions">' + secChip(d.status)
    + '<button class="btn" style="font-size:12px" onclick="addCase()">+ 케이스 추가</button>'
    + '</div></div>'
    + '<div class="no-image-banner">⚠ <strong>이미지 없음 — 관리자 직접 등록 필요.</strong>&nbsp; AI 이미지 생성은 이 섹션에서 금지됩니다.</div>'
    + '<div style="padding:14px 20px">' + items + '</div>'
    + '<div class="save-bar"><span class="save-info">자동 저장됨</span>'
    + '<button class="btn btn-primary" onclick="saveSection(\'cases\')">저장</button></div>';
};

/* ── 06. REAL REVIEWS ───────────────────────────────────────── */
RENDERERS.reviews = function(d) {
  var items = d.items.map(function(r, i) {
    var stars = '★'.repeat(r.rating) + '☆'.repeat(5-r.rating);
    return '<div class="list-item" style="margin-bottom:8px">'
      + '<div class="list-item-head">'
      + '<span style="font-size:12px;color:#F59E0B">' + stars + '</span>'
      + '<span style="flex:1;font-size:12px;color:var(--s500)">' + r.from + '</span>'
      + '<button onclick="deleteReview(' + r.id + ')" style="background:none;border:none;color:var(--s400);cursor:pointer;font-size:14px">✕</button>'
      + '</div>'
      + '<div class="list-item-body" style="display:flex;gap:12px;align-items:flex-start">'
      + imgZone(r.image != null, r.image, '후기 사진 업로드', 'openImgPicker(\'rev-' + r.id + '\')', true)
      + '<div style="flex:1">'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px">'
      + '<textarea rows="3" placeholder="후기 텍스트 (한국어)" style="width:100%;padding:6px 10px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit;resize:vertical">' + r.text.ko + '</textarea>'
      + '<textarea rows="3" placeholder="번역본 (' + getLangLabel() + ')" style="width:100%;padding:6px 10px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit;resize:vertical;background:var(--s50)">' + (getTrans(r.text).text||'') + '</textarea>'
      + '</div>'
      + '<div style="display:flex;align-items:center;gap:8px">'
      + '<span style="font-size:12px;color:var(--s500)">별점:</span>'
      + '<select style="width:auto;padding:3px 8px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit">'
      + [5,4,3,2,1].map(function(n){ return '<option' + (n===r.rating?' selected':'') + '>' + n + '점</option>'; }).join('')
      + '</select>'
      + '<span style="font-size:12px;color:var(--s500)">출처:</span>'
      + '<input type="text" value="' + r.from + '" style="flex:1;padding:3px 8px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit">'
      + '</div></div></div></div>';
  }).join('');

  return '<div class="edit-panel-head">'
    + '<div class="ep-title">⭐ REAL REVIEWS</div>'
    + '<div class="ep-actions">' + secChip(d.status)
    + '<button class="btn" style="font-size:12px" onclick="addReview()">+ 후기 추가</button>'
    + '</div></div>'
    + '<div class="no-image-banner">⚠ <strong>이미지 없음 — 관리자 직접 등록 필요.</strong>&nbsp; AI 이미지 생성은 이 섹션에서 금지됩니다.</div>'
    + '<div style="padding:14px 20px">' + items + '</div>'
    + '<div class="save-bar"><span class="save-info">자동 저장됨</span>'
    + '<button class="btn btn-primary" onclick="saveSection(\'reviews\')">저장</button></div>';
};

/* ── 07. FAQ ─────────────────────────────────────────────────── */
RENDERERS.faq = function(d) {
  var items = d.items.map(function(item, i) {
    return '<div class="list-item" style="margin-bottom:8px">'
      + '<div class="list-item-head">'
      + '<span style="font-size:11px;font-weight:700;color:var(--s400);min-width:20px">Q' + item.order + '</span>'
      + '<span style="flex:1;font-size:12px;color:var(--s700)">' + item.q.ko + '</span>'
      + transChip(getTrans(item.q).ts)
      + '<div class="order-btns"><button class="order-btn">↑</button><button class="order-btn">↓</button></div>'
      + '<button onclick="deleteFaq(' + item.id + ')" style="background:none;border:none;color:var(--s400);cursor:pointer;font-size:14px">✕</button>'
      + '</div>'
      + '<div class="faq-qa">'
      + '<div><div class="faq-label">Q — 질문</div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'
      + '<textarea class="faq-input" rows="2" placeholder="한국어 질문">' + item.q.ko + '</textarea>'
      + '<textarea class="faq-input" rows="2" placeholder="번역본 (' + getLangLabel() + ')" style="background:var(--s50)">' + (getTrans(item.q).text||'') + '</textarea>'
      + '</div></div>'
      + '<div><div class="faq-label">A — 답변</div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'
      + '<textarea class="faq-input" rows="2" placeholder="한국어 답변">' + item.a.ko + '</textarea>'
      + '<textarea class="faq-input" rows="2" placeholder="번역본 (' + getLangLabel() + ')" style="background:var(--s50)">' + (getTrans(item.a).text||'') + '</textarea>'
      + '</div></div>'
      + '</div></div>';
  }).join('');

  return '<div class="edit-panel-head">'
    + '<div class="ep-title">❓ FAQ</div>'
    + '<div class="ep-actions">' + secChip(d.status)
    + '<button class="btn" style="font-size:12px" onclick="addFaq()">+ Q/A 추가</button>'
    + '</div></div>'
    + '<div style="padding:14px 20px">' + items + '</div>'
    + '<div class="save-bar"><span class="save-info">자동 저장됨</span>'
    + '<button class="btn btn-primary" onclick="saveSection(\'faq\')">저장</button></div>';
};

/* ── 08. 서비스 보장 ────────────────────────────────────────── */
RENDERERS.guarantee = function(d) {
  var items = d.items.map(function(item) {
    return '<div class="list-item" style="margin-bottom:8px">'
      + '<div class="list-item-head">'
      + '<span style="font-size:18px">' + item.icon + '</span>'
      + '<span style="flex:1;font-size:13px;font-weight:600;color:var(--navy)">' + item.title.ko + '</span>'
      + '<div class="tog-sw ' + (item.visible ? 'on' : 'off') + '" onclick="toggleGuarantee(' + item.id + ',this)" style="margin-right:4px"></div>'
      + '<span style="font-size:11px;color:var(--s500)">' + (item.visible ? '노출' : '비노출') + '</span>'
      + '</div>'
      + '<div class="list-item-body">'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px">'
      + '<input type="text" value="' + item.title.ko + '" placeholder="항목명" style="padding:6px 10px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit">'
      + '<input type="text" value="' + (getTrans(item.title).text||'') + '" placeholder="번역본 (' + getLangLabel() + ')" style="padding:6px 10px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit;background:var(--s50)">'
      + '</div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'
      + '<input type="text" value="' + item.desc.ko + '" placeholder="설명" style="padding:6px 10px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit">'
      + '<input type="text" value="' + (getTrans(item.desc).text||'') + '" placeholder="번역본 (' + getLangLabel() + ')" style="padding:6px 10px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit;background:var(--s50)">'
      + '</div>'
      + '</div></div>';
  }).join('');

  return '<div class="edit-panel-head">'
    + '<div class="ep-title">🛡 서비스 보장</div>'
    + '<div class="ep-actions">' + secChip(d.status) + '</div></div>'
    + '<div style="padding:14px 20px">' + items + '</div>'
    + '<div class="save-bar"><span class="save-info">자동 저장됨</span>'
    + '<button class="btn btn-primary" onclick="saveSection(\'guarantee\')">저장</button></div>';
};

/* ── 09. 무료 상담 시작 ─────────────────────────────────────── */
RENDERERS.consult = function(d) {
  var cards = d.channels.map(function(ch) {
    var extra = '';
    if (ch.id === 'line') {
      extra = '<div style="margin-top:8px;padding:8px 10px;background:var(--s50);border-radius:var(--r);font-size:11px;color:var(--s600)">'
        + '<div style="font-weight:600;margin-bottom:4px">LINE 프리필 메시지 (DECISION GUIDE 선택 시 자동 전달)</div>'
        + '<code style="font-size:10px;color:var(--navy)">https://line.me/ti/p/~{OAid}?text={불안요소+추천의사}</code>'
        + '<div style="margin-top:4px;color:var(--s400)">TODO: OA ID 등록 후 실제 연동 처리</div>'
        + '</div>';
    }
    if (ch.id === 'MEDIFLOW') {
      extra = '<div style="margin-top:8px">'
        + '<div style="font-size:11px;font-weight:600;color:var(--s500);margin-bottom:4px">IPPEO 앱 안내 팝업 문구</div>'
        + '<input type="text" value="' + (ch.popupMsg||'') + '" style="width:100%;padding:6px 10px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit">'
        + '</div>';
    }
    return '<div class="channel-card">'
      + '<div class="channel-head">'
      + '<span class="channel-icon">' + ch.icon + '</span>'
      + '<span class="channel-name">' + ch.name + '</span>'
      + '<div class="tog-sw ' + (ch.active ? 'on' : 'off') + '" onclick="toggleChannel(\'' + ch.id + '\',this)"></div>'
      + '<span style="font-size:11px;color:var(--s500);margin-left:6px">' + (ch.active ? '활성' : '비활성') + '</span>'
      + '</div>'
      + '<div style="display:flex;align-items:center;gap:8px">'
      + '<span style="font-size:12px;color:var(--s500);white-space:nowrap">링크:</span>'
      + '<input type="url" value="' + (ch.link||'') + '" placeholder="채널 URL" style="flex:1;padding:6px 10px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit">'
      + '</div>'
      + extra
      + '</div>';
  }).join('');

  return '<div class="edit-panel-head">'
    + '<div class="ep-title">💬 무료 상담 시작</div>'
    + '<div class="ep-actions">' + secChip(d.status) + '</div></div>'
    + '<div style="padding:14px 20px">' + cards + '</div>'
    + '<div class="save-bar"><span class="save-info">자동 저장됨</span>'
    + '<button class="btn btn-primary" onclick="saveSection(\'consult\')">저장</button></div>';
};

/* ── 10. 푸터 ────────────────────────────────────────────────── */
RENDERERS.footer = function(d) {
  var sns = d.sns.map(function(ch) {
    return '<div class="tog-row">'
      + '<span style="font-size:16px;margin-right:4px">' + ch.icon + '</span>'
      + '<div class="tog-info"><div class="tog-title">' + ch.name + '</div></div>'
      + '<input type="url" value="' + (ch.link||'') + '" placeholder="URL" style="flex:1;padding:5px 8px;border:1px solid var(--s200);border-radius:var(--r);font-size:12px;font-family:inherit;margin-right:8px">'
      + '<div class="tog-sw ' + (ch.active ? 'on' : 'off') + '" onclick="this.classList.toggle(\'on\');this.classList.toggle(\'off\')"></div>'
      + '</div>';
  }).join('');

  var legal = d.legal.map(function(item) {
    return '<div class="tog-row">'
      + '<div class="tog-sw ' + (item.active ? 'on' : 'off') + '" onclick="this.classList.toggle(\'on\');this.classList.toggle(\'off\')"></div>'
      + '<div class="tog-info"><div class="tog-title">' + item.title + '</div></div>'
      + '<button class="btn" style="font-size:11px;padding:3px 8px" onclick="editLegal(\'' + item.id + '\')">편집</button>'
      + '</div>';
  }).join('');

  var sitemap = d.sitemap.map(function(col) {
    return '<div style="flex:1">'
      + col.links.map(function(link, i) {
          return '<div style="display:flex;align-items:center;gap:4px;margin-bottom:4px">'
            + '<input type="text" value="' + link + '" style="flex:1;padding:4px 8px;border:1px solid var(--s200);border-radius:4px;font-size:12px;font-family:inherit">'
            + '<button style="background:none;border:none;color:var(--s400);cursor:pointer">✕</button>'
            + '</div>';
        }).join('')
      + '<button style="font-size:11px;color:var(--blue);background:none;border:none;cursor:pointer;padding:4px 0">+ 링크 추가</button>'
      + '</div>';
  }).join('');

  return '<div class="edit-panel-head">'
    + '<div class="ep-title">📌 푸터</div>'
    + '<div class="ep-actions">' + secChip(d.status) + '</div></div>'
    + '<div style="padding:14px 20px;border-top:1px solid var(--s100)">'
    + '<div style="font-size:11px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px">SNS 채널</div>'
    + '<div style="background:#fff;border:1px solid var(--s200);border-radius:var(--r);padding:0 14px">' + sns + '</div>'
    + '</div>'
    + '<div style="padding:0 20px 14px">'
    + '<div style="font-size:11px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px">사이트맵</div>'
    + '<div style="display:flex;gap:16px">' + sitemap + '</div>'
    + '</div>'
    + '<div style="padding:0 20px 14px">'
    + '<div style="font-size:11px;font-weight:700;color:var(--s400);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px">법적 정보 (노출 2개 권장)</div>'
    + '<div style="background:#fff;border:1px solid var(--s200);border-radius:var(--r);padding:0 14px">' + legal + '</div>'
    + '</div>'
    + '<div class="save-bar"><span class="save-info">자동 저장됨</span>'
    + '<button class="btn btn-primary" onclick="saveSection(\'footer\')">저장</button></div>';
};

/* ── CRUD 더미 핸들러 ────────────────────────────────────────── */
function saveSection(id)        { showToast('✓ 저장되었습니다.', 'success'); }
function publishAll()           { openModal('🚀 발행', '현재 콘텐츠를 사이트에 반영합니다.', function(){ showToast('🚀 발행 완료!', 'success'); }, '발행하기', 'btn-primary'); }
function tempSave()             { showToast('✓ 임시 저장되었습니다.', 'success'); }
function addDecisionItem()      { showToast('항목 추가됨 (TODO)', ''); }
function deleteDecisionItem(id) { showToast('삭제됨 (TODO)', ''); }
function addDoctor()            { showToast('의사 추가됨 (TODO)', ''); }
function deleteDoctor(id)       { showToast('삭제됨 (TODO)', ''); }
function toggleDoctorSection(el){ el.classList.toggle('on'); el.classList.toggle('off'); }
function addTreatment()         { showToast('시술 추가됨 (TODO)', ''); }
function deleteTreatment(id)    { showToast('삭제됨 (TODO)', ''); }
function addCase()              { showToast('케이스 추가됨 (TODO)', ''); }
function deleteCase(id)         { showToast('삭제됨 (TODO)', ''); }
function addReview()            { showToast('후기 추가됨 (TODO)', ''); }
function deleteReview(id)       { showToast('삭제됨 (TODO)', ''); }
function addFaq()               { showToast('Q/A 추가됨 (TODO)', ''); }
function deleteFaq(id)          { showToast('삭제됨 (TODO)', ''); }
function toggleGuarantee(id,el) { el.classList.toggle('on'); el.classList.toggle('off'); }
function toggleChannel(id,el)   { el.classList.toggle('on'); el.classList.toggle('off'); }
function editLegal(id)          { showToast('약관 편집 (TODO)', ''); }

/* ── 이미지 피커 ─────────────────────────────────────────────── */
function openImgPicker(ctx) {
  _imgPickerCb  = ctx;
  _imgPickerSel = [];
  var modal = document.getElementById('img-picker-modal');
  if (modal) modal.style.display = 'flex';
  renderImgPickerGrid();
}
function closeImgPicker() {
  var modal = document.getElementById('img-picker-modal');
  if (modal) modal.style.display = 'none';
  _imgPickerSel = [];
}
function renderImgPickerGrid() {
  var grid = document.getElementById('img-picker-grid');
  if (!grid || typeof SITE_ASSETS === 'undefined') return;
  var all = [].concat(SITE_ASSETS.ba||[]).concat(SITE_ASSETS.doctor||[]).concat(SITE_ASSETS.facility||[]);
  grid.innerHTML = all.map(function(a, i) {
    var sel = _imgPickerSel.indexOf(i) > -1;
    return '<div onclick="toggleImgPick(this,' + i + ')" style="border:2px solid ' + (sel?'var(--navy)':'var(--s200)') + ';border-radius:8px;overflow:hidden;cursor:pointer;background:' + (sel?'var(--navy-l)':'#fff') + '">'
      + (sel ? '<div style="position:absolute;top:5px;right:5px;width:16px;height:16px;border-radius:50%;background:var(--navy);color:#fff;font-size:9px;display:flex;align-items:center;justify-content:center">✓</div>' : '')
      + '<div style="height:64px;background:var(--s100);display:flex;align-items:center;justify-content:center;font-size:26px">' + a.em + '</div>'
      + '<div style="padding:4px 6px"><div style="font-size:10px;color:var(--s700);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + a.lb + '</div></div>'
      + '</div>';
  }).join('');
}
function toggleImgPick(el, idx) {
  var pos = _imgPickerSel.indexOf(idx);
  if (pos > -1) _imgPickerSel.splice(pos, 1); else _imgPickerSel.push(idx);
  renderImgPickerGrid();
  var ct = document.getElementById('img-picker-count');
  if (ct) ct.textContent = _imgPickerSel.length > 0 ? _imgPickerSel.length + '개 선택됨' : '선택 없음';
}
function confirmImgPick() {
  showToast('✓ ' + (_imgPickerSel.length||0) + '개 이미지 선택 완료 (TODO: 실제 반영)', 'success');
  closeImgPicker();
}
function triggerImgUpload() { document.getElementById('img-upload-input').click(); }
function handleImgUpload(inp) {
  if (inp.files && inp.files.length) {
    showToast('✓ ' + inp.files.length + '개 업로드 완료 (TODO)', 'success');
    closeImgPicker();
    inp.value = '';
  }
}

/* ── 초기화 ─────────────────────────────────────────────────── */
renderSectionList();
renderLangDropdown();
updateTransSummary();
selectSection('hero');
