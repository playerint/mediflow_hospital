/* crm_booking.js — 예약 관리 렌더링 로직
   데이터는 booking-data.js에서 로드됨
*/

/* ── KPI ────────────────────────────────────────────────────────── */
function renderKPI() {
  var kpi = computeKPI();
  var items = [
    {color:'var(--navy)', lbl:'이번 주 예약', num: kpi.weekCount + '건',   dl:'', cls:'neu'},
    {color:'var(--blue)', lbl:'이번 달 예약', num: kpi.monthCount + '건',  dl:'', cls:'neu'},
    {color:'var(--red)',  lbl:'취소율',        num: kpi.cancelRate,          dl:'취소 기준', cls:'down'},
    {color:'var(--gray-300)', lbl:'평균 리드타임', num: kpi.leadTime, dl:'문의→예약', cls:'neu'},
  ];
  var grid = document.getElementById('kpi-grid');
  if (!grid) return;
  grid.innerHTML = items.map(function(item) {
    return '<div class="card" style="border-top:3px solid ' + item.color + '">'
      + '<div class="kpi-lbl">' + item.lbl + '</div>'
      + '<div class="kpi-num">' + item.num + '</div>'
      + '<div class="kpi-dl ' + item.cls + '">' + item.dl + '</div>'
      + '</div>';
  }).join('');
}

/* ── 캘린더 ──────────────────────────────────────────────────────── */
function renderCalendar() {
  var cal = document.getElementById('calendar');
  if (!cal) return;

  var weekDays = getCurrentWeekDays();

  // 주간 타이틀
  var titleEl = document.getElementById('cal-week-title');
  if (titleEl && weekDays.length) {
    var first = weekDays[0].dateKey;
    var last  = weekDays[6].dateKey;
    var fParts = first.split('/');
    var lParts = last.split('/');
    titleEl.textContent = '2026년 ' + fParts[0] + '월 ' + fParts[1] + '일 ~ ' + lParts[1] + '일';
  }

  cal.innerHTML = '';
  for (var i = 0; i < weekDays.length; i++) {
    var day = weekDays[i];
    var chips = '';
    for (var j = 0; j < ALL_BOOKINGS.length; j++) {
      var b = ALL_BOOKINGS[j];
      if (b.date === day.dateKey) {
        var tc = TYPE_COLORS[b.type] || {bg:'#F3F4F6', tc:'#374151'};
        chips += '<div class="bk-chip" style="background:' + tc.bg + ';color:' + tc.tc + '">'
          + b.time.split(':')[0] + '시 ' + b.name.split(' ')[0]
          + '</div>';
      }
    }
    var nameColor = day.isSat ? '#2563EB' : day.isSun ? '#DC2626' : '#9CA3AF';
    cal.innerHTML += '<div class="day-col">'
      + '<div class="day-head">'
      + '<div class="day-name" style="color:' + nameColor + '">' + day.dayName + '</div>'
      + '<div class="day-num' + (day.isToday ? ' today' : '') + '">' + day.dateNum + '</div>'
      + '</div>'
      + chips + '</div>';
  }
}

/* ── 오늘 일정 ───────────────────────────────────────────────────── */
function renderToday() {
  var el = document.getElementById('today-list');
  if (!el) return;

  var today = new Date();
  var todayKey = toDateKey(today);

  // 헤더 날짜 업데이트
  var dateEl = document.getElementById('today-date');
  if (dateEl) dateEl.textContent = (today.getMonth() + 1) + '월 ' + today.getDate() + '일';

  var todayBks = ALL_BOOKINGS.filter(function(b) { return b.date === todayKey; });
  todayBks.sort(function(a, b) { return a.time.localeCompare(b.time); });

  if (!todayBks.length) {
    el.innerHTML = '<div style="font-size:12px;color:#9CA3AF;padding:10px 0">오늘 예약 없음</div>';
    return;
  }

  var html = '';
  for (var k = 0; k < todayBks.length; k++) {
    var tb = todayBks[k];
    var tc = TYPE_COLORS[tb.type] || {bg:'#F3F4F6', tc:'#374151'};
    html += '<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #F3F4F6">';
    html += '<div style="font-size:12px;font-weight:600;color:var(--navy);min-width:38px">' + tb.time + '</div>';
    html += '<div style="flex:1"><div style="font-size:13px;font-weight:500">' + tb.name + '</div><div style="font-size:12px;color:#9CA3AF">' + tb.proc + '</div></div>';
    html += '<span class="badge" style="background:' + tc.bg + ';color:' + tc.tc + ';font-size:10px">' + (TYPE_LABELS[tb.type] || '') + '</span>';
    html += '</div>';
  }
  el.innerHTML = html;
}

