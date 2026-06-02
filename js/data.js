/* ================================================================
   data.js — MEDIFLOW 데모 데이터
   Next.js 전환 시 이 파일의 각 변수를 API 응답으로 교체하면 됩니다.
   patients   → GET /api/patients
   COACHING_DATA → GET /api/coaching
   MANUAL_DATA   → GET /api/manual
================================================================ */

var patients = [
  {id:0, name:'야마다 사오리', nameJa:'山田 沙織', init:'야마', bg:'#EEEDFE', tc:'#3C3489',
   proc:'쌍꺼풀', ch:'LINE', chColor:'#2563EB', status:'new', statusLabel:'신규', elapsed:'2시간', unread:true,
   msgs:[
     {from:'patient', ja:'はじめまして！二重整形について聞きたいのですが、カウンセリングは無料ですか？', ko:'안녕하세요! 쌍꺼풀 성형에 대해 궁금한데요, 상담은 무료인가요?', time:'10:23'},
     {from:'ai',      ja:'はじめまして！カウンセリングは無料です。埋没法は₩400,000〜が目安です。', ko:'안녕하세요! 상담은 무료입니다. 매몰법은 ₩400,000~이 기준입니다.', time:'10:23 (AI はな)'},
   ]},

  {id:1, name:'스즈키 미카', nameJa:'鈴木 美花', init:'스즈', bg:'#E1F5EE', tc:'#085041',
   proc:'코 성형', ch:'LINE', chColor:'#2563EB', status:'new', statusLabel:'신규', elapsed:'1시간', unread:true,
   msgs:[
     {from:'patient', ja:'鼻のプチ整形を考えています。ダウンタイムはどのくらいですか？', ko:'코 프티 성형을 고려 중입니다. 다운타임은 어느 정도인가요?', time:'11:14'},
   ]},

  {id:2, name:'다나카 유키', nameJa:'田中 雪', init:'다나', bg:'#FAEEDA', tc:'#412402',
   proc:'첫 방문', ch:'LINE', chColor:'#2563EB', status:'new', statusLabel:'신규', elapsed:'40분', unread:true,
   msgs:[
     {from:'patient', ja:'韓国の病院は初めてで不安です。日本語対応はしていますか？', ko:'한국 병원은 처음이라 걱정됩니다. 일본어 대응이 되나요?', time:'11:37'},
   ]},

  {id:3, name:'사토 하루카', nameJa:'佐藤 春花', init:'사토', bg:'#E6F1FB', tc:'#0C447C',
   proc:'윤곽', ch:'LINE', chColor:'#2563EB', status:'consulting', statusLabel:'상담중', elapsed:'', unread:false,
   msgs:[
     {from:'patient', ja:'輪郭整形に興味があります。', ko:'윤곽 성형에 관심이 있습니다.', time:'5/18'},
     {from:'staff',   ja:'当院では顎骨切り・頬骨縮小・エラボトックスなどをご提供しております。', ko:'저희 병원에서는 턱뼈절제·광대축소·에라보톡스 등을 제공하고 있습니다.', time:'5/18', lang:'ja'},
   ]},

  {id:4, name:'이토 나나미', nameJa:'伊藤 七海', init:'이토', bg:'#FBEAF0', tc:'#4B1528',
   proc:'쌍꺼풀', ch:'LINE', chColor:'#2563EB', status:'booked', statusLabel:'예약완료', elapsed:'', unread:false,
   msgs:[
     {from:'patient', ja:'二重整形を予約したいです。', ko:'쌍꺼풀 성형을 예약하고 싶습니다.', time:'5/17'},
     {from:'staff',   ja:'6月5日14:00はいかがでしょうか？', ko:'6월 5일 14:00은 어떠신가요?', time:'5/17', lang:'ja'},
     {from:'ai',      ja:'【予約確認】6月5日(金) 14:00 二重整形カウンセリング。', ko:'[예약 확인] 6월 5일(금) 14:00 쌍꺼풀 성형 상담.', time:'5/17 (AI はな)'},
   ]},

  {id:5, name:'나카무라 리나', nameJa:'中村 里奈', init:'나카', bg:'#EEEDFE', tc:'#3C3489',
   proc:'코 성형', ch:'LINE', chColor:'#2563EB', status:'closed', statusLabel:'종료', elapsed:'', unread:false,
   msgs:[
     {from:'patient', ja:'鼻整形で内院しました。ありがとうございました！', ko:'코 성형으로 내원했습니다. 감사했습니다!', time:'5/10'},
   ]},

  {id:6, name:'하야시 유이', nameJa:'林 結衣', init:'하야', bg:'#FCE7F3', tc:'#9D174D',
   proc:'쌍꺼풀', ch:'Instagram', chColor:'#E1306C', status:'new', statusLabel:'신규', elapsed:'30분', unread:true,
   msgs:[
     {from:'patient', ja:'インスタのビフォーアフターを見て気になりました！二重整形の料金を教えてください😊', ko:'인스타 B/A 보고 궁금해졌어요! 쌍꺼풀 가격 알려주세요😊', time:'오늘 14:52'},
     {from:'ai',      ja:'ご連絡ありがとうございます🌸 埋没法は₩400,000〜、切開法は₩800,000〜となります。無料カウンセリングもございます！', ko:'연락 주셔서 감사합니다🌸 매몰법 ₩400,000~, 절개법 ₩800,000~ 입니다. 무료 상담도 있어요!', time:'오늘 14:52'},
   ]},

  {id:7, name:'오가와 사키', nameJa:'小川 咲', init:'오가', bg:'#FDF4FF', tc:'#7E22CE',
   proc:'코 필러', ch:'Instagram', chColor:'#E1306C', status:'consulting', statusLabel:'상담중', elapsed:null, unread:false,
   msgs:[
     {from:'patient', ja:'鼻のフィラーに興味があります。ダウンタイムはどのくらいですか？', ko:'코 필러에 관심 있어요. 다운타임이 얼마나 돼요?', time:'어제 20:11'},
     {from:'ai',      ja:'鼻フィラーのダウンタイムは1〜3日程度です。お仕事されながらでも施術可能ですよ！', ko:'코 필러 다운타임은 1~3일 정도예요. 출근하면서 시술 가능해요!', time:'어제 20:12'},
   ]},

  {id:8, name:'마츠이 노노카', nameJa:'松井 乃々花', init:'마츠', bg:'#FFF7ED', tc:'#C2410C',
   proc:'윤곽', ch:'Instagram', chColor:'#E1306C', status:'booked', statusLabel:'예약완료', elapsed:null, unread:false,
   msgs:[
     {from:'patient', ja:'輪郭整形について詳しく教えてもらえますか？', ko:'윤곽 성형에 대해 자세히 알려주세요.', time:'5/20 19:44'},
     {from:'ai',      ja:'輪郭整形には小顔手術、エラ削り、顎形成などがあります。', ko:'윤곽 성형에는 소안면, 광대축소, 턱 성형 등이 있어요.', time:'5/20 19:45'},
     {from:'patient', ja:'カウンセリング予約したいです！', ko:'상담 예약하고 싶어요!', time:'5/20 20:01'},
     {from:'ai',      ja:'6月3日(火)14:00はいかがでしょうか？', ko:'6월 3일(화) 14:00 어떠세요?', time:'5/20 20:02'},
   ]},

  {id:9, name:'왕 메이링', nameJa:'王 美玲', init:'왕', bg:'#FEF2F2', tc:'#991B1B',
   proc:'쌍꺼풀', ch:'Instagram', chColor:'#E1306C', status:'new', statusLabel:'신규', elapsed:'1시간', unread:true,
   msgs:[
     {from:'patient', ja:'你好！我在网上看到了双眼皮手术的信息，请问咨询是免费的吗？', ko:'안녕하세요! 쌍꺼풀 상담은 무료인가요?', time:'오늘 13:20'},
     {from:'ai',      ja:'您好！咨询是免费的🌸 埋没法₩400,000起，切开法₩800,000起。', ko:'안녕하세요! 상담 무료🌸 매몰법 ₩400,000~, 절개법 ₩800,000~.', time:'오늘 13:20'},
   ]},

  {id:10, name:'천 샤오후이', nameJa:'陳 曉慧', init:'천', bg:'#F0FDF4', tc:'#166534',
   proc:'코 성형', ch:'LINE', chColor:'#2563EB', status:'consulting', statusLabel:'상담중', elapsed:null, unread:false,
   msgs:[
     {from:'patient', ja:'你好，我想詢問鼻子整形，恢復期大概多久？', ko:'코 성형 회복 기간이 얼마나 걸리나요?', time:'어제 16:45'},
     {from:'ai',      ja:'您好！恢復期填充1〜3天，手術7〜14天。提供免費諮詢！', ko:'코 필러 1~3일, 수술 7~14일. 무료 상담 가능!', time:'어제 16:46'},
   ]},

  {id:11, name:'에밀리 박', nameJa:'Emily Park', init:'EM', bg:'#EFF6FF', tc:'#1D4ED8',
   proc:'피부레이저', ch:'Instagram', chColor:'#E1306C', status:'new', statusLabel:'신규', elapsed:'45분', unread:true,
   msgs:[
     {from:'patient', ja:"Hi! I'm interested in skin laser. Do you have English-speaking staff?", ko:'피부 레이저 관심있어요. 영어 가능한 스탭 계신가요?', time:'오늘 14:10'},
     {from:'ai',      ja:"Hello! Yes, we have English coordinators! Free consultation available!", ko:'네, 영어 코디네이터 있어요! 무료 상담 예약 가능해요!', time:'오늘 14:10'},
   ]},

  {id:12, name:'나파폰 씨리', nameJa:'นภาพร ศิริ', init:'나파', bg:'#FFF7ED', tc:'#9A3412',
   proc:'윤곽', ch:'LINE', chColor:'#2563EB', status:'consulting', statusLabel:'상담중', elapsed:null, unread:false,
   msgs:[
     {from:'patient', ja:'สวัสดีค่ะ สนใจเรื่องการศัลยกรรมกรอบหน้า ราคาเท่าไหร่คะ', ko:'윤곽 성형 가격이 얼마인가요?', time:'어제 19:30'},
     {from:'ai',      ja:'สวัสดีค่ะ การปรึกษาฟรี! ราคาเริ่มต้น 3,000,000 วอน', ko:'안녕하세요! 상담 무료! ₩3,000,000~입니다.', time:'어제 19:31'},
   ]},
];

