import { useEffect, useState } from "react";
import { NotificationsProvider } from "@mantine/notifications";
import {
  MantineProvider,
  ColorSchemeProvider,
  AppShell,
  Group,
} from "@mantine/core";
import { useHotkeys, useLocalStorage, useViewportSize } from "@mantine/hooks";
import { Routes, Route, useLocation } from "react-router-dom";
import { NavbarContainer, HeaderContainer, CreateDocument } from "./Components";
import { useSelector } from "react-redux";
import ResidentList from "./Pages/Masterlist";
import { Auth, Events, Home, Documents, Logs } from "./Pages";
import 'leaflet/dist/leaflet.css';
import ResidentDetails from './Pages/ResidentDetails';
import ResidentPublicView from './Pages/ResidentPublicView';

import {
  Abroad,
  BaligyaBaboy,
  BarangayAcceptance,
  BarangayAcceptance2,
  BIRpattern,
  BrgyCertification2,
  BrgyCertification3,
  BrgyCertificationMultiPurpose,
  BuildingPermit,
  BurialAssistanceRelatives,
  BusinessClosure,
  BusinessClosurePSA,
  CaapAccessPass,
  CertificationLowIncome,
  CertificationStranded,
  ChedScholar,
  Clearance,
  DeathCertificate,
  ElectricMeter,
  FourPsTransfery,
  GoodMoral,
  JobSeeker,
  Livelihood,
  LowIncomeSubsidized,
  MinorVaccination,
  Pabahay,
  PaihawBaboy,
  PhilHealth,
  PhilSys,
  SoloParent,
  TravelCertificate,
  WaterConnection,
  WaterConnectionDiscount,
} from "./BrgyFiles";

import {
  AbroadDirect,
  BarangayAcceptanceDirect,
  BarangayAcceptance2Direct,
  BIRpatternDirect,
  BrgyCertificationMultiPurposeDirect,
  BuildingPermitDirect,
  BurialAssistanceRelativesDirect,
  BusinessClosureDirect,
  BusinessClosurePSADirect,
  CertificationLowIncomeDirect,
  CertificationStrandedDirect,
  ChedScholarDirect,
  ClearanceDirect,
  ElectricMeterDirect,
  FourPsTransferyDirect,
  JobSeekerDirect,
  LivelihoodDirect,
  LowIncomeSubsidizedDirect,
  PabahayDirect,
  PhilHealthDirect,
  TravelCertificateDirect,
  WaterConnectionDirect,
  WaterConnectionDiscountDirect,
  GoodMoralDirect,
  CaapAccessPassDirect,
  BaligyaBaboyDirect,
  BrgyCertification2Direct,
  BrgyCertification3Direct,
  PaihawBaboyDirect,
  DeathCertificateDirect,
  MinorVaccinationDirect,
  PhilSysDirect,
  SoloParentDirect,
} from "./BrgyFilesDirect/indexDirect";

