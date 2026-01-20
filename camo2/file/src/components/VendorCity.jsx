import React, { useState, useEffect } from "react";
import axios from "axios";
import LeftBorderAlerts from "../components/child/LeftBorderAlerts";
import ConfirmAlert from "./child/ConfirmAlert";
import Modal from "../components/Modal";
import { FaCirclePlus } from "react-icons/fa6";
import VendorState from "../components/VendorState";
import { BsPencilSquare, BsTrash } from "react-icons/bs";

function VendorCity({ onCancel }) {
  const [showCityModal, setShowCityModal] = useState(false);

  const [formData, setFormData] = useState({
    v_city_name: "",
    state_id: "",
  });

  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const api = axios.create({
    baseURL: "http://localhost:5000/api/",
  });

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert({ type: "", message: "" });
    }, 3000);
  };

  // FETCH COUNTRIES
  const fetchCities = async () => {
    try {
      const res = await api.get("vendor/city");
      if (res.data.success) setCities(res.data.cities);
    } catch {
      showAlert("error", "Failed to load cities");
    }
  };

  // FETCH
  const fetchStates = async () => {
    try {
      const res = await api.get("vendor/state");
      if (res.data.success) setStates(res.data.states);
    } catch {
      showAlert("error", "Failed to load states");
    }
  };

  useEffect(() => {
    fetchCities();
    fetchStates();
  }, []);

  // ADD
  const handleAddCity = async () => {
    const name = formData.v_city_name.trim();
    const stateId = formData.state_id;

    if (!name) return showAlert("error", "Enter city name");
    if (!stateId) return showAlert("error", "Select a state");

    setLoading(true);

    try {
      // 👉 EDIT MODE
      if (isEditing) {
        const res = await api.put(`vendor/city/${editingId}`, {
          v_city_name: name,
          state_id: stateId,
        });

        if (res.data.success) {
          setCities((prev) =>
            prev.map((c) =>
              c.v_city_id === editingId
                ? { ...c, v_city_name: name, state_id: stateId }
                : c
            )
          );

          showAlert("success", "City updated successfully");
        }
      }
      // 👉 ADD MODE
      else {
        const exists = cities.some(
          (c) =>
            c.v_city_name.toLowerCase() === name.toLowerCase() &&
            c.state_id === stateId
        );

        if (exists) {
          setLoading(false);
          return showAlert("error", "City already exists");
        }

        const res = await api.post("vendor/city", {
          v_city_name: name,
          state_id: stateId,
        });

        if (res.data.success) {
          setCities((prev) => [res.data.city, ...prev]);
          showAlert("success", "City added successfully");
        }
      }

      // 🔄 RESET FORM (for both add & edit)
      setFormData({ v_city_name: "", state_id: "" });
      setIsEditing(false);
      setEditingId(null);
      setSelectedCountry("");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        (isEditing ? "Update failed" : "Add failed");

      showAlert("error", msg);
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = (v_city) => {
    setFormData({ v_city_name: v_city.v_city_name, state_id: v_city.state_id });
    setIsEditing(true);
    setEditingId(v_city.v_city_id);
  };

  // DELETE
  const handleDeleteCity = (id) => {
    setConfirmDeleteId(id);
    setShowConfirm(true);
  };

  const adjustPageAfterDelete = (newTotalRecords) => {
    const newTotalPages = Math.ceil(newTotalRecords / pageSize);
    const targetPage =
      currentPage > newTotalPages ? newTotalPages : currentPage;

    setCurrentPage(targetPage > 0 ? targetPage : 1);
  };

  const handleStateChange = (e) => {
    const stateId = e.target.value;

    const selectedState = states.find(
      (s) => String(s.state_id) === String(stateId)
    );

    setFormData({ ...formData, state_id: stateId });
    setSelectedCountry(selectedState?.country?.country_name || "");
  };

  const confirmDelete = async () => {
    try {
      const res = await api.delete(`vendor/city/${confirmDeleteId}`);
      if (res.data.success) {
        setCities((prev) => {
          const updated = prev.filter((c) => c.v_city_id !== confirmDeleteId);

          const newTotalPages = Math.ceil(updated.length / pageSize);
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          }

          return updated;
        });

        showAlert("success", "City deleted successfully");
      }
    } catch {
      showAlert("danger", "Delete failed");
    } finally {
      setShowConfirm(false);
      setConfirmDeleteId(null);
    }
  };

  const getStateNameById = (id) => {
    const state = states.find((s) => String(s.state_id) === String(id));
    return state ? state.state_name : "N/A";
  };

  // PAGINATION
  const totalPages = Math.ceil(cities.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const paginatedCities = cities.slice(start, start + pageSize);
  return (
    <div className="container p-3">
      {alert.message && (
        <LeftBorderAlerts
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      )}

      {showConfirm && (
        <ConfirmAlert
          open={showConfirm}
          message="Are you sure you want to delete this city?"
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowConfirm(false);
            setConfirmDeleteId(null);
          }}
        />
      )}
      {/* Header with actions */}
      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
        <div className="d-flex align-items-center">
          <h4 className="mb-0 fw-bold">City Information</h4>
          <span className="text-primary ms-2">[New]</span>
        </div>
        <div className="d-flex gap-2">
          <button
            className={`btn btn-sm ${
              isEditing ? "btn-warning" : "btn-success"
            }`}
            onClick={handleAddCity}
            disabled={loading}
          >
            {isEditing ? "Update" : "Save"}
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm fw-bold px-3"
            onClick={onCancel}
          >
            Close
          </button>
        </div>
      </div>

      {/* City Form */}
      <div className="col-md-12">
        <div className="mb-3 row align-items-center">
          <label className="col-md-3 col-form-label fw-medium">- Name</label>
          <div className="col-md-9">
            <input
              type="text"
              className="form-control"
              name="v_city_name"
              value={formData.v_city_name}
              onChange={(e) =>
                setFormData({ ...formData, v_city_name: e.target.value })
              }
            />
          </div>
        </div>

        <div className="mb-3 row align-items-center">
          <label className="col-md-3 col-form-label fw-medium">
            - State Name
          </label>
          <div className="col-md-8">
            <select
              className="form-select"
              name="state_id"
              value={formData.state_id}
              onChange={handleStateChange}
            >
              <option value="">-- Select State --</option>
              {states.map((state) => (
                <option key={state.state_id} value={state.state_id}>
                  {state.state_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-1">
            <button
              className="btn"
              type="button"
              onClick={() => setShowCityModal(true)}
            >
              <FaCirclePlus className="me-2 fs-4" />
            </button>
            {/* State Modal */}
            <Modal
              show={showCityModal}
              title="Add New State"
              onClose={() => setShowCityModal(false)}
            >
              <VendorState
                onCancel={() => setShowCityModal(false)}
                onSubmit={handleAddCity}
              />
            </Modal>
          </div>
        </div>

        <div className="mb-3 row align-items-center">
          <label className="col-md-3 col-form-label fw-medium">- Country</label>
          <div className="col-md-9">
            <input
              type="text"
              className="form-control"
              value={selectedCountry}
              readOnly
              placeholder="Auto selected"
              style={{ backgroundColor: "#f8f9fa" }}
            />
          </div>
        </div>
      </div>

      {/* City List Table */}
      <div className="card mb-4">
        <div className="card-header bg-light py-2">
          <h5 className="mb-0 fw-bold">City List</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-3 fw-medium" style={{ width: "60%" }}>
                    Name
                  </th>
                  <th className="fw-medium" style={{ width: "30%" }}>
                    State
                  </th>
                  <th
                    className="pe-3 fw-medium text-end"
                    style={{ width: "10%" }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedCities.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No cities added
                    </td>
                  </tr>
                )}
                {paginatedCities.map((c) => (
                  <tr key={c.v_city_id}>
                    <td className="ps-3">{c.v_city_name}</td>
                    <td>{getStateNameById(c.state_id)}</td>
                    <td className="pe-3 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary action-btn"
                          title="Edit"
                          onClick={() => handleEdit(c)}
                        >
                          <BsPencilSquare />
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger action-btn"
                          title="Delete"
                          onClick={() => handleDeleteCity(c.v_city_id)}
                        >
                          <BsTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPages }).map((_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export default VendorCity;
