import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './assets/main.css';
import { useUIStore } from './shared/stores/useUIStore';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

const ui = useUIStore(pinia);
ui.initializeTheme();

app.mount('#app');

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
}
