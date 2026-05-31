import { api } from '../api.js';

// ======================
// LOG
// ======================
console.log("[user-profile] script loaded");

// ======================
// ELEMENTS
// ======================
const tableBody = document.getElementById("profile-table-body");

const editBtn = document.getElementById("editProfileBtn");
const deleteBtn = document.getElementById("deleteProfileBtn");

console.log("[user-profile] DOM:", {
    tableBody,
    editBtn,
    deleteBtn
});

// ======================
// GET CURRENT USER (SAFE)
// ======================
const currentUser = JSON.parse(localStorage.getItem("user"));

console.log("[user-profile] currentUser:", currentUser);

const userId = currentUser?.user_id || currentUser?.id;

console.log("[user-profile] resolved userId:", userId);

// ======================
// LOAD PROFILE
// ======================
async function loadProfile(id) {
    console.log("[user-profile] loading profile:", id);

    const res = await api(`/users/${id}`, 'GET');

    console.log("[user-profile] API response:", res);

    const { status, data } = res;

    if (status === 200 && data) {

        console.log("[user-profile] data received:", data);

        tableBody.innerHTML = `
            <tr><td>Username</td><td>${data.username}</td></tr>
            <tr><td>Email</td><td>${data.email}</td></tr>
            <tr><td>Phone</td><td>${data.phone || '-'}</td></tr>
            <tr><td>Address</td><td>${data.address || '-'}</td></tr>
        `;

        console.log("[user-profile] render OK ✔");
    } else {
        console.warn("[user-profile] failed to load profile");
    }
}

// ======================
// EDIT BUTTON
// ======================
if (editBtn) {
    editBtn.addEventListener("click", () => {
        console.log("[user-profile] edit clicked");

        window.location.href = `/views/users/create-user.html?id=${userId}`;
    });
} else {
    console.warn("[user-profile] editBtn not found");
}

// ======================
// DELETE BUTTON
// ======================
if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {

        console.log("[user-profile] delete clicked");

        if (!confirm("Supprimer votre compte ?")) return;

        const res = await api(`/users/${userId}`, "DELETE");

        console.log("[user-profile] delete response:", res);

        if (res.status === 200) {
            alert("Compte supprimé ✔");
            window.location.href = "/views/auth/login.html";
        } else {
            alert("Erreur ❌");
        }
    });
} else {
    console.warn("[user-profile] deleteBtn not found");
}

// ======================
// INIT
// ======================
if (userId) {
    loadProfile(userId);
} else {
    console.error("[user-profile] NO USER FOUND IN LOCALSTORAGE ❌");
}

