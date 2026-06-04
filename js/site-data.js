/* ================================================================
   site-data.js — 사이트관리 데모 데이터
   Next.js 전환 시 각 변수를 API 응답으로 교체하면 됩니다.
   SITE_SECTIONS → GET /api/site/sections
   SITE_KPI      → GET /api/site/kpi
   SITE_ASSETS   → GET /api/site/assets
   SITE_DEPLOY   → GET /api/site/deploy-status
================================================================ */

/* ── KPI 핵심 수치 ───────────────────────────────────────────────
   배포 사이트 히어로 섹션에 표시되는 핵심 마케팅 수치
   Next.js 전환 시 → GET /api/site/kpi
──────────────────────────────────────────────────────────────── */
var SITE_KPI = {
  totalCases:       '28,000+',
  japaneseMonthly:  '150+',
  googleRating:     '4.8',
  responseTime:     '3분',
  freeConsult:      '15분',
};

/* ── 콘텐츠 섹션 ─────────────────────────────────────────────────
   status: null | 'ok' | 'warn' | 'error'
   compliance: null | { type:'error'|'warn', expr, alt }
──────────────────────────────────────────────────────────────── */
/* ── 섹션 구조 메타데이터 ─────────────────────────────────────────
   navAnchor    : 사이트 네비게이션에 노출되는 앵커 ID (없으면 null)
   isFooterOnly : 독립 섹션 아닌 푸터 전용 여부
   isSubOf      : 상위 섹션 key (하위 섹션일 경우)
   네비 순서    : #decision → #doctors → #treatments → #cases → #faq
──────────────────────────────────────────────────────────────── */
var SITE_SECTIONS = {
  hero: {
    title: '히어로 (메인 비주얼)',
    ko: '「변했네」가 아니라 「예뻐졌네」 소리를 듣는 수술을.\n올래성형외과 대표원장 김현준은 20년간 자연스러운 아름다움을 추구해왔습니다.\n서울 강남 위치 · 일본어 전담 스탭 상주 · 24시간 LINE 대응.',
    ja: '「変わったね」ではなく「綺麗になったね」と言われる手術を。\nオーレ整形外科 院長 キム・ヒョンジュンは、20年間自然な美しさを追求し続けています。\nソウル江南 · 日本語専属スタッフ常駐 · 24時間LINE対応。',
    status: 'ok', savedAt: '오늘 14:23', compliance: null,
    navAnchor: null, isFooterOnly: false, isSubOf: null,
    images: [],
  },
  decision_guide: {
    title: 'DECISION GUIDE', images: [],
    ko: '고민에 맞는 시술을 찾아드립니다.\n• 눈이 작아 보여서 고민이라면 → 쌍꺼풀 상담\n• 코가 낮아서 고민이라면 → 코 성형 상담\n• 얼굴이 커 보여서 고민이라면 → 윤곽 수술 상담\n• 피부 트러블이 걱정이라면 → 피부 레이저 상담\n모든 상담은 무료로 진행됩니다.',
    ja: 'お悩みに合った施術をご提案します。\n• 目が小さく見えるのが悩みなら → 二重手術のご相談\n• 鼻が低いのが悩みなら → 鼻整形のご相談\n• 顔が大きく見えるのが悩みなら → 輪郭手術のご相談\n• 肌トラブルが気になるなら → 肌レーザーのご相談\nすべてのカウンセリングは無料で行っております。',
    status: 'ok', savedAt: '오늘 10:00', compliance: null,
    navAnchor: '#decision', isFooterOnly: false, isSubOf: null,
  },
  doctors: {
    title: '의료진 소개',
    ko: '올래성형외과 대표원장 김현준 — 20년 경력, 서울대 의대 출신, 자연스러운 눈·코 성형 전문.\n이수진 전문의 — 윤곽 수술·지방흡입 전문. 박정호 전문의 — 재수술·복합 시술 전문.\n최유리 전문의 — 피부 레이저·안티에이징 전문. 정태윤 전문의 — 남성 성형 전문.\n일본어 코디네이터 상주 · 통역 무료 제공.',
    ja: 'オーレ整形外科 院長 キム・ヒョンジュン — 20年のキャリア、ソウル大学医学部出身、自然な目元・鼻整形のスペシャリスト。\nイ・スジン専門医 — 輪郭手術・脂肪吸引専門。パク・ジョンホ専門医 — 修正手術・複合施術専門。\nチェ・ユリ専門医 — 肌レーザー・アンチエイジング専門。チョン・テユン専門医 — 男性整形専門。\n日本語コーディネーター常駐 · 通訳サービス無料。',
    status: 'ok', savedAt: '오늘 14:20', compliance: null,
    navAnchor: '#doctors', isFooterOnly: false, isSubOf: null,
    images: [
      { lb:'김현준 원장',  sz:'340KB', em:'👨‍⚕️' },
      { lb:'이수진 전문의', sz:'290KB', em:'👩‍⚕️' },
      { lb:'박정호 전문의', sz:'310KB', em:'👨‍⚕️' },
      { lb:'최유리 전문의', sz:'280KB', em:'👩‍⚕️' },
      { lb:'정태윤 전문의', sz:'320KB', em:'👨‍⚕️' },
    ],
  },
  treatments: {
    title: '시술 안내',
    ko: '눈 성형: 매몰법 ₩400,000~ / 절개법 ₩800,000~\n코 성형: 코 필러 ₩300,000~ / 코 수술 ₩2,500,000~\n윤곽 수술: 에라보톡스 ₩200,000~ / 광대축소 ₩3,000,000~\n피부 레이저: 토닝 ₩80,000~/회 / 프락셀 ₩200,000~/회\n모든 시술 전 무료 카운슬링 진행.',
    ja: '目元整形：埋没法 ₩400,000〜 / 切開法 ₩800,000〜\n鼻整形：鼻フィラー ₩300,000〜 / 鼻手術 ₩2,500,000〜\n輪郭手術：エラボトックス ₩200,000〜 / 頬骨縮小 ₩3,000,000〜\n肌レーザー：トーニング ₩80,000〜/回 / フラクセル ₩200,000〜/回\nすべての施術前に無料カウンセリングを実施しております。',
    status: 'warn', savedAt: '오늘 13:55',
    compliance: { type: 'warn', expr: '가격 표시', alt: '가격은 기본가 기준임을 명시 권장' },
    navAnchor: '#treatments', isFooterOnly: false, isSubOf: null,
    images: [],
  },
  cases: {
    title: '시술 사례',
    ko: '일본인 환자 실제 케이스를 소개합니다.\n[쌍꺼풀] 20대 여성 · 매몰법 · 다운타임 2일 · "자연스러워서 주변에서 알아채지 못했어요"\n[코 필러] 30대 여성 · 히알루론산 주입 · 당일 복귀 · "콧대가 생기니 얼굴이 작아 보여요"\n[윤곽] 20대 여성 · 에라보톡스 · 4주 후 효과 · "턱선이 선명해졌어요"\n매월 일본인 환자 150명 이상 내원.',
    ja: '日本人患者様の実際の症例をご紹介します。\n【二重手術】20代女性・埋没法・ダウンタイム2日・「自然すぎて周りに気づかれませんでした」\n【鼻フィラー】30代女性・ヒアルロン酸注入・当日復帰・「鼻筋ができて顔が小さく見えます」\n【輪郭】20代女性・エラボトックス・4週間後に効果・「フェイスラインがすっきりしました」\n月150名以上の日本人患者様にご来院いただいております。',
    status: 'ok', savedAt: '어제 16:00', compliance: null,
    navAnchor: '#cases', isFooterOnly: false, isSubOf: null,
    images: [
      { lb:'쌍꺼풀 #01', sz:'1.2MB', em:'👁',  badge:'B/A' },
      { lb:'쌍꺼풀 #02', sz:'980KB', em:'👁',  badge:'B/A' },
      { lb:'코 성형 #01', sz:'1.4MB', em:'👃', badge:'B/A' },
      { lb:'코 성형 #02', sz:'1.1MB', em:'👃', badge:'B/A' },
      { lb:'윤곽 #01',   sz:'890KB', em:'✨',  badge:'B/A' },
      { lb:'윤곽 #02',   sz:'1.3MB', em:'✨',  badge:'B/A' },
    ],
  },
  testimonials: {
    title: '환자 후기',
    ko: '실제 내원 환자 후기입니다.\n★★★★★ "일본어로 처음부터 끝까지 안내해주셔서 불안 없이 수술받았습니다." — 도쿄 30대 여성\n★★★★★ "카운슬링부터 귀국 후 사후관리까지 완벽했습니다." — 오사카 20대 여성\n★★★★☆ "결과는 만족스럽지만 붓기가 예상보다 길었어요." — 나고야 20대 여성\nGoogle 평점 4.8/5 (리뷰 1,200건+)',
    ja: '実際にご来院いただいた患者様の口コミです。\n★★★★★「日本語で最初から最後まで案内していただき、不安なく手術を受けられました。」— 東京・30代女性\n★★★★★「カウンセリングから帰国後のアフターケアまで完璧でした。」— 大阪・20代女性\n★★★★☆「結果には満足ですが、腫れが思ったより長引きました。」— 名古屋・20代女性\nGoogle評価 4.8/5（口コミ1,200件以上）',
    status: 'ok', savedAt: '어제 14:00', compliance: null,
    navAnchor: null, isFooterOnly: false, isSubOf: null,
    images: [],
  },
  contact: {
    title: '연락처 & 운영시간',
    ko: '연락 채널:\n• LINE: 24시간 · 평균 응답 3분\n• Instagram: DM 상담 가능\n• Zoom: 15분 무료 상담 예약\n\n운영시간:\n월~금 10:00-19:00 (KST) / 토 10:00-17:00 (KST)\n일요일·한국 공휴일 휴진\n\n주소: 서울시 강남구 역삼동 · 강남역 3번 출구 도보 5분',
    ja: '連絡チャンネル：\n• LINE：24時間 · 平均応答3分\n• Instagram：DMでご相談可能\n• Zoom：15分無料カウンセリング予約\n\n診療時間：\n月〜金 10:00-19:00（KST）/ 土 10:00-17:00（KST）\n日曜日・韓国祝日 休診\n\n住所：ソウル市江南区 · 江南駅3番出口より徒歩5分',
    status: 'ok', savedAt: '어제 10:00', compliance: null,
    navAnchor: null, isFooterOnly: true, isSubOf: null,
    images: [],
  },
  faq: {
    title: '자주 묻는 질문',
    ko: 'Q: 카운슬링은 무료인가요? A: 네, 무료입니다.\nQ: 일본어 통역이 있나요? A: 네, 전담 코디네이터가 상주합니다.\nQ: 수술 후 일본으로 돌아가도 사후관리가 되나요? A: 네, 귀국 후 3개월간 LINE으로 사후관리를 제공합니다.\nQ: 한국 의료보험이 없어도 되나요? A: 네, 외국인 자비 진료로 진행됩니다.\nQ: 수술 전 검사가 필요한가요? A: 네, 수술 당일 기본 혈액 검사가 진행됩니다.',
    ja: 'Q：カウンセリングは無料ですか？ A：はい、無料です。\nQ：日本語通訳はいますか？ A：はい、専任コーディネーターが常駐しております。\nQ：術後日本に帰国してもアフターケアはできますか？ A：はい、帰国後3ヶ月間LINEにてアフターケアをご提供しています。\nQ：韓国の健康保険がなくても大丈夫ですか？ A：はい、外国人自費診療で進めております。\nQ：手術前に検査は必要ですか？ A：はい、手術当日に基本的な血液検査を行います。',
    status: 'ok', savedAt: '어제 15:10', compliance: null,
    navAnchor: '#faq', isFooterOnly: false, isSubOf: null,
    images: [],
  },
  access: {
    title: '오시는 길',
    ko: '주소: 서울시 강남구 역삼동\n교통: 강남역 3번 출구에서 도보 5분\n\n운영시간:\n월~금 10:00-19:00 / 토 10:00-17:00\n일요일·공휴일 휴진\n\n공항에서 오시는 경우:\n인천국제공항에서 리무진 약 60분 / 김포공항에서 택시 약 30분\nIPPEO 공항 픽업 서비스 이용 가능',
    ja: '住所：ソウル市江南区\n交通：江南駅3番出口より徒歩5分\n\n診療時間：\n月〜金 10:00-19:00 / 土 10:00-17:00\n日曜日・祝日 休診\n\n空港からお越しの方：\n仁川国際空港からリムジンで約60分 / 金浦空港からタクシーで約30分\nIPPEO空港送迎サービスもご利用いただけます',
    status: 'ok', savedAt: '어제 09:00', compliance: null,
    navAnchor: null, isFooterOnly: true, isSubOf: null,
    images: [],
  },
};

