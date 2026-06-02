
// ── 환자 데이터 ──────────────────────────────────────────────────

/* ══════════════════════════════════════════════════════
   다국어 발송 시스템
══════════════════════════════════════════════════════ */
var LANG_CONFIG = {
  'ja':    { abbr:'JP', name:'일본어',      bg:'#2563EB', pair:'ko|ja' },
  'zh-CN': { abbr:'CN', name:'중국어 간체', bg:'#DE2910', pair:'ko|zh-CN' },
  'zh-TW': { abbr:'TW', name:'중국어 번체', bg:'#002395', pair:'ko|zh-TW' },
  'en':    { abbr:'EN', name:'영어',        bg:'#012169', pair:'ko|en' },
  'th':    { abbr:'TH', name:'태국어',      bg:'#A51931', pair:'ko|th' },
};
var PATIENT_DEFAULT_LANG = {0:'ja',1:'ja',2:'ja',3:'ja',4:'ja',5:'ja',6:'ja',7:'ja',8:'ja',9:'zh-CN',10:'zh-TW',11:'en',12:'th'};
var patientLangStore = {};
var currentLang = 'ja';

function getLang() { return LANG_CONFIG[currentLang] || LANG_CONFIG['ja']; }

function setLangForPatient(id) {
  currentLang = patientLangStore[id] || PATIENT_DEFAULT_LANG[id] || 'ja';
  if(!patientLangStore[id]) patientLangStore[id] = currentLang;
  updateLangUI();
}

function updateLangUI() {
  var li = getLang();
  var badge = document.getElementById('lang-badge');
  var name  = document.getElementById('lang-name');
  var lbl   = document.getElementById('lang-label');
  var jaEl  = document.getElementById('draft-text-ja');
  if(badge) { badge.style.background = li.bg; badge.textContent = li.abbr; }
  if(name)  name.textContent = li.name;
  if(lbl)   lbl.textContent = li.abbr + ' ' + li.name + ' 발송';
  if(jaEl)  jaEl.placeholder = li.name + ' 번역 결과...';
}

