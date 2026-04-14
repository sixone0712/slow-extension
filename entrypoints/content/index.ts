import cssText from './style.css?inline';

export default defineContentScript({
  matches: ['*://flow.team/*'],
  runAt: 'document_end',
  async main() {
    if (!location.pathname.startsWith('/main.act')) return;

    const result = await browser.storage.local.get({ slowEnabled: true });
    const enabled = result.slowEnabled as boolean;

    localStorage.setItem('slowEnabled', String(enabled));

    if (!enabled) return;

    const style = document.createElement('style');
    style.textContent = cssText;
    document.head.appendChild(style);
  },
});
