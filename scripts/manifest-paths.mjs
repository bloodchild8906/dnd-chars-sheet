// Owlbear manifest URLs must work when resolved against the hosting origin.
// Do not assume that the manifest's containing folder is used as the base URL.
export function buildManifest(template, base = '/') {
  const prefix = !base || base === './' || base === '/' ? '/' : `/${base.replace(/^\/+|\/+$/g, '')}/`;
  if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(prefix)) throw new Error('Invalid manifest deployment base');
  const path = value => prefix + value.replace(/^(?:\.\/|\/)+/, '');
  return {
    ...template,
    icon: path(template.icon),
    action: {...template.action, icon: path(template.action.icon), popover: path(template.action.popover)},
    background_url: path(template.background_url),
  };
}
