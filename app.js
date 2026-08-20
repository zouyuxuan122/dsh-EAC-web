(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- data ---------------- */

var DATA = {
    repo: 'https://github.com/zouyuxuan122/Deepseek-Harness-EAC',
    stars: 1024,
    starHistory: [
      { d: '08-14', s: 1 },
      { d: '08-15', s: 210 },
      { d: '08-16', s: 487 },
      { d: '08-17', s: 693 },
      { d: '08-18', s: 834 },
      { d: '08-19', s: 927 },
      { d: '08-20', s: 998 },
      { d: '08-21', s: 1024, live: true }
    ],
    contributors: [
      { login: 'zouyuxuan122', n: 35, avatar: 'https://avatars.githubusercontent.com/u/245557608?v=4' },
      { login: 'dtyg123', n: 25, avatar: 'https://avatars.githubusercontent.com/u/171705219?v=4' },
      { login: 'says693', n: 9, avatar: 'https://avatars.githubusercontent.com/u/317628891?v=4' },
      { login: 'jing-hy', n: 9, avatar: 'https://avatars.githubusercontent.com/u/281396152?v=4' },
      { login: 'zixin947', n: 7, avatar: 'https://avatars.githubusercontent.com/u/318131693?v=4' },
      { login: 'jiang8297', n: 6, avatar: 'https://avatars.githubusercontent.com/u/242639667?v=4' },
      { login: 'lanyun077', n: 2, avatar: 'https://avatars.githubusercontent.com/u/186024291?v=4' },
      { login: 'Luoye-hb', n: 1, avatar: 'https://avatars.githubusercontent.com/u/238787898?v=4' },
      { login: 'lbn2011', n: 1, avatar: 'https://avatars.githubusercontent.com/u/89037561?v=4' }
    ]
  };

  window.__eacData = DATA;

  /* ---------------- easing ---------------- */

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  function easeOutBack(t) {
    var c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /* ---------------- loader ---------------- */

var loader = document.getElementById('loader');
  var loaderFill = document.querySelector('.loader-fill');
  var loaded = false;
  var loaderDone = false;

  function applyCustomCursor() {
    if (cursorMoved && loaderDone) {
      document.documentElement.classList.add('custom-cursor');
    }
  }

  function finishLoader() {
    if (loaded) return;
    loaded = true;
    loaderDone = true;
    loader.classList.add('done');
    document.body.style.overflow = '';
    applyCustomCursor();
  }

  window.addEventListener('load', function () {
    setTimeout(function () {
      if (!REDUCED) {
        loaderFill.style.width = '100%';
        setTimeout(finishLoader, 650);
      } else {
        finishLoader();
      }
    }, 250);
  });
  setTimeout(function () {
    if (!loaded) finishLoader();
  }, 4000);

  if (REDUCED) finishLoader();

  /* ---------------- cursor ---------------- */

  var dot = document.querySelector('.cursor-dot');
  var ring = document.querySelector('.cursor-ring');
  var mouseX = -100, mouseY = -100;
  var ringX = -100, ringY = -100;

if (!REDUCED && window.matchMedia('(hover: hover)').matches) {
    var cursorMoved = false;
    document.addEventListener('mousemove', function (e) {
      cursorMoved = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
      applyCustomCursor();
    });

    (function tickRing() {
      ringX = lerp(ringX, mouseX, 0.16);
      ringY = lerp(ringY, mouseY, 0.16);
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(tickRing);
    })();

    var hoverables = 'a, button, .card, .feature, .contributor, .btn';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(hoverables)) ring.classList.add('is-hover');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(hoverables)) ring.classList.remove('is-hover');
    });
  } else {
    dot.style.display = 'none';
    ring.style.display = 'none';
  }

  /* ---------------- magnetic buttons ---------------- */

  if (!REDUCED && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.magnetic').forEach(function (el) {
      var raf = null;
      var tx = 0, ty = 0, cx = 0, cy = 0;

      function move() {
        cx = lerp(cx, tx, 0.18);
        cy = lerp(cy, ty, 0.18);
        el.style.transform = 'translate(' + cx + 'px, ' + cy + 'px)';
        if (Math.abs(cx - tx) > 0.1 || Math.abs(cy - ty) > 0.1) {
          raf = requestAnimationFrame(move);
        } else {
          raf = null;
        }
      }

      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        tx = (e.clientX - r.left - r.width / 2) * 0.24;
        ty = (e.clientY - r.top - r.height / 2) * 0.34;
        if (!raf) raf = requestAnimationFrame(move);
      });
      el.addEventListener('mouseleave', function () {
        tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(move);
      });
    });
  }

  /* ---------------- nav scroll state ---------------- */

  var nav = document.querySelector('.nav');
  function onScrollNav() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------------- reveal on scroll ---------------- */

  var reveals = document.querySelectorAll('.reveal');
  reveals.forEach(function (el) {
    if (el.dataset.delay) el.style.setProperty('--d', el.dataset.delay);
  });
