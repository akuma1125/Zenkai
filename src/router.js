// ══════════════════════════════════════════════
// ZENKAI — Simple Hash Router
// ══════════════════════════════════════════════

const routes = {};
let appContainer;

export function registerRoute(path, renderFn) {
    routes[path] = renderFn;
}

export function navigate(path) {
    const app = document.getElementById('app');

    // Animate out
    const current = app.firstElementChild;
    if (current) {
        current.classList.add('page-exit');
        setTimeout(() => {
            window.location.hash = path;
        }, 300);
    } else {
        window.location.hash = path;
    }
}

export function initRouter() {
    appContainer = document.getElementById('app');

    function render() {
        const raw = window.location.hash.slice(1) || '/';
        const hash = raw.split('?')[0] || '/';
        const routeFn = routes[hash];

        if (routeFn) {
            appContainer.innerHTML = '';
            routeFn(appContainer);
        }
    }

    window.addEventListener('hashchange', render);
    render();
}
