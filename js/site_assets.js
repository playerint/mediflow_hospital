
const imgData={
  ba:[{lb:'쌍꺼풀 #01',sz:'1.2MB',em:'👁',badge:'badge-ba',isNew:false},{lb:'쌍꺼풀 #02',sz:'980KB',em:'👁',badge:'badge-ba',isNew:false},{lb:'코 성형 #01',sz:'1.4MB',em:'👃',badge:'badge-ba',isNew:false},{lb:'코 성형 #02',sz:'1.1MB',em:'👃',badge:'badge-ba',isNew:false},{lb:'윤곽 #01',sz:'890KB',em:'✨',badge:'badge-ba',isNew:true},{lb:'윤곽 #02',sz:'1.3MB',em:'✨',badge:'badge-ba',isNew:false},{lb:'지방 #01',sz:'750KB',em:'💉',badge:'badge-ba',isNew:false},{lb:'피부 #01',sz:'820KB',em:'🌟',badge:'badge-ba',isNew:true}],
  doctor:[{lb:'김민준 원장',sz:'340KB',em:'👨‍⚕️',badge:'badge-ai',isNew:false},{lb:'이수진 전문의',sz:'290KB',em:'👩‍⚕️',badge:'badge-ai',isNew:false},{lb:'박정호 전문의',sz:'310KB',em:'👨‍⚕️',badge:'badge-ai',isNew:false},{lb:'최유리 전문의',sz:'280KB',em:'👩‍⚕️',badge:'badge-ai',isNew:false},{lb:'정태윤 전문의',sz:'320KB',em:'👨‍⚕️',badge:'badge-ai',isNew:false}],
  facility:[{lb:'상담실 A',sz:'890KB',em:'🛋',badge:'',isNew:false},{lb:'수술실',sz:'1.1MB',em:'🏥',badge:'',isNew:false},{lb:'회복실',sz:'780KB',em:'🛏',badge:'',isNew:false},{lb:'로비',sz:'1.2MB',em:'🏛',badge:'',isNew:true},{lb:'외관',sz:'960KB',em:'🏢',badge:'',isNew:false}],
};
function renderGrid(id,items){
  const el=document.getElementById(id);
  el.innerHTML=items.map((item,i)=>`
    <div class="img-card" onclick="this.classList.toggle('selected')">
      ${item.badge?`<div class="img-badge ${item.badge}">B/A</div>`:''}
      ${item.isNew?`<div class="img-badge badge-new" style="top:${item.badge?'24px':'6px'}">NEW</div>`:''}
      <div class="img-thumb">${item.em}</div>
      <div class="img-actions">
        <button class="img-btn" onclick="event.stopPropagation();alert('${item.lb} 교체')" title="교체">↺</button>
        <button class="img-btn" onclick="event.stopPropagation();alert('${item.lb} 삭제')" title="삭제">✕</button>
      </div>
      <div class="img-meta"><div class="img-name">${item.lb}</div><div class="img-size">${item.sz}</div></div>
    </div>`).join('');
}
renderGrid('ba-grid',imgData.ba);
renderGrid('doctor-grid',imgData.doctor);
renderGrid('facility-grid',imgData.facility);
function toggleGate(cb){
  document.getElementById('gate-status').textContent=cb.checked?'로그인 필요':'공개 중';
  document.getElementById('gate-status').style.color=cb.checked?'var(--amber)':'var(--gray-500)';
}
function handleUpload(input){
  if(!input.files.length)return;
  const z=document.getElementById('drop-zone');
  z.innerHTML=`<div class="uz-icon">🤖</div><div class="uz-title">AI Agent가 ${input.files.length}개 파일 분류 중...</div>`;
  setTimeout(()=>{z.innerHTML=`<div class="uz-icon">✅</div><div class="uz-title">${input.files.length}개 파일 업로드 완료</div>`;
    setTimeout(()=>{z.innerHTML='<div class="uz-icon">📁</div><div class="uz-title">사진을 드래그하거나 클릭하여 업로드</div><div class="uz-sub">PNG, JPG, WebP · 최대 10MB · AI Agent가 자동 분류</div>';},2500);
  },2000);
}
function handleDrop(e){e.preventDefault();document.getElementById('drop-zone').classList.remove('dragging');if(e.dataTransfer.files.length)handleUpload({files:e.dataTransfer.files});}
