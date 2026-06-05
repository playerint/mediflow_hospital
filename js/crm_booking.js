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
    return '<div class="card">'
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
        chips += '<div class="bk-chip" style="background:' + tc.bg + ';color:' + tc.tc + ';cursor:pointer" onclick="openBookingDetail(' + j + ')">'
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
    var tbIdx = ALL_BOOKINGS.indexOf(tb);
    html += '<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #F3F4F6;cursor:pointer" onclick="openBookingDetail(' + tbIdx + ')">';
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

/* ── 예약 등록 모달 ──────────────────────────────────────────────── */
function openBookingModal() {
  var prev = document.getElementById('__bk-modal');
  if (prev) prev.remove();

  var overlay = document.createElement('div');
  overlay.id = '__bk-modal';
  overlay.className = 'bk-overlay';

  overlay.innerHTML =
    '<div class="bk-modal">'
    + '<div class="bk-modal-head">'
    +   '<div style="font-size:16px;font-weight:700;color:var(--navy)">📅 예약 등록</div>'
    +   '<button onclick="closeBkModal()" style="background:none;border:none;cursor:pointer;font-size:18px;color:var(--gray-400);padding:4px;line-height:1">✕</button>'
    + '</div>'
    + '<div class="bk-modal-body" id="bk-form-body">'
    +   '<div class="bk-section">'
    +     '<div class="bk-section-title">👤 환자 정보</div>'
    +     '<div class="bk-field">'
    +       '<div class="bk-label">기존 환자 검색 <span style="font-size:12px;color:var(--gray-400);font-weight:400">이름으로 검색</span></div>'
    +       '<div class="bk-patient-wrap">'
    +         '<input class="bk-input" id="bk-patient-search" placeholder="예) 야마다" oninput="bkSearchPatient(this.value)" autocomplete="off">'
    +         '<div class="bk-patient-result" id="bk-patient-result"></div>'
    +       '</div>'
    +       '<div class="bk-sel-patient" id="bk-sel-patient">'
    +         '<div class="bk-p-avatar" id="bk-sel-avatar" style="background:#EEF2FF;color:#0D1B3E"></div>'
    +         '<div style="flex:1"><div style="font-size:13px;font-weight:500;color:var(--navy)" id="bk-sel-name"></div><div style="font-size:12px;color:var(--gray-500)" id="bk-sel-meta"></div></div>'
    +         '<button class="btn" style="font-size:12px;padding:3px 9px" onclick="bkClearPatient()">✕ 해제</button>'
    +       '</div>'
    +     '</div>'
    +     '<div style="display:flex;align-items:center;gap:8px;margin:12px 0">'
    +       '<div style="flex:1;height:1px;background:var(--gray-100)"></div>'
    +       '<span style="font-size:12px;color:var(--gray-400)">또는 신규 환자 직접 입력</span>'
    +       '<div style="flex:1;height:1px;background:var(--gray-100)"></div>'
    +     '</div>'
    +     '<div class="bk-grid2">'
    +       '<div class="bk-field"><div class="bk-label">성명 (일본어)<span style="color:var(--red);margin-left:2px">*</span></div><input class="bk-input" id="bk-name-ja" placeholder="山田 沙織"></div>'
    +       '<div class="bk-field"><div class="bk-label">성명 (한국어)</div><input class="bk-input" id="bk-name-ko" placeholder="야마다 사오리"></div>'
    +       '<div class="bk-field"><div class="bk-label">연락처 (LINE ID / Instagram ID)</div><input class="bk-input" id="bk-contact" placeholder="@yamada_saori"></div>'
    +       '<div class="bk-field"><div class="bk-label">유입 채널</div>'
    +         '<select class="bk-select" id="bk-channel"><option value="">선택</option><option value="LINE">LINE</option><option value="Instagram">Instagram</option></select>'
    +       '</div>'
    +     '</div>'
    +   '</div>'
    +   '<div class="bk-section">'
    +     '<div class="bk-section-title">📅 예약 정보</div>'
    +     '<div class="bk-grid2">'
    +       '<div class="bk-field"><div class="bk-label">예약 유형<span style="color:var(--red);margin-left:2px">*</span></div>'
    +         '<select class="bk-select" id="bk-type" onchange="bkUpdateSlots()">'
    +           '<option value="">선택</option>'
    +           '<option value="consult">상담 (카운슬링)</option>'
    +           '<option value="online">비대면 상담</option>'
    +           '<option value="surgery">수술</option>'
    +           '<option value="checkup">사후 체크업</option>'
    +           '<option value="laser">시술 (레이저 등)</option>'
    +         '</select>'
    +       '</div>'
    +       '<div class="bk-field"><div class="bk-label">관심 시술</div><select class="bk-select" id="bk-procedure"><option value="">선택</option></select></div>'
    +       '<div class="bk-field"><div class="bk-label">예약 날짜<span style="color:var(--red);margin-left:2px">*</span></div><input class="bk-input" type="date" id="bk-date" onchange="bkUpdateSlots()"></div>'
    +       '<div class="bk-field"><div class="bk-label">담당 의사</div><select class="bk-select" id="bk-doctor" onchange="bkUpdateSlots()"><option value="">배정 없음</option></select></div>'
    +     '</div>'
    +     '<div class="bk-field"><div class="bk-label">예약 시간<span style="color:var(--red);margin-left:2px">*</span></div>'
    +       '<div class="bk-time-slots" id="bk-time-slots"></div>'
    +       '<input type="hidden" id="bk-selected-time">'
    +     '</div>'
    +   '</div>'
    +   '<div class="bk-section">'
    +     '<div class="bk-section-title">📝 메모 및 알림</div>'
    +     '<div class="bk-field"><div class="bk-label">내부 메모</div>'
    +       '<textarea class="bk-textarea" id="bk-memo" rows="3" placeholder="예) 일본어 전담 스탭 배정 필요 · 이전 상담 내용 참고"></textarea>'
    +     '</div>'
    +     '<div class="bk-field"><div class="bk-label">LINE 확정 메시지 발송</div>'
    +       '<label class="bk-send-check"><input type="checkbox" id="bk-send-line" checked> 예약 등록 즉시 LINE으로 확정 메시지 자동 발송</label>'
    +       '<label class="bk-send-check" style="margin-top:6px"><input type="checkbox" id="bk-send-reminder" checked> 예약 전일 오전 10시 리마인더 발송</label>'
    +     '</div>'
    +   '</div>'
    + '</div>'
    + '<div class="bk-fade" id="bk-fade"></div>'
    + '<div class="bk-modal-foot">'
    +   '<button class="btn" onclick="closeBkModal()">취소</button>'
    +   '<button class="btn btn-primary" onclick="bkSubmitBooking()">📅 예약 등록</button>'
    + '</div>'
    + '</div>';

  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeBkModal(); });
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  var procEl = document.getElementById('bk-procedure');
  PROCEDURES.forEach(function(p) {
    var o = document.createElement('option'); o.textContent = p; procEl.appendChild(o);
  });
  var doctorEl = document.getElementById('bk-doctor');
  DOCTORS.forEach(function(d) {
    var o = document.createElement('option'); o.value = d; o.textContent = d; doctorEl.appendChild(o);
  });
  var today = new Date();
  document.getElementById('bk-date').value = today.getFullYear() + '-'
    + String(today.getMonth() + 1).padStart(2, '0') + '-'
    + String(today.getDate()).padStart(2, '0');
  bkUpdateSlots();

  var body = document.getElementById('bk-form-body');
  var fade = document.getElementById('bk-fade');
  function bkCheckFade() {
    var atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 10;
    if (fade) fade.style.opacity = atBottom ? '0' : '1';
  }
  body.addEventListener('scroll', bkCheckFade);
  bkCheckFade();
}

