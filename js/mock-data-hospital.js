/* ================================================================
   mock-data-hospital.js — 병원 관리자 목 데이터
   TODO: 실제 크롤링/번역 API 연동 시 각 섹션 변수를 API 응답으로 교체
   - MOCK_LANG_OPTIONS     : 지원 언어 목록
   - MOCK_SEC_*            : 섹션별 데이터 (01~10)
   - MOCK_SITE_META        : 병원 기본 정보
================================================================ */

/* ── 언어 옵션 ───────────────────────────────────────────────── */
var MOCK_LANG_OPTIONS = [
  { code:'ja',    label:'日本語',    flag:'🇯🇵', name:'일본어'       },
  { code:'en',    label:'English',   flag:'🇺🇸', name:'영어'         },
  { code:'th',    label:'ภาษาไทย', flag:'🇹🇭', name:'태국어'       },
  { code:'zh-CN', label:'简体中文',  flag:'🇨🇳', name:'중국어 간체'  },
  { code:'zh-TW', label:'繁體中文',  flag:'🇹🇼', name:'중국어 번체'  },
];

var MOCK_CURRENT_LANG = 'ja';

/* ── 상태 상수 ───────────────────────────────────────────────── */
var SEC_STATUS = {
  COLLECTED: 'collected', // 수집됨 (크롤링으로 가져옴)
  AI_GEN:    'ai_gen',    // AI 생성 (LLM이 작성)
  NO_IMAGE:  'no_image',  // 이미지 없음 (관리자 등록 필요)
  DONE:      'done',      // 완료
  PENDING:   'pending',   // 검수 대기
};

var TRANS_STATUS = {
  NONE:   'none',   // 미번역
  AI:     'ai',     // AI 의역
  REVIEW: 'review', // 검수 대기
  DONE:   'done',   // 검수 완료
};

/* ── 헬퍼: 번역 필드 생성 ────────────────────────────────────── */
function mkTF(ko, translated, ts) {
  var langs = {};
  ['ja','en','zh-CN','zh-TW','th'].forEach(function(c){
    langs[c] = c === 'ja'
      ? {text: translated||'', ts: ts||TRANS_STATUS.NONE}
      : {text:'', ts: TRANS_STATUS.NONE};
  });
  return {ko: ko, translations: langs};
}

/* ── 병원 기본 정보 ──────────────────────────────────────────── */
var MOCK_SITE_META = {
  name:     '올래성형외과',
  nameJa:   'オーレ整形外科',
  domain:   'jp.oleps.co.kr',
  sourceUrl:'https://www.oleps.co.kr',
};

/* ── 01. Hero ────────────────────────────────────────────────── */
var MOCK_SEC_HERO = {
  status: SEC_STATUS.COLLECTED,
  image: { hasImage: false, src: null, label: '원장 대표 이미지' },
  headline:    mkTF('「변했네」가 아니라 「예뻐졌네」 소리를 듣는 수술을.', '「変わったね」ではなく「綺麗になったね」と言われる手術を。', TRANS_STATUS.DONE),
  subtext:     mkTF('올래성형외과 대표원장 김현준은 20년간 자연스러운 아름다움을 추구해왔습니다.', 'オーレ整形外科 院長 キム・ヒョンジュンは、20年間自然な美しさを追求し続けています。', TRANS_STATUS.DONE),
  lineBtn:     mkTF('LINE으로 무료 상담 (15분)', 'LINEで無料相談（15分）', TRANS_STATUS.DONE),
  decisionBtn: mkTF('불안 요소로 시술 찾기', '不安から選ぶ', TRANS_STATUS.DONE),
};

/* ── 02. DECISION GUIDE ─────────────────────────────────────── */
var MOCK_SEC_DECISION = {
  status: SEC_STATUS.AI_GEN,
  items: [
    { id:1, anxiety: mkTF('눈이 작아 보여서 자신감이 없어요', '目が小さく見えて自信が持てない', TRANS_STATUS.DONE),   doctorId:1 },
    { id:2, anxiety: mkTF('코가 낮아서 얼굴이 평평해 보여요', '鼻が低くて顔が平たく見える', TRANS_STATUS.DONE),          doctorId:2 },
    { id:3, anxiety: mkTF('얼굴이 커 보여서 작은 얼굴을 원해요', '顔が大きく見えて小顔になりたい', TRANS_STATUS.DONE),  doctorId:3 },
    { id:4, anxiety: mkTF('피부 트러블이 지속되어 고민이에요', '肌のトラブルが続いて悩んでいる', TRANS_STATUS.AI),        doctorId:4 },
    { id:5, anxiety: mkTF('나이가 들어 보여서 젊어 보이고 싶어요', '老けて見えるので若々しくなりたい', TRANS_STATUS.AI), doctorId:5 },
    { id:6, anxiety: mkTF('눈 아래 다크서클이 심해 피곤해 보여요', 'クマがひどくて疲れて見える', TRANS_STATUS.REVIEW),    doctorId:1 },
    { id:7, anxiety: mkTF('가슴 콤플렉스가 심해 자신감이 없어요', '', TRANS_STATUS.NONE),                               doctorId:2 },
    { id:8, anxiety: mkTF('수술 흉터나 여드름 흉터가 남아있어요', '', TRANS_STATUS.NONE),                               doctorId:4 },
  ],
};

