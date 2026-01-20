import React, { useState, useEffect } from "react";
import axios from "axios";
import LeftBorderAlerts from "../components/child/LeftBorderAlerts";
import ConfirmAlert from "./child/ConfirmAlert";
import Modal from "../components/Modal";
import { FaCirclePlus } from "react-icons/fa6";
import VendorCountry from "../components/VendorCountry";
import { BsPencilSquare, BsTrash } from "react-icons/bs";

function VendorState({ initialData, onSubmit, onCancel }) {
  const [showCountryModal, setShowCountryModal] = useState(false);

  const [formData, setFormData] = useState({
    state_name: "",
    country_id: "",
  });
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [countries, setCountries] = useState([]);
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
    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  };

  // FETCH COUNTRIES
  const fetchCountries = async () => {
    try {
      const res = await api.get("vendor/country");
      if (res.data.success) setCountries(res.data.countries);
    } catch {
      showAlert("error", "Failed to load countries");
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
    fetchCountries();
    fetchStates();
  }, []);

  // ADD
  const handleAddState = async () => {
    const name = formData.state_name.trim();
    const countryId = formData.country_id;
    if (!name) return showAlert("error", "Enter state name");
    if (!countryId) return showAlert("error", "Select a country");

    const exists = states.some(
      (s) =>
        s.state_name.toLowerCase() === name.toLowerCase() &&
        s.country_id === countryId
    );
    if (exists) {
      return showAlert("error", "State already exists");
    }

    setLoading(true);
    try {
      if (isEditing) {
        const res = await api.put(`vendor/state/${editingId}`, {
          state_name: name,
          country_id: countryId,
        });

        if (res.data.success) {
          setStates((prev) =>
            prev.map((s) =>
              s.state_id === editingId
                ? { ...s, state_name: name, country_id: countryId }
                : s
            )
          );

          showAlert("success", "State updated successfully");
        }
      } else {
        const res = await api.post("vendor/state", {
          state_name: name,
          country_id: countryId,
        });
        if (res.data.success) {
          setStates((prev) => [res.data.state, ...prev]);
          setFormData({ state_name: "", country_id: "" });
          showAlert("success", "State added Successfully");
        }
      }
      // 🔄 RESET FORM (for both add & edit)
      setFormData({ state_name: "", country_id: "" });
      setIsEditing(false);
      setEditingId(null);
      // setSelectedCountry("");
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
  const handleEdit = (v_state) => {
    setFormData({
      state_name: v_state.state_name,
      country_id: v_state.country_id,
    });
    setIsEditing(true);
    setEditingId(v_state.state_id);
  };

  // DELETE
  const handleDeleteState = (id) => {
    setConfirmDeleteId(id);
    setShowConfirm(true);
  };

  const adjustPageAfterDelete = (newTotalRecords) => {
    const newTotalPages = Math.ceil(newTotalRecords / pageSize);
    const targetPage =
      currentPage > newTotalPages ? newTotalPages : currentPage;

    setCurrentPage(targetPage > 0 ? targetPage : 1);
  };

  const confirmDelete = async () => {
    try {
      const res = await api.delete(`/vendor/state/${confirmDeleteId}`);

      // 🔴 Handle logical failure
      if (!res.data.success) {
        showAlert("error", res.data.message || "Delete failed");
        return;
      }

      // 🟢 Success
      setStates((prev) => {
        const updated = prev.filter((s) => s.state_id !== confirmDeleteId);

        const newTotalPages = Math.ceil(updated.length / pageSize);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }

        return updated;
      });

      showAlert("success", res.data.message || "State deleted successfully");
    } catch (error) {
      // 🔴 Network / 4xx / 5xx error
      showAlert("error", error?.response?.data?.message || "Delete failed");
    } finally {
      setShowConfirm(false);
      setConfirmDeleteId(null);
    }
  };

  const getCountryNameById = (id) => {
    const country = countries.find((c) => String(c.country_id) === String(id));
    return country ? country.country_name : "N/A";
  };

  // PAGINATION
  const totalPages = Math.ceil(states.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const paginatedStates = states.slice(start, start + pageSize);

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
          message="Are you sure you want to delete this state?"
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowConfirm(false);
            setConfirmDeleteId(null);
          }}
        />
      )}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
        <div className="d-flex align-items-center">
          <h4 className="mb-0 fw-bold">State Information</h4>
          <span className="text-primary ms-2">[New]</span>
        </div>
        <div className="d-flex gap-2">
          <button
            className={`btn btn-sm ${
              isEditing ? "btn-warning" : "btn-success"
            }`}
            onClick={handleAddState}
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

      {/* State Form */}
      <div className="col-md-12">
        <div className="mb-3 row align-items-center">
          <label className="col-md-3 col-form-label fw-medium">
            - State Name
          </label>
          <div className="col-md-9">
            <input
              type="text"
              className="form-control"
              name="state_name"
              value={formData.state_name}
              onChange={(e) =>
                setFormData({ ...formData, state_name: e.target.value })
              }
              placeholder="Enter state name"
            />
          </div>
        </div>

        <div className="mb-3 row align-items-center">
          <label className="col-md-3 col-form-label fw-medium">- Country</label>
          <div className="col-md-8">
            <select
              className="form-select"
              name="country_id"
              value={formData.country_id}
              onChange={(e) =>
                setFormData({ ...formData, country_id: e.target.value })
              }
            >
              <option value="">-- Select Country --</option>
              {countries.map((country) => (
                <option key={country.country_id} value={country.country_id}>
                  {country.country_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-1">
            <button
              className="btn"
              type="button"
              onClick={() => setShowCountryModal(true)}
            >
              <FaCirclePlus className="me-2 fs-4" />
            </button>
            {/* Country Modal */}
            <Modal
              show={showCountryModal}
              title="Country Information"
              onClose={() => setShowCountryModal(false)}
            >
              <VendorCountry
                onCancel={() => setShowCountryModal(false)}
                onSubmit={handleAddState}
              />
            </Modal>
          </div>
        </div>
      </div>

      {/* State List Table */}
      <div className="card mb-4">
        <div className="card-header bg-light py-2">
          <h5 className="mb-0 fw-bold">State List</h5>
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
                    Country
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
                {paginatedStates.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No states added
                    </td>
                  </tr>
                )}
                {paginatedStates.map((s) => (
                  <tr key={s.state_id}>
                    <td className="ps-3">{s.state_name}</td>
                    <td>{getCountryNameById(s.country_id)}</td>
                    <td className="pe-3 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary action-btn"
                          title="Edit"
                          onClick={() => handleEdit(s)}
                        >
                          <BsPencilSquare />
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger action-btn"
                          title="Delete"
                          onClick={() => handleDeleteState(s.state_id)}
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

export default VendorState;
