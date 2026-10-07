/* ==========================================================================
   PILLS · Proposal · Checklist → mailto composer
   Collects checked items and composes a structured mailto: link.
   ========================================================================== */

'use strict';

(function () {
  var btn = document.getElementById('proposal-submit-btn');
  if (!btn) return;

  /* Override the CTA--continue flip handler for this specific button */
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    /* ——— Collect selections ——— */
    var sections = document.querySelectorAll('.proposal-group');
    var lines = [];

    sections.forEach(function (group) {
      var title = group.querySelector('.proposal-group__title');
      if (!title) return;
      var heading = title.textContent.trim();

      /* Checkboxes & Radios */
      var checked = group.querySelectorAll('input:checked');
      if (checked.length > 0) {
        lines.push('■ ' + heading);
        checked.forEach(function (input) {
          lines.push('  · ' + input.value);
        });
        lines.push('');
      }

      /* Textarea */
      var textarea = group.querySelector('.proposal-textarea');
      if (textarea && textarea.value.trim()) {
        lines.push('■ ' + heading);
        lines.push('  ' + textarea.value.trim());
        lines.push('');
      }
    });

    /* ——— Contact fields ——— */
    var company = document.getElementById('p-company');
    var name = document.getElementById('p-name');
    var email = document.getElementById('p-email');
    var tel = document.getElementById('p-tel');

    lines.push('■ Contact');
    if (company && company.value.trim()) lines.push('  회사명: ' + company.value.trim());
    if (name && name.value.trim()) lines.push('  담당자: ' + name.value.trim());
    if (email && email.value.trim()) lines.push('  이메일: ' + email.value.trim());
    if (tel && tel.value.trim()) lines.push('  연락처: ' + tel.value.trim());

    /* ——— Compose mailto ——— */
    var subject = 'Proposal Request — PILLS AI Infrastructure';
    var body = [
      '— PILLS Proposal Request —',
      '(Auto-generated inquiry from pills.co.kr)',
      '',
      ''
    ].concat(lines).join('\n');

    var mailto = 'mailto:info@pills.co.kr'
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);

    /* ——— CTA flip animation then open mail ——— */
    var txEl = btn.querySelector('.tx');
    var arEl = btn.querySelector('.ar');
    var railEl = btn.querySelector('.rail-l');
    var lnEl = btn.querySelector('.ln');
    var mvEl = btn.querySelector('.mv');

    txEl.textContent = 'Simple is Better';
    txEl.style.color = 'var(--ink)';
    txEl.style.fontWeight = '600';
    if (arEl) arEl.style.color = 'var(--ink)';
    if (railEl) railEl.style.background = 'var(--ink)';
    if (lnEl) lnEl.style.background = 'var(--ink)';

    btn.style.animation = 'none';
    btn.style.opacity = '1';
    btn.style.perspective = '600px';

    var frozenMv = getComputedStyle(mvEl).transform;
    var mvTx = 0;
    if (frozenMv && frozenMv !== 'none') {
      var parts = frozenMv.match(/matrix\(([^)]+)\)/);
      if (parts) { mvTx = parseFloat(parts[1].split(',')[4]) || 0; }
    }

    mvEl.style.transition = 'none';
    mvEl.style.transform = frozenMv;

    var uid = 'proposal-flip-' + Date.now();
    var dynStyle = document.createElement('style');
    dynStyle.textContent =
      '@keyframes ' + uid + '{' +
        '0%{transform:translateX(' + mvTx + 'px) rotateX(0deg)}' +
        '100%{transform:translateX(' + mvTx + 'px) rotateX(360deg)}' +
      '}';
    document.head.appendChild(dynStyle);

    setTimeout(function () {
      mvEl.style.animation = uid + ' 800ms linear forwards';
      mvEl.style.transformOrigin = 'center center';
    }, 300);

    setTimeout(function () {
      window.location.href = mailto;
    }, 1200);
  });
})();
