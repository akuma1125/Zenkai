// ZENKAI  Step 5: Screenshot & Share  then prompt to create/view account
import { navigate } from '../router.js';
import { getToken, persistCompletion } from '../auth.js';

export function renderStep5(container) {
  const result = localStorage.getItem('zenkai_result') || 'fcfs';
  const isLoggedIn = getToken();

  const resultData = {
    gtd: {
      badge: 'GTD',
      badgeClass: 'gtd',
      icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="#FFD700"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
      headline: 'Evolution Successful',
      tweetText: 'I just spun the ZENKAI Awakening Wheel \n\nEvolution chose me. GTD Allocation secured.\n\nDid evolution choose you? ',
    },
    fcfs: {
      badge: 'FCFS Access',
      badgeClass: 'fcfs',
      icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="#FF2233"><path d="M12 23c-4.97 0-9-3.58-9-8 0-2.53 1.19-4.78 3.06-6.32C6.58 7.72 7 6.39 7 5c0-.55.45-1 1-1 .28 0 .53.11.71.29C9.63 5.2 10 6.55 10 8c0 .55.45 1 1 1s1-.45 1-1V4c0-.55.45-1 1-1s1 .45 1 1v1c0 .55.45 1 1 1s1-.45 1-1V3c0-.55.45-1 1-1s1 .45 1 1v3c0 .55.45 1 1 1s1-.45 1-1V5c0-.55.45-1 1-1s1 .45 1 1c0 3.87-1.5 7.13-4 9.5V23h-5z"/></svg>',
      headline: 'Awakening Partial',
      tweetText: 'I just spun the ZENKAI Awakening Wheel \n\nAwakening Partial  FCFS access granted.\n\nDid evolution choose you? ',
    },
    fail: {
      badge: 'Try Again',
      badgeClass: 'fail',
      icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="#666"><path d="M12 2a9 9 0 0 0-9 9c0 3.07 1.54 5.78 3.9 7.43L8 22h8l1.1-3.57A9 9 0 0 0 21 11a9 9 0 0 0-9-9zm-2.5 8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-6 5h7s-1 2-3.5 2-3.5-2-3.5-2z"/></svg>',
      headline: 'Energy Unstable',
      tweetText: 'I just spun the ZENKAI Awakening Wheel \n\nThe orb wasn\'t ready for me  yet.\n\nWill it choose you? ',
    },
  };

  const rd = resultData[result] || resultData.fcfs;
  const tweetFull = rd.tweetText + '\n\nhttps://zenkai.art';
  const twitterUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweetFull);

  const el = document.createElement('div');
  el.className = 'card';

  const ctaHtml = isLoggedIn
    ? '<button class="btn-gold" id="step5-dashboard" style="display:inline-flex;align-items:center;gap:6px">View My Dashboard <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>'
    : '<div class="dash-cta-block"><p class="dash-cta-label">Save your result &amp; unlock referral spins</p><button class="btn-gold" id="step5-signup">Create Account</button><button class="btn-ghost" id="step5-login">Already have an account? Sign in</button></div>';

  el.innerHTML =
    '<div class="card-accent"></div>' +
    '<div class="brand-logo">ZENKAI</div>' +
    '<div class="brand-sub">awakening protocol</div>' +
    '<div class="step-indicator">' +
      '<div class="step-node done">1</div><div class="step-line done"></div>' +
      '<div class="step-node done">2</div><div class="step-line done"></div>' +
      '<div class="step-node done">3</div><div class="step-line done"></div>' +
      '<div class="step-node done">4</div><div class="step-line done"></div>' +
      '<div class="step-node active">5</div>' +
    '</div>' +
    '<span class="share-icon">' + rd.icon + '</span>' +
    '<span class="share-result-badge ' + rd.badgeClass + '">' + rd.badge + '</span>' +
    '<div class="step-title">' + rd.headline + '</div>' +
    '<p class="step-tagline" style="margin-bottom:16px">Share your result and prove evolution chose you.</p>' +
    '<div class="share-tweet-preview">' + rd.tweetText.replace(/\n/g, '<br>') + '<br><br><span style="color:var(--gold-dim)">https://zenkai.art</span></div>' +
    '<a href="' + twitterUrl + '" target="_blank" rel="noopener" class="btn-red" style="margin-bottom:14px">' +
      'Share Result on X &nbsp;' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' +
    '</a>' +
    ctaHtml +
    '<p style="font-size:0.72rem;color:var(--text-muted);letter-spacing:2px;text-transform:uppercase;margin-top:18px;opacity:0.55">the awakening begins.</p>';

  container.appendChild(el);

  document.getElementById('step5-dashboard') && document.getElementById('step5-dashboard').addEventListener('click', async function() { await persistCompletion(); navigate('/dashboard'); });
  document.getElementById('step5-signup') && document.getElementById('step5-signup').addEventListener('click', function() { navigate('/signup'); });
  document.getElementById('step5-login') && document.getElementById('step5-login').addEventListener('click', function() { navigate('/login'); });
}