function toggleLangMenu() {
  var menu = document.getElementById('lang-menu');
  if(menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}
document.addEventListener('click', function(e) {
  var menu = document.getElementById('lang-menu');
  var btn  = document.getElementById('lang-btn');
  if(!menu || menu.style.display === 'none') return;
  if(btn && btn.contains(e.target)) return;
  if(!menu.contains(e.target)) menu.style.display = 'none';
});

function selectLang(code, flag, name) {
  currentLang = code;
  if(typeof curId !== 'undefined') patientLangStore[curId] = code;
  updateLangUI();
  var menu = document.getElementById('lang-menu');
  if(menu) menu.style.display = 'none';
  var koEl = document.getElementById('draft-text-ko');
  if(koEl && koEl.value.trim()) onKoInput();
  if(typeof patients !== 'undefined' && typeof curId !== 'undefined' && patients[curId]) {
    renderAISuggests(patients[curId]);
    renderManual(patients[curId]);
    if(code !== 'ja') {
      setTimeout(function(){ regenSuggests(); renderManualWithLang(patients[curId]); }, 100);
    }
  }
}

var _translateTimer = null;

/* ══════════════════════════════════════════════════════
   번역 함수 — Gemini API (의료 상담 문맥 반영)
   Next.js 전환 시 gemini.js → /api/gemini 로 프록시
══════════════════════════════════════════════════════ */
function translateKoToJa(text, callback) {
  if(!text || !text.trim()) { callback(''); return; }
  geminiTranslate(text, currentLang, callback);
}

function onKoInput() {
  var koEl = document.getElementById('draft-text-ko');
  var jaEl = document.getElementById('draft-text-ja');
  if(!koEl || !jaEl) return;
  jaEl.value = '번역 중...';
  jaEl.style.color = 'var(--gray-400)';
  clearTimeout(_translateTimer);
  _translateTimer = setTimeout(function() {
    translateKoToJa(koEl.value, function(result) {
      jaEl.value = result;
      jaEl.style.color = '';
    });
  }, 600);
}

function renderAISuggestsWithLang(p) {
  var el = document.getElementById('ai-suggests');
  if(!el || !el._suggests) return;
  var li = getLang();
  var suggests = el._suggests;
  el.style.opacity = '0.4';
  var done = 0;
  var results = suggests.map(function(s){ return Object.assign({}, s); });
  suggests.forEach(function(s, i) {
    translateKoToJa(s.ko, function(t) {
      results[i].jaLang = t || s.ja;
      if(++done === suggests.length) {
        el.style.opacity = '1';
        var lastMsg = null;
        for(var j = p.msgs.length-1; j >= 0; j--) { if(p.msgs[j].from==='patient') { lastMsg=p.msgs[j]; break; } }
        var html = '';
        if(lastMsg) html += '<div style="background:var(--gray-50);border-radius:8px;padding:8px 10px;margin-bottom:10px"><div style="font-size:10px;font-weight:600;color:var(--gray-400);margin-bottom:4px">환자 마지막 질문</div><div style="font-size:12px;color:var(--navy);line-height:1.6">'+lastMsg.ja+'</div><div style="font-size:10px;color:var(--gray-500);margin-top:2px">'+lastMsg.ko+'</div></div>';
        html += '<div style="font-size:10px;font-weight:600;color:var(--gray-400);margin-bottom:6px">추천 답변 '+results.length+'개</div>';
        results.forEach(function(s2, idx) {
          html += '<div class="ai-suggest-item" id="sug-'+idx+'" onclick="selectSuggest('+idx+',this)"><div class="ai-suggest-tone" style="background:'+s2.toneBg+';color:'+s2.toneTc+'">'+s2.tone+'</div><div class="ai-suggest-text">'+s2.ko+'</div><div class="ai-suggest-ja">'+li.abbr+' '+s2.jaLang+'</div></div>';
        });
        el.innerHTML = html;
        el._suggests = results;
      }
    });
  });
}

function renderManualWithLang(p) {
  renderManual(p);
  if(currentLang === 'ja') return;
  var el = document.getElementById('manual-content');
  if(!el) return;
  var li = getLang();
  var items = el.querySelectorAll('.manual-item-body');
  if(!items.length) return;

  // 모든 항목을 구분자로 이어 1회 Gemini 호출
  var texts = Array.prototype.map.call(items, function(item){ return item.textContent.trim(); });
  var combined = texts.join('\n<<<SEP>>>\n');
  items.forEach(function(item){ item.style.opacity = '0.5'; });

  geminiTranslate(combined, currentLang, function(result) {
    items.forEach(function(item){ item.style.opacity = '1'; });
    if(!result) return;
    var translated = result.split(/<<<SEP>>>/);
    items.forEach(function(item, i) {
      var t = translated[i] ? translated[i].trim() : '';
      if(t) item.innerHTML = texts[i]
        + '<div style="margin-top:4px;font-size:10px;color:var(--gray-500)">'
        + li.abbr + ' ' + t + '</div>';
    });
  });
}

// patients, COACHING_DATA, MANUAL_DATA → js/data.js 참조

const statusColors = {
  new:       {bg:'#FEE2E2', tc:'#991B1B'},
  consulting:{bg:'#F3F4F6', tc:'#374151'},
  booked:    {bg:'#D1FAE5', tc:'#065F46'},
  closed:    {bg:'#F3F4F6', tc:'#6B7280'},
};

let curFilter = 'all';
let curId = 0;
let showKo = true; // 번역 토글 상태 (true=한국어 병기, false=일본어만)

// ── 리스트 렌더링 ────────────────────────────────────────────────
function renderList(filter, search) {
  filter = filter || 'all';
  search = search || '';
  const el = document.getElementById('inbox-list');
  const fd = patients.filter(p => {
    const mf = filter === 'all' || p.status === filter;
    const ms = !search || p.name.includes(search) || p.proc.includes(search) || p.ch.includes(search);
    return mf && ms;
  });
  el.innerHTML = fd.map(p => `
    <div class="inq-item${p.id === curId ? ' active' : ''}" onclick="selectPatient(${p.id})">
      <div class="inq-unread${p.unread ? '' : ' hidden'}"></div>
      <div class="inq-avatar" style="background:${p.bg};color:${p.tc}">${p.init}</div>
      <div class="inq-body">
        <div class="inq-top">
          <span class="inq-name" style="font-weight:${p.unread ? 600 : 400}">${p.name}</span>
          <span class="inq-time">${p.elapsed || p.msgs[p.msgs.length - 1].time}</span>
        </div>
        <div class="inq-preview">${p.msgs[p.msgs.length - 1].ko}</div>
        <div class="inq-tags">
          <span class="tag" style="display:inline-flex;align-items:center;justify-content:center;background:${p.bg};color:${p.tc}">${p.proc}</span>
          <span class="tag" style="display:inline-flex;align-items:center;justify-content:center;background:${statusColors[p.status].bg};color:${statusColors[p.status].tc}">${p.statusLabel}</span>
          <span class="tag" style="display:inline-flex;align-items:center;justify-content:center;background:${p.ch==='Instagram'?'#FDF2F8':'#EFF6FF'};color:${p.ch==='Instagram'?'#BE185D':'#2563EB'}">${p.ch==='Instagram'?'📸 Instagram':'💬 '+p.ch}</span>
        </div>
      </div>
    </div>`).join('');
}

// ── 환자 선택 ────────────────────────────────────────────────────
function selectPatient(id) {
  curId = id;
  var p = patients[id];

  // ── 채팅 헤더 업데이트 ──
  document.getElementById('d-avatar').style.background = p.bg;
  document.getElementById('d-avatar').style.color = p.tc;
  document.getElementById('d-avatar').textContent = p.init;
  document.getElementById('d-name').textContent = p.name + ' (' + p.nameJa + ')';
  document.getElementById('d-meta').textContent = p.ch + ' · ' + p.msgs[0].time + (p.elapsed ? ' · ' + p.elapsed + ' 경과' : '');
  var pbProc = document.getElementById('pb-proc'); if(pbProc) pbProc.textContent = p.proc;
  var pbCh   = document.getElementById('pb-ch');   if(pbCh)   pbCh.textContent = p.ch;
  var pbEl   = document.getElementById('rp-el');
  if(pbEl){
    var elapsedLabels = {new: p.elapsed || '—', consulting:'응대 중', booked:'예약 완료', closed:'종료'};
    var elapsedColors = {new: p.elapsed ? 'var(--red)' : 'var(--gray-400)', consulting:'var(--green)', booked:'var(--blue)', closed:'var(--gray-400)'};
    pbEl.textContent = elapsedLabels[p.status] || '—';
    pbEl.style.color = elapsedColors[p.status] || 'var(--gray-400)';
  }

  // ── 언어 세팅 ──
  setLangForPatient(id);

  // ── 상태 버튼 초기화 ──
  applyStatusBtn(p);

  // ── 메시지 렌더링 ──
  renderMessages(p);
  if(typeof updateRightPanel === 'function') updateRightPanel(p);
  p.unread = false;
  renderList(curFilter, document.querySelector('.inbox-search') ? document.querySelector('.inbox-search').value : '');
  updateKPICards();

  // ── 발송폼 — 종료만 숨김 ──
  var da = document.getElementById('ai-draft');
  if (da) {
    if (p.status !== 'closed') {
      var koEl = document.getElementById('draft-text-ko');
      var jaEl = document.getElementById('draft-text-ja');
      if (koEl) koEl.value = (p.draft && p.draft.ko) ? p.draft.ko : '';
      if (jaEl) jaEl.value = (p.draft && p.draft.ja) ? p.draft.ja : '';
      da.style.display = '';
    } else {
      da.style.display = 'none';
    }
  }

  // ── 발송 버튼 텍스트 채널별 변경 ──
  var sendBtn = document.getElementById('send-btn');
  if (sendBtn) {
    sendBtn.innerHTML = p.ch === 'Instagram' ? '📤 Instagram으로 발송' : '📤 LINE으로 발송';
  }
}

// ── 메시지 렌더링 (한국어 병기) ──────────────────────────────────
function renderMessages(p) {
  var ma = document.getElementById('msg-area');
  ma.innerHTML = p.msgs.map(function(m) {
    var isPatient = m.from === 'patient';
    var isAI      = m.from === 'ai';
    var isStaff   = m.from === 'staff';

    // 아바타
    var avatarHtml;
    if (isAI) {
      avatarHtml = '<div style="width:28px;height:28px;border-radius:50%;background:var(--navy-l);font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0">🌸</div>';
    } else if (isPatient) {
      avatarHtml = '<div style="width:28px;height:28px;border-radius:50%;background:' + p.bg + ';color:' + p.tc + ';font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">' + p.init[0] + '</div>';
    } else {
      var chIcon = p.ch === 'Instagram' ? '📸' : '💬';
      var chBg   = p.ch === 'Instagram' ? '#FDF2F8' : '#EFF6FF';
      var chTc   = p.ch === 'Instagram' ? '#BE185D' : '#2563EB';
      avatarHtml = '<div style="width:28px;height:28px;border-radius:50%;background:' + chBg + ';color:' + chTc + ';font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0">' + chIcon + '</div>';
    }

    // 발신자 레이블
    var senderLabel = '';
    if (isAI) {
      senderLabel = '<div style="font-size:12px;font-weight:600;color:var(--navy);margin-bottom:3px;display:flex;align-items:center;gap:4px">AI はな <span style="font-size:9px;background:#EEF2FF;color:var(--navy);padding:1px 5px;border-radius:4px;font-weight:400">자동응답</span></div>';
    } else if (isStaff) {
      var chName = p.ch === 'Instagram' ? 'Instagram' : 'LINE';
      var _li2 = LANG_CONFIG[m.lang] || getLang();
      senderLabel = '<div style="font-size:12px;font-weight:600;color:var(--gray-500);margin-bottom:3px;display:flex;align-items:center;gap:4px">' + chName + ' <span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:13px;background:'+_li2.bg+';color:#fff;border-radius:2px;font-size:9px;font-weight:700">'+_li2.abbr+'</span> <span style="font-size:9px;background:#D1FAE5;color:#065F46;padding:1px 5px;border-radius:4px;font-weight:400">발송</span></div>';
    }

    // 말풍선
    var bubbleContent = '';
    var bubbleBg, bubbleTc;
    if (isPatient) {
      bubbleBg = '#F3F4F6'; bubbleTc = '#111827';
      bubbleContent += '<div style="font-size:13px;line-height:1.7">' + m.ja + '</div>';
      if (m.ko) bubbleContent += '<div style="margin-top:5px;padding:5px 8px;background:rgba(0,0,0,.05);border-radius:6px;font-size:12px;color:#374151;line-height:1.6">KR ' + m.ko + '</div>';
    } else {
      bubbleBg = isAI ? '#0D1B3E' : (p.ch === 'Instagram' ? '#E1306C' : '#06C755');
      bubbleTc = '#fff';
      if (m.ko) bubbleContent += '<div style="font-size:13px;line-height:1.7">' + m.ko + '</div>';
      if (m.ja) bubbleContent += '<div style="margin-top:5px;padding:5px 8px;background:rgba(255,255,255,.2);border-radius:6px;font-size:12px;line-height:1.6">' + getLang().abbr + ' ' + m.ja + '</div>';
    }

    var isOut = !isPatient;
    var rowStyle   = 'display:flex;align-items:flex-start;gap:8px;margin-bottom:14px' + (isOut ? ';flex-direction:row-reverse' : '');
    var bdrRadius  = isPatient ? '4px 14px 14px 14px' : '14px 4px 14px 14px';
    var bubbleStyle = 'padding:10px 13px;border-radius:' + bdrRadius + ';background:' + bubbleBg + ';color:' + bubbleTc + ';max-width:260px;word-break:break-word';
    var timeStyle  = 'font-size:10px;color:var(--gray-400);margin-top:4px;text-align:' + (isOut ? 'left' : 'right');

    return '<div style="' + rowStyle + '">'
      + avatarHtml
      + '<div style="max-width:280px">'
      + senderLabel
      + '<div style="' + bubbleStyle + '">' + bubbleContent + '</div>'
      + '<div style="' + timeStyle + '">' + m.time + '</div>'
      + '</div>'
      + '</div>';
  }).join('');
  ma.scrollTop = ma.scrollHeight;
}




// ── AI 초안 한→일 번역 입력 ──────────────────────────────────────


// ── 발송 ─────────────────────────────────────────────────────────
function sendMsg() {
  var koTxt = document.getElementById('draft-text-ko').value;
  var jaTxt = document.getElementById('draft-text-ja').value;
  if (!jaTxt.trim()) { showToastInbox(getLang().name + ' 발송 내용을 입력해주세요.', 'error'); return; }

  var p = patients[curId];
  p.msgs.push({ from:'staff', ja: jaTxt, ko: koTxt || jaTxt, time:'지금', lang: currentLang });
  p.unread = false;

  renderMessages(p);

  // 입력창 초기화 (폼은 유지)
  var koEl = document.getElementById('draft-text-ko');
  var jaEl = document.getElementById('draft-text-ja');
  if (koEl) koEl.value = '';
  if (jaEl) jaEl.value = '';

  // AI 코칭 추천 답변 선택 해제
  document.querySelectorAll('.ai-suggest-item').forEach(function(e){ e.classList.remove('selected'); });

  var _ch = patients[curId] ? patients[curId].ch : 'LINE';
  var _bg = _ch === 'Instagram' ? '#E1306C' : '#059669';
  showToastInboxColor('✓ ' + _ch + '으로 발송되었습니다.', _bg);
  renderList(curFilter, '');
}

function updateKPICards() {
  var total   = patients.length;
  var unread  = patients.filter(function(p){ return p.unread; }).length;
  var booked  = patients.filter(function(p){ return p.status === 'booked'; }).length;
  var aiCount = patients.filter(function(p){ return p.msgs.some(function(m){ return m.from === 'ai'; }); }).length;
  var rate    = total ? (booked / total * 100).toFixed(1) : '0';
  var aiRate  = total ? (aiCount / total * 100).toFixed(1) : '0';

  var t = document.getElementById('kpi-total');    if(t) t.textContent = total + '건';
  var u = document.getElementById('kpi-unread');   if(u) u.textContent = unread + '건';
  var b = document.getElementById('kpi-booked');   if(b) b.textContent = booked + '건';
  var a = document.getElementById('kpi-ai');       if(a) a.textContent = aiCount + '건';
  var r = document.getElementById('kpi-rate');     if(r) r.textContent = '전환율 ' + rate + '%';
  var ar = document.getElementById('kpi-ai-rate'); if(ar) ar.textContent = aiRate + '%';

  var us = document.getElementById('kpi-unread-sub');
  if(us) us.textContent = unread > 0 ? '미응대 ' + unread + '건' : '모두 확인됨';
}

function updateFilterCounts() {
  var labels = { all:'전체', new:'신규', consulting:'상담중', booked:'예약완료', closed:'종료' };
  var counts = { all: patients.length, new:0, consulting:0, booked:0, closed:0 };
  patients.forEach(function(p){ if(counts[p.status] !== undefined) counts[p.status]++; });
  document.querySelectorAll('.pill[data-status]').forEach(function(btn) {
    var s = btn.getAttribute('data-status');
    if(labels[s] !== undefined) btn.textContent = labels[s] + ' ' + counts[s];
  });
}

function setFilter(f, btn) {
  curFilter = f;
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('on'));
  btn.classList.add('on');
  renderList(f, document.querySelector('.inbox-search') ? document.querySelector('.inbox-search').value : '');
}
function filterList(v) { renderList(curFilter, v); }


