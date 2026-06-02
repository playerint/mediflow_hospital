
function testLineSend() {
  var previewMsg = welcomeMsg.replace(/\n/g, '<br>');
  var btnPreview = quickBtns.map(function(b) {
    return '<span style="display:inline-block;background:#fff;border:1px solid #E5E7EB;border-radius:6px;padding:2px 8px;font-size:12px;margin:2px">' + b + '</span>';
  }).join('');

  var body = '<div style="margin-bottom:14px">'
    + '<label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">수신 담당자</label>'
    + '<select id="test-staff" style="width:100%;padding:9px 12px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:13px;font-family:inherit;outline:none">'
    + '<option>김지현 (관리자)</option>'
    + '<option>이수진 (스탭)</option>'
    + '</select>'
    + '</div>'
    + '<div style="margin-bottom:6px">'
    + '<label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">발송 내용 미리보기</label>'
    + '<div style="background:#F0FDFA;border:1px solid #5EEAD4;border-radius:10px;padding:12px 14px;font-size:12px;color:#374151;line-height:1.7">'
    + previewMsg + '<br><br>' + btnPreview
    + '</div>'
    + '</div>'
    + '<div style="margin-top:12px;padding:10px 12px;background:#FEF3C7;border:1px solid #FCD34D;border-radius:8px;font-size:12px;color:#92400E;line-height:1.6">'
    + '⚠ 실제 LINE 발송은 설정 → LINE 연동에서 Channel ID / Secret 연결 후 가능합니다.'
    + '</div>';

  openModal('📤 테스트 발송 미리보기', body, function() {
    var staff = document.getElementById('test-staff');
    var name  = staff ? staff.value : '담당자';
    showToast('✓ ' + name + '에게 테스트 발송 요청이 전달되었습니다.', 'success');
  }, '발송 요청', 'btn-primary');
}

// ── 데이터 ──────────────────────────────────────────────────────
var welcomeMsg   = 'はじめまして！オーレ整形外科です。\nご相談内容をお選びください。';
var welcomeMsgKo = '안녕하세요! 올래성형외과입니다.\n상담 내용을 선택해 주세요.';
var quickBtns    = ['二重・目元', '鼻', '料金確認'];
var quickBtnsKo  = ['쌍꺼풀·눈 성형', '코 성형', '가격 확인'];

var scenarios = [
  {name:'料金・費用',   nameKo:'가격·비용',
   kw:'料金,価格,いくら,費用',
   msg:'ご相談の施術料金をご案内いたします。二重埋没法₩400,000〜、鼻プロテーゼ₩900,000〜です。詳細はカウンセリングでご確認ください。',
   msgKo:'시술 요금을 안내해 드립니다. 쌍꺼풀 매몰법 ₩400,000~, 코 보형물 ₩900,000~입니다. 자세한 사항은 상담에서 확인해 주세요.'},
  {name:'ダウンタイム', nameKo:'다운타임',
   kw:'ダウンタイム,腫れ,痛み,回復',
   msg:'施術によって異なりますが、埋没法は1〜3日、切開法は1〜2週間程度です。翌日からお仕事可能なケースも多いです。',
   msgKo:'시술에 따라 다르지만, 매몰법은 1~3일, 절개법은 1~2주 정도입니다. 다음 날부터 일이 가능한 경우도 많습니다.'},
  {name:'日本語対応',   nameKo:'일본어 대응',
   kw:'日本語,通訳,言葉',
   msg:'当院には日本語専属スタッフが常駐しております。カウンセリングから術後ケアまで日本語でサポートいたします。',
   msgKo:'저희 병원에는 일본어 전담 스탭이 상주하고 있습니다. 상담부터 수술 후 케어까지 일본어로 지원합니다.'},
];

var triggers = [
  {text:'「訴訟」「弁護士」키워드 감지', color:'#DC2626'},
  {text:'3회 이상 반복 질문 미해결',       color:'#D97706'},
  {text:'수술 합병증 키워드 감지',          color:'#DC2626'},
  {text:'예약 확정 요청',                  color:'#059669'},
];

var hrs = [
  {day:'월',range:'09-18',on:true}, {day:'화',range:'09-18',on:true},
  {day:'수',range:'09-18',on:true}, {day:'목',range:'09-18',on:true},
  {day:'금',range:'09-18',on:true}, {day:'토',range:'09-13',on:true},
  {day:'일',range:'휴무',on:false},
];

