import React, { useState, useEffect } from "react";
import axios from "axios";
import LeftBorderAlerts from "../components/child/LeftBorderAlerts";
import ConfirmAlert from "../components/child/ConfirmAlert";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import SubAtaForm from "../pages/SubAtaForm";

function AtaForm() {
  // ================= STATE VARIABLES =================
  const [atas, setAta] = useState([]);
  const [showSubAtaModal, setShowSubAtaModal] = useState(false);
  const [selectedAta, setSelectedAta] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });

  const [formData, setFormData] = useState({
    code: "",
    chapter: "",
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
  const fetchAta = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const res = await api.get("/ata", {
        params: { page, limit: pageSize, search },
      });

      if (res.data.success) {
        setAta(res.data.atas);
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
  // ================= EFFECTS =================
  useEffect(() => {
    fetchAta(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

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

    if (!formData.code || !formData.chapter) {
      showAlert("error", "Please fill in all required fields");
      return;
    }

    try {
      if (isEditing && editingId) {
        await api.put(`/ata/${editingId}`, formData);
        showAlert("success", "ATA updated successfully");
      } else {
        await api.post("/ata", formData);
        showAlert("success", "ATA added successfully");
      }

      setFormData({
        code: "",
        chapter: "",
      });
      setIsEditing(false);
      setEditingId(null);
      fetchAta(1, searchTerm);
      setCurrentPage(1);
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Operation failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = (atas) => {
    setFormData({
      code: atas.code,
      atas,
      chapter: atas.chapter,
    });
    setIsEditing(true);
    setEditingId(atas.id);
  };

  // ================= DELETE =================
  const handleDeleteClick = (id) => {
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
      const res = await api.delete(`/ata/${confirmDeleteId}`);
      if (res.data.success) {
        const newTotalRecords = totalRecords - 1;
        setAta((prev) => prev.filter((p) => p.id !== confirmDeleteId));
        setTotalRecords(newTotalRecords);
        showAlert("success", "ATA deleted successfully");
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
        <div className="col-xl-6">
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
              message="Are you sure you want to delete this ATA?"
              onConfirm={confirmDelete}
              onCancel={() => setConfirmDeleteId(null)}
            />
          )}

          {/* Header */}
          <div className="row mb-3">
            <div className="col">
              <h4 className="fw-bold text-dark mb-1 city-head text-white">
                ATA [New]
              </h4>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="card shadow-sm border mb-4">
              <div className="card-header bg-transparent py-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0 fw-semibold">ATA</h5>
                  <button
                    className={`btn ${
                      isEditing ? "btn-success" : "btn-primary"
                    } btn-sm`}
                    type="submit"
                    disabled={!formData.code || !formData.chapter}
                  >
                    <i
                      className={`bi ${
                        isEditing ? "bi-pencil-square" : "bi-plus-circle"
                      } me-2`}
                    ></i>
                    {isEditing ? "Update" : "Save"}
                  </button>
                </div>
              </div>
              <div className="card-body">
                {/* Code */}
                <div className="row mb-3 align-items-center">
                  <label className="col-sm-3 col-form-label fw-semibold">
                    <span className="text-danger">*</span> Code
                  </label>
                  <div className="col-sm-4">
                    <input
                      type="text"
                      className="form-control"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Chapter */}
                <div className="row mb-2 align-items-center">
                  <label className="col-sm-3 col-form-label fw-semibold">
                    <span className="text-danger">*</span> Chapter
                  </label>
                  <div className="col-sm-4">
                    <input
                      type="text"
                      className="form-control"
                      name="chapter"
                      value={formData.chapter}
                      onChange={handleInputChange}
                    />
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
                <div className="col-md-2 search-head">
                  <span>Chapter</span>
                </div>
                <div className="col-md-5 p-0">
                  <form onSubmit={handleSearch}>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search By Chapter..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={handleSearch}
                      >
                        Search
                      </button>
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
                <div className="col-md-12 text-start m-10">
                  <div className="badge bg-light text-dark fs-6 px-3 py-2 border">
                    ATA List: {totalRecords} Record(s) Found.
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary"></div>
                <p className="mt-2">Loading ATA...</p>
              </div>
            ) : atas.length === 0 ? (
              <div className="card-body text-center py-5">
                <div className="icon-shape icon-xxl bg-light text-muted rounded-circle mb-3">
                  <i className="bi bi-inbox"></i>
                </div>
                <h5 className="text-muted">No ATA found</h5>
                <p className="text-muted">
                  Add your first ATA using the button above.
                </p>
              </div>
            ) : (
              <>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="ps-4 fw-semibold text-uppercase text-sm text-secondary">
                            Code
                          </th>
                          <th className="fw-semibold text-uppercase text-sm text-secondary">
                            Chapter
                          </th>
                          <th className="fw-semibold text-uppercase text-sm text-secondary">
                            Add / Edit Sub ATA
                          </th>
                          <th className="pe-4 fw-semibold text-uppercase text-sm text-secondary text-end">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {atas.map((ata) => {
                          return (
                            <tr key={ata.id} className="border-bottom">
                              <td className="ps-4 fw-medium">{ata.code}</td>
                              <td className="fw-medium">{ata.chapter}</td>
                              <td className="fw-medium"> 
                                <Link
                                  className="text-red"
                                  onClick={() =>{
                                    setSelectedAta(ata);
                                    setShowSubAtaModal(true);
                                  }}
                                >
                                  (1) Records
                                </Link>
                              </td>
                              <td className="pe-4 text-end">
                                <div className="btn-group btn-group-sm">
                                  <button
                                    className="btn btn-outline-primary"
                                    onClick={() => handleEdit(ata)}
                                  >
                                    <i className="bi bi-pencil me-1"></i> Edit
                                  </button>
                                  <button
                                    className="btn btn-outline-danger"
                                    onClick={() => handleDeleteClick(ata.id)}
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
          </div>
        </div>
      </div>
      {/* CITY MODAL */}
      <SubAtaForm
        show={showSubAtaModal}
        title="Sub ATA [New]"
        onClose={() => setShowSubAtaModal(false)}
        ata={selectedAta}
      ></SubAtaForm>
    </div>
  );
}

export default AtaForm;
