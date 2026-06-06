console.log("🔥 AUTH.JS LOADED");

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
// CHECK AUTH
// ======================
export function isAuthenticated() {
    const token = localStorage.getItem("token");

    return !!token &&
        token !== "null" &&
        token !== "undefined";
}

// ======================
// JWT ROLE (OPTIONAL)
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

    // reset storage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // save
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);

    localStorage.setItem("user", JSON.stringify({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role // IMPORTANT
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

        // FORCE ROLE STABILITY
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

    window.location.href = "/views/auth/login.html";
}

// ======================
// LOGIN FORM HANDLER
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