var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var el = entry.target;
      var prev = el._ratio || 0;
      var cur = entry.intersectionRatio;
      if (cur > prev) {
        clearTimeout(el._outT);
        el.classList.remove('out');
        el.classList.add('in');
      } else if (cur < prev && !el.closest('#hero, #versions')) {
        clearTimeout(el._outT);
        el._outT = setTimeout(function () {
          el.classList.add('out');
          el.classList.remove('in');
        }, 250);
      }
      el._ratio = cur;
    });
  }, { threshold: [0.14, 0.5, 0.8] });
  reveals.forEach(function (el) { io.observe(el); });

  /* ---------------- count-up stats ---------------- */

  function animateCount(el) {
    var target = parseInt(el.dataset.count, 10);
    var suffix = el.dataset.suffix || '';
    var start = null;
    var duration = 1900;

    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = easeOutExpo(p);
      el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var statsSeen = false;
  var statsIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !statsSeen) {
        statsSeen = true;
        document.querySelectorAll('.stat-num').forEach(animateCount);
        statsIO.disconnect();
      }
    });
  }, { threshold: 0.3 });
  statsIO.observe(document.querySelector('.hero-stats'));

  window.__eacReflowStats = function () {
    if (!statsSeen) return;
    document.querySelectorAll('.stat-num').forEach(function (el) { el.textContent = '0'; });
    document.querySelectorAll('.stat-num').forEach(animateCount);
  };

  /* ---------------- star chart ---------------- */

  var canvas = document.getElementById('starChart');
  var tip = document.getElementById('chartTip');
  var tipDate = tip.querySelector('.tip-date');
  var tipVal = tip.querySelector('.tip-val');
  var liveNum = document.getElementById('chart-live-num');
  var chartDrawn = false;

  window.__eacChartDrawn = function () { return chartDrawn; };

  function drawChart() {
    var rect = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = rect.width, H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var padL = 58, padR = 26, padT = 18, padB = 46;
    var cw = W - padL - padR;
    var ch = H - padT - padB;

    var pts = DATA.starHistory;
    var niceMax = 1100;
    var SUB = 24;

    function px(i) { return padL + (i / (pts.length - 1)) * cw; }
    function py(v) { return padT + ch - (v / niceMax) * ch; }

    function buildPath() {
      var samples = [{ x: px(0), y: py(pts[0].s), len: 0 }];
      for (var i = 1; i < pts.length; i++) {
        var x0 = px(i - 1), y0 = py(pts[i - 1].s);
        var x1 = px(i), y1 = py(pts[i].s);
        var mx = (x0 + x1) / 2;
        for (var s = 1; s <= SUB; s++) {
          var t = s / SUB;
          var inv = 1 - t;
          var x = inv * inv * inv * x0 + 3 * inv * inv * t * mx + 3 * inv * t * t * mx + t * t * t * x1;
          var y = inv * inv * inv * y0 + 3 * inv * inv * t * y0 + 3 * inv * t * t * y1 + t * t * t * y1;
          var prev = samples[samples.length - 1];
          var dx = x - prev.x, dy = y - prev.y;
          samples.push({ x: x, y: y, len: prev.len + Math.sqrt(dx * dx + dy * dy) });
        }
      }
      return samples;
    }

    var pathSamples = buildPath();
    var totalLen = pathSamples[pathSamples.length - 1].len;
    var dotLens = pts.map(function (_, i) { return pathSamples[i * SUB].len; });

    function cutAt(targetLen) {
      var idx = 0;
      while (idx < pathSamples.length - 1 && pathSamples[idx + 1].len <= targetLen) idx++;
      var s0 = pathSamples[idx];
      var s1 = pathSamples[Math.min(idx + 1, pathSamples.length - 1)];
      var seg = s1.len - s0.len;
      var t = seg > 0 ? (targetLen - s0.len) / seg : 1;
      return {
        idx: idx,
        x: s0.x + (s1.x - s0.x) * t,
        y: s0.y + (s1.y - s0.y) * t,
        full: targetLen >= totalLen
      };
    }

    function drawFrame(progress, elapsed) {
      ctx.clearRect(0, 0, W, H);

      ctx.font = '10px "Space Grotesk", monospace';
      ctx.fillStyle = '#8a8a8a';
      ctx.textAlign = 'right';
      for (var g = 0; g <= 4; g++) {
        var v = (niceMax / 4) * g;
        var y = py(v);
        ctx.strokeStyle = 'rgba(0,0,0,0.07)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(W - padR, y);
        ctx.stroke();
        ctx.fillText(String(v), padL - 12, y + 3);
      }

      ctx.textAlign = 'center';
      pts.forEach(function (pt, i) {
        ctx.fillText(pt.d, px(i), H - padB + 22);
      });

      var target = totalLen * progress;
      var cut = cutAt(target);

      ctx.beginPath();
      ctx.moveTo(pathSamples[0].x, pathSamples[0].y);
      for (var a = 1; a <= cut.idx; a++) {
        ctx.lineTo(pathSamples[a].x, pathSamples[a].y);
      }
      if (target > 0) ctx.lineTo(cut.x, cut.y);

      ctx.lineTo(cut.x, padT + ch);
      ctx.lineTo(pathSamples[0].x, padT + ch);
      ctx.closePath();
      var grad = ctx.createLinearGradient(0, padT, 0, padT + ch);
      grad.addColorStop(0, 'rgba(0,0,0,0.16)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(pathSamples[0].x, pathSamples[0].y);
      for (var b = 1; b <= cut.idx; b++) {
        ctx.lineTo(pathSamples[b].x, pathSamples[b].y);
      }
      if (target > 0) ctx.lineTo(cut.x, cut.y);
      ctx.strokeStyle = '#0a0a0a';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();

      for (var k = 0; k < pts.length; k++) {
        var reach = target - dotLens[k];
        if (reach < 0) continue;
        var pop = 1 - Math.pow(1 - Math.min(reach / 34, 1), 3);
        var xd = px(k), yd = py(pts[k].s);
        ctx.beginPath();
        ctx.arc(xd, yd, 3 * pop, 0, Math.PI * 2);
        ctx.fillStyle = '#0a0a0a';
        ctx.fill();
      }

      var pulse = 7 + 2.5 * Math.sin((elapsed || 0) / 190);
      ctx.beginPath();
      ctx.arc(cut.x, cut.y, pulse, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(10,10,10,0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cut.x, cut.y, pulse + 5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(10,10,10,0.14)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cut.x, cut.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#0a0a0a';
      ctx.fill();

      if (progress < 1) return;

      var labelAlpha = Math.min((progress - 0.96) / 0.04, 1);
      ctx.globalAlpha = labelAlpha;
      ctx.font = '12px "Space Grotesk", sans-serif';
      ctx.textAlign = 'left';
      var lx = px(pts.length - 1) - 8;
      var ly = py(pts[pts.length - 1].s) - 14;
      var label = String(DATA.stars) + ' ★';
      var tw = ctx.measureText(label).width + 20;
      var cx = px(pts.length - 1);
      var lx = Math.min(Math.max(cx - tw / 2, padL + 4), W - tw - 4);
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(lx, ly - 18, tw, 24);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText(label, lx + tw / 2, ly);
      ctx.textAlign = 'left';
      ctx.globalAlpha = 1;

      if (!chartDrawn && tip.hidden) tip.hidden = false;
    }

    var start = null;
    var duration = REDUCED ? 1 : 2400;

    function animate(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      drawFrame(easeOutExpo(p), ts - start);
      if (p < 1) requestAnimationFrame(animate);
      else chartDrawn = true;
    }
    requestAnimationFrame(animate);

    canvas._interact = function (clientX, clientY) {
      var r = canvas.getBoundingClientRect();
      var x = clientX - r.left;
      var best = null, bestD = Infinity;
      pts.forEach(function (pt, i) {
        var d = Math.abs(px(i) - x);
        if (d < bestD) { bestD = d; best = i; }
      });
      if (best === null || bestD > cw / pts.length) {
        tip.classList.remove('show');
        return;
      }
      tipDate.textContent = '2026-' + pts[best].d + (pts[best].live ? ' · 实时' : '');
      tipVal.textContent = pts[best].s + ' Stars';
      tip.style.left = px(best) + 'px';
      tip.style.top = py(pts[best].s) + 'px';
      tip.classList.add('show');
    };
  }

  function resizeChart() {
    if (chartDrawn) drawChart();
  }

  var chartIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        drawChart();
        chartIO.disconnect();
      }
    });
  }, { threshold: 0.25 });
  chartIO.observe(canvas);

  window.addEventListener('resize', resizeChart);

  canvas.addEventListener('mousemove', function (e) {
    if (canvas._interact) canvas._interact(e.clientX, e.clientY);
  });
  canvas.addEventListener('mouseleave', function () {
    tip.classList.remove('show');
  });

  liveNum.textContent = String(DATA.stars);

  /* ---------------- contributors ---------------- */

  var contribWrap = document.getElementById('contributors');
  DATA.contributors.forEach(function (c) {
    var a = document.createElement('a');
    a.className = 'contributor reveal';
    a.href = 'https://github.com/' + c.login;
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML =
      '<img class="contributor-avatar" src="' + c.avatar + '" alt="' + c.login + '" loading="lazy">' +
      '<div class="contributor-meta">' +
      '<div class="contributor-name">' + c.login + '</div>' +
      '<div class="contributor-role">' + c.n + ' commits</div>' +
      '</div>';
    contribWrap.appendChild(a);
    io.observe(a);
  });

  /* ---------------- hero parallax drift ---------------- */

  if (!REDUCED && window.matchMedia('(hover: hover)').matches) {
    var hero = document.getElementById('hero');
    var glow = document.querySelector('.hero-glow');
    var title = document.querySelector('.hero-title');
    var grid = document.querySelector('.hero-grid');

    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5;
      var ny = (e.clientY - r.top) / r.height - 0.5;
      title.style.transform = 'translate(' + nx * -18 + 'px, ' + ny * -12 + 'px)';
      glow.style.marginLeft = nx * 30 + 'px';
      grid.style.marginLeft = nx * -24 + 'px';
    });
    hero.addEventListener('mouseleave', function () {
      title.style.transform = '';
      glow.style.marginLeft = '';
      grid.style.marginLeft = '';
    });
  }
})();
(function () {
  'use strict';
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* ---------------- product showcase typing placeholder ---------------- */

  var dsFrame = document.querySelector('.desktop-frame');
  var dsInput = document.querySelector('.ds-input');
  if (dsFrame && dsInput && !REDUCED) {
    var phrases = [
      '描述你想要构建的内容',
      '构建一个多智能体研究助手…',
      '把这份规格变成可运行的原型…'
    ];
    var pi = 0, ci = 0, deleting = false;
    var typing = null;

    function tick() {
      var phrase = phrases[pi];
      dsInput.setAttribute('placeholder', phrase.slice(0, ci) + (deleting ? '' : '|'));
      if (!deleting) {
        ci++;
        if (ci > phrase.length) {
          deleting = true;
          typing = setTimeout(tick, 2200);
          return;
        }
        typing = setTimeout(tick, 95);
      } else {
        ci--;
        if (ci < 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          typing = setTimeout(tick, 500);
          return;
        }
        typing = setTimeout(tick, 40);
      }
    }

    var dsIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tick();
          dsIO.disconnect();
        }
      });
    }, { threshold: 0.3 });
    dsIO.observe(dsFrame);
  }
})();