// ── 언어 상태 ────────────────────────────────────────────────────
var langMode    = 'ja';
var welcomeLang = 'ja';

// ── 공통 스타일 상수 ─────────────────────────────────────────────
var INP = 'width:100%;padding:9px 12px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:13px;font-family:inherit;outline:none;box-sizing:border-box';
var TA  = INP + ';resize:vertical;line-height:1.6';
var LBL = 'font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:5px';

// ── 토글 버튼 HTML 생성 ──────────────────────────────────────────
function langToggleHtml(id) {
  return '<div style="display:flex;justify-content:flex-end;margin-bottom:12px">'
    + '<div style="display:flex;border-radius:8px;overflow:hidden;border:1px solid #E5E7EB">'
    + '<button id="' + id + '-ja" onclick="modalSwitchLang(\'' + id + '\',\'ja\')" style="padding:4px 12px;font-size:12px;font-family:inherit;cursor:pointer;border:none;background:#1A2642;color:#fff;font-weight:500;transition:all .15s">日</button>'
    + '<button id="' + id + '-ko" onclick="modalSwitchLang(\'' + id + '\',\'ko\')" style="padding:4px 12px;font-size:12px;font-family:inherit;cursor:pointer;border:none;background:#fff;color:#6B7280;transition:all .15s">한</button>'
    + '</div></div>';
}

function modalSwitchLang(id, mode) {
  var jaBtn = document.getElementById(id + '-ja');
  var koBtn = document.getElementById(id + '-ko');
  if (jaBtn) { jaBtn.style.background = mode === 'ja' ? '#1A2642' : '#fff'; jaBtn.style.color = mode === 'ja' ? '#fff' : '#6B7280'; }
  if (koBtn) { koBtn.style.background = mode === 'ko' ? '#0D9488' : '#fff'; koBtn.style.color = mode === 'ko' ? '#fff' : '#6B7280'; }
  var modal = document.getElementById('__modal');
  if (!modal) return;
  modal.querySelectorAll('.mf-ja').forEach(function(el) { el.style.display = mode === 'ja' ? '' : 'none'; });
  modal.querySelectorAll('.mf-ko').forEach(function(el) { el.style.display = mode === 'ko' ? '' : 'none'; });
}

// ── L2 언어 토글 (시나리오 목록) ────────────────────────────────
function setLang(mode) {
  langMode = mode;
  var jaBtn = document.getElementById('lang-ja');
  var koBtn = document.getElementById('lang-ko');
  if (jaBtn) { jaBtn.style.background = mode === 'ja' ? 'var(--navy)' : '#fff'; jaBtn.style.color = mode === 'ja' ? '#fff' : 'var(--gray-500)'; }
  if (koBtn) { koBtn.style.background = mode === 'ko' ? 'var(--teal)' : '#fff'; koBtn.style.color = mode === 'ko' ? '#fff' : 'var(--gray-500)'; }
  renderScenarios();
}

// ── L1 언어 토글 (웰컴 미리보기) ────────────────────────────────
function setWelcomeLang(mode) {
  welcomeLang = mode;
  var jaBtn = document.getElementById('wlang-ja');
  var koBtn = document.getElementById('wlang-ko');
  if (jaBtn) { jaBtn.style.background = mode === 'ja' ? 'var(--navy)' : '#fff'; jaBtn.style.color = mode === 'ja' ? '#fff' : 'var(--gray-500)'; }
  if (koBtn) { koBtn.style.background = mode === 'ko' ? 'var(--teal)' : '#fff'; koBtn.style.color = mode === 'ko' ? '#fff' : 'var(--gray-500)'; }
  renderWelcomePreview();
}

// ── 웰컴 미리보기 렌더링 ─────────────────────────────────────────
function renderWelcomePreview() {
  var el = document.getElementById('welcome-preview');
  if (!el) return;
  var msg  = welcomeLang === 'ko' ? welcomeMsgKo : welcomeMsg;
  var btns = welcomeLang === 'ko' ? quickBtnsKo  : quickBtns;
  var lines = msg.replace(/\n/g, '<br>');
  var btnHtml = btns.map(function(b) {
    return '<span style="display:inline-block;background:#fff;border:1px solid #E5E7EB;border-radius:6px;padding:2px 8px;font-size:12px;margin:2px">' + b + '</span>';
  }).join('');
  el.innerHTML = lines + '<br><br>' + btnHtml;
}

