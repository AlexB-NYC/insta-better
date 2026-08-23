const assert = require('assert');
const fs = require('fs');

const source = fs.readFileSync('content.js', 'utf8');
const styles = fs.readFileSync('content.css', 'utf8');

assert.ok(/const STANDARD_CARD_SELECTOR = 'article, div\[role="dialog"\]';/.test(source), 'working feed and dialog selectors remain unchanged');
assert.ok(/const CARD_SELECTOR = `\$\{STANDARD_CARD_SELECTOR\}, \$\{STANDALONE_CARD_SELECTOR\}`;/.test(source), 'only an extension-owned standalone marker extends card discovery');
assert.ok(!/STANDARD_CARD_SELECTOR = .*main\[role/.test(source), 'main is not treated as a generic post card');
assert.ok(/function findStandalonePostCard\(\).*?parsePostPermalinkPath\(location\.href\).*?main\[role="main"\].*?time\[datetime\].*?findBindableMedia\(candidate\).*?setAttribute\(STANDALONE_CARD_ATTRIBUTE, pagePath\)/s.test(source), 'standalone discovery is permalink-gated and reuses media eligibility');
assert.ok(/function getPostPath\(card\).*?STANDALONE_CARD_ATTRIBUTE.*?parsePostPermalinkPath\(standalonePath\)/s.test(source), 'standalone cards retain their canonical post path');
assert.ok(/function collectAffectedCards\(mutations\).*?findStandalonePostCard\(\).*?!registrations\.has\(standalone\)/s.test(source), 'mutation discovery registers a standalone card once');
assert.ok(/function getCardType\(card\).*?'standalone'/.test(source), 'diagnostics identify standalone cards');
assert.ok(/\[data-igfs-standalone-card\]:hover \.igfs-toggle-btn/.test(styles), 'standalone hover reveals the fullscreen control');
assert.ok(/\[data-igfs-standalone-card\]:hover \.igfs-control-btn/.test(styles), 'standalone hover reveals all post controls');

console.log('standalone post static regression tests passed');
