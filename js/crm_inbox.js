
// ── 환자 데이터 ──────────────────────────────────────────────────
const patients = [
  {id:0, name:'야마다 사오리', nameJa:'山田 沙織', init:'야마', bg:'#EEEDFE', tc:'#3C3489',
   proc:'쌍꺼풀', ch:'LINE', chColor:'#2563EB', status:'new', statusLabel:'신규', elapsed:'2시간', unread:true,
   msgs:[
     {from:'patient', ja:'はじめまして！二重整形について聞きたいのですが、カウンセリングは無料ですか？', ko:'안녕하세요! 쌍꺼풀 성형에 대해 궁금한데요, 상담은 무료인가요?', time:'10:23'},
     {from:'ai',      ja:'はじめまして！カウンセリングは無料です。埋没法は₩400,000〜が目安です。', ko:'안녕하세요! 상담은 무료입니다. 매몰법은 ₩400,000~이 기준입니다.', time:'10:23 (AI はな)'},
   ],
   draft:{ja:'はじめまして、オーレ整形外科です。\nカウンセリングは無料で承っております。\nご来院のご希望日時をお聞かせください。', ko:'안녕하세요, 올래성형외과입니다.\n상담은 무료로 진행하고 있습니다.\n방문 희망 일시를 알려주세요.'}},

  {id:1, name:'스즈키 미카', nameJa:'鈴木 美花', init:'스즈', bg:'#E1F5EE', tc:'#085041',
   proc:'코 성형', ch:'LINE', chColor:'#2563EB', status:'new', statusLabel:'신규', elapsed:'1시간', unread:true,
   msgs:[
     {from:'patient', ja:'鼻のプチ整形を考えています。ダウンタイムはどのくらいですか？', ko:'코 프티 성형을 고려 중입니다. 다운타임은 어느 정도인가요?', time:'11:14'},
   ],
   draft:{ja:'こんにちは、オーレ整形外科です。\nヒアルロン酸注入のダウンタイムは1〜3日程度です。', ko:'안녕하세요, 올래성형외과입니다.\n히알루론산 주입의 다운타임은 1~3일 정도입니다.'}},

  {id:2, name:'다나카 유키', nameJa:'田中 雪', init:'다나', bg:'#FAEEDA', tc:'#412402',
   proc:'첫 방문', ch:'LINE', chColor:'#2563EB', status:'new', statusLabel:'신규', elapsed:'40분', unread:true,
   msgs:[
     {from:'patient', ja:'韓国の病院は初めてで不安です。日本語対応はしていますか？', ko:'한국 병원은 처음이라 걱정됩니다. 일본어 대응이 되나요?', time:'11:37'},
   ],
   draft:{ja:'はじめまして。当院には日本語対応スタッフが常駐しております。', ko:'안녕하세요. 저희 병원에는 일본어 대응 스탭이 상주하고 있습니다.'}},

  {id:3, name:'사토 하루카', nameJa:'佐藤 春花', init:'사토', bg:'#E6F1FB', tc:'#0C447C',
   proc:'윤곽', ch:'LINE', chColor:'#2563EB', status:'consulting', statusLabel:'상담중', elapsed:'', unread:false,
   msgs:[
     {from:'patient', ja:'輪郭整形に興味があります。', ko:'윤곽 성형에 관심이 있습니다.', time:'5/18'},
     {from:'staff',   ja:'当院では顎骨切り・頬骨縮小・エラボトックスなどをご提供しております。', ko:'저희 병원에서는 턱뼈절제·광대축소·에라보톡스 등을 제공하고 있습니다.', time:'5/18'},
   ],
   draft:{ja:'', ko:''}},

  {id:4, name:'이토 나나미', nameJa:'伊藤 七海', init:'이토', bg:'#FBEAF0', tc:'#4B1528',
   proc:'쌍꺼풀', ch:'LINE', chColor:'#2563EB', status:'booked', statusLabel:'예약완료', elapsed:'', unread:false,
   msgs:[
     {from:'patient', ja:'二重整形を予約したいです。', ko:'쌍꺼풀 성형을 예약하고 싶습니다.', time:'5/17'},
     {from:'staff',   ja:'6月5日14:00はいかがでしょうか？', ko:'6월 5일 14:00은 어떠신가요?', time:'5/17'},
     {from:'ai',      ja:'【予約確認】6月5日(金) 14:00 二重整形カウンセリング。', ko:'[예약 확인] 6월 5일(금) 14:00 쌍꺼풀 성형 상담.', time:'5/17 (AI はな)'},
   ],
   draft:{ja:'', ko:''}},

  {id:5, name:'나카무라 리나', nameJa:'中村 里奈', init:'나카', bg:'#EEEDFE', tc:'#3C3489',
   proc:'코 성형', ch:'LINE', chColor:'#2563EB', status:'closed', statusLabel:'종료', elapsed:'', unread:false,
   msgs:[
     {from:'patient', ja:'鼻整形で内院しました。ありがとうございました！', ko:'코 성형으로 내원했습니다. 감사했습니다!', time:'5/10'},
   ],
   draft:{ja:'', ko:''}},
  // ── Instagram 유입 환자 ──
  {id:6, name:'하야시 유이', nameJa:'林 結衣', init:'하야', bg:'#FCE7F3', tc:'#9D174D',
   proc:'쌍꺼풀', ch:'Instagram', chColor:'#E1306C', status:'new', statusLabel:'신규', elapsed:'30분', unread:true,
   msgs:[
     {from:'patient', ja:'インスタのビフォーアフターを見て気になりました！二重整形の料金を教えてください😊', ko:'인스타 B/A 보고 궁금해졌어요! 쌍꺼풀 가격 알려주세요😊', time:'오늘 14:52'},
     {from:'ai',      ja:'ご連絡ありがとうございます🌸 埋没法は₩400,000〜、切開法は₩800,000〜となります。無料カウンセリングもございます！', ko:'연락 주셔서 감사합니다🌸 매몰법 ₩400,000~, 절개법 ₩800,000~ 입니다. 무료 상담도 있어요!', time:'오늘 14:52'},
   ]},
  {id:7, name:'오가와 사키', nameJa:'小川 咲', init:'오가', bg:'#FDF4FF', tc:'#7E22CE',
   proc:'코 필러', ch:'Instagram', chColor:'#E1306C', status:'consulting', statusLabel:'상담중', elapsed:null, unread:false,
   msgs:[
     {from:'patient', ja:'鼻のフィラーに興味があります。ダウンタイムはどのくらいですか？', ko:'코 필러에 관심 있어요. 다운타임이 얼마나 돼요?', time:'어제 20:11'},
     {from:'ai',      ja:'鼻フィラーのダウンタイムは1〜3日程度です。お仕事されながらでも施術可能ですよ！', ko:'코 필러 다운타임은 1~3일 정도예요. 출근하면서 시술 가능해요!', time:'어제 20:12'},
   ]},
  {id:8, name:'마츠이 노노카', nameJa:'松井 乃々花', init:'마츠', bg:'#FFF7ED', tc:'#C2410C',
   proc:'윤곽', ch:'Instagram', chColor:'#E1306C', status:'booked', statusLabel:'예약완료', elapsed:null, unread:false,
   msgs:[
     {from:'patient', ja:'輪郭整形について詳しく教えてもらえますか？', ko:'윤곽 성형에 대해 자세히 알려주세요.', time:'5/20 19:44'},
     {from:'ai',      ja:'輪郭整形には小顔手術、エラ削り、顎形成などがあります。', ko:'윤곽 성형에는 소안면, 광대축소, 턱 성형 등이 있어요.', time:'5/20 19:45'},
     {from:'patient', ja:'カウンセリング予約したいです！', ko:'상담 예약하고 싶어요!', time:'5/20 20:01'},
     {from:'ai',      ja:'6月3日(火)14:00はいかがでしょうか？', ko:'6월 3일(화) 14:00 어떠세요?', time:'5/20 20:02'},
   ]},

];

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

  // ── 상태 버튼 초기화 ──
  applyStatusBtn(p);

  // ── 메시지 렌더링 ──
  renderMessages(p);
  if(typeof updateRightPanel === 'function') updateRightPanel(p);
  p.unread = false;
  renderList(curFilter, document.querySelector('.inbox-search') ? document.querySelector('.inbox-search').value : '');

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
    sendBtn.textContent = p.ch === 'Instagram' ? '📤 Instagram으로 발송' : '📤 LINE으로 발송';
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
      avatarHtml = '<div style="width:34px;height:34px;border-radius:50%;background:var(--navy-l);font-size:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0">🌸</div>';
    } else if (isPatient) {
      avatarHtml = '<div style="width:28px;height:28px;border-radius:50%;background:' + p.bg + ';color:' + p.tc + ';font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">' + p.init[0] + '</div>';
    } else {
      var chIcon = p.ch === 'Instagram' ? '📸' : '💬';
      var chBg   = p.ch === 'Instagram' ? '#FDF2F8' : '#EFF6FF';
      var chTc   = p.ch === 'Instagram' ? '#BE185D' : '#2563EB';
      avatarHtml = '<div style="width:28px;height:28px;border-radius:50%;background:' + chBg + ';color:' + chTc + ';font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0">' + chIcon + '</div>';
    }

    // 발신자 레이블
    var senderLabel = '';
    if (isAI) {
      senderLabel = '<div style="font-size:11px;font-weight:600;color:var(--navy);margin-bottom:3px;display:flex;align-items:center;gap:4px">AI はな <span style="font-size:9px;background:#EEF2FF;color:var(--navy);padding:1px 5px;border-radius:4px;font-weight:400">자동응답</span></div>';
    } else if (isStaff) {
      var chName = p.ch === 'Instagram' ? 'Instagram' : 'LINE';
      senderLabel = '<div style="font-size:11px;font-weight:600;color:var(--gray-500);margin-bottom:3px;display:flex;align-items:center;gap:4px">' + chName + ' <span style="font-size:9px;background:#D1FAE5;color:#065F46;padding:1px 5px;border-radius:4px;font-weight:400">발송</span></div>';
    }

    // 말풍선
    var bubbleContent = '';
    var bubbleBg, bubbleTc;
    if (isPatient) {
      bubbleBg = '#F3F4F6'; bubbleTc = '#111827';
      bubbleContent += '<div style="font-size:13px;line-height:1.7">' + m.ja + '</div>';
      if (m.ko) bubbleContent += '<div style="margin-top:5px;padding:5px 8px;background:rgba(0,0,0,.05);border-radius:6px;font-size:11px;color:#374151;line-height:1.6">KR ' + m.ko + '</div>';
    } else {
      bubbleBg = isAI ? '#0D1B3E' : (p.ch === 'Instagram' ? '#E1306C' : '#06C755');
      bubbleTc = '#fff';
      if (m.ko) bubbleContent += '<div style="font-size:13px;line-height:1.7">' + m.ko + '</div>';
      if (m.ja) bubbleContent += '<div style="margin-top:5px;padding:5px 8px;background:rgba(255,255,255,.2);border-radius:6px;font-size:11px;line-height:1.6">JP ' + m.ja + '</div>';
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


function toggleTranslation() {
  showKo = !showKo;
  const btn = document.getElementById('translate-toggle');
  if (btn) {
    btn.textContent = showKo ? '🇰🇷 번역 ON' : '🇯🇵 번역 OFF';
    btn.style.background = showKo ? 'var(--blue-l)' : '#F3F4F6';
    btn.style.borderColor = showKo ? 'var(--blue)' : '#E5E7EB';
    btn.style.color = showKo ? 'var(--blue)' : '#6B7280';
  }
  renderMessages(patients[curId]);
}

// ── AI 초안 한→일 번역 입력 ──────────────────────────────────────


// ── 발송 ─────────────────────────────────────────────────────────
function sendMsg() {
  var koTxt = document.getElementById('draft-text-ko').value;
  var jaTxt = document.getElementById('draft-text-ja').value;
  if (!jaTxt.trim()) { showToastInbox('일본어 발송 내용을 입력해주세요.', 'error'); return; }

  var p = patients[curId];
  p.msgs.push({ from:'staff', ja: jaTxt, ko: koTxt || jaTxt, time:'지금' });
  p.unread = false;

  renderMessages(p);

  // 입력창 초기화 (폼은 유지)
  var koEl = document.getElementById('draft-text-ko');
  var jaEl = document.getElementById('draft-text-ja');
  if (koEl) koEl.value = '';
  if (jaEl) jaEl.value = '';

  // AI 코칭 추천 답변 선택 해제
  document.querySelectorAll('.ai-suggest-item').forEach(function(e){ e.classList.remove('selected'); });

  showToastInbox('✓ LINE으로 발송되었습니다.', 'success');
  renderList(curFilter, '');
}

function setFilter(f, btn) {
  curFilter = f;
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('on'));
  btn.classList.add('on');
  renderList(f, document.querySelector('.inbox-search') ? document.querySelector('.inbox-search').value : '');
}
function filterList(v) { renderList(curFilter, v); }


