// 전역 로그아웃 함수
function doLogout() {
  try { sessionStorage.removeItem('hospital_user'); } catch(e) {}
  try { localStorage.removeItem('hospital_user'); } catch(e) {}
  var loginPath = location.pathname.includes('/html/') ? '../login.html' : 'login.html';
  window.location.replace(loginPath);
}

(function(){
  var inHtml = location.pathname.includes('/html/');
  var p    = inHtml ? '' : 'html/';
  var home = inHtml ? '../index.html' : 'index.html';

  var ITEMS = [
    {t:'l'},{t:'h'},
    {t:'s',lb:'메인'},
    {t:'a',k:'dashboard', hr:home,                                ic:'⊞',lb:'홈 대시보드'},
    {t:'p',ks:['site_content','site_assets','site_seo','site_preview'],
      hr:p+'hospital_site_content.html',ic:'🌐',lb:'사이트 관리',ch:[
        {k:'site_content',hr:p+'hospital_site_content.html',ic:'✏',lb:'콘텐츠 편집'},
        {k:'site_assets', hr:p+'hospital_site_assets.html', ic:'🖼',lb:'이미지 관리'},
        {k:'site_seo',    hr:p+'hospital_seo_aeo.html',     ic:'🔍',lb:'SEO·AEO'},
        {k:'site_preview',hr:p+'hospital_site_preview.html',ic:'👁',lb:'미리보기 & 게시'},
      ]},
    {t:'a',k:'crm',     hr:p+'hospital_crm_inbox.html',  ic:'💬',lb:'문의·상담 CRM',bg:'3'},
    {t:'a',k:'booking',  hr:p+'hospital_crm_booking.html', ic:'📅',lb:'예약 관리'},
    {t:'a',k:'line',    hr:p+'hospital_line_auto.html',  ic:'🤖',lb:'LINE 자동상담',bg:'ON',tl:true},
    {t:'s',lb:'설정'},
    {t:'a',k:'marketing',hr:p+'hospital_marketing.html', ic:'📣',lb:'마케팅 현황'},
    {t:'a',k:'funnel',   hr:p+'hospital_funnel.html',   ic:'⚡',lb:'채널 & 자동 발송'},
    {t:'a',k:'reports',  hr:p+'hospital_reports.html',  ic:'📊',lb:'리포트'},
    {t:'a',k:'settings', hr:p+'hospital_settings.html', ic:'⚙', lb:'설정'},
    {t:'f'}
  ];

  var CRM  = ['crm','crm_inquiry'];
  var SITE = ['site_content','site_assets','site_seo','site_preview'];

  function build(active, user) {
    var name     = user ? user.name     : '김지현';
    var email    = user ? user.email    : 'oleps@hospital.co.kr';
    var hospital = user ? user.hospital : '올래성형외과';
    var role     = user ? user.role     : 'admin';
    var roleLabel = role === 'admin' ? '관리자' : '스탭';
    var roleColor = role === 'admin' ? '#5EEAD4' : '#FCD34D';

    var h = '';
    h += '<div class="sidebar-logo">'
       + '<div class="logo-title">MEDIFLOW</div>'
       + '<div class="logo-sub">글로벌 메디컬 플로우</div>'
       + '</div>';
    h += '<div class="hospital-card">'
       + '<div class="hospital-name">'+hospital+'</div>'
       + '<div class="hospital-meta">jp.oleps.co.kr</div>'
       + '<div class="hospital-meta live-dot" style="margin-top:4px;color:#34D399">게시 중</div>'
       + '</div>';

    ITEMS.forEach(function(n){
      if (n.t==='s') {
        h += '<div class="nav-section">'+n.lb+'</div>';
      } else if (n.t==='p') {
        var on = SITE.indexOf(active) > -1;
        h += '<a class="nav-item'+(on?' active':'')+'" href="'+n.hr+'"><span>'+n.ic+'</span> '+n.lb+'</a>';
        n.ch.forEach(function(c){
          h += '<a class="nav-item nav-sub'+(active===c.k?' active':'')+'" href="'+c.hr+'"><span>'+c.ic+'</span> '+c.lb+'</a>';
        });
      } else if (n.t==='a') {
        var on = active===n.k||(n.k==='crm'&&CRM.indexOf(active)>-1);
        var bg = n.bg ? ' <span class="nav-badge'+(n.tl?' teal':'')+'">'+n.bg+'</span>' : '';
        h += '<a class="nav-item'+(on?' active':'')+'" href="'+n.hr+'"><span>'+n.ic+'</span> '+n.lb+bg+'</a>';
      } else if (n.t==='f') {
        h += '<div class="sidebar-footer">'
           + '<div class="sf-row">'
           + '<span style="font-size:18px">👤</span>'
           + '<div style="flex:1;min-width:0">'
           + '<div style="display:flex;align-items:center;gap:6px">'
           + '<div style="font-size:12px;color:#fff;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+name+'</div>'
           + '<span style="font-size:10px;padding:1px 7px;border-radius:5px;background:rgba(255,255,255,.1);color:'+roleColor+';flex-shrink:0">'+roleLabel+'</span>'
           + '</div>'
           + '<div style="font-size:10px;color:rgba(255,255,255,.35);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+email+'</div>'
           + '</div>'
           + '</div>'
           + '<button onclick="doLogout()" style="width:100%;margin-top:6px;padding:7px 10px;background:transparent;border:1px solid rgba(255,255,255,.12);border-radius:8px;color:rgba(255,255,255,.4);font-size:12px;font-family:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .15s" onmouseover="this.style.background=\'rgba(220,38,38,.15)\';this.style.color=\'#FCA5A5\';this.style.borderColor=\'rgba(220,38,38,.3)\'" onmouseout="this.style.background=\'transparent\';this.style.color=\'rgba(255,255,255,.4)\';this.style.borderColor=\'rgba(255,255,255,.12)\'">🚪 로그아웃</button>'
           + '</div>';
      }
    });
    return h;
  }

  document.addEventListener('DOMContentLoaded', function(){
    var mount = document.getElementById('sidebar-mount');
    if (!mount) return;
    var active = mount.getAttribute('data-active') || 'dashboard';

    var user = null;
    try {
      user = typeof getSession === 'function' ? getSession() : null;
    } catch(e) {}
    if (!user) user = { email:'admin@oleps.co.kr', name:'김지현', role:'admin', hospital:'올래성형외과' };

    var aside = document.createElement('aside');
    aside.className = 'sidebar';
    aside.innerHTML = build(active, user);
    mount.parentNode.replaceChild(aside, mount);
  });
})();
