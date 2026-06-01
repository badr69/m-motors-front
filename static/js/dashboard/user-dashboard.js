import { logout } from '../shared/auth.js';
import { initDashboard } from '../shared/dashboard-commun.js';

// ======================
// INIT USER DASHBOARD
// ======================
export async function initUserDashboard() {

    try {

        // user + UI commune
        const user = await initDashboard();

        // sécurité login
        if (!user) return;

        // normalisation rôle
        const role = (user.role || "").toUpperCase();

        // sécurité user
        if (role === "ADMIN") {
            window.location.href = "/views/dashboard/admin-dashboard.html";
            return;
        }

        // ======================
        // LOGOUT
        // ======================
        const logoutBtn = document.getElementById("logout-button");

        if (logoutBtn) {
            logoutBtn.onclick = logout;
        }

        console.log("User Dashboard chargé ✔");

    } catch (err) {

        console.error("Erreur user dashboard :", err);

        window.location.href = "/views/auth/login.html";
    }
}