function cancelDraft() {
  var koEl = document.getElementById('draft-text-ko');
  var jaEl = document.getElementById('draft-text-ja');
  if (koEl) koEl.value = '';
  if (jaEl) jaEl.value = '';
  document.querySelectorAll('.ai-suggest-item').forEach(function(e){ e.classList.remove('selected'); });
}

function regenDraft() {
  const koEl = document.getElementById('draft-text-ko');
  const jaEl = document.getElementById('draft-text-ja');
  koEl.style.background = '#FFF9C4';
  jaEl.style.background = '#FFF9C4';
  setTimeout(function(){
    koEl.style.background = '#F0FDF4';
    jaEl.style.background = '#F0FDF4';
    setTimeout(function(){
      koEl.style.background = '';
      jaEl.style.background = '';
    }, 800);
    if (typeof showToast === 'function') showToast('✓ 답변 초안이 재생성되었습니다.', 'success');
  }, 1200);
}


/* ══════════════════════════════════════════════════════
   우측 패널 통합 기능 (patients 데이터 로드 후 실행)
   ※ 초기화(renderList + selectPatient)는 파일 맨 끝에서 1회만 호출
══════════════════════════════════════════════════════ */

/* ── 토스트 ── */

function showToastInboxColor(msg, bg) {
  var e = document.getElementById('inbox-toast'); if(e) e.remove();
  var t = document.createElement('div'); t.id='inbox-toast';
  t.style.cssText='position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:'+bg+';color:#fff;padding:11px 20px;border-radius:10px;font-size:13px;font-weight:500;box-shadow:0 4px 20px rgba(0,0,0,.2);z-index:99999;white-space:nowrap';
  t.textContent=msg; document.body.appendChild(t);
  setTimeout(function(){ t.style.opacity='0'; t.style.transition='opacity .3s'; setTimeout(function(){ t.remove(); },300); },2500);
}
function showToastInbox(msg, type) {
  var e = document.getElementById('inbox-toast'); if(e) e.remove();
  var bg = type==='success' ? '#059669' : type==='error' ? '#DC2626' : '#0D1B3E';
  var t = document.createElement('div'); t.id='inbox-toast';
  t.style.cssText='position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:'+bg+';color:#fff;padding:11px 20px;border-radius:10px;font-size:13px;font-weight:500;box-shadow:0 4px 20px rgba(0,0,0,.2);z-index:99999;white-space:nowrap';
  t.textContent=msg; document.body.appendChild(t);
  setTimeout(function(){ t.style.opacity='0'; t.style.transition='opacity .3s'; setTimeout(function(){ t.remove(); },300); },2500);
}

