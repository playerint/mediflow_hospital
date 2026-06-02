/* dashboard.js — 모든 데이터는 dashboard-data.js 의 DASHBOARD_DATA 참조 */

var D = DASHBOARD_DATA;

/* ── 기간 ─────────────────────────────────────────────────── */
var periodEl = document.getElementById('dashboard-period');
if (periodEl) periodEl.textContent = D.period;

/* ── KPI 카드 ─────────────────────────────────────────────── */
var kpiGrid = document.getElementById('kpi-grid');
if (kpiGrid) {
  kpiGrid.innerHTML = D.kpi.map(function(k) {
    return '<div class="kpi-card ' + k.color + '" onclick="location.href=\'' + k.link + '\'" style="cursor:pointer">'
      + '<div class="kpi-label">' + k.label + '</div>'
      + '<div class="kpi-value" id="' + k.id + '">' + k.value + '</div>'
      + '<div class="kpi-delta ' + k.trend + '">' + k.delta + '</div>'
      + '</div>';
  }).join('');
}

/* ── 처리 알림 ────────────────────────────────────────────── */
var alertList = document.getElementById('alert-list');
if (alertList) {
  alertList.innerHTML = D.alerts.map(function(a) {
    var onclick = a.link ? ' onclick="location.href=\'' + a.link + '\'" style="cursor:pointer"' : '';
    return '<div class="alert-item"' + onclick + '>'
      + '<div class="alert-dot" style="background:' + a.dot + '"></div>'
      + '<div class="alert-body"><div class="alert-title">' + a.title + '</div><div class="alert-sub">' + a.sub + '</div></div>'
      + '<div class="alert-meta"><span class="alert-time">' + a.time + '</span><span class="alert-arrow">›</span></div>'
      + '</div>';
  }).join('');
}

/* ── 빌드 진행 현황 ───────────────────────────────────────── */
var doneCount = D.buildSteps.filter(function(s) { return s.done; }).length;
var buildHeader = document.getElementById('build-header-sub');
if (buildHeader) buildHeader.textContent = D.buildSteps.length + '단계 중 ' + doneCount + '완료';

var bsEl = document.getElementById('build-steps');
if (bsEl) {
  D.buildSteps.forEach(function(st) {
    var color = st.warn ? '#D97706' : st.done ? '#059669' : '#9CA3AF';
    var icon  = st.warn ? '⚠' : st.done ? '✓' : '○';
    bsEl.innerHTML += '<div class="build-row">'
      + '<div class="build-icon" style="color:' + color + '">' + icon + '</div>'
      + '<div class="build-label">' + st.label + '</div>'
      + '<div class="build-bar-wrap"><div class="build-bar" style="width:' + st.pct + '%;background:' + color + '"></div></div>'
      + '<div class="build-pct">' + st.pct + '%</div>'
      + '</div>';
  });
}

/* ── 문의 퍼널 ────────────────────────────────────────────── */
var frEl = document.getElementById('funnel-row');
if (frEl) {
  D.funnel.steps.forEach(function(f, i) {
    var rate = i > 0 ? Math.round(f.n / D.funnel.steps[i-1].n * 100) + '%' : '';
    frEl.innerHTML += '<div class="funnel-col">'
      + '<div class="funnel-num">' + f.n.toLocaleString() + '</div>'
      + '<div class="funnel-lbl">' + f.lbl + '</div>'
      + '<div class="funnel-bar" style="background:' + f.color + '"></div>'
      + '<div class="funnel-rate">' + rate + '</div>'
      + '</div>';
  });
}
var funnelSummary = document.getElementById('funnel-summary');
if (funnelSummary) {
  funnelSummary.innerHTML = '방문→내원 전환율 <span style="color:var(--green);font-weight:600">' + D.funnel.convRate + '</span> · 업계 평균 ' + D.funnel.industryAvg;
}

/* ── 채널별 문의 ──────────────────────────────────────────── */
var chEl = document.getElementById('ch-rows');
if (chEl) {
  D.channels.forEach(function(c) {
    chEl.innerHTML += '<div class="ch-row">'
      + '<div class="ch-dot" style="background:' + c.color + '"></div>'
      + '<div class="ch-name">' + c.name + '</div>'
      + '<div class="ch-bar-wrap"><div class="ch-bar" style="width:' + c.pct + '%;background:' + c.color + '"></div></div>'
      + '<div class="ch-cnt">' + c.cnt + '건</div>'
      + '<div class="ch-pct">' + c.pct + '%</div>'
      + '</div>';
  });
}

/* ── 오늘 일정 ────────────────────────────────────────────── */
var schEl = document.getElementById('sched-list');
if (schEl) {
  D.schedule.forEach(function(s) {
    schEl.innerHTML += '<div class="sched-item" onclick="location.href=\'html/hospital_crm_booking.html\'" style="cursor:pointer">'
      + '<div class="sched-time">' + s.time + '</div>'
      + '<div class="sched-dot" style="background:' + s.color + '"></div>'
      + '<div class="sched-body"><div class="sched-title">' + s.title + '</div><div class="sched-sub">' + s.sub + '</div></div>'
      + '<span class="sched-badge" style="background:' + s.bc + ';color:' + s.btc + '">' + s.badge + '</span>'
      + '</div>';
  });
}

/* ── AEO 인용 현황 ────────────────────────────────────────── */
var aeoEl = document.getElementById('aeo-list');
if (aeoEl) {
  D.aeo.items.forEach(function(a) {
    aeoEl.innerHTML += '<div class="aeo-row">'
      + '<div class="aeo-engine">' + a.engine + '</div>'
      + '<div class="aeo-bar-wrap"><div class="aeo-bar" style="width:' + Math.round(a.cnt / a.max * 100) + '%;background:' + a.color + '"></div></div>'
      + '<div class="aeo-cnt">' + a.cnt + '회</div>'
      + '<div class="aeo-delta">' + a.delta + '</div>'
      + '</div>';
  });
}
var aeoSummary = document.getElementById('aeo-summary');
if (aeoSummary) {
  aeoSummary.innerHTML = '이번 달 총 <span style="color:var(--navy);font-weight:600">' + D.aeo.totalThisMonth + '</span> · <span style="color:var(--green);font-weight:500">' + D.aeo.delta + '</span>';
}

/* ── LINE 자동상담 ────────────────────────────────────────── */
var lineStats = [
  { id:'line-ai-rate',   value: D.lineAuto.aiRate      },
  { id:'line-avg-resp',  value: D.lineAuto.avgResponse },
  { id:'line-conv-rate', value: D.lineAuto.convRate    },
];
lineStats.forEach(function(s) {
  var el = document.getElementById(s.id);
  if (el) el.textContent = s.value;
});

/* ── LINE 차트 ────────────────────────────────────────────── */
new Chart(document.getElementById('lineChart'), {
  type: 'bar',
  data: {
    labels: D.lineAuto.chartData.map(function(_, i) { return i + 1; }),
    datasets: [{ data: D.lineAuto.chartData, backgroundColor: '#0D9488', borderRadius: 2 }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false, beginAtZero: true } }
  }
});
