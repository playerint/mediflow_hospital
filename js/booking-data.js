/* booking-data.js — 예약 데이터 + 헬퍼
   Next.js 전환 시 → GET /api/bookings
   saveBooking / loadLocalBookings → POST/GET /api/bookings
*/

var ALL_BOOKINGS = [
  {date:'5/19',time:'09:30',name:'모리 아카리',    proc:'쌍꺼풀 매몰법',  type:'consult',doctor:'김민준 원장',   line:true,  status:'완료'},
  {date:'5/19',time:'11:00',name:'이시카와 유이',   proc:'코 필러',       type:'online', doctor:'이수진 전문의',  line:true,  status:'완료'},
  {date:'5/19',time:'14:30',name:'하마다 미사키',   proc:'눈밑 지방',     type:'visit',  doctor:'박정호 전문의',  line:true,  status:'완료'},
  {date:'5/19',time:'16:00',name:'우에다 나나',     proc:'피부 보톡스',   type:'auto',   doctor:'최유리 전문의',  line:true,  status:'완료'},
  {date:'5/20',time:'10:00',name:'스즈키 미카',     proc:'쌍꺼풀 비대면', type:'online', doctor:'이수진 전문의',  line:true,  status:'완료'},
  {date:'5/20',time:'11:30',name:'이토 나나미',     proc:'쌍꺼풀 내원',   type:'visit',  doctor:'김민준 원장',   line:true,  status:'완료'},
  {date:'5/20',time:'13:00',name:'고바야시 에미',   proc:'윤곽 상담',     type:'consult',doctor:'박정호 전문의',  line:false, status:'완료'},
  {date:'5/20',time:'14:00',name:'와타나베 아오이', proc:'비대면 상담',   type:'online', doctor:'이수진 전문의',  line:true,  status:'완료'},
  {date:'5/20',time:'15:30',name:'마츠모토 사야',   proc:'지방흡입 상담', type:'consult',doctor:'김민준 원장',   line:true,  status:'완료'},
  {date:'5/21',time:'10:30',name:'기무라 아야카',   proc:'눈 성형 절개',  type:'auto',   doctor:'이수진 전문의',  line:true,  status:'완료'},
  {date:'5/21',time:'13:00',name:'나카무라 리나',   proc:'코 성형',       type:'consult',doctor:'김민준 원장',   line:true,  status:'완료'},
  {date:'5/21',time:'14:30',name:'요시다 호노카',   proc:'피부레이저',    type:'auto',   doctor:'최유리 전문의',  line:true,  status:'완료'},
  {date:'5/21',time:'16:00',name:'오노 미유',       proc:'보톡스 시술',   type:'auto',   doctor:'최유리 전문의',  line:false, status:'취소'},
  {date:'5/22',time:'09:30',name:'가토 아이리',     proc:'쌍꺼풀 상담',   type:'consult',doctor:'김민준 원장',   line:true,  status:'확정'},
  {date:'5/22',time:'10:00',name:'다나카 유키',     proc:'눈 성형',       type:'consult',doctor:'박정호 전문의',  line:false, status:'대기'},
  {date:'5/22',time:'11:30',name:'이케다 미오',     proc:'코 필러',       type:'online', doctor:'이수진 전문의',  line:true,  status:'확정'},
  {date:'5/22',time:'13:00',name:'후지와라 유나',   proc:'피부 보톡스',   type:'auto',   doctor:'최유리 전문의',  line:true,  status:'확정'},
  {date:'5/22',time:'14:30',name:'나가타 사쿠라',   proc:'눈밑 지방',     type:'visit',  doctor:'박정호 전문의',  line:true,  status:'확정'},
  {date:'5/22',time:'15:00',name:'기타노 유이',     proc:'피부레이저',    type:'auto',   doctor:'최유리 전문의',  line:true,  status:'확정'},
  {date:'5/22',time:'16:30',name:'오오키 레나',     proc:'지방흡입',      type:'visit',  doctor:'김민준 원장',   line:false, status:'대기'},
  {date:'5/23',time:'10:00',name:'미야자키 유즈키', proc:'쌍꺼풀 매몰법', type:'auto',   doctor:'이수진 전문의',  line:true,  status:'확정'},
  {date:'5/23',time:'11:00',name:'야마다 사오리',   proc:'쌍꺼풀 상담',   type:'consult',doctor:'김민준 원장',   line:false, status:'대기'},
  {date:'5/23',time:'13:30',name:'사카모토 아오이', proc:'윤곽 주사',     type:'auto',   doctor:'최유리 전문의',  line:true,  status:'확정'},
  {date:'5/23',time:'15:00',name:'엔도 치히로',     proc:'코 성형 상담',  type:'consult',doctor:'박정호 전문의',  line:true,  status:'확정'},
  {date:'5/24',time:'10:00',name:'시미즈 아스카',   proc:'눈 성형 절개',  type:'auto',   doctor:'이수진 전문의',  line:true,  status:'확정'},
  {date:'5/24',time:'11:30',name:'하라 리카',       proc:'비대면 상담',   type:'online', doctor:'박정호 전문의',  line:true,  status:'확정'},
  {date:'5/24',time:'14:00',name:'사토 하루카',     proc:'윤곽 상담',     type:'consult',doctor:'박정호 전문의',  line:true,  status:'확정'},
  {date:'5/24',time:'15:30',name:'니시무라 코토네', proc:'피부레이저',    type:'auto',   doctor:'최유리 전문의',  line:true,  status:'확정'},
  {date:'5/25',time:'09:30',name:'마에다 히나',     proc:'쌍꺼풀 매몰법', type:'auto',   doctor:'이수진 전문의',  line:true,  status:'확정'},
  {date:'5/25',time:'10:30',name:'오카다 미오',     proc:'코 성형',       type:'visit',  doctor:'김민준 원장',   line:true,  status:'확정'},
  {date:'5/25',time:'13:00',name:'구보타 나츠미',   proc:'지방흡입 상담', type:'consult',doctor:'김민준 원장',   line:false, status:'대기'},
  {date:'5/25',time:'14:30',name:'아오야마 미나',   proc:'보톡스',        type:'auto',   doctor:'최유리 전문의',  line:true,  status:'확정'},
  {date:'5/26',time:'10:00',name:'이와사키 유코',   proc:'눈 성형 상담',  type:'consult',doctor:'박정호 전문의',  line:true,  status:'확정'},
  {date:'5/26',time:'11:30',name:'후쿠다 마이',     proc:'코 필러',       type:'online', doctor:'이수진 전문의',  line:true,  status:'확정'},
  {date:'5/26',time:'14:00',name:'나카지마 리쿠',   proc:'쌍꺼풀 상담',   type:'consult',doctor:'김민준 원장',   line:false, status:'대기'},
  {date:'5/26',time:'16:00',name:'하야시 유카',     proc:'지방흡입',      type:'visit',  doctor:'이수진 전문의',  line:true,  status:'취소'},
];

