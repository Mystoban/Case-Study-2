import React, { useState, useLayoutEffect } from 'react'
import {
  createStyles,
  Group,
  Paper,
  Button,
  Tooltip,
  NativeSelect,
  TextInput,
  Title,
  Badge,
  LoadingOverlay,
} from "@mantine/core";
import { DatePicker } from '@mantine/dates';
import {
  Logs, months,
} from "../config/dummyData";
import { showNotification } from "@mantine/notifications";
import DataTable from "react-data-table-component";
import {
  ArrowNarrowDown,
  Search,
} from "tabler-icons-react";
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { GetAllRecords } from '../redux/apiCalls';

const useStyles = createStyles((theme) => ({
  container: {
    fontFamily: "Regular",
    width: "100%",
    height: "fit-content",
    padding: theme.spacing.xl,
    background: theme.colorScheme === "dark" ? "#1A1B1E" : theme.white,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadows.sm,
  },
  header: {
    backgroundColor: theme.colorScheme === "dark" ? "#2C2E33" : theme.colors.gray[0],
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,
  },
  searchInput: {
    width: 250,
  },
  filterGroup: {
    display: "flex",
    gap: theme.spacing.sm,
    alignItems: "flex-end",
    flexWrap: "wrap",
  },
  totalPayments: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0],
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    borderRadius: theme.radius.md,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  }
}));

// Custom styles for DataTable
const getCustomStyles = (colorScheme) => ({
  table: {
    style: {
      backgroundColor: colorScheme === 'dark' ? '#23272e' : '#fff',
      borderRadius: '8px',
      boxShadow: colorScheme === 'dark' ? '0 2px 8px #1114' : '0 2px 8px #0001',
    },
  },
  header: {
    style: {
      fontSize: '20px',
      fontWeight: 600,
      paddingLeft: '16px',
      paddingRight: '16px',
      marginTop: '16px',
      backgroundColor: 'transparent',
      color: colorScheme === 'dark' ? '#fff' : '#23272e',
    },
  },
  headRow: {
    style: {
      backgroundColor: colorScheme === 'dark' ? '#2d3748' : '#e3e8ee',
      minHeight: '52px',
      borderRadius: '8px 8px 0 0',
    },
  },
  headCells: {
    style: {
      fontSize: '14px',
      fontWeight: 700,
      color: colorScheme === 'dark' ? '#e0e0e0' : '#23272e',
      paddingLeft: '16px',
      paddingRight: '16px',
      letterSpacing: '0.5px',
    },
  },
  rows: {
    style: {
      fontSize: '14px',
      fontWeight: 400,
      color: colorScheme === 'dark' ? '#e0e0e0' : '#23272e',
      minHeight: '48px',
      backgroundColor: colorScheme === 'dark' ? '#23272e' : '#fff',
      borderBottom: `1px solid ${colorScheme === 'dark' ? '#374151' : '#e3e8ee'}`,
    },
    highlightOnHoverStyle: {
      backgroundColor: colorScheme === 'dark' ? '#374151' : '#f1f5f9',
      transitionDuration: '0.15s',
      transitionProperty: 'background-color',
      borderRadius: '4px',
      outlineStyle: 'solid',
      outlineWidth: '1px',
      outlineColor: colorScheme === 'dark' ? '#4b5563' : '#e3e8ee',
    },
  },
  cells: {
    style: {
      paddingLeft: '16px',
      paddingRight: '16px',
      color: colorScheme === 'dark' ? '#e0e0e0' : '#23272e',
    },
  },
  pagination: {
    style: {
      borderTop: 'none',
      marginTop: '16px',
      backgroundColor: 'transparent',
      color: colorScheme === 'dark' ? '#e0e0e0' : '#23272e',
    },
  },
});

// Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
function convertArrayOfObjectsToCSV(array) {
  let result;

  const columnDelimiter = ',';
  const lineDelimiter = '\n';
  const keys = ['clientname', 'lettername', 'staffname', 'kagawadname', 'letterprice', 'createdAt'];

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  array.forEach(item => {
    let ctr = 0;
    keys.forEach(key => {
      if (ctr > 0) result += columnDelimiter;

      let value = item[key];
      if (key === 'createdAt') {
        value = dayjs(value).format("MMM D, YYYY");
      } else if (key === 'letterprice') {
        value = `₱${value}`;
      }
      
      result += value;
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
}

// Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
function downloadCSV(array) {
  const link = document.createElement('a');
  let csv = convertArrayOfObjectsToCSV(array);
  if (csv == null) return;

  const filename = `brgy-transaction-records-${dayjs(new Date()).format("MM/DD/YYYY")}.csv`;

  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }

  link.setAttribute('href', encodeURI(csv));
  link.setAttribute('download', filename);
  link.click();
}

const Export = ({ onExport }) => <Button onClick={e => onExport(e.target.value)}>Export Record as CSV</Button>;

const columns = [
  {
    name: "Resident",
    selector: (row) => row.clientname || '',
    sortable: true,
    cell: (row) => (
      <div style={{ fontWeight: 500 }}>{row.clientname || 'N/A'}</div>
    ),
  },
  {
    name: "Document Type",
    selector: (row) => row.lettername || '',
    sortable: true,
    cell: (row) => (
      <Badge
        color="green"
        variant="light"
        size="lg"
        radius="sm"
      >
        {row.lettername || 'N/A'}
      </Badge>
    ),
  },
  {
    name: "Clerk on Duty",
    selector: (row) => row.staffname || '',
    sortable: true,
    cell: (row) => row.staffname || 'N/A',
  },
  {
    name: "Kagawad on Duty",
    selector: (row) => row.kagawadname || '',
    sortable: true,
    cell: (row) => row.kagawadname || 'N/A',
  },
  {
    name: "Payment",
    selector: (row) => row.letterprice || 0,
    sortable: true,
    cell: (row) => (
      <div style={{ fontWeight: 500 }}>₱ {row.letterprice || 0}</div>
    ),
  },
  {
    name: "Issued On",
    selector: (row) => row.createdAt || '',
    sortable: true,
    cell: (row) => row.createdAt ? dayjs(row.createdAt).format("MMM D, YYYY") : 'N/A',
  },
];

const Report = ({ colorScheme }) => {
  const { classes } = useStyles();
  const records = useSelector((state) => {
    console.log('Redux State:', state);
    return state.recordData?.records || [];
  });
  const isLoading = useSelector((state) => state.recordData?.isLoading);
  const error = useSelector((state) => state.recordData?.error);
  const user = useSelector((state) => state.user?.currentUser);
  const token = useSelector((state) => state.user?.token);
  const loginStatus = useSelector((state) => state.user?.loginStatus);
  const dispatch = useDispatch();
  const [filterText, setFilterText] = useState("");
  const [filterByDate, setFilterByDate] = useState("");
  const [filterByMonth, setFilterByMonth] = useState("NA");
  const [filterByYear, setFilterByYear] = useState("");

  useLayoutEffect(() => {
    const fetchRecords = async () => {
      try {
        if (!loginStatus || !token) {
          showNotification({
            title: "Authentication Required",
            message: "Please log in to view records",
            color: "red"
          });
          return;
        }

        await GetAllRecords(dispatch, showNotification);
      } catch (error) {
        console.error('Error in fetchRecords:', error);
        showNotification({
          title: "Error",
          message: "Failed to fetch records. Please try again.",
          color: "red"
        });
      }
    };

    fetchRecords();
  }, [dispatch, loginStatus, token]);

  const filteredItems = React.useMemo(() => {
    console.log('Records before filtering:', records);
    if (!records || records.length === 0) {
      console.log('No records to filter');
      return [];
    }

    const filtered = records.filter((item) => {
      if (!item) {
        console.log('Found null/undefined item');
        return false;
      }

      // If no filters are active, show all records
      const hasActiveFilters = filterText || filterByDate || filterByYear || (filterByMonth && filterByMonth !== "NA");
      if (!hasActiveFilters) {
        console.log('No active filters, showing all records');
        return true;
      }

      // Text search filter
      if (filterText) {
        const searchText = filterText.toLowerCase();
        const matchesSearch = 
          (item.clientname?.toLowerCase().includes(searchText)) ||
          (item.lettername?.toLowerCase().includes(searchText)) ||
          (item.staffname?.toLowerCase().includes(searchText)) ||
          (item.kagawadname?.toLowerCase().includes(searchText));
        
        if (!matchesSearch) {
          console.log('Item filtered out by text search:', item);
          return false;
        }
      }

      // Date filter
      if (filterByDate) {
        const itemDate = dayjs(item.createdAt).format("YYYY-MM-DD");
        const filterDate = dayjs(filterByDate).format("YYYY-MM-DD");
        if (itemDate !== filterDate) {
          console.log('Item filtered out by date:', item);
          return false;
        }
      }
      
      // Year and Month filters
      if (filterByYear) {
        const itemYear = dayjs(item.createdAt).format("YYYY");
        if (itemYear !== filterByYear) {
          console.log('Item filtered out by year:', item);
          return false;
        }

        if (filterByMonth && filterByMonth !== "NA") {
          const itemMonth = dayjs(item.createdAt).format("MMM").toLowerCase();
          const filterMonth = filterByMonth.toLowerCase();
          if (itemMonth !== filterMonth) {
            console.log('Item filtered out by month:', item);
            return false;
          }
        }
      } else if (filterByMonth && filterByMonth !== "NA") {
        const itemMonth = dayjs(item.createdAt).format("MMM").toLowerCase();
        const filterMonth = filterByMonth.toLowerCase();
        if (itemMonth !== filterMonth) {
          console.log('Item filtered out by month:', item);
          return false;
        }
      }

      console.log('Item passed all filters:', item);
      return true;
    });

    console.log('Filtered items:', filtered);
    return filtered;
  }, [records, filterText, filterByDate, filterByMonth, filterByYear]);

  console.log('Final filtered items:', filteredItems);

  return (
    <Paper className={classes.container}>
      <LoadingOverlay visible={isLoading} />
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem', padding: '1rem', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          Error: {error}
        </div>
      )}
      <div className={classes.header}>
        <Group position="apart" mb="lg">
          <Title order={2}>Transaction Records</Title>
          <div className={classes.totalPayments}>
            <Title order={4}>Total Payments: ₱ {filteredItems?.reduce((total, item) => total + (item?.letterprice || 0), 0).toLocaleString()}</Title>
          </div>
        </Group>

        <div className={classes.filterGroup}>
          <TextInput
            icon={<Search size={16} />}
            placeholder="Search records..."
            className={classes.searchInput}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <DatePicker
            placeholder="Filter by date"
            label="Date"
            clearable
            value={filterByDate}
            onChange={setFilterByDate}
          />
          <NativeSelect
            data={months}
            label="Month"
            value={filterByMonth}
            onChange={(e) => setFilterByMonth(e.currentTarget.value)}
          />
          <TextInput
            label="Year"
            placeholder="YYYY"
            value={filterByYear}
            onChange={(e) => setFilterByYear(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredItems}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30, 50]}
        highlightOnHover
        pointerOnHover
        progressPending={isLoading}
        sortIcon={<ArrowNarrowDown size={16} />}
        theme={colorScheme === "dark" ? "dark" : "light"}
        customStyles={getCustomStyles(colorScheme)}
        responsive
        persistTableHead
        actions={<Export onExport={() => downloadCSV(filteredItems)} />}
        noDataComponent={
          <div style={{ 
            padding: "40px",
            textAlign: "center",
            color: colorScheme === "dark" ? "#E0E0E0" : "#37474F",
            fontSize: "14px",
            fontWeight: "500"
          }}>
            {isLoading ? "Loading records..." : "No records found"}
          </div>
        }
      />
    </Paper>
  );
};

export default Report