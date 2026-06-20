console.log("CREATE DOCUMENT JS LOADED");

import { api } from "../api.js";

// ======================
// FORM
// ======================
const form = document.getElementById("dossier-form");

const dossierSelect = document.getElementById("dossier_id");
const typeDocument = document.getElementById("type_document");
const fileInput = document.getElementById("file");

const params = new URLSearchParams(window.location.search);
const dossierFromUrl = params.get("dossier_id");

// ======================
// LOAD DOSSIERS
// ======================
async function loadDossiers() {

    const res = await api("/rental_dossiers/my", "GET"); 
  

    const dossiers = res.data;

    if (!Array.isArray(dossiers)) return;

    dossierSelect.innerHTML = `<option value="">-- Sélectionner un dossier --</option>`;

    dossiers.forEach(d => {

        const option = document.createElement("option");

        option.value = d.id; // valeur envoyée
        option.textContent = `Dossier ${d.vehicle?.brand || ""} ${d.vehicle?.model || ""}`;

        dossierSelect.appendChild(option);
    });

    // ======================
    // AUTO-FILL DOSSIER
    // ======================
    if (dossierFromUrl) {
        dossierSelect.value = dossierFromUrl;
    }
}

// ======================
// VALIDATION 
// ======================
function validate() {

    if (!dossierSelect.value) {
        alert("Veuillez sélectionner un dossier");
        return false;
    }

    if (!fileInput.files[0]) {
        alert("Veuillez choisir un fichier");
        return false;
    }

    return true;
}

// ======================
// SUBMIT
// ======================
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!validate()) return;

    const formData = new FormData();

    formData.append("dossier_id", dossierSelect.value);
    formData.append("type_document", typeDocument.value);
    formData.append("file", fileInput.files[0]);

    const res = await api("/documents", "POST", formData, true);

    console.log("[UPLOAD RESPONSE]", res);

    if (res.status === 201) {

        alert("Document uploadé ✔");

        window.location.href = `/views/dossiers/my-dossiers.html`;

    } else {

        alert(res.message || "Erreur upload ");
    }
});

// ======================
// INIT
// ======================
loadDossiers();