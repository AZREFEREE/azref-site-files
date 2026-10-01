// Loader for the kb-faq.js page element. The real code lives in js/kb-faq.js in this repo,
// served by jsDelivr (Wix's code bundler breaks native custom element classes,
// so it can't be bundled here). Edit js/kb-faq.js, not this file.
(function () {
  var src = 'https://cdn.jsdelivr.net/gh/AZREFEREE/azref-site-files@main/js/kb-faq.js';
  if (document.querySelector('script[src="' + src + '"]')) return;
  var s = document.createElement('script');
  s.src = src;
  s.async = true;
  document.head.appendChild(s);
})();
