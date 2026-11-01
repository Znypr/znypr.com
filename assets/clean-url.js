// Pages are served without .html (/gear, /fitness, ...). If someone arrives through an old .html link,
// show the clean address in the bar without reloading.
(function () {
  var path = location.pathname;
  if (!/\.html$/.test(path)) return;
  var clean = path.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  try { history.replaceState(history.state, '', (clean || '/') + location.search + location.hash); } catch (e) {}
})();
