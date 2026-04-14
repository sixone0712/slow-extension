import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <div class="popup">
    <div class="brand">
      <img src="/icon/300.png" class="app-icon" alt="Slow icon" />
      <div class="logo">SLOW</div>
    </div>
    <p class="tagline">Flow is Slow!</p>
    <div class="toggle-row">
      <span class="toggle-label">Extension</span>
      <label class="switch">
        <input type="checkbox" id="toggle" />
        <span class="slider"></span>
      </label>
    </div>
    <p class="status" id="status">Loading...</p>
  </div>
`;

const toggle = document.querySelector<HTMLInputElement>('#toggle')!;
const status = document.querySelector<HTMLParagraphElement>('#status')!;

function updateStatus(enabled: boolean) {
  status.textContent = enabled ? 'ON' : 'OFF';
  status.className = `status ${enabled ? 'on' : 'off'}`;
}

browser.storage.local.get({ slowEnabled: true }).then((result) => {
  const enabled = result.slowEnabled as boolean;
  toggle.checked = enabled;
  updateStatus(enabled);
});

toggle.addEventListener('change', async () => {
  const enabled = toggle.checked;
  await browser.storage.local.set({ slowEnabled: enabled });
  updateStatus(enabled);

  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: (val: boolean) => {
        localStorage.setItem('slowEnabled', String(val));
      },
      args: [enabled],
    });
    browser.tabs.reload(tab.id);
  }
});
