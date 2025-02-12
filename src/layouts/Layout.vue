<template>
    <div class="navbar-container">
        <!-- 🌟 Minimalist Card Navbar -->
        <div class="nav-card">
            <div class="brand">
                <router-link to="/">CprE. Archive</router-link>
            </div>

            <div class="nav-links">
                <router-link to="/" class="nav-item" exact-active-class="active">Search</router-link>
                <router-link to="/curriculum" class="nav-item" exact-active-class="active">Curriculum</router-link>
                <router-link v-if="user" to="/notes" class="nav-item" exact-active-class="active">Notes</router-link>
                <router-link v-if="user" to="/course" class="nav-item" exact-active-class="active">Course</router-link>

            </div>

            <!-- 🌟 Auth Section -->
            <div class="auth-section">
                <template v-if="user">
                    <!-- ✅ Display Profile Picture -->
                    <img :src="`${user.picture}?sz=200`" alt="User Profile" class="profile-picture" />

                    <!-- ✅ Display User username -->
                    <span class="username"> {{ user.username }}</span>

                    <!-- ✅ Logout Button -->
                    <button @click="logout" class="btn btn-outline-danger btn-sm">Logout</button>
                </template>

                <template v-else>
                    <!-- ✅ Google Login Button -->
                    <GoogleLogin :callback="handleGoogleLogin" class="auth-btn" />

                    <!-- ✅ Get Token Button -->
                    <button v-if="isDebugMode" @click="getTokenByEmail" class="btn btn-outline-primary btn-sm">
                        Get Token
                    </button>
                </template>
            </div>
        </div>

        <!-- 🌟 Login Modal -->
        <div v-if="showLogin && !user" class="modal-overlay">
            <div class="modal-card">
                <h4>Login</h4>
                <GoogleLogin :callback="handleGoogleLogin" class="btn btn-primary w-100 mt-3" />
                <button @click="showLogin = false" class="btn btn-secondary w-100 mt-2">Cancel</button>
            </div>
        </div>

        <!-- 🌟 Page Content -->
        <div class="container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { GoogleLogin } from 'vue3-google-login';
import api from '@/utils/api'; 

export default {
    components: { GoogleLogin },

    data() {
        return {
            user: JSON.parse(localStorage.getItem('user')) || null,
            showLogin: false
        };
    },

    computed: {
        isDebugMode() {
            return import.meta.env.VITE_DEBUG_MODE === 'true';
        },
        testEmail() {
            return import.meta.env.VITE_TEST_EMAIL || "default@example.com";
        }
    },

    methods: {
        // ✅ Handle Google OAuth Login
        async handleGoogleLogin(response) {
            try {
                const token = response.credential;
                const res = await api.post('google-login/', { token }); // Use API instance

                localStorage.setItem('access_token', res.data.access);
                localStorage.setItem('refresh_token', res.data.refresh);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                this.user = res.data.user;

                this.showLogin = false;
            } catch (error) {
                console.error('❌ Login failed:', error);
            }
        },

        // ✅ Get Token by Email (For Testing in DEBUG Mode)
        async getTokenByEmail() {
            if (!this.isDebugMode) {
                console.warn('❌ DEBUG mode is disabled. getTokenByEmail() is not allowed.');
                return;
            }

            try {
                const res = await api.post('get-token/', { email: this.testEmail }); // Use API instance

                localStorage.setItem('access_token', res.data.access_token);
                localStorage.setItem('refresh_token', res.data.refresh_token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                this.user = res.data.user;

                console.log('✅ Token received:', res.data);
            } catch (error) {
                console.error('❌ Failed to get token:', error);
            }
        },

        // ✅ Logout Method
        logout() {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            this.user = null;
            window.location.href = '/'; // Reloads the entire page
        }
    }
};
</script>