/* ── AI 추천 답변 데이터 ──────────────────────────────────────────
   Next.js 전환 시 → GET /api/coaching?proc={proc}
──────────────────────────────────────────────────────────────── */
var COACHING_DATA = {
  '쌍꺼풀': [
    {tone:'친절', toneBg:'#D1FAE5', toneTc:'#065F46',
     ko:'상담은 무료예요! 매몰법 ₩400,000~, 절개법 ₩800,000~입니다.',
     ja:'カウンセリングは無料です! 埋没法は₩400,000~、切開法は₩800,000~です。'},
    {tone:'전문적', toneBg:'#EEF2FF', toneTc:'#0D1B3E',
     ko:'상담은 무료로 진행합니다. 매몰법과 절개법을 눈 상태에 따라 안내드립니다.',
     ja:'カウンセリングは無料です。埋没法と切開法を目の状態に応じてご提案します。'},
    {tone:'간결', toneBg:'#F3F4F6', toneTc:'#374151',
     ko:'상담 무료. 매몰법 ₩400,000~, 절개법 ₩800,000~.',
     ja:'カウンセリング無料。埋没法₩400,000~、切開法₩800,000~。'},
  ],
  '코 성형': [
    {tone:'친절', toneBg:'#D1FAE5', toneTc:'#065F46',
     ko:'코 필러 다운타임은 1~3일 정도예요! 출근하면서도 시술 가능해요!',
     ja:'鼻フィラーのダウンタイムは1~3日程度です！お仕事しながら施術できますよ！'},
    {tone:'전문적', toneBg:'#EEF2FF', toneTc:'#0D1B3E',
     ko:'히알루론산 코 필러는 다운타임 1~3일, 효과 6~12개월 지속됩니다.',
     ja:'ヒアルロン酸鼻フィラーはダウンタイム1~3日、効果6~12ヶ月持続します。'},
    {tone:'간결', toneBg:'#F3F4F6', toneTc:'#374151',
     ko:'다운타임 1~3일. 효과 6~12개월. 무료 상담 예약 가능.',
     ja:'ダウンタイム1~3日。効果6~12ヶ月。無料カウンセリング予約可能。'},
  ],
  'default': [
    {tone:'친절', toneBg:'#D1FAE5', toneTc:'#065F46',
     ko:'어떤 시술이든 편하게 상담해 주세요! 무료 상담 진행 중입니다.',
     ja:'どんな施術でもお気軽にご相談ください！無料カウンセリングございます。'},
    {tone:'전문적', toneBg:'#EEF2FF', toneTc:'#0D1B3E',
     ko:'관심 시술을 알려주시면 자세한 안내를 드리겠습니다.',
     ja:'ご関心の施術をお知らせいただければ詳しくご案内します。'},
    {tone:'간결', toneBg:'#F3F4F6', toneTc:'#374151',
     ko:'무료 상담 예약 가능합니다.',
     ja:'無料カウンセリング予約可能です。'},
  ],
};

