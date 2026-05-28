
const ROLE_PERMS = [
  { menu:'홈 대시보드',         admin:true,  editor:true,  viewer:true  },
  { menu:'사이트 — 콘텐츠 편집', admin:true,  editor:true,  viewer:false },
  { menu:'사이트 — 자산 관리',   admin:true,  editor:true,  viewer:false },
  { menu:'사이트 — 게시하기',    admin:true,  editor:false, viewer:false },
  { menu:'CRM 인박스 조회',      admin:true,  editor:true,  viewer:true  },
  { menu:'CRM 답변 발송',        admin:true,  editor:true,  viewer:false },
  { menu:'LINE 자동상담 설정',    admin:true,  editor:false, viewer:false },
  { menu:'퍼널·자동화 설정',     admin:true,  editor:false, viewer:false },
  { menu:'리포트 조회',          admin:true,  editor:true,  viewer:true  },
  { menu:'리포트 PDF 생성',      admin:true,  editor:true,  viewer:false },
  { menu:'설정 — 병원 정보',     admin:true,  editor:false, viewer:false },
  { menu:'설정 — 팀 멤버 관리',  admin:true,  editor:false, viewer:false },
  { menu:'설정 — 플랜·결제',     admin:true,  editor:false, viewer:false },
];

const MEMBERS = [
  { name:'김지현', email:'admin@oleps.co.kr',  av:'김', bg:'#EEEDFE', tc:'#3C3489', role:'admin'  },
  { name:'이수진', email:'lee@hospital.co.kr',  av:'이', bg:'#D1FAE5', tc:'#065F46', role:'editor' },
  { name:'박민호', email:'park@hospital.co.kr', av:'박', bg:'#DBEAFE', tc:'#1E40AF', role:'viewer' },
];

function renderRoleTable() {
  var tbody = document.getElementById('role-table-body');
  if (!tbody) return;

  function chk(v) {
    return v
      ? '<span style="color:var(--green);font-size:15px;font-weight:700">✓</span>'
      : '<span style="color:var(--gray-300);font-size:15px">✕</span>';
  }

  var html = '';
  for (var i = 0; i < ROLE_PERMS.length; i++) {
    var p   = ROLE_PERMS[i];
    var bg  = i % 2 === 0 ? '#fff' : 'var(--gray-50)';
    html += '<tr style="background:' + bg + '">';
    html += '<td style="font-size:12px;color:var(--gray-700);padding:10px 14px;border-bottom:1px solid var(--gray-100)">' + p.menu + '</td>';
    html += '<td style="text-align:center;padding:10px 14px;border-bottom:1px solid var(--gray-100)">' + chk(p.admin)  + '</td>';
    html += '<td style="text-align:center;padding:10px 14px;border-bottom:1px solid var(--gray-100)">' + chk(p.editor) + '</td>';
    html += '<td style="text-align:center;padding:10px 14px;border-bottom:1px solid var(--gray-100)">' + chk(p.viewer) + '</td>';
    html += '</tr>';
  }
  tbody.innerHTML = html;
}

function renderMemberRoles() {
  var el = document.getElementById('member-role-list');
  if (!el) return;

  var html = '';
  for (var i = 0; i < MEMBERS.length; i++) {
    var m = MEMBERS[i];
    html += '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--gray-100)">';
    html += '<div style="width:34px;height:34px;border-radius:50%;background:' + m.bg + ';color:' + m.tc + ';display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;flex-shrink:0">' + m.av + '</div>';
    html += '<div style="flex:1">';
    html += '<div style="font-size:13px;font-weight:500;color:var(--gray-900)">' + m.name + '</div>';
    html += '<div style="font-size:11px;color:var(--gray-400)">' + m.email + '</div>';
    html += '</div>';
    html += '<select id="role-select-' + i + '" style="padding:6px 12px;border:1.5px solid var(--gray-200);border-radius:var(--r);font-size:13px;font-family:inherit;outline:none;color:var(--gray-700);background:#fff;cursor:pointer;height:34px">';
    html += '<option value="admin"'  + (m.role === 'admin'  ? ' selected' : '') + '>👑 관리자</option>';
    html += '<option value="editor"' + (m.role === 'editor' ? ' selected' : '') + '>✏ 편집자</option>';
    html += '<option value="viewer"' + (m.role === 'viewer' ? ' selected' : '') + '>👁 뷰어</option>';
    html += '</select>';
    html += '</div>';
  }
  el.innerHTML = html;
}

