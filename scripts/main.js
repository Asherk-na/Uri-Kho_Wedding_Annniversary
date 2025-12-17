// main.js — minimal client-side logic for countdown, gallery modal, and private message unlocks
// Note: This is a simple client-side implementation for a private family site.
// For stronger privacy, use server-side auth.

const weddingDate = new Date('2021-12-18T00:00:00');
// Owner-specific passwords for private messages (stored client-side)
const OWNER_PASSWORDS = { lanides: 'Eks_Lani', mercy: 'Mevrou__Uri-khos' };

function startWeddingTimer() {
    const el = document.getElementById('countdown');
    if (!el) return;
    const weddingDate = new Date(2021, 18, 3, 0, 0, 0); // month is 0-based => 11 == December

    function update() {
        const now = new Date();
        let diff = now - weddingDate;
        if (diff < 0) diff = 0;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        const daysEl = el.querySelector('.countdays');
        const hoursEl = el.querySelector('.counthours');
        const minsEl = el.querySelector('.countmins');
        const secsEl = el.querySelector('.countsecs');
        if (daysEl) daysEl.textContent = days;
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
        if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}

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

  // Gallery click handler (no site-wide lock)
  const galleryGrid = document.getElementById('galleryGrid');
  if(galleryGrid){ galleryGrid.addEventListener('click', (e)=>{
    const img = e.target.closest('img'); if(!img) return;
    const src = img.dataset.large || img.src;
    const caption = img.dataset.caption || img.alt || '';
    showModal(`<img src="${src}" style="width:100%" alt="photo"><p class=\"modal-caption\">${escapeHtml(caption)}</p>`)
  }) }



  // No site-wide login/authentication; messages remain individually passworded.

  // Private messages unlock — use the owner-specific password only
  document.querySelectorAll('.unlock-btn').forEach(btn=>{ btn.addEventListener('click', ()=>{
    const owner = btn.dataset.owner; const pw = prompt('Enter password to view this message:');
    if(pw === OWNER_PASSWORDS[owner]){ const el = document.getElementById('msg-'+owner); if(el) el.classList.remove('hidden'); const locked = btn.closest('.locked'); if(locked) locked.classList.add('hidden') }
    else alert('Incorrect password')
  })});

});

function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]) }

// Notes: This site no longer uses a family password; private messages use individual owner passwords.

