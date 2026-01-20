import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import MasterLayout from "../masterLayout/MasterLayout";
import VendorForm from "./VendorForm";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

function VendorFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    api.get(`/vendor/${id}`).then((res) => {
      const v = res.data.vendor;

      setInitialData({
        name: v.name,
        code: v.code,
        address: v.address,
        city_id: v.city_id,
        zip_code: v.zip_code,
        state: v.state,
        repair_station_cert: v.repair_station_cert,
        id: v.id,
        country: v.country,
        contact_person: v.contact_person,
        email: v.email,
        phone1: v.phone1,
        phone2: v.phone2,
        phone3: v.phone3,
        fax: v.fax,
        vendor_type: v.vendor_type || "None",
        category_supplier: v.category_supplier,
        category_customer: v.category_customer,
        is_service_provider: v.is_service_provider,
      });
    }).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      id
        ? await api.put(`/vendor/${id}`, data)
        : await api.post("/vendor", data);

      navigate("/vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MasterLayout>
      <VendorForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/vendor")}
        loading={loading}
      />
    </MasterLayout>
  );
}

export default VendorFormPage;
