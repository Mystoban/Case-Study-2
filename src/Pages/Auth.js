import React, { useState } from "react";
import {
  Container,
  createStyles,
  Group,
  Text,
  TextInput,
  ActionIcon,
  Button,
  Loader,
  Box,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Logo } from "../Components";
import { EyeOff, Eye } from "tabler-icons-react";
import { publicRequest } from "../RequestMethod";
import { LoginUser } from "../redux/UserRedux";
import { useDispatch } from "react-redux";

const useStyles = createStyles((theme) => ({
  root: {
    height: '100vh',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    paddingTop: '60px',
  },
  videoBackground: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    minWidth: '100%',
    minHeight: '100%',
    width: 'auto',
    height: 'auto',
    transform: 'translateX(-50%) translateY(-50%)',
    zIndex: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1,
  },
  contentContainer: {
    position: 'relative',
    zIndex: 2,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    background: theme.colorScheme === "dark"
      ? 'rgba(37, 38, 43, 0.95)'
      : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    height: 'auto',
    width: "400px",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl * 1.5,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",

    [theme.fn.smallerThan("sm")]: {
      width: "90%",
      padding: theme.spacing.md,
    },
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: theme.colorScheme === "dark" ? theme.white : theme.colors.dark[7],
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  inputs: {
    width: "100%",
    marginBottom: theme.spacing.md,
    
    '& input': {
      backgroundColor: theme.colorScheme === "dark" 
        ? "#25262B"
        : theme.white,
      border: `1px solid ${
        theme.colorScheme === "dark"
          ? "#2C2E33"
          : theme.colors.gray[3]
      }`,
      borderRadius: theme.radius.sm,
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
      
      '&:focus': {
        borderColor: theme.colorScheme === "dark" ? "#4CAF50" : "#2E7D32",
      },

      '&::placeholder': {
        color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[5],
      },
    },

    '& label': {
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.dark[7],
    },
  },
  button: {
    background: theme.colorScheme === "dark" ? "#4CAF50" : "#2E7D32",
    color: theme.white,
    marginTop: theme.spacing.xl,
    width: "100%",
    height: 42,
    
    '&:hover': {
      background: theme.colorScheme === "dark" ? "#43A047" : "#1B5E20",
    },
  },
}));

const Auth = () => {
  const { classes } = useStyles();
  const [showPassword, setshowPassword] = useState(false);
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const dispatch = useDispatch();
  const [Loadingstate, setLoadingstate] = useState(false);

  const HandleLogin = () => {
    setLoadingstate(true);
    if (username && password) {
      const Login = async () => {
        try {
          console.log('Attempting login with:', { username, password });
          const res = await publicRequest.post('/auth/login', {
            username,
            password
          });
          console.log('Login response:', res.data);
          
          if (!res.data || !res.data.token || !res.data.user) {
            throw new Error('Invalid response from server');
          }

          localStorage.setItem('token', res.data.token);
          console.log('Token stored in localStorage');
          
          const storedToken = localStorage.getItem('token');
          if (!storedToken) {
            throw new Error('Failed to store token');
          }
          
          dispatch(LoginUser({
            ...res.data.user,
            token: res.data.token
          }));

          setLoadingstate(false);
          
          showNotification({
            title: "Success",
            message: "Login successful!",
            color: "green"
          });
        } catch (err) {
          console.error('Login error:', err);
          console.error('Error details:', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status
          });
          
          localStorage.removeItem('token');
          
          setLoadingstate(false);
          showNotification({
            title: "Error",
            message: err.response?.data?.message || err.message || "Login failed. Please try again.",
            color: "red"
          });
        }
      };
      Login();
    } else {
      setLoadingstate(false);
      showNotification({
        title: "Error",
        message: "Please enter both username and password",
        color: "red"
      });
    }
  };

  return (
    <Box className={classes.root}>
      <video
        className={classes.videoBackground}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/background_video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={classes.overlay} />
      
      <Container className={classes.contentContainer} fluid>
        <Group className={classes.form} direction="column">
          <Logo />
          <Title className={classes.title}>Welcome Back</Title>
          <Text className={classes.subtitle}>
            Sign in to continue to the dashboard
          </Text>

          <TextInput
            className={classes.inputs}
            variant="filled"
            label="Username"
            size="md"
            placeholder="Enter your username"
            onChange={(e) => setusername(e.currentTarget.value)}
          />
          
          <TextInput
            className={classes.inputs}
            rightSection={
              <ActionIcon onClick={() => setshowPassword(!showPassword)}>
                {showPassword ? (
                  <Eye size={18} strokeWidth={2} />
                ) : (
                  <EyeOff size={18} strokeWidth={2} />
                )}
              </ActionIcon>
            }
            type={showPassword ? "text" : "password"}
            variant="filled"
            label="Password"
            size="md"
            placeholder="Enter your password"
            onChange={(e) => setpassword(e.currentTarget.value)}
          />
          
          <Button
            size="md"
            radius="md"
            className={classes.button}
            onClick={HandleLogin}
          >
            {Loadingstate ? <Loader color="white" size="sm" /> : "Sign In"}
          </Button>
        </Group>
      </Container>
    </Box>
  );
};

export default Auth;
