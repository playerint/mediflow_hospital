/* ================================================================
   dashboard-data.js — 홈 대시보드 데모 데이터
   Next.js 전환 시 각 키를 API 응답으로 교체하면 됩니다.
   GET /api/dashboard  → 전체 또는 각 섹션별 엔드포인트로 분리 가능
================================================================ */

var DASHBOARD_DATA = {

  /* ── 기간 ──────────────────────────────────────────────────── */
  period: '2026년 5월 1일 ~ 20일',

  /* ── KPI 카드 ───────────────────────────────────────────────
     Next.js → GET /api/kpi
  ─────────────────────────────────────────────────────────── */
  kpi: [
    { id:'kpi-inquiries',  label:'💬 이번 달 문의', value:'23',    delta:'↑ 전월 대비 +8건', trend:'up',  link:'html/hospital_crm_inquiry_detail.html', color:'navy' },
    { id:'kpi-line-click', label:'🔗 LINE 클릭률',  value:'12.4%', delta:'↑ +1.2%p',         trend:'up',  link:'html/hospital_reports.html',            color:'blue' },
    { id:'kpi-booking',    label:'📅 예약 전환율',  value:'34%',   delta:'업계 평균 21%',     trend:'neu', link:'html/hospital_crm_booking.html',        color:'blue' },
    { id:'kpi-visitors',   label:'👥 사이트 방문자', value:'1,847', delta:'↑ +23%',           trend:'up',  link:'html/hospital_reports.html',            color:'gray' },
  ],

  /* ── 처리 알림 ──────────────────────────────────────────────
     Next.js → GET /api/alerts
  ─────────────────────────────────────────────────────────── */
  alerts: [
    { dot:'var(--red)',      title:'컴플라이언스 경고 1건',       sub:'쌍꺼풀 페이지 — "絶対に自然" 표현 감지', time:'방금',   link:'html/hospital_site_content.html' },
    { dot:'var(--red)',      title:'미확인 LINE 문의 3건',        sub:'최근 접수 2시간 경과',                   time:'2시간 전', link:'html/hospital_crm_inbox.html'   },
    { dot:'var(--blue)',     title:'카피 검수 대기 — 눈 성형 섹션', sub:'AI 재집필 완료, 검수 필요',            time:'어제',    link:'html/hospital_site_content.html' },
    { dot:'var(--gray-300)', title:'D+7 리타게팅 발송 예정 5명', sub:'내일 오전 10시 자동 발송',               time:'내일',    link:'' },
  ],

  /* ── 빌드 진행 현황 ─────────────────────────────────────────
     Next.js → GET /api/build-status
  ─────────────────────────────────────────────────────────── */
  buildSteps: [
    { label:'AI 풀 드래프트', pct:100, done:true,  warn:false },
    { label:'크리에이티브',   pct:100, done:true,  warn:false },
    { label:'검수 게이트',    pct:60,  done:false, warn:true  },
    { label:'연동 & SEO',     pct:100, done:true,  warn:false },
    { label:'게시',           pct:100, done:true,  warn:false },
  ],

  /* ── 문의 퍼널 ──────────────────────────────────────────────
     Next.js → GET /api/funnel
  ─────────────────────────────────────────────────────────── */
  funnel: {
    steps: [
      { lbl:'방문', n:1847, color:'#2563EB' },
      { lbl:'문의', n:23,   color:'#6D28D9' },
      { lbl:'상담', n:18,   color:'#0D9488' },
      { lbl:'예약', n:14,   color:'#D97706' },
      { lbl:'내원', n:14,   color:'#DC2626' },
    ],
    convRate:    '0.76%',
    industryAvg: '0.41%',
  },

  /* ── 채널별 문의 ────────────────────────────────────────────
     Next.js → GET /api/channels
  ─────────────────────────────────────────────────────────── */
  channels: [
    { name:'LINE',      cnt:12, pct:52, color:'#0D9488' },
    { name:'Instagram', cnt:11, pct:48, color:'#E1306C' },
  ],

  /* ── 오늘 일정 ──────────────────────────────────────────────
     Next.js → GET /api/schedule?date=today
  ─────────────────────────────────────────────────────────── */
  schedule: [
    { time:'10:00', title:'비대면 상담',          sub:'스즈키 미카 · 쌍꺼풀',    color:'#2563EB', badge:'비대면', bc:'#DBEAFE', btc:'#1E40AF' },
    { time:'11:30', title:'이토 나나미 내원',      sub:'쌍꺼풀 수술 후 체크',     color:'#059669', badge:'내원',   bc:'#D1FAE5', btc:'#065F46' },
    { time:'14:00', title:'D+3 리타게팅 발송',    sub:'3명 LINE 자동 발송',       color:'#6D28D9', badge:'자동',   bc:'#EDE9FE', btc:'#4C1D95' },
    { time:'15:30', title:'비대면 상담',          sub:'아오키 하나 · 콧대',       color:'#D97706', badge:'예약',   bc:'#FEF3C7', btc:'#92400E' },
  ],

  /* ── AEO 인용 현황 ──────────────────────────────────────────
     Next.js → GET /api/aeo
  ─────────────────────────────────────────────────────────── */
  aeo: {
    items: [
      { engine:'Perplexity',    cnt:9,  max:15, color:'#6D28D9', delta:'+4' },
      { engine:'ChatGPT',       cnt:6,  max:15, color:'#059669', delta:'+2' },
      { engine:'AI Overviews',  cnt:4,  max:15, color:'#2563EB', delta:'+1' },
    ],
    totalThisMonth: '19회',
    delta: '+7회',
  },

  /* ── LINE 자동상담 ──────────────────────────────────────────
     Next.js → GET /api/line-auto
  ─────────────────────────────────────────────────────────── */
  lineAuto: {
    aiRate:      '94%',
    avgResponse: '8초',
    convRate:    '41%',
    chartData:   [3,4,2,5,4,6,3,5,4,7,5,6,4,8,6,7,5,8,7,9],
  },

};
