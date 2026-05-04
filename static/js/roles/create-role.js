import { api } from '../api.js';

const form = document.getElementById("role-form");
const input = document.getElementById("role-name");
const title = document.getElementById("form-title");

// ======================
// GET ID FROM URL
// ======================
const params = new URLSearchParams(window.location.search);
const roleId = params.get("id");

// ======================
// MODE UPDATE
// ======================
if (roleId) {
    title.textContent = "Modifier le rôle";

    // charger role existant
    loadRole(roleId);
}

// ======================
// SUBMIT FORM
// ======================
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = input.value;

    if (roleId) {
        // UPDATE
        const { status } = await api(`/roles/${roleId}`, "PUT", { name });

        if (status === 200) {
            alert("Rôle modifié ✔");
            window.location.href = "/views/roles/all-roles.html";
        } else {
            alert("Erreur update");
        }

    } else {
        // CREATE
        const { status } = await api("/roles", "POST", { name });

        if (status === 201 || status === 200) {
            alert("Rôle créé ✔");
            window.location.href = "/views/roles/all-roles.html";
        } else {
            alert("Erreur création");
        }
    }
});

// ======================
// LOAD ROLE (UPDATE MODE)
// ======================
async function loadRole(id) {
    const { status, data } = await api(`/roles/${id}`, "GET");

    if (status === 200 && data) {
        input.value = data.name;
    }
}