/* ── 모달 ── */
function openModal(title, bodyHtml, onConfirm, confirmLabel, confirmClass) {
  var e = document.getElementById('__modal'); if(e) e.remove();
  var m = document.createElement('div'); m.id='__modal';
  m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9000;display:flex;align-items:center;justify-content:center';
  m.innerHTML='<div style="background:#fff;border-radius:16px;padding:28px 32px;width:100%;max-width:460px;box-shadow:0 20px 60px rgba(0,0,0,.2)">'
    +'<div style="font-size:16px;font-weight:700;color:#0D1B3E;margin-bottom:14px">'+title+'</div>'
    +'<div style="font-size:13px;color:#374151;line-height:1.7;margin-bottom:20px">'+bodyHtml+'</div>'
    +'<div style="display:flex;gap:8px;justify-content:flex-end">'
    +'<button class="btn" onclick="closeModal()">취소</button>'
    +'<button class="btn '+(confirmClass||'btn-primary')+'" id="__modal-confirm">'+(confirmLabel||'확인')+'</button>'
    +'</div></div>';
  m.addEventListener('click',function(e){ if(e.target===m) closeModal(); });
  document.body.appendChild(m);
  document.getElementById('__modal-confirm').addEventListener('click',function(){ closeModal(); if(typeof onConfirm==='function') onConfirm(); });
}
function closeModal(){ var m=document.getElementById('__modal'); if(m) m.remove(); }

