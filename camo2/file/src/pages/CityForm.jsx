import React, { useState, useEffect } from "react";
import axios from "axios";
import LeftBorderAlerts from "../components/child/LeftBorderAlerts";
import ConfirmAlert from "../components/child/ConfirmAlert";

function CityForm({ onCityEvent }) {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({ name: "", gmt: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });

  // Delete confirm
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const api = axios.create({
    baseURL: "http://localhost:5000/api/",
  });

  // ================= ALERT =================
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  };

  // ================= FETCH =================
  const fetchCities = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const res = await api.get("/city", {
        params: { page, limit: pageSize, search },
      });

      if (res.data.success) {
        setCities(res.data.cities);
        setTotalPages(res.data.totalPages);
        setTotalRecords(res.data.totalRecords);
        setError("");
      }
    } catch (err) {
      showAlert("danger", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities(currentPage, searchTerm);
  }, [currentPage, searchTerm, pageSize]);

  // ================= FORM =================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/city/${editingId}`, formData);
        showAlert("success", "City updated successfully");
      } else {
        await api.post("/city", formData);
        showAlert("success", "City added successfully");
      }

      setFormData({ name: "", gmt: "" });
      setIsEditing(false);
      setEditingId(null);
      setCurrentPage(1);
      fetchCities(1, searchTerm);
    } catch (err) {
      showAlert("danger", err.response?.data?.message || "Operation failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = (city) => {
    setFormData({ name: city.name, gmt: city.gmt });
    setIsEditing(true);
    setEditingId(city.id);
  };

  // ================= DELETE =================
  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
    setShowConfirm(true);
  };

  // 🔥 FIX: adjust page after delete
  const adjustPageAfterDelete = (newTotalRecords) => {
    const newTotalPages = Math.ceil(newTotalRecords / pageSize);

    if (newTotalPages === 0) {
      setCurrentPage(1);
      setCities([]);
      return;
    }

    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
      fetchCities(newTotalPages, searchTerm);
    } else {
      fetchCities(currentPage, searchTerm);
    }
  };

  const confirmDelete = async () => {
    try {
      const res = await api.delete(`/city/${confirmDeleteId}`);

      if (res.data.success) {
        const newTotalRecords = totalRecords - 1;

        setCities((prev) => prev.filter((c) => c.id !== confirmDeleteId));
        setTotalRecords(newTotalRecords);

        showAlert("danger", "City deleted successfully");

        // ✅ pagination fix
        adjustPageAfterDelete(newTotalRecords);
      }
    } catch (err) {
      showAlert("danger", err.message);
    } finally {
      setShowConfirm(false);
      setConfirmDeleteId(null);
    }
  };

  // ================= SEARCH =================
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCities(1, searchTerm);
  };

  // ================= PAGINATION =================
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <div className="col-xl-6 p-20 radius-10">
          {alert.message && (
            <LeftBorderAlerts
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert({ type: "", message: "" })}
            />
          )}
          {/* DELETE CONFIRM ALERT */}
          {confirmDeleteId && (
            <ConfirmAlert
              open={showConfirm}
              message="Are you sure you want to delete this city?"
              onConfirm={confirmDelete}
              onCancel={() => setConfirmDeleteId(null)}
            />
          )}
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3 city-head">
            <h4>City [New]</h4>
            <div className="city-head-small">
              As per criteria {totalRecords} Record(s) Found.
            </div>
          </div>

          {/* Search */}
          <div className="card mb-3">
            <div className="card-body">
              <form onSubmit={handleSearch}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search cities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-outline-secondary">
                    <i className="bi bi-search"></i> Search
                  </button>

                  {searchTerm && (
                    <button
                      className="btn btn-outline-danger"
                      type="button"
                      onClick={() => {
                        setSearchTerm("");
                        fetchCities(1, "");
                      }}
                    >
                      <i className="bi bi-x-circle"></i> Clear
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Form */}
          <div className="card mb-4">
            <div className="card-body">
              <h5>{isEditing ? "Edit City" : "Add New City"}</h5>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">GMT *</label>
                    <select
                      className="form-select"
                      name="gmt"
                      value={formData.gmt}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">(SELECT)</option>
                      {/* Your GMT list is long — keeping as-is */}
                      {[
                        "-00:15",
                        "-00:30",
                        "-00:45",
                        "-01:00",
                        "-01:15",
                        "-01:30",
                        "-01:45",
                        "-02:00",
                        "-02:15",
                        "-02:30",
                        "-02:45",
                        "-03:00",
                        "-03:15",
                        "-03:30",
                        "-03:45",
                        "-04:00",
                        "-04:15",
                        "-04:30",
                        "-04:45",
                        "-05:00",
                        "-05:15",
                        "-05:30",
                        "-05:45",
                        "-06:00",
                        "-06:15",
                        "-06:30",
                        "-06:45",
                        "-07:00",
                        "-07:15",
                        "-07:30",
                        "-07:45",
                        "-08:00",
                        "-08:15",
                        "-08:30",
                        "-08:45",
                        "-09:00",
                        "-09:15",
                        "-09:30",
                        "-09:45",
                        "-10:00",
                        "-10:15",
                        "-10:30",
                        "-10:45",
                        "-11:00",
                        "-11:15",
                        "-11:30",
                        "-11:45",
                        "-12:00",
                        "+00:00",
                        "+00:15",
                        "+00:30",
                        "+00:45",
                        "+01:00",
                        "+01:15",
                        "+01:30",
                        "+01:45",
                        "+02:00",
                        "+02:15",
                        "+02:30",
                        "+02:45",
                        "+03:00",
                        "+03:15",
                        "+03:30",
                        "+03:45",
                        "+04:00",
                        "+04:15",
                        "+04:30",
                        "+04:45",
                        "+05:00",
                        "+05:15",
                        "+05:30",
                        "+05:45",
                        "+06:00",
                        "+06:15",
                        "+06:30",
                        "+06:45",
                        "+07:00",
                        "+07:15",
                        "+07:30",
                        "+07:45",
                        "+08:00",
                        "+08:15",
                        "+08:30",
                        "+08:45",
                        "+09:00",
                        "+09:15",
                        "+09:30",
                        "+09:45",
                        "+10:00",
                        "+10:15",
                        "+10:30",
                        "+10:45",
                        "+11:00",
                        "+11:15",
                        "+11:30",
                        "+11:45",
                        "+12:00",
                      ].map((gmt) => (
                        <option key={gmt} value={gmt}>
                          {gmt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4 d-flex align-items-end">
                    {isEditing ? (
                      <div className="btn-group">
                        <button className="btn btn-success" type="submit">
                          Update
                        </button>
                        <button
                          className="btn btn-secondary"
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({ name: "", gmt: "" });
                            setEditingId(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={!formData.name || !formData.gmt}
                      >
                        Add City
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Error */}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Loading */}
          {loading && (
            <div className="text-center my-4">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2">Loading cities...</p>
            </div>
          )}

          {/* Table */}
          {!loading && cities.length > 0 && (
            <>
              <div className="table-responsive">
                <table className="table table-hover table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>GMT</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cities.map((city) => (
                      <tr key={city.id}>
                        <td>{city.name}</td>
                        <td>{city.gmt}</td>
                        <td>
                          <button
                            className="btn btn-outline-primary btn-sm me-2"
                            onClick={() => handleEdit(city)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteClick(city.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="mt-4">
                  <ul className="pagination justify-content-center">
                    {getPageNumbers().map((p) => (
                      <li
                        key={p}
                        className={`page-item ${
                          currentPage === p ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => goToPage(p)}
                        >
                          {p}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </>
          )}

          {!loading && cities.length === 0 && (
            <div className="alert alert-info">No cities found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CityForm;
