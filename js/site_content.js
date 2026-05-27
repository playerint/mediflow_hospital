
const sections={
  hero:{title:'히어로 (메인 비주얼)',ko:'올래성형외과는 강남구에 위치한 종합 성형 전문 병원입니다. 쌍꺼풀, 코 성형, 윤곽 수술 등 다양한 시술을 제공합니다.',ja:'江南に位置するオーレ整形外科は、二重・鼻・輪郭など幅広い美容整形を手掛けるクリニックです。',compliance:null},
  doctors:{title:'의료진 소개',ko:'올래성형외과는 5명의 전문의가 진료합니다. 각 의사는 10년 이상의 경력을 보유합니다.',ja:'オーレ整形外科には5名の専門医が在籍しております。各医師は10年以上の経験を持ちます。',compliance:null},
  treatments:{title:'시술 안내',ko:'다양한 미용 시술을 제공합니다. 눈 성형, 코 성형, 윤곽 수술, 지방흡입 등 합리적인 가격에 받으실 수 있습니다.',ja:'さまざまな美容施術をご提供しております。目元・鼻・輪郭・脂肪吸引など適正価格でご受診いただけます。',compliance:'warn'},
  eye:{title:'눈 성형 상세',ko:'눈 성형은 올래성형외과의 대표 시술입니다. 매몰법과 절개법으로 자연스러운 눈매를 만들어 드립니다.',ja:'目元整形はオーレ整形外科の得意とする施術です。埋没法・切開法で自然な目元に仕上げます。',compliance:'error'},
  nose:{title:'코 성형 상세',ko:'코 성형은 얼굴의 균형을 잡아주는 중요한 시술입니다. 다양한 방법으로 원하시는 코 모양을 완성해 드립니다.',ja:'鼻整形は顔全体のバランスを整える大切な施術です。様々な方法でご希望の鼻の形に仕上げます。',compliance:null},
  faq:{title:'FAQ',ko:'Q: 카운슬링은 무료인가요? A: 네, 무료입니다. Q: 일본어 통역이 있나요? A: 네, 전담 스탭이 상주합니다.',ja:'Q: カウンセリングは無料ですか？A: はい、無料です。Q: 日本語通訳はいますか？A: はい、専属スタッフが常駐しております。',compliance:null},
  access:{title:'오시는 길',ko:'서울시 강남구 역삼동 위치. 강남역 3번 출구에서 도보 5분.',ja:'ソウル市江南区に位置。江南駅3番出口より徒歩5分。',compliance:null},
};
let curSec='hero';
function selectSection(key,el){
  document.querySelectorAll('.section-item').forEach(i=>i.classList.remove('active'));
  el.classList.add('active');
  curSec=key;
  const s=sections[key];
  document.getElementById('ep-title').textContent=s.title;
  document.getElementById('ko-text').textContent=s.ko;
  document.getElementById('ja-text').value=s.ja;
  showCompliance(s.compliance);
  document.getElementById('save-info').textContent='마지막 저장: 오늘 14:23';
}
function showCompliance(type){
  const area=document.getElementById('compliance-area');
  if(!type){area.innerHTML='';return;}
  if(type==='error') area.innerHTML='<div class="compliance-banner cb-warn"><span>⚠</span><div><strong>컴플라이언스 위반 감지</strong><br>「絶対に自然」— 효과 단정 표현. 대안: 「より自然な仕上がりを目指して」</div></div>';
  else area.innerHTML='<div class="compliance-banner" style="background:#FEF3C7;border:1px solid #FCD34D;color:#92400E"><span>⚡</span><div><strong>회색지대 — 검토 필요</strong><br>「합리적인 가격」표현 검토 후 승인하세요.</div></div>';
}
function rewriteAI(){
  const btn=event.target;btn.textContent='✨ 재집필 중...';btn.disabled=true;
  setTimeout(()=>{
    const ta=document.getElementById('ja-text');ta.style.background='#F0FDF4';ta.style.borderColor='#6EE7B7';
    setTimeout(()=>{ta.style.background='';ta.style.borderColor='';btn.textContent='✨ AI 재집필';btn.disabled=false;
    document.getElementById('compliance-area').innerHTML='<div class="compliance-banner cb-ai"><span>✨</span><strong>AI 재집필 완료</strong> — 컴플라이언스 검사 통과</div>';},1000);
  },1800);
}
function checkComp(){
  document.getElementById('compliance-area').innerHTML='<div class="compliance-banner" style="background:#EDE9FE;border:1px solid #C4B5FD;color:#4C1D95"><span>🔍</span> 검사 중...</div>';
  setTimeout(()=>{document.getElementById('compliance-area').innerHTML='<div class="compliance-banner cb-ok"><span>✓</span><strong>컴플라이언스 통과</strong> — 위반 표현 없음.</div>';},1500);
}
function saveSection(){
  const now=new Date();
  document.getElementById('save-info').textContent='마지막 저장: 오늘 '+now.getHours()+':'+String(now.getMinutes()).padStart(2,'0');
  document.getElementById('compliance-area').innerHTML='<div class="compliance-banner cb-ok"><span>✓</span> 저장되었습니다.</div>';
  setTimeout(()=>document.getElementById('compliance-area').innerHTML='',2000);
}
showCompliance(null);
