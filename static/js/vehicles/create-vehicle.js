console.log("🔥 CREATE/UPDATE VEHICLE JS LOADED");

import { api } from "../api.js";

// =====================
// ELEMENTS
// =====================
const form = document.getElementById("vehicle-form");

const brand = document.getElementById("brand");
const model = document.getElementById("model");
const year = document.getElementById("year");
const mileage = document.getElementById("mileage");
const fuel_type = document.getElementById("fuel_type");
const transmission = document.getElementById("transmission");
const price = document.getElementById("price");
const description = document.getElementById("description");
const image = document.getElementById("image");
const category = document.getElementById("category");
const vehicle_type = document.getElementById("vehicle_type");
const status = document.getElementById("status");

// =====================
// MODE CHECK
// =====================
const params = new URLSearchParams(window.location.search);
const vehicleId = params.get("id");
const isEdit = !!vehicleId;

// =====================
// LOAD VEHICLE (EDIT)
// =====================
async function loadVehicle() {
    if (!isEdit) return;

    document.getElementById("form-title").innerText = "Modifier véhicule";

    const res = await api(`/vehicles/${vehicleId}`, "GET");

    if (res.error) {
        alert(res.error);
        return;
    }

    const v = res.data;

    brand.value = v.brand || "";
    model.value = v.model || "";
    year.value = v.year || "";
    mileage.value = v.mileage || "";
    fuel_type.value = v.fuel_type || "";
    transmission.value = v.transmission || "";
    price.value = v.price || "";
    description.value = v.description || "";
    category.value = v.category || "";
    vehicle_type.value = v.vehicle_type || "";
    status.value = v.status || "available";
}

// =====================
// SUBMIT (CREATE / UPDATE)
// =====================
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("brand", brand.value);
    formData.append("model", model.value);
    formData.append("year", year.value);
    formData.append("mileage", mileage.value);
    formData.append("fuel_type", fuel_type.value);
    formData.append("transmission", transmission.value);
    formData.append("price", price.value);
    formData.append("description", description.value);
    formData.append("category", category.value);
    formData.append("vehicle_type", vehicle_type.value);
    formData.append("status", status.value);

    if (image.files.length > 0) {
        formData.append("image", image.files[0]);
    }

    let res;

    if (isEdit) {
        console.log("✏️ UPDATE VEHICLE");
        res = await api(`/vehicles/${vehicleId}`, "PUT", formData, true);
    } else {
        console.log("➕ CREATE VEHICLE");
        res = await api("/vehicles", "POST", formData, true);
    }

    if (res.error) {
        alert(res.error);
        return;
    }

    alert(isEdit ? "Véhicule modifié ✔" : "Véhicule créé ✔");

    window.location.href = "/views/vehicles/all-vehicles.html";
});

// INIT
loadVehicle();