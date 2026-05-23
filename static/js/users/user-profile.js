import { api } from '../api.js';

// ======================
// LOAD MY PROFILE
// ======================
async function loadProfile() {

    const tbody = document.getElementById("profile-table-body");

    try {
        const { status, data } = await api('/users/me', 'GET');

        if (status !== 200) {
            tbody.innerHTML = `<tr><td colspan="2">Erreur chargement</td></tr>`;
            return;
        }

        tbody.innerHTML = `
            <tr><td>ID</td><td>${data.id}</td></tr>
            <tr><td>Username</td><td>${data.username}</td></tr>
            <tr><td>Email</td><td>${data.email}</td></tr>
            <tr><td>Phone</td><td>${data.phone || '-'}</td></tr>
            <tr><td>Address</td><td>${data.address || '-'}</td></tr>
            <tr><td>Role</td><td>${data.role}</td></tr>
        `;

        // EDIT
        document.getElementById("editProfileBtn").onclick = () => {
            window.location.href = `/views/users/edit-user.html?id=${data.id}`;
        };

        // DELETE
        document.getElementById("deleteProfileBtn").onclick = async () => {

            if (!confirm("Supprimer votre compte ?")) return;

            const res = await api(`/users/${data.id}`, 'DELETE');

            if (res.status === 200) {
                alert("Compte supprimé ✔");
                window.location.href = "/login.html";
            } else {
                alert("Erreur suppression ❌");
            }
        };

    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="2">Erreur serveur</td></tr>`;
    }
}

document.addEventListener("DOMContentLoaded", loadProfile);