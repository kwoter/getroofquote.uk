/**
 * RoofQuote UK — cookie-gated tags.
 * Replace META_PIXEL_ID and GOOGLE_TAG_ID before go-live.
 * Consent key: rq_cookie_consent = essential | all | rejected
 */
(function () {
  var META_PIXEL_ID = 'META_PIXEL_ID'; // Ads Engine fills after BM
  var GOOGLE_TAG_ID = 'GOOGLE_TAG_ID'; // optional Week 2
  var KEY = 'rq_cookie_consent';

  function consent() {
    try {
      return localStorage.getItem(KEY) || localStorage.getItem('rq_cookie') || '';
    } catch (e) { return ''; }
  }

  function loadMeta() {
    if (!META_PIXEL_ID || META_PIXEL_ID.indexOf('META_') === 0) return;
    if (window.fbq) return;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0;
      t.src = 'https://connect.facebook.net/en_US/fbevents.js';
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script');
    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');
  }

  function loadGoogle() {
    if (!GOOGLE_TAG_ID || GOOGLE_TAG_ID.indexOf('GOOGLE_') === 0) return;
    if (window.gtag) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GOOGLE_TAG_ID);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GOOGLE_TAG_ID);
  }

  window.rqLoadTags = function () {
    if (consent() !== 'all') return;
    loadMeta();
    loadGoogle();
  };

  window.rqSetConsent = function (value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
    if (value === 'all') window.rqLoadTags();
  };

  window.rqFireLead = function () {
    if (consent() !== 'all') return;
    window.rqLoadTags();
    if (window.fbq) fbq('track', 'Lead');
    if (window.gtag) gtag('event', 'generate_lead', { currency: 'GBP', value: 0 });
  };

  function banner() {
    if (consent()) {
      if (consent() === 'all') window.rqLoadTags();
      return;
    }
    var el = document.createElement('div');
    el.id = 'rq-cookie';
    el.setAttribute('role', 'dialog');
    el.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#12231c;color:#fff;padding:1rem 1.25rem;z-index:9999;display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;justify-content:space-between;font:14px/1.4 system-ui,sans-serif';
    el.innerHTML = '<p style="margin:0;max-width:42rem">We use essential cookies to run this form. Analytics and ads tags (Meta, Google) load only if you accept. See <a href="cookies.html" style="color:#7fd3dc">Cookie Policy</a>.</p>' +
      '<div style="display:flex;gap:0.5rem;flex-wrap:wrap">' +
      '<button type="button" data-c="essential" style="background:transparent;color:#fff;border:1px solid #fff;border-radius:999px;padding:0.5rem 0.9rem;cursor:pointer">Essential only</button>' +
      '<button type="button" data-c="all" style="background:#0B6E4F;color:#fff;border:0;border-radius:999px;padding:0.5rem 0.9rem;cursor:pointer">Accept ads cookies</button>' +
      '</div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      window.rqSetConsent(b.getAttribute('data-c'));
      el.remove();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', banner);
  } else {
    banner();
  }
})();
