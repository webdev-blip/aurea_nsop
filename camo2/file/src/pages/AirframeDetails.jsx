import React from 'react';

/* Reusable helper component to create the bordered section.
  You can put this in its own file (e.g., FormSection.jsx) 
  and import it, or just keep it here.
*/
const FormSection = ({ title, children }) => (
  <div className="form-section">
    <h3 className="section-title">{title}</h3>
    <div className="section-content">
      {children}
    </div>
  </div>
);


// Main Component
function AirframeDetails({ data, onChange }) {
  // Note: The `data` prop should contain state like:
  // { manufacturer: '', model: '', serialNo: '', maintenanceProgram: '' }

  // The `onChange` prop is the 'handleChange' function from the parent.

  return (
    <FormSection title="Airframe Details">

      {/* Manufacturer Field */}
      <div className="form-field">
        <label>Manufacturer</label>
        <input
          type="text"
          name="manufacturer"
          value={data.manufacturer}
          onChange={onChange}
        />
      </div>

      {/* Model Field (with + button) */}
      <div className="form-field">
        <label>* Model</label>
        {/* We use a wrapper to group the select and button */}
        <div className="input-with-button">
          <select
            name="model"
            value={data.model}
            onChange={onChange}
          >
            <option value="">(SELECT)</option>
            <option value="B737">Boeing 737</option>
            <option value="A320">Airbus A320</option>
            {/* Add other models here */}
          </select>
          <button type="button" className="add-button-inline">+</button>
        </div>
      </div>

      {/* Serial No. Field */}
      <div className="form-field">
        <label>* Serial No.</label>
        <input
          type="text"
          name="serialNo"
          value={data.serialNo}
          onChange={onChange}
        />
      </div>

      {/* Maintenance Program Field */}
      <div className="form-field">
        <label>Maintenance Service Program/Provider</label>
        <textarea
          name="maintenanceProgram"
          rows="3" // Adjust row count as needed
          value={data.maintenanceProgram}
          onChange={onChange}
        />
      </div>

    </FormSection>
  );
}

export default AirframeDetails;