import { getCurrentUser, logout } from './shared/auth.js';

// ======================
// LOAD NAVBAR
// ======================
export async function loadNavbar() {

    const navbarEl = document.getElementById('navbar');
    if (!navbarEl) return;

    try {
        const res = await fetch('/templates/navbar.html');

        if (!res.ok) return;

        navbarEl.innerHTML = await res.text();

        const user = await getCurrentUser();

        const login = document.getElementById("login-link");
        const register = document.getElementById("register-link");
        const profile = document.getElementById("profile-link");
        const logoutBtn = document.getElementById("logout-link");

        if (user) {
            login?.classList.add("d-none");
            register?.classList.add("d-none");
            profile?.classList.remove("d-none");
            logoutBtn?.classList.remove("d-none");
        } else {
            login?.classList.remove("d-none");
            register?.classList.remove("d-none");
            profile?.classList.add("d-none");
            logoutBtn?.classList.add("d-none");
        }

        if (logoutBtn) {
            logoutBtn.onclick = () => logout();
        }

    } catch (err) {
        console.error(err);
    }
}

// ======================
// LOAD FOOTER (IMPORTANT FIX)
// ======================
export async function loadFooter() {

    const footerEl = document.getElementById('footer');
    if (!footerEl) return;

    try {
        const res = await fetch('/templates/footer.html');

        if (res.ok) {
            footerEl.innerHTML = await res.text();
        } else {
            footerEl.innerHTML = `<p>© ${new Date().getFullYear()} M-Motors</p>`;
        }

    } catch (err) {
        footerEl.innerHTML = `<p>© ${new Date().getFullYear()} M-Motors</p>`;
    }
}