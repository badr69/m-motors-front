console.log("🔥 AUTH.JS DEBUG MODE ACTIVATED");

import { api, ENDPOINTS } from "../api.js";

let currentUser = null;

//
// ======================
// GLOBAL DEBUG HELPERS
// ======================
//
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
// LOGIN
// ======================
//
export async function login(email, password) {

    log("LOGIN START", { email, password });

    const res = await api(ENDPOINTS.LOGIN, "POST", {
        email,
        password
    });

    log("RAW API RESPONSE =", res);
    log("RESPONSE STATUS =", res?.status);
    log("RESPONSE DATA =", res?.data);

    if (!res || res.status !== 200) {
        warn("LOGIN FAILED RESPONSE =", res);
        return res;
    }

    const token = res.data?.access_token;
    const refreshToken = res.data?.refresh_token;
    const user = res.data?.user;

    log("TOKEN =", token);
    log("REFRESH TOKEN =", refreshToken);
    log("USER OBJECT =", user);

    if (!user) {
        error("USER IS NULL FROM BACKEND");
    }

    if (token) {
        localStorage.setItem("token", token);
        log("TOKEN SAVED");
    }

    if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
        log("REFRESH TOKEN SAVED");
    }

    if (user) {
        currentUser = user;

        localStorage.setItem("user", JSON.stringify(user));

        log("USER SAVED IN LOCALSTORAGE");
    }

    log("LOGIN END STATE =", {
        currentUser,
        localStorageUser: localStorage.getItem("user")
    });

    return res;
}

//
// ======================
// CURRENT USER
// ======================
//
export async function getCurrentUser() {

    log("GET CURRENT USER START");

    if (currentUser) {
        log("CACHE HIT USER =", currentUser);
        return currentUser;
    }

    const token = localStorage.getItem("token");

    log("TOKEN FOR USER FETCH =", token);

    if (!token) {
        warn("NO TOKEN FOUND");
        return null;
    }

    const stored = localStorage.getItem("user");

    log("LOCALSTORAGE USER =", stored);

    if (stored) {
        try {
            currentUser = JSON.parse(stored);
            log("PARSED USER =", currentUser);
            return currentUser;
        } catch (err) {
            error("USER PARSE ERROR", err);
            localStorage.removeItem("user");
        }
    }

    const res = await api(ENDPOINTS.CURRENT_USER, "GET");

    log("CURRENT USER API RESPONSE =", res);

    if (res.status === 200) {
        currentUser = res.data;

        localStorage.setItem("user", JSON.stringify(currentUser));

        return currentUser;
    }

    if (res.status === 401) {
        warn("401 -> LOGOUT TRIGGERED");
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

    warn("LOGOUT TRIGGERED");

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    currentUser = null;

    window.location.href = "/views/auth/login.html";
}

//
// ======================
// CLEAR CACHE
// ======================
//
export function clearCurrentUser() {
    log("CACHE CLEARED");
    currentUser = null;
}

//
// ======================
// FORM HANDLER (BUG HUNT ZONE)
// ======================
//
export function handleAuthForms() {

    log("FORM HANDLER INIT");

    const loginForm = document.getElementById("login-form");

    if (!loginForm) {
        warn("LOGIN FORM NOT FOUND");
        return;
    }

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        log("FORM SUBMIT TRIGGERED");

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        log("FORM DATA =", { email, password });

        const res = await login(email, password);

        log("LOGIN RETURN =", res);
        log("LOGIN DATA =", res?.data);

        if (!res || res.status !== 200) {
            error("LOGIN FAILED");
            alert("Login failed");
            return;
        }

        const user = res.data?.user;

        log("EXTRACTED USER =", user);

        if (!user) {
            error("NO USER FOUND IN RESPONSE");
            alert("No user returned by API");
            return;
        }

        // ======================
        // 🔥 CRITICAL DEBUG ZONE
        // ======================

        log("RAW ROLE VALUE =", user.role);
        log("ROLE TYPE =", typeof user.role);
        log("ROLE JSON =", JSON.stringify(user.role));

        const role = String(user.role || "")
            .trim()
            .toUpperCase();

        log("NORMALIZED ROLE =", role);

        log("FINAL DECISION CHECK =", {
            isAdmin: role === "ADMIN",
            isUser: role !== "ADMIN"
        });

        // ======================
        // REDIRECT
        // ======================

        if (role === "ADMIN") {

            warn("REDIRECT -> ADMIN DASHBOARD");

            window.location.href =
                "/views/dashboard/admin-dashboard.html";

        } else {

            warn("REDIRECT -> USER DASHBOARD");

            window.location.href =
                "/views/dashboard/user-dashboard.html";
        }
    });
}