/* ── 예약으로 이동 ── */
function goToBooking() {
  var p = patients[curId];
  if(!p){ showToastInbox('환자를 먼저 선택해주세요.','error'); return; }
  openBookingModal(p);
}

/* ── 상태 변경 ── */

/* ── 버튼 상태 통합 함수 ── */
function applyStatusBtn(p) {
  var isClosed = p.status === "closed";
  var cfg = {
    new:        { label:"상담중으로 변경", cls:"btn btn-primary", color:"", opacity:"", textColor:"" },
    consulting: { label:"예약완료로 변경", cls:"btn btn-success", color:"var(--green)", opacity:"", textColor:"#fff" },
    booked:     { label:"종료로 변경",     cls:"btn btn-primary", color:"", opacity:"", textColor:"" },
    closed:     { label:"종료됨",          cls:"btn", color:"var(--gray-300)", opacity:"0.55", textColor:"#fff" },
  };
  var c = cfg[p.status] || cfg.new;
  ["status-btn", "rp-status-btn"].forEach(function(id) {
    var btn = document.getElementById(id);
    if (!btn) return;
    btn.textContent       = c.label;
    btn.className         = c.cls;
    btn.disabled          = isClosed;
    btn.style.cursor      = isClosed ? "not-allowed" : "";
    btn.style.opacity     = c.opacity;
    btn.style.background  = c.color;
    btn.style.borderColor = c.color;
    btn.style.color       = c.textColor || "";
  });
  var bookingLabels = {
    new:        "📅 예약 전환",
    consulting: "📅 예약 전환",
    booked:     "📅 예약 변경",
    closed:     "📅 예약 내역",
  };
  var bookingBtn = document.getElementById("rp-booking-btn");
  if (bookingBtn) bookingBtn.textContent = bookingLabels[p.status] || "📅 예약 전환";

  // 발송 버튼 텍스트 채널별 동기화
  var sendBtn = document.getElementById('send-btn');
  if (sendBtn) sendBtn.innerHTML = p.ch === 'Instagram' ? '📤 Instagram으로 발송' : '📤 LINE으로 발송';
}
function changeStatus() {
  var p = patients[curId];
  if(!p) return;
  if(p.status === 'closed') return; // 종료는 변경 불가
  var flow   = {new:'consulting', consulting:'booked', booked:'closed'};
  var labels = {new:'신규', consulting:'상담중', booked:'예약완료', closed:'종료'};
  var colors = {new:'var(--gray-400)', consulting:'var(--green)', booked:'var(--blue)', closed:'var(--gray-500)'};
  p.status = flow[p.status] || 'consulting';
  p.statusLabel = labels[p.status];

  applyStatusBtn(p);

  if(typeof updateRightPanel === 'function') updateRightPanel(p);
  renderList(curFilter, '');
  updateFilterCounts();
  updateKPICards();
  showToastInbox('✓ 상태가 ' + labels[p.status] + '(으)로 변경되었습니다.', 'success');
}

