
const STORAGE_NS = 'fullby40:';
const IS_IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
if (IS_IOS) document.documentElement.classList.add('ios-safe');
function $(id){ return document.getElementById(id); }
function safeParse(raw){ try { return raw ? JSON.parse(raw) : null; } catch(e){ return null; } }
function loadState(){
  try { return Object.assign({name:'ROBERT', goal:30, entries:{}, streak:{current:1}, physical:{}}, safeParse(localStorage.getItem(STORAGE_NS+'data')) || {}); }
  catch(e){ return {name:'ROBERT', goal:30, entries:{}, streak:{current:1}, physical:{}}; }
}
const state = loadState();
const today = new Date();
const todayKey = today.toISOString().slice(0,10);
function setHeaderDate(){
  const days=['SUN','MON','TUE','WED','THU','FRI','SAT']; const months=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const el=$('header-date'); if(el) el.textContent=`${days[today.getDay()]} · ${today.getDate()} ${months[today.getMonth()]}`;
}
function setGreeting(){
  const hr=today.getHours(); const word=hr<12?'GOOD MORNING,':hr<17?'GOOD AFTERNOON,':'GOOD EVENING,';
  const g=document.querySelector('.greeting .line:first-child'); if(g) g.textContent=word;
  const name=$('greeting-name'); if(name) name.textContent=(state.name||'ROBERT').toUpperCase();
}
function renderTodayLite(){
  const sw=$('status-watch'); if(sw) sw.textContent='DAY '+(state.streak?.current||1);
  const e=state.entries?.[todayKey]||{};
  const ss=$('status-sleep'); if(ss) ss.textContent=e.sleep!=null? e.sleep+'H':'—';
  const sm=$('status-mood'); if(sm) sm.textContent=e.mood?String(e.mood).toUpperCase().slice(0,8):'—';
  const mv=$('memory-card-verse');
  const verses=state.memoryVerses || state.memory?.verses || [];
  const current=Array.isArray(verses)? verses.find(v=>v.current)||verses[0] : null;
  if(mv && current){ mv.textContent='"'+(current.text||current.verse||'')+'"'; }
  const mr=$('memory-card-ref'); if(mr && current) mr.textContent=current.ref||current.reference||'Current verse';
}
function openDrawer(){ const d=$('drawer'), s=$('scrim'); if(d)d.classList.add('open'); if(s)s.classList.add('visible'); }
function closeDrawer(){ const d=$('drawer'), s=$('scrim'); if(d)d.classList.remove('open'); if(s)s.classList.remove('visible'); }
const ROUTE_FILES = {
 today:'../index.html', watch:'watch.html', becoming:'becoming.html', pillars:'pillars.html', fight:'fight.html',
 'prayer-log':'prayer-log.html', 'person-prayers':'person-prayers.html','sermon-notes':'sermon-notes.html','answered-prayers':'answered-prayers.html','daily-reading':'daily-reading.html','memory':'memory.html','worship':'worship.html',
 food:'food.html', weight:'weight.html', steps:'steps.html', sleep:'sleep.html', photos:'photos.html', workouts:'workouts.html','workouts-week':'workouts-week.html','workouts-directory':'workouts-directory.html', analysis:'analysis.html', daughter:'daughter.html', badges:'badges.html', rewards:'rewards.html', archives:'archives.html', insights:'insights.html', letters:'letters.html', compass:'compass.html', discipleship:'discipleship.html','family-curriculum':'family-curriculum.html', inheritance:'inheritance.html', reviews:'reviews.html', resources:'resources.html', settings:'settings.html'
};
function wireNavigation(){
  const isRoot = !location.pathname.includes('/views/');
  document.querySelectorAll('.drawer-item[data-route]').forEach(item=>{
    item.addEventListener('click',()=>{
      const r=item.dataset.route; closeDrawer();
      if(r==='today') location.href=isRoot?'index.html':'../index.html';
      else location.href=(isRoot?'views/':'')+(ROUTE_FILES[r]||`${r}.html`).replace('../','');
    });
  });
  const mb=$('menu-btn'); if(mb) mb.addEventListener('click',openDrawer);
  const dc=document.querySelector('.drawer-close'); if(dc) dc.addEventListener('click',closeDrawer);
  const scr=$('scrim'); if(scr) scr.addEventListener('click',closeDrawer);
  const bb=$('back-btn'); if(bb) bb.addEventListener('click',()=>history.length>1?history.back():location.href='../index.html');
}
function boot(){
  document.body.classList.add('modular-page'); if(IS_IOS) document.body.classList.add('ios-safe');
  setHeaderDate(); setGreeting(); renderTodayLite(); wireNavigation();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
