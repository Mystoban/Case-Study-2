import React, { useState, useLayoutEffect } from "react";
import {
  createStyles,
  Group,
  Paper,
  TextInput,
  Button,
  Space,
  Modal,
  Tooltip,
  Image,
  NativeSelect,
  Text,
  Loader,
  Box
} from "@mantine/core";
import {
  Bacud,
  Bernadette,
  CentralPoblacion,
  Looc,
  Payawan1,
  Payawan2,
  SanVicente,
  Toril,
  Sitio1,
  Sitio2,
  Sitio3,
  Sitio4,
  Sitio5,
  Sitio6,
} from "../config/dummyData";

import DataTable from "react-data-table-component";
import {
  ArrowNarrowDown,
  Edit,
  Eye,
  Trash,
  FileDescription,
} from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";
import {
  GetAllDataResident,
  UpdateDataResident,
  DeleteDataResident,
} from "../redux/apiCalls";

import {
  areas,
  sexdata,
  civilStatus,
  selection,
  housestatus,
} from "../Components/Data";

import { CreateDocument } from "../redux/FaceRecognitionRedux";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import QRCodeModal from "../Components/QRCodeModal";

const defaultImage = '/assets/default-avatar.png';

const useStyles = createStyles((theme) => ({
  container: {
    fontFamily: "Regular",
    width: "100%",
    height: "fit-content",
    padding: 15,
    background: theme.colorScheme === "dark" ? "#1A1B1E" : "#F8F9FA",
  },
  paper: {
    borderRadius: 15,
    backgroundColor: theme.colorScheme === "dark" ? "#25262B" : "#FFFFFF",
    width: "100%",
    boxShadow: theme.colorScheme === "dark" 
      ? "0 4px 6px rgba(0, 0, 0, 0.3)" 
      : "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  inputimage: {
    width: "400px",
    height: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textinputs: {
    width: "100%",
    margin: `0 ${theme.spacing.xxs}px`,
  },
  registerbutton: {
    marginTop: `${theme.spacing.lg}px`,
    width: "100px",
  },
  hidden: {
    display: "none",
  },
  label: {
    display: "flex",
    cursor: "pointer",
  },
  group: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  containermodalupdate: {
    width: 430,
    height: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const customStyles = {
  header: {
    style: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "24px",
      fontWeight: "700",
      color: (theme) => theme.colorScheme === "dark" ? "#69F0AE" : "#00695C",
      padding: "24px 0 16px",
      textTransform: "uppercase",
      letterSpacing: "1px",
      position: "relative",
      backgroundColor: (theme) => theme.colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
      "&:after": {
        content: '""',
        position: "absolute",
        bottom: "0",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60px",
        height: "4px",
        background: (theme) => theme.colorScheme === "dark" 
          ? "linear-gradient(90deg, #69F0AE 0%, #00C853 100%)"
          : "linear-gradient(90deg, #00C853 0%, #004D40 100%)",
        borderRadius: "2px",
      },
    },
  },
  table: {
    style: {
      backgroundColor: (theme) => theme.colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: (theme) => theme.colorScheme === "dark" 
        ? "0 10px 20px rgba(0, 0, 0, 0.5)" 
        : "0 10px 20px rgba(0, 200, 83, 0.1)",
    },
  },
  tableWrapper: {
    style: {
      borderRadius: "16px",
    },
  },
  headRow: {
    style: {
      backgroundColor: (theme) => theme.colorScheme === "dark" ? "#004D40" : "#00695C",
      color: "#FFFFFF !important",
      fontWeight: "600",
      fontSize: "14px",
      minHeight: "56px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      borderBottom: "2px solid #E8F5E9",
    },
  },
  headCells: {
    style: {
      padding: "16px 8px",
      color: "#FFFFFF !important",
      fontSize: "13px",
      fontWeight: "600",
    },
  },
  rows: {
    style: {
      fontSize: "14px",
      backgroundColor: (theme) => theme.colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
      "&:nth-of-type(odd)": {
        backgroundColor: (theme) => theme.colorScheme === "dark" ? "#262626" : "#F5FBF8",
      },
      minHeight: "52px",
      borderBottom: (theme) => theme.colorScheme === "dark" 
        ? "1px solid #2C2C2C"
        : "1px solid #E8F5E9",
    },
  },
  cells: {
    style: {
      padding: "12px 8px",
      color: (theme) => theme.colorScheme === "dark" ? "#E0E0E0" : "#37474F",
    },
  },
  pagination: {
    style: {
      borderTop: (theme) => `1px solid ${theme.colorScheme === "dark" ? "#2C2C2C" : "#E8F5E9"}`,
      padding: "20px",
      backgroundColor: (theme) => theme.colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
      borderBottomLeftRadius: "16px",
      borderBottomRightRadius: "16px",
    },
    pageButtonsStyle: {
      borderRadius: "8px",
      height: "36px",
      minWidth: "36px",
      padding: "0 12px",
      margin: "0 4px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      color: (theme) => theme.colorScheme === "dark" ? "#69F0AE" : "#00695C",
      backgroundColor: "transparent",
      fontSize: "14px",
      border: (theme) => theme.colorScheme === "dark" 
        ? "1px solid #2C2C2C"
        : "1px solid #E8F5E9",
      "&:disabled": {
        cursor: "not-allowed",
        color: (theme) => theme.colorScheme === "dark" ? "#404040" : "#BDBDBD",
        border: (theme) => theme.colorScheme === "dark" 
          ? "1px solid #2C2C2C"
          : "1px solid #EEEEEE",
      },
      "&:hover:not(:disabled)": {
        backgroundColor: (theme) => theme.colorScheme === "dark" ? "#004D40" : "#E8F5E9",
        color: (theme) => theme.colorScheme === "dark" ? "#FFFFFF" : "#00695C",
        border: (theme) => theme.colorScheme === "dark" 
          ? "1px solid #00897B"
          : "1px solid #00C853",
        transform: "translateY(-1px)",
        boxShadow: (theme) => theme.colorScheme === "dark"
          ? "0 4px 8px rgba(0, 0, 0, 0.2)"
          : "0 4px 8px rgba(0, 200, 83, 0.1)",
      },
      "&:focus": {
        outline: "none",
        boxShadow: (theme) => theme.colorScheme === "dark"
          ? "0 0 0 3px rgba(105, 240, 174, 0.3)"
          : "0 0 0 3px rgba(0, 200, 83, 0.2)",
      },
    },
  },
};

// CSV Export helpers (similar to Report.js)
function convertResidentsToCSV(array) {
  if (!array || array.length === 0) return '';
  const columnDelimiter = ',';
  const lineDelimiter = '\n';
  // Choose columns to export
  const keys = [
    'id', 'firstname', 'middlename', 'lastname', 'suffix', 'address', 'birthdate', 'birthplace', 'sex', 'civilstatus', 'parentsname', 'siblingsname', 'citizenship', 'occupation', 'PWD', 'fourpsmember', 'registervoter', 'occupancystatus'
  ];
  let result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;
  array.forEach(item => {
    let ctr = 0;
    keys.forEach(key => {
      if (ctr > 0) result += columnDelimiter;
      let value = item[key];
      if (typeof value === 'boolean') value = value ? 'Yes' : 'No';
      if (key === 'birthdate') value = dayjs(value).format('YYYY-MM-DD');
      result += value !== undefined ? '"' + String(value).replace(/"/g, '""') + '"' : '';
      ctr++;
    });
    result += lineDelimiter;
  });
  return result;
}
function downloadResidentsCSV(array) {
  const link = document.createElement('a');
  let csv = convertResidentsToCSV(array);
  if (csv == null) return;
  const filename = `brgy-masterlist-${dayjs(new Date()).format("YYYY-MM-DD")}.csv`;
  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }
  link.setAttribute('href', encodeURI(csv));
  link.setAttribute('download', filename);
  link.click();
}
const ExportMasterlist = ({ onExport }) => (
  <Button onClick={e => onExport()} color="blue" style={{ marginBottom: 16 }}>
    Export Masterlist as CSV
  </Button>
);

// Helper to get local IP or fallback to window.location.origin
function getQRCodeBaseURL() {
  // Try to use a hardcoded local IP for dev, fallback to window.location.origin
  // Replace with your actual local IP if needed
  const localDevIP = '192.168.1.27:3000'; // <-- User's actual local IP and port
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `http://${localDevIP}`;
  }
  return window.location.origin;
}

const Masterlist = ({ colorScheme }) => {
  const status = "success";
  // Style and Filter States
  const [focused, setFocused] = useState(false);
  const [filterByName, setFilterByName] = useState("");
  const [filterBySitio, setFilterBySitio] = useState("");
  const [filterByPurok, setFilterByPurok] = useState("");
  const dispatch = useDispatch();
  const populace = useSelector((state) => state.masterlist.residents);

  useLayoutEffect(() => {
    GetAllDataResident(dispatch);
  }, [dispatch]);

  const sitio = [
    "ALL",
    "SITIO 1",
    "SITIO 2",
    "SITIO 3",
    "SITIO 4",
    "SITIO 5",
    "SITIO 6"
  ];

  const { classes } = useStyles({
    floating: filterByName.trim().length !== 0 || focused,
  });
  // Modal States
  const [viewUserOpened, setViewUserOpened] = useState(false);
  const [editProfileOpened, setEditProfileOpened] = useState(false);
  const [deleteUserModal, setDeleteUserModal] = useState(false);

  // Selected Row Resident State
  const [selectedResidentData, setSelectedResidentData] = useState(null);
  const [residentIdToDelete, setResidentIdToDelete] = useState(null);
  const [selectedResidentUpdate, setselectedResidentUpdate] = useState(null);

  //Data for Update State
  const [updateAddress, setupdateAddress] = useState("");
  const [updateBirthplace, setupdateBirthplace] = useState("");
  const [updateBirthdate, setupdateBirthdate] = useState("");
  const [updateSex, setupdateSex] = useState("");
  const [updateCivilStatus, setupdateCivilStatus] = useState("");
  const [updateParentsname, setupdateParentsname] = useState("");
  const [updateSiblingsname, setupdateSiblingsname] = useState("");
  const [updateCitizenship, setupdateCitizenship] = useState("");
  const [updateOccupation, setupdateOccupation] = useState("");
  const [updatePWD, setupdatePWD] = useState("");
  const [updatefourpsmember, setupdatefourpsmember] = useState("");
  const [updateregistervoter, setupdateregistervoter] = useState("");
  const [updateoccupancystatus, setupdateoccupancystatus] = useState("");
  const [UpdateStatus, setUpdateStatus] = useState(false);

  const [qrOpened, setQROpened] = useState(false);
  const [qrValue, setQRValue] = useState("");

  // Handlers
  const handleUserViewButtonClick = (resident) => {
    setViewUserOpened(true);
    setSelectedResidentData(resident);
  };

  const handleUserUpdateButtonClick = (resident) => {
    setEditProfileOpened(true);
    setselectedResidentUpdate(resident);
    setupdatePWD(resident.PWD ? "Yes" : "No");
    setupdatefourpsmember(resident.fourpsmember ? "Yes" : "No");
    setupdateregistervoter(resident.registervoter ? "Yes" : "No");
    setupdateoccupancystatus(resident.occupancystatus);
  };

  const handleUserDeleteButtonClick = (resident) => {
    setResidentIdToDelete(resident.residentId);
    setDeleteUserModal(true);
  };

  const handleUserDelete = () => {
    DeleteDataResident(
      dispatch,
      residentIdToDelete,
      showNotification,
      setDeleteUserModal
    );
  };

  //Update Function
  const handleUserUpdate = () => {
    setUpdateStatus(true);

    const updatedValues = {
      residentId: selectedResidentUpdate?.residentId,
      image: selectedResidentUpdate?.image,
      firstname: selectedResidentUpdate?.firstname,
      middlename: selectedResidentUpdate?.middlename,
      lastname: selectedResidentUpdate?.lastname,
      suffix: selectedResidentUpdate?.suffix && selectedResidentUpdate?.suffix,
      address: updateAddress || selectedResidentUpdate?.address,
      birthdate: updateBirthdate || selectedResidentUpdate?.birthdate,
      birthplace: updateBirthplace || selectedResidentUpdate?.birthplace,
      sex: updateSex || selectedResidentUpdate?.sex,
      civilstatus: updateCivilStatus || selectedResidentUpdate?.civilstatus,
      parentsname: updateParentsname || selectedResidentUpdate?.parentsname,
      siblingsname: updateSiblingsname || selectedResidentUpdate?.siblingsname,
      citizenship: updateCitizenship || selectedResidentUpdate?.citizenship,
      occupation: updateOccupation || selectedResidentUpdate?.occupation,
      PWD: updatePWD === "Yes",
      fourpsmember: updatefourpsmember === "Yes",
      registervoter: updateregistervoter === "Yes",
      occupancystatus: updateoccupancystatus || selectedResidentUpdate?.occupancystatus,
    };

    UpdateDataResident(
      dispatch,
      selectedResidentUpdate?.residentId,
      showNotification,
      setUpdateStatus,
      updatedValues,
      setEditProfileOpened
    );
  };

  // Table Configs
  const usersColumns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      center: true,
      width: "80px",
    },
    {
      name: "Image",
      cell: (row) => (
        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid #2E7D32',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Image
            height={50}
            width={50}
            src={row.image ? (row.image.startsWith('http') ? row.image : `http://${window.location.hostname}:5001${row.image}`) : defaultImage}
            onError={(e) => {
              console.error('Image failed to load:', e);
              e.target.src = defaultImage;
            }}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }}
          />
        </Box>
      ),
      width: "80px",
      center: true,
    },
    {
      name: "Name",
      sortable: true,
      width: "220px",
      center: true,
      cell: (row) => (
        <div style={{ lineHeight: '1.4', textAlign: 'center' }}>
          <div style={{ fontWeight: '500', fontSize: '15px' }}>{`${row.lastname}, ${row.firstname}`}</div>
          <div style={{ fontSize: '14px', color: colorScheme === "dark" ? "#A0A0A0" : "#666666" }}>{`${row.middlename || ''} ${row.suffix || ''}`}</div>
        </div>
      ),
    },
    {
      name: "Address",
      sortable: true,
      width: "180px",
      center: true,
      cell: (row) => (
        <div style={{ lineHeight: '1.4', textAlign: 'center' }}>
          <div style={{ fontSize: '15px' }}>{row.address.split(", ")[0]}</div>
          <div style={{ fontSize: '14px', color: colorScheme === "dark" ? "#A0A0A0" : "#666666" }}>{row.address.split(", ")[1]}</div>
        </div>
      ),
    },
    {
      name: "Birth Info",
      sortable: true,
      width: "180px",
      center: true,
      cell: (row) => (
        <div style={{ lineHeight: '1.4', textAlign: 'center' }}>
          <div style={{ fontSize: '15px' }}>{dayjs(row.birthdate).format("MMMM D, YYYY")}</div>
          <div style={{ fontSize: '14px', color: colorScheme === "dark" ? "#A0A0A0" : "#666666" }}>{row.birthplace}</div>
        </div>
      ),
    },
    {
      name: "Personal Info",
      sortable: true,
      width: "180px",
      center: true,
      cell: (row) => (
        <div style={{ lineHeight: '1.4', textAlign: 'center' }}>
          <div style={{ fontSize: '15px' }}>{row.sex} | {row.civilstatus}</div>
          <div style={{ fontSize: '14px', color: colorScheme === "dark" ? "#A0A0A0" : "#666666" }}>{row.citizenship}</div>
        </div>
      ),
    },
    {
      name: "Family",
      sortable: true,
      width: "200px",
      center: true,
      cell: (row) => (
        <div style={{ lineHeight: '1.4', textAlign: 'center' }}>
          <div style={{ fontSize: '14px' }}>Parents: {row.parentsname || 'N/A'}</div>
          <div style={{ fontSize: '14px', color: colorScheme === "dark" ? "#A0A0A0" : "#666666" }}>Siblings: {row.siblingsname || 'N/A'}</div>
        </div>
      ),
    },
    {
      name: "Status",
      sortable: true,
      width: "160px",
      center: true,
      cell: (row) => (
        <div style={{ lineHeight: '1.4', textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {row.PWD && (
              <span style={{ 
                padding: '4px 10px', 
                borderRadius: '12px', 
                fontSize: '13px', 
                backgroundColor: colorScheme === 'dark' ? '#004D40' : '#E8F5E9',
                color: colorScheme === 'dark' ? '#69F0AE' : '#00695C',
                fontWeight: '500'
              }}>PWD</span>
            )}
            {row.fourpsmember && (
              <span style={{ 
                padding: '4px 10px', 
                borderRadius: '12px', 
                fontSize: '13px', 
                backgroundColor: colorScheme === 'dark' ? '#004D40' : '#E8F5E9',
                color: colorScheme === 'dark' ? '#69F0AE' : '#00695C',
                fontWeight: '500'
              }}>4P's</span>
            )}
            {row.registervoter && (
              <span style={{ 
                padding: '4px 10px', 
                borderRadius: '12px', 
                fontSize: '13px', 
                backgroundColor: colorScheme === 'dark' ? '#004D40' : '#E8F5E9',
                color: colorScheme === 'dark' ? '#69F0AE' : '#00695C',
                fontWeight: '500'
              }}>Voter</span>
            )}
          </div>
          <div style={{ fontSize: '14px', color: colorScheme === "dark" ? "#A0A0A0" : "#666666", marginTop: '4px' }}>{row.occupancystatus}</div>
        </div>
      ),
    },
    {
      name: "Occupation",
      selector: (row) => row.occupation,
      sortable: true,
      width: "140px",
      center: true,
      style: {
        fontSize: '15px',
        textAlign: 'center',
      },
    },
    {
      name: "Actions",
      width: "160px",
      center: true,
      cell: (row) => (
        <Group spacing={4} position="center" style={{ width: '100%' }}>
          <Tooltip label="View Details" withArrow>
            <Button 
              variant="subtle"
              size="sm" 
              color={colorScheme === 'dark' ? 'teal' : 'green'}
              onClick={() => handleUserViewButtonClick(row)}
            >
              <Eye size={16} />
            </Button>
          </Tooltip>
          <Tooltip label="Edit Record" withArrow>
            <Button 
              variant="subtle"
              size="sm" 
              color="blue"
              onClick={() => handleUserUpdateButtonClick(row)}
            >
              <Edit size={16} />
            </Button>
          </Tooltip>
          <Tooltip label="Delete Record" withArrow>
            <Button 
              variant="subtle"
              size="sm" 
              color="red"
              onClick={() => handleUserDeleteButtonClick(row)}
            >
              <Trash size={16} />
            </Button>
          </Tooltip>
          <Tooltip label="Create Document" withArrow>
            <Link to="/createdocument">
              <Button 
                variant="subtle"
                size="sm" 
                color={colorScheme === 'dark' ? 'teal' : 'green'}
                onClick={() => {
                  dispatch(CreateDocument(row));
                  showNotification({
                    title: "Success",
                    message: "Resident selected for document creation",
                    color: "green"
                  });
                }}
              >
                <FileDescription size={16} />
              </Button>
            </Link>
          </Tooltip>
          <Tooltip label="Show QR Code" withArrow>
            <Button
              variant="subtle"
              size="sm"
              color="gray"
              onClick={() => {
                console.log("QR Value:", `${getQRCodeBaseURL()}/public/resident/${row._id}`);
                setQRValue(`${getQRCodeBaseURL()}/public/resident/${row._id}`);
                setQROpened(true);
              }}
            >
              <span role="img" aria-label="qr">🔳</span>
            </Button>
          </Tooltip>
        </Group>
      ),
    },
  ];

  const filteredItems = populace?.filter((item) => {
    if (filterByName) {
      if (filterBySitio === "ALL") {
        return (
          item.lastname.toLowerCase().includes(filterByName.toLowerCase()) ||
          item.firstname.toLowerCase().includes(filterByName.toLowerCase()) ||
          item.middlename.toLowerCase().includes(filterByName.toLowerCase())
        );
      } else {
        if (filterByPurok === "ALL") {
          return (
            item.address
              .split(", ")[1]
              .toLowerCase()
              .includes(filterBySitio.toLowerCase()) &&
            (item.lastname.toLowerCase().includes(filterByName.toLowerCase()) ||
              item.firstname
                .toLowerCase()
                .includes(filterByName.toLowerCase()) ||
              item.middlename
                .toLowerCase()
                .includes(filterByName.toLowerCase()))
          );
        } else {
          return (
            item.address
              .split(", ")[0]
              .toLowerCase()
              .includes(filterByPurok.toLowerCase()) &&
            item.address
              .split(", ")[1]
              .toLowerCase()
              .includes(filterBySitio.toLowerCase()) &&
            (item.lastname.toLowerCase().includes(filterByName.toLowerCase()) ||
              item.firstname
                .toLowerCase()
                .includes(filterByName.toLowerCase()) ||
              item.middlename
                .toLowerCase()
                .includes(filterByName.toLowerCase()))
          );
        }
      }
    } else if (!filterByName && filterBySitio !== "ALL" && filterByPurok) {
      if (filterByPurok === "ALL") {
        return item.address
          .split(", ")[1]
          .toLowerCase()
          .includes(filterBySitio.toLowerCase());
      } else {
        return (
          item.address
            .split(", ")[1]
            .toLowerCase()
            .includes(filterBySitio.toLowerCase()) &&
          item.address
            .split(", ")[0]
            .toLowerCase()
            .includes(filterByPurok.toLowerCase())
        );
      }
    } else if (!filterByName && filterBySitio === "ALL") {
      return item;
    } else {
      return item;
    }
  });

  return (
    <Paper className={classes.container}>
      <Group position="left" mb="md" mt="md" className={classes.head}>
        <Tooltip
          label="Enter Resident's Name"
          withArrow
          radius="md"
          position="bottom"
        >
          <TextInput
            label="Filter by Name"
            placeholder="Search Name"
            classNames={classes}
            value={filterByName}
            onChange={(event) => setFilterByName(event.currentTarget.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoComplete="nope"
          />
        </Tooltip>
        <NativeSelect
          data={sitio}
          placeholder="Pick one"
          label="Select by Sitio"
          onChange={(event) => setFilterBySitio(event.currentTarget.value)}
        />
        {filterBySitio && (
          <NativeSelect
            data={
              filterBySitio === "SITIO 1"
                ? Sitio1
                : filterBySitio === "SITIO 2"
                  ? Sitio2
                  : filterBySitio === "SITIO 3"
                    ? Sitio3
                    : filterBySitio === "SITIO 4"
                      ? Sitio4
                      : filterBySitio === "SITIO 5"
                        ? Sitio5
                        : filterBySitio === "SITIO 6"
                          ? Sitio6
                          : filterBySitio === "ALL"
                            ? ["Select a Sitio"]
                            : "N/A"
            }
            placeholder="Pick one"
            label="Select by Purok"
            onChange={(event) => setFilterByPurok(event.currentTarget.value)}
          />
        )}
      </Group>

      <Space height="md" />

      {/* Export CSV Button */}
      <ExportMasterlist onExport={() => downloadResidentsCSV(filteredItems)} />

      <DataTable
        title="Resident's Records"
        columns={usersColumns}
        data={filteredItems}
        pagination
        paginationPerPage={15}
        paginationRowsPerPageOptions={[15, 25, 50, 100]}
        highlightOnHover
        pointerOnHover
        progressPending={status === "loading"}
        progressComponent={
          <div style={{ 
            padding: "40px",
            textAlign: "center",
            background: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
          }}>
            <Loader color={colorScheme === "dark" ? "#69F0AE" : "#00695C"} size="lg" />
            <div style={{ 
              marginTop: "16px",
              color: colorScheme === "dark" ? "#E0E0E0" : "#37474F",
              fontSize: "14px",
              fontWeight: "500"
            }}>
              Loading Records...
            </div>
          </div>
        }
        sortIcon={<ArrowNarrowDown size={16} />}
        theme={colorScheme === "dark" ? "dark" : "light"}
        customStyles={{
          table: {
            style: {
              backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: colorScheme === "dark" 
                ? "0 10px 20px rgba(0, 0, 0, 0.5)" 
                : "0 10px 20px rgba(0, 200, 83, 0.1)",
              width: "100%",
              maxWidth: "100%",
            },
          },
          headRow: {
            style: {
              backgroundColor: colorScheme === "dark" ? "#004D40" : "#00695C",
              color: "#FFFFFF !important",
              fontWeight: "600",
              fontSize: "16px",
              minHeight: "64px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              position: "sticky",
              top: 0,
              zIndex: 1000,
              borderBottom: "2px solid #E8F5E9",
              textAlign: "center",
            },
          },
          headCells: {
            style: {
              padding: "16px 12px",
              color: "#FFFFFF !important",
              fontSize: "15px",
              fontWeight: "600",
              justifyContent: "center",
              textAlign: "center",
            },
          },
          rows: {
            style: {
              fontSize: "15px",
              backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
              "&:nth-of-type(odd)": {
                backgroundColor: colorScheme === "dark" ? "#262626" : "#F5FBF8",
              },
              minHeight: "60px",
              borderBottom: colorScheme === "dark" 
                ? "1px solid #2C2C2C"
                : "1px solid #E8F5E9",
            },
          },
          cells: {
            style: {
              padding: "16px 12px",
              color: colorScheme === "dark" ? "#E0E0E0" : "#37474F",
              fontSize: "15px",
              lineHeight: "1.5",
              justifyContent: "center",
              textAlign: "center",
            },
          },
        }}
        responsive
        dense
        fixedHeader
        fixedHeaderScrollHeight="calc(100vh - 300px)"
        persistTableHead
        noDataComponent={
          <div style={{ 
            padding: "40px",
            textAlign: "center",
            color: colorScheme === "dark" ? "#E0E0E0" : "#37474F",
            fontSize: "14px",
            fontWeight: "500",
            background: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
          }}>
            No records found
          </div>
        }
      />

      <QRCodeModal
        opened={qrOpened}
        onClose={() => setQROpened(false)}
        value={qrValue}
        label="Resident QR Code"
      />

      {/* View User Modals */}
      <Modal
        opened={viewUserOpened}
        onClose={() => setViewUserOpened(false)}
        title={`Resident's Profile #${selectedResidentData?.id}`}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Box
            sx={{
              width: 230,
              height: 230,
              borderRadius: 10,
              overflow: 'hidden',
              border: '2px solid #2E7D32',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Image
              width={230}
              height={230}
              src={selectedResidentData?.image ? 
                (selectedResidentData.image.startsWith('http') ? 
                  selectedResidentData.image : 
                  `http://${window.location.hostname}:5001${selectedResidentData.image}`
                ) : 
                defaultImage
              }
              onError={(e) => {
                console.error('Image failed to load:', e);
                e.target.src = defaultImage;
              }}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%'
              }}
            />
          </Box>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Text size="sm">Name :</Text>
          <Space w="sm" />
          <Text size="md">
            {selectedResidentData?.firstname}{" "}
            {`${selectedResidentData?.middlename?.slice(0, 1)}.`}{" "}
            {selectedResidentData?.lastname}{" "}
            {`${selectedResidentData?.suffix ? selectedResidentData?.suffix : ""
              }`}
          </Text>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Text size="sm">Sex :</Text>
          <Space w="sm" />
          <Text size="md">{selectedResidentData?.sex}</Text>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Text size="sm">Birth :</Text>
          <Space w="sm" />
          <Text size="md">
            On {dayjs(selectedResidentData?.birthdate).format("MMMM D, YYYY")} at{" "}
            {selectedResidentData?.birthplace}
          </Text>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Text size="sm">Address :</Text>
          <Space w="sm" />
          <Text size="md">
            {selectedResidentData?.address?.split(", ")[0]},{" "}
            {selectedResidentData?.address?.split(", ")[1]}
          </Text>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Text size="sm">Name of Parents :</Text>
          <Space w="sm" />
          <Text size="md">
            {selectedResidentData?.parentsname
              ? selectedResidentData?.parentsname
              : "None"}
          </Text>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Text size="sm">Name of Siblings :</Text>
          <Space w="sm" />
          <Text size="md">
            {selectedResidentData?.siblingsname
              ? selectedResidentData?.siblingsname
              : "None"}
          </Text>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Text size="sm">Occupation :</Text>
          <Space w="sm" />
          <Text size="md">{selectedResidentData?.occupation}</Text>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Text size="sm">Civil Status :</Text>
          <Space w="sm" />
          <Text size="md">{selectedResidentData?.civilstatus}</Text>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Text size="sm">Citizenship :</Text>
          <Space w="sm" />
          <Text size="md">{selectedResidentData?.citizenship}</Text>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Text size="sm">PWD :</Text>
          <Space w="sm" />
          <Text size="md">{selectedResidentData?.PWD ? "Yes" : "No"}</Text>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Text size="sm">4P's :</Text>
          <Space w="sm" />
          <Text size="md">
            {selectedResidentData?.fourpsmember ? "Yes" : "No"}
          </Text>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Text size="sm">Reg. Voter :</Text>
          <Space w="sm" />
          <Text size="md">
            {selectedResidentData?.registervoter ? "Yes" : "No"}
          </Text>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Text size="sm">Occupancy Status :</Text>
          <Space w="sm" />
          <Text size="md">{selectedResidentData?.occupancystatus}</Text>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        opened={editProfileOpened}
        onClose={() => setEditProfileOpened(false)}
        title="Update Resident's profile"
      >
        <div className={classes.group}>
          <TextInput
            className={classes.textinputs}
            label="First Name"
            name="firstname"
            value={selectedResidentUpdate?.firstname}
            radius="sm"
            disabled
          />
          <TextInput
            className={classes.textinputs}
            label="Middle Name"
            name="middlename"
            value={selectedResidentUpdate?.middlename}
            placeholder="Input the middlename"
            radius="sm"
            disabled
          />
        </div>
        <div className={classes.group}>
          <TextInput
            className={classes.textinputs}
            label="lastname"
            name="lastname"
            value={selectedResidentUpdate?.lastname}
            radius="sm"
            disabled
          />
          <TextInput
            className={classes.textinputs}
            label="Suffix"
            name="suffix"
            value={selectedResidentUpdate?.suffix || ''}
            radius="sm"
            disabled
          />
        </div>
        <div className={classes.group}>
          <NativeSelect
            className={classes.textinputs}
            data={areas}
            value={updateAddress || selectedResidentUpdate?.address}
            placeholder={selectedResidentUpdate?.address}
            radius="sm"
            label="Select the area"
            onChange={(e) => setupdateAddress(e.currentTarget.value)}
          />

          <TextInput
            className={classes.textinputs}
            label="Date of Birth"
            radius="sm"
            value={updateBirthdate || selectedResidentUpdate?.birthdate}
            placeholder={selectedResidentUpdate?.birthdate}
            name="birthdate"
            onChange={(e) => setupdateBirthdate(e.currentTarget.value)}
          />
        </div>
        <div className={classes.group}>
          <TextInput
            className={classes.textinputs}
            label="Place of Birth"
            value={updateBirthplace || selectedResidentUpdate?.birthplace}
            placeholder={selectedResidentUpdate?.birthplace}
            name="birthplace"
            radius="sm"
            onChange={(e) => setupdateBirthplace(e.currentTarget.value)}
          />
          <NativeSelect
            className={classes.textinputs}
            value={updateSex || selectedResidentUpdate?.sex}
            placeholder={selectedResidentUpdate?.sex}
            data={sexdata}
            label="Sex"
            radius="sm"
            onChange={(e) => setupdateSex(e.currentTarget.value)}
          />
        </div>
        <div className={classes.group}>
          <NativeSelect
            className={classes.textinputs}
            data={civilStatus}
            value={updateCivilStatus || selectedResidentUpdate?.civilstatus}
            placeholder={selectedResidentUpdate?.civilstatus}
            radius="sm"
            label="Civil Status"
            onChange={(e) => setupdateCivilStatus(e.currentTarget.value)}
          />
          <TextInput
            className={classes.textinputs}
            name="parentsname"
            label="Name of Parents"
            value={updateParentsname || selectedResidentUpdate?.parentsname}
            placeholder={selectedResidentUpdate?.parentsname}
            radius="sm"
            onChange={(e) => setupdateParentsname(e.currentTarget.value)}
          />
        </div>
        <div className={classes.group}>
          <TextInput
            className={classes.textinputs}
            name="siblingsname"
            label="Name of Siblings"
            value={updateSiblingsname || selectedResidentUpdate?.siblingsname}
            placeholder={selectedResidentUpdate?.siblingsname}
            radius="sm"
            onChange={(e) => setupdateSiblingsname(e.currentTarget.value)}
          />
          <TextInput
            className={classes.textinputs}
            name="citizenship"
            label="Citizenship"
            value={updateCitizenship || selectedResidentUpdate?.citizenship}
            placeholder={selectedResidentUpdate?.citizenship}
            radius="sm"
            onChange={(e) => setupdateCitizenship(e.currentTarget.value)}
          />
        </div>
        <div className={classes.group}>
          <TextInput
            className={classes.textinputs}
            name="occupation"
            label="Occupation"
            value={updateOccupation || selectedResidentUpdate?.occupation}
            placeholder={selectedResidentUpdate?.occupation}
            radius="sm"
            onChange={(e) => setupdateOccupation(e.currentTarget.value)}
          />
          <NativeSelect
            className={classes.textinputs}
            data={selection}
            value={updatePWD}
            placeholder={selectedResidentUpdate?.PWD ? "Yes" : "No"}
            radius="sm"
            label="PWD"
            onChange={(e) => setupdatePWD(e.currentTarget.value)}
          />
        </div>
        <div className={classes.group}>
          <NativeSelect
            className={classes.textinputs}
            data={selection}
            value={updatefourpsmember}
            placeholder={selectedResidentUpdate?.fourpsmember ? "Yes" : "No"}
            radius="sm"
            label="4P's"
            onChange={(e) => setupdatefourpsmember(e.currentTarget.value)}
          />
          <NativeSelect
            className={classes.textinputs}
            data={selection}
            value={updateregistervoter}
            placeholder={selectedResidentUpdate?.registervoter ? "Yes" : "No"}
            radius="sm"
            label="Register Voter"
            onChange={(e) => setupdateregistervoter(e.currentTarget.value)}
          />
          <NativeSelect
            className={classes.textinputs}
            data={housestatus}
            value={updateoccupancystatus || selectedResidentUpdate?.occupancystatus}
            placeholder={selectedResidentUpdate?.occupancystatus}
            radius="sm"
            label="Housing Status"
            onChange={(e) => setupdateoccupancystatus(e.currentTarget.value)}
          />
        </div>
        <Button
          style={{ width: "100%" }}
          size="xs"
          type="submit"
          mt="lg"
          onClick={handleUserUpdate}
        >
          {UpdateStatus ? <Loader color="white" size="sm" /> : "Update"}
        </Button>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        opened={deleteUserModal}
        onClose={() => setDeleteUserModal(false)}
        title="Are you sure to delete this resident?"
        centered
      >
        <Text align="center" color="yellow" size="sm">
          You won't be able to recover any of these data. Careful now.
        </Text>
        <Group position="apart" mt="md">
          <Button
            radius="md"
            style={{ width: "100%", flex: 6 }}
            color="red"
            onClick={() => handleUserDelete()}
          >
            Yes
          </Button>
          <Button
            radius="md"
            style={{ width: "100%", flex: 6 }}
            color="blue"
            onClick={() => setDeleteUserModal(false)}
          >
            No
          </Button>
        </Group>
      </Modal>
    </Paper>
  );
};

export default Masterlist;