/* ── 메모 ── */
var memoStore = {};

/* ── 메모 저장/불러오기 ── */
function saveMemo() {
  var el = document.getElementById('rp-memo-input');
  if (!el || curId === undefined) return;
  memoStore[curId] = el.value;
}

function loadMemo(id) {
  var el = document.getElementById('rp-memo-input');
  if (!el) return;
  el.value = memoStore[id] || '';
}


/* ── 탭 전환 ── */
function setRpTab(tab, btn) {
  document.querySelectorAll('.rp-tab').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  ['ai','manual'].forEach(function(t){
    var el = document.getElementById('rp-tab-'+t);
    if(el) el.style.display = t===tab ? '' : 'none';
  });
}

/* ── 번역 복사 ── */

function updateRightPanel(p) {
  var av = document.getElementById('rp-avatar');
  if(av){ av.textContent = p.init; av.style.background = p.bg; av.style.color = p.tc; }
  var rn = document.getElementById('rp-name'); if(rn) rn.textContent = p.name;
  var rj = document.getElementById('rp-name-ja'); if(rj) rj.textContent = p.nameJa;
  var rp2 = document.getElementById('rp-proc'); if(rp2) rp2.textContent = p.proc;
  var rc = document.getElementById('rp-ch'); if(rc) rc.textContent = p.ch;
  var rpEl = document.getElementById('rp-el');
  if(rpEl){
    var elL = {new: p.elapsed || '-', consulting:'응대 중', booked:'예약 완료', closed:'종료'};
    var elC = {new: p.elapsed ? 'var(--red)' : 'var(--gray-400)', consulting:'var(--green)', booked:'var(--blue)', closed:'var(--gray-400)'};
    rpEl.textContent = elL[p.status] || '-';
    rpEl.style.color = elC[p.status] || 'var(--gray-400)';
  }
  var hm = {new:'첫 방문', consulting:'상담 이력 있음', booked:'예약 완료', closed:'시술 완료'};
  var rv = document.getElementById('rp-visit'); if(rv) rv.textContent = hm[p.status] || '첫 방문';
  var sc = {new:{bg:'#FEF2F2',tc:'#991B1B',label:'신규'}, consulting:{bg:'#F3F4F6',tc:'#374151',label:'상담중'}, booked:{bg:'#D1FAE5',tc:'#065F46',label:'예약완료'}, closed:{bg:'#F3F4F6',tc:'#6B7280',label:'종료'}};
  var s = sc[p.status] || sc.new;
  var rb = document.getElementById('rp-status-badge');
  if(rb) rb.innerHTML = '<span class="pc-badge" style="background:'+s.bg+';color:'+s.tc+'">'+s.label+'</span>';
  var hw = document.getElementById('rp-history-wrap'); if(hw) hw.innerHTML = '';

  // 답변 재생성 버튼 — 종료 시 숨김
  var regenBtn = document.getElementById('regen-btn');
  if (regenBtn) regenBtn.style.display = p.status === 'closed' ? 'none' : '';

  // 종료 상태면 코칭 대신 종료 메시지
  if (p.status === 'closed') {
    var aiEl = document.getElementById('ai-suggests');
    var manEl = document.getElementById('manual-content');
    var closedHtml = '<div style="text-align:center;padding:24px 16px;color:var(--gray-400)">'
      + '<div style="font-size:24px;margin-bottom:8px">✓</div>'
      + '<div style="font-size:13px;font-weight:600;color:var(--gray-500)">상담 종료</div>'
      + '<div style="font-size:12px;margin-top:4px;line-height:1.6">이 상담은 종료되었습니다.</div>'
      + '</div>';
    if (aiEl) aiEl.innerHTML = closedHtml;
    if (manEl) manEl.innerHTML = closedHtml;
  } else {
    renderAISuggests(p);
    renderManual(p);
    if(currentLang !== 'ja') setTimeout(function(){ regenSuggests(); renderManualWithLang(p); }, 50);
  }
}

