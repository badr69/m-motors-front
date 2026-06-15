import { getCurrentUser, logout } from './auth.js';

export async function initDashboard() {

    const user = await getCurrentUser();

    // ======================
    // SECURITY CHECK
    // ======================
    if (!user) {
        window.location.href = "/views/auth/login.html";
        return null;
    }

    // ======================
    // USER DISPLAY
    // ======================
    const nameEl = document.getElementById("current-user-name");

    if (nameEl) {

        const role = (user.role || "USER").toUpperCase();

        nameEl.textContent =
            `${role}: ${user.username || user.email}`;
    }

    // ======================
    // LOGOUT
    // ======================
    const logoutBtn = document.getElementById("logout-button");

    if (logoutBtn) {
        logoutBtn.onclick = logout;
    }

    // ======================
    // DASHBOARD BUTTON FIX (IMPORTANT)
    // ======================
    const dashboardBtn = document.getElementById("dashboard-button");

    if (dashboardBtn) {

        dashboardBtn.onclick = () => {

            const role = (user.role || "").toUpperCase();

            if (role === "ADMIN") {
                window.location.href =
                    "/views/dashboard/admin-dashboard.html";
            } else {
                window.location.href =
                    "/views/dashboard/user-dashboard.html";
            }
        };
    }

    return user;
}










