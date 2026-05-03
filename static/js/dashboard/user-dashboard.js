import { logout } from '../shared/auth.js';
import { initDashboard } from '../shared/dashboard-commun.js';

// ======================
// INIT USER DASHBOARD
// ======================
export async function initUserDashboard() {
    try {

        // 🔹 récupération user + UI commune
        const user = await initDashboard();

        // sécurité login
        if (!user) {
            window.location.href = "/views/auth/login.html";
            return;
        }

        // normalisation rôle
        const role = (user.role || "").toUpperCase();

        // sécurité admin redirect
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

        // ======================
        // USER INFO (optionnel si déjà géré globalement)
        // ======================
        const nameEl = document.getElementById("current-user-name");

        if (nameEl) {
            nameEl.textContent = `${role}: ${user.username || user.email}`;
        }

        console.log("User Dashboard chargé ✔");

    } catch (err) {
        console.error("Erreur user dashboard :", err);
        window.location.href = "/views/auth/login.html";
    }
}