/* ── 시술 매뉴얼 데이터 ──────────────────────────────────────────
   Next.js 전환 시 → GET /api/manual?proc={proc}
──────────────────────────────────────────────────────────────── */
var MANUAL_DATA = {
  '쌍꺼풀': [
    {title:'매몰법', badge:'비절개', bg:'#D1FAE5', tc:'#065F46',
     body:'절개 없이 실로 고정. 다운타임 1~3일. ₩400,000~'},
    {title:'절개법', badge:'영구적', bg:'#EEF2FF', tc:'#0D1B3E',
     body:'피부 절개 후 지방·근육 조정. 다운타임 7~14일. ₩800,000~'},
    {title:'컴플라이언스', badge:'⚠ 주의', bg:'#FEF2F2', tc:'#991B1B',
     body:'효과 보장 표현 금지. 회복 기간 개인차 명시.'},
  ],
  '코 성형': [
    {title:'코 필러', badge:'비수술', bg:'#D1FAE5', tc:'#065F46',
     body:'히알루론산 주입. 다운타임 1~3일. 효과 6~12개월. ₩300,000~'},
    {title:'코 수술', badge:'수술', bg:'#EEF2FF', tc:'#0D1B3E',
     body:'실리콘 보형물. 반영구. 다운타임 7~14일. ₩2,500,000~'},
    {title:'컴플라이언스', badge:'⚠ 주의', bg:'#FEF2F2', tc:'#991B1B',
     body:'수술 결과 보장 표현 금지. 부작용 안내 필수.'},
  ],
  '코 필러': [
    {title:'코 필러', badge:'비수술', bg:'#D1FAE5', tc:'#065F46',
     body:'히알루론산 주입으로 코 높이·라인 개선. 다운타임 1~3일. 효과 6~12개월. ₩300,000~'},
    {title:'유지 관리', badge:'정기', bg:'#EEF2FF', tc:'#0D1B3E',
     body:'6~12개월 후 재시술 권장. 이전 시술 흡수 후 진행.'},
    {title:'컴플라이언스', badge:'⚠ 주의', bg:'#FEF2F2', tc:'#991B1B',
     body:'결과 보장 표현 금지. 개인 흡수 속도 차이 안내 필수.'},
  ],
  '윤곽': [
    {title:'광대축소', badge:'뼈절제', bg:'#EEF2FF', tc:'#0D1B3E',
     body:'광대뼈 절제 및 축소. 다운타임 3~4주. ₩3,000,000~'},
    {title:'턱끝 성형', badge:'윤곽', bg:'#D1FAE5', tc:'#065F46',
     body:'실리콘 보형물 또는 뼈 절제. 다운타임 2~3주. ₩2,000,000~'},
    {title:'에라보톡스', badge:'비수술', bg:'#F3F4F6', tc:'#374151',
     body:'저작근 보톡스 주입. 4~6개월 효과. ₩200,000~'},
    {title:'컴플라이언스', badge:'⚠ 주의', bg:'#FEF2F2', tc:'#991B1B',
     body:'수술 결과 보장 표현 금지. 붓기 개인차 충분히 안내.'},
  ],
  '피부레이저': [
    {title:'프락셀', badge:'재생레이저', bg:'#D1FAE5', tc:'#065F46',
     body:'피부 재생·잡티 개선. 다운타임 3~7일. 시술 간격 4주. ₩200,000~/1회'},
    {title:'토닝', badge:'유지관리', bg:'#EEF2FF', tc:'#0D1B3E',
     body:'멜라닌 색소 분해·피부 톤 개선. 다운타임 거의 없음. ₩80,000~/1회'},
    {title:'컴플라이언스', badge:'⚠ 주의', bg:'#FEF2F2', tc:'#991B1B',
     body:'시술 후 자외선 차단 필수. 색소 침착 가능성 안내.'},
  ],
  '첫 방문': [
    {title:'무료 카운슬링', badge:'기본', bg:'#D1FAE5', tc:'#065F46',
     body:'모든 시술 전 무료 카운슬링 진행. 담당 의사 직접 상담.'},
    {title:'다국어 지원', badge:'서비스', bg:'#EEF2FF', tc:'#0D1B3E',
     body:'일본어·중국어·영어·태국어 코디네이터 상주. 통역 무료.'},
    {title:'컴플라이언스', badge:'⚠ 주의', bg:'#FEF2F2', tc:'#991B1B',
     body:'효과 보장 표현 금지. 부작용 안내 필수.'},
  ],
  'default': [
    {title:'무료 카운슬링', badge:'기본', bg:'#D1FAE5', tc:'#065F46',
     body:'모든 시술 전 무료 카운슬링 진행. 담당 의사 직접 상담.'},
    {title:'다국어 지원', badge:'서비스', bg:'#EEF2FF', tc:'#0D1B3E',
     body:'일본어·중국어·영어·태국어 코디네이터 상주. 통역 서비스 무료.'},
    {title:'컴플라이언스', badge:'⚠ 주의', bg:'#FEF2F2', tc:'#991B1B',
     body:'효과 보장 표현 금지. 부작용 안내 필수.'},
  ],
};
