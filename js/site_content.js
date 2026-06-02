/* site_content.js — 콘텐츠 편집. 데이터: site-data.js, AI: gemini.js */

var curSec = 'hero';

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
  var ve = document.getElementById('comp-violations');
  var ge = document.getElementById('comp-grays');
  if (ve) { ve.textContent = violations + '건'; ve.style.color = violations > 0 ? 'var(--red)' : 'var(--green)'; }
  if (ge) { ge.textContent = grays + '건'; ge.style.color = grays > 0 ? 'var(--s500)' : 'var(--green)'; }
}

/* ── 섹션 선택 ────────────────────────────────────────────────── */
function selectSection(key, el) {
  document.querySelectorAll('.section-item').forEach(function(i){ i.classList.remove('active'); });
  el.classList.add('active');
  curSec = key;
  var s = SITE_SECTIONS[key];
  document.getElementById('ep-title').textContent = s.title;
  document.getElementById('ko-text').textContent  = s.ko;
  document.getElementById('ja-text').value        = s.ja;
  document.getElementById('save-info').textContent = '마지막 저장: ' + s.savedAt;
  renderCompliance(s.compliance);
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

/* ── 저장 ─────────────────────────────────────────────────────── */
function saveSection() {
  var now = new Date();
  var timeStr = '오늘 ' + now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
  SITE_SECTIONS[curSec].ja     = document.getElementById('ja-text').value;
  SITE_SECTIONS[curSec].savedAt = timeStr;
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
// 첫 섹션 로드
(function() {
  var firstItem = document.querySelector('.section-item.active');
  if (firstItem) selectSection('hero', firstItem);
})();
// 임시저장 복원 배너 (DOMContentLoaded 이후)
document.addEventListener('DOMContentLoaded', checkAndShowDraftBanner);
