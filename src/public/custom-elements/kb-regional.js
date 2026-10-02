// Loader for the page element. The real code lives in js/kb-regional.js in the azref-site-files GitHub repo and is
// served by jsDelivr (Wix's code bundler breaks native custom element classes, so it can't be bundled here).
// Edit js/kb-regional.js, not this file. After changing any js/ file, run: bash tools/bump-version.sh
(function () {
  var VERSION = '202610021910';
  var src = 'https://cdn.jsdelivr.net/gh/AZREFEREE/azref-site-files@main/js/kb-regional.js?v=' + VERSION;
  if (document.querySelector('script[src="' + src + '"]')) return;
  var s = document.createElement('script');
  s.src = src;
  s.async = true;
  document.head.appendChild(s);
})();
