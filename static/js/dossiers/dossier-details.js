console.log("DOSSIER DETAILS JS LOADED");

import { api, FILE_BASE } from "../api.js";

// ======================
// DOSSIER ID
// ======================
const params = new URLSearchParams(window.location.search);
const dossierId = params.get("id");

// ======================
// ELEMENTS
// ======================
const infoBox = document.getElementById("dossier-info");
const tableBody = document.getElementById("documents-table-body");
const uploadBtn = document.getElementById("upload-btn");

// ======================
// INIT UPLOAD BUTTON
// ======================
function initUploadButton() {

    if (!uploadBtn || !dossierId) return;

    uploadBtn.href =
        `/views/documents/create-document.html?dossier_id=${dossierId}`;
}

// ======================
// LOAD DOSSIER
// ======================
async function loadDossier() {

    if (!dossierId) {
        infoBox.innerHTML = `
            <div class="alert alert-danger">
                Dossier introuvable
            </div>
        `;
        return;
    }

    const res = await api(
        `/rental_dossiers/${dossierId}`,
        "GET"
    );

    console.log("[DOSSIER RESPONSE]", res);

    if (res.status !== 200) {

        infoBox.innerHTML = `
            <div class="alert alert-danger">
                ${res.message || "Erreur chargement dossier"}
            </div>
        `;
        return;
    }

    const dossier = res.data;

    // ======================
    // IMAGE VEHICULE 
    // ======================
    // const imageUrl = dossier.vehicle?.image_url
    // ? `http://127.0.0.1:5001${dossier.vehicle.image_url}`
    // : null;

    const imageUrl = dossier.vehicle?.image_url
    ? `${FILE_BASE}${dossier.vehicle.image_url}`
    : null;

    // ======================
    // DOSSIER INFO
    // ======================
    console.log("IMAGE URL =", imageUrl);
    infoBox.innerHTML = `

        <div class="mb-3 text-center">

            ${imageUrl ? `
                <img
                    src="${imageUrl}"
                    class="img-fluid rounded shadow"
                    style="max-width: 350px;"
                />
            ` : `
                <div class="alert alert-secondary">
                    Aucune image véhicule disponible
                </div>
            `}

        </div>

        <p><strong>ID :</strong> ${dossier.id}</p>

        <p>
            <strong>Véhicule :</strong>
            ${dossier.vehicle?.brand || ""} ${dossier.vehicle?.model || ""}
        </p>

        <p>
            <strong>Status :</strong>
            <span class="badge bg-warning">
                ${dossier.status}
            </span>
        </p>

        <p><strong>Message :</strong> ${dossier.message || "-"}</p>

        <p>
            <strong>Date :</strong>
            ${new Date(dossier.created_at).toLocaleDateString()}
        </p>

    `;

    // ======================
    // DOCUMENTS
    // ======================
    if (!tableBody) return;

    if (!dossier.documents || dossier.documents.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-muted">
                    Aucun document uploadé
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = dossier.documents.map(doc => `

        <tr>

            <td>${doc.id}</td>
           
            <td>${doc.filename}</td>

            <td>
                <a
                    href="http://127.0.0.1:5001/api/v1/documents/file/${doc.filename}"
                    target="_blank"
                    class="btn btn-primary btn-sm"
                >
                    Voir
                </a>
            </td>

        </tr>

    `).join("");
}

// ======================
// INIT
// ======================
initUploadButton();
loadDossier();