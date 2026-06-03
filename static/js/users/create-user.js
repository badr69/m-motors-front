import { api } from '../api.js';

//
// ======================
// FORM ELEMENTS
// ======================
//
const form = document.getElementById("user-form");

const username = document.getElementById("username");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const address = document.getElementById("address");
const password = document.getElementById("password");

const roleSelect = document.getElementById("role_id");
const roleContainer = document.getElementById("role-container");

const title = document.getElementById("form-title");

//
// ======================
// USER ID (edit mode)
// ======================
//
const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

//
// ======================
// CURRENT USER
// ======================
//
const currentUser = JSON.parse(localStorage.getItem("user"));

const isAdmin =
    (currentUser?.role || currentUser?.role_name || "").toUpperCase() === "ADMIN";

//
// ======================
// UI INIT
// ======================
//
if (!isAdmin && roleContainer) {
    roleContainer.style.display = "none";
}

//
// ======================
// RESET FORM (CREATE MODE)
// ======================
//
function resetForm() {
    form.reset();
    title.textContent = "Créer utilisateur";
}

//
// ======================
// LOAD ROLES (ADMIN ONLY)
// ======================
//
async function loadRoles() {

    if (!isAdmin) return;

    try {
        const { status, data } = await api('/roles', 'GET');

        if (status === 200 && Array.isArray(data)) {

            roleSelect.innerHTML = data
                .filter(role => role.name.toUpperCase() !== "ADMIN")
                .map(role =>
                    `<option value="${role.id}">${role.name}</option>`
                )
                .join("");
        }

    } catch (err) {
        console.warn("[create-user] roles error:", err);
    }
}

//
// ======================
// LOAD USER (EDIT MODE)
// ======================
//
async function loadUser(id) {

    const { status, data } = await api(`/users/${id}`, 'GET');

    if (status === 200 && data) {

        username.value = data.username;
        email.value = data.email;
        phone.value = data.phone || "";
        address.value = data.address || "";

        if (isAdmin && data.role_id) {
            roleSelect.value = data.role_id;
        }

        title.textContent = "Modifier utilisateur";
    }
}

//
// ======================
// INIT
// ======================
//
loadRoles();

if (userId) {
    loadUser(userId);
} else {
    resetForm();
}

//
// ======================
// SUBMIT FORM
// ======================
//
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const payload = {
        username: username.value,
        email: email.value,
        phone: phone.value,
        address: address.value,
    };

    // ROLE ONLY ADMIN
    if (isAdmin && roleSelect.value) {
        payload.role_id = roleSelect.value;
    }

    // PASSWORD ONLY IF PROVIDED
    if (password.value) {
        payload.password = password.value;
    }

    let res;

    // CREATE OR UPDATE
    if (userId) {
        res = await api(`/users/${userId}`, "PUT", payload);
    } else {
        res = await api("/users", "POST", payload);
    }

    if (res.status === 200 || res.status === 201) {

        alert("Succès ✔");

        const redirectTo = isAdmin
            ? "/views/users/all-users.html"
            : "/views/users/user-profile.html";

        window.location.href = redirectTo;

    } else {
        alert("Erreur ❌");
    }
});
