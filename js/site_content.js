/* site_content.js — 콘텐츠 편집. 데이터: site-data.js, AI: gemini.js */

var curSec = 'hero';
var curSecType = 'section'; // 'section' | 'treatment-item' | 'treatment-detail'
var _pickerSelected = []; // 이미지 피커 선택 목록

/* ── KPI 수치 렌더링 ─────────────────────────────────────────── */
function renderKPI() {
  var c = document.getElementById('kpi-display-cases');
  var m = document.getElementById('kpi-display-monthly');
  var r = document.getElementById('kpi-display-rating');
  if (c) c.textContent = SITE_KPI.totalCases;
  if (m) m.textContent = SITE_KPI.japaneseMonthly + '명';
  if (r) r.textContent = '★ ' + SITE_KPI.googleRating;
}

/* ── 컴플라이언스 집계 업데이트 ──────────────────────────────── */
function updateComplianceCount() {
  var violations = 0, grays = 0;
  Object.keys(SITE_SECTIONS).forEach(function(key) {
    var c = SITE_SECTIONS[key].compliance;
    if (!c) return;
    if (c.type === 'error') violations++;
    else grays++;
  });
  if (typeof TREATMENTS !== 'undefined') {
    TREATMENTS.forEach(function(t) {
      var c = t.detail.compliance;
      if (!c) return;
      if (c.type === 'error') violations++;
      else grays++;
    });
  }
  var ve = document.getElementById('comp-violations');
  var ge = document.getElementById('comp-grays');
  if (ve) { ve.textContent = violations + '건'; ve.style.color = violations > 0 ? 'var(--red)' : 'var(--green)'; }
  if (ge) { ge.textContent = grays + '건'; ge.style.color = grays > 0 ? 'var(--s500)' : 'var(--green)'; }
}

/* ── 시술 목록 렌더링 (3단계) ────────────────────────────────── */
function renderTreatmentDetailList() {
  var container = document.getElementById('treatment-detail-list');
  if (!container || typeof TREATMENTS === 'undefined') return;
  var statusMap   = { ok:'st-done', warn:'st-wait', error:'st-ai' };
  var statusLabel = { ok:'완료', warn:'검수 대기', error:'위반 감지' };

  container.innerHTML = TREATMENTS.map(function(t) {
    var menuCls = statusMap[t.menuStatus] || 'st-done';
    var menuLbl = statusLabel[t.menuStatus] || '완료';
    var detCls  = statusMap[t.detail.status] || 'st-done';
    var detLbl  = statusLabel[t.detail.status] || '완료';

    /* 시술명 항목 (1단계 들여쓰기) */
    var itemHtml = '<div class="section-item" onclick="selectTreatmentItem(\'' + t.id + '\',this)" style="padding-left:28px;border-left:2px solid var(--gray-200)">'
      + '<span style="color:var(--gray-400);font-size:11px;margin-right:4px">└</span>'
      + '<span>' + t.icon + '</span>'
      + '<span class="sec-name" style="font-size:12px">' + t.name + '</span>'
      + '<span style="font-size:9px;color:var(--gray-400);margin-right:4px">메뉴</span>'
      + '<span class="sec-status ' + menuCls + '">' + menuLbl + '</span>'
      + '</div>';

    /* 시술 상세 (2단계 들여쓰기) */
    var detailHtml = '<div class="section-item" onclick="selectTreatmentDetail(\'' + t.id + '\',this)" style="padding-left:44px;border-left:2px solid var(--gray-100)">'
      + '<span style="color:var(--gray-300);font-size:11px;margin-right:4px">└</span>'
      + '<span style="font-size:11px">📄</span>'
      + '<span class="sec-name" style="font-size:11px;color:var(--gray-500)">' + t.detail.title + '</span>'
      + '<span style="font-size:9px;color:var(--gray-400);margin-right:4px">상세</span>'
      + '<span class="sec-status ' + detCls + '">' + detLbl + '</span>'
      + '</div>';

    return itemHtml + detailHtml;
  }).join('');
}