/* ---------------- cursor color by background ---------------- */
(function () {
  var root = document.documentElement;
  var raf = null;

  function luminance(c) {
    var m = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c);
    if (!m) return null;
    return (0.2126 * (+m[1]) + 0.7152 * (+m[2]) + 0.0722 * (+m[3])) / 255;
  }

  document.addEventListener('mousemove', function (e) {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = null;
      var el = document.elementFromPoint(e.clientX, e.clientY);
      var light = false;
      while (el && el !== document.body) {
        var l = luminance(getComputedStyle(el).backgroundColor);
        if (l !== null && l !== 0) {
          light = l > 0.5;
          break;
        }
        el = el.parentElement;
      }
      root.dataset.cursor = light ? 'light' : 'dark';
    });
  });
})();

/* ---------------- live GitHub stats + self-growing curve ---------------- */
(function () {
  'use strict';
  var KEY = 'eacStarSeries_v1';
  var KNOWN_KEY = 'eacKnownStats_v1';
var REPO = 'zouyuxuan122/Deepseek-Harness-EAC';
  var POLL_MS = 60000;
  var API_BASE = [
    'https://api.github.com',
    'https://ghfast.top/https://api.github.com',
    'https://gh-proxy.com/https://api.github.com'
  ];
var DEFAULT_SERIES = [
    { d: '08-14', s: 1 },
    { d: '08-15', s: 210 },
    { d: '08-16', s: 487 },
    { d: '08-17', s: 693 },
    { d: '08-18', s: 834 },
    { d: '08-19', s: 927 },
    { d: '08-20', s: 998 },
    { d: '08-21', s: 1024, live: true }
  ];

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function todayStr() {
    var now = new Date();
    return pad(now.getMonth() + 1) + '-' + pad(now.getDate());
  }
  function timeStr() {
    var now = new Date();
    return pad(now.getHours()) + ':' + pad(now.getMinutes());
  }
  function loadSeries() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length) {
          arr.forEach(function (p, i) { p.live = i === arr.length - 1; });
          return arr;
        }
      }
    } catch (e) {}
    return DEFAULT_SERIES.map(function (p, i) {
      return { d: p.d, s: p.s, live: i === DEFAULT_SERIES.length - 1 };
    });
  }
  function lastPage(link) {
    var m = /page=(\d+)>;\s*rel="last"/.exec(link || '');
    return m ? parseInt(m[1], 10) : null;
  }

  var data = window.__eacData;
  if (!data) return;
  var series = loadSeries();
  data.starHistory = series;

