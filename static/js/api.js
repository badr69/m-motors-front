// const isLocal =
//     window.location.hostname === "localhost" ||
//     window.location.hostname === "127.0.0.1";

// const API_BASE = isLocal
//     ? "http://127.0.0.1:5001/api/v1"
//     : "http://84.46.241.76:5000/api/v1";
// const API_BASE = "/api/v1";
// const API_BASE = "http://localhost:5001/api/v1";
// const isLocal =
//     window.location.hostname === "localhost" ||
//     window.location.hostname === "127.0.0.1";

// const API_BASE = isLocal
//     ? "http://localhost:5001/api/v1"
//     : "/api/v1";

const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

const API_BASE = isLocal
    ? "http://localhost:5001/api/v1"
    : "/api/v1";

function getToken() {
    return localStorage.getItem("token");
}

export const ENDPOINTS = {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    CURRENT_USER: "/auth/currentUser",
    CONTACT: "/contact"
};

export async function api(endpoint, method = "GET", body = null) {

    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    };

    const token = getToken();

    if (token && token !== "null" && token !== "undefined") {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {

        const res = await fetch(API_BASE + endpoint, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });

        let data = null;

try {
    data = await res.json();
} catch (e) {
    data = { message: "Invalid response" };
}

if (!res.ok) {
    console.log("[API ERROR]", endpoint, res.status, data);
}

        console.log("[API]", endpoint, res.status, data);

        return { status: res.status, data };

    } catch (err) {

        console.error("[API ERROR]", err);

        return {
            status: 0,
            data: { error: "Network error" }
        };
    }
}