/* ── 시술 상세 (TREATMENT_DETAILS) ──────────────────────────────
   treatments 섹션 하위의 시술별 상세 페이지.
   항목 추가: addTreatmentDetail() 함수로 동적 생성 가능.
──────────────────────────────────────────────────────────────── */
/* ── 시술 목록 (TREATMENTS) ──────────────────────────────────────
   3단계 구조:
     시술 메뉴 (treatments 섹션)
       └ 시술명 (TREATMENTS[n])          ← 메뉴 항목: 이름·가격·한줄 설명
           └ 시술 상세 (detail)          ← 상세 페이지: 방법·다운타임·이미지
──────────────────────────────────────────────────────────────── */
var TREATMENTS = [
  {
    id: 'eye',
    name: '눈 성형',
    icon: '👁',
    menuKo: '매몰법 ₩400,000~ / 절개법 ₩800,000~\n자연스러운 쌍꺼풀 전문. 모든 시술 전 무료 카운슬링.',
    menuJa: '埋没法 ₩400,000〜 / 切開法 ₩800,000〜\nバレない二重整形のスペシャリスト。無料カウンセリング実施中。',
    menuStatus: 'ok', menuSavedAt: '오늘 13:55', menuCompliance: null,
    detail: {
      title: '눈 성형 상세',
      ko: '눈 성형은 올래성형외과의 대표 시술입니다.\n매몰법: 절개 없이 실로 고정, 다운타임 1~3일, 자연스러운 결과 기대 가능.\n절개법: 피부 절개 후 지방·근육 조정, 영구적 효과, 다운타임 7~14일.\n개인 눈 상태에 따라 적합한 방법을 카운슬링에서 결정합니다.',
      ja: '目元整形はオーレ整形外科の得意とする施術です。\n埋没法：切開なしで糸で固定、ダウンタイム1〜3日、自然な仕上がりが期待できます。\n切開法：皮膚切開後に脂肪・筋肉を調整、永続的な効果、ダウンタイム7〜14日。\n個々の目の状態に応じて、カウンセリングにて最適な方法を決定いたします。',
      status: 'error', savedAt: '오늘 11:40',
      compliance: { type: 'error', expr: '「絶対に自然」', alt: '「より自然な仕上がりを目指して」' },
      images: [
        { lb:'쌍꺼풀 #01', sz:'1.2MB', em:'👁', badge:'B/A' },
        { lb:'쌍꺼풀 #02', sz:'980KB', em:'👁', badge:'B/A' },
      ],
    },
  },
  {
    id: 'nose',
    name: '코 성형',
    icon: '👃',
    menuKo: '코 필러 ₩300,000~ / 코 수술 ₩2,500,000~\n얼굴 전체 균형을 잡아주는 핵심 시술.',
    menuJa: '鼻フィラー ₩300,000〜 / 鼻手術 ₩2,500,000〜\n顔全体のバランスを整える重要な施術。',
    menuStatus: 'ok', menuSavedAt: '어제 18:30', menuCompliance: null,
    detail: {
      title: '코 성형 상세',
      ko: '코 성형은 얼굴 전체 균형을 잡아주는 핵심 시술입니다.\n코 필러: 히알루론산 주입, 비수술, 다운타임 1~3일, 효과 6~12개월.\n코 수술: 실리콘 보형물, 반영구, 다운타임 7~14일.\n원하시는 코 모양과 현재 상태에 맞는 방법을 제안드립니다.',
      ja: '鼻整形は顔全体のバランスを整える重要な施術です。\n鼻フィラー：ヒアルロン酸注入、非手術、ダウンタイム1〜3日、効果6〜12ヶ月。\n鼻手術：シリコンプロテーゼ使用、半永久的、ダウンタイム7〜14日。\nご希望の鼻の形と現在の状態に合わせて最適な方法をご提案いたします。',
      status: 'ok', savedAt: '어제 18:30',
      compliance: null,
      images: [
        { lb:'코 성형 #01', sz:'1.4MB', em:'👃', badge:'B/A' },
        { lb:'코 성형 #02', sz:'1.1MB', em:'👃', badge:'B/A' },
      ],
    },
  },
];

