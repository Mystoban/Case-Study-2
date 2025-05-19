import React, { useState } from "react";
import { showNotification } from "@mantine/notifications";
import {
  addResidentStart,
  addResidentSuccess,
  addResidentsFailed,
} from "../redux/MasterlistRedux";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { userRequest } from "../RequestMethod";
import { DatePicker } from "@mantine/dates";

import {
  Container,
  TextInput,
  NativeSelect,
  Button,
  createStyles,
  Text,
  Loader,
} from "@mantine/core";
import { FileUpload } from "tabler-icons-react";
import {
  sexdata,
  civilStatus,
  selection,
  housestatus,
  areas
} from "./Data";

const useStyles = createStyles((theme) => ({
  formcontainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
}));

const RegisterForm = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const [ImageNotifyValidator, setImageNotifyValidator] = useState(false);
  const [ImageFile, setImageFile] = useState(null);
  const [Imagename, setImagename] = useState("");
  const [InputValidator, setInputValidator] = useState(false);
  const [Form, setForm] = useState({});
  const [Loadingstate, setLoadingstate] = useState(false);

  const AllFunction = (e) => {
    const names = e.currentTarget.name;
    const values = e.currentTarget.value;
    setForm({ ...Form, [names]: values });
  };

  const [address, setaddress] = useState("Purok 1, Sitio 1");
  const [birthdate, setbirthdate] = useState("");
  const [sex, setsex] = useState("Male");
  const [civilstatus, setcivilstatus] = useState("Single");
  const [PWD, setPWD] = useState("Yes");
  const [fourpsmember, setfourpsmember] = useState("Yes");
  const [registervoter, setregistervoter] = useState("Yes");
  const [occupancystatus, setoccupancystatus] = useState("House Owner");

  const HandleImage = (e) => {
    if (!e.target.files[0]) {
      ImageNotifyValidator && setImageNotifyValidator(true);
      ImageFile && setImageFile(ImageFile);
    } else {
      if (e.target.files[0].type === "image/jpeg" || e.target.files[0].type === "image/png") {
        setImageFile(e.target.files[0]);
        setImagename(e.target.files[0].name);
        setImageNotifyValidator(false);
        setInputValidator(true);
      } else {
        showNotification({
          title: "Not Image Type",
          message: "You inputted a non-image type! 🤥",
        });
        setImageFile(null);
        setImageNotifyValidator(true);
        setImagename("Not an image type!");
        setInputValidator(true);
      }
    }
  };

  const HandleRegister = async () => {
    setLoadingstate(true);
    if (
      (Form,
      address,
      sex,
      civilstatus,
      PWD,
      fourpsmember,
      registervoter,
      birthdate,
      occupancystatus)
    ) {
      if (ImageFile) {
        // Convert image to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Image = reader.result;
          const inputs = {
            ...Form,
            image: base64Image,
            birthdate: dayjs(birthdate).format("MMM D, YYYY"),
            address,
            sex,
            civilstatus,
            PWD: PWD === "Yes",
            fourpsmember: fourpsmember === "Yes",
            registervoter: registervoter === "Yes",
            occupancystatus,
            residentId: Date.now(),
          };
          try {
            await userRequest.post("/residents", inputs);
            showNotification({
              title: "Success",
              message: "Resident registered successfully!",
            });
            setLoadingstate(false);
          } catch (error) {
            showNotification({
              title: "Error",
              message: error.response?.data?.message || "Failed to register resident",
            });
            setLoadingstate(false);
          }
        };
        reader.readAsDataURL(ImageFile);
      } else {
        showNotification({
          title: "Image Required",
          message: "Please upload an image.",
        });
        setLoadingstate(false);
      }
    } else {
      showNotification({
        title: "Missing Fields",
        message: "Please fill in all required fields.",
      });
      setLoadingstate(false);
    }
  };

  return (
    <Container fluid="true" className={classes.formcontainer}>
      <Container className={classes.inputimage}>
        <label htmlFor="profilepic" className={classes.label}>
          <FileUpload size={28} strokeWidth={2} />
          <Text>
            {InputValidator ? `${Imagename}` : "Please select an image"}
          </Text>
        </label>
        <input
          type="file"
          id="profilepic"
          onChange={HandleImage}
          accept="image/jpg"
          className={classes.hidden}
        ></input>
      </Container>
      <div className={classes.group}>
        <TextInput
          className={classes.textinputs}
          label="First Name"
          name="firstname"
          placeholder="Input the firstname"
          radius="sm"
          onChange={AllFunction}
        />
        <TextInput
          className={classes.textinputs}
          label="Middle Name"
          name="middlename"
          placeholder="Input the middlename"
          radius="sm"
          onChange={AllFunction}
        />
      </div>
      <div className={classes.group}>
        <TextInput
          className={classes.textinputs}
          label="Last Name"
          name="lastname"
          placeholder="Input the lastname"
          radius="sm"
          onChange={AllFunction}
        />
        <TextInput
          className={classes.textinputs}
          label="Suffix"
          name="suffix"
          placeholder="Input the suffix"
          radius="sm"
          onChange={AllFunction}
        />
      </div>
      <div className={classes.group}>
        <TextInput
          className={classes.textinputs}
          label="Full Name"
          name="fullname"
          placeholder="Input the fullname"
          radius="sm"
          onChange={AllFunction}
        />
        <NativeSelect
          className={classes.textinputs}
          data={areas}
          value={address}
          radius="sm"
          label="Address"
          onChange={(e) => setaddress(e.currentTarget.value)}
        />
      </div>
      <div className={classes.group}>
        <DatePicker
          className={classes.textinputs}
          placeholder="Input the date of birth"
          label="Date of Birth"
          onChange={setbirthdate}
        />
        <TextInput
          className={classes.textinputs}
          label="Place of Birth"
          name="birthplace"
          placeholder="Input the birthplace"
          radius="sm"
          onChange={AllFunction}
        />
      </div>
      <div className={classes.group}>
        <NativeSelect
          className={classes.textinputs}
          value={sex}
          data={sexdata}
          label="Sex"
          radius="sm"
          onChange={(event) => setsex(event.currentTarget.value)}
        />

        <NativeSelect
          className={classes.textinputs}
          data={civilStatus}
          value={civilstatus}
          radius="sm"
          label="Civil Status"
          onChange={(event) => setcivilstatus(event.currentTarget.value)}
        />
      </div>
      <div className={classes.group}>
        <TextInput
          className={classes.textinputs}
          name="parentsname"
          label="Name of Parents"
          placeholder="Input the name of the parents"
          radius="sm"
          onChange={AllFunction}
        />
        <TextInput
          className={classes.textinputs}
          name="siblingsname"
          label="Name of Siblings"
          placeholder="Input the name of siblings"
          radius="sm"
          onChange={AllFunction}
        />
      </div>
      <div className={classes.group}>
        <TextInput
          className={classes.textinputs}
          name="citizenship"
          label="Citizenship"
          placeholder="Input the citizenship"
          radius="sm"
          onChange={AllFunction}
        />
        <TextInput
          className={classes.textinputs}
          name="occupation"
          label="Occupation"
          placeholder="Input the occupation"
          radius="sm"
          onChange={AllFunction}
        />
      </div>
      <div className={classes.group}>
        <NativeSelect
          className={classes.textinputs}
          data={selection}
          value={PWD}
          radius="sm"
          label="PWD"
          onChange={(event) => setPWD(event.currentTarget.value)}
        />
        <NativeSelect
          className={classes.textinputs}
          data={selection}
          value={fourpsmember}
          radius="sm"
          label="4P's"
          onChange={(event) => setfourpsmember(event.currentTarget.value)}
        />
      </div>
      <div className={classes.group}>
        <NativeSelect
          className={classes.textinputs}
          data={selection}
          value={registervoter}
          radius="sm"
          label="Register Voter"
          onChange={(event) => setregistervoter(event.currentTarget.value)}
        />
        <NativeSelect
          className={classes.textinputs}
          data={housestatus}
          value={occupancystatus}
          radius="sm"
          label="Housing Status"
          onChange={(event) => setoccupancystatus(event.currentTarget.value)}
        />
      </div>
      <Button
        onClick={HandleRegister}
        className={classes.registerbutton}
        variant="filled"
      >
        {Loadingstate ? <Loader size="sm" /> : "Register"}
      </Button>
    </Container>
  );
};

export default RegisterForm;
