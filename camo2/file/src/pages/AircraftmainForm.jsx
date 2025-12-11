import React, { useState, useEffect } from "react";
import axios from "axios";
import AircraftModel from "../components/AircraftModel";
import ModelForm from "../components/ModelForm";
import PeriodsForm from "../components/Periods";

const AircraftmainForm = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [newModel, setNewModel] = useState("");
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModaltsn, setShowModaltsn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [periodsList, setPeriodsList] = useState([]);
  const [formData, setFormData] = useState({
    registration_no: "",
    category: "",
    owner: "",
    hour_type: "",
    operator: "",
    manufacturer: "",
    model: "",
    serial_no: "",
    maintenance_provider: "",
    is_under_warranty: false,
    warranty_start_date: "",
    warranty_end_date: "",
    tech_log_option: "",
    empty_weight: "",
    empty_weight_unit: "",
    all_up_weight: "",
    all_up_weight_unit: "",
    gross_payload: "",
    gross_payload_unit: "",
    taxi_weight: "",
    taxi_weight_unit: "",
    takeoff_weight: "",
    takeoff_weight_unit: "",
    zero_fuel_weight: "",
    zero_fuel_weight_unit: "",
    landing_weight: "",
    landing_weight_unit: "",
    fuel_capacity: "",
    fuel_capacity_unit: "",
    tsn_as_on_date: "",
    tsn_data: [],
    manufacturing_date: "",
    landings: "",
    not_in_use: false,
    not_in_use_date: "",
    readonly: false,
    readonly_date: "",
    is_flight_log_utc: false,
  });


  useEffect(() => {
    const getAllModels = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/aircraftmodels");
        setModels(res.data); // ✅ directly set list
      } catch (err) {
        console.error("❌ Error fetching models:", err);
        setError("Failed to fetch models from server.");
      }
    };
    getAllModels();
  }, []);

  const handleUpdate = (payload) => {
    if (!payload) return;
    const itemsToAdd = Array.isArray(payload) ? payload : [payload];
    setFormData((prev) => ({
      ...prev,
      tsn_data: [...prev.tsn_data, ...itemsToAdd]
    }));
  };
 // Assuming you have these state variables in the parent component:
