console.log("API.JS VERSION FINAL");

const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

const API_BASE = isLocal
    ? "http://127.0.0.1:5001/api/v1"
    : "http://84.46.241.76/api/v1";

const FILE_BASE = isLocal
    ? "http://127.0.0.1:5001"
    : "http://84.46.241.76";

    

function getToken() {
    return localStorage.getItem("token");
}

// ======================
// API FUNCTION 
// ======================
export async function api(endpoint, method = "GET", body = null, isFormData = false) {

    const token = getToken();

    const headers = {
        "Accept": "application/json"
    };

    // JWT
    if (token && token !== "null" && token !== "undefined") {
        headers["Authorization"] = `Bearer ${token}`;
    }

    // IMPORTANT: only JSON if NOT FormData
    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method,
            headers,
            body: body
                ? (isFormData ? body : JSON.stringify(body))
                : undefined
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
            error: json.error ?? null,
            raw: json
        };

    } catch (err) {
        console.error("[API ERROR]", err);

        return {
            status: 0,
            data: null,
            message: "Network error",
            error: "NETWORK_ERROR",
            raw: null
        };
    }
}

// ======================
// ENDPOINTS
// ======================
export const ENDPOINTS = {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    CURRENT_USER: "/auth/me"
};

export { FILE_BASE };
