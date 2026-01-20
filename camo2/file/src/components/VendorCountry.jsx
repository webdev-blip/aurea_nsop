import React, { useState, useEffect } from "react";
import axios from "axios";
import LeftBorderAlerts from "../components/child/LeftBorderAlerts";
import ConfirmAlert from "./child/ConfirmAlert";
import { BsPencilSquare, BsTrash } from "react-icons/bs";

function VendorCountry({ onCancel }) {
  const [formData, setFormData] = useState({ country_name: "" });
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 5;

  const api = axios.create({
    baseURL: "http://localhost:5000/api/",
  });

  // ALERT
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  };

  // FETCH
  const fetchCountries = async () => {
    try {
      const res = await api.get("vendor/country");
      if (res.data.success) setCountries(res.data.countries);
    } catch {
      showAlert("error", "Failed to load countries");
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // ADD
  const handleAddCountry = async () => {
    const name = formData.country_name.trim();
    if (!name) return showAlert("error", "Enter country name");

    const exists = countries.some(
      (c) => c.country_name.toLowerCase() === name.toLowerCase()
    );
    if (exists) return showAlert("error", "Country already exists");

    setLoading(true);
    try {
        if (isEditing) {
        const res = await api.put(`vendor/country/${editingId}`, {
          country_name: name,
        });

        if (res.data.success) {
          setCountries((prev) =>
            prev.map((c) => 
              c.country_id === editingId
                ? { ...c, country_name: name }
                : c
            )
          );

          showAlert("success", "Country updated successfully");
        }
      } else {
      const res = await api.post("vendor/country", { country_name: name });
      if (res.data.success) {
        setCountries((prev) => [res.data.country, ...prev]);
        setFormData({ country_name: "" });
        showAlert("success", "Country added");
      }
    }
     // 🔄 RESET FORM (for both add & edit)
      setFormData({ country_name: "" });
      setIsEditing(false);
      setEditingId(null);
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
  const handleEdit = (v_country) => {
    setFormData({
      country_name: v_country.country_name,
    });
    setIsEditing(true);
    setEditingId(v_country.country_id);
  };

  // DELETE
  const handleDeleteCountry = (id) => {
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
      const res = await api.delete(`/vendor/country/${confirmDeleteId}`);
      if (res.data.success) {
        setCountries((prev) => {
          const updated = prev.filter((c) => c.country_id !== confirmDeleteId);

          // FIX: adjust page if current page becomes empty
          const newTotalPages = Math.ceil(updated.length / pageSize);
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          }

          return updated;
        });

        showAlert("success", "Country deleted successfully");
      }
    } catch {
      showAlert("danger", "Delete failed");
    } finally {
      setShowConfirm(false);
      setConfirmDeleteId(null);
    }
  };

  // PAGINATION
  const totalPages = Math.ceil(countries.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const paginatedCountries = countries.slice(start, start + pageSize);

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
          message="Are you sure you want to delete this country?"
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowConfirm(false);
            setConfirmDeleteId(null);
          }}
        />
      )}

      {/* Header */}
      <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
        <h4 className="fw-bold">Country</h4>
        <div>
          <button
            type="button"
            className={`btn btn-success btn-sm me-2 ${isEditing ? "btn-warning" : "btn-success"}`}
            disabled={loading}
            onClick={handleAddCountry}
          >
            {isEditing ? "Update" : "Save"}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onCancel}
          >
            Close
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="row mb-3">
        <div className="col-md-9">
          <input
            className="form-control"
            placeholder="Country name"
            value={formData.country_name}
            onChange={(e) => setFormData({ country_name: e.target.value })}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-3">Country</th>
                <th className="pe-3 text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCountries.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-4">
                    No data
                  </td>
                </tr>
              ) : (
                paginatedCountries.map((c) => (
                  <tr key={c.country_id}>
                    <td className="ps-3">{c.country_name}</td>
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
                          onClick={() => handleDeleteCountry(c.country_id)}
                        >
                          <BsTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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

export default VendorCountry;