/* ══════════════════════════════════════════════════════
   번역 함수 — 현재: MyMemory API (무료)
   추후 Claude API로 교체 시 translateKoToJa 함수만 수정
══════════════════════════════════════════════════════ */
function translateKoToJa(text, callback) {
  if (!text || !text.trim()) { callback(''); return; }
  var url = 'https://api.mymemory.translated.net/get?q='
    + encodeURIComponent(text)
    + '&langpair=ko|ja';
  fetch(url)
    .then(function(r){ return r.json(); })
    .then(function(d){
      var result = d.responseData && d.responseData.translatedText
        ? d.responseData.translatedText
        : '';
      callback(result);
    })
    .catch(function(){ callback(''); });
}

/* 번역 디바운스 타이머 */
var _translateTimer = null;
function onKoInput() {
  var koEl = document.getElementById('draft-text-ko');
  var jaEl = document.getElementById('draft-text-ja');
  if (!koEl || !jaEl) return;
  jaEl.value = '번역 중...';
  jaEl.style.color = 'var(--gray-400)';
  clearTimeout(_translateTimer);
  _translateTimer = setTimeout(function() {
    translateKoToJa(koEl.value, function(result) {
      jaEl.value = result;
      jaEl.style.color = '';
    });
  }, 600); // 600ms 디바운스
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

renderList('all', '');
selectPatient(0);


/* ══════════════════════════════════════════════════════
   우측 패널 통합 기능 (patients 데이터 로드 후 실행)
══════════════════════════════════════════════════════ */

/* ── 토스트 ── */
function showToastInbox(msg, type) {
  var e = document.getElementById('inbox-toast'); if(e) e.remove();
  var bg = type==='success' ? '#059669' : type==='error' ? '#DC2626' : '#0D1B3E';
  var t = document.createElement('div'); t.id='inbox-toast';
  t.style.cssText='position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:'+bg+';color:#fff;padding:11px 20px;border-radius:10px;font-size:13px;font-weight:500;box-shadow:0 4px 20px rgba(0,0,0,.2);z-index:2000;white-space:nowrap';
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
  var params = new URLSearchParams({
    name:   p.name,
    nameJa: p.nameJa || '',
    proc:   p.proc   || '',
    ch:     p.ch     || 'LINE',
    id:     p.id
  });
  location.href = 'hospital_crm_booking_new.html?' + params.toString();
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

/* ── 답변 재생성 ── */
function regenSuggests() {
  var el = document.getElementById('ai-suggests');
  if(!el) return;
  el.style.opacity = '0.4';
  el.style.transition = 'opacity .3s';
  showToastInbox('🤖 AI 추천 답변 재생성 중...');
  setTimeout(function(){
    el.style.opacity = '1';
    if(typeof renderAISuggests === 'function') renderAISuggests(patients[curId]);
    showToastInbox('✓ AI 추천 답변이 재생성되었습니다.', 'success');
  }, 1200);
}

/* ── 번역 복사 ── */
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
