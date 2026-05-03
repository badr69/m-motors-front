import { api } from '../api.js';

// ======================
// LOAD ROLES
// ======================
export async function initRolesList() {
    const tbody = document.getElementById("roles-table-body");
    if (!tbody) return;

    try {
        const { status, data } = await api('/roles', 'GET');

        console.log("ROLES DATA:", data);

        if (status !== 200) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center text-danger">
                        Erreur chargement
                    </td>
                </tr>
            `;
            return;
        }

        if (!data || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center">
                        Aucun rôle trouvé
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = data.map(role => {

            const isAdmin = role.name?.toUpperCase() === "ADMIN";

            return `
                <tr>
                    <td>${role.id}</td>

                    <td>
                        ${role.name}
                        ${isAdmin ? '<span class="badge bg-secondary ms-2">SYSTEM</span>' : ''}
                    </td>

                    <td>
                        <button class="btn btn-sm btn-warning me-2"
                            onclick="editRole(${role.id})"
                            ${isAdmin ? "disabled" : ""}>
                            Edit
                        </button>

                        <button class="btn btn-sm btn-danger"
                            onclick="deleteRole(${role.id})"
                            ${isAdmin ? "disabled" : ""}>
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        }).join("");

    } catch (err) {
        console.error(err);

        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-danger">
                    Erreur serveur
                </td>
            </tr>
        `;
    }
}

// AUTO START
document.addEventListener("DOMContentLoaded", () => {
    initRolesList();
});

// ======================
// DELETE ROLE
// ======================
window.deleteRole = async function(id) {
    if (!confirm("Supprimer ce rôle ?")) return;

    try {
        const { status } = await api(`/roles/${id}`, "DELETE");

        if (status === 200 || status === 204) {
            alert("Rôle supprimé ✔");
            initRolesList();
        } else {
            alert("Erreur suppression ❌");
        }
    } catch (err) {
        console.error(err);
        alert("Erreur serveur ❌");
    }
};

// ======================
// EDIT ROLE
// ======================
window.editRole = function(id) {
    window.location.href = `/views/roles/create-role.html?id=${id}`;
};