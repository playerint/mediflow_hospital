
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
   proc:'윤곽', ch:'상담폼', chColor:'#2563EB', status:'consulting', statusLabel:'상담중', elapsed:'', unread:false,
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
          <span class="tag" style="display:inline-flex;align-items:center;justify-content:center;background:var(--gray-100);color:var(--gray-500)">${p.ch}</span>
        </div>
      </div>
    </div>`).join('');
}

// ── 환자 선택 ────────────────────────────────────────────────────
function selectPatient(id) {
  curId = id;
  const p = patients[id];
  document.getElementById('d-avatar').style.background = p.bg;
  document.getElementById('d-avatar').style.color = p.tc;
  document.getElementById('d-avatar').textContent = p.init;
  document.getElementById('d-name').textContent = p.name + ' (' + p.nameJa + ')';
  document.getElementById('d-meta').textContent = p.ch + ' · ' + p.msgs[0].time + (p.elapsed ? ' · ' + p.elapsed + ' 경과' : '');
  document.getElementById('pb-proc').textContent = p.proc;
  document.getElementById('pb-ch').textContent = p.ch;
  document.getElementById('pb-el').textContent = p.elapsed || '—';
  document.getElementById('pb-el').style.color = p.elapsed ? 'var(--red)' : 'var(--gray-700)';

  renderMessages(p);
  p.unread = false;
  renderList(curFilter, document.querySelector('.inbox-search') ? document.querySelector('.inbox-search').value : '');

  // AI 초안
  const da = document.getElementById('ai-draft');
  if (p.draft && p.draft.ja) {
    document.getElementById('draft-text-ko').value = p.draft.ko;
    document.getElementById('draft-text-ja').value = p.draft.ja;
    da.style.display = 'block';
  } else {
    da.style.display = 'none';
  }
}

// ── 메시지 렌더링 (한국어 병기) ──────────────────────────────────
function renderMessages(p) {
  const ma = document.getElementById('msg-area');
  ma.innerHTML = p.msgs.map(m => {
    const isPatient = m.from === 'patient';
    const isAI = m.from === 'ai';
    const bubbleClass = isPatient ? 'msg-in' : (isAI ? 'msg-out ai' : 'msg-out');

    // 아바타 HTML
    let avatarHtml;
    if (isAI) {
      avatarHtml = '<div class="msg-av-hana" title="AI はな">'
        + '<div class="hana-badge-av">🌸</div>'
        + '</div>';
    } else if (isPatient) {
      avatarHtml = '<div class="msg-av-sm" style="background:' + p.bg + ';color:' + p.tc + '">' + p.init[0] + '</div>';
    } else {
      avatarHtml = '<div class="msg-av-sm" style="background:#E1F5EE;color:#085041">나</div>';
    }

    // 말풍선 내용 — 환자는 일본어+한국어, 스탭/AI는 한국어+일본어
    let bubbleContent = '';
    if (isPatient) {
      bubbleContent = `<div class="msg-ja">${m.ja}</div>`
        + (showKo ? `<div class="msg-ko-badge">🇰🇷 ${m.ko}</div>` : '');
    } else {
      bubbleContent = `<div class="msg-ko-send">${m.ko}</div>`
        + `<div class="msg-ja-send">🇯🇵 ${m.ja}</div>`;
    }

    return '<div class="msg-row' + (!isPatient ? ' out' : '') + '">'
      + avatarHtml
      + '<div>'
      + (isAI ? '<div class="hana-name">AI はな</div>' : '')
      + '<div class="msg-bubble ' + bubbleClass + '">' + bubbleContent + '</div>'
      + '<div class="msg-time">' + m.time + '</div>'
      + '</div>'
      + '</div>';
  }).join('');
  ma.scrollTop = ma.scrollHeight;
}

// ── 번역 토글 ────────────────────────────────────────────────────
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
function onKoInput() {
  const koVal = document.getElementById('draft-text-ko').value;
  const jaEl  = document.getElementById('draft-text-ja');
  // 시뮬레이션: 한국어 → 일본어 (실제는 AI Agent API 호출)
  jaEl.style.background = '#FFF9C4';
  clearTimeout(window._translateTimer);
  window._translateTimer = setTimeout(function() {
    // 간단 더미 번역 시뮬레이션
    const jaMap = {
      '안녕하세요': 'こんにちは', '올래성형외과': 'オーレ整形外科',
      '감사합니다': 'ありがとうございます', '예약': 'ご予約',
      '상담': 'カウンセリング', '무료': '無料', '다운타임': 'ダウンタイム',
    };
    let translated = koVal;
    Object.keys(jaMap).forEach(function(k) {
      translated = translated.replace(new RegExp(k, 'g'), jaMap[k]);
    });
    jaEl.value = translated;
    jaEl.style.background = '#F0FDF4';
    setTimeout(function(){ jaEl.style.background = ''; }, 1000);
  }, 800);
}

// ── 발송 ─────────────────────────────────────────────────────────
function sendMsg() {
  const koTxt = document.getElementById('draft-text-ko').value;
  const jaTxt = document.getElementById('draft-text-ja').value;
  if (!jaTxt.trim()) return;

  const p = patients[curId];
  p.msgs.push({ from:'staff', ja: jaTxt, ko: koTxt || jaTxt, time:'지금' });
  p.unread = false;
  p.draft = { ja:'', ko:'' };

  renderMessages(p);
  document.getElementById('ai-draft').style.display = 'none';

  // 성공 토스트
  if (typeof showToast === 'function') showToast('✓ LINE으로 발송되었습니다.', 'success');
}

function setFilter(f, btn) {
  curFilter = f;
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('on'));
  btn.classList.add('on');
  renderList(f, document.querySelector('.inbox-search') ? document.querySelector('.inbox-search').value : '');
}
function filterList(v) { renderList(curFilter, v); }

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

renderList();
selectPatient(0);