/* ── 03. 의사 소개 ───────────────────────────────────────────── */
var MOCK_SEC_DOCTORS = {
  status: SEC_STATUS.DONE,
  sectionVisible: true,
  items: [
    {
      id:1, image:null, order:1,
      name:   mkTF('김현준',            'キム・ヒョンジュン',                          TRANS_STATUS.DONE),
      title:  mkTF('대표원장',           '代表院長',                                   TRANS_STATUS.DONE),
      career: mkTF('20년 경력 · 서울대 의대', '20年のキャリア · ソウル大学医学部出身', TRANS_STATUS.DONE),
      desc:   mkTF('자연스러운 눈·코 성형 전문. 8,000건 이상 시술 경험.', '自然な目元・鼻整形のスペシャリスト。8,000件以上の施術経験。', TRANS_STATUS.DONE),
      tags:   ['쌍꺼풀', '코 성형', '안면윤곽'],
    },
    {
      id:2, image:null, order:2,
      name:   mkTF('이수진',              'イ・スジン',                              TRANS_STATUS.DONE),
      title:  mkTF('전문의',              '専門医',                                  TRANS_STATUS.DONE),
      career: mkTF('윤곽 수술·지방흡입 전문', '輪郭手術・脂肪吸引専門',              TRANS_STATUS.DONE),
      desc:   mkTF('안면윤곽 및 지방흡입 분야 전문의.',  '顔の輪郭形成・脂肪吸引のスペシャリスト。', TRANS_STATUS.AI),
      tags:   ['윤곽', '지방흡입'],
    },
  ],
};

/* ── 04. 시술 메뉴 ───────────────────────────────────────────── */
var MOCK_SEC_TREATMENTS = {
  status: SEC_STATUS.DONE,
  items: [
    {
      id:'eye', icon:'👁', image:null, hasAiImage:true,
      name:   mkTF('눈 성형',    '目元整形',             TRANS_STATUS.DONE),
      brief:  mkTF('매몰법 ₩400,000~ / 절개법 ₩800,000~', '埋没法 ₩400,000〜 / 切開法 ₩800,000〜', TRANS_STATUS.DONE),
      detail: mkTF('매몰법: 절개 없이 실로 고정, 다운타임 1~3일, 자연스러운 결과.\n절개법: 영구적 효과, 다운타임 7~14일.', '埋没法：切開なし、ダウンタイム1〜3日。\n切開法：永続的な効果、ダウンタイム7〜14日。', TRANS_STATUS.DONE),
    },
    {
      id:'nose', icon:'👃', image:null, hasAiImage:true,
      name:   mkTF('코 성형',    '鼻整形',               TRANS_STATUS.DONE),
      brief:  mkTF('코 필러 ₩300,000~ / 코 수술 ₩2,500,000~', '鼻フィラー ₩300,000〜 / 鼻手術 ₩2,500,000〜', TRANS_STATUS.DONE),
      detail: mkTF('코 필러: 비수술, 효과 6~12개월.\n코 수술: 실리콘 보형물, 반영구적 효과.', '鼻フィラー：非手術、効果6〜12ヶ月。\n鼻手術：シリコンプロテーゼ使用、半永久的な効果。', TRANS_STATUS.AI),
    },
    {
      id:'contour', icon:'✨', image:null, hasAiImage:true,
      name:   mkTF('윤곽 수술',  '輪郭手術',             TRANS_STATUS.DONE),
      brief:  mkTF('에라보톡스 ₩200,000~ / 광대축소 ₩3,000,000~', 'エラボトックス ₩200,000〜 / 頬骨縮小 ₩3,000,000〜', TRANS_STATUS.DONE),
      detail: mkTF('에라보톡스: 비수술, 다운타임 없음.\n광대축소: 수술, 다운타임 10~14일.', 'エラボトックス：非手術、ダウンタイムなし。\n頬骨縮小：手術、ダウンタイム10〜14日。', TRANS_STATUS.NONE),
    },
    {
      id:'skin', icon:'🌟', image:null, hasAiImage:true,
      name:   mkTF('피부 레이저', '肌レーザー',           TRANS_STATUS.DONE),
      brief:  mkTF('토닝 ₩80,000~/회 / 프락셀 ₩200,000~/회', 'トーニング ₩80,000〜/回 / フラクセル ₩200,000〜/回', TRANS_STATUS.DONE),
      detail: mkTF('토닝: 멜라닌 억제, 다운타임 없음.\n프락셀: 피부 재생, 다운타임 3~5일.', 'トーニング：メラニン抑制、ダウンタイムなし。\nフラクセル：皮膚再生、ダウンタイム3〜5日。', TRANS_STATUS.NONE),
    },
  ],
};

