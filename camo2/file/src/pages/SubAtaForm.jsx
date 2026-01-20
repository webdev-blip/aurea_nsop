import React, { useState, useEffect } from "react";
import axios from "axios";
import LeftBorderAlerts from "../components/child/LeftBorderAlerts";
import ConfirmAlert from "../components/child/ConfirmAlert";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
// import SubAtaForm from "../pages/SubAtaForm";

function SubAtaForm({ show, onClose, title, ata }) {

  // ================= STATE VARIABLES =================
  const [subatas, setSubAta] = useState([]);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });

  const [formData, setFormData] = useState({
    ata_chapter	: "",
    sub_ata_code: "",
    sub_code: "",
    sub_ata_chapter: "",
    description: "",
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
const fetchSubAta = async (page = 1, search = "") => {
  if (!ata?.id) return;

  setLoading(true);
  try {
    const res = await api.get(`/ata/${ata.id}/sub`, {
      params: { page, limit: pageSize, search },
    });

    if (res.data.success) {
      setSubAta(res.data.subatas);
      setTotalPages(res.data.totalPages);
      setTotalRecords(res.data.totalRecords);
    }
  } catch (err) {
    showAlert("error", err.message);
  } finally {
    setLoading(false);
  }
};


  // ================= EFFECTS =================
  useEffect(() => {
    fetchSubAta(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

useEffect(() => {
  if (show && ata) {
    setFormData({
      ata_id: ata.id,
      ata_chapter: `${ata.code} - ${ata.chapter}`,
      sub_ata_code: "",
      sub_code: "",
      sub_ata_chapter: "",
      description: "",
    });
    fetchSubAta(1, "");
  }
}, [show, ata]);



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

    if (!formData.sub_ata_code || !formData.sub_ata_chapter) {
      showAlert("error", "Please fill in all required fields");
      return;
    }

    try {
      if (isEditing && editingId) {
        await api.put(`/ata/sub/${editingId}`, formData);
        showAlert("success", "Sub-ATA updated successfully");
      } else {
        await api.post("/ata/sub", formData);
        showAlert("success", "Sub-ATA added successfully");
      }

      setFormData({
        ata_chapter: "",
        sub_ata_code: "",
        sub_code: "",
        sub_ata_chapter: "",
        description: "",
      });
      setIsEditing(false);
      setEditingId(null);
      fetchSubAta(1, searchTerm);
      setCurrentPage(1);
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Operation failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = (subatas) => {
    setFormData({
      ata_chapter: subatas.ata_chapter,
      sub_ata_code: subatas.sub_ata_code,
      sub_code: subatas.sub_code,
      sub_ata_chapter: subatas.sub_ata_chapter,
      description: subatas.description,
    });
    setIsEditing(true);
    setEditingId(subatas.id);
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
      const res = await api.delete(`/ata/sub/${confirmDeleteId}`);
      if (res.data.success) {
        const newTotalRecords = totalRecords - 1;
        setSubAta((prev) => prev.filter((p) => p.id !== confirmDeleteId));
        setTotalRecords(newTotalRecords);
        showAlert("success", "Sub-ATA deleted successfully");
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

    if (!show) return null;

  // ================= RENDER =================
  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div className="container-fluid p-3">
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
                  <h4 className="fw-bold text-dark mb-1 city-head text-white">
                    Sub ATA [New]
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
                        disabled={!formData.sub_ata_code || !formData.sub_ata_chapter}
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
                    <div className="row mb-2 align-items-center">
                      <label className="col-sm-2 col-form-label fw-semibold">
                        <span className="mr-2" style={{marginLeft:"7px"}}></span> ATA Chapter
                      </label>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          readOnly
                          name="ata_chapter"
                          value={formData.ata_chapter}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Chapter */}
                    <div className="row mb-2 align-items-center">
                      <label className="col-sm-2 col-form-label fw-semibold">
                        <span className="text-danger">*</span> Sub ATA Code
                      </label>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          name="sub_ata_code"
                          value={formData.sub_ata_code}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="row mb-2 align-items-center">
                      <label className="col-sm-2 col-form-label fw-semibold">
                        <span className="mr-2" style={{marginLeft:"7px"}}></span> Sub Code
                      </label>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          name="sub_code"
                          value={formData.sub_code}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="row mb-2 align-items-center">
                      <label className="col-sm-2 col-form-label fw-semibold">
                        <span className="text-danger">*</span> Sub ATA Chapter
                      </label>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          name="sub_ata_chapter"
                          value={formData.sub_ata_chapter}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="row mb-2 align-items-center">
                      <label className="col-sm-2 col-form-label fw-semibold">
                        <span className="mr-2" style={{marginLeft:"7px"}}></span> Description
                      </label>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          name="description"
                          value={formData.description}
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
                    <div className="col-md-12 text-start m-10">
                      <div className="badge bg-light text-dark fs-6 px-3 py-2 border">
                        Sub ATA List: {totalRecords} Record(s) Found.
                      </div>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="card-body text-center py-5">
                    <div className="spinner-border text-primary"></div>
                    <p className="mt-2">Loading ATA...</p>
                  </div>
                ) : subatas.length === 0 ? (
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
                                ATA
                              </th>
                              <th className="fw-semibold text-uppercase text-sm text-secondary">
                                Sub-ATA Code
                              </th>
                              <th className="fw-semibold text-uppercase text-sm text-secondary">
                                Sub-ATA Chapter
                              </th>
                              <th className="fw-semibold text-uppercase text-sm text-secondary">
                                Description
                              </th>
                              <th className="pe-4 fw-semibold text-uppercase text-sm text-secondary text-end">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {subatas.map((subata) => {
                              return (
                                <tr key={subata.id} className="border-bottom">
                                  <td className="ps-4 fw-medium">{subata.ata_chapter}</td>
                                  <td className="fw-medium">{subata.sub_ata_code}</td>
                                  <td className="fw-medium">{subata.sub_ata_chapter}</td>
                                  <td className="fw-medium">{subata.description}</td>
                                  <td className="pe-4 text-end">
                                    <div className="btn-group btn-group-sm">
                                      <button
                                        className="btn btn-outline-primary"
                                        onClick={() => handleEdit(subata)}
                                      >
                                        <i className="bi bi-pencil me-1"></i>{" "}
                                        Edit
                                      </button>
                                      <button
                                        className="btn btn-outline-danger"
                                        onClick={() =>
                                          handleDeleteClick(subata.id)
                                        }
                                      >
                                        <i className="bi bi-trash me-1"></i>{" "}
                                        Delete
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
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default SubAtaForm;
