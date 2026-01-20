import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DashBoardLayerTwo from "../components/DashBoardLayerTwo";
import FormPageLayer from "../components/FormPageLayer";
import FormLayoutLayer from "../components/FormLayoutLayer";
import PlaceForm from "./PlaceForm";




const PlacePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Place" />
         {/* <FormLayoutLayer/> */}
    
        <PlaceForm />

        {/* DashBoardLayerTwo */}
        {/* <DashBoardLayerTwo /> */}

      </MasterLayout>
    </>
  );
};

export default PlacePage;
