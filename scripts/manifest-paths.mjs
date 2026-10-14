// Explicit URLs avoid relying on Owlbear's relative URL resolution.
export function buildManifest(template, base = '/', siteUrl = '') {
  const prefix = !base || base === './' || base === '/' ? '/' : `/${base.replace(/^\/+|\/+$/g, '')}/`;
  if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(prefix)) throw new Error('Invalid manifest deployment base');
  let site = null;
  if (siteUrl) {
    site = new URL(siteUrl);
    if (site.protocol !== 'https:' || site.pathname !== prefix || site.search || site.hash || site.username || site.password)
      throw new Error('SITE_URL must be the HTTPS deployment base');
  }
  const path = value => {
    const pathname = prefix + value.replace(/^(?:\.\/|\/)+/, '');
    return site ? new URL(pathname, site).href : pathname;
  };
  return {
    ...template,
    icon: path(template.icon),
    action: {...template.action, icon: path(template.action.icon), popover: path(template.action.popover)},
    background_url: path(template.background_url),
  };
}