/* ── 05. REAL CASES ─────────────────────────────────────────── */
var MOCK_SEC_CASES = {
  status: SEC_STATUS.NO_IMAGE,
  // TODO: AI 생성 금지 — 이미지는 관리자가 직접 업로드해야 함
  items: [
    { id:1, image:null, category:'눈 성형', desc: mkTF('매몰법 · 20대 여성 · 다운타임 2일',       '埋没法 · 20代女性 · ダウンタイム2日',           TRANS_STATUS.AI) },
    { id:2, image:null, category:'코 성형', desc: mkTF('코 필러 · 30대 여성 · 당일 복귀',          '鼻フィラー · 30代女性 · 当日帰宅可',            TRANS_STATUS.AI) },
    { id:3, image:null, category:'윤곽',    desc: mkTF('에라보톡스 · 20대 여성 · 4주 후 효과',     'エラボトックス · 20代女性 · 4週間後に効果',     TRANS_STATUS.AI) },
  ],
};

/* ── 06. REAL REVIEWS ───────────────────────────────────────── */
var MOCK_SEC_REVIEWS = {
  status: SEC_STATUS.NO_IMAGE,
  // TODO: AI 생성 금지 — 이미지는 관리자가 직접 업로드해야 함
  items: [
    { id:1, image:null, rating:5, from:'도쿄 · 30대 여성',   text: mkTF('"일본어로 처음부터 끝까지 안내해주셔서 불안 없이 수술받았습니다."', '「最初から最後まで日本語で丁寧に案内してくださり、不安なく手術を受けられました。」', TRANS_STATUS.AI) },
    { id:2, image:null, rating:5, from:'오사카 · 20대 여성', text: mkTF('"카운슬링부터 귀국 후 사후관리까지 완벽했습니다."',           '「カウンセリングから帰国後のアフターケアまで、完璧な対応でした。」',                 TRANS_STATUS.AI) },
    { id:3, image:null, rating:4, from:'나고야 · 20대 여성', text: mkTF('"결과는 만족스럽지만 붓기가 예상보다 길었어요."',              '「結果には満足していますが、腫れが思ったより長引きました。」',                         TRANS_STATUS.AI) },
  ],
};

/* ── 07. FAQ ─────────────────────────────────────────────────── */
var MOCK_SEC_FAQ = {
  status: SEC_STATUS.AI_GEN,
  items: [
    { id:1, order:1, q: mkTF('카운슬링은 무료인가요?',                              'カウンセリングは無料ですか？',                             TRANS_STATUS.DONE),
                     a: mkTF('네, 무료입니다.',                                      'はい、無料です。',                                         TRANS_STATUS.DONE) },
    { id:2, order:2, q: mkTF('일본어 통역이 있나요?',                               '日本語通訳はいますか？',                                   TRANS_STATUS.DONE),
                     a: mkTF('네, 전담 코디네이터가 상주합니다.',                     'はい、専任コーディネーターが常駐しております。',             TRANS_STATUS.DONE) },
    { id:3, order:3, q: mkTF('수술 후 귀국해도 사후관리가 되나요?',                 '術後帰国してもアフターケアはできますか？',                  TRANS_STATUS.DONE),
                     a: mkTF('네, 귀국 후 3개월간 LINE으로 사후관리를 제공합니다.',  'はい、帰国後3ヶ月間LINEにてアフターケアをご提供しています。', TRANS_STATUS.AI) },
    { id:4, order:4, q: mkTF('수술 전 검사가 필요한가요?',                          '手術前に検査は必要ですか？',                               TRANS_STATUS.AI),
                     a: mkTF('네, 수술 당일 기본 혈액 검사가 진행됩니다.',           '', TRANS_STATUS.NONE) },
    { id:5, order:5, q: mkTF('공항 픽업 서비스가 있나요?',                          '空港送迎サービスはありますか？',                           TRANS_STATUS.AI),
                     a: mkTF('네, MEDIFLOW 공항 픽업 서비스를 이용하실 수 있습니다.',   '', TRANS_STATUS.NONE) },
  ],
};

