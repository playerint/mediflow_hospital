/**
 * gate.js — 프로토타입 접근 보호
 * 모든 페이지에서 gate 세션 없으면 gate.html로 이동
 */
(function() {
  var GATE_KEY = 'proto_gate_2026';
  var GATE_PW  = '0102';

  // 게이트 체크 제외 페이지
  var path = location.pathname;
  var isPublic = path.includes('gate.html') ||
                 path.includes('login.html') ||
                 path.includes('register.html') ||
                 path.includes('invite.html');
  if (isPublic) return;

  // 세션 확인
  function isGateOpen() {
    try {
      return sessionStorage.getItem(GATE_KEY) === GATE_PW;
    } catch(e) { return false; }
  }

  if (!isGateOpen()) {
    var gatePath = path.includes('/html/') ? '../gate.html' : 'gate.html';
    window.location.replace(gatePath);
  }
})();
