import { api, ENDPOINTS } from "../api.js";

let currentUser = null;

//
// ======================
// AUTH STATE
// ======================
//
export function isAuthenticated() {
    return !!localStorage.getItem("token");
}

//
// ======================
// LOGIN
// ======================
//
export async function login(email, password) {

    const res = await api(ENDPOINTS.LOGIN, "POST", {
        email,
        password
    });

    console.log("[LOGIN RAW RESPONSE]", res);

    if (!res || res.status !== 200) {
        return res;
    }

    const token = res.data?.access_token;
    const refreshToken = res.data?.refresh_token;
    const user = res.data?.user;

    // 🔥 STORE TOKEN
    if (token) {
        localStorage.setItem("token", token);
    }

    if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
    }

    // 🔥 STORE USER
    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        currentUser = user;
    }

    return res;
}

//
// ======================
// CURRENT USER
// ======================
//
export async function getCurrentUser() {

    if (currentUser) return currentUser;

    const token = localStorage.getItem("token");
    if (!token) return null;

    const stored = localStorage.getItem("user");
    if (stored) {
        currentUser = JSON.parse(stored);
        return currentUser;
    }

    const res = await api(ENDPOINTS.CURRENT_USER, "GET");

    if (res.status === 200) {
        currentUser = res.data;

        localStorage.setItem(
            "user",
            JSON.stringify(currentUser)
        );

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
    localStorage.clear();
    currentUser = null;
    window.location.href = "/views/auth/login.html";
}

//
// ======================
// CLEAR CACHE
// ======================
//
export function clearCurrentUser() {
    currentUser = null;
}

//
// ======================
// LOGIN FORM HANDLER
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

        console.log("[LOGIN RESPONSE]", res);

        if (!res || res.status !== 200) {
            alert(res?.data?.message || "Login failed");
            return;
        }

        // 🔥 SAFE USER FETCH
        const user = res.data?.user;

        if (!user) {
            alert("User missing in response");
            return;
        }

        localStorage.setItem("user", JSON.stringify(user));

        const role = String(user.role || "").toUpperCase();

        console.log("[AUTH ROLE]", role);

        if (role === "ADMIN") {
            window.location.href = "/views/dashboard/admin-dashboard.html";
        } else {
            window.location.href = "/views/dashboard/user-dashboard.html";
        }
    });
}