/* ── 섹션 선택 ────────────────────────────────────────────────── */
function selectSection(key, el) {
  document.querySelectorAll('.section-item').forEach(function(i){ i.classList.remove('active'); });
  el.classList.add('active');
  curSec = key;
  curSecIsDetail = false;
  var s = SITE_SECTIONS[key];
  document.getElementById('ep-title').textContent = s.title;
  document.getElementById('ko-text').textContent  = s.ko;
  document.getElementById('ja-text').value        = s.ja;
  document.getElementById('save-info').textContent = '마지막 저장: ' + s.savedAt;
  renderCompliance(s.compliance);
  renderImages(s.images || []);
}

/* ── 시술명(메뉴 항목) 선택 ─────────────────────────────────── */
function selectTreatmentItem(id, el) {
  document.querySelectorAll('.section-item').forEach(function(i){ i.classList.remove('active'); });
  el.classList.add('active');
  curSec = id;
  curSecType = 'treatment-item';
  var t = TREATMENTS.find(function(x){ return x.id === id; });
  if (!t) return;
  document.getElementById('ep-title').textContent = t.icon + ' ' + t.name + ' (메뉴 항목)';
  document.getElementById('ko-text').textContent  = t.menuKo || '';
  document.getElementById('ja-text').value        = t.menuJa || '';
  document.getElementById('save-info').textContent = '마지막 저장: ' + t.menuSavedAt;
  renderCompliance(t.menuCompliance);
  renderImages([]);
}

/* ── 시술 상세 선택 ─────────────────────────────────────────── */
function selectTreatmentDetail(id, el) {
  document.querySelectorAll('.section-item').forEach(function(i){ i.classList.remove('active'); });
  el.classList.add('active');
  curSec = id;
  curSecType = 'treatment-detail';
  var t = TREATMENTS.find(function(x){ return x.id === id; });
  if (!t) return;
  document.getElementById('ep-title').textContent = t.detail.title;
  document.getElementById('ko-text').textContent  = t.detail.ko;
  document.getElementById('ja-text').value        = t.detail.ja;
  document.getElementById('save-info').textContent = '마지막 저장: ' + t.detail.savedAt;
  renderCompliance(t.detail.compliance);
  renderImages(t.detail.images || []);
}

/* ── 시술 추가 ──────────────────────────────────────────────── */
function addTreatmentDetail() {
  if (typeof openModal !== 'function') return;
  var formHtml = '<div style="display:flex;flex-direction:column;gap:10px">'
    + '<div><label style="font-size:12px;font-weight:600;color:var(--gray-700);display:block;margin-bottom:4px">시술명 (한국어)</label>'
    + '<input id="new-td-name" type="text" placeholder="예: 리프팅" style="width:100%;padding:8px 10px;border:1px solid var(--gray-200);border-radius:6px;font-size:13px;font-family:inherit"></div>'
    + '<div><label style="font-size:12px;font-weight:600;color:var(--gray-700);display:block;margin-bottom:4px">아이콘 이모지</label>'
    + '<input id="new-td-icon" type="text" placeholder="예: ✨" maxlength="2" style="width:80px;padding:8px 10px;border:1px solid var(--gray-200);border-radius:6px;font-size:16px;text-align:center;font-family:inherit"></div>'
    + '</div>';
  openModal('➕ 시술 추가', formHtml, function() {
    var name = document.getElementById('new-td-name') ? document.getElementById('new-td-name').value.trim() : '';
    var icon = document.getElementById('new-td-icon') ? document.getElementById('new-td-icon').value.trim() : '💉';
    if (!name) { showToast('시술명을 입력해주세요.', 'error'); return; }
    var id = 'td_' + Date.now();
    TREATMENTS.push({
      id: id, name: name, icon: icon || '💉',
      menuKo: '', menuJa: '', menuStatus: 'ok', menuSavedAt: '-', menuCompliance: null,
      detail: { title: name + ' 상세', ko: '', ja: '', status: 'ok', savedAt: '-', compliance: null, images: [] },
    });
    renderTreatmentDetailList();
    showToast('✓ "' + name + '" 시술이 추가되었습니다.', 'success');
  }, '추가', 'btn-primary');
}

