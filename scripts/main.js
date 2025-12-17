// main.js — minimal client-side logic for countdown, gallery modal, and private message unlocks
// Note: This is a simple client-side implementation for a private family site.
// For stronger privacy, use server-side auth.

// Wedding date is Dec 18, 2021 — countdown shows time since this date.
// Owner-specific passwords for private messages (stored client-side)
const OWNER_PASSWORDS = { lanides: 'Eks_Lani', mercy: 'Mevrou__Uri-khos' };

function startWeddingTimer() {
    const el = document.getElementById('countdown');
    if (!el) return;
    const wedding = new Date('2021-12-18T00:00:00Z');

    function update() {
        const now = new Date();
        let diff = now - wedding; // positive => time since wedding
        const sign = diff >= 0 ? 1 : -1;
        diff = Math.abs(diff);

        const yearMs = 365.2425 * 24 * 60 * 60 * 1000;
        const dayMs = 24 * 60 * 60 * 1000;

        const years = Math.floor(diff / yearMs);
        diff -= years * yearMs;
        const days = Math.floor(diff / dayMs);
        diff -= days * dayMs;
        const hours = Math.floor(diff / (60 * 60 * 1000));
        diff -= hours * 60 * 60 * 1000;
        const mins = Math.floor(diff / (60 * 1000));
        diff -= mins * 60 * 1000;
        const secs = Math.floor(diff / 1000);

        let text;
        if (sign >= 0) {
            text = `${years} year${years!==1 ? 's' : ''}, ${days} day${days!==1 ? 's' : ''} ${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
        } else {
            text = `In ${years} year${years!==1 ? 's' : ''}, ${days} day${days!==1 ? 's' : ''} ${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
        }

        el.textContent = text;
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

  // start the wedding timer (shows time since the wedding)
  startWeddingTimer();

});

function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]) }

// Notes: This site no longer uses a family password; private messages use individual owner passwords.