/* ── 고정 요소 ────────────────────────────────────────────────────
   사이트에 항상 표시되는 고정 UI 요소 (네비·섹션과 별개)
──────────────────────────────────────────────────────────────── */
var SITE_FIXED = {
  lineCta: {
    enabled: true,
    text:    'LINEで相談',
    subText: '24時間対応 · 平均返信3分',
    color:   '#06C755',
    position: 'bottom-right',
  },
};

/* ── 이미지 자산 ──────────────────────────────────────────────────
   Next.js 전환 시 → GET /api/site/assets
──────────────────────────────────────────────────────────────── */
var SITE_ASSETS = {
  summary: { total: 107, totalSize: '234MB' },
  ba: [
    { lb:'쌍꺼풀 #01', sz:'1.2MB', em:'👁',  badge:'badge-ba', isNew:false },
    { lb:'쌍꺼풀 #02', sz:'980KB', em:'👁',  badge:'badge-ba', isNew:false },
    { lb:'코 성형 #01', sz:'1.4MB', em:'👃', badge:'badge-ba', isNew:false },
    { lb:'코 성형 #02', sz:'1.1MB', em:'👃', badge:'badge-ba', isNew:false },
    { lb:'윤곽 #01',   sz:'890KB', em:'✨',  badge:'badge-ba', isNew:true  },
    { lb:'윤곽 #02',   sz:'1.3MB', em:'✨',  badge:'badge-ba', isNew:false },
    { lb:'지방 #01',   sz:'750KB', em:'💉',  badge:'badge-ba', isNew:false },
    { lb:'피부 #01',   sz:'820KB', em:'🌟',  badge:'badge-ba', isNew:true  },
  ],
  doctor: [
    { lb:'김현준 원장',  sz:'340KB', em:'👨‍⚕️', badge:'badge-ai', isNew:false },
    { lb:'이수진 전문의', sz:'290KB', em:'👩‍⚕️', badge:'badge-ai', isNew:false },
    { lb:'박정호 전문의', sz:'310KB', em:'👨‍⚕️', badge:'badge-ai', isNew:false },
    { lb:'최유리 전문의', sz:'280KB', em:'👩‍⚕️', badge:'badge-ai', isNew:false },
    { lb:'정태윤 전문의', sz:'320KB', em:'👨‍⚕️', badge:'badge-ai', isNew:false },
  ],
  facility: [
    { lb:'상담실 A', sz:'890KB', em:'🛋', badge:'', isNew:false },
    { lb:'수술실',  sz:'1.1MB', em:'🏥', badge:'', isNew:false },
    { lb:'회복실',  sz:'780KB', em:'🛏', badge:'', isNew:false },
    { lb:'로비',    sz:'1.2MB', em:'🏛', badge:'', isNew:true  },
    { lb:'외관',    sz:'960KB', em:'🏢', badge:'', isNew:false },
  ],
};

