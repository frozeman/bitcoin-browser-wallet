// storage to keep data constent through wallet sessions (wallet popup openings)
this.storage = {};


// ADD ANALYTICS
// this is add to the background page,
// so we can be sure google wont see any keys in the wallet.html
// This will only once per browser session.
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-46803305-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

