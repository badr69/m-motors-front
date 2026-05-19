import { api } from '../api.js';

const form = document.getElementById("user-form");

const username = document.getElementById("username");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const address = document.getElementById("address");
const password = document.getElementById("password");
const roleSelect = document.getElementById("role_id");
const title = document.getElementById("form-title");

// ======================
// GET USER ID FROM URL
// ======================
const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

// ======================
// LOAD ROLES (dropdown)
// ======================
async function loadRoles() {
    const { status, data } = await api('/roles', 'GET');

    if (status === 200 && data) {

        const filteredRoles = data.filter(role =>
            role.name.toUpperCase() !== "ADMIN"
        );

        roleSelect.innerHTML = filteredRoles.map(role =>
            `<option value="${role.id}">${role.name}</option>`
        ).join("");
    }
}

// ======================
// LOAD USER (edit mode)
// ======================
async function loadUser(id) {
    const { status, data } = await api(`/users/${id}`, 'GET');

    if (status === 200 && data) {
        username.value = data.username;
        email.value = data.email;
        phone.value = data.phone || "";
        address.value = data.address || "";
        roleSelect.value = data.role_id;

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
// SUBMIT FORM
// ======================
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        username: username.value,
        email: email.value,
        phone: phone.value,
        address: address.value,
        role_id: Number(roleSelect.value)
    };

    if (password.value) {
        payload.password = password.value;
    }

    try {
        const res = userId
            ? await api(`/users/${userId}`, "PUT", payload)
            : await api("/users", "POST", payload);

        console.log("API RESPONSE:", res);

        // ❌ FAIL HTTP
        if (!res || res.status >= 400) {
            alert(res?.data?.message || "Erreur serveur ❌");
            return;
        }

        // ❌ BACKEND ERROR MESSAGE
        if (res.data?.message && res.status >= 400) {
            alert(res.data.message);
            return;
        }

        // ✅ SUCCESS
        if (res.status === 200 || res.status === 201) {
            alert("Succès ✔");
            window.location.href = "/views/users/all-users.html";
        }

    } catch (err) {
        console.error(err);
        alert("Erreur réseau ❌");
    }
});