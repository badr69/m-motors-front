import { api } from '../api.js';

let currentUser = null;

// ======================
// LOGIN
// ======================
export async function login(email, password) {

    const { status, data } = await api('/auth/login', 'POST', {
        email,
        password
    });

    if (status === 200) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("refreshToken", data.refresh_token);
        currentUser = data.user;
    }

    return { status, data };
}

// ======================
// LOGOUT
// ======================
export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    currentUser = null;
    window.location.href = "/views/auth/login.html";
}

// ======================
// CURRENT USER (CACHE)
// ======================
export async function getCurrentUser() {

    if (currentUser) return currentUser;

    const { status, data } = await api('/auth/currentUser', 'GET');

    if (status === 200) {
        currentUser = data;
        return data;
    }

    return null;
}

// ======================
// CLEAR CACHE
// ======================
export function clearCurrentUser() {
    currentUser = null;
}

// ======================
// FORM HANDLER (IMPORTANT FIX)
// ======================
export function handleAuthForms() {

    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    // LOGIN
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = loginForm.email.value;
            const password = loginForm.password.value;

            const res = await login(email, password);

            if (res.status === 200) {
                window.location.href = "/views/dashboard/admin-dashboard.html";
            }
        });
    }

    // REGISTER (placeholder safe)
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("Register form submitted");
        });
    }
}