const API_BASE = "http://127.0.0.1:5001/api/v1";

// ======================
// ENDPOINTS
// ======================
export const ENDPOINTS = {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    CURRENT_USER: "/auth/currentUser",
};

// ======================
// TOKEN
// ======================
function getToken() {
    return localStorage.getItem("token");
}

// ======================
// MAIN API FUNCTION
// ======================
export async function api(endpoint, method = "GET", body = null) {

    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
    };

    try {
        const res = await fetch(API_BASE + endpoint, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });

        // ======================
        // SAFE JSON PARSE
        // ======================
        let data;
        try {
            data = await res.json();
        } catch {
            data = {};
        }

        console.log("[API]", endpoint, res.status, data);

        // ======================
        // AUTO HANDLE 401 (IMPORTANT)
        // ======================
        if (res.status === 401) {
            console.warn("Unauthorized → clearing token");

            localStorage.removeItem("token");

            // optionnel: redirect login
            // window.location.href = "/login.html";
        }

        return {
            status: res.status,
            data
        };

    } catch (err) {
        console.error("[API ERROR]", err);

        return {
            status: 500,
            data: { error: "Network error" }
        };
    }
}