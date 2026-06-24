console.log("ALL DOSSIERS JS LOADED");

import { api } from "../api.js";
import { requireRole } from "../shared/guard.js";

// =====================
// ADMIN ONLY
// =====================
await requireRole(["ADMIN"]);

console.log("✔ ADMIN ACCESS GRANTED");

// =====================
// STATUS BADGES
// =====================
function getBadgeClass(status) {
    const map = {
        pending: "bg-warning text-dark",
        approved: "bg-success",
        rejected: "bg-danger",
        cancelled: "bg-secondary",
        completed: "bg-primary"
    };

    return map[status] || "bg-dark";
}

// =====================
// UPDATE STATUS
// =====================
async function updateStatus(id, status) {

    const res = await api(`/rental_dossiers/${id}/status`, "PATCH", {
        status
    });

    if (res.status === 200) {
        alert("Statut mis à jour ✔");
        loadDossiers();
    } else {
        alert(res.message || "Erreur update status ");
    }
}

// =====================
// LOAD DOSSIERS
// =====================
async function loadDossiers() {

    console.log("⏳ Loading dossiers...");

    const res = await api("/rental_dossiers/admin", "GET");

    console.log("RESPONSE:", res);

    const dossiers = res.data;

    const tableBody = document.getElementById("dossiers-table-body");

    if (!Array.isArray(dossiers) || dossiers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    Aucun dossier trouvé
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = dossiers.map(d => `
        <tr>
            <td>${d.id}</td>
            <td>${d.client?.email || "N/A"}</td>
            <td>${d.vehicle?.brand || ""} ${d.vehicle?.model || ""}</td>

            <td>
                <span class="badge ${getBadgeClass(d.status)}">
                    ${d.status}
                </span>
            </td>

            <td>${d.message || "-"}</td>

            <td>${new Date(d.created_at).toLocaleDateString()}</td>

            <td class="d-flex gap-1">

                <button class="btn btn-success btn-sm"
                    onclick="approveDossier(${d.id})">
                    approved
                </button>

                <button class="btn btn-warning btn-sm"
                    onclick="rejectDossier(${d.id})">
                    rejected
                </button>

                <button class="btn btn-danger btn-sm"
                    onclick="deleteDossier(${d.id})">
                    Delete
                </button>

            </td>
        </tr>
    `).join("");
}

// =====================
// ACTIONS
// =====================

window.approveDossier = function (id) {
    updateStatus(id, "approved");
};

window.rejectDossier = function (id) {
    updateStatus(id, "rejected");
};

// =====================
// DELETE DOSSIER
// =====================
window.deleteDossier = async function (id) {

    if (!confirm("Supprimer ce dossier ?")) return;

    const res = await api(`/rental_dossiers/${id}`, "DELETE");

    if (res.status === 200) {
        alert("Dossier supprimé ✔");
        loadDossiers();
    } else {
        alert(res.message || "Erreur suppression ");
    }
};

// =====================
// INIT
// =====================
loadDossiers();

