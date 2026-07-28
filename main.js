  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


function toggleMenu() {
  const links = document.getElementById('navLinks');
  const btn = document.querySelector('.nav-toggle');
  const open = links.classList.toggle('open');
  if (btn) { btn.setAttribute('aria-expanded', String(open)); }
  links.querySelectorAll('a').forEach(a => {
    a.onclick = () => {
      links.classList.remove('open');
      if (btn) { btn.setAttribute('aria-expanded', 'false'); }
    };
  });
}


  // ── HERO CAROUSEL ──
  (function heroCarousel() {
    const root = document.getElementById('heroCarousel');
    if (!root) return;

    const slides = Array.from(root.querySelectorAll('.hero-slide'));
    if (slides.length === 0) return;

    const bar      = document.getElementById('heroProgress');
    const indexEl  = document.getElementById('heroIndex');
    const totalEl  = document.querySelector('.hero-ui-total');
    const prevBtn  = document.getElementById('heroPrev');
    const nextBtn  = document.getElementById('heroNext');

    if (totalEl) { totalEl.textContent = '／' + String(slides.length).padStart(2, '0'); }

    const DURATION = 6000;   // 每張停留 6 秒
    const TICK     = 50;

    let current = 0;
    let elapsed = 0;
    let timer   = null;
    let paused  = false;

    // 影片播放中就完全停用自動輪播
    let locked = false;

    function render() {
      slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
      if (indexEl) { indexEl.textContent = String(current + 1).padStart(2, '0'); }
    }

    function goTo(i) {
      current = (i + slides.length) % slides.length;
      elapsed = 0;
      if (bar) { bar.style.width = '0%'; }
      render();
    }

    function tick() {
      if (paused || locked) return;
      elapsed += TICK;
      if (bar) { bar.style.width = Math.min(100, (elapsed / DURATION) * 100) + '%'; }
      if (elapsed >= DURATION) { goTo(current + 1); }
    }

    function start() {
      if (timer) clearInterval(timer);
      timer = setInterval(tick, TICK);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    // 滑鼠移入暫停
    root.addEventListener('mouseenter', () => { paused = true; });
    root.addEventListener('mouseleave', () => { paused = false; });

    // 分頁切到背景時暫停，省資源
    document.addEventListener('visibilitychange', () => { paused = document.hidden; });

    // 尊重使用者的「減少動態效果」偏好
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── YouTube facade：先顯示縮圖，點擊才載入播放器 ──
    root.querySelectorAll('.yt-facade').forEach(facade => {
      const id = facade.dataset.videoId;
      const thumb = facade.querySelector('.yt-thumb');

      if (!id || id === 'VIDEO_ID') {
        // 尚未填入影片 ID — 顯示佔位提示
        facade.innerHTML = '<div class="img-placeholder hero-placeholder"><span>置入 YouTube 影片</span></div>';
        return;
      }

      if (thumb) {
        // maxresdefault 不一定存在，失敗時退回 hqdefault
        thumb.src = 'https://img.youtube.com/vi/' + id + '/maxresdefault.jpg';
        thumb.addEventListener('error', () => {
          thumb.src = 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg';
        }, { once: true });
      }

      facade.addEventListener('click', () => {
        const iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
        iframe.title = '影片播放器';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';

        facade.innerHTML = '';
        facade.appendChild(iframe);
        facade.closest('.hero-slide').classList.add('is-playing');
        locked = true;   // 播放中不自動換頁
        if (bar) { bar.style.width = '0%'; }
      });
    });

    render();
    if (!reduceMotion && slides.length > 1) { start(); }
  })();