/* localStorage에 저장된 신규 예약 병합 */
(function loadLocalBookings() {
  try {
    var saved = JSON.parse(localStorage.getItem('mf_bookings') || '[]');
    for (var i = 0; i < saved.length; i++) ALL_BOOKINGS.push(saved[i]);
  } catch (e) {}
})();

/* ── 상수 ──────────────────────────────────────────────────────── */
var TYPE_LABELS = {consult:'상담', online:'비대면', visit:'내원', auto:'시술'};
var TYPE_COLORS = {
  consult: {bg:'#EEF2FF', tc:'#0D1B3E'},
  online:  {bg:'#EFF6FF', tc:'#1E40AF'},
  visit:   {bg:'#D1FAE5', tc:'#065F46'},
  auto:    {bg:'#F3F4F6', tc:'#374151'},
};

var DOCTORS = ['김민준 원장', '이수진 전문의', '박정호 전문의', '최유리 전문의'];
var PROCEDURES = ['쌍꺼풀 (매몰법)', '쌍꺼풀 (절개법)', '코 성형', '코 필러', '윤곽 수술', '지방흡입', '피부 레이저', '기타'];
var SLOT_TIMES = {
  consult: ['10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30','15:00','16:00'],
  online:  ['10:00','10:30','11:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00'],
  surgery: ['09:00','10:00','13:00','14:00'],
  checkup: ['10:00','11:00','14:00','15:00','16:00'],
  laser:   ['10:00','11:00','13:30','14:30','15:30','16:30'],
};

