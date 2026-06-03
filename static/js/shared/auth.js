console.log("🔥 AUTH.JS DEBUG MODE ACTIVATED");

import { api, ENDPOINTS } from "../api.js";

let currentUser = null;

const DEBUG = true;

function log(...args) {
    if (DEBUG) console.log("[AUTH DEBUG]", ...args);
}

function warn(...args) {
    console.warn("[AUTH WARN]", ...args);
}

function error(...args) {
    console.error("[AUTH ERROR]", ...args);
}

//
// ======================
// AUTH STATE
// ======================
//
export function isAuthenticated() {

    const token = localStorage.getItem("token");

    log("TOKEN CHECK =", token);

    return !!token &&
        token !== "null" &&
        token !== "undefined";
}

//
// ======================
// ROLE FROM JWT (SOURCE UNIQUE)
// ======================
//
function getRoleFromToken(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return (payload.role || "").toUpperCase();
    } catch (e) {
        console.error("JWT decode error", e);
        return "";
    }
}

//
// ======================
// LOGIN
// ======================
//
export async function login(email, password) {

    log("LOGIN START", { email, password });

    const res = await api(ENDPOINTS.LOGIN, "POST", {
        email,
        password
    });

    log("API RESPONSE =", res);

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

    // RESET SESSION PROPRE
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // SAVE TOKEN ONLY
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);

    // SAVE USER (STABLE VERSION)
    localStorage.setItem("user", JSON.stringify({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role // ⚠️ FIX IMPORTANT: jamais modifié après
    }));

    currentUser = user;

    log("LOGIN SUCCESS");

    return res;
}

//
// ======================
// CURRENT USER (SAFE)
// ======================
//
export async function getCurrentUser() {

    log("GET CURRENT USER");

    if (currentUser) return currentUser;

    const stored = localStorage.getItem("user");

    if (stored) {
        try {
            currentUser = JSON.parse(stored);
            return currentUser;
        } catch (e) {
            localStorage.removeItem("user");
        }
    }

    const res = await api(ENDPOINTS.CURRENT_USER, "GET");

    if (res.status === 200) {

        // ❌ NE PAS ÉCRASER ROLE
        currentUser = {
            ...JSON.parse(localStorage.getItem("user") || "{}"),
            ...res.data,
        };

        // 🔒 force role from localStorage (stable)
        const saved = JSON.parse(localStorage.getItem("user") || "{}");
        currentUser.role = saved.role;

        return currentUser;
    }

    if (res.status === 401) {
        logout();
    }

    return null;
}

//
// ======================
// LOGOUT
// ======================
//
export function logout() {

    warn("LOGOUT");

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    currentUser = null;

    window.location.href = "/views/auth/login.html";
}

//
// ======================
// FORM HANDLER
// ======================
//
export function handleAuthForms() {

    const loginForm = document.getElementById("login-form");

    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {

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