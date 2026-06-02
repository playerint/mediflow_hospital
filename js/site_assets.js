/* site_assets.js — 자산 관리. 데이터: site-data.js */

/* ── 그리드 렌더링 ───────────────────────────────────────────── */
function renderGrid(id, items) {
  var el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = items.map(function(item) {
    return '<div class="img-card" onclick="this.classList.toggle(\'selected\')">'
      + (item.badge ? '<div class="img-badge ' + item.badge + '">B/A</div>' : '')
      + (item.isNew ? '<div class="img-badge badge-new" style="top:' + (item.badge ? '24px' : '6px') + '">NEW</div>' : '')
      + '<div class="img-thumb">' + item.em + '</div>'
      + '<div class="img-actions">'
      + '<button class="img-btn" onclick="event.stopPropagation();alert(\'' + item.lb + ' 교체\')" title="교체">↺</button>'
      + '<button class="img-btn" onclick="event.stopPropagation();alert(\'' + item.lb + ' 삭제\')" title="삭제">✕</button>'
      + '</div>'
      + '<div class="img-meta"><div class="img-name">' + item.lb + '</div><div class="img-size">' + item.sz + '</div></div>'
      + '</div>';
  }).join('');
}

/* ── 요약 수치 업데이트 ──────────────────────────────────────── */
function updateAssetSummary() {
  var totalEl = document.getElementById('asset-total');
  var sizeEl  = document.getElementById('asset-size');
  if (totalEl) totalEl.textContent = SITE_ASSETS.summary.total + '개 파일';
  if (sizeEl)  sizeEl.textContent  = SITE_ASSETS.summary.totalSize;
}

/* ── B/A 노출 게이트 ─────────────────────────────────────────── */
function toggleGate(cb) {
  var el = document.getElementById('gate-status');
  if (!el) return;
  el.textContent = cb.checked ? '로그인 필요' : '공개 중';
  el.style.color = cb.checked ? 'var(--amber)' : 'var(--gray-500)';
}

/* ── 업로드 핸들러 ───────────────────────────────────────────── */
function handleUpload(input) {
  if (!input.files || !input.files.length) return;
  var count = input.files.length;
  var zone  = document.getElementById('drop-zone');
  zone.innerHTML = '<div class="uz-icon">🤖</div><div class="uz-title">AI가 ' + count + '개 파일 분류 중...</div>';

  setTimeout(function() {
    zone.innerHTML = '<div class="uz-icon">✅</div><div class="uz-title">' + count + '개 파일 업로드 완료</div>';
    SITE_ASSETS.summary.total += count;
    updateAssetSummary();
    setTimeout(function() {
      zone.innerHTML = '<div class="uz-icon">📁</div>'
        + '<div class="uz-title">사진을 드래그하거나 클릭하여 업로드</div>'
        + '<div class="uz-sub">PNG, JPG, WebP · 최대 10MB · AI가 자동 분류</div>';
    }, 2500);
  }, 2000);
}

function handleDrop(e) {
  e.preventDefault();
  var zone = document.getElementById('drop-zone');
  if (zone) zone.classList.remove('dragging');
  if (e.dataTransfer && e.dataTransfer.files.length) handleUpload({ files: e.dataTransfer.files });
}

/* ── 초기화 ──────────────────────────────────────────────────── */
renderGrid('ba-grid',       SITE_ASSETS.ba);
renderGrid('doctor-grid',   SITE_ASSETS.doctor);
renderGrid('facility-grid', SITE_ASSETS.facility);
updateAssetSummary();
