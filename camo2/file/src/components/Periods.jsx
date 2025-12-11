import React, { useState } from "react";
import axios from "axios";
export default function PeriodsForm({ onClose, onUpdate }) {
  const periodsList = [
    "Cycles",
    "Ng Cycles",
    "Nf Cycles",
    "RINS",
    "Starts",
    "Accumulated Cycles",
    "Contingency Rating",
    "Creep %",
    "Impeller Cycles",
    "CT Cycles",
    "PT Cycles",
    "Generator Mods",
    "Rapid Take Off",
  ];

  const [selected, setSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  
  const handleSelect = (period) => {
    setSelected((prev) =>
      prev.includes(period)
        ? prev.filter((item) => item !== period)
        : [...prev, period]
    );
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (selected.length === 0) {
    setError("Please select at least one period.");
    return;
  }

  // Validate empty values
  for (let p of selected) {
    if (!p.trim()) {
      setError("Period name cannot be empty.");
      return;
    }
  } 

  try {
    // Correct variable name: res
    const res = await axios.post("http://localhost:5000/api/periods", {
      selectedPeriods: selected,
    });

    // Normalizing the data
    const normalize = (item) => ({
      id: item.id ?? Date.now() + Math.random(),
      label: item.name ?? item.label,
      value: item.value ?? "",
    });

    
    const items = res.data.data.map(normalize);
    alert("Periods submitted successfully!");
    setSelected([]);
    onClose();

    setTimeout(() => {
      onUpdate(items);  // Pass the full array
    }, 500);

  } catch (error) {
    if (error.response && error.response.status === 400) {
      setError(error.response.data.message);
    } else {
      alert("Something went wrong");
    }
  }
};


  return (
    <div className="container-fluid">
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
      <form onSubmit={handleSubmit}>
        <h5 className="fw-semibold mb-3">Select Periods</h5>
        {/* Checkbox List */}
        <div className="row mb-3">
          {periodsList.map((item) => (
            <div className="col-md-4 mb-2" key={item}>
              <label className="d-flex align-items-center gap-2">
                <input
                  name="name"
                  value={item}          // <-- REQUIRED
                  type="checkbox"
                  className="form-check-input"
                  checked={selected.includes(item)}
                  onChange={() => handleSelect(item)}
                />
                {item}
              </label>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="btn btn-primary mb-4"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>


      </form>
    </div>
  );
}
