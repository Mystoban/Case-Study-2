import React, { useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import date from "date-and-time";
import { Container, TextInput, createStyles } from "@mantine/core";
import OpenSansRegular from "../fonts/OpenSans-Regular.ttf";
import OpenSansBold from "../fonts/OpenSans-Bold.ttf";
import LucidaCalligraphy from "../fonts/Lucida Calligraphy Font.ttf";
import Logo from "../images/BRGY_KALILANGAN - Logo.png";
import { useSelector } from "react-redux";
import { AdditionInputs } from "../Components";

const useStyles = createStyles((theme) => ({
  root: {
    width: "100%",
    background:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.white,
    borderRadius: `20px`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const styles = StyleSheet.create({
  maintitle: {
    alignSelf: "center",
    fontSize: 32,
    fontFamily: "OpenSans",
    marginTop: 24,
  },
  body: {
    width: "2500px",
    height: "3300px",
    paddingRight: 35,
    background: "transparent",
  },
  title: {
    fontSize: 29,
    fontFamily: "OpenSans",
    fontStyle: "italic",
    textAlign: "center",
    fontWeight: "ultrabold",
    marginTop: 9,
  },

  text: {
    fontSize: 10,
    alignSelf: "center",
    fontFamily: "OpenSans",
  },

  textregular: {
    fontSize: 10,
    alignSelf: "center",
    fontFamily: "OpenSans",
    fontWeight: 900,
  },
  clientname: {
    fontSize: 10,
    alignSelf: "center",
    fontFamily: "OpenSans",
    fontWeight: 900,
    textTransform: "uppercase",
  },
  container: {
    fontFamily: "Regular",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: `150vh`,
    borderRadius: 20,
  },
  pdfviewer: {
    height: "90vh",
    width: "35vw",
  },
  containerwrapper: {
    width: "50%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    flexGrow: 1,
  },
  leftcontainer: {
    width: 170,
    paddingTop: 100,
  },
  rightcontainer: {
    width: 600,
    paddingTop: 70,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 18,
  },
  mainheader: {
    width: "100%",
    height: 100,
    flexDirection: "row",
    justifyContent: "center",
  },
  containertext: {
    background: Logo,
    display: "flex",
    flexDirection: "column",
    alignContent: "flex-start",
    width: "100%",
    marginTop: 40,
    height: 380,
  },
  receipenttext: {
    fontSize: 10,
    alignSelf: "left",
    fontFamily: "OpenSans",
    fontWeight: 900,
    paddingBottom: 38,
  },
  textfirstparag: {
    fontSize: 10,
    alignSelf: "left",
    fontFamily: "OpenSans",
    width: "auto",
    lineHeight: 2,
    textAlign: "justify",
  },
  firstcontainer: {
    flexDirection: "row",
    textAlign: "justify",
  },
  marginTopContainer: {
    marginTop: 12,
    textAlign: "justify",
  },

  marginspacing: {
    color: "white",
  },
  formcontainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  textinputs: {
    width: "80%",
  },
  textlowercase: {
    fontSize: 10,
    fontFamily: "OpenSans",
    textTransform: "lowercase",
  },
  textCapitalize: {
    fontSize: 10,
    fontFamily: "OpenSans",
    textTransform: "capitalize",
  },
  textuppercase: {
    fontSize: 10,
    fontFamily: "OpenSans",
    textTransform: "uppercase",
  },
});

Font.register({
  family: "OpenSans",
  fonts: [
    { src: OpenSansRegular },
    { src: OpenSansBold, fontWeight: 900 },
    { src: LucidaCalligraphy, fontStyle: "italic", fontWeight: "ultrabold" },
  ],
});

const JobSeekerDirect = () => {
  const { classes } = useStyles();
  const singleperson = useSelector((state) => state.facerecog.singlepersondata);
  const [ClientAge, setClientAge] = useState("");
  const [ClientName, setClientName] = useState("");
  const [ClientSex, setClientSex] = useState("");
  const [ClientCivilStatus, setClientCivilStatus] = useState("");
  const [ClientCitizenship, setClientCitizenship] = useState("");
  const [ClientAddress, setClientAddress] = useState("");

  return (
    <Container fluid="true" className={classes.root}>
      <Text style={styles.maintitle}>JOB SEEKER</Text>
      <div style={styles.container}>
        <Container style={styles.containerwrapper}>
          <PDFViewer style={styles.pdfviewer}>
            <MyDocuments
              singleperson={singleperson}
              ClientAge={ClientAge}
              ClientName={ClientName}
              ClientSex={ClientSex}
              ClientCivilStatus={ClientCivilStatus}
              ClientCitizenship={ClientCitizenship}
              ClientAddress={ClientAddress}
            />
          </PDFViewer>
        </Container>
        <Container style={styles.containerwrapper}>
          <DataFillOut
            setClientAge={setClientAge}
            setClientName={setClientName}
            setClientSex={setClientSex}
            setClientCivilStatus={setClientCivilStatus}
            setClientCitizenship={setClientCitizenship}
            setClientAddress={setClientAddress}
            ClientName={ClientName}
          />
        </Container>
      </div>
    </Container>
  );
};

const DayMoment = (n) => {
  return (
    ["st", "nd", "rd"][(((((n < 0 ? -n : n) + 90) % 100) - 10) % 10) - 1] ||
    "th"
  );
};

const MyDocuments = ({
  singleperson,
  ClientAge,
  ClientName,
  ClientSex,
  ClientCivilStatus,
  ClientCitizenship,
  ClientAddress,
}) => {
  const now = new Date();
  const day = date.format(now, "D");
  const MonthAndDate = date.format(now, "MMMM, YYYY");
  return (
    <Document>
      <Page size="LETTER" wrap style={styles.body}>
        <View style={styles.row}>
          <View style={styles.leftcontainer}></View>
          <View style={styles.rightcontainer}>
            <View style={styles.mainheader}></View>
            <Text style={styles.title}>BARANGAY CERTIFICATION</Text>
            <View style={styles.containertext}>
              <Text style={styles.receipenttext}>TO WHOM IT MAY CONCERN:</Text>
              <View style={styles.firstcontainer}>
                <Text style={styles.textfirstparag}>
                  <Text style={styles.marginspacing}>...............</Text>
                  This is to certify that {""}
                  <Text style={styles.clientname}>{ClientName}</Text>,{" "}
                  <Text>{ClientAge}</Text> years of age,{" "}
                  <Text style={styles.textlowercase}>{ClientSex}</Text>,{" "}
                  <Text style={styles.textlowercase}>{ClientCivilStatus}</Text>,{" "}
                  <Text style={styles.textCapitalize}>{ClientCitizenship}</Text>{" "}
                  Citizen, a resident of <Text>{ClientAddress}</Text>, Barangay
                  Luna, Iligan City, has never been charged in any kind of
                  offense and has no pending case(s) filed before the Lupong
                  Tagapamayapa in this Barangay, either civil or criminal up to
                  this date.
                </Text>
              </View>
              <View style={styles.marginTopContainer}>
                <Text style={styles.textfirstparag}>
                  <Text style={styles.marginspacing}>...............</Text>
                  This is also to certify that{" "}
                  <Text style={styles.clientname}>{ClientName}</Text> is a
                  qualified beneficiary of{" "}
                  <Text style={styles.textregular}>
                    RA 11261 or the First Time JobseekerDirects Act of 2019.
                  </Text>
                </Text>
              </View>
              <View style={styles.marginTopContainer}>
                <Text style={styles.textfirstparag}>
                  <Text style={styles.marginspacing}>...............</Text>
                  Further certify that the holder/bearer was informed of his/her
                  rights, including the duties and responsibilities accorded by{" "}
                  <Text style={styles.textregular}>RA 11261</Text> through the{" "}
                  <Text style={styles.textregular}>Oath of Undertaking</Text>{" "}
                  he/she signed and executed in the presence of our Barangay
                  Official.
                </Text>
              </View>
              <View style={styles.marginTopContainer}>
                <Text style={styles.textfirstparag}>
                  <Text style={styles.marginspacing}>...............</Text>
                  Issued this{" "}
                  <Text>
                    {day}
                    {DayMoment(day)}
                  </Text>{" "}
                  day of <Text>{MonthAndDate}</Text> at Barangay Kalilangan, Iligan City, Philippines.{" "}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const DataFillOut = ({
  setClientAge,
  setClientName,
  setClientCitizenship,
  setClientCivilStatus,
  setClientSex,
  setClientAddress,
  ClientName,
}) => {
  return (
    <Container fluid="true" style={styles.formcontainer}>
      <TextInput
        style={styles.textinputs}
        label="Name"
        radius="sm"
        placeholder="ex. "
        onChange={(e) => setClientName(e.target.value)}
      />
      <TextInput
        style={styles.textinputs}
        label="Sex"
        radius="sm"
        placeholder="ex. Male"
        onChange={(e) => setClientSex(e.target.value)}
      />
      <TextInput
        style={styles.textinputs}
        label="Citizenship"
        radius="sm"
        placeholder="ex. Filipino"
        onChange={(e) => setClientCitizenship(e.target.value)}
      />
      <TextInput
        style={styles.textinputs}
        label="Civil Status"
        radius="sm"
        placeholder="ex. Single"
        onChange={(e) => setClientCivilStatus(e.target.value)}
      />
      <TextInput
        style={styles.textinputs}
        label="Address"
        radius="sm"
        placeholder="ex. Purok 1, Payawan 2"
        onChange={(e) => setClientAddress(e.target.value)}
      />
      <TextInput
        style={styles.textinputs}
        label="Age"
        radius="sm"
        placeholder="ex. 28"
        onChange={(e) => setClientAge(e.currentTarget.value)}
      />
      <AdditionInputs clientname={ClientName} lettername="Livelihood" />
    </Container>
  );
};

export default JobSeekerDirect;
