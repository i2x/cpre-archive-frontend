import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap';
import '@/assets/styles.css';
import googleLogin from 'vue3-google-login';
import router from './router';

const app = createApp(App);

app.use(googleLogin, {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID // ✅ Load from .env
});

app.use(router);

app.mount('#app');
