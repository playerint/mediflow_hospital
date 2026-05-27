
// 퍼널 페이지 — HTML에 인터랙션이 인라인으로 작성되어 있어 별도 JS 최소화
// 향후 확장을 위한 초기화 코드
document.addEventListener('DOMContentLoaded', function() {
  // 리타게팅 아코디언 — 첫 번째 항목 기본 열기
  const firstBody = document.querySelector('.rt-body');
  if (firstBody) firstBody.style.display = 'block';
});
