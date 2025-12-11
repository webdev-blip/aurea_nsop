import React, { useState, useEffect } from "react";
import axios from "axios";
import MasterLayout from "../masterLayout/MasterLayout";
import { Breadcrumb } from "react-bootstrap";
import ModelForm from "./ModelForm";

const AircraftModel = () => {

  return (
    <MasterLayout>

  
      {/* Breadcrumb */}
      <Breadcrumb title="Aircraft" />
    <ModelForm/>
      <style jsx>{`
        .card {
          border-radius: 12px;
        }
        .form-select, .form-control {
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .form-select:focus, .form-control:focus {
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
          border-color: #0d6efd;
        }
        .btn {
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .table th {
          border: none;
          font-weight: 600;
          padding: 1rem 0.75rem;
        }
        .table td {
          padding: 1rem 0.75rem;
          vertical-align: middle;
        }
        .icon-shape {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .icon-xs {
          width: 24px;
          height: 24px;
        }
        .icon-xxl {
          width: 80px;
          height: 80px;
          font-size: 2rem;
        }
        .badge {
          border-radius: 6px;
          padding: 0.35rem 0.65rem;
        }
      `}</style>
    </MasterLayout>
  );
};

export default AircraftModel;