console.log("API.JS VERSION FINAL");

const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

const API_BASE = isLocal
    ? "http://127.0.0.1:5001/api/v1"
    : "http://84.46.241.76/api/v1";

function getToken() {
    return localStorage.getItem("token");
}

// ======================
// API FUNCTION
// ======================
export async function api(endpoint, method = "GET", body = null) {

    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    };

    if (token && token !== "null" && token !== "undefined") {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });

        let json;
        try {
            json = await res.json();
        } catch {
            json = { message: "Invalid JSON response" };
        }

        console.log("[API]", endpoint, res.status, json);

        return {
            status: res.status,
            data: json.data ?? json,
            message: json.message ?? null,
            raw: json
        };

    } catch (err) {
        console.error("[API ERROR]", err);

        return {
            status: 0,
            data: null,
            message: "Network error",
            raw: null
        };
    }
}

// ======================
// ENDPOINTS (IMPORTANT)
// ======================
export const ENDPOINTS = {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    CURRENT_USER: "/auth/me"
};