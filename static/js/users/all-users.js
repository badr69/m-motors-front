import { api } from '../api.js';

// ======================
// LOAD USERS
// ======================
export async function initUsersList() {
    const tbody = document.getElementById("users-table-body");
    if (!tbody) return;

    try {
        const { status, data } = await api('/users', 'GET');

        if (status !== 200) {
            tbody.innerHTML = `<tr><td colspan="7">Erreur chargement</td></tr>`;
            return;
        }

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7">Aucun user</td></tr>`;
            return;
        }

        tbody.innerHTML = data.map(user => {

    const isAdmin = user.role?.name?.toUpperCase() === "ADMIN";

    return `
        <tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.phone || '-'}</td>
            <td>${user.address || '-'}</td>
            <td>${user.role?.name || user.role_id}</td>

            <td>
                <button class="btn btn-warning btn-sm"
                    onclick="editUser(${user.id})"
                    ${isAdmin ? "disabled" : ""}>
                    Edit
                </button>

                <button class="btn btn-danger btn-sm"
                    onclick="deleteUser(${user.id})"
                    ${isAdmin ? "disabled" : ""}>
                    Delete
                </button>
            </td>
        </tr>
    `;
}).join("");

        // tbody.innerHTML = data.map(user => `
        //     <tr>
        //         <td>${user.id}</td>
        //         <td>${user.username}</td>
        //         <td>${user.email}</td>
        //         <td>${user.phone || '-'}</td>
        //         <td>${user.address || '-'}</td>
        //         <td>${user.role?.name || user.role_id}</td>
        //         <td>
        //             <button class="btn btn-warning btn-sm"
        //                 onclick="editUser(${user.id})">
                     
        //                 Edit
        //             </button>

        //             <button class="btn btn-danger btn-sm"
        //                 onclick="deleteUser(${user.id})">
                      
        //                 Delete
        //             </button>
        //         </td>
        //     </tr>
        // `).join("");

    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="7">Erreur serveur</td></tr>`;
    }
}

// ======================
// DELETE USER
// ======================
window.deleteUser = async function(id) {
    if (!confirm("Supprimer ce user ?")) return;

    const { status } = await api(`/users/${id}`, 'DELETE');

    if (status === 200 || status === 204) {
        alert("User supprimé ✔");
        initUsersList();
    } else {
        alert("Erreur suppression ❌");
    }
};

// ======================
// EDIT USER
// ======================
window.editUser = function(id) {
    window.location.href = `/views/users/create-user.html?id=${id}`;
};

// AUTO START
document.addEventListener("DOMContentLoaded", initUsersList);