// ── 시나리오 렌더링 ───────────────────────────────────────────────
function renderScenarios() {
  var el = document.getElementById('sc-list');
  if (!el) return;
  var html = '';
  for (var i = 0; i < scenarios.length; i++) {
    var s = scenarios[i];
    var name = langMode === 'ko' ? (s.nameKo || s.name) : s.name;
    var msg  = langMode === 'ko' ? (s.msgKo  || s.msg)  : s.msg;
    html += '<div class="sc-item" id="sc-item-' + i + '">'
      + '<div style="flex:1">'
      + '<div class="sc-name">' + name + '</div>'
      + '<div class="sc-kw">키워드: ' + s.kw + '</div>'
      + '<div class="sc-msg">' + msg + '</div>'
      + '</div>'
      + '<div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0">'
      + '<button class="btn" style="font-size:12px;padding:3px 9px" onclick="editScenario(' + i + ')">✏</button>'
      + '<button class="btn btn-danger" style="font-size:12px;padding:3px 9px" onclick="deleteScenario(' + i + ')">✕</button>'
      + '</div>'
      + '</div>';
  }
  el.innerHTML = html;
}

// ── 트리거 렌더링 ─────────────────────────────────────────────────
function renderTriggers() {
  var el = document.getElementById('tr-list');
  if (!el) return;
  var html = '';
  for (var i = 0; i < triggers.length; i++) {
    var t = triggers[i];
    html += '<div class="tr-item" id="tr-item-' + i + '">'
      + '<div class="tr-dot" style="background:' + t.color + '"></div>'
      + '<span class="tr-text">' + t.text + '</span>'
      + '<button class="btn btn-danger" style="font-size:12px;padding:3px 9px;flex-shrink:0;margin-left:auto" onclick="deleteTrigger(' + i + ')">✕</button>'
      + '</div>';
  }
  el.innerHTML = html;
}

// ── 웰컴 메시지 편집 ─────────────────────────────────────────────
function editWelcomeMsg() {
  var jaBtnHtml = '', koBtnHtml = '';
  for (var i = 0; i < Math.max(quickBtns.length, quickBtnsKo.length); i++) {
    var delBtn = '<button onclick="this.parentElement.remove()" style="width:28px;height:28px;border-radius:6px;border:1px solid #FCA5A5;background:#FEE2E2;color:#DC2626;cursor:pointer;font-size:13px;flex-shrink:0">✕</button>';
    var row = 'display:flex;align-items:center;gap:6px;margin-bottom:6px';
    if (quickBtns[i] !== undefined)   jaBtnHtml += '<div style="' + row + '"><input type="text" value="' + quickBtns[i]   + '" id="qbtn-ja-' + i + '" style="flex:1;padding:7px 10px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:13px;font-family:inherit;outline:none">' + delBtn + '</div>';
    if (quickBtnsKo[i] !== undefined) koBtnHtml += '<div style="' + row + '"><input type="text" value="' + quickBtnsKo[i] + '" id="qbtn-ko-' + i + '" style="flex:1;padding:7px 10px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:13px;font-family:inherit;outline:none">' + delBtn + '</div>';
  }
  var body = langToggleHtml('modal-welcome')
    + '<div class="mf-ja"><div style="margin-bottom:12px">'
    + '<label style="' + LBL + '">🇯🇵 웰컴 메시지</label>'
    + '<textarea id="wm-ja" rows="3" style="' + TA + '">' + welcomeMsg + '</textarea></div>'
    + '<label style="' + LBL + '">🇯🇵 빠른 답장 버튼 <span style="font-size:10px;color:#9CA3AF;font-weight:400">(최대 5개)</span></label>'
    + '<div id="qbtn-list-ja">' + jaBtnHtml + '</div>'
    + '<button onclick="addQBtn(\'ja\')" style="width:100%;padding:7px;border-radius:8px;border:1.5px dashed #E5E7EB;background:#fff;font-size:12px;font-family:inherit;cursor:pointer;color:#6B7280;margin-top:4px">+ 버튼 추가</button>'
    + '</div>'
    + '<div class="mf-ko" style="display:none"><div style="margin-bottom:12px">'
    + '<label style="' + LBL + '">🇰🇷 웰컴 메시지 (참고용)</label>'
    + '<textarea id="wm-ko" rows="3" style="' + TA + '">' + welcomeMsgKo + '</textarea></div>'
    + '<label style="' + LBL + '">🇰🇷 빠른 답장 버튼 (참고용)</label>'
    + '<div id="qbtn-list-ko">' + koBtnHtml + '</div>'
    + '<button onclick="addQBtn(\'ko\')" style="width:100%;padding:7px;border-radius:8px;border:1.5px dashed #E5E7EB;background:#fff;font-size:12px;font-family:inherit;cursor:pointer;color:#6B7280;margin-top:4px">+ 버튼 추가</button>'
    + '</div>'
    + '<div style="margin-top:10px;padding:10px 12px;background:#F0FDFA;border-radius:8px;font-size:12px;color:#0F766E;line-height:1.7">🌸 환자에게는 🇯🇵 일본어로 발송됩니다. 🇰🇷 한국어는 상담사 참고용입니다.</div>';

  openModal('✏ 웰컴 메시지 & 버튼 편집', body, function() {
    var jaEl = document.getElementById('wm-ja');
    var koEl = document.getElementById('wm-ko');
    if (jaEl) welcomeMsg   = jaEl.value;
    if (koEl) welcomeMsgKo = koEl.value;
    var newJa = [], newKo = [];
    for (var i = 0; i < 10; i++) {
      var ja = document.getElementById('qbtn-ja-' + i);
      var ko = document.getElementById('qbtn-ko-' + i);
      if (ja && ja.value.trim()) newJa.push(ja.value.trim());
      if (ko && ko.value.trim()) newKo.push(ko.value.trim());
    }
    quickBtns   = newJa;
    quickBtnsKo = newKo;
    renderWelcomePreview();
    showToast('✓ 웰컴 메시지가 저장되었습니다.', 'success');
  }, '저장', 'btn-primary');
}

