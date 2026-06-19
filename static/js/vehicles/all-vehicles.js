console.log("VEHICLES JS LOADED");

import { api } from "../api.js";
import { requireRole } from "../shared/guard.js";

// =====================
// ADMIN ONLY
// =====================
await requireRole(["ADMIN"]);

// =====================
// LOAD VEHICLES
// =====================
async function loadVehicles() {

    const res = await api("/vehicles", "GET");

    console.log("[VEHICLES RESPONSE]", res);

    const vehicles = res.data;

    const tableBody = document.getElementById("vehicles-table-body");

    if (!Array.isArray(vehicles) || vehicles.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">
                    Aucun véhicule trouvé
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = vehicles.map(vehicle => `
        <tr>
            <td>${vehicle.id}</td>
            <td>${vehicle.brand}</td>
            <td>${vehicle.model}</td>
            <td>${vehicle.year || "-"}</td>
            <td>${vehicle.price || "-"}</td>

            <td>
                <span class="badge ${
                    vehicle.status === "available"
                        ? "bg-success"
                        : vehicle.status === "rented"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                }">
                    ${vehicle.status}
                </span>
            </td>

            <td>
                <a
                    href="/views/vehicles/create-vehicle.html?id=${vehicle.id}"
                    class="btn btn-warning btn-sm"
                >
                    Edit
                </a>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="deleteVehicle(${vehicle.id})"
                >
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}

// =====================
// DELETE VEHICLE
// =====================
window.deleteVehicle = async function (id) {

    if (!confirm("Supprimer ce véhicule ?")) {
        return;
    }

    const res = await api(`/vehicles/${id}`, "DELETE");

    if (res.status === 200) {

        alert("Véhicule supprimé ✔");

        loadVehicles();

    } else {

        alert(res.message || "Erreur suppression ");
    }
};

// =====================
// INIT
// =====================
loadVehicles();