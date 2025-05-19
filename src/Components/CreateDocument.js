import { Container, NativeSelect, createStyles, Button, Text } from "@mantine/core";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { showNotification } from "@mantine/notifications";
import { ClearDocument } from "../redux/FaceRecognitionRedux";

const useStyles = createStyles((theme) => ({
  formcontainer: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  group: {
    display: "flex",
    justifyContent: "flex-start",
    width: "100%",
  },
  textmargin: {
    marginRight: `${theme.spacing.xs}px`,
    fontFamily: "Bold",
  },
  textinputs: {
    marginTop: '5rem',
    width: 400,
    padding: `${theme.spacing.sm}px`,
  },
  button: {
    width: "110px",
    cursor: "pointer",
    marginTop: "1rem"
  },
  maintitle: {
    alignSelf: "center",
    fontSize: 32,
    marginTop: 24,
  },
}));

const CreateDocument = () => {
  const [DirectAccessDocument, setDirectAccessDocument] = useState("4P'sTransfery");
  const { classes } = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { singlepersondata } = useSelector(state => state.facerecog);

  useEffect(() => {
    if (!singlepersondata || !Object.keys(singlepersondata).length) {
      showNotification({
        title: "Error",
        message: "No resident selected. Please select a resident first.",
        color: "red"
      });
      navigate('/masterlist');
      return;
    }
  }, [singlepersondata, navigate]);

  const documentsdata = [
    "4P'sTransfery",
    "BaligyaBaboy",
    "BrgyAcceptance",
    "BrgyAcceptance2",
    "BusinessClosure",
    "BusinessClosurePSA",
    "BurialAssistanceRelatives",
    "BuildingPermit",
    "BirPattern/Assitance",
    "BrgyCertification",
    "BrgyCertification2",
    "BrgyCertification3",
    "CaapAccessPass",
    "Certification-Abroad",
    "Certification-Stranded",
    "Clearance",
    "CHEDScholar",
    "Certification-Pabahay",
    "DeathCertificate",
    "ElectricConnection",
    "GoodMoral",
    "LowIncomeSubsidized",
    "Livelihood",
    "LowIncome",
    "JobSeeker",
    "MinorVaccination",
    "PaihawBaboy",
    "PhilHealth",
    "PhilSys-Step-2",
    "SoloParent",
    "TravelCertificate",
    "WaterConnection",
    "WaterConnectionDiscount",
  ];

  const getDocumentPath = () => {
    switch (DirectAccessDocument) {
      case "4P'sTransfery": return "/4PsTransfery";
      case "BrgyAcceptance": return "/BrgyAcceptance";
      case "BrgyAcceptance2": return "/BrgyAcceptance2";
      case "BusinessClosure": return "/BusinessClosure";
      case "BusinessClosurePSA": return "/BusinessClosurePSA";
      case "BurialAssistanceRelatives": return "/BurialAssistanceRelatives";
      case "BuildingPermit": return "/BuildingPermit";
      case "TravelCertificate": return "/TravelCertificate";
      case "Certification-Abroad": return "/CertificateAbroad";
      case "BirPattern/Assitance": return "/CertificateBirPattern";
      case "WaterConnection": return "/CertificateWaterConnection";
      case "Certification-Stranded": return "/CertificateStranded";
      case "JobSeeker": return "/JobSeeker";
      case "Clearance": return "/Clearance";
      case "WaterConnectionDiscount": return "/CertificateWaterConnectionDiscount";
      case "LowIncome": return "/CertificationLowIncome";
      case "PhilHealth": return "/PhilHealth";
      case "LowIncomeSubsidized": return "/LowIncomeSubsidized";
      case "CHEDScholar": return "/ChedScholar";
      case "BrgyCertification": return "/BrgyCertification";
      case "Livelihood": return "/Livelihood";
      case "Certification-Pabahay": return "/CertificationPabahay";
      case "ElectricConnection": return "/ElectricConnection";
      case "GoodMoral": return "/GoodMoral";
      case "CaapAccessPass": return "/CaapAccessPass";
      case "BaligyaBaboy": return "/BaligyaBaboy";
      case "BrgyCertification2": return "/BrgyCertification2";
      case "BrgyCertification3": return "/BrgyCertification3";
      case "PaihawBaboy": return "/PaihawBaboy";
      case "DeathCertificate": return "/DeathCertificate";
      case "MinorVaccination": return "/MinorVaccination";
      case "PhilSys-Step-2": return "/PhilSys";
      case "SoloParent": return "/SoloParent";
      default: return "/masterlist";
    }
  };

  const handleApply = () => {
    if (!singlepersondata || !Object.keys(singlepersondata).length) {
      showNotification({
        title: "Error",
        message: "No resident selected. Please select a resident first.",
        color: "red"
      });
      navigate('/masterlist');
      return;
    }

    const path = getDocumentPath();
    if (path === "/masterlist") {
      showNotification({
        title: "Error",
        message: "Invalid document type selected.",
        color: "red"
      });
      return;
    }

    navigate(path);
  };

  const handleCancel = () => {
    dispatch(ClearDocument());
    navigate('/masterlist');
  };

  if (!singlepersondata || !Object.keys(singlepersondata).length) {
    return null;
  }

  return (
    <Container fluid="true" className={classes.formcontainer}>
      <Text className={classes.maintitle}>
        Create Document for {singlepersondata.fullname}
      </Text>
      <NativeSelect
        className={classes.textinputs}
        data={documentsdata}
        value={DirectAccessDocument}
        radius="sm"
        label="Select a document"
        onChange={(event) => setDirectAccessDocument(event.currentTarget.value)}
      />
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button 
          variant="filled" 
          size="sm" 
          className={classes.button}
          onClick={handleApply}
          color="green"
        >
          Apply
        </Button>
        <Button 
          variant="filled" 
          size="sm" 
          className={classes.button}
          onClick={handleCancel}
          color="red"
        >
          Cancel
        </Button>
      </div>
    </Container>
  );
};

export default CreateDocument;
