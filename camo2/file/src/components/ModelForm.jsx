import React, { useState, useEffect } from "react";
import axios from "axios";
import ManufacturerForm from "./ManufecturerForm";
import PrimaryModelForm from "./PrimaryModelForm";

function ModelForm(props) {
  const [newModel, setNewModel] = useState("");
  const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
  const [primaryModels, setPrimaryModels] = useState([
    "Airframe",
    "Engine",
    "Landing Gear",
  ])
  const [manufacturers, setManufacturers] = useState([
    "Westland Agusta",
    "AIRBUS",
    "BELL HELICOPTER TEXTRON",
    "EUROCOPTER",
    "ATR",
  ]);

  const AddManufacturerModal = ({handleUpdatemanu}) => (
    <div
      className={`modal fade ${showModal ? 'show d-block' : ''}`}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-scrollable modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Manufacturer </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal(false)}
            ></button>
          </div>

          <div className="modal-body">
            <ManufacturerForm onUpdate={handleUpdatemanu}/>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Cancel
            </button>

          </div>
        </div>
      </div>
    </div>
  );

  const AddManuPmodelModal = ({onUpdatepmodel}) => (
    <div
      className={`modal fade ${showModal2 ? 'show d-block' : ''}`}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-scrollable modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Model</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal2(false)}
            ></button>
          </div>

          <div className="modal-body">
          <PrimaryModelForm  onUpdatepmodel = {onUpdatepmodel} />
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setShowModal2(false)}>
              Cancel
            </button>

          </div>
        </div>
      </div>
    </div>
  );



  const [formData, setFormData] = useState({
    manufacturer_id: "",
    model_name: "",
    assembly: "",
    primary_model_id: "",
  });

  const [modelList, setModelList] = useState([]);
    const [primarymodelList, setprimarymodelList] = useState([]);
    const [manuList, setmanuListList] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Fetch all models on mount
  useEffect(() => {
    const getAllModels = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/aircraftmodels");
        console.log(res.data)
        setModelList(res.data); // ✅ directly set list
      } catch (err) {
        console.error("❌ Error fetching models:", err);
        setError("Failed to fetch models from server.");
      }
    };
    getAllModels();
  }, []);

    useEffect(() => {
    const getAllManufecturesdata = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/manufacturers");
        setmanuListList(res.data); // ✅ directly set list
      } catch (err) {
        console.error("❌ Error fetching models:", err);
        setError("Failed to fetch models from server.");
      }
    };
    getAllManufecturesdata();
  }, []);


      useEffect(() => {
    const getpmodel = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/primarymodel");
        setprimarymodelList(res.data); // ✅ directly set list
      } catch (err) {
        console.error("❌ Error fetching models:", err);
        setError("Failed to fetch models from server.");
      }
    };
    getpmodel();
  }, []);

  // ✅ Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  
  // ✅ Handle form submit
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  // Required field validation
  if (
    !formData.manufacturer_id ||
    !formData.model_name ||
    !formData.primary_model_id
  ) {
    setError("Please fill in all required fields.");
    setIsLoading(false);
    return;
  }

  try {

    console.log("f",formData)
    // Send formData correctly
    const res = await axios.post(
      "http://localhost:5000/api/aircraftmodels",
      formData
    );

    setModelList(prevList => [...prevList, res.data.model]);
    if (props.handleUpdatemodel) {
      props.handleUpdatemodel(res.data.model);
    }

    alert("Model submitted successfully!");

  } catch (err) {
    console.error("❌ Error adding model:", err);
    setError(
      err.response?.data?.message || 
      err.message || 
      "Failed to add model. Please try again."
    );
  } finally {
    setIsLoading(false);
  }
};

  const handleUpdatemanu = (newmanufec) => {
    // Update local model list
    setmanuListList(prev => [...prev, newmanufec]);
  };

  const onUpdatepmodel = (newpmodel) => {
    setprimarymodelList(prev => [...prev, newpmodel]);
  }

  // ✅ Delete handler

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this item?")) return;
  try {
    await axios.delete(`http://localhost:5000/api/aircraftmodels/${id}`);
    // Optimistic update: remove immediately for better UX
    setModelList(prevList => prevList.filter(item => item.id !== id));
  } catch (error) {
    console.error(error);
    alert("Failed to delete item");
    // Optional: refetch data or revert optimistic update on error
  }
};

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <AddManuPmodelModal  onUpdatepmodel = {onUpdatepmodel}/>
      <AddManufacturerModal  handleUpdatemanu={handleUpdatemanu}/>

      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="h4 fw-bold text-dark mb-1">Model Information</h2>
              <p className="text-muted">Manage aircraft models and configurations</p>
            </div>
            <div className="badge bg-primary bg-opacity-10 text-primary fs-6 px-3 py-2">
              {modelList.length} Model(s)
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <pre
          style={{
            color: "red",
            backgroundColor: "#f8d7da",
            padding: "10px",
            borderRadius: "8px",
            fontSize: "14px",
            border: "1px solid #f5c2c7",
            marginTop: "10px",
          }}
        >
          {error}
        </pre>
      )}

      {/* Form */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-transparent py-3">
          <h5 className="card-title mb-0 fw-semibold">Add New Model</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Manufacturer */}
              <div className="col-xl-3 col-lg-4 col-md-6">
                <label className="form-label fw-semibold">
                  Manufacturer <span style={{ color: "red" }}>*</span>
                </label>
                <div className="d-flex align-items-center gap-2">
                  <select
                    className="form-select form-select-lg border-0 bg-light"
                    name="manufacturer_id"
                    value={formData.manufacturer_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Manufacturer</option>
                  {manuList.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                  </select>
                  {/* Add Manufacturer Button */}
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setShowModal(true)}
                  >+</button>
                  
                </div>
              </div>

              {/* Model Name */}
              <div className="col-xl-3 col-lg-4 col-md-6">
                <label className="form-label fw-semibold">
                  Model Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="model_name"
                  value={formData.model_name}
                  onChange={handleChange}
                  className="form-control form-control-lg border-0 bg-light"
                  placeholder="Enter Model Name"
                />
              </div>

              {/* Assembly */}
              <div className="col-xl-3 col-lg-4 col-md-6">
                <label className="form-label fw-semibold">For Assembly</label>
                <select
                  className="form-select form-select-lg border-0 bg-light"
                  name="assembly"
                  value={formData.assembly}
                  onChange={handleChange}
                >
                  <option value="Airframe">Airframe</option>
                  <option value="Engine">Engine</option>
                  <option value="Landing Gear">Landing Gear</option>
                </select>
              </div>

              {/* Primary Model */}
              <div className="col-xl-3 col-lg-4 col-md-6">
                <label className="form-label fw-semibold">
                  Primary Model <span style={{ color: "red" }}>*</span>
                </label>
                <div className="d-flex align-items-center gap-2">
                  <select
                    className="form-select form-select-lg border-0 bg-light"
                    name="primary_model_id"
                    value={formData.primary_model_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Primary Model</option>
                    {primarymodelList.map((item, index) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {/* Add Primary Model Button */}
                  <button
                    type="button"
                   className="btn btn-outline-primary ms-2 d-flex align-items-center"
                    onClick={() => setShowModal2(true)}
                  >+</button>
                </div>
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
                      Add Model
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
      {/* Model List */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-transparent py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0 fw-semibold">Model List</h5>
            <div className="text-muted">Showing {modelList.length} record(s)</div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 fw-semibold text-uppercase text-xs text-secondary">Primary Model</th>
                  <th className="fw-semibold text-uppercase text-xs text-secondary">Manufacturer</th>
                  <th className="fw-semibold text-uppercase text-xs text-secondary">Model</th>
                  <th className="fw-semibold text-uppercase text-xs text-secondary">Assembly</th>
                  <th className="pe-4 fw-semibold text-uppercase text-xs text-secondary text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {modelList.map((item, index) => (
                  <tr key={index} className="border-bottom">
                    <td className="ps-4">
                      <span className="badge bg-primary bg-opacity-10 text-primary fs-7">
                        {item.primary_model_id || "-"}
                      </span>
                    </td>
                    <td>{item.manufacturer_id}</td>
                    <td>{item.model_name}</td>
                    <td>
                      <span
                        className={`badge fs-7 ${item.assembly === "Airframe"
                          ? "bg-success bg-opacity-10 text-success"
                          : item.assembly === "Engine"
                            ? "bg-warning bg-opacity-10 text-warning"
                            : "bg-info bg-opacity-10 text-info"
                          }`}
                      >
                        {item.assembly}
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <i className="bi bi-trash me-1"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {modelList.length === 0 && (
            <div className="text-center py-5">
              <div className="icon-shape icon-xxl bg-light text-muted rounded-circle mb-3">
                <i className="bi bi-inbox"></i>
              </div>
              <h5 className="text-muted">No models found</h5>
              <p className="text-muted">Add your first model using the form above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModelForm;