function domKnown() {
    var s = { stars: data.stars };
    document.querySelectorAll('.stat-num').forEach(function (el) {
      var k = el.dataset.key;
      var v = parseInt(el.dataset.count, 10);
      if (k && !isNaN(v)) s[k] = v;
    });
    return s;
  }
  function loadKnown() {
    try {
      var raw = localStorage.getItem(KNOWN_KEY);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && o.stars != null) return o;
      }
    } catch (e) {}
    return domKnown();
  }
  var known = loadKnown();

  function saveKnown() {
    try { localStorage.setItem(KNOWN_KEY, JSON.stringify(known)); } catch (e) {}
  }

  function applyStats(s) {
    document.querySelectorAll('.stat-num').forEach(function (el) {
      var k = el.dataset.key;
      if (k && s[k] != null) el.dataset.count = String(s[k]);
    });
    var live = document.getElementById('chart-live-num');
    if (live && s.stars != null) live.textContent = String(s.stars);
  }
  function touchClock() {
    var at = document.getElementById('chart-live-at');
    if (at) at.textContent = '更新于 ' + timeStr();
  }
  function reflow() {
    if (typeof window.__eacReflowStats === 'function') window.__eacReflowStats();
    if (typeof window.__eacChartDrawn === 'function' && window.__eacChartDrawn()) {
      window.dispatchEvent(new Event('resize'));
    }
  }
  function updateSeries(stars) {
    data.stars = stars;
    var t = todayStr();
    var last = series[series.length - 1];
    if (last.d === t) {
      last.s = stars;
    } else {
      last.live = false;
      series.push({ d: t, s: stars, live: true });
    }
    try { localStorage.setItem(KEY, JSON.stringify(series)); } catch (e) {}
  }