function addQBtn(lang) {
  var listId = lang === 'ko' ? 'qbtn-list-ko' : 'qbtn-list-ja';
  var list = document.getElementById(listId);
  if (!list) return;
  var cnt = list.querySelectorAll('input').length;
  if (cnt >= 5) { showToast('버튼은 최대 5개까지 추가할 수 있습니다.', 'error'); return; }
  var div = document.createElement('div');
  div.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:6px';
  div.innerHTML = '<input type="text" placeholder="버튼 텍스트" style="flex:1;padding:7px 10px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:13px;font-family:inherit;outline:none">'
    + '<button onclick="this.parentElement.remove()" style="width:28px;height:28px;border-radius:6px;border:1px solid #FCA5A5;background:#FEE2E2;color:#DC2626;cursor:pointer;font-size:13px;flex-shrink:0">✕</button>';
  list.appendChild(div);
}

// ── 시나리오 추가 ─────────────────────────────────────────────────
function addScenario() {
  var body = langToggleHtml('modal-sc-add')
    + '<div style="margin-bottom:12px"><label style="' + LBL + '">시나리오 이름</label>'
    + '<input type="text" id="sc-add-name" placeholder="예) 가격 문의" style="' + INP + '"></div>'
    + '<div class="mf-ja" style="margin-bottom:12px"><label style="' + LBL + '">🇯🇵 키워드 <span style="font-size:10px;color:#9CA3AF">(쉼표로 구분, 일본어)</span></label>'
    + '<input type="text" id="sc-add-kw-ja" placeholder="料金,価格,いくら" style="' + INP + '"></div>'
    + '<div class="mf-ko" style="display:none;margin-bottom:12px"><label style="' + LBL + '">🇰🇷 키워드 <span style="font-size:10px;color:#9CA3AF">(쉼표로 구분, 한국어)</span></label>'
    + '<input type="text" id="sc-add-kw-ko" placeholder="가격,요금,얼마" style="' + INP + '"></div>'
    + '<div class="mf-ja"><label style="' + LBL + '">🇯🇵 자동 응답 메시지 (환자 발송용)</label>'
    + '<textarea id="sc-add-ja" rows="4" placeholder="일본어로 입력" style="' + TA + '"></textarea></div>'
    + '<div class="mf-ko" style="display:none"><label style="' + LBL + '">🇰🇷 한국어 번역 (상담사 참고용)</label>'
    + '<textarea id="sc-add-ko" rows="4" placeholder="한국어 번역 입력" style="' + TA + '"></textarea></div>'
    + '<div style="margin-top:10px;padding:8px 12px;background:#F0FDFA;border-radius:8px;font-size:12px;color:#0F766E">🌸 환자에게는 🇯🇵 일본어로 발송됩니다.</div>';

  openModal('➕ L2 시나리오 추가', body, function() {
    var name = document.getElementById('sc-add-name');
    var kwJaEl = document.getElementById('sc-add-kw-ja');
    var kwKoEl = document.getElementById('sc-add-kw-ko');
    var jaEl   = document.getElementById('sc-add-ja');
    var koEl   = document.getElementById('sc-add-ko');
    if (!name.value.trim())       { showToast('시나리오 이름을 입력해주세요.', 'error'); return; }
    if (!kwJaEl || !kwJaEl.value.trim()) { showToast('일본어 키워드를 입력해주세요.', 'error'); return; }
    if (!jaEl.value.trim())       { showToast('일본어 메시지를 입력해주세요.', 'error'); return; }
    var kwVal = kwJaEl.value.trim() + (kwKoEl && kwKoEl.value.trim() ? ',' + kwKoEl.value.trim() : '');
    scenarios.push({ name: name.value.trim(), nameKo: name.value.trim(), kw: kwVal, msg: jaEl.value.trim(), msgKo: koEl ? koEl.value.trim() : '' });
    renderScenarios();
    showToast('✓ 시나리오가 추가되었습니다.', 'success');
  }, '추가', 'btn-primary');
}

