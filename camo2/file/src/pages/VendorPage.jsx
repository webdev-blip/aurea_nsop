import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DashBoardLayerTwo from "../components/DashBoardLayerTwo";
import FormPageLayer from "../components/FormPageLayer";
import FormLayoutLayer from "../components/FormLayoutLayer";
import VendorForm from "./VendorForm";
import Vendor from "./Vendor";




const VendorPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Vendor" />
         {/* <FormLayoutLayer/> */}
    
        <Vendor />

        {/* DashBoardLayerTwo */}
        {/* <DashBoardLayerTwo /> */}

      </MasterLayout>
    </>
  );
};

export default VendorPage;
