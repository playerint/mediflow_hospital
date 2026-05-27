
const notifs = [
  {date:'오늘', items:[
    {type:'compliance',icon:'⚠',ib:'#FEE2E2',title:'컴플라이언스 위반 감지',sub:'쌍꺼풀 페이지 — "絶対に自然" 표현이 일본 의료광고법 위반으로 감지되었습니다.',time:'방금',tag:'긴급',tb:'#FEE2E2',tc:'#991B1B',u:'u-red',link:'hospital_site_content.html'},
    {type:'crm',icon:'💬',ib:'#DBEAFE',title:'미확인 LINE 문의 3건',sub:'야마다 사오리, 스즈키 미카, 다나카 유키 — 최대 2시간 경과.',time:'2시간 전',tag:'CRM',tb:'#DBEAFE',tc:'#1E40AF',u:'u-amber',link:'hospital_crm_inbox.html'},
    {type:'crm',icon:'📝',ib:'#EDE9FE',title:'카피 검수 대기',sub:'눈 성형 섹션 AI 재집필 완료. 검수 후 게시해 주세요.',time:'3시간 전',tag:'사이트',tb:'#EDE9FE',tc:'#4C1D95',u:'u-blue',link:'hospital_site_content.html'},
    {type:'auto',icon:'⚡',ib:'#FEF3C7',title:'D+7 리타게팅 예정 5명',sub:'내일 오전 10:00 자동 발송됩니다.',time:'오늘 09:00',tag:'자동화',tb:'#FEF3C7',tc:'#92400E',u:'',link:'hospital_funnel.html'},
  ]},
  {date:'어제', items:[
    {type:'report',icon:'📊',ib:'#EDE9FE',title:'AEO 인용 신규 감지',sub:'Perplexity에서 "韓国 二重整形" 쿼리에 2회 인용되었습니다.',time:'어제 15:30',tag:'AEO',tb:'#EDE9FE',tc:'#4C1D95',u:'',link:'hospital_reports.html'},
    {type:'auto',icon:'✅',ib:'#D1FAE5',title:'D+3 리타게팅 발송 완료',sub:'3명에게 발송 완료. 클릭률 44%, 전환 1건.',time:'어제 10:00',tag:'자동화',tb:'#FEF3C7',tc:'#92400E',u:'',link:'hospital_funnel.html'},
    {type:'compliance',icon:'✓',ib:'#D1FAE5',title:'컴플라이언스 검사 통과',sub:'코 성형 섹션 업데이트 후 5종 규칙 검사 통과.',time:'어제 09:15',tag:'사이트',tb:'#EDE9FE',tc:'#4C1D95',u:'',link:'hospital_site_content.html'},
  ]},
  {date:'5월 18일', items:[
    {type:'crm',icon:'📅',ib:'#D1FAE5',title:'예약 확정 — 이토 나나미',sub:'6월 5일 14:00 쌍꺼풀 카운슬링 예약 확정. LINE 자동 발송 완료.',time:'5/18 17:20',tag:'예약',tb:'#D1FAE5',tc:'#065F46',u:'',link:'hospital_crm_inbox.html'},
    {type:'report',icon:'📈',ib:'#DBEAFE',title:'5월 중간 리포트',sub:'방문자 982명, 문의 11건, 전환율 35%.',time:'5/18 09:00',tag:'리포트',tb:'#DBEAFE',tc:'#1E40AF',u:'',link:'hospital_reports.html'},
  ]},
];

let currentFilter = 'all';

function render(filter) {
  const container = document.getElementById('notif-container');
  container.innerHTML = '';
  notifs.forEach(group => {
    const items = group.items.filter(n => filter === 'all' || n.type === filter);
    if (!items.length) return;
    let html = `<div class="notif-group"><div class="notif-date">${group.date}</div>`;
    items.forEach(n => {
      html += `<a class="notif-item ${n.u}" href="${n.link}">
        <div class="notif-icon" style="background:${n.ib}">${n.icon}</div>
        <div class="notif-body">
          <div class="notif-title">${n.title}</div>
          <div class="notif-sub">${n.sub}</div>
          <div class="notif-meta">
            <span class="notif-time">${n.time}</span>
            <span class="notif-tag" style="background:${n.tb};color:${n.tc}">${n.tag}</span>
          </div>
        </div>
        ${n.u ? '<div class="unread-dot" style="background:var(--teal)"></div>' : ''}
      </a>`;
    });
    html += '</div>';
    container.innerHTML += html;
  });
}

function setFilter(f, btn) {
  currentFilter = f;
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('on'));
  btn.classList.add('on');
  render(f);
}

function markAll() {
  document.querySelectorAll('.notif-item').forEach(el => {
    el.classList.remove('u-red','u-amber','u-blue','u-teal');
  });
  document.querySelectorAll('.unread-dot').forEach(d => d.remove());
  const cnt = document.getElementById('unread-cnt');
  if (cnt) cnt.textContent = '미확인 0건';
}

render('all');
