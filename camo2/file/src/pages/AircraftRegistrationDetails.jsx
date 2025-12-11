import React from 'react';

// We create a simple wrapper for the section "box"
const FormSection = ({ title, children }) => (
  <div className="form-section">
    <h3 className="section-title">{title}</h3>
    <div className="section-content">
      {children}
    </div>
  </div>
);

function AircraftRegistrationDetails({ data, onChange }) {
  return (
    <FormSection title="Aircraft Registration Details">
      <div className="form-field">
        <label>* Reg No.</label>
        <input 
          type="text" 
          name="regNo" 
          value={data.regNo} 
          onChange={onChange} 
        />
      </div>
      <div className="form-field">
        <label>* Category</label>
        <select 
          name="category" 
          value={data.category} 
          onChange={onChange}
        >
          <option value="">(SELECT)</option>
          <option value="transport">Transport</option>
          <option value="private">Private</option>
        </select>
      </div>
      <div className="form-field">
        <label>Owner</label>
        <input 
          type="text" 
          name="owner" 
          value={data.owner} 
          onChange={onChange} 
        />
      </div>
      {/* ...other fields for this section */}
    </FormSection>
  );
}

export default AircraftRegistrationDetails;