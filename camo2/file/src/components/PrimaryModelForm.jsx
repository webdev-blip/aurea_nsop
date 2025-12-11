import React, { useState, useEffect } from "react";
import axios from "axios";

function PrimaryModelForm() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [primarymodelList, setPrimarymodelList] = useState([]);
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    const getAllPrimaryModels = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/primarymodel");
        setPrimarymodelList(res.data);
      } catch (err) {
        console.error("Error fetching models:", err);
        setError("Failed to fetch models from the server.");
      }
    };
    getAllPrimaryModels();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Primary model name is required.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/primarymodel", formData);

      const newModel = response.data.data || response.data;
      console.log("hth",newModel)
      setPrimarymodelList([...primarymodelList, newModel]);
      setFormData({ name: "" });
      alert("Primary model added successfully!");
    } catch (error) {
      console.error("Error adding primary model:", error);
      setError(error.response?.data?.message || "Failed to add Primary Model. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (index) => {
    const updatedList = primarymodelList.filter((_, i) => i !== index);
    setPrimarymodelList(updatedList);
  };

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="h4 fw-bold text-dark mb-1">Primary Model Information</h2>
              <p className="text-muted">Manage Primary Models</p>
            </div>
            <div className="badge bg-primary bg-opacity-10 text-primary fs-6 px-3 py-2">
              {primarymodelList.length} Record(s)
            </div>
          </div>
        </div>
      </div>

      {error && (
        <pre
          style={{
            color: "red",
            backgroundColor: "#f8d7da",
            padding: "10px",
            borderRadius: "8px",
            fontSize: "14px",
            whiteSpace: "pre-wrap",
            border: "1px solid #f5c2c7",
            marginTop: "10px",
          }}
        >
          {error}
        </pre>
      )}

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-transparent py-3">
          <h5 className="card-title mb-0 fw-semibold">Add New Primary Model</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-xl-4 col-lg-6 col-md-8">
                <label className="form-label fw-semibold">
                  Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg border-0 bg-light"
                  name="name"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row mt-4">
              <div className="col">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg px-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-circle me-2"></i>
                      Submit
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-transparent py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0 fw-semibold">Primary Model List</h5>
            <div className="text-muted">Showing {primarymodelList.length} record(s)</div>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="fw-semibold text-uppercase text-xs text-secondary">Primary Model</th>
                  <th className="pe-4 fw-semibold text-uppercase text-xs text-secondary text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {primarymodelList.map((item, index) => (
                  <tr key={index} className="border-bottom">
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="icon-shape icon-xs bg-primary bg-opacity-10 text-primary rounded-circle me-2">
                          <i className="bi bi-building"></i>
                        </div>
                        {item.name}
                      </div>
                    </td>
                    <td className="pe-4 text-end">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(index)}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Delete
                      </button>
                    </td>
                  </tr> 
                ))}
              </tbody>
            </table>
          </div>

          {primarymodelList.length === 0 && (
            <div className="text-center py-5">
              <div className="icon-shape icon-xxl bg-light text-muted rounded-circle mb-3">
                <i className="bi bi-inbox"></i>
              </div>
              <h5 className="text-muted">No records found</h5>
              <p className="text-muted">Add your first Primary Model using the form above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PrimaryModelForm;
