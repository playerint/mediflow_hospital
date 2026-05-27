
function setDevice(dev,btn){
  document.querySelectorAll('.dev-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const pw=document.getElementById('pw');
  document.getElementById('dev-label').textContent=dev==='mobile'?'390 × 844':'1280 × 800';
  pw.style.maxWidth=dev==='mobile'?'390px':'';pw.style.margin=dev==='mobile'?'0 auto':'';
}
function publishSite(btn){
  const orig=btn.innerHTML;btn.innerHTML='⏳ 배포 중...';btn.disabled=true;btn.style.opacity='.7';
  setTimeout(()=>{btn.innerHTML='✅ 게시 완료!';btn.style.background='var(--green)';btn.style.borderColor='var(--green)';
    setTimeout(()=>{btn.innerHTML=orig;btn.disabled=false;btn.style.opacity='';btn.style.background='';btn.style.borderColor='';},2500);
  },3000);
}