function saveRoles() {
  MEMBERS.forEach((m, i) => {
    const sel = document.getElementById('role-select-' + i);
    if (sel) m.role = sel.value;
  });
  alert('권한 변경이 저장되었습니다.');
}


const sections =;


function deleteMember(name) {
  if (confirm(name + ' 멤버를 삭제하시겠습니까?\n삭제 후 해당 계정은 더 이상 접속할 수 없습니다.')) {
    alert(name + ' 멤버가 삭제되었습니다.');
    // 해당 행 숨기기
    var items = document.querySelectorAll('.m-item');
    items.forEach(function(item) {
      if (item.textContent.indexOf(name) > -1) {
        item.style.display = 'none';
      }
    });
  }
}

function saveTeamRoles() {
  var r1 = document.getElementById('role-1');
  var r2 = document.getElementById('role-2');
  var labels = { admin:'관리자', editor:'편집자', viewer:'뷰어' };
  var msg = '권한이 저장되었습니다.\n\n';
  if (r1) msg += '이수진  →  ' + labels[r1.value] + '\n';
  if (r2) msg += '박민호  →  ' + labels[r2.value];
  alert(msg);
  // 테두리 원복
  if (r1) r1.style.borderColor = 'var(--gray-200)';
  if (r2) r2.style.borderColor = 'var(--gray-200)';
}

function updateRoleBadge(idx) {
  var el = document.getElementById('role-' + idx);
  if (el) el.style.borderColor = 'var(--teal)';
}


