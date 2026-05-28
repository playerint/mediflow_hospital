
const channels=[{name:'LINE',cnt:12,pct:52,color:'#0D9488',delta:'+4'},{name:'상담 폼',cnt:7,pct:30,color:'#2563EB',delta:'+3'},];
const cr=document.getElementById('ch-rows');
channels.forEach(c=>{
  cr.innerHTML+=`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--gray-100);cursor:pointer" onclick="setFilter('${c.name}',null)">
    <div style="width:10px;height:10px;border-radius:50%;background:${c.color};flex-shrink:0"></div>
    <span style="font-size:13px;min-width:80px">${c.name}</span>
    <div style="flex:1;height:6px;background:var(--gray-100);border-radius:3px;overflow:hidden"><div style="height:100%;border-radius:3px;width:${c.pct}%;background:${c.color}"></div></div>
    <span style="font-size:12px;font-weight:600;min-width:28px;text-align:right">${c.cnt}건</span>
    <span style="font-size:11px;color:var(--green);min-width:36px;text-align:right">${c.delta}</span>
  </div>`;
});
new Chart(document.getElementById('timeChart'),{type:'bar',data:{
  labels:['9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
  datasets:[{label:'LINE',data:[0,0,1,0,0,0,1,0,0,1,2,4,3,3,2],backgroundColor:'#0D9488',borderRadius:2},{label:'폼',data:[0,1,0,0,1,1,0,1,0,0,1,1,1,0,0],backgroundColor:'#2563EB',borderRadius:2},]},
  options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{stacked:true,grid:{display:false},ticks:{font:{size:9},color:'#9CA3AF'}},y:{stacked:true,display:false,beginAtZero:true}}}
});
const inquiries=[
  {name:'야마다 사오리',init:'야',bg:'#EEEDFE',tc:'#3C3489',proc:'쌍꺼풀',pbc:'#EEEDFE',ptc:'#3C3489',ch:'LINE',chColor:'#0D9488',status:'신규',sbc:'#FEE2E2',stc:'#991B1B',time:'오늘 10:23'},
  {name:'스즈키 미카',init:'스',bg:'#E1F5EE',tc:'#085041',proc:'코 성형',pbc:'#E1F5EE',ptc:'#085041',ch:'LINE',chColor:'#0D9488',status:'상담 중',sbc:'#FEF3C7',stc:'#92400E',time:'오늘 11:14'},
  {name:'다나카 유키',init:'다',bg:'#FAEEDA',tc:'#412402',proc:'첫 방문',pbc:'#FAEEDA',ptc:'#412402',ch:'LINE',chColor:'#0D9488',status:'신규',sbc:'#FEE2E2',stc:'#991B1B',time:'오늘 11:37'},
  {name:'사토 하루카',init:'사',bg:'#E6F1FB',tc:'#0C447C',proc:'윤곽',pbc:'#E6F1FB',ptc:'#0C447C',ch:'상담 폼',chColor:'#2563EB',status:'상담 중',sbc:'#FEF3C7',stc:'#92400E',time:'5/18'},
  {name:'이토 나나미',init:'이',bg:'#FBEAF0',tc:'#4B1528',proc:'쌍꺼풀',pbc:'#EEEDFE',ptc:'#3C3489',ch:'LINE',chColor:'#0D9488',status:'예약 완료',sbc:'#D1FAE5',stc:'#065F46',time:'5/17'},
  {name:'나카무라 리나',init:'나',bg:'#EEEDFE',tc:'#3C3489',proc:'코 성형',pbc:'#E1F5EE',ptc:'#085041',ch:'LINE',chColor:'#0D9488',status:'종료',sbc:'#F3F4F6',stc:'#6B7280',time:'5/15'},
];
let activeFilter='all';
function renderPills(){
  const el=document.getElementById('pills');
  el.innerHTML=[{id:'all',lb:'전체 23'},{id:'LINE',lb:'LINE 12'},{id:'상담 폼',lb:'폼 7'},].map(p=>`<button class="pill${activeFilter===p.id?' on':''}" onclick="setFilter('${p.id}',this)">${p.lb}</button>`).join('');
}
function renderList(){
  const el=document.getElementById('inq-list');
  const fd=activeFilter==='all'?inquiries:inquiries.filter(i=>i.ch===activeFilter);
  el.innerHTML=fd.map(i=>`<a href="hospital_crm_inbox.html" style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#fff;border:1px solid var(--gray-200);border-radius:var(--r);margin-bottom:6px;cursor:pointer;text-decoration:none;color:inherit;transition:all .15s">
    <div style="width:30px;height:30px;border-radius:50%;background:${i.bg};color:${i.tc};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;flex-shrink:0">${i.init}</div>
    <span style="font-size:13px;font-weight:500;color:var(--gray-900);min-width:100px">${i.name}</span>
    <span style="font-size:11px;padding:2px 7px;border-radius:5px;background:${i.pbc};color:${i.ptc}">${i.proc}</span>
    <span style="font-size:11px;padding:2px 7px;border-radius:5px;margin-left:4px;color:${i.chColor}">${i.ch}</span>
    <span style="font-size:10px;padding:2px 7px;border-radius:5px;margin-left:auto;background:${i.sbc};color:${i.stc}">${i.status}</span>
    <span style="font-size:11px;color:var(--gray-400);min-width:60px;text-align:right">${i.time}</span>
  </a>`).join('');
}
function setFilter(f,btn){activeFilter=f;renderPills();renderList();}
renderPills();renderList();
