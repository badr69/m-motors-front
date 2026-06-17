import { api } from "../api.js";

// ======================
// FORM
// ======================
const form = document.getElementById("dossier-form");

const vehicleId = document.getElementById("vehicle_id");
const message = document.getElementById("message");

const title = document.getElementById("form-title");

// ======================
// CURRENT USER (LOCAL STORAGE)
// ======================
const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
const isAdmin = (currentUser.role || "").toUpperCase() === "ADMIN";

// ======================
// DOSSIER ID optionel pour future edit
// ======================
const params = new URLSearchParams(window.location.search);
const dossierId = params.get("id");

// ======================
// INIT TITLE
// ======================
if (dossierId) {
    title.textContent = "Modifier dossier";
}

// ======================
// LOAD VEHICLES
// ======================
async function loadVehicles() {

    const res = await api("/vehicles", "GET");

    console.log("[VEHICLES RAW RESPONSE]", res);

    const select = document.getElementById("vehicle_id");

    if (!select) {
        console.error("vehicle_id select not found");
        return;
    }

    const vehicles = res?.data;

    if (!vehicles || vehicles.length === 0) {
        console.log("NO VEHICLES FOUND");
        return;
    }

    select.innerHTML = "<option value=''>Choisir un véhicule</option>";

    vehicles.forEach(v => {
        select.innerHTML += `
            <option value="${v.id}">
                ${v.brand} ${v.model}
            </option>
        `;
    });
}

// ======================
// SUBMIT (CREATE DOSSIER)
// ======================
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const payload = {
        vehicle_id: vehicleId.value,
        message: message.value
    };

    console.log("[DOSSIER PAYLOAD]", payload);

    const res = await api("/rental_dossiers", "POST", payload);

    console.log("[CREATE DOSSIER RESPONSE]", res);

    // ======================
    // RESPONSE HANDLING
    // ======================
    if (res.status === 201) {

        alert("Dossier créé ✔");

        // ======================
        // REDIRECTION LOGIC
        // ======================
        if (isAdmin) {
            window.location.href = "/views/dossiers/all-dossiers.html";
        } else {
            window.location.href = "/views/dossiers/my-dossiers.html";
        }

    } else {

        alert(res.message || "Erreur création dossier ");
    }
});

// ======================
// INIT
// ======================
loadVehicles();