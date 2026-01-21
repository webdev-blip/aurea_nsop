import React, { useState, useEffect } from "react";
import axios from "axios";
import LeftBorderAlerts from "../components/child/LeftBorderAlerts";
import ConfirmAlert from "../components/child/ConfirmAlert";

function Place() {
  // ================= STATE VARIABLES =================
  const [places, setPlaces] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchCityId, setSearchCityId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });

  const [formData, setFormData] = useState({
    short_name: "",
    icao: "",
    name: "",
    city_id: "",
    is_day_light: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");

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

  // ================= FETCH DATA =================
  const fetchPlaces = async (page = 1, search = "", citiId = "") => {
    setLoading(true);
    try {
      const res = await api.get("/places", {
        params: { page, limit: pageSize, search, city_id: citiId || undefined },
      });

      if (res.data.success) {
        setPlaces(res.data.places);
        setTotalPages(res.data.totalPages);
        setTotalRecords(res.data.totalRecords);
        setError("");
      }
    } catch (err) {
      showAlert("error", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await api.get("/city");
      if (res.data.success) {
        setCities(res.data.cities);
      }
    } catch (err) {
      console.error("Error fetching city:", err);
    }
  };

  // ================= EFFECTS =================
  useEffect(() => {
    fetchPlaces(currentPage, searchTerm, searchCityId);
  }, [currentPage, searchTerm, searchCityId]);

  useEffect(() => {
    fetchCities();
  }, []);

  // ================= FORM HANDLERS =================
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.short_name || !formData.name || !formData.city_id) {
      showAlert("error", "Please fill in all required fields");
      return;
    }

    try {
      if (isEditing && editingId) {
        await api.put(`/places/${editingId}`, formData);
        showAlert("success", "Place updated successfully");
      } else {
        await api.post("/places", formData);
        showAlert("success", "Place added successfully");
      }

      setFormData({
        short_name: "",
        icao: "",
        name: "",
        city_id: "",
        is_day_light: false,
      });
      setIsEditing(false);
      setEditingId(null);
       fetchPlaces(1, searchTerm, searchCityId);
  setCurrentPage(1);
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Operation failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = (place) => {
    setFormData({
      short_name: place.short_name,
      icao: place.icao,
      name: place.name,
      city_id: place.city_id,
      is_day_light: place.is_day_light === 1 || place.is_day_light === true,
    });
    setIsEditing(true);
    setEditingId(place.id);
  };

  // ================= DELETE =================
  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
    setShowConfirm(true);
  };

  const adjustPageAfterDelete = (newTotalRecords) => {
    const newTotalPages = Math.ceil(newTotalRecords / pageSize);
    const targetPage = currentPage > newTotalPages ? newTotalPages : currentPage;

    setCurrentPage(targetPage > 0 ? targetPage : 1);
  };

  const confirmDelete = async () => {
    try {
      const res = await api.delete(`/places/${confirmDeleteId}`);
      if (res.data.success) {
        const newTotalRecords = totalRecords - 1;
        setPlaces((prev) => prev.filter((p) => p.id !== confirmDeleteId));
        setTotalRecords(newTotalRecords);
        showAlert("success", "Place deleted successfully");
        adjustPageAfterDelete(newTotalRecords);
      }
    } catch {
      showAlert("danger", "Delete failed");
    } finally {
      setShowConfirm(false);
      setConfirmDeleteId(null);
    }
  };

  // ================= SEARCH =================
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // useEffect will handle fetching
  };

  // ================= PAGINATION =================
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  };

  // ================= RENDER =================
  return (
    <div className="container-fluid p-3">
      <div className="row">
        <div className="col-xl-8">
          {alert.message && (
            <LeftBorderAlerts
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert({ type: "", message: "" })}
            />
          )}

          {confirmDeleteId && (
            <ConfirmAlert
              open={showConfirm}
              message="Are you sure you want to delete this city?"
              onConfirm={confirmDelete}
              onCancel={() => setConfirmDeleteId(null)}
            />
          )}

          {/* Header */}
          <div className="row mb-3">
            <div className="col">
              <h4 className="fw-bold text-dark mb-1 city-head text-white">Place [New]</h4>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="card shadow-sm border mb-4">
              <div className="card-header bg-transparent py-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0 fw-semibold">Place</h5>
                  <button
                    className={`btn ${isEditing ? "btn-success" : "btn-primary"} btn-sm`}
                    type="submit"
                    disabled={!formData.short_name || !formData.name || !formData.city_id}
                  >
                    <i className={`bi ${isEditing ? "bi-pencil-square" : "bi-plus-circle"} me-2`}></i>
                    {isEditing ? "Update Place" : "Add New Place"}
                  </button>
                </div>
              </div>
              <div className="card-body">
                {/* Short Name */}
                <div className="row mb-2 align-items-center">
                  <label className="col-sm-3 col-form-label fw-semibold">
                    <span className="text-danger">*</span> Short Name
                  </label>
                  <div className="col-sm-4">
                    <input
                      type="text"
                      className="form-control"
                      name="short_name"
                      value={formData.short_name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* ICAO */}
                <div className="row mb-2 align-items-center">
                  <label className="col-sm-3 col-form-label fw-semibold">
                    <span className="mr-2" style={{marginLeft:"7px"}}></span> ICAO
                  </label>
                  <div className="col-sm-4">
                    <input
                      type="text"
                      className="form-control"
                      name="icao"
                      value={formData.icao}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="row mb-2 align-items-center">
                  <label className="col-sm-3 col-form-label fw-semibold">
                    <span className="text-danger">*</span> Name
                  </label>
                  <div className="col-sm-6">
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* City */}
                <div className="row mb-2 align-items-center">
                  <label className="col-sm-3 col-form-label fw-semibold">
                    <span className="text-danger">*</span> City
                  </label>
                  <div className="col-sm-5 d-flex gap-2">
                    <select
                      className="form-select"
                      name="city_id"
                      value={formData.city_id}
                      onChange={handleInputChange}
                    >
                      <option value="">(SELECT)</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Table */}
          <div className="card shadow-sm border">
            <div className="card-header bg-transparent border-bottom card-header-place">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="row">
                <div className="col-md-1 search-head">
                  <span>Place</span>
                </div>
                <div className="col-md-5 p-0">
                  <form onSubmit={handleSearch}>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search places..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>Search</button>
                      {searchTerm && (
                        <button
                          className="btn btn-outline-danger"
                          type="button"
                          onClick={() => {
                            setSearchTerm("");
                            setCurrentPage(1);
                          }}
                        >
                          <i className="bi bi-x-circle"></i> Clear
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="col-md-1 search-head">
                  <span>City</span>
                </div>
                <div className="col-md-5 p-0">
                  <select
                    className="form-select"
                    value={searchCityId}
                    onChange={(e) => {
                      setSearchCityId(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">(SELECT)</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4 text-start m-10">
                  <div className="badge bg-light text-dark fs-6 px-3 py-2 border">
                    As per criteria {totalRecords} Record(s) Found.
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary"></div>
                <p className="mt-2">Loading places...</p>
              </div>
            ) : places.length === 0 ? (
              <div className="card-body text-center py-5">
                <div className="icon-shape icon-xxl bg-light text-muted rounded-circle mb-3">
                  <i className="bi bi-inbox"></i>
                </div>
                <h5 className="text-muted">No places found</h5>
                <p className="text-muted">
                  Add your first place using the button above.
                </p>
              </div>
            ) : (
              <>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="ps-4 fw-semibold text-uppercase text-xs text-secondary">
                            Short Name
                          </th>
                          <th className="fw-semibold text-uppercase text-xs text-secondary">
                            ICAO
                          </th>
                          <th className="fw-semibold text-uppercase text-xs text-secondary">
                            Name
                          </th>
                          <th className="fw-semibold text-uppercase text-xs text-secondary">
                            City
                          </th>
                          <th className="fw-semibold text-uppercase text-xs text-secondary">
                            Is Day Light
                          </th>
                          <th className="pe-4 fw-semibold text-uppercase text-xs text-secondary text-end">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {places.map((place) => {
                          const cityName =
                            cities.find((c) => c.id === place.city_id)?.name || "—";

                          return (
                            <tr key={place.id} className="border-bottom">
                              <td className="ps-4 fw-medium">{place.short_name}</td>
                              <td className="fw-medium">{place.icao}</td>
                              <td>{place.name || "—"}</td>
                              <td>
                                <span className="badge bg-primary bg-opacity-10 text-primary">
                                  {cityName}
                                </span>
                              </td>
                              <td>
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    checked={place.is_day_light === 1 || place.is_day_light === true}
                                    readOnly
                                  />
                                </div>
                              </td>
                              <td className="pe-4 text-end">
                                <div className="btn-group btn-group-sm">
                                  <button
                                    className="btn btn-outline-primary"
                                    onClick={() => handleEdit(place)}
                                  >
                                    <i className="bi bi-pencil me-1"></i> Edit
                                  </button>
                                  <button
                                    className="btn btn-outline-danger"
                                    onClick={() => handleDeleteClick(place.id)}
                                  >
                                    <i className="bi bi-trash me-1"></i> Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {totalPages > 1 && (
                  <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                      {getPageNumbers().map((p) => (
                        <li key={p} className={`page-item ${currentPage === p ? "active" : ""}`}>
                          <button className="page-link" onClick={() => goToPage(p)}>
                            {p}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Place;
