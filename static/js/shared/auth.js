console.log("AUTH.JS LOADED");

import { api, ENDPOINTS } from "../api.js";

let currentUser = null;

// ======================
// LOG HELPERS
// ======================
const DEBUG = true;

function log(...args) {
    if (DEBUG) console.log("[AUTH]", ...args);
}

function warn(...args) {
    console.warn("[AUTH]", ...args);
}

function error(...args) {
    console.error("[AUTH]", ...args);
}

// ======================
// AUTH CHECK
// ======================
export function isAuthenticated() {
    const token = localStorage.getItem("token");

    return !!token &&
        token !== "null" &&
        token !== "undefined";
}

// ======================
// JWT ROLE
// ======================
function getRoleFromToken(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return (payload.role || "").toUpperCase();
    } catch {
        return "";
    }
}

// ======================
// LOGIN
// ======================
export async function login(email, password) {

    log("LOGIN START", email);

    const res = await api(ENDPOINTS.LOGIN, "POST", {
        email,
        password
    });

    log("LOGIN RESPONSE", res);

    if (!res || res.status !== 200) {
        warn("LOGIN FAILED");
        return res;
    }

    const token = res.data?.access_token;
    const refreshToken = res.data?.refresh_token;
    const user = res.data?.user;

    if (!token || !user) {
        error("INVALID LOGIN RESPONSE");
        return res;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);

    localStorage.setItem("user", JSON.stringify({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
    }));

    currentUser = user;

    log("LOGIN SUCCESS");

    return res;
}

// ======================
// CURRENT USER
// ======================
export async function getCurrentUser() {

    if (currentUser) return currentUser;

    const stored = localStorage.getItem("user");

    if (stored) {
        try {
            currentUser = JSON.parse(stored);
            return currentUser;
        } catch {
            localStorage.removeItem("user");
        }
    }

    const res = await api(ENDPOINTS.CURRENT_USER, "GET");

    if (res.status === 200) {
        const saved = JSON.parse(localStorage.getItem("user") || "{}");

        currentUser = {
            ...saved,
            ...res.data
        };

        currentUser.role = saved.role;

        return currentUser;
    }

    if (res.status === 401) {
        logout();
    }

    return null;
}

// ======================
// LOGOUT
// ======================
export function logout() {

    warn("LOGOUT");

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    currentUser = null;

    window.location.href = "/index.html";
}

// ======================================================
// REGISTER form
// ======================================================
export function handleRegisterForm() {

    const form = document.getElementById("register-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const feedback = document.querySelector(".feedback");
        if (!feedback) return;

        const password = document.getElementById("password").value;
        const confirm = document.getElementById("confirm_password").value;

        if (password !== confirm) {
            feedback.textContent = "Les mots de passe ne correspondent pas";
            return;
        }

        const payload = {
            username: document.getElementById("username").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            password
        };

       
        const res = await api(ENDPOINTS.REGISTER, "POST", payload);

        log("REGISTER RESPONSE", res);

        if (res.status === 201 || res.status === 200) {
            alert("Compte créé ✔");
            window.location.href = "/views/auth/login.html";
        } else {
            feedback.textContent = res.message || "Erreur inscription";
        }
    });
}

// ======================
// LOGIN FORM
// ======================
export function handleAuthForms() {

    const form = document.getElementById("login-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const res = await login(email, password);

        if (!res || res.status !== 200) {
            alert("Login failed");
            return;
        }

        const token = localStorage.getItem("token");
        const role = getRoleFromToken(token);

        log("ROLE =", role);

        if (role === "ADMIN") {
            window.location.href = "/views/dashboard/admin-dashboard.html";
        } else {
            window.location.href = "/views/dashboard/user-dashboard.html";
        }
    });
}