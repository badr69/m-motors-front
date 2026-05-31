import { api } from '../api.js';

const tableBody = document.getElementById("users-table-body");

// ======================
// LOAD USERS
// ======================
async function loadUsers() {
    const { status, data } = await api('/users', 'GET');

    if (status === 200 && Array.isArray(data)) {

        tableBody.innerHTML = data.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.phone || '-'}</td>
                <td>${user.address || '-'}</td>
                <td>${user.role?.name || user.role || '-'}</td>

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

    } else {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">
                    Erreur chargement users
                </td>
            </tr>
        `;
    }
}

// ======================
// DELETE USER
// ======================
window.deleteUser = async function (id) {

    if (!confirm("Supprimer cet utilisateur ?")) return;

    const { status } = await api(`/users/${id}`, 'DELETE');

    if (status === 200) {
        alert("Utilisateur supprimé ✔");
        loadUsers();
    } else {
        alert("Erreur suppression ❌");
    }
};

// ======================
// INIT
// ======================
loadUsers();