/* ==========================================================================
   PILLS · Landing · Main script
   Minimal interactions — no scroll-trigger, no parallax, no bounce.
   Direct user interaction only (Design System v1.1 Motion rules).
   ========================================================================== */

'use strict';

/* ——— Smooth scroll for anchor links (CTA는 별도 핸들러) ——— */
document.addEventListener('click', function (e) {
  var anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  /* CTA--continue는 flip 핸들러에서 처리 */
  if (anchor.classList.contains('cta--continue')) return;

  var target = document.querySelector(anchor.getAttribute('href'));
  if (!target) return;

  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});


/* ——— CTA Click Transition: "Simple is Better" flip ——— */
(function () {
  var FLIP_TEXT = 'Simple is Better';
  var DELAY_BEFORE_FLIP = 300;
  var FLIP_DURATION = 800;
  var flipCounter = 0;

  /* flip 은 인라인 스타일(animation:none 등)과 문구를 CTA 에 직접 덮어쓴 뒤
     페이지를 떠난다. 뒤로가기(bfcache)로 돌아오면 DOM 이 그 상태 그대로
     복원돼 CTA 가 'Simple is Better' 인 채 멈춰 있다.
     떠나기 전 원래 모습을 적어 뒀다가 복원 시 되돌린다. */
  var snapshots = [];
  document.querySelectorAll('.cta--continue').forEach(function (cta) {
    function pick(sel) {
      var el = cta.querySelector(sel);
      return el ? { el: el, css: el.style.cssText } : null;
    }
    var tx = cta.querySelector('.tx');
    snapshots.push({
      cta: cta,
      ctaCss: cta.style.cssText,
      tx: tx,
      txHtml: tx ? tx.innerHTML : null,
      txCss: tx ? tx.style.cssText : null,
      parts: ['.ar', '.rail-l', '.ln', '.mv'].map(pick)
    });
  });

  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    snapshots.forEach(function (s) {
      s.cta.style.cssText = s.ctaCss;
      if (s.tx) {
        s.tx.innerHTML = s.txHtml;
        s.tx.style.cssText = s.txCss;
      }
      s.parts.forEach(function (p) { if (p) { p.el.style.cssText = p.css; } });
    });
  });

  document.querySelectorAll('.cta--continue').forEach(function (cta) {
    cta.addEventListener('click', function (e) {
      e.preventDefault();

      var href = cta.getAttribute('href');
      var txEl = cta.querySelector('.tx');
      var arEl = cta.querySelector('.ar');
      var railEl = cta.querySelector('.rail-l');
      var lnEl = cta.querySelector('.ln');
      var mvEl = cta.querySelector('.mv');

      /* 1. 클릭 시점의 CTA·MV transform 캡처 */
      var frozenCta = getComputedStyle(cta).transform;
      var frozenMv = getComputedStyle(mvEl).transform;

      /* MV의 현재 translateX 추출 */
      var mvTx = 0;
      if (frozenMv && frozenMv !== 'none') {
        var parts = frozenMv.match(/matrix\(([^)]+)\)/);
        if (parts) { mvTx = parseFloat(parts[1].split(',')[4]) || 0; }
      }

      /* 2. 모든 CSS 애니메이션·트랜지션 즉시 중단 */
      cta.style.animation = 'none';
      cta.style.transition = 'none';
      cta.style.opacity = '1';
      cta.style.transform = frozenCta;

      mvEl.style.transition = 'none';
      mvEl.style.transform = frozenMv;

      /* 3. 텍스트·컬러 변경 */
      txEl.textContent = FLIP_TEXT;
      txEl.style.color = 'var(--ink)';
      txEl.style.fontWeight = '600';
      if (arEl) { arEl.style.color = 'var(--ink)'; }
      if (railEl) { railEl.style.background = 'var(--ink)'; }
      if (lnEl) { lnEl.style.background = 'var(--ink)'; }

      cta.style.perspective = '600px';

      /* 4. translateX를 포함한 동적 keyframe 생성 — 위치 고정 보장 */
      var uid = 'cta-flip-' + (++flipCounter);
      var dynStyle = document.createElement('style');
      dynStyle.textContent =
        '@keyframes ' + uid + '{' +
          '0%{transform:translateX(' + mvTx + 'px) rotateX(0deg)}' +
          '100%{transform:translateX(' + mvTx + 'px) rotateX(360deg)}' +
        '}';
      document.head.appendChild(dynStyle);

      /* 5. 회전 시작 */
      setTimeout(function () {
        mvEl.style.animation = uid + ' ' + FLIP_DURATION + 'ms linear forwards';
        mvEl.style.transformOrigin = 'center center';
      }, DELAY_BEFORE_FLIP);

      /* 6. 이동 (앵커 → 스크롤, 외부 → 페이지 이동) */
      setTimeout(function () {
        if (!href || href === '#') return;
        if (href.charAt(0) === '#') {
          var targetEl = document.querySelector(href);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          window.location.href = href;
        }
      }, DELAY_BEFORE_FLIP + FLIP_DURATION + 100);
    });
  });
})();
