import { api } from '../api.js';

// ======================
// LOAD MY PROFILE
// ======================
async function loadProfile() {

    const tbody = document.getElementById("profile-table-body");
    const editBtn = document.getElementById("editProfileBtn");
    const deleteBtn = document.getElementById("deleteProfileBtn");

    if (!tbody) return;

    try {
        const { status, data } = await api('/users/me', 'GET');

        console.log("STATUS:", status);
        console.log("DATA:", data);

        if (status !== 200 || !data) {
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

        // =====================
        // EDIT PROFILE
        // =====================
        if (editBtn) {
            editBtn.onclick = () => {
                window.location.href =
                    `/views/users/create-user.html?id=${data.id}&mode=edit`;
            };
        }

        // =====================
        // DELETE PROFILE
        // =====================
        if (deleteBtn) {
            deleteBtn.onclick = async () => {

                if (!confirm("Supprimer votre compte ?")) return;

                const res = await api(`/users/${data.id}`, 'DELETE');

                if (res.status === 200 || res.status === 204) {
                    alert("Compte supprimé ✔");
                    window.location.href = "/views/auth/login.html";
                } else {
                    alert("Erreur suppression ❌");
                    console.error(res);
                }
            };
        }

    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="2">Erreur serveur</td></tr>`;
    }
}

document.addEventListener("DOMContentLoaded", loadProfile);






// import { api } from '../api.js';

// // ======================
// // LOAD MY PROFILE
// // ======================
// async function loadProfile() {

//     const tbody = document.getElementById("profile-table-body");
//     const editBtn = document.getElementById("editProfileBtn");
//     const deleteBtn = document.getElementById("deleteProfileBtn");

//     if (!tbody) return;

//     try {
//         const { status, data } = await api('/users/me', 'GET');

//         console.log("STATUS:", status);
//         console.log("DATA:", data);

//         if (status !== 200 || !data) {
//             tbody.innerHTML = `<tr><td colspan="2">Erreur chargement</td></tr>`;
//             return;
//         }

//         tbody.innerHTML = `
//             <tr><td>ID</td><td>${data.id}</td></tr>
//             <tr><td>Username</td><td>${data.username}</td></tr>
//             <tr><td>Email</td><td>${data.email}</td></tr>
//             <tr><td>Phone</td><td>${data.phone || '-'}</td></tr>
//             <tr><td>Address</td><td>${data.address || '-'}</td></tr>
//             <tr><td>Role</td><td>${data.role}</td></tr>
//         `;

//         // =====================
//         // EDIT PROFILE
//         // =====================
//         if (editBtn) {
//             editBtn.onclick = () => {
//                 // on utilise create-user en mode edit
//                 window.location.href = `/views/users/create-user.html?id=${data.id}`;
//             };
//         }

//         // =====================
//         // DELETE PROFILE
//         // =====================
//         if (deleteBtn) {
//             deleteBtn.onclick = async () => {

//                 if (!confirm("Supprimer votre compte ?")) return;

//                 const { status } = await api(`/users/${data.id}`, 'DELETE');

//                 if (status === 200 || status === 204) {
//                     alert("Compte supprimé ✔");
//                     window.location.href = "/views/auth/login.html";
//                 } else {import { api } from '../api.js';

// // ======================
// // LOAD MY PROFILE
// // ======================
// async function loadProfile() {

//     const tbody = document.getElementById("profile-table-body");
//     const editBtn = document.getElementById("editProfileBtn");
//     const deleteBtn = document.getElementById("deleteProfileBtn");

//     if (!tbody) return;

//     try {
//         const { status, data } = await api('/users/me', 'GET');

//         console.log("STATUS:", status);
//         console.log("DATA:", data);

//         if (status !== 200 || !data) {
//             tbody.innerHTML = `<tr><td colspan="2">Erreur chargement</td></tr>`;
//             return;
//         }

//         tbody.innerHTML = `
//             <tr><td>ID</td><td>${data.id}</td></tr>
//             <tr><td>Username</td><td>${data.username}</td></tr>
//             <tr><td>Email</td><td>${data.email}</td></tr>
//             <tr><td>Phone</td><td>${data.phone || '-'}</td></tr>
//             <tr><td>Address</td><td>${data.address || '-'}</td></tr>
//             <tr><td>Role</td><td>${data.role}</td></tr>
//         `;

//         // =====================
//         // EDIT PROFILE
//         // =====================
//         if (editBtn) {
//             editBtn.onclick = () => {
//                 // on utilise create-user en mode edit
//                 window.location.href = `/views/users/create-user.html?id=${data.id}`;
//             };
//         }

//         // =====================
//         // DELETE PROFILE
//         // =====================
//         if (deleteBtn) {
//             deleteBtn.onclick = async () => {

//                 if (!confirm("Supprimer votre compte ?")) return;

//                 const { status } = await api(`/users/${data.id}`, 'DELETE');

//                 if (status === 200 || status === 204) {
//                     alert("Compte supprimé ✔");
//                     window.location.href = "/views/auth/login.html";
//                 } else {
//                     alert("Erreur suppression ❌");
//                 }
//             };
//         }

//     } catch (err) {
//         console.error(err);
//         tbody.innerHTML = `<tr><td colspan="2">Erreur serveur</td></tr>`;
//     }
// }

// document.addEventListener("DOMContentLoaded", loadProfile);
//                     alert("Erreur suppression ❌");
//                 }
//             };
//         }

//     } catch (err) {
//         console.error(err);
//         tbody.innerHTML = `<tr><td colspan="2">Erreur serveur</td></tr>`;
//     }
// }

// document.addEventListener("DOMContentLoaded", loadProfile);