/* ── 게시 상태 ────────────────────────────────────────────────────
   Next.js 전환 시 → GET /api/site/deploy-status
──────────────────────────────────────────────────────────────── */
var SITE_DEPLOY = {
  url:           'jp.oleps.co.kr',
  lastPublished: '오늘 14:23',
  ssl:           '유효',
  coreWebVitals: 98,
  checklist: [
    { label:'콘텐츠 검수',        status:'ok',   note:'11개 섹션 완료'         },
    { label:'컴플라이언스',       status:'warn', note:'경고 1건 — 눈 성형'     },
    { label:'자산 업로드',        status:'ok',   note:'107개 파일'             },
    { label:'스키마 마크업',      status:'ok',   note:'9개 타입 적용'          },
    { label:'고정 LINE CTA',      status:'ok',   note:'우하단 고정 · 동작 확인' },
    { label:'네비 앵커 (5개)',    status:'ok',   note:'#decision~#faq 연결됨'  },
    { label:'눈 성형 섹션',       status:'warn', note:'컴플라이언스 검수 대기'  },
  ],
};

/* ── SEO·AEO 데이터 ───────────────────────────────────────────────
   Next.js 전환 시 → GET /api/seo
──────────────────────────────────────────────────────────────── */
var SITE_SEO = {
  coreWebVitals: { score: 98, lcp: '1.2s', fid: '8ms', cls: '0.02', grade: 'Good' },
  meta: [
    { page:'홈',         title:'韓国の二重整形・鼻整形なら オーレ整形外科 | 日本人専門スタッフ常駐', desc:'江南に位置するオーレ整形外科。二重・鼻・輪郭など幅広い美容整形を日本語で対応。月150名以上の日本人患者様実績。', status:'ok' },
    { page:'二重整形',   title:'二重整形（埋没法・切開法） | オーレ整形外科', desc:'埋没法₩400,000〜、切開法₩800,000〜。無料カウンセリング受付中。ダウンタイム最短1日。', status:'ok' },
    { page:'鼻整形',     title:'鼻整形（鼻フィラー・鼻手術） | オーレ整形外科', desc:'鼻フィラー₩300,000〜。顔全体のバランスを整える鼻整形専門。', status:'ok' },
    { page:'輪郭手術',   title:'輪郭手術（エラ・頬骨・顎） | オーレ整形外科', desc:'エラボトックス₩200,000〜。小顔・輪郭整形専門クリニック。', status:'warn' },
    { page:'FAQ',        title:'よくある質問 | オーレ整形外科', desc:'カウンセリング無料？日本語対応？帰国後のアフターケアは？よくある質問にお答えします。', status:'ok' },
  ],
  schema: [
    { type:'MedicalOrganization', status:'ok',  note:'병원 기본 정보' },
    { type:'FAQPage',             status:'ok',  note:'FAQ 5개 항목' },
    { type:'MedicalProcedure',    status:'ok',  note:'쌍꺼풀·코·윤곽' },
    { type:'Person',              status:'ok',  note:'의료진 5명' },
    { type:'Review',              status:'ok',  note:'구글 리뷰 연동' },
    { type:'BreadcrumbList',      status:'ok',  note:'전 페이지' },
    { type:'LocalBusiness',       status:'ok',  note:'강남 위치' },
    { type:'Event',               status:'warn', note:'캠페인 이벤트 미적용' },
    { type:'VideoObject',         status:'warn', note:'시술 영상 미등록' },
  ],
  aeoTargets: [
    { q:'韓国の二重整形はいくらですか？', engine:'ChatGPT', cited: true,  lastSeen:'오늘' },
    { q:'ソウルで日本語対応の整形外科は？', engine:'Perplexity', cited: true,  lastSeen:'오늘' },
    { q:'鼻フィラーのダウンタイムは？',    engine:'AI Overviews', cited: true,  lastSeen:'어제' },
    { q:'韓国整形のアフターケアは帰国後もできる？', engine:'ChatGPT', cited: false, lastSeen:'-' },
    { q:'江南の整形外科おすすめは？',      engine:'Perplexity', cited: false, lastSeen:'-' },
    { q:'二重手術の回復期間は？',          engine:'AI Overviews', cited: true,  lastSeen:'2일 전' },
  ],
  keywords: [
    { kw:'韓国 二重整形', rank:3,  vol:'8,100/월', trend:'up' },
    { kw:'ソウル 鼻整形', rank:7,  vol:'4,400/월', trend:'up' },
    { kw:'江南 整形外科', rank:5,  vol:'3,600/월', trend:'same' },
    { kw:'韓国 整形 日本語',rank:2, vol:'2,900/월', trend:'up' },
    { kw:'オーレ整形外科', rank:1,  vol:'1,300/월', trend:'up' },
  ],
};

