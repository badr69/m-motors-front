import { api } from '../api.js';

const form = document.getElementById("user-form");

const username = document.getElementById("username");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const address = document.getElementById("address");
const password = document.getElementById("password");

const roleSelect = document.getElementById("role_id");
const roleContainer = document.getElementById("role-container");

const title = document.getElementById("form-title");

// ======================
// USER ID (edit mode)
// ======================
const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

// ======================
// CURRENT USER (AUTH)
// ======================
const currentUser = JSON.parse(localStorage.getItem("user"));
const isAdmin = currentUser?.role === "ADMIN";

// ======================
// UI INIT
// ======================
if (!isAdmin && roleContainer) {
    roleContainer.style.display = "none";
}

// ======================
// LOAD ROLES (ADMIN ONLY)
// ======================
async function loadRoles() {
    if (!isAdmin) return;

    try {
        const { status, data } = await api('/roles', 'GET');

        if (status === 200 && Array.isArray(data)) {
            roleSelect.innerHTML = data.map(role =>
                `<option value="${role.id}">${role.name}</option>`
            ).join("");
        }
    } catch (err) {
        console.warn("Roles not available:", err);
    }
}

// ======================
// LOAD USER (EDIT MODE)
// ======================
async function loadUser(id) {
    const { status, data } = await api(`/users/${id}`, 'GET');

    if (status === 200 && data) {
        username.value = data.username;
        email.value = data.email;
        phone.value = data.phone || "";
        address.value = data.address || "";

        // role only if admin
        if (isAdmin && data.role_id) {
            roleSelect.value = data.role_id;
        }

        title.textContent = "Modifier utilisateur";
    }
}

// ======================
// INIT
// ======================
loadRoles();

if (userId) {
    loadUser(userId);
}

// ======================
// SUBMIT
// ======================
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        username: username.value,
        email: email.value,
        phone: phone.value,
        address: address.value,
    };

    // role only for admin
    if (isAdmin && roleSelect.value) {
        payload.role_id = roleSelect.value;
    }

    if (password.value) {
        payload.password = password.value;
    }

    let res;

    if (userId) {
        res = await api(`/users/${userId}`, "PUT", payload);
    } else {
        res = await api("/users", "POST", payload);
    }

    if (res.status === 200 || res.status === 201) {
        alert("Succès ✔");
        window.location.href = "/views/users/all-users.html";
    } else {
        alert("Erreur ❌");
    }
});