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

    if (res.status === 200 && res.data?.access_token) {

        // SAVE TOKENS
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("refreshToken", res.data.refresh_token || "");

        // SAVE USER
        currentUser = res.data.user || null;

        localStorage.setItem(
            "user",
            JSON.stringify(currentUser)
        );

        console.log("[AUTH] login success:", currentUser);
    }

    return res;
}

//
// ======================
// REGISTER
// ======================
//
export async function register(
    username,
    email,
    phone,
    address,
    password,
    confirmPassword
) {

    if (password !== confirmPassword) {
        return {
            status: 400,
            data: {
                message: "Passwords do not match"
            }
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
    localStorage.removeItem("user");

    currentUser = null;

    console.log("[AUTH] logout");

    window.location.href = "/views/auth/login.html";
}

//
// ======================
// CURRENT USER
// ======================
//
export async function getCurrentUser() {

    // CACHE MEMORY
    if (currentUser) {
        return currentUser;
    }

    // CACHE LOCALSTORAGE
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
        currentUser = JSON.parse(storedUser);

        console.log("[AUTH] user from localStorage:", currentUser);

        return currentUser;
    }

    // TOKEN CHECK
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("[AUTH] no token");
        return null;
    }

    // API FALLBACK
    const res = await api(ENDPOINTS.CURRENT_USER, "GET");

    if (res && res.status === 200) {

        currentUser = res.data;

        localStorage.setItem(
            "user",
            JSON.stringify(currentUser)
        );

        console.log("[AUTH] user from API:", currentUser);

        return currentUser;
    }

    // TOKEN INVALID
    if (res?.status === 401) {
        logout();
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
    // LOGIN FORM
    // ======================
    //
    if (loginForm) {

        loginForm.addEventListener("submit", async (e) => {

            e.preventDefault();

            const email =
                document.getElementById("email").value;

            const password =
                document.getElementById("password").value;

            const res = await login(email, password);

            if (res.status === 200) {

                const role =
                    (res.data?.user?.role || "")
                        .toUpperCase();

                console.log("[AUTH] role:", role);

                if (role === "ADMIN") {

                    window.location.href =
                        "/views/dashboard/admin-dashboard.html";

                } else {

                    window.location.href =
                        "/views/dashboard/user-dashboard.html";
                }

            } else {

                alert(
                    res.data?.message || "Login failed"
                );
            }
        });
    }

    //
    // ======================
    // REGISTER FORM
    // ======================
    //
    if (registerForm) {

        registerForm.addEventListener("submit", async (e) => {

            e.preventDefault();

            const username =
                registerForm.username.value;

            const email =
                registerForm.email.value;

            const phone =
                registerForm.phone.value;

            const address =
                registerForm.address.value;

            const password =
                registerForm.password.value;

            const confirm =
                registerForm.confirm_password.value;

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

                window.location.href =
                    "/views/auth/login.html";

            } else {

                alert(
                    res.data?.message || "Register failed"
                );
            }
        });
    }
}
