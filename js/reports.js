
// 퍼널 전환율
const fcData=[{lbl:'방문',n:1847,color:'#2563EB'},{lbl:'문의',n:23,color:'#6D28D9'},{lbl:'상담',n:18,color:'#0D9488'},{lbl:'예약',n:14,color:'#D97706'},{lbl:'내원',n:14,color:'#DC2626'}];
const fcEl=document.getElementById('fc-cols');
fcData.forEach((f,i)=>{
  const rate=i>0?Math.round(f.n/fcData[i-1].n*100)+'%':'';
  fcEl.innerHTML+=`<div class="fc"><div class="fc-num">${f.n.toLocaleString()}</div><div class="fc-lbl">${f.lbl}</div><div class="fc-bar" style="background:${f.color}"></div><div class="fc-rate">${rate}</div></div>`;
});

// 월별 방문자 추이
new Chart(document.getElementById('trendChart'),{type:'line',
  data:{labels:['1월','2월','3월','4월','5월'],
    datasets:[{label:'방문자',data:[820,950,1100,1490,1847],borderColor:'#0D9488',backgroundColor:'rgba(13,148,136,.08)',fill:true,tension:.4,pointBackgroundColor:'#0D9488',pointRadius:4}]},
  options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:10},color:'#9CA3AF'}},y:{grid:{color:'#F3F4F6'},ticks:{font:{size:10},color:'#9CA3AF'}}}}
});

// SEO 키워드
const kwData=[
  {rank:1,name:'韓国 二重整形',vol:'12.4K',pos:3,delta:'+2',pu:true},
  {rank:2,name:'江南 整形外科',vol:'8.2K',pos:5,delta:'+1',pu:true},
  {rank:3,name:'韓国 鼻整形',vol:'6.8K',pos:7,delta:'0',pu:false},
  {rank:4,name:'ソウル 美容整形',vol:'5.1K',pos:4,delta:'+3',pu:true},
  {rank:5,name:'オーレ整形外科',vol:'2.3K',pos:1,delta:'0',pu:false},
];
const kwEl=document.getElementById('kw-list');
kwData.forEach(k=>{
  kwEl.innerHTML+=`<div class="kw-row"><span class="kw-rank">${k.rank}</span><span class="kw-name">${k.name}</span><span class="kw-vol">${k.vol}</span><span class="kw-pos" style="color:${k.pos<=3?'var(--green)':'var(--gray-700)'}">${k.pos}위</span><span class="kw-delta" style="color:${k.pu?'var(--green)':'var(--gray-400)'}">${k.delta}</span></div>`;
});

// AEO 목록
const aeoData=[{engine:'Perplexity',cnt:9,max:19,color:'#6D28D9',d:'+4'},{engine:'ChatGPT / GPT-4o',cnt:6,max:19,color:'#059669',d:'+2'},{engine:'AI Overviews',cnt:4,max:19,color:'#2563EB',d:'+1'}];
const aeoEl=document.getElementById('aeo-list');
aeoData.forEach(a=>{
  aeoEl.innerHTML+=`<div class="aeo-row"><span class="aeo-engine">${a.engine}</span><div class="aeo-bw"><div class="aeo-bar" style="width:${Math.round(a.cnt/a.max*100)}%;background:${a.color}"></div></div><span class="aeo-cnt">${a.cnt}회</span><span class="aeo-d">${a.d}</span></div>`;
});

// AEO 추이
new Chart(document.getElementById('aeoTrend'),{type:'line',
  data:{labels:['1월','2월','3월','4월','5월'],datasets:[{data:[4,6,9,12,19],borderColor:'#6D28D9',backgroundColor:'rgba(109,40,217,.08)',fill:true,tension:.4,pointBackgroundColor:'#6D28D9',pointRadius:3}]},
  options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:9},color:'#9CA3AF'}},y:{display:false}}}
});

// LINE 자동상담 도넛
new Chart(document.getElementById('lineAuto'),{type:'doughnut',
  data:{labels:['즉시응답','AI 상담','인계'],datasets:[{data:[38,95,9],backgroundColor:['#0D9488','#6D28D9','#F59E0B'],borderWidth:2,borderColor:'#fff'}]},
  options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{font:{size:10},padding:8}}},cutout:'65%'}
});

// 채널별 문의 Bar
new Chart(document.getElementById('channelChart'),{type:'bar',
  data:{labels:['LINE','상담폼','전화'],datasets:[{data:[12,7,4],backgroundColor:['#0D9488','#2563EB','#6D28D9'],borderRadius:6}]},
  options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:11},color:'#9CA3AF'}},y:{display:false,beginAtZero:true}}}
});