/* ── 헬퍼 ──────────────────────────────────────────────────────── */
function statusChipStyle(status) {
  var map = {
    '확정': {sbc:'#D1FAE5', stc:'#065F46'},
    '완료': {sbc:'#EEF2FF', stc:'#0D1B3E'},
    '취소': {sbc:'#FEF2F2', stc:'#991B1B'},
    '대기': {sbc:'#F3F4F6', stc:'#374151'},
  };
  return map[status] || map['대기'];
}

/* 날짜 문자열 → Date (연도는 2026 고정 — 실제 API 전환 시 제거) */
function parseBookingDate(dateStr) {
  var parts = dateStr.split('/');
  return new Date(2026, parseInt(parts[0]) - 1, parseInt(parts[1]));
}

/* Date → 'M/D' 포맷 */
function toDateKey(d) {
  return (d.getMonth() + 1) + '/' + d.getDate();
}

/* 이번 주 월~일 날짜 배열 */
function getCurrentWeekDays() {
  var today = new Date();
  var dow = today.getDay() || 7;   // 일=7로 통일 (월=1)
  var monday = new Date(today);
  monday.setDate(today.getDate() - dow + 1);
  monday.setHours(0, 0, 0, 0);

  var dayNames = ['월','화','수','목','금','토','일'];
  var result = [];
  for (var i = 0; i < 7; i++) {
    var d = new Date(monday);
    d.setDate(monday.getDate() + i);
    result.push({
      dayName: dayNames[i],
      dateKey: toDateKey(d),
      dateNum: String(d.getDate()),
      isToday: toDateKey(d) === toDateKey(today),
      isSat: i === 5,
      isSun: i === 6,
    });
  }
  return result;
}

/* KPI 계산 */
function computeKPI() {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var todayKey = toDateKey(today);

  var weekDays = getCurrentWeekDays();
  var weekKeys = weekDays.map(function(d) { return d.dateKey; });
  var monthPrefix = (today.getMonth() + 1) + '/';

  var weekCount  = 0;
  var monthCount = 0;
  var cancelCount = 0;

  for (var i = 0; i < ALL_BOOKINGS.length; i++) {
    var b = ALL_BOOKINGS[i];
    if (weekKeys.indexOf(b.date) !== -1) weekCount++;
    if (b.date.indexOf(monthPrefix) === 0) monthCount++;
    if (b.status === '취소') cancelCount++;
  }

  var cancelRate = ALL_BOOKINGS.length
    ? ((cancelCount / ALL_BOOKINGS.length) * 100).toFixed(1)
    : '0.0';

  return {
    weekCount:  weekCount,
    monthCount: monthCount,
    cancelRate: cancelRate + '%',
    leadTime:   '8.3일',
  };
}

/* 특정 날짜·의사의 예약된 시간 목록 (슬롯 비활성화용) */
function getBookedTimes(dateKey, doctor) {
  return ALL_BOOKINGS
    .filter(function(b) {
      return b.date === dateKey && b.status !== '취소' && (!doctor || b.doctor === doctor);
    })
    .map(function(b) { return b.time; });
}

/* ALL_BOOKINGS에서 유니크 환자 목록 추출 */
function getPatientsFromBookings() {
  var seen = {};
  var result = [];
  var avatarColors = [
    {bg:'#EEF2FF',tc:'#0D1B3E'},{bg:'#D1FAE5',tc:'#065F46'},
    {bg:'#FEF2F2',tc:'#991B1B'},{bg:'#EFF6FF',tc:'#1E40AF'},
    {bg:'#F3F4F6',tc:'#374151'},
  ];
  for (var i = 0; i < ALL_BOOKINGS.length; i++) {
    var b = ALL_BOOKINGS[i];
    if (!seen[b.name]) {
      seen[b.name] = true;
      var c = avatarColors[result.length % avatarColors.length];
      result.push({
        name:  b.name,
        init:  b.name.slice(0, 2),
        bg:    c.bg,
        tc:    c.tc,
        ch:    'LINE',
        proc:  b.proc + ' 이력',
        lastDate: b.date,
      });
    }
  }
  return result;
}

/* 새 예약 저장 (localStorage) */
function saveBooking(booking) {
  var chip = statusChipStyle(booking.status);
  booking.sbc = chip.sbc;
  booking.stc = chip.stc;
  ALL_BOOKINGS.push(booking);
  try {
    var saved = JSON.parse(localStorage.getItem('mf_bookings') || '[]');
    saved.push(booking);
    localStorage.setItem('mf_bookings', JSON.stringify(saved));
  } catch (e) {}
}
