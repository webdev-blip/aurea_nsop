import React from 'react';

const FormSection = ({ title, children }) => (
  <div className="form-section">
    <h3 className="section-title">{title}</h3>
    <div className="section-content">
      {children}
    </div>
  </div>
);

function TsnDetails({ periods, onTsnChange }) {
  return (
    <FormSection title="Times Since New Values of Aircraft (TSN)">
      {/* Date input would go here */}
      
      <table className="tsn-table">
        <thead>
          <tr>
            <th>Periods</th>
            <th>Value</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {periods.map((period, index) => (
            <tr key={period.id}>
              <td>* {period.name}</td>
              <td>
                <input 
                  type="text" 
                  value={period.value}
                  onChange={(e) => onTsnChange(index, e.target.value)}
                />
              </td>
              <td>
                <button type="button" className="remove-button">
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="add-button">+</button>
    </FormSection>
  );
}

export default TsnDetails;