/* ── 마케팅 전략 데이터 ───────────────────────────────────────────
   Next.js 전환 시 → GET /api/marketing/strategy
──────────────────────────────────────────────────────────────── */
var SITE_MARKETING = {
  strategy: {
    target: '일본 20~40대 여성, 한국 성형에 관심 있으나 언어 장벽·신뢰 불안 있음',
    positioning: '일본어 전담 스탭 상주 + IPPEO 서포트로 "불안 없는 한국 성형" 포지셔닝',
    coreMessage: '「変わったね」ではなく「綺麗になったね」と言われる手術を',
    channels: ['LINE 공식 계정', 'Instagram', 'Google SEO', 'AEO (AI 검색)'],
    updatedAt: '2026-05-01',
  },
  keywords: {
    main: ['韓国 二重整形', 'ソウル 鼻整形', '江南 整形外科', '韓国 整形 日本語', 'オーレ整形外科'],
    longTail: [
      { kw:'韓国 二重整形 日本語対応', aeoIdx:[0,1] },
      { kw:'江南 鼻フィラー 安い',     aeoIdx:[2,4] },
      { kw:'ソウル 整形外科 アフターケア', aeoIdx:[3] },
      { kw:'韓国 輪郭手術 モニター',    aeoIdx:[]  },
      { kw:'二重手術 韓国 費用',        aeoIdx:[0,5] },
      { kw:'鼻整形 ダウンタイム 短い',  aeoIdx:[2]  },
    ],
  },
  competitors: [
    { name:'バノバギ',     strength:'ブランド認知', weakness:'価格帯高め', ourEdge:'日本語対応・IPPEO' },
    { name:'id病院',       strength:'規模・実績',   weakness:'個人対応薄', ourEdge:'담당의 1:1 상담' },
    { name:'ジョーウォン', strength:'코 성형 전문',  weakness:'다국어 미흡', ourEdge:'다언어 코디네이터' },
  ],
  performance: {
    monthlyVisitors: 1847,
    inquiries: 23,
    bookings: 8,
    convRate: '34%',
    aeoScore: 19,
    lineRate: 94,
  },
};