/* ── 초대 모달 ── */
function openInviteModal() {
  // 기존 모달 제거
  var existing = document.getElementById('invite-modal');
  if (existing) existing.remove();

  var modal = document.createElement('div');
  modal.id = 'invite-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:1000;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s ease';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:16px;padding:28px 32px;width:100%;max-width:440px;box-shadow:0 20px 60px rgba(0,0,0,.2);animation:slideUp .25s ease">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
        <div style="font-size:16px;font-weight:700;color:var(--navy)">👥 멤버 초대</div>
        <button onclick="closeInviteModal()" style="width:28px;height:28px;border-radius:6px;border:1px solid var(--gray-200);background:#fff;cursor:pointer;font-size:14px;color:var(--gray-400)">✕</button>
      </div>

      <div style="margin-bottom:14px">
        <div style="font-size:12px;font-weight:600;color:var(--gray-700);margin-bottom:5px">초대할 이메일 <span style="color:var(--red)">*</span></div>
        <input id="invite-email" type="email" placeholder="예) staff@oleps.co.kr"
          style="width:100%;padding:9px 12px;border:1.5px solid var(--gray-200);border-radius:var(--r);font-size:13px;font-family:inherit;outline:none;color:var(--gray-700)"
          onfocus="this.style.borderColor='var(--teal)'" onblur="this.style.borderColor='var(--gray-200)'">
      </div>

      <div style="margin-bottom:14px">
        <div style="font-size:12px;font-weight:600;color:var(--gray-700);margin-bottom:8px">권한 선택 <span style="color:var(--red)">*</span></div>
        <div style="display:flex;flex-direction:column;gap:8px" id="role-options">
          <label style="display:flex;align-items:flex-start;gap:10px;padding:10px 14px;border:1.5px solid var(--gray-200);border-radius:var(--r);cursor:pointer;transition:all .15s" id="opt-admin">
            <input type="radio" name="invite-role" value="admin" style="margin-top:2px;accent-color:var(--teal)">
            <div>
              <div style="font-size:13px;font-weight:600;color:var(--navy)">👑 관리자</div>
              <div style="font-size:11px;color:var(--gray-400);margin-top:2px">모든 메뉴 접근 · 설정 변경 · 팀 관리</div>
            </div>
          </label>
          <label style="display:flex;align-items:flex-start;gap:10px;padding:10px 14px;border:1.5px solid var(--gray-200);border-radius:var(--r);cursor:pointer;background:#fff;transition:all .15s" id="opt-editor">
            <input type="radio" name="invite-role" value="editor" style="margin-top:2px;accent-color:var(--teal)">
            <div>
              <div style="font-size:13px;font-weight:600;color:var(--navy)">✏ 편집자</div>
              <div style="font-size:11px;color:var(--gray-400);margin-top:2px">콘텐츠 편집 · CRM · 리포트 조회</div>
            </div>
          </label>
          <label style="display:flex;align-items:flex-start;gap:10px;padding:10px 14px;border:1.5px solid var(--teal);border-radius:var(--r);cursor:pointer;background:var(--teal-l);transition:all .15s" id="opt-viewer">
            <input type="radio" name="invite-role" value="viewer" checked style="margin-top:2px;accent-color:var(--teal)">
            <div>
              <div style="font-size:13px;font-weight:600;color:var(--navy)">👁 뷰어</div>
              <div style="font-size:11px;color:var(--gray-400);margin-top:2px">대시보드 · 리포트 조회만 가능</div>
            </div>
          </label>
        </div>
      </div>

      <div style="background:var(--gray-50);border-radius:var(--r);padding:10px 14px;margin-bottom:18px;font-size:12px;color:var(--gray-500);line-height:1.6">
        📧 초대 이메일이 발송되면 수신자가 링크를 클릭해<br>이름과 비밀번호를 직접 설정하게 됩니다.
      </div>

      <div id="invite-error" style="display:none;font-size:12px;color:var(--red);background:var(--red-l);border:1px solid #FCA5A5;border-radius:8px;padding:8px 12px;margin-bottom:12px"></div>

      <div style="display:flex;gap:8px">
        <button onclick="closeInviteModal()" class="btn" style="flex:1;justify-content:center">취소</button>
        <button onclick="sendInvite()" class="btn btn-primary" style="flex:2;justify-content:center" id="send-invite-btn">📧 초대 이메일 발송</button>
      </div>
    </div>`;

  // 라디오 선택 시 테두리 변경
  modal.querySelectorAll('input[name="invite-role"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
      ['admin','editor','viewer'].forEach(function(r) {
        var el = document.getElementById('opt-' + r);
        if (r === radio.value) {
          el.style.borderColor = 'var(--teal)';
          el.style.background  = 'var(--teal-l)';
        } else {
          el.style.borderColor = 'var(--gray-200)';
          el.style.background  = '#fff';
        }
      });
    });
  });

  // 모달 바깥 클릭 시 닫기
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeInviteModal();
  });

  document.body.appendChild(modal);
  setTimeout(function() { document.getElementById('invite-email').focus(); }, 100);
}

function closeInviteModal() {
  var modal = document.getElementById('invite-modal');
  if (modal) modal.remove();
}

function sendInvite() {
  var email = document.getElementById('invite-email').value.trim();
  var role  = document.querySelector('input[name="invite-role"]:checked');
  var err   = document.getElementById('invite-error');
  var btn   = document.getElementById('send-invite-btn');
  var roleLabels = { admin:'관리자', editor:'편집자', viewer:'뷰어' };

  err.style.display = 'none';

  if (!email) {
    err.textContent = '초대할 이메일을 입력해주세요.';
    err.style.display = 'block';
    document.getElementById('invite-email').focus();
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    err.textContent = '올바른 이메일 형식을 입력해주세요.';
    err.style.display = 'block';
    return;
  }

  // 발송 시뮬레이션
  btn.disabled = true;
  btn.textContent = '⏳ 발송 중...';

  setTimeout(function() {
    closeInviteModal();
    showToast('📧 ' + email + ' 으로 초대 이메일이 발송되었습니다. (' + roleLabels[role.value] + ' 권한)');
    // 프로토타입: 초대 링크 확인용 팝업
    setTimeout(function() {
      if (confirm('[프로토타입 전용]\n초대받은 사람 화면을 미리 볼까요?\n\n실제 서비스에서는 수신자 이메일로 링크가 발송됩니다.')) {
        window.open('invite.html?email=' + encodeURIComponent(email) + '&role=' + role.value, '_blank');
      }
    }, 500);
  }, 1500);
}

function showToast(msg) {
  var toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:var(--navy);color:#fff;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:500;box-shadow:0 4px 20px rgba(0,0,0,.2);z-index:2000;animation:slideUp .25s ease;white-space:nowrap';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .3s';
    setTimeout(function() { toast.remove(); }, 300);
  }, 3500);
}


var currentPlan = 'pro';

function planFeature(enabled, text) {
  return '<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:'+(enabled?'var(--gray-700)':'var(--gray-300)')+'"><span style="color:'+(enabled?'var(--green)':'var(--gray-300)')+';font-weight:700">'+(enabled?'✓':'✕')+'</span>'+text+'</div>';
}

function changePlan(planId, planName, price) {
  var isUpgrade = planId === 'enterprise' || (planId === 'pro' && currentPlan === 'basic');
  var actionLabel = isUpgrade ? '업그레이드' : '다운그레이드';
  var color = isUpgrade ? 'var(--purple)' : 'var(--red)';
  var planLabels = {basic:'Basic', pro:'Pro', enterprise:'Enterprise'};
  var currentLabel = planLabels[currentPlan] || 'Pro';

  // 다운그레이드 시 미적용 기능 목록
  var lostFeatures = {
    'pro→basic': ['AEO 최적화','LINE 자동상담 (AI 24/7)','D+3/7/14 리타게팅','팀 멤버 5명 → 최대 2명'],
    'enterprise→pro': ['전담 컨설턴트 배정','팀 멤버 무제한 → 최대 5명'],
    'enterprise→basic': ['AEO 최적화','LINE 자동상담 (AI 24/7)','D+3/7/14 리타게팅','전담 컨설턴트','팀 멤버 무제한 → 최대 2명'],
  };
  var lostKey = currentPlan + '→' + planId;
  var lost = lostFeatures[lostKey] || [];

  // 업그레이드 시 추가되는 기능
  var gainFeatures = {
    'basic→pro':        ['AEO 최적화','LINE 자동상담 (AI 24/7)','D+3/7/14 리타게팅','팀 멤버 최대 5명'],
    'basic→enterprise': ['AEO 최적화','LINE 자동상담 (AI 24/7)','D+3/7/14 리타게팅','팀 멤버 무제한','전담 컨설턴트 배정'],
    'pro→enterprise':   ['전담 컨설턴트 배정','팀 멤버 무제한'],
  };
  var gainKey = currentPlan + '→' + planId;
  var gained = gainFeatures[gainKey] || [];

  // 기능 목록 HTML 생성
  var featureListHtml = '';
  if (!isUpgrade && lost.length > 0) {
    featureListHtml = '<div style="margin-top:12px;padding:12px 14px;background:#FEF2F2;border:1px solid #FCA5A5;border-radius:8px">'
      + '<div style="font-size:12px;font-weight:600;color:#DC2626;margin-bottom:8px">⚠ 다운그레이드 시 아래 기능이 비활성화됩니다</div>'
      + lost.map(function(f) {
          return '<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:#991B1B;margin-bottom:4px">'
            + '<span style="font-weight:700">✕</span>' + f + '</div>';
        }).join('')
      + '</div>';
  } else if (isUpgrade && gained.length > 0) {
    featureListHtml = '<div style="margin-top:12px;padding:12px 14px;background:#F0FDF4;border:1px solid #6EE7B7;border-radius:8px">'
      + '<div style="font-size:12px;font-weight:600;color:#059669;margin-bottom:8px">✨ 업그레이드 시 아래 기능이 활성화됩니다</div>'
      + gained.map(function(f) {
          return '<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:#065F46;margin-bottom:4px">'
            + '<span style="font-weight:700">✓</span>' + f + '</div>';
        }).join('')
      + '</div>';
  }

  var body = '<div style="margin-bottom:12px">'
    + '<div style="font-size:13px;color:var(--gray-700);line-height:1.7">'
    + '<strong>'+currentLabel+'</strong> → <strong style="color:'+color+'">'+planName+'</strong> 플랜으로 '+actionLabel+'하시겠습니까?'
    + '</div></div>'
    + '<div style="background:var(--gray-50);border-radius:8px;padding:12px 14px;font-size:12px;color:var(--gray-500);line-height:1.8">'
    + '• 변경 금액: ₩'+price+'/월<br>'
    + '• 다음 결제일(6월 1일)부터 적용됩니다.<br>'
    + '• 언제든지 다시 변경할 수 있습니다.'
    + '</div>'
    + featureListHtml;

  openModal(
    (isUpgrade ? '🚀 플랜 업그레이드' : '📉 플랜 변경'),
    body,
    function() {
      currentPlan = planId;
      showToast('✓ ' + planName + ' 플랜으로 변경되었습니다. 다음 결제일부터 적용됩니다.', 'success');
      // 현재 플랜 UI 업데이트
      showSec('plan', document.querySelector('.sn-item:last-child'));
    },
    actionLabel,
    isUpgrade ? 'btn-primary' : 'btn-warning'
  );
}

function changePayment() {
  var inputStyle = 'width:100%;padding:9px 12px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:13px;font-family:inherit;outline:none;box-sizing:border-box';
  var labelStyle = 'font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px';

  var body = ''
    + '<div style="margin-bottom:12px">'
    +   '<label style="'+labelStyle+'">카드 번호</label>'
    +   '<input type="text" id="card-num" placeholder="1234-5678-9012-3456" maxlength="19" oninput="formatCard(this)" style="'+inputStyle+'">'
    + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">'
    +   '<div>'
    +     '<label style="'+labelStyle+'">만료일</label>'
    +     '<input type="text" id="card-exp" placeholder="MM/YY" maxlength="5" oninput="formatExp(this)" style="'+inputStyle+'">'
    +   '</div>'
    +   '<div>'
    +     '<label style="'+labelStyle+'">CVC</label>'
    +     '<input type="text" id="card-cvc" placeholder="123" maxlength="3" style="'+inputStyle+'">'
    +   '</div>'
    + '</div>'
    + '<div style="margin-bottom:12px">'
    +   '<label style="'+labelStyle+'">카드 소유자 이름</label>'
    +   '<input type="text" id="card-name" placeholder="홍길동" style="'+inputStyle+'">'
    + '</div>'
    + '<div style="padding:10px 12px;background:#F9FAFB;border-radius:8px;font-size:11px;color:#9CA3AF;line-height:1.7">'
    +   '🔒 카드 정보는 암호화되어 안전하게 처리됩니다.<br>실제 결제는 다음 결제일(6월 1일)부터 새 카드로 청구됩니다.'
    + '</div>';

  openModal('💳 결제 수단 변경', body, function() {
    var num  = document.getElementById('card-num')  ? document.getElementById('card-num').value  : '';
    var exp  = document.getElementById('card-exp')  ? document.getElementById('card-exp').value  : '';
    var cvc  = document.getElementById('card-cvc')  ? document.getElementById('card-cvc').value  : '';
    var name = document.getElementById('card-name') ? document.getElementById('card-name').value : '';
    if (!num || num.replace(/-/g,'').length < 16) { showToast('카드 번호를 올바르게 입력해주세요.', 'error'); return; }
    if (!exp || exp.length < 5)                   { showToast('만료일을 올바르게 입력해주세요.', 'error'); return; }
    if (!cvc || cvc.length < 3)                   { showToast('CVC를 올바르게 입력해주세요.', 'error'); return; }
    if (!name)                                     { showToast('카드 소유자 이름을 입력해주세요.', 'error'); return; }
    var last4 = num.replace(/-/g,'').slice(-4);
    showToast('✓ 결제 수단이 변경되었습니다. (****-' + last4 + ')', 'success');
  }, '변경 저장', 'btn-primary');
}

function formatCard(input) {
  var v = input.value.replace(/\D/g,'').substring(0,16);
  input.value = v.replace(/(\d{4})(?=\d)/g,'$1-');
}
function formatExp(input) {
  var v = input.value.replace(/\D/g,'').substring(0,4);
  if (v.length >= 2) v = v.substring(0,2) + '/' + v.substring(2);
  input.value = v;
}

function requestDelete() {
  openModal(
    '⚠ 계정 삭제 요청',
    '<div style="color:var(--red);font-weight:600;margin-bottom:8px">이 작업은 되돌릴 수 없습니다.</div>'
    + '<div style="font-size:13px;color:var(--gray-700);line-height:1.7">'
    + '계정 삭제 시 모든 사이트·데이터·설정이 <strong>영구 삭제</strong>됩니다.<br>'
    + '삭제를 원하시면 <strong>support@ippeo.co.kr</strong>로 문의해주세요.</div>',
    function() {
      showToast('삭제 요청이 접수되었습니다. 영업일 기준 1~2일 내 연락드립니다.', '');
    },
    '요청 확인',
    'btn-danger'
  );
}
function showSec(key, btn) {
  document.querySelectorAll('.sn-item').forEach(function(i){ i.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  if (key === 'plan') {
    document.getElementById('sec-content').innerHTML = renderPlanSection();
  } else {
    document.getElementById('sec-content').innerHTML = sections[key] || '';
  }
  if (key === 'roles') {
    renderRoleTable();
    renderMemberRoles();
  }
}

function renderPlanSection() {
  function pf(ok, txt) {
    return '<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:'+(ok?'var(--gray-700)':'var(--gray-300)')+'"><span style="color:'+(ok?'var(--green)':'var(--gray-300)')+';font-weight:700">'+(ok?'✓':'✕')+'</span>'+txt+'</div>';
  }
  function planCard(id, name, price, desc, features, btnHtml, highlight) {
    var borderColor = highlight ? 'var(--teal)' : 'var(--gray-200)';
    var bg = highlight ? 'background:var(--teal-l);' : '';
    var badge = highlight ? '<div style="position:absolute;top:-1px;left:50%;transform:translateX(-50%);background:var(--teal);color:#fff;font-size:10px;font-weight:700;padding:3px 12px;border-radius:0 0 8px 8px;white-space:nowrap;letter-spacing:.04em">현재 플랜</div>' : '';
    var mt = highlight ? 'margin-top:8px;' : '';
    var html = '<div style="border:2px solid '+borderColor+';border-radius:var(--rl);padding:20px 18px;'+bg+'position:relative;transition:all .2s">';
    html += badge;
    html += '<div style="font-size:14px;font-weight:700;color:var(--navy);margin-bottom:4px;'+mt+'">'+name+'</div>';
    html += '<div style="font-size:22px;font-weight:800;color:var(--navy);margin-bottom:2px">₩'+price+'<span style="font-size:12px;font-weight:400;color:var(--gray-400)">/월</span></div>';
    html += '<div style="font-size:11px;color:var(--gray-400);margin-bottom:14px">'+desc+'</div>';
    html += '<div style="display:flex;flex-direction:column;gap:5px;margin-bottom:16px">';
    features.forEach(function(f){ html += pf(f[0], f[1]); });
    html += '</div>';
    html += btnHtml;
    html += '</div>';
    return html;
  }

  var basicFeatures = [
    [true,'일본어 사이트 자동 생성'],[true,'AI 카피 재집필'],
    [true,'컴플라이언스 검사'],[true,'SEO 기본 최적화'],
    [true,'호스팅 비용 포함'],[true,'도메인 비용 포함'],
    [false,'AEO 최적화'],[false,'LINE 자동상담'],
    [false,'D+3/7/14 리타게팅'],[false,'팀 멤버 5명']
  ];
  var proFeatures = [
    [true,'일본어 사이트 자동 생성'],[true,'AI 카피 재집필'],
    [true,'컴플라이언스 검사'],[true,'SEO + AEO 최적화'],
    [true,'LINE 자동상담 (AI 24/7)'],[true,'D+3/7/14 리타게팅'],
    [true,'호스팅 비용 포함'],[true,'도메인 비용 포함'],
    [true,'팀 멤버 5명'],[false,'전담 컨설턴트']
  ];
  var entFeatures = [
    [true,'일본어 사이트 자동 생성'],[true,'AI 카피 재집필'],
    [true,'컴플라이언스 검사'],[true,'SEO + AEO 최적화'],
    [true,'LINE 자동상담 (AI 24/7)'],[true,'D+3/7/14 리타게팅'],
    [true,'호스팅 비용 포함'],[true,'도메인 비용 포함'],
    [true,'팀 멤버 무제한'],[true,'전담 컨설턴트 배정']
  ];

  // 버튼은 planCard 내부에서 currentPlan 기준으로 동적 생성
  var basicBtn = currentPlan === 'basic'
    ? '<button disabled style="width:100%;padding:8px;border-radius:8px;border:1.5px solid var(--teal);background:var(--teal);color:#fff;font-size:12px;font-weight:600;font-family:inherit;cursor:not-allowed;opacity:.6">✓ 현재 플랜</button>'
    : '<button onclick="changePlan(\'basic\',\'Basic\',\'390,000\')" style="width:100%;padding:8px;border-radius:8px;border:1.5px solid var(--gray-200);background:#fff;font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;color:var(--gray-500);">다운그레이드</button>';
  var proBtn = currentPlan === 'pro'
    ? '<button disabled style="width:100%;padding:8px;border-radius:8px;border:1.5px solid var(--teal);background:var(--teal);color:#fff;font-size:12px;font-weight:600;font-family:inherit;cursor:not-allowed;opacity:.6">✓ 현재 플랜</button>'
    : (currentPlan === 'basic'
      ? '<button onclick="changePlan(\'pro\',\'Pro\',\'890,000\')" style="width:100%;padding:8px;border-radius:8px;border:1.5px solid var(--teal);background:var(--teal-l);font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;color:var(--teal-d);">업그레이드</button>'
      : '<button onclick="changePlan(\'pro\',\'Pro\',\'890,000\')" style="width:100%;padding:8px;border-radius:8px;border:1.5px solid var(--gray-200);background:#fff;font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;color:var(--gray-500);">다운그레이드</button>');
  var entBtn = currentPlan === 'enterprise'
    ? '<button disabled style="width:100%;padding:8px;border-radius:8px;border:1.5px solid var(--teal);background:var(--teal);color:#fff;font-size:12px;font-weight:600;font-family:inherit;cursor:not-allowed;opacity:.6">✓ 현재 플랜</button>'
    : '<button onclick="changePlan(\'enterprise\',\'Enterprise\',\'1,490,000\')" style="width:100%;padding:8px;border-radius:8px;border:1.5px solid var(--purple);background:var(--purple-l);font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;color:var(--purple);">업그레이드</button>';

  var html = '<div class="card fade">';
  html += '<div style="font-size:15px;font-weight:600;color:var(--navy);margin-bottom:4px">💳 플랜 및 결제</div>';
  html += '<div style="font-size:12px;color:var(--gray-400);margin-bottom:20px">현재 플랜을 확인하거나 업그레이드/다운그레이드할 수 있습니다.</div>';

  // 플랜 카드 3개
  html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px">';
  html += planCard('basic',      'Basic',      '390,000',   '소규모 클리닉을 위한 필수 패키지',   basicFeatures, basicBtn, currentPlan==='basic');
  html += planCard('pro',        'Pro',        '890,000',   '일본 환자 유치 최적화 풀패키지',      proFeatures,   proBtn,   currentPlan==='pro');
  html += planCard('enterprise', 'Enterprise', '1,490,000', '대형 병원·체인을 위한 맞춤 솔루션',  entFeatures,   entBtn,   currentPlan==='enterprise');
  html += '</div>';

  // 결제 정보
  html += '<div style="background:var(--gray-50);border:1px solid var(--gray-200);border-radius:var(--rl);padding:16px 20px;margin-bottom:20px">';
  html += '<div style="font-size:13px;font-weight:600;color:var(--navy);margin-bottom:12px">📄 결제 정보</div>';
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">';
  html += '<div><div style="font-size:11px;color:var(--gray-400);margin-bottom:3px">다음 결제일</div><div style="font-size:13px;font-weight:500">2026년 6월 1일</div></div>';
  html += '<div><div style="font-size:11px;color:var(--gray-400);margin-bottom:3px">결제 금액</div><div style="font-size:13px;font-weight:500">₩890,000</div></div>';
  html += '<div><div style="font-size:11px;color:var(--gray-400);margin-bottom:3px">결제 수단</div><div style="font-size:13px;font-weight:500">신용카드 ****-1234</div></div>';
  html += '<div><div style="font-size:11px;color:var(--gray-400);margin-bottom:3px">자동 갱신</div><div style="font-size:13px;font-weight:500;color:var(--green)">✓ 활성</div></div>';
  html += '</div>';
  html += '<button onclick="changePayment()" style="margin-top:12px;padding:6px 14px;border-radius:8px;border:1px solid var(--gray-200);background:#fff;font-size:12px;font-family:inherit;cursor:pointer;color:var(--gray-700)">💳 결제 수단 변경</button>';
  html += '</div>';

  // 위험 구역
  html += '<div class="danger-zone">';
  html += '<div class="dz-title">⚠ 위험 구역</div>';
  html += '<div class="dz-desc">계정을 삭제하면 모든 사이트, 데이터, 설정이 영구적으로 삭제됩니다.</div>';
  html += '<button class="btn btn-danger" onclick="requestDelete()">계정 삭제 요청</button>';
  html += '</div>';
  html += '</div>';
  return html;
}
// 초기 화면
showSec('hospital', document.querySelector('.sn-item'));
