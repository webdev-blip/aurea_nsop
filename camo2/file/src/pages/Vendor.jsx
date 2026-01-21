import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LeftBorderAlerts from "../components/child/LeftBorderAlerts";
import ConfirmAlert from "../components/child/ConfirmAlert";

function Vendor() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const api = axios.create({ baseURL: "http://localhost:5000/api" });

  const fetchVendors = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const res = await api.get("/vendor", {
        params: { page, limit: pageSize, search },
      });
      if (res.data.success) {
        setVendors(res.data.vendors);
        setTotalRecords(res.data.totalRecords || res.data.vendors.length);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  useEffect(() => {
    api
      .get("/vendor/city")
      .then((res) => {
        setCities(res.data.cities || []);
      })
      .catch((err) => console.error("Error fetching cities:", err));
  }, []);

  const getCityName = (id) => {
    const city = cities.find((c) => c.v_city_id === id);
    return city ? city.v_city_name : "—";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchVendors(1, searchTerm);
  };

  // DELETE
  const handleDelete = (id) => {
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
      const res = await api.delete(`/vendor/${confirmDeleteId}`);
      if (res.data.success) {
        setVendors((prev) => {
          const updated = prev.filter(
            (vendor) => vendor.id !== confirmDeleteId
          );

          const newTotalPages = Math.ceil(updated.length / pageSize);
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          }

          return updated;
        });

        showAlert("success", "Vendor deleted successfully");
      }
    } catch {
      showAlert("danger", "Delete failed");
    } finally {
      setShowConfirm(false);
      setConfirmDeleteId(null);
    }
  };

  // PAGINATION
  const totalPages = Math.ceil(vendors.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const paginatedVendors = vendors.slice(start, start + pageSize);

  return (
    <div
      className="container-fluid p-3"
      style={{ maxWidth: "1400px", margin: "0 auto" }}
    >
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
          message="Are you sure you want to delete this vendor?"
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowConfirm(false);
            setConfirmDeleteId(null);
          }}
        />
      )}
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h4 className="fw-bold text-dark mb-1">Vendor List</h4>
        </div>
        <div className="col-auto">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/vendor/new")}
          >
            <i className="bi bi-plus-circle me-2"></i> Add New Vendor
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-md-8">
          <form onSubmit={handleSearch}>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search vendors..."
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
                    fetchVendors(1, "");
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="col-md-4 text-end">
          <div className="badge bg-light text-dark fs-6 px-3 py-2 border">
            As per criteria:{totalRecords} Record(s) Found
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="card shadow-sm border">
        {loading ? (
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary"></div>
            <p className="mt-2">Loading vendors...</p>
          </div>
        ) : vendors.length === 0 ? (
          <div className="card-body text-center py-5">
            <div className="icon-shape icon-xxl bg-light text-muted rounded-circle mb-3">
              <i className="bi bi-inbox"></i>
            </div>
            <h5 className="text-muted">No vendors found</h5>
            <p className="text-muted">
              Add your first vendor using the button above.
            </p>
          </div>
        ) : (
          <>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th
                        className="ps-4 fw-semibold text-uppercase text-xs text-secondary"
                        style={{ width: "15%" }}
                      >
                        Vendor
                      </th>
                      <th
                        className="fw-semibold text-uppercase text-xs text-secondary"
                        style={{ width: "8%" }}
                      >
                        Code
                      </th>
                      <th
                        className="fw-semibold text-uppercase text-xs text-secondary"
                        style={{ width: "25%" }}
                      >
                        Address
                      </th>
                      <th
                        className="fw-semibold text-uppercase text-xs text-secondary"
                        style={{ width: "8%" }}
                      >
                        City
                      </th>
                      <th
                        className="fw-semibold text-uppercase text-xs text-secondary"
                        style={{ width: "7%" }}
                      >
                        Zip Code
                      </th>
                      <th
                        className="fw-semibold text-uppercase text-xs text-secondary"
                        style={{ width: "10%" }}
                      >
                        State
                      </th>
                      <th
                        className="fw-semibold text-uppercase text-xs text-secondary"
                        style={{ width: "10%" }}
                      >
                        Country
                      </th>
                      <th
                        className="fw-semibold text-uppercase text-xs text-secondary"
                        style={{ width: "12%" }}
                      >
                        Contact Person
                      </th>
                      <th
                        className="pe-4 fw-semibold text-uppercase text-xs text-secondary text-end"
                        style={{ width: "5%" }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map((vendor) => (
                      <tr key={vendor.id} className="border-bottom">
                        <td className="ps-4 fw-medium">{vendor.name}</td>
                        <td>
                          <span className="badge bg-primary bg-opacity-10 text-primary">
                            {vendor.code}
                          </span>
                        </td>
                        <td style={{ fontSize: "13px", lineHeight: "1.3" }}>
                          {vendor.address || "—"}
                        </td>
                        <td>
                          <span className="badge bg-info bg-opacity-10 text-info">
                            {getCityName(vendor.v_city_id)}
                          </span>
                        </td>
                        <td>{vendor.zip_code || "—"}</td>
                        <td>
                          <span className="badge bg-warning bg-opacity-10 text-warning">
                            {vendor.state || "—"}
                          </span>
                        </td>
                        <td>{vendor.country || "—"}</td>
                        <td>
                          {vendor.contact_person ? (
                            <span className="badge bg-success bg-opacity-10 text-success">
                              {vendor.contact_person}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="pe-4 text-end">
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() =>
                                navigate(`/vendor/edit/${vendor.id}`)
                              }
                              title="Edit"
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(vendor.id)}
                              title="Delete"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
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
          </>
        )}
      </div>
    </div>
  );
}

export default Vendor;
