console.log("MY DOSSIERS JS LOADED");

import { api } from "../api.js";
import { requireAuth } from "../shared/guard.js";

// =====================
// USER ONLY
// =====================
const user = await requireAuth();

// =====================
// LOAD MY DOSSIERS
// =====================
async function loadMyDossiers() {

    const res = await api("/rental_dossiers/my", "GET");

    console.log("[MY DOSSIERS]", res);

    const dossiers = res.data;

    const tableBody = document.getElementById("my-dossiers-table");

    if (!Array.isArray(dossiers) || dossiers.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    Aucun dossier
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = dossiers.map(d => `
        <tr>

            <td>${d.id}</td>

            <td>
                ${d.vehicle?.brand || ""} ${d.vehicle?.model || ""}
            </td>

            <td>
                <span class="badge ${
                    d.status === "approved"
                        ? "bg-success"
                        : d.status === "rejected"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                }">
                    ${d.status}
                </span>
            </td>

            <td>${d.message || "-"}</td>

            <td>${new Date(d.created_at).toLocaleDateString()}</td>

        </tr>
    `).join("");
}

// =====================
// INIT
// =====================
loadMyDossiers();