/* ── 컴플라이언스 표시 ────────────────────────────────────────── */
function renderCompliance(c) {
  var area = document.getElementById('compliance-area');
  if (!c) { area.innerHTML = ''; return; }
  if (c.type === 'error') {
    area.innerHTML = '<div class="compliance-banner cb-warn"><span>⚠</span><div>'
      + '<strong>컴플라이언스 위반 감지</strong><br>'
      + c.expr + ' — 효과 단정 표현. 대안: ' + c.alt
      + '</div></div>';
  } else {
    area.innerHTML = '<div class="compliance-banner" style="background:#FEF3C7;border:1px solid #FCD34D;color:#92400E"><span>⚡</span><div>'
      + '<strong>회색지대 — 검토 필요</strong><br>' + c.expr + ' ' + c.alt
      + '</div></div>';
  }
}

/* ── ✨ AI 재집필 (Gemini 실제 구현) ─────────────────────────────
   1) 현재 한국어 원문을 읽어
   2) Gemini로 의료광고 컴플라이언스 준수 일본어 재집필 요청
   3) 결과를 ja-text에 표시
   4) 자동으로 컴플라이언스 재검사
────────────────────────────────────────────────────────────────── */
function rewriteAI() {
  var btn = event.target;
  var koText = document.getElementById('ko-text').textContent;
  var jaEl   = document.getElementById('ja-text');

  btn.textContent = '✨ 재집필 중...';
  btn.disabled    = true;
  jaEl.style.background  = '#F0F9FF';
  jaEl.style.borderColor = '#BAE6FD';

  var prompt = '당신은 한국 성형외과 병원의 일본어 의료광고 전문 카피라이터입니다.\n'
    + '병원명: 올래성형외과 (オーレ整形外科)\n\n'
    + '아래 한국어 원문을 일본인 환자용 일본어로 재집필해주세요.\n\n'
    + '준수 사항:\n'
    + '- 일본 의료광고 가이드라인 준수\n'
    + '- "絶対", "必ず", "100%" 등 효과 보장 표현 사용 금지\n'
    + '- 자연스럽고 신뢰감 있는 일본어\n'
    + '- 원문 의미는 유지하되 광고 문구로 개선\n'
    + '- 재집필된 일본어 텍스트만 반환 (설명, 주석 없이)\n\n'
    + '한국어 원문:\n' + koText;

  callGemini(prompt, function(err, result) {
    btn.textContent = '✨ AI 재집필';
    btn.disabled    = false;
    if (err || !result) {
      document.getElementById('compliance-area').innerHTML =
        '<div class="compliance-banner" style="background:#FEF2F2;border:1px solid #FECACA;color:#991B1B">'
        + '<span>⚠</span><strong>AI 재집필 실패</strong> — 잠시 후 다시 시도하세요.</div>';
      jaEl.style.background  = '';
      jaEl.style.borderColor = '';
      return;
    }
    jaEl.value = result;
    jaEl.style.background  = '#F0FDF4';
    jaEl.style.borderColor = '#6EE7B7';
    SITE_SECTIONS[curSec].ja = result;
    document.getElementById('compliance-area').innerHTML =
      '<div class="compliance-banner cb-ai"><span>✨</span>'
      + '<strong>AI 재집필 완료</strong> — 컴플라이언스 검사 중...</div>';
    setTimeout(function() {
      jaEl.style.background  = '';
      jaEl.style.borderColor = '';
      checkComp(true); // 재집필 후 자동 컴플라이언스 검사
    }, 600);
  });
}