/* ── 예약 리스트 테이블 ───────────────────────────────────────────── */
var _currentFilter = 'all';

function renderBookingTable(filter) {
  _currentFilter = filter || 'all';
  var tbody = document.getElementById('booking-tbody');
  if (!tbody) return;

  var rows = '';
  for (var i = 0; i < ALL_BOOKINGS.length; i++) {
    var b = ALL_BOOKINGS[i];
    if (_currentFilter !== 'all' && b.type !== _currentFilter) continue;

    var tc  = TYPE_COLORS[b.type] || {bg:'#F3F4F6', tc:'#374151'};
    var sc  = statusChipStyle(b.status);
    var lineHtml = b.line
      ? '<span style="color:#059669;font-size:13px">✓</span>'
      : '<span style="color:#D1D5DB;font-size:13px">—</span>';

    rows += '<tr onclick="openBookingDetail(' + i + ')" data-idx="' + i + '">';
    rows += '<td style="font-weight:500;color:var(--navy)">' + b.date + '</td>';
    rows += '<td>' + b.time + '</td>';
    rows += '<td style="font-weight:500">' + b.name + '</td>';
    rows += '<td>' + b.proc + '</td>';
    rows += '<td><span class="badge" style="background:' + tc.bg + ';color:' + tc.tc + '">' + (TYPE_LABELS[b.type] || b.type) + '</span></td>';
    rows += '<td style="font-size:12px;color:#6B7280">' + b.doctor + '</td>';
    rows += '<td style="text-align:center">' + lineHtml + '</td>';
    rows += '<td><span class="badge" style="background:' + sc.sbc + ';color:' + sc.stc + '">' + b.status + '</span></td>';
    rows += '<td><button class="btn" style="font-size:12px;padding:3px 9px" onclick="event.stopPropagation();editBooking(' + i + ')">편집</button></td>';
    rows += '</tr>';
  }
  tbody.innerHTML = rows;
}

function setBookingFilter(f, btn) {
  document.querySelectorAll('.filter-pills .pill').forEach(function(p) { p.classList.remove('on'); });
  btn.classList.add('on');
  renderBookingTable(f);
}

function openBookingDetail(idx) {
  var b = ALL_BOOKINGS[idx];
  if (!b) return;
  var sc = statusChipStyle(b.status);
  var tc = TYPE_COLORS[b.type] || {bg:'#F3F4F6', tc:'#374151'};
  var lineText = b.line ? '발송 완료 ✓' : '미발송';
  var body = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:13px">'
    + detail('날짜', b.date) + detail('시간', b.time)
    + detail('환자명', b.name) + detail('시술', b.proc)
    + detail('담당 의사', b.doctor) + detail('LINE', lineText)
    + '</div>'
    + '<div style="margin-top:10px"><span class="badge" style="background:' + tc.bg + ';color:' + tc.tc + '">' + (TYPE_LABELS[b.type]||b.type) + '</span>'
    + '&nbsp;<span class="badge" style="background:' + sc.sbc + ';color:' + sc.stc + '">' + b.status + '</span></div>';
  openModal('📅 예약 상세 — ' + b.name, body, null, null, null);
}

function detail(label, val) {
  return '<div><div style="font-size:12px;font-weight:600;color:#9CA3AF;margin-bottom:2px">' + label + '</div><div>' + val + '</div></div>';
}

