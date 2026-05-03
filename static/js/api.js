const API_BASE = "http://127.0.0.1:5001/api/v1";

export const ENDPOINTS = {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    CURRENT_USER: "/auth/currentUser",
};

function getToken() {
    return localStorage.getItem("token");
}

export async function api(endpoint, method = "GET", body = null) {

    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    };

    const token = getToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const res = await fetch(API_BASE + endpoint, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });

        let data = {};
        try {
            data = await res.json();
        } catch {}

        console.log("[API]", endpoint, res.status, data);

        return { status: res.status, data };

    } catch (err) {
        return { status: 500, data: { error: "Network error" } };
    }
}