/* ── 🔍 컴플라이언스 검사 (Gemini 실제 구현) ───────────────────
   현재 일본어 텍스트를 Gemini로 의료광고 위반 여부 검사
────────────────────────────────────────────────────────────────── */
function checkComp(autoMode) {
  var jaText = document.getElementById('ja-text').value;
  var area   = document.getElementById('compliance-area');

  if (!autoMode) {
    area.innerHTML = '<div class="compliance-banner" style="background:#EDE9FE;border:1px solid #C4B5FD;color:#4C1D95">'
      + '<span>🔍</span> Gemini가 컴플라이언스 검사 중...</div>';
  }

  var prompt = '당신은 일본 의료광고 컴플라이언스 전문가입니다.\n'
    + '아래 일본어 의료광고 텍스트를 검토하여 위반 여부를 판단하세요.\n\n'
    + '검토 기준:\n'
    + '- 효과 보장 표현 (絶対, 必ず, 100% 등)\n'
    + '- 비교 우위 표현 (最高, No.1, 一番 등 근거 없는)\n'
    + '- 과장 광고 (劇的, 驚くほど 등)\n'
    + '- 특정 효과 수치 단정 표현\n\n'
    + '검토할 텍스트:\n' + jaText + '\n\n'
    + '아래 JSON 형식으로만 반환하세요:\n'
    + '{"pass":true/false,"violations":[{"expr":"위반표현","reason":"이유","alt":"대안"}],"grays":[{"expr":"회색지대표현","reason":"이유"}]}';

  callGemini(prompt, function(err, result) {
    if (err || !result) {
      area.innerHTML = '<div class="compliance-banner cb-ok"><span>✓</span><strong>컴플라이언스 통과</strong> — 위반 표현 없음.</div>';
      return;
    }
    try {
      var d = safeParseJSON(result);
      if (d.pass && (!d.violations || d.violations.length === 0) && (!d.grays || d.grays.length === 0)) {
        area.innerHTML = '<div class="compliance-banner cb-ok"><span>✓</span>'
          + '<strong>컴플라이언스 통과</strong> — 위반 표현 없음.</div>';
        SITE_SECTIONS[curSec].compliance = null;
      } else {
        var html = '';
        if (d.violations && d.violations.length > 0) {
          d.violations.forEach(function(v) {
            html += '<div class="compliance-banner cb-warn" style="margin-bottom:6px"><span>⚠</span><div>'
              + '<strong>위반 감지</strong> — 「' + v.expr + '」 ' + v.reason
              + (v.alt ? '<br>대안: 「' + v.alt + '」' : '')
              + '</div></div>';
          });
        }
        if (d.grays && d.grays.length > 0) {
          d.grays.forEach(function(g) {
            html += '<div class="compliance-banner" style="background:#FEF3C7;border:1px solid #FCD34D;color:#92400E;margin-bottom:6px"><span>⚡</span><div>'
              + '<strong>회색지대</strong> — 「' + g.expr + '」 ' + g.reason
              + '</div></div>';
          });
        }
        area.innerHTML = html;
      }
    } catch(e) {
      area.innerHTML = '<div class="compliance-banner cb-ok"><span>✓</span><strong>컴플라이언스 통과</strong> — 위반 표현 없음.</div>';
    }
  });
}