// ── 시나리오 편집 ─────────────────────────────────────────────────
function editScenario(idx) {
  var s = scenarios[idx];
  if (!s) return;
  var body = langToggleHtml('modal-sc-edit')
    + '<div style="margin-bottom:12px"><label style="' + LBL + '">시나리오 이름</label>'
    + '<input type="text" id="sc-edit-name" value="' + s.name + '" style="' + INP + '"></div>'
    + '<div class="mf-ja" style="margin-bottom:12px"><label style="' + LBL + '">🇯🇵 키워드 (일본어)</label>'
    + '<input type="text" id="sc-edit-kw-ja" value="' + s.kw + '" style="' + INP + '"></div>'
    + '<div class="mf-ko" style="display:none;margin-bottom:12px"><label style="' + LBL + '">🇰🇷 키워드 (한국어)</label>'
    + '<input type="text" id="sc-edit-kw-ko" value="' + (s.kwKo || '') + '" style="' + INP + '"></div>'
    + '<div class="mf-ja"><label style="' + LBL + '">🇯🇵 자동 응답 메시지</label>'
    + '<textarea id="sc-edit-ja" rows="4" style="' + TA + '">' + s.msg + '</textarea></div>'
    + '<div class="mf-ko" style="display:none"><label style="' + LBL + '">🇰🇷 한국어 번역</label>'
    + '<textarea id="sc-edit-ko" rows="4" style="' + TA + '">' + (s.msgKo || '') + '</textarea></div>';

  openModal('✏ 시나리오 편집 — ' + s.name, body, function() {
    var nameEl = document.getElementById('sc-edit-name');
    var jaEl   = document.getElementById('sc-edit-ja');
    var koEl   = document.getElementById('sc-edit-ko');
    var kwJaEl2 = document.getElementById('sc-edit-kw-ja');
    var kwKoEl2 = document.getElementById('sc-edit-kw-ko');
    if (nameEl)  scenarios[idx].name  = nameEl.value;
    if (kwJaEl2) {
      var kwVal2 = kwJaEl2.value.trim() + (kwKoEl2 && kwKoEl2.value.trim() ? ',' + kwKoEl2.value.trim() : '');
      scenarios[idx].kw    = kwVal2;
      scenarios[idx].kwKo  = kwKoEl2 ? kwKoEl2.value.trim() : '';
    }
    if (jaEl)    scenarios[idx].msg   = jaEl.value;
    if (koEl)    scenarios[idx].msgKo = koEl.value;
    renderScenarios();
    showToast('✓ 시나리오가 저장되었습니다.', 'success');
  }, '저장', 'btn-primary');
}

// ── 시나리오 삭제 ─────────────────────────────────────────────────
function deleteScenario(idx) {
  var s = scenarios[idx];
  if (!s) return;
  openModal('🗑 시나리오 삭제', '"<strong>' + s.name + '</strong>" 시나리오를 삭제하시겠습니까?<br><span style="font-size:12px;color:#9CA3AF">삭제 후 복구할 수 없습니다.</span>', function() {
    scenarios.splice(idx, 1);
    renderScenarios();
    showToast('✓ 시나리오가 삭제되었습니다.', '');
  }, '삭제', 'btn-danger');
}

