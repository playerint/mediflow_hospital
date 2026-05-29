
/**
 * auth.js — Hospital Site OS 인증 관리
 * 데모 계정으로 로그인/로그아웃 처리
 */

// 데모 계정
const HOSPITAL_ACCOUNTS = [
  { email:'admin@oleps.co.kr',   password:'admin1234',  name:'김지현', role:'admin',   hospital:'올래성형외과' },
  { email:'staff@oleps.co.kr',   password:'staff1234',  name:'이수진', role:'staff',   hospital:'올래성형외과' },
];

function getSession() {
  try {
    var val = sessionStorage.getItem('hospital_user');
    return val ? JSON.parse(val) : null;
  } catch(e) { return null; }
}
function setSession(user) {
  var val = JSON.stringify(user);
  try { sessionStorage.setItem('hospital_user', val); } catch(e) {}
  try { localStorage.setItem('hospital_user', val); } catch(e) {}
}
function clearSession() {
  try { sessionStorage.removeItem('hospital_user'); } catch(e) {}
  try { localStorage.removeItem('hospital_user'); } catch(e) {}
}
function requireAuth() {
  const user = getSession();
  if (!user) {
    location.href = getLoginPath();
    return null;
  }
  return user;
}
function getLoginPath() {
  return location.pathname.includes('/html/') ? '../login.html' : 'login.html';
}
function logout() {
  clearSession();
  window.location.replace(getLoginPath());
}

// ── 맞춤법 검사 빨간 줄 전역 제거 ──
document.addEventListener('DOMContentLoaded', function() {
  function disableSpellcheck() {
    document.querySelectorAll('input, textarea').forEach(function(el) {
      el.setAttribute('spellcheck', 'false');
      el.setAttribute('autocorrect', 'off');
      el.setAttribute('autocapitalize', 'off');
    });
  }
  disableSpellcheck();
  // 동적으로 추가되는 요소도 처리
  var observer = new MutationObserver(function() { disableSpellcheck(); });
  observer.observe(document.body, { childList: true, subtree: true });
});
