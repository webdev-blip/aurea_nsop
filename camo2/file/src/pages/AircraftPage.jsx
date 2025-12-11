import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DashBoardLayerTwo from "../components/DashBoardLayerTwo";
import FormPageLayer from "../components/FormPageLayer";
import FormLayoutLayer from "../components/FormLayoutLayer";
import AircraftmainForm from "./AircraftmainForm";



const AircraftPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Aircraft" />
         {/* <FormLayoutLayer/> */}
    
        <AircraftmainForm/>

        {/* DashBoardLayerTwo */}
        {/* <DashBoardLayerTwo /> */}

      </MasterLayout>
    </>
  );
};

export default AircraftPage;
