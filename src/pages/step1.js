import { navigate } from '../router.js';

const PASSWORD_SESSION_KEY = 'zenkai_password_verified';
const ETH_RE = /^0x[a-fA-F0-9]{40}$/;
const TWEET_RE = /https?:\/\/(www\.)?(x\.com|twitter\.com|mobile\.twitter\.com)\/\w+\/status\/\d+/i;

const tasks = [
  {
    id: 'follow',
    label: 'Follow <a href="https://x.com/zenkai_ETH" target="_blank" rel="noopener">@zenkai_ETH</a> on X',
  },
  {
    id: 'rt',
    label: 'Like and Retweet <a href="https://x.com/zenkai_eth/status/2031739073694454013" target="_blank" rel="noopener">this post</a> and tag 2 friends',
  },
  {
    id: 'quote',
    label: 'Quote <a href="https://x.com/zenkai_eth/status/2031739073694454013" target="_blank" rel="noopener">this post</a> (caption "Zenk it") and paste the link below',
  },
];

export function renderStep1(container) {
  if (sessionStorage.getItem(PASSWORD_SESSION_KEY) !== 'true') {
    navigate('/login');
    return;
  }

  const handle = sessionStorage.getItem('zenkai_handle') || '';
  const completed = new Set();
  const linkClicked = new Set();

  const el = document.createElement('div');
  el.className = 'card card-long';
  el.innerHTML = `
    <div class="card-accent"></div>
    <div class="brand-logo">ZENKAI</div>
    <div class="brand-sub">awakening protocol</div>

    <div class="step-title">Begin Awakening</div>
    <p class="step-tagline">Enter your username, complete the tasks, and submit your wallet in one scroll.</p>

    <div class="flow-section">
      <div class="flow-section-header">
        <span class="flow-section-num">01</span>
        <div>
          <h3>Username</h3>
          <p>Start with your X handle.</p>
        </div>
      </div>

      <p class="nft-label">- collection preview -</p>
      <div class="nft-strip">
        <div class="nft-thumb" data-n="01"><img src="/77f70ec7-eb8e-44ed-9aee-af98932591af.jpg" alt="ZENKAI #01" /></div>
        <div class="nft-thumb" data-n="02"><img src="/9c0a9206-d63d-4d34-bc9b-4188eb44dee3.jpg" alt="ZENKAI #02" /></div>
        <div class="nft-thumb" data-n="03"><img src="/be87c65b-fe0d-4189-bacf-8fd22b8dd2db.jpg" alt="ZENKAI #03" /></div>
        <div class="nft-thumb" data-n="04"><img src="/dafc48fc-9308-42d8-9361-bb2922edf03b.jpg" alt="ZENKAI #04" /></div>
      </div>

      <div class="input-group">
        <label for="username-input">X Username</label>
        <input
          type="text"
          id="username-input"
          class="input-field"
          placeholder="@yourhandle"
          autocomplete="off"
          spellcheck="false"
          maxlength="50"
          value="${handle}"
        />
        <p class="input-error" id="username-error">Enter a valid username</p>
      </div>
    </div>

    <div class="flow-section">
      <div class="flow-section-header">
        <span class="flow-section-num">02</span>
        <div>
          <h3>Tasks</h3>
          <p>Complete each action below, then keep scrolling.</p>
        </div>
      </div>

      <ul class="task-list" id="task-list">
        ${tasks.map((task) => `
          <li class="task-item" data-id="${task.id}">
            <div class="task-checkbox">
              <span class="task-check-mark"></span>
            </div>
            <span class="task-label">${task.label}</span>
          </li>
        `).join('')}
      </ul>

      <div class="input-group" style="margin-top:8px">
        <label for="quote-link-input">Quote Tweet Link</label>
        <input
          type="url"
          id="quote-link-input"
          class="input-field"
          placeholder="https://x.com/..."
          autocomplete="off"
          spellcheck="false"
        />
      </div>

      <p class="task-hint" id="task-hint"></p>
    </div>

    <div class="flow-section">
      <div class="flow-section-header">
        <span class="flow-section-num">03</span>
        <div>
          <h3>Wallet</h3>
          <p>Submit your wallet after the username and tasks are complete.</p>
        </div>
      </div>

      <div class="input-group">
        <label for="wallet-input">EVM Wallet Address</label>
        <input
          type="text"
          id="wallet-input"
          class="input-field"
          placeholder="0x..."
          autocomplete="off"
          spellcheck="false"
          maxlength="42"
        />
        <p class="input-error" id="wallet-error">Enter a valid 0x wallet address</p>
      </div>

      <div class="wallet-handle-row">
        <span class="wallet-handle-label">Submitting as</span>
        <span class="wallet-handle-value" id="wallet-handle-value">${handle || '@yourhandle'}</span>
      </div>

      <button class="btn-gold" id="submit-btn" disabled>Submit Wallet</button>

      <p class="wallet-disclaimer">
        Only EVM-compatible wallets (Ethereum / Base / etc.). One wallet per handle.
      </p>

    </div>
  `;
  container.appendChild(el);

  const usernameInput = document.getElementById('username-input');
  const usernameError = document.getElementById('username-error');
  const walletHandleValue = document.getElementById('wallet-handle-value');
  const taskHint = document.getElementById('task-hint');
  const taskItems = document.querySelectorAll('.task-item');
  const quoteLinkInput = document.getElementById('quote-link-input');
  const walletInput = document.getElementById('wallet-input');
  const walletError = document.getElementById('wallet-error');
  const submitBtn = document.getElementById('submit-btn');

  function showHint(message) {
    taskHint.textContent = message;
    taskHint.classList.add('visible');
    clearTimeout(taskHint._t);
    taskHint._t = setTimeout(() => taskHint.classList.remove('visible'), 3000);
  }

  function getNormalizedHandle() {
    const raw = usernameInput.value.trim().replace(/^@/, '');
    return raw ? `@${raw}` : '';
  }

  function updateSubmitState() {
    const handle = getNormalizedHandle();
    walletHandleValue.textContent = handle || '@yourhandle';
    submitBtn.disabled = !(handle && completed.size === tasks.length && ETH_RE.test(walletInput.value.trim()));
  }

  function checkQuoteInput() {
    const val = quoteLinkInput.value.trim();
    const quoteItem = document.querySelector('.task-item[data-id="quote"]');
    if (TWEET_RE.test(val)) {
      completed.add('quote');
      quoteItem.classList.add('completed');
    } else {
      completed.delete('quote');
      quoteItem.classList.remove('completed');
    }
    updateSubmitState();
  }

  usernameInput.addEventListener('input', () => {
    usernameError.classList.remove('visible');
    sessionStorage.setItem('zenkai_handle', getNormalizedHandle());
    updateSubmitState();
  });

  quoteLinkInput.addEventListener('input', checkQuoteInput);
  quoteLinkInput.addEventListener('paste', () => setTimeout(checkQuoteInput, 0));
  quoteLinkInput.addEventListener('change', checkQuoteInput);

  taskItems.forEach((item) => {
    const id = item.dataset.id;
    const link = item.querySelector('a');

    if (link) {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        linkClicked.add(id);
        item.classList.add('link-visited');
      });
    }

    item.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') return;

      if (id === 'quote') {
        showHint('Paste your quote tweet link below this task.');
        quoteLinkInput.focus();
        return;
      }

      if (!linkClicked.has(id)) {
        showHint('Complete the action first, warrior.');
        item.classList.add('shake');
        setTimeout(() => item.classList.remove('shake'), 500);
        return;
      }

      if (completed.has(id)) {
        completed.delete(id);
        item.classList.remove('completed');
      } else {
        completed.add(id);
        item.classList.add('completed');
      }

      updateSubmitState();
    });
  });

  walletInput.addEventListener('input', () => {
    walletInput.classList.remove('error');
    walletError.classList.remove('visible');
    updateSubmitState();
  });

  async function submitWallet() {
    const handle = getNormalizedHandle();
    const address = walletInput.value.trim();

    if (!handle) {
      usernameError.classList.add('visible');
      usernameInput.focus();
      return;
    }

    if (!ETH_RE.test(address)) {
      walletInput.classList.add('error');
      walletError.classList.add('visible');
      walletInput.focus();
      return;
    }

    if (completed.size !== tasks.length) {
      showHint('Finish all tasks before submitting your wallet.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      const res = await fetch('/api/allowlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, handle, tier: 'fcfs' }),
      });

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem('zenkai_handle', handle);
        sessionStorage.setItem('zenkai_quote_url', quoteLinkInput.value.trim());
        localStorage.setItem('zenkai_submitted_wallet', address);
        navigate('/step5');
        return;
      }

      walletInput.classList.add('error');
      walletError.textContent = data.message || 'Submission failed. Try again.';
      walletError.classList.add('visible');
    } catch {
      walletError.textContent = 'Connection error. Check your network and retry.';
      walletError.classList.add('visible');
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Wallet';
  }

  submitBtn.addEventListener('click', submitWallet);
  walletInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !submitBtn.disabled) submitWallet();
  });

  requestAnimationFrame(() => usernameInput.focus());
  updateSubmitState();
}