/* ── 편집 모달 ───────────────────────────────────────────────────── */
function editBooking(idx) {
  var b = ALL_BOOKINGS[idx];
  if (!b) return;
  var body = '<div style="margin-bottom:10px">'
    + '<label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:4px">환자명</label>'
    + '<input style="width:100%;padding:8px 12px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:13px;font-family:inherit" value="' + b.name + '" id="edit-name"></div>'
    + '<div style="margin-bottom:10px">'
    + '<label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:4px">시술</label>'
    + '<input style="width:100%;padding:8px 12px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:13px;font-family:inherit" value="' + b.proc + '" id="edit-proc"></div>'
    + '<div><label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:4px">상태</label>'
    + '<select style="width:100%;padding:8px 12px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:13px;font-family:inherit" id="edit-status">'
    + ['대기','확정','완료','취소'].map(function(s) {
        return '<option' + (s === b.status ? ' selected' : '') + '>' + s + '</option>';
      }).join('')
    + '</select></div>';

  openModal('✏ 예약 편집 — ' + b.name, body, function() {
    var nameEl   = document.getElementById('edit-name');
    var procEl   = document.getElementById('edit-proc');
    var statusEl = document.getElementById('edit-status');
    if (nameEl)   ALL_BOOKINGS[idx].name   = nameEl.value;
    if (procEl)   ALL_BOOKINGS[idx].proc   = procEl.value;
    if (statusEl) ALL_BOOKINGS[idx].status = statusEl.value;
    renderBookingTable(_currentFilter);
    renderToday();
    renderCalendar();
    renderKPI();
    showToast('✓ 예약이 수정되었습니다.', 'success');
  }, '저장', 'btn-primary');
}

/* ── CSV 내보내기 ────────────────────────────────────────────────── */
function exportCSV() {
  var data = ALL_BOOKINGS.filter(function(b) {
    return _currentFilter === 'all' || b.type === _currentFilter;
  });
  var rows = '날짜,시간,환자명,시술,유형,담당 의사,LINE 발송,상태\n';
  for (var i = 0; i < data.length; i++) {
    var b = data[i];
    rows += [b.date, b.time, b.name, b.proc, TYPE_LABELS[b.type] || b.type, b.doctor, b.line ? 'O' : 'X', b.status].join(',') + '\n';
  }
  var a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent('﻿' + rows);
  a.download = 'bookings.csv';
  a.click();
  showToast('✓ CSV 다운로드 완료', 'success');
}

/* ── 공통 UI ────────────────────────────────────────────────────── */
function showToast(msg, type) {
  var e = document.getElementById('__toast'); if (e) e.remove();
  var bg = type === 'success' ? '#059669' : type === 'error' ? '#DC2626' : '#0D1B3E';
  var t = document.createElement('div'); t.id = '__toast';
  t.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:' + bg + ';color:#fff;padding:11px 22px;border-radius:10px;font-size:13px;font-weight:500;box-shadow:0 4px 20px rgba(0,0,0,.2);z-index:9999;white-space:nowrap';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function() { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(function() { t.remove(); }, 300); }, 2500);
}

function openModal(title, bodyHtml, onConfirm, confirmLabel, confirmClass) {
  var e = document.getElementById('__modal'); if (e) e.remove();
  var m = document.createElement('div'); m.id = '__modal';
  m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9000;display:flex;align-items:center;justify-content:center';
  m.innerHTML = '<div style="background:#fff;border-radius:16px;padding:28px 32px;width:100%;max-width:460px;box-shadow:0 20px 60px rgba(0,0,0,.2)">'
    + '<div style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:14px">' + title + '</div>'
    + '<div style="font-size:13px;color:#374151;line-height:1.7;margin-bottom:20px">' + bodyHtml + '</div>'
    + '<div style="display:flex;gap:8px;justify-content:flex-end">'
    + '<button class="btn" onclick="closeModal()">닫기</button>'
    + (onConfirm ? '<button class="btn ' + (confirmClass || 'btn-primary') + '" id="__modal-confirm">' + (confirmLabel || '확인') + '</button>' : '')
    + '</div></div>';
  m.addEventListener('click', function(ev) { if (ev.target === m) closeModal(); });
  document.body.appendChild(m);
  var cb = document.getElementById('__modal-confirm');
  if (cb && onConfirm) cb.addEventListener('click', function() { closeModal(); onConfirm(); });
}

function closeModal() {
  var m = document.getElementById('__modal'); if (m) m.remove();
}

/* ── 초기화 ─────────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', function() {
  renderKPI();
  renderCalendar();
  renderToday();
  renderBookingTable('all');
});
