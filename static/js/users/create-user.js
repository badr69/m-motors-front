import { api } from "../api.js";

// ======================
// FORM
// ======================
const form = document.getElementById("user-form");

const username = document.getElementById("username");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const address = document.getElementById("address");
const password = document.getElementById("password");

const roleSelect = document.getElementById("role_id");
const title = document.getElementById("form-title");

// ======================
// USER ID
// ======================
const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

// ======================
// USER LOCAL
// ======================
const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

const isAdmin = (currentUser.role || "").toUpperCase() === "ADMIN";

// ======================
// LOAD ROLES
// ======================
async function loadRoles() {

    if (!isAdmin) return;

    const res = await api("/roles", "GET");

    const roles = res.data;

    if (!Array.isArray(roles)) return;

    roleSelect.innerHTML = roles
        .filter(r => r.name.toUpperCase() !== "ADMIN")
        .map(r => `<option value="${r.id}">${r.name}</option>`)
        .join("");
}

// ======================
// LOAD USER
// ======================
async function loadUser(id) {

    const res = await api(`/users/${id}`, "GET");

    const user = res.data;

    if (!user) return;

    username.value = user.username;
    email.value = user.email;
    phone.value = user.phone || "";
    address.value = user.address || "";

    if (user.role_id) {
        roleSelect.value = user.role_id;
    }

    title.textContent = "Modifier utilisateur";
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

    if (roleSelect.value) {
        payload.role_id = roleSelect.value;
    }

    if (password.value) {
        payload.password = password.value;
    }

    const url = userId ? `/users/${userId}` : "/users";
    const method = userId ? "PUT" : "POST";

    const res = await api(url, method, payload);

    if (res.status === 200 || res.status === 201) {
        alert("Succès ✔");
        window.location.href = "/views/users/all-users.html";
    } else {
        console.log(res);
        alert(res.message || "Erreur ❌");
    }
});