console.log("API.JS VERSION FINAL");

//
// ======================
// ENVIRONMENT
// ======================
//
const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

//
// ======================
// API BASE URL
// ======================
//
const API_BASE = isLocal
    ? "http://127.0.0.1:5001/api/v1"
    : "http://84.46.241.76/api/v1";

//
// ======================
// TOKEN
// ======================
//
function getToken() {
    return localStorage.getItem("token");
}

//
// ======================
// ENDPOINTS
// ======================
//
export const ENDPOINTS = {

    LOGIN: "/auth/login",

    REGISTER: "/auth/register",

    CURRENT_USER: "/auth/currentUser",

    CONTACT: "/contact"
};

//
// ======================
// API REQUEST
// ======================
//
export async function api(
    endpoint,
    method = "GET",
    body = null
) {

    //
    // TOKEN
    //
    const token = getToken();

    //
    // HEADERS
    //
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    };

    //
    // AUTH HEADER
    //
    if (
        token &&
        token !== "null" &&
        token !== "undefined"
    ) {

        headers["Authorization"] =
            `Bearer ${token}`;
    }

    try {

        //
        // FETCH
        //
        const res = await fetch(
            `${API_BASE}${endpoint}`,
            {
                method,
                headers,
                body: body
                    ? JSON.stringify(body)
                    : undefined
            }
        );

        //
        // JSON RESPONSE
        //
        let data;

        try {

            data = await res.json();

        } catch {

            data = {
                message:
                    "Invalid JSON response"
            };
        }

        //
        // LOG
        //
        console.log(
            "[API]",
            endpoint,
            res.status,
            data
        );

        //
        // UNAUTHORIZED
        //
        if (res.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
        }

        //
        // RETURN
        //
        return {
            status: res.status,
            data
        };

    } catch (err) {

        //
        // NETWORK ERROR
        //
        console.error(
            "[API ERROR]",
            err
        );

        return {
            status: 0,
            data: {
                error: "Network error"
            }
        };
    }
}