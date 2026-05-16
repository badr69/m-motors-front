const API_BASE = "/api/v1";

function getToken() {
    return localStorage.getItem("token");
}

export const ENDPOINTS = {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    CURRENT_USER: "/auth/me",
    CONTACT: "/contact"
};

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

    } catch {
        return { status: 500, data: { error: "Network error" } };
    }
}