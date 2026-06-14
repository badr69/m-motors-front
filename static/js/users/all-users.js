console.log("🔥 USERS JS LOADED");

import { api } from "../api.js";

async function loadUsers() {

    const res = await api("/users", "GET");

    console.log("[USERS RESPONSE]", res);

    const users = res.data; // ✅ FIX IMPORTANT

    const tableBody = document.getElementById("users-table-body");

    if (!Array.isArray(users)) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">
                    No users found
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.phone || '-'}</td>
            <td>${user.address || '-'}</td>

            <!-- ROLE FIX -->
            <td>${user.role || '-'}</td>

            <td>
                <a href="/views/users/create-user.html?id=${user.id}" class="btn btn-warning btn-sm">
                    Edit
                </a>

                <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}

window.deleteUser = async function (id) {

    if (!confirm("Supprimer cet utilisateur ?")) return;

    const res = await api(`/users/${id}`, "DELETE");

    if (res.status === 200) {
        alert("Utilisateur supprimé ✔");
        loadUsers();
    } else {
        alert(res.message || "Erreur suppression ❌");
    }
};

loadUsers();