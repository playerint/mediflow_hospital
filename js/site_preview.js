/* site_preview.js — 미리보기 & 게시. 데이터: site-data.js */

/* ── 기기 전환 ───────────────────────────────────────────────── */
function setDevice(dev, btn) {
  document.querySelectorAll('.dev-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  var pw = document.getElementById('pw');
  var lbl = document.getElementById('dev-label');
  if (dev === 'mobile') {
    pw.style.maxWidth = '390px'; pw.style.margin = '0 auto';
    if (lbl) lbl.textContent = '390 × 844';
  } else {
    pw.style.maxWidth = ''; pw.style.margin = '';
    if (lbl) lbl.textContent = '1280 × 800';
  }
}

/* ── 배포 상태 렌더링 ────────────────────────────────────────── */
function renderDeployStatus() {
  var lastPubEl  = document.getElementById('deploy-last');
  var sslEl      = document.getElementById('deploy-ssl');
  var cwvEl      = document.getElementById('deploy-cwv');
  var checkEl    = document.getElementById('deploy-checklist');
  var urlEl      = document.getElementById('deploy-url');

  if (lastPubEl) lastPubEl.textContent = SITE_DEPLOY.lastPublished;
  if (sslEl)     sslEl.textContent     = SITE_DEPLOY.ssl;
  if (cwvEl)     cwvEl.textContent     = SITE_DEPLOY.coreWebVitals + '점';
  if (urlEl)     urlEl.textContent     = SITE_DEPLOY.url;

  if (checkEl) {
    var icons = { ok:'✓', warn:'⚡', error:'✕' };
    var colors = { ok:'var(--green)', warn:'var(--amber)', error:'var(--red)' };
    checkEl.innerHTML = SITE_DEPLOY.checklist.map(function(item) {
      return '<div class="check-item">'
        + '<span style="color:' + (colors[item.status] || 'var(--gray-400)') + ';font-weight:700">'
        + (icons[item.status] || '○') + '</span>'
        + '<span style="flex:1">' + item.label + '</span>'
        + '<span style="font-size:12px;color:var(--gray-400)">' + item.note + '</span>'
        + '</div>';
    }).join('');
  }
}

/* ── 게시 ────────────────────────────────────────────────────── */
function publishSite(btn) {
  var orig = btn.innerHTML;
  btn.innerHTML  = '⏳ 배포 중...';
  btn.disabled   = true;
  btn.style.opacity = '.7';
  setTimeout(function() {
    btn.innerHTML = '✅ 게시 완료!';
    btn.style.background   = 'var(--green)';
    btn.style.borderColor  = 'var(--green)';
    var now = new Date();
    SITE_DEPLOY.lastPublished = '오늘 ' + now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
    renderDeployStatus();
    setTimeout(function() {
      btn.innerHTML = orig;
      btn.disabled  = false;
      btn.style.opacity = '';
      btn.style.background  = '';
      btn.style.borderColor = '';
    }, 2500);
  }, 3000);
}

/* ── 초기화 ──────────────────────────────────────────────────── */
renderDeployStatus();