function renderAISuggests(p) {
  var el = document.getElementById('ai-suggests');
  if (!el) return;
  var lastMsg = null;
  for (var i = p.msgs.length - 1; i >= 0; i--) {
    if (p.msgs[i].from === 'patient') { lastMsg = p.msgs[i]; break; }
  }
  var suggests = COACHING_DATA[p.proc] || COACHING_DATA['default'];
    var html = '';
  if (lastMsg) {
    html += '<div style="background:var(--gray-50);border-radius:8px;padding:8px 10px;margin-bottom:10px">'
      + '<div style="font-size:10px;font-weight:600;color:var(--gray-400);margin-bottom:4px">환자 마지막 질문</div>'
      + '<div style="font-size:12px;color:var(--navy);line-height:1.6">' + lastMsg.ja + '</div>'
      + '<div style="font-size:10px;color:var(--gray-500);margin-top:2px">' + lastMsg.ko + '</div>'
      + '</div>';
  }
  html += '<div style="font-size:10px;font-weight:600;color:var(--gray-400);margin-bottom:6px">추천 답변 ' + suggests.length + '개</div>';
  suggests.forEach(function(s, i) {
    html += '<div class="ai-suggest-item" id="sug-'+i+'" onclick="selectSuggest('+i+',this)">'
      + '<div class="ai-suggest-tone" style="background:'+s.toneBg+';color:'+s.toneTc+'">'+s.tone+'</div>'
      + '<div class="ai-suggest-text">'+s.ko+'</div>'
      + '<div class="ai-suggest-ja">'+getLang().abbr+' '+(s.jaLang||s.ja)+'</div>'
      + '</div>';
  });
  el.innerHTML = html;
  el._suggests = suggests;
}

function selectSuggest(idx, el) {
  document.querySelectorAll('.ai-suggest-item').forEach(function(e){ e.classList.remove('selected'); });
  el.classList.add('selected');
  var container = document.getElementById('ai-suggests');
  var s = container._suggests && container._suggests[idx];
  if (!s) return;
  var jaEl = document.getElementById('draft-text-ja');
  var koEl = document.getElementById('draft-text-ko');
  if (jaEl) jaEl.value = s.jaLang || s.ja;
  if (koEl) koEl.value = s.ko;
  var draft = document.getElementById('ai-draft');
  if (draft && draft.style.display === 'none') draft.style.display = '';
  showToastInbox('✓ 답변이 발송폼에 적용되었습니다.', 'success');
}

function regenSuggests() {
  var el = document.getElementById('ai-suggests');
  if (!el) return;
  var p = patients[curId];
  if (!p) return;

  // 로딩 상태
  el.style.opacity = '0.4';
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--gray-400);font-size:12px">🤖 Gemini가 답변을 생성 중...</div>';
  showToastInbox('🤖 AI가 추천 답변을 생성 중입니다...');

  // 환자 마지막 메시지 추출
  var lastMsg = null;
  for (var i = p.msgs.length - 1; i >= 0; i--) {
    if (p.msgs[i].from === 'patient') { lastMsg = p.msgs[i]; break; }
  }
  var patientMsgOrig = lastMsg ? lastMsg.ja : '';
  var patientMsgKo   = lastMsg ? lastMsg.ko : '';

  geminiGenerateCoaching(patientMsgOrig, patientMsgKo, p.proc, currentLang, function(suggests) {
    el.style.opacity = '1';
    if (!suggests) {
      // Gemini 실패 시 하드코딩 fallback (JP로 표시)
      renderAISuggests(p);
      showToastInbox('⚠ AI 생성 실패 — 기본 답변을 표시합니다.', 'error');
      return;
    }
    // Gemini 결과 렌더링
    var html = '';
    if (lastMsg) {
      html += '<div style="background:var(--gray-50);border-radius:8px;padding:8px 10px;margin-bottom:10px">'
        + '<div style="font-size:10px;font-weight:600;color:var(--gray-400);margin-bottom:4px">환자 마지막 질문</div>'
        + '<div style="font-size:12px;color:var(--navy);line-height:1.6">' + patientMsgOrig + '</div>'
        + '<div style="font-size:10px;color:var(--gray-500);margin-top:2px">' + patientMsgKo + '</div>'
        + '</div>';
    }
    html += '<div style="font-size:10px;font-weight:600;color:var(--gray-400);margin-bottom:6px">🤖 Gemini 추천 답변 ' + suggests.length + '개</div>';
    suggests.forEach(function(s, i) {
      html += '<div class="ai-suggest-item" id="sug-' + i + '" onclick="selectSuggest(' + i + ',this)">'
        + '<div class="ai-suggest-tone" style="background:' + s.toneBg + ';color:' + s.toneTc + '">' + s.tone + '</div>'
        + '<div class="ai-suggest-text">' + s.ko + '</div>'
        + '<div class="ai-suggest-ja">' + getLang().abbr + ' ' + s.ja + '</div>'
        + '</div>';
    });
    el.innerHTML = html;
    el._suggests = suggests;
    showToastInbox('✓ Gemini가 추천 답변을 생성했습니다.', 'success');
  });
}

function renderManual(p) {
  var el = document.getElementById('manual-content');
  if (!el) return;
  var key = null;
  var keys = Object.keys(MANUAL_DATA).filter(function(k){ return k !== 'default'; });
  for (var i = 0; i < keys.length; i++) {
    if (p.proc && p.proc.includes(keys[i])) { key = keys[i]; break; }
  }
  var points = key ? MANUAL_DATA[key] : MANUAL_DATA['default'];
  el.innerHTML = '<div style="font-size:12px;font-weight:600;color:var(--gray-400);margin-bottom:8px">' + (p.proc || '기본') + ' 핵심 정보</div>'
    + points.map(function(m){
      return '<div class="manual-item"><div class="manual-item-title">'+m.title
        +' <span class="manual-badge" style="background:'+m.bg+';color:'+m.tc+'">'+m.badge+'</span></div>'
        +'<div class="manual-item-body">'+m.body+'</div></div>';
    }).join('');
}