// const [modelList, setModelList] = useState([]);
  const handleUpdatemodel = (newModel) => {
    console.log("New Model Data received:", newModel);
    // Update local model list
    setModels(prev => [...prev, newModel]);
    console.log("Model list updated successfully.");
  };

  const closeModal = () => setShowModaltsn(false);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  useEffect(() => {
    const getAllperiods = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/periods");
        setFormData((prev) => ({
          ...prev,
          tsn_data: res.data.map((p) => ({ label: p.name, value: "", id: p.id }))
        }));
      } catch (err) {
        console.error("❌ Error fetching models:", err);
        setError("Failed to fetch models from server.");
      }
    };
    getAllperiods();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/periods/${id}`);
      setFormData((prev) => ({
        ...prev,
        tsn_data: prev.tsn_data.filter((row) => row.id !== id),
      }));
    } catch (error) {
      console.error(error);
      alert("Failed to delete period");
    }
  };



  const AddTSN = () => (
    <div
      className={`modal fade ${showModaltsn ? 'show d-block' : ''}`}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-scrollable modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Periods</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModaltsn(false)}
            ></button>
          </div>
          <div className="modal-body">
            {showModaltsn && (
              <PeriodsForm onClose={closeModal} onUpdate={handleUpdate} />
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setShowModaltsn(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/aircraft",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server response:", response.data);
      showNotification("Aircraft details submitted successfully!", "success");
    } catch (error) {
      console.error("Error submitting aircraft details:", error);

      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || "Submission failed.";

      setError(errorMessage);
      showNotification(`Error: ${errorMessage}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type) => {
    alert(`${type === 'success' ? '✅' : '❌'} ${message}`);
  };

  const resetForm = () => {
    if (window.confirm("Are you sure you want to reset all form data?")) {
      setFormData({
        registration_no: "",
        category: "",
        owner: "",
        hour_type: "",
        operator: "",
        manufacturer: "",
        model: "",
        serial_no: "",
        maintenance_provider: "",
        is_under_warranty: false,
        warranty_start_date: "",
        warranty_end_date: "",
        techLogOption: "singleSector",
        empty_weight: "",
        empty_weight_unit: "",
        all_up_weight: "",
        all_up_weight_unit: "",
        gross_payload: "",
        gross_payload_unit: "",
        taxi_weight: "",
        taxi_weight_unit: "",
        takeoff_weight: "",
        takeoff_weight_unit: "",
        zero_fuel_weight: "",
        zero_fuel_weight_unit: "",
        landing_weight: "",
        landing_weight_unit: "",
        fuel_capacity: "",
        fuel_capacity_unit: "",
        tsn_data: [],
        manufacturing_date: "",
        landings: "",
        not_in_use: false,
        not_in_use_date: "",
        readonly: false,
        readonly_date: "",
        is_flight_log_utc: false,
      });
    }
  };

  const AddModelModal = () => (
    <div
      className={`modal fade ${showModal ? 'show d-block' : ''}`}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-scrollable modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Model</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <ModelForm handleUpdatemodel={handleUpdatemodel} />
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

  return (
    <div className="container-fluid py-4">
      <AddModelModal />
      <AddTSN />

      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg border-0 custom-card">
            {/* Enhanced Header */}
            <div className="card-header bg-gradient-primary text-white py-4 position-relative">
              <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10">
                <div className="aircraft-pattern"></div>
              </div>
              <div className="d-flex justify-content-between align-items-center position-relative">
                <div>
                  <h2 className="mb-1 fw-bold">
                    <i className="bi bi-airplane-fill me-3"></i>
                    Aircraft Registration
                  </h2>
                  <p className="mb-0 opacity-90">Complete aircraft details and specifications</p>
                </div>
                <div className="text-end">
                  <div className="badge bg-white bg-opacity-25 text-white fs-6 px-3 py-2 mb-2">
                    <i className="bi bi-tag-fill me-2"></i>
                    {formData.registration_no || "New Aircraft"}
                  </div>
                  <div className="text-white-50 small">
                    <i className="bi bi-clock me-1"></i>
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="card-body p-4">

                {/* Progress Indicator */}
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="progress" style={{ height: "6px" }}>
                      <div
                        className="progress-bar bg-success"
                        style={{ width: "45%" }}
                        title="Form Completion: 45%"
                      ></div>
                    </div>
                    <div className="text-end text-muted small mt-1">
                      <i className="bi bi-info-circle me-1"></i>
                      Complete all required fields marked with *
                    </div>
                  </div>
                </div>

                {/* Registration & Weight Sections */}
                <div className="row g-4">
                  {/* Registration Details */}
                  {error && (
                    <p className="error-message text-danger" ><b>{error} *</b></p>
                  )}
                  <div className="col-xl-6">
                    <div className="card h-100 border-0 shadow-sm custom-section-card">
                      <div className="card-header bg-gradient-light py-3 d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 text-primary fw-semibold">
                          <i className="bi bi-clipboard-data me-2"></i>
                          Aircraft Registration Details
                        </h6>
                        <span className="badge bg-primary">Required</span>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-12">
                            <label className="form-label fw-semibold">
                              Registration Number <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <i className="bi bi-airplane text-primary"></i>
                              </span>
                              <input
                                type="text"
                                name="registration_no"
                                className="form-control form-control-lg"
                                placeholder="e.g., VT-ABC"
                                value={formData.registration_no}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              Category <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <i className="bi bi-tags text-primary"></i>
                              </span>
                              <select
                                className="form-select"
                                name="category"
                                style={{ width: "185px" }}
                                value={formData.category || "0"}
                                onChange={handleChange}
                              >
                                <option value="0">(SELECT)</option>
                                <option value="Piston Engine-Fixed Wing Aircraft">Piston Engine-Fixed Wing Aircraft</option>
                                <option value="Piston Engine-Rotary Wing Aircraft">Piston Engine-Rotary Wing Aircraft</option>
                                <option value="Turbo Fan-Fixed Wing Aircraft">Turbo Fan-Fixed Wing Aircraft</option>
                                <option value="Turbo Jet-Fixed Wing Aircraft">Turbo Jet-Fixed Wing Aircraft</option>
                                <option value="Turbo Propeller-Fixed Wing Aircraft">Turbo Propeller-Fixed Wing Aircraft</option>
                                <option value="Turbo Shaft-Rotary Wing Aircraft">Turbo Shaft-Rotary Wing Aircraft</option>
                              </select>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              Hour Type <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <i className="bi bi-clock text-primary"></i>
                              </span>
                              <select
                                className="form-select"
                                name="hour_type"
                                value={formData.hour_type}
                                onChange={handleChange}
                              >
                                <option value="">Select Type</option>
                                <option value="Hours">Hours</option>
                                <option value="Hobbs">Hobbs</option>
                              </select>
                            </div>
                          </div>

                          <div className="col-12">
                            <label className="form-label fw-semibold">Owner</label>
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <i className="bi bi-person text-primary"></i>
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                name="owner"
                                placeholder="Enter Owner Name"
                                value={formData.owner}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="col-12">
                            <label className="form-label fw-semibold">Operator</label>
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <i className="bi bi-building text-primary"></i>
                              </span>
                              <select
                                className="form-select"
                                name="operator"
                                value={formData.operator}
                                onChange={handleChange}
                              >
                                <option value="">Select Operator</option>
                                <option value="Air India">Air India</option>
                                <option value="Indigo">Indigo</option>
                                <option value="SpiceJet">SpiceJet</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weight & Capacity */}
                  <div className="col-xl-6">
                    <div className="card h-100 border-0 shadow-sm custom-section-card">
                      <div className="card-header bg-gradient-light py-3">
                        <h6 className="mb-0 text-primary fw-semibold">
                          <i className="bi bi-speedometer2 me-2"></i>
                          Weight and Capacity
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          {[
                            { label: "Empty Weight", name: "empty_weight", unit: "empty_weight_unit", icon: "⚖️" },
                            { label: "All Up Weight", name: "all_up_weight", unit: "all_up_weight_unit", icon: "📊" },
                            { label: "Gross Payload", name: "gross_payload", unit: "gross_payload_unit", icon: "📦" },
                            { label: "Taxi Weight", name: "taxi_weight", unit: "taxi_weight_unit", icon: "🚗" },
                            { label: "Take Off Weight", name: "takeoff_weight", unit: "takeoff_weight_unit", icon: "🛫" },
                            { label: "Zero Fuel Weight", name: "zero_fuel_weight", unit: "zero_fuel_weight_unit", icon: "⛽" },
                            { label: "Landing Weight", name: "landing_weight", unit: "landing_weight_unit", icon: "🛬" },
                            { label: "Fuel Capacity", name: "fuel_capacity", unit: "fuel_capacity_unit", icon: "⛽", required: "*" },
                          ].map((field, index) => (
                            <div className="col-md-6" key={field.name}>
                              <label className="form-label fw-semibold">
                                <span className="me-1">{field.icon}</span>
                                {field.label} <span className="text-danger"> {field.required}</span>
                              </label>
                              <div className="input-group">
                                <input
                                  type="number"
                                  name={field.name}
                                  className="form-control"
                                  placeholder="0.00"
                                  value={formData[field.name]}
                                  onChange={handleChange}
                                />
                                <select
                                  name={field.unit}
                                  className="form-select"
                                  style={{ minWidth: '100px' }}
                                  value={formData[field.unit]}
                                  onChange={handleChange}
                                >
                                  <option value="">Unit</option>
                                  <option value="KG">KG</option>
                                  <option value="Gallons">Gallons</option>
                                  <option value="Litres">Litres</option>
                                  <option value="Pounds">Pounds</option>
                                  <option value="Quarters">Quarters</option>
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Airframe & TSN Sections */}
                <div className="row g-4 mt-2">
                  {/* Airframe Details */}
                  <div className="col-xl-6">
                    <div className="card border-0 shadow-sm custom-section-card">
                      <div className="card-header bg-gradient-light py-3">
                        <h6 className="mb-0 text-primary fw-semibold">
                          <i className="bi bi-gear me-2"></i>
                          Airframe Details
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-12">
                            <label className="form-label fw-semibold">Manufacturer</label>
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <i className="bi bi-building text-primary"></i>
                              </span>
                              <input
                                type="text"
                                name="manufacturer"
                                className="form-control"
                                placeholder="Enter Manufacturer"
                                value={formData.manufacturer}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="col-12">
                            <label className="form-label fw-semibold">
                              <span className="text-danger">*</span> Model
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <i className="bi bi-diagram-3 text-primary"></i>
                              </span>
                              <select
                                className="form-select"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                              >
                                <option value="">Select Model</option>

                                {models.map((m) => (
                                  <option key={m.id} value={m.id}>
                                    {m.model_name}
                                  </option>
                                ))}
                              </select>

                              <button
                                type="button"
                                className="btn btn-outline-primary d-flex align-items-center"
                                onClick={() => setShowModal(true)}
                              >
                                <i className="bi bi-plus-lg me-1"></i> Add
                              </button>
                            </div>
                          </div>

                          <div className="col-12">
                            <label className="form-label fw-semibold">Serial No.</label>
                            <div className="input-group">
                              <span className="input-group-text bg-light">
                                <i className="bi bi-123 text-primary"></i>
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                name="serial_no"
                                placeholder="Enter Serial No."
                                value={formData.serial_no}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="col-12">
                            <label className="form-label fw-semibold">Maintenance Service Program/Provider</label>
                            <div className="input-group">
                              <span className="input-group-text bg-light align-items-start pt-2">
                                <i className="bi bi-tools text-primary"></i>
                              </span>
                              <textarea
                                className="form-control"
                                name="maintenance_provider"
                                placeholder="Enter Maintenance Provider"
                                rows="3"
                                value={formData.maintenance_provider}
                                onChange={handleChange}
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TSN Section */}
                  <div className="col-xl-6">
                    <div className="card border-0 shadow-sm custom-section-card">
                      <div className="card-header bg-gradient-light py-3 d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 text-primary fw-semibold">
                          <i className="bi bi-clock me-2"></i>
                          Times Since New (TSN)
                        </h6>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm d-flex align-items-center"
                          onClick={() => setShowModaltsn(true)}
                        >
                          <i className="bi bi-plus-circle me-1"></i> Add Period
                        </button>
                      </div>

                      <div className="card-body">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            <i className="bi bi-calendar me-2"></i>
                            As On Date
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            name="tsn_as_on_date"
                          />
                        </div>

                        <div className="table-responsive">
                          <table className="table table-hover align-middle custom-table">
                            <thead className="table-light">
                              <tr>
                                <th className="fw-semibold">Period</th>
                                <th className="fw-semibold">Value</th>
                                <th className="fw-semibold text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="fw-semibold text-muted">Manufacturing Date</td>
                                <td>
                                  <input
                                    type="date"
                                    name="manufacturing_date"
                                    className="form-control"
                                    value={formData.manufacturing_date}
                                    onChange={handleChange}
                                  />
                                </td>
                                <td></td>
                              </tr>

                              {formData.tsn_data.map((item, index) => (
                                <tr key={index} className="tsn-row">
                                  <td>
                                    <div className="input-group">
                                      <span className="input-group-text bg-light">
                                        <i className="bi bi-calendar-week text-primary"></i>
                                      </span>
                                      <input
                                        type="text"
                                        className="form-control"
                                        value={item.label}
                                        readOnly
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={item.value}
                                      onChange={(e) => {
                                        const newTsn = [...formData.tsn_data];
                                        newTsn[index].value = e.target.value;
                                        setFormData({ ...formData, tsn_data: newTsn });
                                      }}
                                      placeholder="Enter value"
                                    />
                                  </td>
                                  <td className="text-center">
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => handleDelete(item.id)}
                                      title="Remove period"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </td>
                                </tr>
                              ))}

                              {formData.tsn_data.length === 0 && (
                                <tr>
                                  <td colSpan="3" className="text-center text-muted py-4">
                                    <i className="bi bi-inbox display-4 d-block mb-2"></i>
                                    No periods added yet. Click "Add Period" to get started.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warranty & Other Details */}
                <div className="row g-4 mt-2">
                  {/* Warranty Details */}
                  <div className="col-xl-6">
                    <div className="card border-0 shadow-sm custom-section-card">
                      <div className="card-header bg-gradient-light py-3">
                        <h6 className="mb-0 text-primary fw-semibold">
                          <i className="bi bi-shield-check me-2"></i>
                          Warranty Details
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-12">
                            <div className="form-check form-switch custom-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="is_under_warranty"
                                checked={formData.is_under_warranty}
                                onChange={handleChange}
                              />
                              <label className="form-check-label fw-semibold">
                                Aircraft Under Warranty?
                              </label>
                            </div>
                          </div>

                          {formData.is_under_warranty && (
                            <>
                              <div className="col-md-6">
                                <label className="form-label fw-semibold">Warranty Start Date</label>
                                <div className="input-group">
                                  <span className="input-group-text bg-light">
                                    <i className="bi bi-calendar-plus text-primary"></i>
                                  </span>
                                  <input
                                    type="date"
                                    name="warranty_start_date"
                                    className="form-control"
                                    value={formData.warranty_start_date}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <label className="form-label fw-semibold">Warranty End Date</label>
                                <div className="input-group">
                                  <span className="input-group-text bg-light">
                                    <i className="bi bi-calendar-check text-primary"></i>
                                  </span>
                                  <input
                                    type="date"
                                    name="warranty_end_date"
                                    className="form-control"
                                    value={formData.warranty_end_date}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Other Details */}
                  <div className="col-xl-6">
                    <div className="card border-0 shadow-sm custom-section-card">
                      <div className="card-header bg-gradient-light py-3">
                        <h6 className="mb-0 text-primary fw-semibold">
                          <i className="bi bi-list-check me-2"></i>
                          Other Details
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-12">
                            <div className="form-check form-switch custom-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="not_in_use"
                                checked={formData.not_in_use}
                                onChange={handleChange}
                              />
                              <label className="form-check-label fw-semibold">
                                Aircraft not in use
                              </label>
                            </div>
                            {formData.not_in_use && (
                              <div className="mt-2">
                                <label className="form-label fw-semibold">Not In Use Date</label>
                                <div className="input-group">
                                  <span className="input-group-text bg-light">
                                    <i className="bi bi-calendar-x text-primary"></i>
                                  </span>
                                  <input
                                    type="date"
                                    className="form-control"
                                    name="not_in_use_date"
                                    value={formData.not_in_use_date}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="col-12">
                            <div className="form-check form-switch custom-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="readonly"
                                checked={formData.readonly}
                                onChange={handleChange}
                              />
                              <label className="form-check-label fw-semibold">
                                Mark as ReadOnly
                              </label>
                            </div>
                            {formData.readonly && (
                              <div className="mt-2">
                                <label className="form-label fw-semibold">ReadOnly Date</label>
                                <div className="input-group">
                                  <span className="input-group-text bg-light">
                                    <i className="bi bi-lock text-primary"></i>
                                  </span>
                                  <input
                                    type="date"
                                    className="form-control"
                                    name="readonly_date"
                                    value={formData.readonly_date}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="col-12">
                            <div className="form-check form-switch custom-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="is_flight_log_utc"
                                checked={formData.is_flight_log_utc}
                                onChange={handleChange}
                              />
                              <label className="form-check-label fw-semibold">
                                Flight Log Under UTC
                              </label>
                            </div>
                          </div>

                          <div className="col-12">
                            <label className="form-label fw-semibold">Tech Log Page</label>
                            <div className="btn-group w-100 custom-btn-group" role="group">
                              {[
                                { value: "singleSector", label: "Single Sector", icon: "📄" },
                                { value: "multipleSector", label: "Multiple Sector", icon: "📑" },
                                { value: "airborneOnly", label: "Airborne Only", icon: "✈️" },
                              ].map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  className={`btn ${formData.tech_log_option === option.value ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center justify-content-center flex-column py-2`}
                                  onClick={() => setFormData({ ...formData, tech_log_option: option.value })}
                                >
                                  <span className="mb-1">{option.icon}</span>
                                  <small>{option.label}</small>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="row mt-5">
                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center p-4 bg-light rounded-3">
                      <div>
                        <h6 className="mb-1 fw-semibold">Ready to submit?</h6>
                        <p className="mb-0 text-muted small">
                          Review all information before submitting
                        </p>
                      </div>
                      <div className="d-flex gap-3">
                        <button
                          type="button"
                          className="btn btn-outline-secondary px-4 d-flex align-items-center"
                          onClick={resetForm}
                        >
                          <i className="bi bi-arrow-clockwise me-2"></i>
                          Reset Form
                        </button>
                        <button
                          type="submit"
                          className="btn btn-success px-4 d-flex align-items-center"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-check-circle me-2"></i>
                              Submit Aircraft
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-card {
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .custom-section-card {
          border-radius: 12px;
          transition: all 0.3s ease;
          border: 1px solid #e9ecef;
        }
        
        .custom-section-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
        }
        
        .form-control, .form-select {
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }
        
        .form-control:focus, .form-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .btn {
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .bg-gradient-light {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        
        .form-check-input:checked {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }
        
        .custom-switch .form-check-input {
          width: 3em;
          height: 1.5em;
        }
        
        .custom-table {
          border-radius: 8px;
          overflow: hidden;
        }
        
        .custom-table th {  
          border-top: none;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        
        .tsn-row:hover {
          background-color: #f8f9fa;
        }
        
        .custom-btn-group .btn {
          flex: 1;
          border-radius: 6px;
          margin: 0 2px;
        }
        
        .aircraft-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
        
        @media (max-width: 768px) {
          .card-header .d-flex {
            flex-direction: column;
            text-align: center;
          }
          
          .card-header .text-end {
            text-align: center !important;
            margin-top: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AircraftmainForm;