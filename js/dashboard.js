
const buildSteps=[
  {label:'자동 분석',pct:100,done:true,warn:false},{label:'전략 산출',pct:100,done:true,warn:false},
  {label:'디자인',pct:100,done:true,warn:false},{label:'자산 관리',pct:100,done:true,warn:false},
  {label:'카피 검수',pct:100,done:true,warn:false},{label:'컴플라이언스',pct:60,done:false,warn:true},
  {label:'퍼널 연결',pct:100,done:true,warn:false},{label:'SEO·AEO',pct:100,done:true,warn:false},{label:'게시',pct:100,done:true,warn:false},
];
const bsEl=document.getElementById('build-steps');
buildSteps.forEach(st=>{
  const color=st.warn?'#D97706':st.done?'#059669':'#9CA3AF';
  const icon=st.warn?'⚠':st.done?'✓':'○';
  bsEl.innerHTML+=`<div class="build-row"><div class="build-icon" style="color:${color}">${icon}</div><div class="build-label">${st.label}</div><div class="build-bar-wrap"><div class="build-bar" style="width:${st.pct}%;background:${color}"></div></div><div class="build-pct">${st.pct}%</div></div>`;
});

const funnelData=[{lbl:'방문',n:1847,color:'#2563EB'},{lbl:'문의',n:23,color:'#6D28D9'},{lbl:'상담',n:18,color:'#0D9488'},{lbl:'예약',n:14,color:'#D97706'},{lbl:'내원',n:14,color:'#DC2626'}];
const frEl=document.getElementById('funnel-row');
funnelData.forEach((f,i)=>{
  const rate=i>0?Math.round(f.n/funnelData[i-1].n*100)+'%':'';
  frEl.innerHTML+=`<div class="funnel-col"><div class="funnel-num">${f.n.toLocaleString()}</div><div class="funnel-lbl">${f.lbl}</div><div class="funnel-bar" style="background:${f.color}"></div><div class="funnel-rate">${rate}</div></div>`;
});

const chData=[{name:'LINE',cnt:12,pct:52,color:'#0D9488'},{name:'상담 폼',cnt:7,pct:30,color:'#2563EB'},];
const chEl=document.getElementById('ch-rows');
chData.forEach(c=>{
  chEl.innerHTML+=`<div class="ch-row"><div class="ch-dot" style="background:${c.color}"></div><div class="ch-name">${c.name}</div><div class="ch-bar-wrap"><div class="ch-bar" style="width:${c.pct}%;background:${c.color}"></div></div><div class="ch-cnt">${c.cnt}건</div><div class="ch-pct">${c.pct}%</div></div>`;
});

const schedData=[
  {time:'10:00',title:'비대면 상담',sub:'스즈키 미카 · 쌍꺼풀',color:'#2563EB',badge:'비대면',bc:'#DBEAFE',btc:'#1E40AF'},
  {time:'11:30',title:'이토 나나미 내원',sub:'쌍꺼풀 수술 후 체크',color:'#059669',badge:'내원',bc:'#D1FAE5',btc:'#065F46'},
  {time:'14:00',title:'D+3 리타게팅 발송',sub:'3명 LINE 자동 발송',color:'#6D28D9',badge:'자동',bc:'#EDE9FE',btc:'#4C1D95'},
  {time:'15:30',title:'비대면 상담',sub:'아오키 하나 · 콧대',color:'#D97706',badge:'예약',bc:'#FEF3C7',btc:'#92400E'},
];
const schEl=document.getElementById('sched-list');
schedData.forEach(s=>{
  schEl.innerHTML+=`<div class="sched-item" onclick="location.href='html/hospital_crm_booking.html'" style="cursor:pointer"><div class="sched-time">${s.time}</div><div class="sched-dot" style="background:${s.color}"></div><div class="sched-body"><div class="sched-title">${s.title}</div><div class="sched-sub">${s.sub}</div></div><span class="sched-badge" style="background:${s.bc};color:${s.btc}">${s.badge}</span></div>`;
});

const aeoData=[{engine:'Perplexity',cnt:9,max:15,color:'#6D28D9',delta:'+4'},{engine:'ChatGPT',cnt:6,max:15,color:'#059669',delta:'+2'},{engine:'AI Overviews',cnt:4,max:15,color:'#2563EB',delta:'+1'}];
const aeoEl=document.getElementById('aeo-list');
aeoData.forEach(a=>{
  aeoEl.innerHTML+=`<div class="aeo-row"><div class="aeo-engine">${a.engine}</div><div class="aeo-bar-wrap"><div class="aeo-bar" style="width:${Math.round(a.cnt/a.max*100)}%;background:${a.color}"></div></div><div class="aeo-cnt">${a.cnt}회</div><div class="aeo-delta">${a.delta}</div></div>`;
});

new Chart(document.getElementById('lineChart'),{
  type:'bar',
  data:{labels:['1','','','','5','','','','','10','','','','','15','','','','','20'],
    datasets:[{data:[3,4,2,5,4,6,3,5,4,7,5,6,4,8,6,7,5,8,7,9],backgroundColor:'#0D9488',borderRadius:2}]},
  options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{display:false},y:{display:false,beginAtZero:true}}}
});
