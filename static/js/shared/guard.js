import { getCurrentUser } from './auth.js';

// ======================
// CHECK LOGIN
// ======================
export async function requireAuth() {

    const user = await getCurrentUser();

    if (!user) {
        window.location.href = "/views/auth/login.html";
        return null;
    }

    return user;
}

// ======================
// CHECK ROLE
// ======================
export async function requireRole(allowedRoles = []) {

    const user = await requireAuth();
    if (!user) return null;

    const role = (user.role || "").toUpperCase();

    const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());

    const isAllowed = normalizedAllowed.includes(role);

    if (!isAllowed) {

        // redirection intelligente selon rôle réel
        if (role === "ADMIN") {
            window.location.href = "/views/dashboard/admin-dashboard.html";
        } else {
            window.location.href = "/views/dashboard/user-dashboard.html";
        }

        return null;
    }

    return user;
}