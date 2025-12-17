// main.js — minimal client-side logic for countdown, login, and gallery lock
// Note: This is a simple client-side implementation for a private family site.
// For stronger privacy, use server-side auth.

const WEDDING_DATE = new Date('2021-12-18T00:00:00');
// default family password and owner-specific passwords (stored client-side). To change: localStorage.setItem('familyPassword','newpw')
if(!localStorage.getItem('familyPassword')) localStorage.setItem('familyPassword','Uri-Khon');
const OWNER_PASSWORDS = { lanides: 'Eks_Lani', mercy: 'Mevrou_Uri-khos' };
function getFamilyPassword(){ return localStorage.getItem('familyPassword') || 'Uri-Khon' }

function updateCountdown(){
  const el = document.getElementById('countdown'); if(!el) return;
  const now = new Date();
  const diff = now - WEDDING_DATE;
  const days = Math.floor(diff / (1000*60*60*24));
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const daysRem = (days % 365) % 30;
  el.textContent = `${years} year(s), ${months} month(s), ${daysRem} day(s) — (${days} days total)`;
}
setInterval(updateCountdown,1000*60); updateCountdown();

// run page-specific bindings when DOM is ready
nd = document.addEventListener ? document : window.document;
nd.addEventListener('DOMContentLoaded', ()=>{
  // Modal helpers (gallery page)
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');
  function showModal(html){ if(!modal||!modalContent) return; modalContent.innerHTML = html; modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false') }
  function closeModal(){ if(!modal||!modalContent) return; modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); modalContent.innerHTML = '' }
  if(modalClose) modalClose.addEventListener('click', ()=>{ closeModal() });

  // Gallery logic
  const galleryGrid = document.getElementById('galleryGrid');
  const lockGalleryBtn = document.getElementById('lockGalleryBtn');
  let galleryUnlocked = localStorage.getItem('galleryUnlocked') === 'true';
  function updateGalleryBtn(){ if(!lockGalleryBtn) return; lockGalleryBtn.textContent = galleryUnlocked ? 'Lock Gallery' : 'Unlock Gallery' }
  updateGalleryBtn();
  if(lockGalleryBtn){ lockGalleryBtn.addEventListener('click', async ()=>{
    if(galleryUnlocked){ galleryUnlocked = false; localStorage.setItem('galleryUnlocked','false'); updateGalleryBtn(); alert('Gallery locked'); return }
    const password = prompt('Enter family password to unlock gallery:');
    if(password === getFamilyPassword() || password === OWNER_PASSWORDS['lanides'] || password === OWNER_PASSWORDS['mercy']){ galleryUnlocked = true; localStorage.setItem('galleryUnlocked','true'); updateGalleryBtn(); alert('Gallery unlocked') }
    else alert('Incorrect password')
  }) }
  if(galleryGrid){ galleryGrid.addEventListener('click', (e)=>{
    const img = e.target.closest('img'); if(!img) return;
    if(!galleryUnlocked){ alert('Gallery is locked. Click "Unlock Gallery" and provide the family password.'); return }
    const src = img.dataset.large || img.src;
    const caption = img.dataset.caption || img.alt || '';
    showModal(`<img src="${src}" style="width:100%" alt="photo"><p class=\"modal-caption\">${escapeHtml(caption)}</p>`)
  }) }



  // Login (simple client-side) — sets a localStorage auth token
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');
  function isAuth(){ return localStorage.getItem('uri_auth') === 'true' }
  function updateAuthUI(){ if(!loginForm||!logoutBtn) return; if(isAuth()){ loginForm.classList.add('hidden'); logoutBtn.classList.remove('hidden'); } else { loginForm.classList.remove('hidden'); logoutBtn.classList.add('hidden'); } }
  if(loginForm){ loginForm.addEventListener('submit',(ev)=>{ ev.preventDefault(); const pw = document.getElementById('familyPassword').value; if(pw===getFamilyPassword()){ localStorage.setItem('uri_auth','true'); alert('Logged in'); updateAuthUI(); } else alert('Incorrect password'); }); }
  if(logoutBtn){ logoutBtn.addEventListener('click', ()=>{ localStorage.removeItem('uri_auth'); alert('Logged out'); updateAuthUI(); }); }
  updateAuthUI();

  // Private messages unlock
  document.querySelectorAll('.unlock-btn').forEach(btn=>{ btn.addEventListener('click', ()=>{
    const owner = btn.dataset.owner; const pw = prompt('Enter family password to view this message:');
    if(pw===getFamilyPassword() || pw===OWNER_PASSWORDS[owner] || isAuth()){ const el = document.getElementById('msg-'+owner); if(el) el.classList.remove('hidden'); const locked = btn.closest('.locked'); if(locked) locked.classList.add('hidden') }
    else alert('Incorrect password')
  })});

});

function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]) }

// Info: change family password from the console if desired:
// localStorage.setItem('familyPassword','yourSecret');
// To clear auth: localStorage.removeItem('uri_auth');