function closeBkModal() {
  var m = document.getElementById('__bk-modal');
  if (m) m.remove();
  document.body.style.overflow = '';
}

function bkSearchPatient(v) {
  var res = document.getElementById('bk-patient-result');
  if (!v.trim()) { res.style.display = 'none'; return; }
  var patients = getPatientsFromBookings();
  var matched = patients.filter(function(p) { return p.name.indexOf(v) !== -1; });
  if (!matched.length) { res.style.display = 'none'; return; }
  res.innerHTML = matched.slice(0, 6).map(function(p) {
    return '<div class="bk-patient-item" onclick=\'bkSelectPatient(' + JSON.stringify(p).replace(/'/g, '&#39;') + ')\'>'
      + '<div class="bk-p-avatar" style="background:' + p.bg + ';color:' + p.tc + '">' + p.init + '</div>'
      + '<div><div style="font-size:13px;font-weight:500">' + p.name + '</div>'
      + '<div style="font-size:12px;color:var(--gray-400)">' + p.ch + ' · ' + p.proc + '</div></div></div>';
  }).join('');
  res.style.display = 'block';
}

function bkSelectPatient(p) {
  document.getElementById('bk-patient-search').value = p.name;
  document.getElementById('bk-patient-result').style.display = 'none';
  var sp = document.getElementById('bk-sel-patient');
  var av = document.getElementById('bk-sel-avatar');
  av.textContent = p.init; av.style.background = p.bg; av.style.color = p.tc;
  document.getElementById('bk-sel-name').textContent = p.name;
  document.getElementById('bk-sel-meta').textContent = p.ch + ' · ' + p.proc;
  sp.style.display = 'flex';
  document.getElementById('bk-name-ko').value = p.name;
}

function bkClearPatient() {
  document.getElementById('bk-patient-search').value = '';
  document.getElementById('bk-sel-patient').style.display = 'none';
  document.getElementById('bk-name-ja').value = '';
  document.getElementById('bk-name-ko').value = '';
}

function bkUpdateSlots() {
  var typeEl   = document.getElementById('bk-type');
  var dateEl   = document.getElementById('bk-date');
  var doctorEl = document.getElementById('bk-doctor');
  var el       = document.getElementById('bk-time-slots');
  if (!el) return;
  var type    = typeEl ? typeEl.value || 'consult' : 'consult';
  var dateVal = dateEl ? dateEl.value : '';
  var doctor  = doctorEl ? doctorEl.value : '';
  var times   = SLOT_TIMES[type] || SLOT_TIMES.consult;
  document.getElementById('bk-selected-time').value = '';
  var dateKey = '';
  if (dateVal) {
    var parts = dateVal.split('-');
    dateKey = parseInt(parts[1]) + '/' + parseInt(parts[2]);
  }
  var booked = dateKey ? getBookedTimes(dateKey, doctor || null) : [];
  el.innerHTML = times.map(function(t) {
    var isBooked = booked.indexOf(t) !== -1;
    return '<div class="bk-time-slot' + (isBooked ? ' off' : '') + '"'
      + (isBooked ? '' : ' onclick="bkSelectTime(\'' + t + '\',this)"') + '>'
      + t + (isBooked ? '<br><span style="font-size:9px">예약됨</span>' : '')
      + '</div>';
  }).join('');
}

function bkSelectTime(t, el) {
  document.querySelectorAll('.bk-time-slot').forEach(function(s) { s.classList.remove('on'); });
  el.classList.add('on');
  document.getElementById('bk-selected-time').value = t;
}

function bkSubmitBooking() {
  var nameJa   = document.getElementById('bk-name-ja').value.trim();
  var nameKo   = document.getElementById('bk-name-ko').value.trim();
  var type     = document.getElementById('bk-type').value;
  var dateVal  = document.getElementById('bk-date').value;
  var time     = document.getElementById('bk-selected-time').value;
  var proc     = document.getElementById('bk-procedure').value;
  var doctor   = document.getElementById('bk-doctor').value;
  var sendLine = document.getElementById('bk-send-line').checked;

  if (!nameJa)  { showToast('환자 성명(일본어)을 입력해주세요.', 'error'); return; }
  if (!type)    { showToast('예약 유형을 선택해주세요.', 'error'); return; }
  if (!dateVal) { showToast('예약 날짜를 선택해주세요.', 'error'); return; }
  if (!time)    { showToast('예약 시간을 선택해주세요.', 'error'); return; }

  var parts   = dateVal.split('-');
  var dateKey = parseInt(parts[1]) + '/' + parseInt(parts[2]);
  var typeMap  = {consult:'consult', online:'online', surgery:'auto', checkup:'visit', laser:'auto'};

  saveBooking({
    date:   dateKey, time: time,
    name:   nameKo || nameJa, proc: proc || '미정',
    type:   typeMap[type] || 'consult', doctor: doctor || '미배정',
    line:   sendLine, status: '확정',
  });

  closeBkModal();
  renderBookingTable(_currentFilter);
  renderCalendar();
  renderToday();
  renderKPI();
  showToast('✓ ' + dateKey + ' ' + time + ' — ' + (nameKo || nameJa) + ' 예약 등록 완료', 'success');
}

/* ── 초기화 ─────────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', function() {
  renderKPI();
  renderCalendar();
  renderToday();
  renderBookingTable('all');
});
