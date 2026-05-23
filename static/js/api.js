function getToken() {
    return localStorage.getItem("token");
}

export const ENDPOINTS = {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    CURRENT_USER: "/auth/currentUser",
    CONTACT: "/contact"
};

// 🔥 API BASE (LOCAL + VPS AUTO SWITCH)
const API_BASE = window.location.hostname === "localhost"
    ? "http://127.0.0.1:5001/api/v1"
    : "http://84.46.241.76:5001/api/v1";

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

        let data;

        try {
            data = await res.json();
        } catch (e) {
            data = null;
        }

        console.log("[API]", endpoint, res.status, data);

        return {
            status: res.status,
            data
        };

    } catch (err) {

        console.error("[API ERROR]", err);

        return {
            status: 0,
            data: {
                error: "Network error - backend unreachable"
            }
        };
    }
}




// const API_BASE = "http://127.0.0.1:5001/api/v1";

// function getToken() {
//     return localStorage.getItem("token");
// }

// export const ENDPOINTS = {
//     LOGIN: "/auth/login",
//     REGISTER: "/auth/register",
//     CURRENT_USER: "/auth/currentUser",
//     CONTACT: "/contact"
// };

// export async function api(endpoint, method = "GET", body = null) {

//     const headers = {
//         "Content-Type": "application/json",
//         "Accept": "application/json"
//     };

//     const token = getToken();

//     if (token) {
//         headers["Authorization"] = `Bearer ${token}`;
//     }

//     try {

//         const res = await fetch(API_BASE + endpoint, {
//             method,
//             headers,
//             body: body ? JSON.stringify(body) : null
//         });

//         let data = {};
//         try {
//             data = await res.json();
//         } catch {}

//         console.log("[API]", endpoint, res.status, data);

//         return { status: res.status, data };

//     } catch (err) {

//         console.error("[API ERROR]", err);

//         return {
//             status: 500,
//             data: { error: "Network error" }
//         };
//     }
// }