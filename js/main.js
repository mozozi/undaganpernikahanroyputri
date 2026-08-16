/* ============================================================
   UNDANGAN DIGITAL PERNIKAHAN — Naufal & Azzahra
   Interaktivitas: Cover, Musik, Countdown, Galeri, RSVP, Amplop
   ============================================================ */

(function () {
  'use strict';

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ==================================================
     1. URL PARAM — Nama Tamu (mis. ?untuk=Andi)
     ================================================== */

  /* ==================================================
     2. COVER
     ================================================== */
const cover = $('#cover');
const btnOpen = $('#btnOpen');
let coverOpened = false;

function openCover() {
  if (coverOpened) return;

  coverOpened = true;

  // Disable tombol agar tidak diklik dua kali
  btnOpen.disabled = true;

  /*
   * Mulai musik SEGERA saat user menekan
   * tombol "Buka Undangan".
   *
   * Karena play() dipanggil dari event klik,
   * browser menganggapnya sebagai user interaction.
   */
  startMusic();

  setTimeout(() => {
    cover.classList.add('hidden');
    document.body.style.overflow = '';

    if (window.navigator.vibrate) {
      window.navigator.vibrate(30);
    }
  }, 1100);
}

btnOpen.addEventListener('click', openCover);

// Kunci scroll ketika cover masih terbuka
document.body.style.overflow = 'hidden';


/* ==================================================
     3. MUSIC
     ================================================== */

const audio = $('#bgMusic');
const btnMusic = $('#btnMusic');

let isPlaying = false;


// ----------------------------------------------
// Putar musik dari file MP3
// ----------------------------------------------
async function startMusic() {
  if (!audio) return;

  try {
    audio.volume = 0.7;

    await audio.play();

    isPlaying = true;
    setMusicState();

    console.log('Musik berhasil diputar');
  } catch (error) {
    console.error('Musik gagal diputar:', error);

    isPlaying = false;
    setMusicState();
  }
}


// ----------------------------------------------
// Tombol musik ON / OFF
// ----------------------------------------------
async function toggleMusic() {
  if (!audio) return;

  if (audio.paused) {
    try {
      await audio.play();

      isPlaying = true;
      setMusicState();

    } catch (error) {
      console.error('Gagal memutar musik:', error);
    }

  } else {
    audio.pause();

    isPlaying = false;
    setMusicState();
  }
}


// ----------------------------------------------
// Update tampilan tombol musik
// ----------------------------------------------
function setMusicState() {
  if (!btnMusic) return;

  if (isPlaying) {
    btnMusic.classList.add('playing');
    btnMusic.classList.remove('muted');

    btnMusic.title = 'Jeda Musik';
    btnMusic.setAttribute('aria-label', 'Jeda Musik');

  } else {
    btnMusic.classList.remove('playing');
    btnMusic.classList.add('muted');

    btnMusic.title = 'Putar Musik';
    btnMusic.setAttribute('aria-label', 'Putar Musik');
  }
}


// ----------------------------------------------
// Event tombol musik
// ----------------------------------------------
btnMusic.addEventListener('click', toggleMusic);


// ----------------------------------------------
// Jika musik selesai
// ----------------------------------------------
audio.addEventListener('ended', () => {
  isPlaying = false;
  setMusicState();
});


// ----------------------------------------------
// Jika musik mengalami error
// ----------------------------------------------
audio.addEventListener('error', (error) => {
  console.error('File musik tidak dapat dimuat:', error);
});

  /* ==================================================
     4. NAVBAR — Scroll & Mobile Menu
     ================================================== */
  const navbar = $('#navbar');
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');

  function onScrollNav() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
  });

  $$('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  /* ==================================================
     5. ACTIVE NAV LINK (scrollspy)
     ================================================== */
  const sections = $$('section[id]');
  const navAnchors = $$('.nav-links a');

  function scrollspy() {
    const pos = window.scrollY + 120;
    let current = 'home';
    sections.forEach((sec) => {
      if (pos >= sec.offsetTop) current = sec.id;
    });
    navAnchors.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', scrollspy, { passive: true });
  scrollspy();

  /* ==================================================
     6. REVEAL ON SCROLL (IntersectionObserver)
     ================================================== */
  const revealEls = $$('.reveal, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ==================================================
     7. PARTIKEL DI COVER
     ================================================== */
  const particleWrap = $('.cover-particles');
  if (particleWrap) {
    const count = window.innerWidth < 600 ? 18 : 30;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      const size = Math.random() * 5 + 2;
      p.style.left = Math.random() * 100 + '%';
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.animationDuration = Math.random() * 8 + 6 + 's';
      p.style.animationDelay = Math.random() * 8 + 's';
      if (Math.random() > 0.6) p.style.background = 'var(--gold)';
      particleWrap.appendChild(p);
    }
  }

  /* ==================================================
     7b. SLIDESHOW BACKGROUND — OUR STORY
     ================================================== */
  const storySlides = $$('.story-slide');
  const storyDots = $$('.story-dot');
  if (storySlides.length > 1) {
    let currentSlide = 0;
    function goToSlide(index) {
      storySlides[currentSlide].classList.remove('active');
      if (storyDots[currentSlide]) storyDots[currentSlide].classList.remove('active');
      currentSlide = (index + storySlides.length) % storySlides.length;
      storySlides[currentSlide].classList.add('active');
      if (storyDots[currentSlide]) storyDots[currentSlide].classList.add('active');
    }
    setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5000);
    storyDots.forEach((dot, i) => {
      dot.addEventListener('click', () => goToSlide(i));
    });
  }

  /* ==================================================
     8. COUNTDOWN
     ================================================== */
  const weddingDate = new Date('2026-08-29T08:00:00+07:00');
  const cdDays = $('#cdDays');
  const cdHours = $('#cdHours');
  const cdMins = $('#cdMins');
  const cdSecs = $('#cdSecs');

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function updateCountdown() {
    const now = new Date();
    let diff = weddingDate - now;
    if (diff < 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMins.textContent = '00';
      cdSecs.textContent = '00';
      return;
    }
    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const mins = Math.floor(diff / 60000);
    diff -= mins * 60000;
    const secs = Math.floor(diff / 1000);
    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMins.textContent = pad(mins);
    cdSecs.textContent = pad(secs);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ==================================================
     9. GALERI — Lightbox
     ================================================== */
  const galleryItems = $$('.g-item img');
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightboxImg');
  let currentIndex = 0;

  function showLightbox(index) {
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    lightboxImg.src = galleryItems[currentIndex].src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((img, i) => {
    img.parentElement.addEventListener('click', () => showLightbox(i));
  });
  $('#lightboxClose').addEventListener('click', closeLightbox);
  $('#lightboxPrev').addEventListener('click', (e) => {
    e.stopPropagation();
    showLightbox(currentIndex - 1);
  });
  $('#lightboxNext').addEventListener('click', (e) => {
    e.stopPropagation();
    showLightbox(currentIndex + 1);
  });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightbox(currentIndex - 1);
    if (e.key === 'ArrowRight') showLightbox(currentIndex + 1);
  });

  /* ==================================================
     10. RSVP — Konfirmasi (via WhatsApp + localStorage)
     ================================================== */
  const rsvpForm = $('#rsvpForm');
  const rsvpMsgBox = $('#rsvpMsgBox');
  const WA_NUMBER = '6282269000134'; // ganti dengan nomor WhatsApp tuan rumah

  let selectedGuests = 2;
  let selectedAttend = 'Hadir';

  $$('.guest-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.guest-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedGuests = parseInt(btn.dataset.guests, 10);
    });
  });

  $$('.attend-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const form = btn.closest('form');
      form.querySelectorAll('.attend-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      if (form === rsvpForm) selectedAttend = btn.dataset.attend;
    });
  });

  function showRsvpMessage(text, isError) {
    rsvpMsgBox.innerHTML = text;
    rsvpMsgBox.classList.toggle('error', !!isError);
    rsvpMsgBox.classList.add('show');
    setTimeout(() => rsvpMsgBox.classList.remove('show'), 8000);
  }

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#rsvpName').value.trim();
    const phone = $('#rsvpPhone').value.trim();
    const message = $('#rsvpMsg').value.trim();

    if (!name || !phone) {
      showRsvpMessage('Mohon lengkapi nama dan nomor WhatsApp.', true);
      return;
    }

    // Simpan ke localStorage
    const records = JSON.parse(localStorage.getItem('rsvp_records') || '[]');
    records.push({ name, phone, guests: selectedGuests, attend: selectedAttend, message, date: new Date().toISOString() });
    localStorage.setItem('rsvp_records', JSON.stringify(records));

    const waText =
      `Assalamu'alaikum,%0A` +
      `Saya *${name}* ingin mengonfirmasi kehadiran pada acara pernikahan%0A` +
      `Roy & Putri.%0A%0A` +
      `*Kehadiran:* ${selectedAttend}%0A` +
      `*Jumlah Tamu:* ${selectedGuests}%0A` +
      `*No. WhatsApp:* ${phone}` +
      (message ? `%0A*Ucapan & Do'a:*%0A${message}` : '');

    window.open(`https://wa.me/${WA_NUMBER}?text=${waText}`, '_blank');

    showRsvpMessage(
      `Terima kasih, <strong>${escapeHtml(name)}</strong>! Konfirmasi Anda telah kami terima.<br>` +
      `Jika WhatsApp belum terbuka, silakan cek kembali.`
    );
    rsvpForm.reset();
    $$('.guest-btn').forEach((b) => b.classList.remove('active'));
    $$('.guest-btn')[1].classList.add('active');
    selectedGuests = 2;
    rsvpForm.querySelectorAll('.attend-btn').forEach((b) => b.classList.remove('active'));
    rsvpForm.querySelector('.attend-btn').classList.add('active');
    selectedAttend = 'Hadir';
  });

  /* ==================================================
     10b. UCAPAN & DO'A — Guest Book (Google Spreadsheet)
     ================================================== */
  const ucapanForm = $('#ucapanForm');
  const ucpList = $('#ucapanList');
  const ucpCount = $('#ucapanCount');
  const ucapanMsgBox = $('#ucapanMsgBox');
  const STORAGE_UCAPAN = 'ucapan_records';
  const SHEET_SCRIPT_URL = (typeof SHEET_CONFIG !== 'undefined' && SHEET_CONFIG.SCRIPT_URL) ? SHEET_CONFIG.SCRIPT_URL : '';

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return '';
    }
  }

  function renderUcapan(records) {
    ucpCount.textContent = records.length + ' ucapan';
    if (!records.length) {
      ucpList.innerHTML = '<div class="ucapan-empty"><i class="fa-solid fa-comments"></i>Belum ada ucapan. Jadilah yang pertama!</div>';
      return;
    }
    ucpList.innerHTML = records
      .map((r, i) => {
        const initial = (r.name || '?').trim().charAt(0).toUpperCase() || '?';
        const badge = r.attend === 'Hadir'
          ? '<span class="uc-badge hadir">Akan Hadir</span>'
          : '<span class="uc-badge tidak">Tidak Hadir</span>';
        return (
          '<div class="uc-card" style="animation-delay:' + Math.min(i * 0.05, 0.5) + 's">' +
            '<div class="uc-card-top">' +
              '<div style="display:flex;align-items:center;gap:10px;min-width:0">' +
                '<span class="uc-avatar">' + escapeHtml(initial) + '</span>' +
                '<div style="min-width:0">' +
                  '<span class="uc-name">' + escapeHtml(r.name) + '</span>' +
                  '<span class="uc-date">' + formatDate(r.date) + '</span>' +
                '</div>' +
              '</div>' +
              badge +
            '</div>' +
            '<p class="uc-text">"' + escapeHtml(r.message) + '"</p>' +
          '</div>'
        );
      })
      .join('');
  }

  function loadUcapanLocal() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_UCAPAN) || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch (e) { return []; }
  }

  function saveUcapanLocal(records) {
    try {
      localStorage.setItem(STORAGE_UCAPAN, JSON.stringify(records));
    } catch (e) { /* abaikan */ }
  }

  async function fetchUcapanSheet() {
    if (!SHEET_SCRIPT_URL) throw new Error('Script URL belum dikonfigurasi');
    const res = await fetch(SHEET_SCRIPT_URL + '?t=' + Date.now(), { method: 'GET', redirect: 'follow' });
    if (!res.ok) throw new Error('Gagal mengambil data (' + res.status + ')');
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) throw new Error('Respon tidak valid');
    return json.data;
  }

  async function submitUcapanSheet(record) {
    if (!SHEET_SCRIPT_URL) throw new Error('Script URL belum dikonfigurasi');
    const res = await fetch(SHEET_SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(record)
    });
    if (!res.ok) throw new Error('Gagal mengirim data (' + res.status + ')');
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Gagal menyimpan ucapan');
    return json.data;
  }

  async function loadUcapan() {
    ucpList.innerHTML = '<div class="ucapan-empty"><i class="fa-solid fa-spinner fa-spin"></i>Memuat ucapan...</div>';
    try {
      const records = await fetchUcapanSheet();
      saveUcapanLocal(records);
      renderUcapan(records);
    } catch (e) {
      console.warn('Gagal memuat dari Google Spreadsheet, gunakan cache lokal:', e);
      renderUcapan(loadUcapanLocal());
    }
  }

  function showUcapanMessage(text, isError) {
    ucapanMsgBox.innerHTML = text;
    ucapanMsgBox.classList.toggle('error', !!isError);
    ucapanMsgBox.classList.add('show');
    setTimeout(() => ucapanMsgBox.classList.remove('show'), 6000);
    ucapanMsgBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  ucapanForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('#ucpName').value.trim();
    const message = $('#ucpMsg').value.trim();
    const activeAttend = ucapanForm.querySelector('.attend-btn.active');
    const attend = activeAttend ? activeAttend.dataset.attend : 'Hadir';

    if (!name || !message) {
      showUcapanMessage('Mohon isi nama dan ucapan Anda.', true);
      return;
    }

    const submitBtn = ucapanForm.querySelector('button[type="submit"]');
    const originalBtn = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';

    const record = { name, attend, message, date: new Date().toISOString() };

    try {
      await submitUcapanSheet(record);
      showUcapanMessage('Terima kasih, <strong>' + escapeHtml(name) + '</strong>! Ucapan Anda telah tampil di halaman.');
    } catch (err) {
      console.warn('Gagal menyimpan ke Google Spreadsheet, simpan lokal:', err);
      const locals = loadUcapanLocal();
      locals.unshift(record);
      saveUcapanLocal(locals);
      showUcapanMessage('Terima kasih, <strong>' + escapeHtml(name) + '</strong>! Ucapan Anda tersimpan sementara di perangkat ini.');
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtn;
    ucapanForm.reset();
    ucapanForm.querySelectorAll('.attend-btn').forEach((b) => b.classList.remove('active'));
    ucapanForm.querySelector('.attend-btn.hadir').classList.add('active');
    loadUcapan();
  });

  loadUcapan();

  /* ==================================================
     10c. DONATUR — Daftar donasi yang tampil di halaman
     ================================================== */
  const donaturList = $('#donaturList');
  const donaturCount = $('#donaturCount');
  const STORAGE_DONATUR = 'donatur_records';

  // Data contoh (ubah sesuai donasi yang masuk)
  const SEED_DONATUR = [
    { name: 'Bapak Andi Setiawan', bank: 'BRI', amount: 'Rp 1.000.000', date: '2026-08-02T10:00:00+07:00' },
    { name: 'Keluarga Hasan Basri', bank: 'BCA', amount: 'Rp 2.500.000', date: '2026-08-07T15:00:00+07:00' },
    { name: 'Sahabat Naufal', bank: 'BRI', amount: 'Rp 500.000', date: '2026-08-11T20:30:00+07:00' },
  ];

  function loadDonatur() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_DONATUR) || 'null');
      if (Array.isArray(stored) && stored.length) return stored;
    } catch (e) { /* abaikan */ }
    localStorage.setItem(STORAGE_DONATUR, JSON.stringify(SEED_DONATUR));
    return SEED_DONATUR.slice();
  }

  function renderDonatur(records) {
    if (!donaturList || !donaturCount) return;
    donaturCount.textContent = records.length + ' donatur';
    if (!records.length) {
      donaturList.innerHTML = '<div class="donatur-empty"><i class="fa-solid fa-gift"></i>Belum ada donasi.</div>';
      return;
    }
    donaturList.innerHTML = records
      .map((d, i) =>
        '<div class="don-card" style="animation-delay:' + Math.min(i * 0.05, 0.5) + 's">' +
          '<span class="don-icon"><i class="fa-solid fa-hand-holding-heart"></i></span>' +
          '<div class="don-info">' +
            '<span class="don-name">' + escapeHtml(d.name) + '</span>' +
            '<span class="don-meta">' + escapeHtml(d.bank) + ' • ' + formatDate(d.date) + '</span>' +
          '</div>' +
          '<span class="don-amount">' + escapeHtml(d.amount) + '</span>' +
        '</div>'
      )
      .join('');
  }

  if (donaturList && donaturCount) renderDonatur(loadDonatur());

  /* ==================================================
     11. AMPLOP — Salin Rekening
     ================================================== */
  const toast = $('#toast');
  let toastTimer = null;

  $$('.btn-copy').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      const done = () => {
        if (navigator.vibrate) navigator.vibrate(30);
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin!';
        setTimeout(() => {
          btn.innerHTML = '<i class="fa-regular fa-copy"></i> Salin Nomor Rekening';
        }, 2000);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
      } else {
        fallbackCopy(text, done);
      }
    });
  });

  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch (e) { /* abaikan */ }
    document.body.removeChild(ta);
    done();
  }
  

  /* ==================================================
     12. EFÉK EXTRA — Hati mengambang di hero
     ================================================== */
  const hero = $('#home');
  if (hero) {
    let heroTimer;
    function spawnHeart() {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.style.left = Math.random() * 90 + '%';
      heart.style.bottom = '-20px';
      heart.style.fontSize = Math.random() * 14 + 10 + 'px';
      heart.style.animation = `heartFloat ${Math.random() * 5 + 6}s linear`;
      heart.style.zIndex = '1';
      heart.innerHTML = Math.random() > 0.5 ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-solid fa-heart-pulse"></i>';
      hero.appendChild(heart);
      setTimeout(() => heart.remove(), 11000);
    }
    function heartLoop() {
      clearTimeout(heroTimer);
      heroTimer = setTimeout(() => {
        spawnHeart();
        heartLoop();
      }, Math.random() * 2200 + 1600);
    }
    // Hanya aktif setelah cover dibuka & saat hero terlihat
    function checkHero() {
      const rect = hero.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        heartLoop();
      } else {
        clearTimeout(heroTimer);
        setTimeout(checkHero, 400);
      }
    }
    window.addEventListener('scroll', () => {
      const rect = hero.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) heartLoop();
      else clearTimeout(heroTimer);
    }, { passive: true });
  }
})();
