import { api, ENDPOINTS } from '../api.js';

let currentUser = null;

// ======================
// LOGIN
// ======================
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

// ======================
// REGISTER (USER ONLY)
// ======================
export async function register(username, email, password, confirmPassword) {

    if (password !== confirmPassword) {
        return {
            status: 400,
            data: { message: "Passwords do not match" }
        };
    }

    return await api(ENDPOINTS.REGISTER, "POST", {
        username,
        email,
        password
    });
}

// ======================
// CURRENT USER
// ======================
export async function getCurrentUser() {

    if (currentUser) return currentUser;

    const res = await api(ENDPOINTS.CURRENT_USER, "GET");

    if (res.status === 200) {
        currentUser = res.data;
        return res.data;
    }

    return null;
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
// FORM HANDLERS (IMPORTANT)
// ======================
export function handleAuthForms() {

    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    // ======================
    // LOGIN FORM
    // ======================
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = loginForm.email.value;
            const password = loginForm.password.value;

            const res = await login(email, password);

            if (res.status === 200) {
                window.location.href = "/views/dashboard/admin-dashboard.html";
            } else {
                alert(res.data.message || "Login failed");
            }
        });
    }

    // ======================
    // REGISTER FORM
    // ======================
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = registerForm.username.value;
            const email = registerForm.email.value;
            const password = registerForm.password.value;
            const confirm = registerForm.confirm_password.value;

            const res = await register(username, email, password, confirm);

            if (res.status === 201) {
                alert("Account created ✔");
                window.location.href = "/views/auth/login.html";
            } else {
                alert(res.data.message || "



// import { api } from '../api.js';

// let currentUser = null;

// // ======================
// // LOGIN
// // ======================
// export async function login(email, password) {

//     const { status, data } = await api('/auth/login', 'POST', {
//         email,
//         password
//     });

//     if (status === 200) {
//         localStorage.setItem("token", data.access_token);
//         localStorage.setItem("refreshToken", data.refresh_token);
//         currentUser = data.user;
//     }

//     return { status, data };
// }

// // ======================
// // LOGOUT
// // ======================
// export function logout() {
//     localStorage.removeItem("token");
//     localStorage.removeItem("refreshToken");
//     currentUser = null;
//     window.location.href = "/views/auth/login.html";
// }

// // ======================
// // CURRENT USER (CACHE)
// // ======================
// export async function getCurrentUser() {

//     if (currentUser) return currentUser;

//     const { status, data } = await api('/auth/currentUser', 'GET');

//     if (status === 200) {
//         currentUser = data;
//         return data;
//     }

//     return null;
// }

// // ======================
// // CLEAR CACHE
// // ======================
// export function clearCurrentUser() {
//     currentUser = null;
// }

// // ======================
// // FORM HANDLER (IMPORTANT FIX)
// // ======================
// export function handleAuthForms() {

//     const loginForm = document.getElementById("login-form");
//     const registerForm = document.getElementById("register-form");

//     // LOGIN
//     if (loginForm) {
//         loginForm.addEventListener("submit", async (e) => {
//             e.preventDefault();

//             const email = loginForm.email.value;
//             const password = loginForm.password.value;

//             const res = await login(email, password);

//             if (res.status === 200) {
//                 window.location.href = "/views/dashboard/admin-dashboard.html";
//             }
//         });
//     }

//     // REGISTER (placeholder safe)
//     if (registerForm) {
//         registerForm.addEventListener("submit", (e) => {
//             e.preventDefault();
//             console.log("Register form submitted");
//         });
//     }
// }