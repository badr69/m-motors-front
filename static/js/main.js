import { loadNavbar, loadFooter } from './layout.js';
import { handleAuthForms } from './shared/auth.js';
import { handleContactForm } from './contact.js';
import { initDashboard } from './shared/dashboard-commun.js';
import { initRolesList } from './roles/all-roles.js';

document.addEventListener('DOMContentLoaded', async () => {

    // ======================
    // GLOBAL LAYOUT
    // ======================
    await loadNavbar();
    await loadFooter();

    // ======================
    // DETECT CURRENT PAGE
    // ======================
    const page = window.location.pathname.split("/").pop() || "index.html";

    // ======================
    // ROUTING FRONT SIMPLE
    // ======================
    switch (page) {

        case "contact.html":
            handleContactForm();
            break;

        case "login.html":
        case "register.html":
            handleAuthForms();
            break;

        case "dashboard.html":
        case "admin-dashboard.html":
        case "user-dashboard.html":
            initDashboard();
            break;

        case "all-roles.html":
            initRolesList();
            break;

        default:
            break;
    }
});