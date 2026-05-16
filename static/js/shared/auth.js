import { api, ENDPOINTS } from '../api.js';

let currentUser = null;

//
// ======================
// AUTH GUARD
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

    if (res.status === 200) {
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("refreshToken", res.data.refresh_token);
        currentUser = res.data.user;
    }

    return res;
}

//
// ======================
// REGISTER
// ======================
//
export async function register(username, email, phone, address, password, confirmPassword) {

    if (password !== confirmPassword) {
        return {
            status: 400,
            data: { message: "Passwords do not match" }
        };
    }

    return await api(ENDPOINTS.REGISTER, "POST", {
        username,
        email,
        phone,
        address,
        password
    });
}

//
// ======================
// LOGOUT
// ======================
//
export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    currentUser = null;
    window.location.href = "/views/auth/login.html";
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

    const res = await api(ENDPOINTS.CURRENT_USER, "GET");

    if (res.status === 200) {
        currentUser = res.data;
        return res.data;
    }

    return null;
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
// FORM HANDLER
// ======================
//
export function handleAuthForms() {

    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    //
    // ======================
    // LOGIN
    // ======================
    //
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const res = await login(email, password);

            if (res.status === 200) {

                const role = (res.data.user.role || "").toUpperCase();

                localStorage.setItem("token", res.data.access_token);
                localStorage.setItem("refreshToken", res.data.refresh_token);

                if (role === "ADMIN") {
                    window.location.href = "/views/dashboard/admin-dashboard.html";
                } else {
                    window.location.href = "/views/dashboard/user-dashboard.html";
                }
            } else {
                alert(res.data.message || "Login failed");
            }
        });
    }

    //
    // ======================
    // REGISTER
    // ======================
    //
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = registerForm.username.value;
            const email = registerForm.email.value;
            const phone = registerForm.phone.value;
            const address = registerForm.address.value;
            const password = registerForm.password.value;
            const confirm = registerForm.confirm_password.value;

            const res = await register(
                username,
                email,
                phone,
                address,
                password,
                confirm
            );

            if (res.status === 201) {
                alert("Register success ✔");
                window.location.href = "/views/auth/login.html";
            } else {
                alert(res.data.message || "Register failed");
            }
        });
    }
}