/* ── 08. 서비스 보장 ────────────────────────────────────────── */
var MOCK_SEC_GUARANTEE = {
  status: SEC_STATUS.DONE,
  items: [
    { id:1, icon:'💬', visible:true, title: mkTF('무료 상담',    '無料カウンセリング',        TRANS_STATUS.DONE), desc: mkTF('LINE 또는 화상으로 15분 무료 상담', 'LINEまたはビデオで15分無料相談', TRANS_STATUS.DONE) },
    { id:2, icon:'✈',  visible:true, title: mkTF('공항 픽업',    '空港送迎',                 TRANS_STATUS.DONE), desc: mkTF('인천·김포 공항 픽업 서비스 제공', '仁川・金浦空港の送迎サービス',   TRANS_STATUS.DONE) },
    { id:3, icon:'🗣',  visible:true, title: mkTF('일본어 통역',  '日本語通訳',               TRANS_STATUS.DONE), desc: mkTF('일본어 전담 스탭 상주',           '日本語専任スタッフ常駐',         TRANS_STATUS.DONE) },
    { id:4, icon:'🏥', visible:true, title: mkTF('귀국 후 케어', '帰国後ケア',               TRANS_STATUS.DONE), desc: mkTF('귀국 후 3개월 화상 상담 제공',   '帰国後3ヶ月のビデオ相談',        TRANS_STATUS.DONE) },
  ],
};

/* ── 09. 무료 상담 시작 ─────────────────────────────────────── */
var MOCK_SEC_CONSULT = {
  status: SEC_STATUS.DONE,
  // TODO: LINE 프리필 — https://line.me/ti/p/~{OAid}?text={encoded} 방식으로
  //       선택한 불안 요소 + 추천 의사 정보를 URL 인코딩하여 전달 가능.
  //       OA ID 등록 필요. 현재는 더미 OA ID 사용.
  channels: [
    { id:'line',      icon:'💚', name:'LINE',      active:true,  link:'https://line.me/ti/p/~@oleps',       lineOAId:'@oleps' },
    { id:'instagram', icon:'🟣', name:'Instagram', active:true,  link:'https://instagram.com/oleps_ps',     lineOAId:null },
    { id:'MEDIFLOW',     icon:'🩷', name:'IPPEO',       active:true,  link:'https://ippeo.io/oleps',             lineOAId:null,
      popupMsg:'화상 상담 전용 앱 설치가 필요합니다. 이동하시겠어요?' },
  ],
};

/* ── 10. 푸터 ────────────────────────────────────────────────── */
var MOCK_SEC_FOOTER = {
  status: SEC_STATUS.DONE,
  sns: [
    { id:'line',      icon:'💚', name:'LINE',      active:true,  link:'https://line.me/ti/p/~@oleps' },
    { id:'instagram', icon:'🟣', name:'Instagram', active:true,  link:'https://instagram.com/oleps_ps' },
    { id:'youtube',   icon:'🔴', name:'YouTube',   active:false, link:'' },
    { id:'kakao',     icon:'🟡', name:'KakaoTalk', active:false, link:'' },
  ],
  sitemap: [
    { col:1, links:['시술 안내', '눈 성형', '코 성형', '윤곽 수술', '피부 레이저'] },
    { col:2, links:['클리닉 소개', '의사 소개', '시설 안내', '오시는 길'] },
  ],
  // 법적 정보: 꼭 필요한 2개만 노출
  // → 의료 서비스 특성상 "개인정보처리방침"(필수)과 "의료광고 준수 안내"(일본 규정 대응)가 가장 중요.
  //   이용약관/쿠키정책은 선택으로 비노출 처리.
  legal: [
    { id:'privacy',    title:'개인정보처리방침',   active:true,  content:'개인정보처리방침 내용...' },
    { id:'medical_ad', title:'의료광고 준수 안내', active:true,  content:'의료광고 준수 안내 내용...' },
    { id:'terms',      title:'이용약관',           active:false, content:'이용약관 내용...' },
    { id:'cookie',     title:'쿠키 정책',          active:false, content:'쿠키 정책 내용...' },
  ],
};
