import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DashBoardLayerTwo from "../components/DashBoardLayerTwo";
import FormPageLayer from "../components/FormPageLayer";
import FormLayoutLayer from "../components/FormLayoutLayer";
import AtaForm from "./AtaForm";




const AtaPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="ATA" />
         {/* <FormLayoutLayer/> */}
    
        <AtaForm/>

        {/* DashBoardLayerTwo */}
        {/* <DashBoardLayerTwo /> */}

      </MasterLayout>
    </>
  );
};

export default AtaPage;
