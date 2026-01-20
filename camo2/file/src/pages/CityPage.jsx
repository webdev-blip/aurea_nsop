import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DashBoardLayerTwo from "../components/DashBoardLayerTwo";
import FormPageLayer from "../components/FormPageLayer";
import FormLayoutLayer from "../components/FormLayoutLayer";
import CityForm from "./CityForm";



const CityPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="City" />
         {/* <FormLayoutLayer/> */}
    
        <CityForm/>

        {/* DashBoardLayerTwo */}
        {/* <DashBoardLayerTwo /> */}

      </MasterLayout>
    </>
  );
};

export default CityPage;
