import { logout } from '../shared/auth.js';
import { initDashboard } from '../shared/dashboard-commun.js';

// ======================
// INIT ADMIN DASHBOARD
// ======================
export async function initAdminDashboard() {

    try {

        // user + UI commune
        const user = await initDashboard();

        // sécurité login
        if (!user) return;

        // normalisation rôle
        const role = (user.role || "").toUpperCase();

        // sécurité accès admin
        if (role !== "ADMIN") {
            window.location.href = "/views/dashboard/user-dashboard.html";
            return;
        }

        // ======================
        // LOGOUT
        // ======================
        const logoutBtn = document.getElementById("logout-button");

        if (logoutBtn) {
            logoutBtn.onclick = logout;
        }

        console.log("Admin Dashboard chargé ✔");

    } catch (err) {

        console.error("Erreur admin dashboard :", err);

        window.location.href = "/views/auth/login.html";
    }
}

