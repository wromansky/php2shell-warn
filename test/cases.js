// Page signals and what both the userscript and the bookmarklet must conclude from them.
module.exports = [
  { name: 'versioned header', page: { h: { 'x-powered-by': 'PHP/8.3.35' } }, version: '8.3.35', evidence: ['PHP/8.3.35 header'] },
  { name: 'version in Server', page: { h: { server: 'Apache PHP/7.4.33' } }, version: '7.4.33', evidence: ['PHP/7.4.33 header'] },
  { name: 'PHP without version', page: { h: { 'x-powered-by': 'PHP' } }, version: undefined, evidence: ['X-Powered-By: PHP'] },
  { name: 'wordpress header', page: { h: { 'x-pingback': 'https://x.test/xmlrpc.php' } }, version: undefined, evidence: ['wordpress'] },
  { name: 'wordpress rest link', page: { h: { link: '<https://x.test/wp-json/>; rel="https://api.w.org/"' } }, version: undefined, evidence: ['wordpress'] },
  { name: 'wordpress assets', page: { assets: 'https://x.test/wp-content/themes/a.css' }, version: undefined, evidence: ['wordpress'] },
  { name: 'drupal header', page: { h: { 'x-drupal-cache': 'HIT' } }, version: undefined, evidence: ['drupal'] },
  { name: 'generator meta', page: { generator: 'Joomla! - Open Source CMS' }, version: undefined, evidence: ['joomla'] },
  { name: 'session cookie', page: { cookie: 'a=1; PHPSESSID=abc' }, version: undefined, evidence: ['PHPSESSID cookie'] },
  { name: 'php url', page: { path: '/shop/index.php' }, version: undefined, evidence: ['.php URL'] },
  { name: 'several signals', page: { h: { 'x-pingback': 'x' }, generator: 'WordPress 6.5', path: '/index.php' }, version: undefined, evidence: ['wordpress', '.php URL'] },
  { name: 'plain site', page: { h: { server: 'nginx' }, assets: 'https://x.test/app.js', cookie: 'a=1', path: '/about' }, version: undefined, evidence: [] },
];
