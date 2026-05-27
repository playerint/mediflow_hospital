
const bookings=[
  {date:'5/20',time:'10:00',name:'스즈키 미카',proc:'비대면 상담',color:'#2563EB',bc:'#DBEAFE',tc:'#1E40AF',badge:'비대면',bbc:'#DBEAFE',btc:'#1E40AF'},
  {date:'5/20',time:'11:30',name:'이토 나나미',proc:'쌍꺼풀 내원',color:'#059669',bc:'#D1FAE5',tc:'#065F46',badge:'내원',bbc:'#D1FAE5',btc:'#065F46'},
  {date:'5/20',time:'14:00',name:'와타나베 아오이',proc:'비대면 상담',color:'#2563EB',bc:'#DBEAFE',tc:'#1E40AF',badge:'비대면',bbc:'#DBEAFE',btc:'#1E40AF'},
  {date:'5/21',time:'13:00',name:'나카무라 리나',proc:'코 성형 상담',color:'#0D9488',bc:'#CCFBF1',tc:'#0F766E',badge:'상담',bbc:'#D1FAE5',btc:'#065F46'},
  {date:'5/22',time:'10:00',name:'다나카 유키',proc:'눈 성형 상담',color:'#D97706',bc:'#FEF3C7',tc:'#92400E',badge:'상담',bbc:'#FEF3C7',btc:'#92400E'},
  {date:'5/22',time:'15:00',name:'기타노 유이',proc:'피부레이저',color:'#6D28D9',bc:'#EDE9FE',tc:'#4C1D95',badge:'시술',bbc:'#EDE9FE',btc:'#4C1D95'},
];
const days=['월','화','수','목','금','토','일'];
const dates=['18','19','20','21','22','23','24'];
const cal=document.getElementById('calendar');
days.forEach((d,i)=>{
  const isToday=dates[i]==='20';
  let chips='';
  bookings.filter(b=>b.date==='5/'+dates[i]).forEach(b=>{
    chips+=`<div class="bk-chip" style="background:${b.bc};color:${b.tc}" title="${b.time} ${b.name}">${b.time.split(':')[0]}시 ${b.name.split(' ')[0]}</div>`;
  });
  cal.innerHTML+=`<div class="day-col"><div class="day-head"><div class="day-name" style="color:${d==='토'?'#2563EB':d==='일'?'#DC2626':'var(--gray-400)'}">${d}</div><div class="day-num${isToday?' today':''}">${dates[i]}</div></div>${chips}</div>`;
});
const tl=document.getElementById('today-list');
bookings.filter(b=>b.date==='5/20').forEach(b=>{
  tl.innerHTML+=`<div class="bk-item" onclick="alert('${b.name} 예약 상세')">
    <div class="bk-time">${b.time}</div>
    <div class="bk-dot" style="background:${b.color}"></div>
    <div class="bk-body"><div class="bk-name">${b.name}</div><div class="bk-meta">${b.proc}</div></div>
    <span class="bk-badge" style="background:${b.bbc};color:${b.btc}">${b.badge}</span>
  </div>`;
});
function changeWeek(dir){
  const lb=document.getElementById('week-label');lb.style.opacity='.5';setTimeout(()=>lb.style.opacity='1',200);
}
