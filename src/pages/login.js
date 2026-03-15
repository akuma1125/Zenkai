import { navigate } from '../router.js';

const ACCESS_PASSWORD = 'ZENK';
const PASSWORD_SESSION_KEY = 'zenkai_password_verified';

export function renderLogin(container) {
  if (sessionStorage.getItem(PASSWORD_SESSION_KEY) === 'true') {
    navigate('/step1');
    return;
  }

  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `
    <div class="card-accent"></div>
    <div class="brand-logo">ZENKAI</div>
    <div class="brand-sub">awakening protocol</div>

    <div class="step-title">Access Portal</div>
    <p class="step-tagline">Enter the password to continue to the username step</p>

    <div class="input-group">
      <label for="password-input">Password</label>
      <input
        type="password"
        id="password-input"
        class="input-field"
        placeholder="Enter password"
        autocomplete="off"
        spellcheck="false"
      />
      <p class="input-error" id="password-error">Incorrect password</p>
    </div>

    <button class="btn-gold" id="login-next" disabled>
      Continue
    </button>
  `;
  container.appendChild(el);

  const input = document.getElementById('password-input');
  const errorEl = document.getElementById('password-error');
  const nextBtn = document.getElementById('login-next');

  input.addEventListener('input', () => {
    nextBtn.disabled = input.value.trim().length < 1;
    errorEl.classList.remove('visible');
    input.classList.remove('error');
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !nextBtn.disabled) nextBtn.click();
  });

  nextBtn.addEventListener('click', () => {
    if (input.value.trim() !== ACCESS_PASSWORD) {
      input.classList.add('error');
      errorEl.classList.add('visible');
      return;
    }

    sessionStorage.setItem(PASSWORD_SESSION_KEY, 'true');
    navigate('/step1');
  });

  requestAnimationFrame(() => input.focus());
}