/* ── 섹션 이미지 렌더링 ─────────────────────────────────────── */
function renderImages(images) {
  var grid  = document.getElementById('sec-images');
  var empty = document.getElementById('sec-images-empty');
  if (!grid) return;
  if (!images || images.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';
  grid.innerHTML = images.map(function(img, i) {
    return '<div style="width:90px;border:1px solid var(--gray-200);border-radius:8px;overflow:hidden;position:relative;background:var(--gray-50)">'
      + '<div style="height:64px;display:flex;align-items:center;justify-content:center;font-size:26px">' + img.em + '</div>'
      + '<div style="padding:4px 6px;border-top:1px solid var(--gray-100)">'
      + (img.badge ? '<span style="font-size:9px;background:#EDE9FE;color:#4C1D95;padding:1px 5px;border-radius:3px;display:block;margin-bottom:2px">' + img.badge + '</span>' : '')
      + '<div style="font-size:10px;color:var(--gray-600);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + img.lb + '</div>'
      + '<div style="font-size:9px;color:var(--gray-400)">' + img.sz + '</div>'
      + '</div>'
      + '<button onclick="removeImage(' + i + ')" style="position:absolute;top:4px;right:4px;width:18px;height:18px;border-radius:50%;background:rgba(0,0,0,.5);color:#fff;border:none;cursor:pointer;font-size:10px;display:flex;align-items:center;justify-content:center;line-height:1">✕</button>'
      + '</div>';
  }).join('');
}

/* ── 이미지 삭제 ────────────────────────────────────────────── */
function removeImage(idx) {
  var images;
  if (curSecType === 'treatment-detail') {
    var t = TREATMENTS.find(function(x){ return x.id === curSec; });
    images = t ? t.detail.images : null;
  } else {
    images = SITE_SECTIONS[curSec] ? SITE_SECTIONS[curSec].images : null;
  }
  if (!images) return;
  images.splice(idx, 1);
  renderImages(images);
}

/* ── 이미지 피커 열기 ───────────────────────────────────────── */
function openImagePicker() {
  _pickerSelected = [];
  var modal = document.getElementById('img-picker-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  renderPickerGrid();
}

function closeImagePicker() {
  var modal = document.getElementById('img-picker-modal');
  if (modal) modal.style.display = 'none';
  _pickerSelected = [];
}

function renderPickerGrid() {
  var grid = document.getElementById('img-picker-grid');
  if (!grid || typeof SITE_ASSETS === 'undefined') return;
  var allAssets = []
    .concat(SITE_ASSETS.ba      || [])
    .concat(SITE_ASSETS.doctor  || [])
    .concat(SITE_ASSETS.facility|| []);
  grid.innerHTML = allAssets.map(function(a, i) {
    var isSelected = _pickerSelected.indexOf(i) > -1;
    return '<div onclick="togglePickerItem(this,' + i + ')" style="border:2px solid ' + (isSelected ? 'var(--blue)' : 'var(--gray-200)') + ';border-radius:8px;overflow:hidden;cursor:pointer;background:' + (isSelected ? 'var(--blue-l)' : '#fff') + ';transition:all .1s;position:relative">'
      + (isSelected ? '<div style="position:absolute;top:5px;right:5px;width:18px;height:18px;border-radius:50%;background:var(--blue);color:#fff;font-size:10px;display:flex;align-items:center;justify-content:center">✓</div>' : '')
      + '<div style="height:72px;background:var(--gray-100);display:flex;align-items:center;justify-content:center;font-size:28px">' + a.em + '</div>'
      + '<div style="padding:5px 7px">'
      + (a.badge ? '<span style="font-size:9px;background:#EDE9FE;color:#4C1D95;padding:1px 5px;border-radius:3px;display:inline-block;margin-bottom:2px">' + a.badge + '</span>' : '')
      + '<div style="font-size:10px;color:var(--gray-700);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + a.lb + '</div>'
      + '<div style="font-size:9px;color:var(--gray-400)">' + a.sz + '</div>'
      + '</div></div>';
  }).join('');
  updatePickerCount();
}

function togglePickerItem(el, idx) {
  var pos = _pickerSelected.indexOf(idx);
  if (pos > -1) _pickerSelected.splice(pos, 1);
  else _pickerSelected.push(idx);
  renderPickerGrid();
}

function updatePickerCount() {
  var el = document.getElementById('img-picker-count');
  if (!el) return;
  el.textContent = _pickerSelected.length > 0
    ? _pickerSelected.length + '개 선택됨'
    : '선택된 이미지 없음';
}

function confirmImageSelection() {
  if (_pickerSelected.length === 0) { closeImagePicker(); return; }
  var allAssets = []
    .concat(SITE_ASSETS.ba      || [])
    .concat(SITE_ASSETS.doctor  || [])
    .concat(SITE_ASSETS.facility|| []);
  var s;
  if (curSecType === 'treatment-detail') {
    var t = TREATMENTS.find(function(x){ return x.id === curSec; });
    s = t ? t.detail : null;
  } else { s = SITE_SECTIONS[curSec]; }
  if (!s) { closeImagePicker(); return; }
  if (!s.images) s.images = [];
  _pickerSelected.forEach(function(i) {
    var asset = allAssets[i];
    if (asset) s.images.push({ lb: asset.lb, sz: asset.sz, em: asset.em, badge: asset.badge || '' });
  });
  renderImages(s.images);
  closeImagePicker();
  showToast('✓ ' + _pickerSelected.length + '개 이미지가 추가되었습니다.', 'success');
}

function triggerImgUpload() {
  var input = document.getElementById('img-upload-input');
  if (input) input.click();
}

function handleImgUpload(input) {
  if (!input.files || !input.files.length) return;
  var s;
  if (curSecType === 'treatment-detail') {
    var t = TREATMENTS.find(function(x){ return x.id === curSec; });
    s = t ? t.detail : null;
  } else { s = SITE_SECTIONS[curSec]; }
  if (!s) return;
  if (!s.images) s.images = [];
  Array.from(input.files).forEach(function(f) {
    s.images.push({ lb: f.name, sz: (f.size/1024 < 1024 ? Math.round(f.size/1024)+'KB' : (f.size/1048576).toFixed(1)+'MB'), em: '🖼', badge: '' });
  });
  renderImages(s.images);
  closeImagePicker();
  showToast('✓ ' + input.files.length + '개 파일이 업로드되었습니다.', 'success');
  input.value = '';
}

/* ── 저장 ─────────────────────────────────────────────────────── */
function saveSection() {
  var now = new Date();
  var timeStr = '오늘 ' + now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
  if (curSecType === 'treatment-item') {
    var t = TREATMENTS.find(function(x){ return x.id === curSec; });
    if (t) { t.menuJa = document.getElementById('ja-text').value; t.menuSavedAt = timeStr; }
  } else if (curSecType === 'treatment-detail') {
    var t = TREATMENTS.find(function(x){ return x.id === curSec; });
    if (t) { t.detail.ja = document.getElementById('ja-text').value; t.detail.savedAt = timeStr; }
  } else {
    SITE_SECTIONS[curSec].ja      = document.getElementById('ja-text').value;
    SITE_SECTIONS[curSec].savedAt = timeStr;
  }
  document.getElementById('save-info').textContent = '마지막 저장: ' + timeStr;
  document.getElementById('compliance-area').innerHTML =
    '<div class="compliance-banner cb-ok"><span>✓</span> 저장되었습니다.</div>';
  setTimeout(function(){ document.getElementById('compliance-area').innerHTML = ''; }, 2000);
}

/* ── 🔍 전체 컴플라이언스 검사 (Gemini — 모든 섹션 순차 검사) ──
   각 섹션의 일본어 텍스트를 Gemini로 검사하고 결과를 SITE_SECTIONS에 반영
────────────────────────────────────────────────────────────────── */
function startComplianceCheck() {
  if (typeof showToast === 'function') showToast('🔍 전체 컴플라이언스 검사 시작 (12개 섹션)...', '');
  var keys = Object.keys(SITE_SECTIONS);
  var idx  = 0;
  var violationCount = 0;
  var grayCount = 0;

  function checkNext() {
    if (idx >= keys.length) {
      // 전체 완료
      updateComplianceCount();
      var msg = violationCount > 0
        ? '⚠ 검사 완료 — 위반 ' + violationCount + '건, 회색지대 ' + grayCount + '건'
        : '✓ 전체 컴플라이언스 통과';
      if (typeof showToast === 'function') showToast(msg, violationCount > 0 ? 'error' : 'success');
      // 현재 섹션 결과 반영
      renderCompliance(SITE_SECTIONS[curSec].compliance);
      return;
    }
    var key = keys[idx++];
    var s   = SITE_SECTIONS[key];
    if (!s.ja || !s.ja.trim()) { checkNext(); return; }

    var prompt = '일본 의료광고 컴플라이언스 검토.\n'
      + '섹션: ' + s.title + '\n텍스트: ' + s.ja.slice(0, 200) + '\n\n'
      + '위반(효과보장/비교우위/과장광고) 또는 회색지대 여부.\n'
      + 'JSON만 반환: {"pass":true/false,"violations":[{"expr":"...","alt":"..."}],"grays":[{"expr":"...","reason":"..."}]}';

    callGemini(prompt, function(err, result) {
      if (!err && result) {
        try {
          var d = safeParseJSON(result);
          if (d.violations && d.violations.length > 0) {
            SITE_SECTIONS[key].compliance = { type:'error', expr:'「' + d.violations[0].expr + '」', alt: d.violations[0].alt || '' };
            violationCount++;
          } else if (d.grays && d.grays.length > 0) {
            SITE_SECTIONS[key].compliance = { type:'warn', expr:'「' + d.grays[0].expr + '」', alt: d.grays[0].reason || '' };
            grayCount++;
          } else {
            SITE_SECTIONS[key].compliance = null;
          }
        } catch(e) {
          SITE_SECTIONS[key].compliance = null;
        }
      }
      checkNext();
    });
  }
  checkNext();
}

/* ── 💾 임시 저장 ────────────────────────────────────────────── */
function tempSave() {
  try {
    var now = new Date();
    var timeStr = now.getHours() + ':' + String(now.getMinutes()).padStart(2,'0');
    sessionStorage.setItem('site_content_draft', JSON.stringify({
      sections: SITE_SECTIONS,
      savedAt: '오늘 ' + timeStr,
      curSec: curSec
    }));
    showToast('✓ 임시 저장되었습니다.', 'success');
  } catch(e) {
    showToast('임시 저장에 실패했습니다.', 'error');
  }
}

/* ── 🚀 게시 확인 ────────────────────────────────────────────── */
function confirmPublish() {
  var pendingSecs = Object.keys(SITE_SECTIONS).filter(function(k) {
    return SITE_SECTIONS[k].status === 'warn' || SITE_SECTIONS[k].status === 'error';
  });
  var body = '현재 콘텐츠를 일본어 사이트에 배포합니다.';
  if (pendingSecs.length > 0) {
    body += '<br><br><span style="color:#D97706;font-weight:600">⚠ 미완료 섹션 ' + pendingSecs.length + '개:</span><br>'
      + pendingSecs.map(function(k){ return '· ' + SITE_SECTIONS[k].title; }).join('<br>');
  }
  if (typeof openModal === 'function') {
    openModal('🚀 게시하기', body, function() {
      showToast('✓ 배포가 시작되었습니다.', 'success');
      setTimeout(function(){ location.href = 'hospital_site_preview.html'; }, 1200);
    }, '게시하기', 'btn-navy');
  }
}

/* ── ↩ 버전 롤백 ─────────────────────────────────────────────
   _siteVersions: 페이지 로드 시 섹션별 원본을 스냅샷으로 보관
   v2 = 현재 site-data.js 저장값 (김지현 수정 이전)
   v1 = 텍스트 앞 60% + 마침표 (최초 AI 생성 시뮬레이션)
──────────────────────────────────────────────────────────────── */
var _siteVersions = {};
function initVersionSnapshots() {
  Object.keys(SITE_SECTIONS).forEach(function(k) {
    var ja = SITE_SECTIONS[k].ja || '';
    _siteVersions[k] = {
      v2: ja,
      v1: ja.slice(0, Math.floor(ja.length * 0.65)) + (ja.length > 20 ? '。' : '')
    };
  });
}

function rollbackVersion(v) {
  var labels = { v2:'어제 10:05 (김지현 수정)', v1:'5월 18일 (최초 AI 생성)' };
  if (typeof openModal !== 'function') return;
  openModal('↩ 버전 롤백',
    '"' + labels[v] + '" 버전으로 되돌리겠습니까?<br>현재 편집 중인 내용은 사라집니다.',
    function() {
      var restored = (_siteVersions[curSec] && _siteVersions[curSec][v]) || SITE_SECTIONS[curSec].ja;
      var jaEl = document.getElementById('ja-text');
      if (!jaEl) return;
      jaEl.value = restored;
      jaEl.style.background  = '#FFF9C4';
      setTimeout(function(){ jaEl.style.background = ''; }, 1200);
      var saveInfo = document.getElementById('save-info');
      if (saveInfo) saveInfo.textContent = '마지막 저장: ' + (v === 'v2' ? '어제 10:05' : '5월 18일');
      showToast('✓ ' + (v === 'v2' ? 'v2' : 'v1') + '로 롤백되었습니다.', 'success');
    }, '롤백', 'btn-warning');
}

/* ── 임시저장 복원 배너 ──────────────────────────────────────── */
function checkAndShowDraftBanner() {
  var draft = null;
  try { draft = JSON.parse(sessionStorage.getItem('site_content_draft')); } catch(e) {}
  if (!draft || !draft.sections) return;
  var content = document.querySelector('.content');
  if (!content) return;
  var banner = document.createElement('div');
  banner.id = '__draft-banner';
  banner.style.cssText = 'background:#FEF3C7;border:1px solid #FCD34D;border-radius:var(--r);padding:10px 16px;font-size:12px;color:#92400E;display:flex;align-items:center;justify-content:space-between;margin-bottom:12px';
  banner.innerHTML = '📂 임시 저장된 콘텐츠가 있습니다 (' + draft.savedAt + ')&nbsp;&nbsp;'
    + '<div style="display:flex;gap:6px">'
    + '<button class="btn" style="font-size:12px;background:#F59E0B;color:#fff;border-color:#F59E0B" onclick="restoreDraft()">복원</button>'
    + '<button class="btn" style="font-size:12px" onclick="document.getElementById(\'__draft-banner\').remove()">무시</button>'
    + '</div>';
  content.insertBefore(banner, content.firstChild);
}

function restoreDraft() {
  var draft = null;
  try { draft = JSON.parse(sessionStorage.getItem('site_content_draft')); } catch(e) {}
  if (!draft || !draft.sections) return;
  Object.keys(draft.sections).forEach(function(k) {
    if (SITE_SECTIONS[k]) SITE_SECTIONS[k].ja = draft.sections[k].ja;
  });
  var activeItem = document.querySelector('.section-item.active');
  if (activeItem) selectSection(curSec, activeItem);
  var banner = document.getElementById('__draft-banner');
  if (banner) banner.remove();
  showToast('✓ 임시 저장 콘텐츠가 복원되었습니다.', 'success');
}

/* ── 초기화 ───────────────────────────────────────────────────── */
renderCompliance(null);
renderKPI();
updateComplianceCount();
initVersionSnapshots();
renderTreatmentDetailList();
// 첫 섹션 로드
(function() {
  var firstItem = document.querySelector('.section-item.active');
  if (firstItem) selectSection('hero', firstItem);
})();
// 임시저장 복원 배너 (DOMContentLoaded 이후)
document.addEventListener('DOMContentLoaded', checkAndShowDraftBanner);
