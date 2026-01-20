import React, { useState } from "react";
import CityForm from "../pages/CityForm";

function City() {
  const [cityState, setCityState] = useState({
    lastAction: "",
    city: null,
    search: "",
    page: 1,
    pageSize: 10,
    totalPages: 1,
    totalRecords: 0,
  });

  const handleCityEvent = (payload) => {
    setCityState((prev) => ({ ...prev, ...payload }));
    console.log("CITY EVENT:", payload);
  };

  return <CityForm onCityEvent={handleCityEvent} />;
}
  
export default City;