function App() {
  const User = useSelector((state) => state.user.loginStatus);
  const { width } = useViewportSize();
  const show = useSelector((state) => state.navbar.show);

  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "color-scheme",
    defaultValue: "dark",
  });

  const toggleColorScheme = () =>
    setColorScheme((current) => (current === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  }

  const theme = {
    colorScheme,
    primaryColor: 'green',
    defaultRadius: 'md',
    colors: {
      dark: [
        '#C1C2C5',
        '#A6A7AB',
        '#909296',
        '#5C5F66',
        '#373A40',
        '#2C2E33',
        '#25262B',
        '#1A1B1E',
        '#141517',
        '#101113',
      ],
      green: [
        '#E8F5E9',
        '#C8E6C9',
        '#A5D6A7',
        '#81C784',
        '#66BB6A',
        '#4CAF50',
        '#43A047',
        '#388E3C',
        '#2E7D32',
        '#1B5E20',
      ],
      gray: [
        '#F8F9FA',
        '#F1F3F5',
        '#E9ECEF',
        '#DEE2E6',
        '#CED4DA',
        '#ADB5BD',
        '#868E96',
        '#495057',
        '#343A40',
        '#212529',
      ],
    },
    components: {
      Paper: {
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
            boxShadow: theme.colorScheme === 'dark' 
              ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
              : '0 2px 8px rgba(46, 125, 50, 0.1)',
          },
        }),
      },
      Container: {
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          },
        }),
      },
    },
    other: {
      backgroundColor: colorScheme === 'dark' ? '#1A1B1E' : '#FFFFFF',
      paperBackgroundColor: colorScheme === 'dark' ? '#25262B' : '#FFFFFF',
      borderColor: colorScheme === 'dark' ? '#2C2E33' : '#E9ECEF',
    },
  };

  const RoutesNavigation = [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "events",
      element: <Events />,
    },
    {
      path: "transactions",
      element: <Documents />,
    },
    {
      path: "residentlist",
      element: <ResidentList colorScheme={colorScheme} />,
    },
    {
      path: "logs",
      element: <Logs colorScheme={colorScheme} />,
    },
    {
      path: "/createdocument",
      element: <CreateDocument />
    },
    {
      path: "/4PsTransfery",
      element: <FourPsTransfery />,
    },
    {
      path: "/BrgyAcceptance",
      element: <BarangayAcceptance />,
    },
    {
      path: "/BrgyAcceptance2",
      element: <BarangayAcceptance2 />,
    },
    {
      path: "/BusinessClosure",
      element: <BusinessClosure />,
    },
    {
      path: "/BusinessClosurePSA",
      element: <BusinessClosurePSA />,
    },
    {
      path: "/BurialAssistanceRelatives",
      element: <BurialAssistanceRelatives />,
    },
    {
      path: "/BuildingPermit",
      element: <BuildingPermit />,
    },
    {
      path: "/TravelCertificate",
      element: <TravelCertificate />,
    },
    {
      path: "/CertificateAbroad",
      element: <Abroad />,
    },
    {
      path: "/CertificateBirPattern",
      element: <BIRpattern />,
    },
    {
      path: "/CertificateWaterConnection",
      element: <WaterConnection />,
    },
    {
      path: "/CertificateStranded",
      element: <CertificationStranded />,
    },
    {
      path: "/JobSeeker",
      element: <JobSeeker />,
    },
    {
      path: "/Clearance",
      element: <Clearance />,
    },
    {
      path: "/CertificateWaterConnectionDiscount",
      element: <WaterConnectionDiscount />,
    },
    {
      path: "/CertificationLowIncome",
      element: <CertificationLowIncome />,
    },
    {
      path: "/PhilHealth",
      element: <PhilHealth />,
    },
    {
      path: "/LowIncomeSubsidized",
      element: <LowIncomeSubsidized />,
    },
    {
      path: "/ChedScholar",
      element: <ChedScholar />,
    },
    {
      path: "/BrgyCertification",
      element: <BrgyCertificationMultiPurpose />,
    },
    {
      path: "/Livelihood",
      element: <Livelihood />,
    },
    {
      path: "/CertificationPabahay",
      element: <Pabahay />,
    },
    {
      path: "/ElectricConnection",
      element: <ElectricMeter />,
    },
    {
      path: "/GoodMoral",
      element: <GoodMoral />
    },
    {
      path: "/CaapAccessPass",
      element: <CaapAccessPass />
    },
    {
      path: "/BaligyaBaboy",
      element: <BaligyaBaboy />
    },
    {
      path: "/BrgyCertification2",
      element: <BrgyCertification2 />
    },
    {
      path: "/BrgyCertification3",
      element: <BrgyCertification3 />
    },
    {
      path: "/PaihawBaboy",
      element: <PaihawBaboy />,
    },
    {
      path: "/DeathCertificate",
      element: <DeathCertificate />,
    },
    {
      path: "/MinorVaccination",
      element: <MinorVaccination />
    },
    {
      path: "/PhilSys",
      element: <PhilSys />
    },
    {
      path: "/SoloParent",
      element: <SoloParent />
    },



    {
      path: "/4PsTransferyDirect",
      element: <FourPsTransferyDirect />,
    },
    {
      path: "/BrgyAcceptanceDirect",
      element: <BarangayAcceptanceDirect />,
    },
    {
      path: "/BrgyAcceptance2Direct",
      element: <BarangayAcceptance2Direct />,
    },
    {
      path: "/BusinessClosureDirect",
      element: <BusinessClosureDirect />,
    },
    {
      path: "/BusinessClosurePSADirect",
      element: <BusinessClosurePSADirect />,
    },
    {
      path: "/BurialAssistanceRelativesDirect",
      element: <BurialAssistanceRelativesDirect />,
    },
    {
      path: "/BuildingPermitDirect",
      element: <BuildingPermitDirect />,
    },
    {
      path: "/TravelCertificateDirect",
      element: <TravelCertificateDirect />,
    },
    {
      path: "/CertificateAbroadDirect",
      element: <AbroadDirect />,
    },
    {
      path: "/CertificateBirPatternDirect",
      element: <BIRpatternDirect />,
    },
    {
      path: "/CertificateWaterConnectionDirect",
      element: <WaterConnectionDirect />,
    },
    {
      path: "/CertificateStrandedDirect",
      element: <CertificationStrandedDirect />,
    },
    {
      path: "/JobSeekerDirect",
      element: <JobSeekerDirect />,
    },
    {
      path: "/ClearanceDirect",
      element: <ClearanceDirect />,
    },
    {
      path: "/CertificateWaterConnectionDiscountDirect",
      element: <WaterConnectionDiscountDirect />,
    },
    {
      path: "/CertificationLowIncomeDirect",
      element: <CertificationLowIncomeDirect />,
    },
    {
      path: "/PhilHealthDirect",
      element: <PhilHealthDirect />,
    },
    {
      path: "/LowIncomeSubsidizedDirect",
      element: <LowIncomeSubsidizedDirect />,
    },
    {
      path: "/ChedScholarDirect",
      element: <ChedScholarDirect />,
    },
    {
      path: "/BrgyCertificationDirect",
      element: <BrgyCertificationMultiPurposeDirect />,
    },
    {
      path: "/LivelihoodDirect",
      element: <LivelihoodDirect />,
    },
    {
      path: "/CertificationPabahayDirect",
      element: <PabahayDirect />,
    },
    {
      path: "/ElectricConnectionDirect",
      element: <ElectricMeterDirect />,
    },
    {
      path: "/GoodMoralDirect",
      element: <GoodMoralDirect />,
    },
    {
      path: "/CaapAccessPassDirect",
      element: <CaapAccessPassDirect />,
    },
    {
      path: "/BaligyaBaboyDirect",
      element: <BaligyaBaboyDirect />,
    },
    {
      path: "/BrgyCertification2Direct",
      element: <BrgyCertification2Direct />,
    },
    {
      path: "/BrgyCertification3Direct",
      element: <BrgyCertification3Direct />,
    },
    {
      path: "/PaihawBaboyDirect",
      element: <PaihawBaboyDirect />,
    },
    {
      path: "/DeathCertificateDirect",
      element: <DeathCertificateDirect />,
    },
    {
      path: "/MinorVaccinationDirect",
      element: <MinorVaccinationDirect />

    },
    {
      path: "/PhilSysDirect",
      element: <PhilSysDirect />,
    },
    {
      path: "/SoloParentDirect",
      element: <SoloParentDirect />,
    },
    {
      path: "/resident/:id",
      element: <ResidentDetails />,
    },
    {
      path: "/public/resident/:id",
      element: <ResidentPublicView />,
    },
  ];

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
        <NotificationsProvider position="bottom-left">
          <Routes>
            {/* Public route for QR code viewing */}
            <Route path="/public/resident/:id" element={<ResidentPublicView />} />
            {RoutesNavigation.map(({ path, element }, index) => (
              <Route
                key={index}
                path={path}
                element={
                  User ? (
                    <AppShell
                      styles={{
                        main: {
                          background:
                            theme.colorScheme === "dark"
                              ? theme.colors.dark[7]
                              : theme.colors.gray[0],
                        },
                      }}
                      navbarOffsetBreakpoint="sm"
                      navbar={width >= 768 && show && <NavbarContainer />}
                      header={<HeaderContainer />}
                    >
                      <Group
                        sx={(theme) => ({
                          background:
                            theme.colorScheme === "dark"
                              ? theme.colors.dark[7]
                              : theme.colors.gray[0],
                          padding: `0 0.5rem`,
                          marginTop: `5.5rem`,
                          width: `${show && width > 765 ? `auto` : `100%`}`,
                          marginLeft: `${show && width > 765 ? `265px` : `none`}`,
                        })}
                      >
                        <ScrollToTop />
                        {element}
                      </Group>
                    </AppShell>
                  ) : (
                    <Auth />
                  )
                }
              />
            ))}
          </Routes>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
