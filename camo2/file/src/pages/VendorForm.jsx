import React, { useState, useEffect } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import axios from "axios";
import Modal from "../components/Modal";
import VendorCity from "../components/VendorCity";
import LeftBorderAlerts from "../components/child/LeftBorderAlerts";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

function VendorForm({ initialData, onSubmit, onCancel, loading }) {
  const [cities, setCities] = useState([]);
  const [showCityModal, setShowCityModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category_supplier: false,
    category_customer: false,
    is_service_provider: false,
    code: "",
    id: "",
    repair_station_cert: "",
    vendor_type: "None",
    address: "",
    city_id: "",
    zip_code: "",
    state: "",
    country: "",
    contact_person: "",
    email: "",
    phone1: "",
    phone2: "",
    phone3: "",
    fax: "",
    nature_of_vendor: "",
  });

  const [alert, setAlert] = useState({ type: "", message: "" });
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  };
  /* ================= INIT EDIT DATA ================= */
  useEffect(() => {
    if (initialData) setFormData({ ...formData, ...initialData });
  }, [initialData]);

  /* ================= FETCH CITIES ================= */
  const fetchCities = async () => {
    try {
      const res = await api.get("/vendor/city");
      if (res.data.success) setCities(res.data.cities);
    } catch (err) {
      console.error("Failed to fetch cities", err);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const getCityNameById = (id) => {
    const city = cities.find((c) => String(c.V_city_id) === String(id));
    return city ? city.v_city_name : "N/A";
  };

  /* ================= HANDLERS ================= */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return showAlert("danger", "Vendor name is required");
    }

    if (!formData.v_city_id) {
      return showAlert("danger", "Please select a city");
    }

    if (!formData.code.trim()) {
      return showAlert("danger", "Vendor code is required");
    }

    try {
      await onSubmit(formData);
      showAlert("success", "Vendor saved successfully");
    } catch (err) {
      showAlert("danger", "Vendor save failed");
    }
  };

  return (
    <div className="container-fluid p-3">
      {alert.message && (
        <LeftBorderAlerts
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      )}
      <h4 className="fw-bold text-dark mb-4">Vendor Information[New]</h4>
      <div className="row">
        <div className="col-md-10">
          <div className="card mb-4 border shadow-sm">
            <div className="card-header bg-light py-3">
              <h6 className="mb-0 fw-bold text-dark">Details</h6>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row mb-5">
                    <div className="col-sm-1 col-form-label fw-semibold">
                      <label className="form-label fw-semibold">Name *</label>
                    </div>
                    <div className="col-sm-11">
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-7">
                      <div className="row">
                        <label className="col-md-3 accentform-label fw-semibold d-block mb-5">
                          Category
                        </label>
                        <div className="col-md-9 d-flex gap-4">
                          <div className="form-check">
                            <input
                              className="form-check-input mx-6"
                              type="checkbox"
                              name="category_supplier"
                              checked={formData.category_supplier}
                              onChange={handleInputChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="supplierCheck"
                            >
                              Supplier
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input mx-6"
                              type="checkbox"
                              name="category_customer"
                              checked={formData.category_customer}
                              onChange={handleInputChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="customerCheck"
                            >
                              Customer
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input mx-6"
                              type="checkbox"
                              name="is_service_provider"
                              checked={formData.is_service_provider}
                              onChange={handleInputChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="serviceCheck"
                            >
                              Is Service Provider
                            </label>
                          </div>
                        </div>

                        <label className="col-md-3 form-label fw-semibold mb-5">
                          ID
                        </label>
                        <div className="col-md-9">
                          <input
                            type="text"
                            className="form-control"
                            name="id"
                            value={formData.id}
                            onChange={handleInputChange}
                          />
                        </div>

                        <label className="col-md-3 form-label fw-semibold">
                          Address
                        </label>
                        <div className="col-md-9 mb-5">
                          <textarea
                            className="form-control"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows="2"
                            placeholder="Enter complete address"
                          />
                        </div>

                        <label className="col-md-3 form-label fw-semibold mb-5">
                          City
                        </label>
                        <div className="col-md-8">
                          <select
                            className="form-select"
                            name="v_city_id"
                            value={formData.v_city_id}
                            onChange={handleInputChange}
                          >
                            <option value="">(SELECT)</option>
                            {cities.map((city) => (
                              <option
                                key={city.v_city_id}
                                value={city.v_city_id}
                              >
                                {city.v_city_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-1">
                          <button
                            className="btn"
                            type="button"
                            onClick={() => setShowCityModal(true)}
                          >
                            <FaCirclePlus className="me-2 fs-4" />
                          </button>
                        </div>

                        <label className="col-md-3 form-label fw-semibold mb-5">
                          Zip Code
                        </label>
                        <div className="col-md-9 ">
                          <input
                            type="text"
                            className="form-control"
                            name="zip_code"
                            value={formData.zip_code}
                            onChange={handleInputChange}
                            placeholder="Enter zip code"
                          />
                        </div>

                        <label className="col-md-3 form-label fw-semibold mb-5">
                          State
                        </label>
                        <div className="col-md-9">
                          <input
                            type="text"
                            className="form-control"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="Enter state"
                          />
                        </div>

                        <label className="col-md-3 form-label fw-semibold mb-5">
                          Country
                        </label>
                        <div className="col-md-9">
                          <input
                            type="text"
                            className="form-control"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            placeholder="Enter country"
                          />
                        </div>

                        <label className="col-md-3 form-label fw-semibold mb-5">
                          Contact Person
                        </label>
                        <div className="col-md-9">
                          <input
                            type="text"
                            className="form-control"
                            name="contact_person"
                            value={formData.contact_person}
                            onChange={handleInputChange}
                            placeholder="Enter contact person name"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="row">
                        <label className="col-md-5 form-label fw-semibold mb-5">
                          Code *
                        </label>
                        <div className="col-md-7">
                          <input
                            type="text"
                            className="form-control"
                            name="code"
                            value={formData.code}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <label className="col-md-5 form-label fw-semibold mb-5">
                          Repair Station Cert.
                        </label>
                        <div className="col-md-7">
                          <input
                            type="text"
                            className="form-control"
                            name="repair_station_cert"
                            value={formData.repair_station_cert}
                            onChange={handleInputChange}
                          />
                        </div>

                        <label className="col-md-5 form-label fw-semibold mb-5">
                          Vendor Type
                        </label>
                        <div className="col-md-7">
                          <select
                            className="form-select"
                            name="vendor_type"
                            value={formData.vendor_type}
                            onChange={handleInputChange}
                          >
                            <option value="None">None</option>
                            <option value="Government">Government</option>
                            <option value="Private">Private</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <label className="col-md-5 form-label fw-semibold mb-5">
                          Phone1
                        </label>
                        <div className="col-md-7">
                          <input
                            type="tel"
                            className="form-control"
                            name="phone1"
                            value={formData.phone1}
                            onChange={handleInputChange}
                            placeholder="Enter phone 1"
                          />
                        </div>

                        <label className="col-md-5 form-label fw-semibold mb-5">
                          Phone2
                        </label>
                        <div className="col-md-7">
                          <input
                            type="tel"
                            className="form-control"
                            name="phone2"
                            value={formData.phone2}
                            onChange={handleInputChange}
                            placeholder="Enter phone 2"
                          />
                        </div>

                        <label className="col-md-5 form-label fw-semibold mb-5">
                          Phone3
                        </label>
                        <div className="col-md-7">
                          <input
                            type="tel"
                            className="form-control"
                            name="phone3"
                            value={formData.phone3}
                            onChange={handleInputChange}
                            placeholder="Enter phone 3"
                          />
                        </div>

                        <label className="col-md-5 form-label fw-semibold mb-5">
                          Fax
                        </label>
                        <div className="col-md-7">
                          <input
                            type="tel"
                            className="form-control"
                            name="fax"
                            value={formData.fax}
                            onChange={handleInputChange}
                            placeholder="Enter fax number"
                          />
                        </div>

                        <label className="col-md-5 form-label fw-semibold mb-5">
                          Nature Of Vendor
                        </label>
                        <div className="col-md-7">
                          <input
                            type="text"
                            className="form-control"
                            name="nature_of_vendor"
                            value={formData.nature_of_vendor}
                            onChange={handleInputChange}
                            placeholder="Enter nature of vendor"
                          />
                        </div>

                        <label className="col-md-5 form-label fw-semibold mb-5">
                          Email
                        </label>
                        <div className="col-md-7">
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email address"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="d-flex justify-content-end gap-1 mt-10">
                      <button
                        type="button"
                        className="btn btn-secondary px-6"
                        onClick={onCancel}
                        disabled={loading}
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary px-10"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Saving...
                          </>
                        ) : (
                          "Save"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* CITY MODAL */}
      <Modal
        show={showCityModal}
        title="City Information"
        onClose={() => setShowCityModal(false)}
      >
        <VendorCity
          onCancel={() => setShowCityModal(false)}
          onSubmit={() => setShowCityModal(false)}
        />
      </Modal>
    </div>
  );
}

export default VendorForm;
