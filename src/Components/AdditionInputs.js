import React, { useState } from "react";
import {
  TextInput,
  createStyles,
  Button,
  Divider,
  Container,
  NumberInput,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { publicRequest } from "../RequestMethod";
import { RecordAdd } from "../redux/RecordRedux";
import { useDispatch } from "react-redux";

const useStyles = createStyles((theme) => ({
  textinputs: {
    width: "90%",
    margin: `0 ${theme.spacing.xxs}px`,
  },
  registerbutton: {
    marginTop: `${theme.spacing.lg}px`,
  },
  borderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
}));

const AdditionInputs = ({ clientname, lettername }) => {
  const [letterprice, setPrice] = useState(0);
  const [Form, setForm] = useState({
    staffname: '',
    kagawadname: ''
  });
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const AllFunction = (e) => {
    const nameForm = e.target.name;
    const valueForm = e.currentTarget.value;
    setForm({ ...Form, [nameForm]: valueForm });
  };

  const validateForm = () => {
    if (!clientname) {
      showNotification({
        title: "No Client Name!",
        message: "You forgot to input client name",
        color: "red"
      });
      return false;
    }
    if (!Form.staffname || !Form.kagawadname) {
      showNotification({
        title: "Missing Information",
        message: "Please fill in all required fields",
        color: "red"
      });
      return false;
    }
    if (!letterprice || letterprice <= 0) {
      showNotification({
        title: "Invalid Price",
        message: "Please enter a valid price",
        color: "red"
      });
      return false;
    }
    return true;
  };

  const HandleButton = async () => {
    if (!validateForm()) return;

    const input = {
      clientname,
      lettername,
      letterprice: Number(letterprice),
      staffname: Form.staffname,
      kagawadname: Form.kagawadname,
      type: 'certificate',
      purpose: lettername
    };

    try {
      const res = await publicRequest.post("/records", input);
      if (res.data) {
        dispatch(RecordAdd(res.data));
        showNotification({
          title: "Success!",
          message: "The transaction was recorded in report logs",
          color: "green"
        });
        
        // Reset form
        setPrice(0);
        setForm({
          staffname: '',
          kagawadname: ''
        });
      }
    } catch (error) {
      console.error('Error creating record:', error.response?.data || error);
      showNotification({
        title: "Error!",
        message: error.response?.data?.message || "Failed to create record",
        color: "red"
      });
    }
  };

  return (
    <Container fluid="true" className={classes.borderContainer}>
      <Divider
        my="xs"
        color="blue"
        label="PLEASE FILL THIS ONE BEFORE PRINTING FOR LOGGING PURPOSES"
        labelPosition="center"
        mt={25}
        mb={20}
      />
      <TextInput
        className={classes.textinputs}
        label="Clerk on Duty"
        name="staffname"
        placeholder="Clerk Name"
        radius="sm"
        required
        value={Form.staffname}
        onChange={AllFunction}
      />
      <NumberInput
        className={classes.textinputs}
        label="Price"
        name="letterprice"
        placeholder="Document Price"
        radius="sm"
        required
        value={letterprice}
        min={0}
        onChange={(val) => setPrice(val)}
      />
      <TextInput
        className={classes.textinputs}
        label="Kagawad on Duty"
        name="kagawadname"
        placeholder="Kagawad Name"
        radius="sm"
        required
        value={Form.kagawadname}
        onChange={AllFunction}
      />
      <Button
        onClick={HandleButton}
        className={classes.registerbutton}
        variant="filled"
      >
        Record on logs
      </Button>
    </Container>
  );
};

export default AdditionInputs;
