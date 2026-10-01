#!/bin/bash
# Run from the repo root after changing any js/kb-*.js file:  bash tools/bump-version.sh
# Rewrites every Wix loader (src/public/custom-elements/kb-*.js) to load js/kb-*.js?v=<new version>,
# so visitors' browsers (which cache jsDelivr files for up to 7 days) pick up the change.
# Then commit + push, and purge jsDelivr (POST https://purge.jsdelivr.net/ with the js paths).
set -e
V=$(date -u +%Y%m%d%H%M)
for f in js/kb-*.js; do n=$(basename "$f"); cat > "src/public/custom-elements/$n" <<EOT
// Loader for the page element. The real code lives in js/$n in the azref-site-files GitHub repo and is
// served by jsDelivr (Wix's code bundler breaks native custom element classes, so it can't be bundled here).
// Edit js/$n, not this file. After changing any js/ file, run: bash tools/bump-version.sh
(function () {
  var VERSION = '$V';
  var src = 'https://cdn.jsdelivr.net/gh/AZREFEREE/azref-site-files@main/js/$n?v=' + VERSION;
  if (document.querySelector('script[src="' + src + '"]')) return;
  var s = document.createElement('script');
  s.src = src;
  s.async = true;
  document.head.appendChild(s);
})();
EOT
done
echo "loaders now at v=$V"
