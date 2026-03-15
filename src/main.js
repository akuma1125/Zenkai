import './style.css';
import { initScene } from './scene.js';
import { registerRoute, navigate, initRouter } from './router.js';
import { renderLogin } from './pages/login.js';
import { renderStep1 } from './pages/step1.js';
import { renderStep5 } from './pages/step5.js';

initScene();

registerRoute('/', () => navigate('/login'));
registerRoute('/login', renderLogin);
registerRoute('/step1', renderStep1);
registerRoute('/step5', renderStep5);

initRouter();