// ── 트리거 추가 ───────────────────────────────────────────────────
function addTrigger() {
  var body = langToggleHtml('modal-tr-add')
    + '<div class="mf-ja" style="margin-bottom:12px"><label style="' + LBL + '">🇯🇵 트리거 키워드 (실제 감지용)</label>'
    + '<input type="text" id="tr-kw-ja" placeholder="例) 訴訟,弁護士,クレーム" style="' + INP + '"></div>'
    + '<div class="mf-ko" style="display:none;margin-bottom:12px"><label style="' + LBL + '">🇰🇷 트리거 키워드 (참고용)</label>'
    + '<input type="text" id="tr-kw-ko" placeholder="예) 소송, 변호사, 컴플레인" style="' + INP + '"></div>'
    + '<div style="margin-bottom:12px"><label style="' + LBL + '">우선순위</label>'
    + '<select id="tr-color" style="' + INP + '">'
    + '<option value="#DC2626">🔴 긴급 (즉시 인계)</option>'
    + '<option value="#D97706">🟡 주의 (확인 후 인계)</option>'
    + '<option value="#059669">🟢 일반 (여유 인계)</option>'
    + '</select></div>'
    + '<div><label style="' + LBL + '">인계 담당자</label>'
    + '<select id="tr-staff" style="' + INP + '">'
    + '<option>김지현 (관리자)</option><option>이수진 (스탭)</option>'
    + '</select></div>';

  openModal('➕ L3 트리거 추가', body, function() {
    var kwJa = document.getElementById('tr-kw-ja');
    var kwKo = document.getElementById('tr-kw-ko');
    var color = document.getElementById('tr-color');
    if (!kwJa || !kwJa.value.trim()) { showToast('일본어 키워드를 입력해주세요.', 'error'); return; }
    var disp = kwKo && kwKo.value.trim() ? kwJa.value.trim() + ' (' + kwKo.value.trim() + ')' : kwJa.value.trim();
    triggers.push({ text: disp, color: color ? color.value : '#DC2626' });
    renderTriggers();
    showToast('✓ 트리거가 추가되었습니다.', 'success');
  }, '추가', 'btn-primary');
}

// ── 트리거 삭제 ───────────────────────────────────────────────────
function deleteTrigger(idx) {
  var t = triggers[idx];
  if (!t) return;
  openModal('🗑 트리거 삭제', '"<strong>' + t.text + '</strong>"<br>트리거를 삭제하시겠습니까?<br><span style="font-size:12px;color:#9CA3AF">삭제 후 복구할 수 없습니다.</span>', function() {
    triggers.splice(idx, 1);
    renderTriggers();
    showToast('✓ 트리거가 삭제되었습니다.', '');
  }, '삭제', 'btn-danger');
}

// ── 자동상담 ON/OFF ───────────────────────────────────────────────
function toggleAuto(cb) {
  document.getElementById('toggle-label').textContent = cb.checked ? '자동상담 ON' : '자동상담 OFF';
}

// ── 초기화 ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  renderWelcomePreview();
  renderScenarios();
  renderTriggers();

  // 업무시간 그리드
  var hgEl = document.getElementById('hrs-grid');
  if (hgEl) {
    hrs.forEach(function(h) {
      hgEl.innerHTML += '<div class="hr-cell' + (h.on ? ' on' : '') + '" onclick="this.classList.toggle(\'on\')">'
        + '<div class="hr-day">' + h.day + '</div>'
        + '<div class="hr-range">' + h.range + '</div>'
        + '</div>';
    });
  }

  // 처리 차트
  var chartEl = document.getElementById('lineChart');
  if (chartEl && typeof Chart !== 'undefined') {
    new Chart(chartEl, {
      type: 'bar',
      data: {
        labels: ['1','3','5','7','9','11','13','15','17','19'],
        datasets: [
          {label:'AI 처리', data:[8,10,7,12,9,11,8,13,10,14], backgroundColor:'#0D9488', borderRadius:2, stack:'a'},
          {label:'인계',    data:[1,0,1,1,0,1,0,1,1,1],        backgroundColor:'#F59E0B', borderRadius:2, stack:'a'}
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { font: { size: 9 }, color: '#9CA3AF' } },
          y: { stacked: true, display: false, beginAtZero: true }
        }
      }
    });
  }
});