function openBookingModal(p) {
  var av = document.getElementById('bm-avatar');
  var nm = document.getElementById('bm-name');
  var mt = document.getElementById('bm-meta');
  var pi = document.getElementById('bm-patient-info');
  var cb = document.getElementById('bm-ch-badge');
  if(av){ av.textContent = p.init; av.style.background = p.bg; av.style.color = p.tc; }
  if(nm) nm.textContent = p.name + (p.nameJa ? ' (' + p.nameJa + ')' : '');
  if(mt) mt.textContent = p.ch + ' · ' + (p.proc || '시술 미정') + ' · ' + (p.statusLabel || '');
  if(pi) pi.textContent = p.name + '님의 예약을 등록합니다';
  if(cb){
    cb.textContent = p.ch === 'Instagram' ? '📸 Instagram' : '💬 LINE';
    cb.style.background = p.ch === 'Instagram' ? '#FDF2F8' : '#EFF6FF';
    cb.style.color = p.ch === 'Instagram' ? '#BE185D' : '#2563EB';
  }
  var procEl = document.getElementById('bm-proc');
  if(procEl && p.proc) {
    for(var i=0; i<procEl.options.length; i++){
      if(procEl.options[i].text.indexOf(p.proc.replace(/\s*\(.*\)/,'')) !== -1) {
        procEl.selectedIndex = i; break;
      }
    }
  }
  var d = new Date(); d.setDate(d.getDate()+3);
  var dateEl = document.getElementById('bm-date');
  if(dateEl) dateEl.value = d.toISOString().slice(0,10);
  bmUpdateSlots();
  // 우측 패널 메모 가져오기
  var memoEl = document.getElementById('bm-memo');
  var rpMemo = document.getElementById('rp-memo-input');
  if(memoEl && rpMemo) memoEl.value = rpMemo.value || '';
  // memoStore에서도 확인
  if(memoEl && (!memoEl.value) && typeof memoStore !== 'undefined' && memoStore[p.id]) {
    memoEl.value = memoStore[p.id];
  }
  var modal = document.getElementById('booking-modal');
  if(modal){ modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}

function closeBookingModal() {
  var modal = document.getElementById('booking-modal');
  if(modal){ modal.style.display = 'none'; document.body.style.overflow = ''; }
}

function bmUpdateSlots() {
  var slots = ['09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00'];
  var off = [2, 5, 8];
  var el = document.getElementById('bm-slots');
  if(!el) return;
  el.innerHTML = slots.map(function(t, i) {
    var isOff = off.indexOf(i) !== -1;
    var style = 'padding:7px 4px;text-align:center;border:1px solid var(--gray-200);border-radius:var(--r);font-size:12px;transition:all .15s;';
    style += isOff
      ? 'cursor:not-allowed;color:var(--gray-300);background:var(--gray-100)'
      : 'cursor:pointer;color:var(--gray-600);background:#fff';
    var click = isOff ? '' : ' onclick="bmSelectSlot(this)"';
    return '<div data-time="' + t + '"' + click + ' style="' + style + '">' + t + '</div>';
  }).join('');
}

function bmSelectSlot(el) {
  var time = el.getAttribute('data-time');
  document.querySelectorAll('#bm-slots div').forEach(function(s){
    // 비활성 슬롯은 건드리지 않음
    if(s.style.cursor === 'not-allowed') return;
    s.style.background = '#fff';
    s.style.borderColor = 'var(--gray-200)';
    s.style.color = 'var(--gray-600)';
    s.style.fontWeight = '';
  });
  el.style.background = 'var(--navy)';
  el.style.borderColor = 'var(--navy)';
  el.style.color = '#fff';
  el.style.fontWeight = '500';
  var t = document.getElementById('bm-selected-time');
  if(t) t.value = time;
}

function submitBookingModal() {
  var time = document.getElementById('bm-selected-time') ? document.getElementById('bm-selected-time').value : '';
  var date = document.getElementById('bm-date') ? document.getElementById('bm-date').value : '';
  if(!time){ showToastInbox('예약 시간을 선택해주세요.', 'error'); return; }
  if(!date){ showToastInbox('예약 날짜를 선택해주세요.', 'error'); return; }
  var p = patients[curId];
  if(p) {
    p.status = 'booked';
    p.statusLabel = '예약완료';
    applyStatusBtn(p);
    renderList(curFilter, '');
    updateFilterCounts();
    updateKPICards();
    if(typeof updateRightPanel === 'function') updateRightPanel(p);
  }
  closeBookingModal();
  showToastInbox('✓ 예약이 등록되었습니다. ' + date + ' ' + time, 'success');
}

function copyText(text) {
  if(navigator.clipboard){
    navigator.clipboard.writeText(text).then(function(){ showToastInbox('✓ 복사되었습니다.', 'success'); });
  } else {
    var ta = document.createElement('textarea'); ta.value=text;
    document.body.appendChild(ta); ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
    showToastInbox('✓ 복사되었습니다.', 'success');
  }
}

updateKPICards();
updateFilterCounts();
renderList('all', '');
selectPatient(0);