function fetchJson(path) {
    var i = 0;
    function attempt() {
      if (i >= API_BASE.length) throw new Error('all bases failed');
      var url = API_BASE[i++] + path;
      return fetch(url, { cache: 'no-store' }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r;
      }).catch(function () {
        return attempt();
      });
    }
    return attempt();
  }

  function refreshFull() {
    return Promise.all([
      fetchJson('/repos/' + REPO).then(function (r) {
        return r.json();
      }),
      fetchJson('/repos/' + REPO + '/contributors?per_page=1').then(function (r) {
        return { count: lastPage(r.headers.get('Link')) };
      }),
      fetchJson('/repos/' + REPO + '/releases?per_page=1').then(function (r) {
        return { count: lastPage(r.headers.get('Link')) };
      })
    ]);
  }
  function refreshCore() {
    return fetchJson('/repos/' + REPO).then(function (r) {
      return r.json();
    });
  }

  function apply(repo, extra) {
    var stats = { stars: repo.stargazers_count, forks: repo.forks_count };
    if (extra) {
      if (extra.contributors != null) stats.contributors = extra.contributors;
      if (extra.releases != null) stats.releases = extra.releases;
    }
    known = stats;
    known.updatedAt = Date.now();
    saveKnown();
    updateSeries(stats.stars);
    applyStats(stats);
    touchClock();
    reflow();
  }

  function fail() {
    if (known && known.stars != null) {
      applyStats(known);
      data.stars = known.stars;
    }
  }

function refresh(full) {
    if (full) {
      return refreshFull().then(function (res) {
        apply(res[0], { contributors: res[1].count, releases: res[2].count });
      }).catch(fail);
    }
    return refreshCore().then(function (repo) {
      apply(repo, null);
    }).catch(fail);
  }

refresh(true);
  setInterval(function () {
    if (document.visibilityState !== 'hidden') refresh(false);
  }, POLL_MS);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') refresh(false);
  });
})();
