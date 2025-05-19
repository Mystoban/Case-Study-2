import React from "react";
import {
  Header,
  Container,
  Avatar,
  MediaQuery,
  createStyles,
  Group,
  useMantineTheme,
  ActionIcon,
  Input,
  Button,
  Menu,
} from "@mantine/core";
import {
  Menu2,
  Search,
  AdjustmentsHorizontal,
  Settings,
  Logout,
  User,
} from "tabler-icons-react";
import { useFocusWithin, useDisclosure, useViewportSize } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { ShowNavbar, HideNavbar } from "../redux/NavbarRedux";
import ColorScheme from "./ColorScheme";
import Logo from "./Logo";
import { LogoutUser } from "../redux/UserRedux";
import { publicRequest, userRequest } from "../RequestMethod";

const useStyles = createStyles((theme) => ({
  root: {
    position: "fixed",
    zIndex: 90,
    background: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    border: "none",
    display: "flex",
    justifyContent: "space-between",
    alignContent: "center",
    padding: `0 ${theme.spacing.md}px`,
    transition: `ease-in-out 500ms`,
    boxShadow: theme.colorScheme === "dark"
      ? "0 2px 8px rgba(0, 0, 0, 0.3)"
      : "0 2px 8px rgba(46, 125, 50, 0.1)",
  },
  text: {
    fontFamily: "Bold",
    marginLeft: 11,
    color: theme.colorScheme === "dark" ? theme.white : theme.colors.dark[7],
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "85px",
    padding: "0",
    marginRight: `${theme.spacing.xl}px`,
    color: theme.colorScheme === "dark" ? theme.white : theme.colors.dark[7],
    transition: `ease-in-out 500ms`,
  },
  container: {
    display: "flex",
    height: "85px",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuToggle: {
    marginLeft: "12rem",
    color: theme.colorScheme === "dark" ? theme.white : theme.colors.dark[7],
    background: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    border: "none",
    transition: `ease-in-out 500ms`,

    "&:hover": {
      background: theme.colors.green[6],
      color: theme.white,
    },
  },
  menuToggle2: {
    color: theme.colorScheme === "dark" ? theme.white : theme.colors.dark[7],
    background: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    border: "none",
    marginRight: "1rem",
    transition: `ease-in-out 500ms`,

    "&:hover": {
      background: theme.colors.green[6],
      color: theme.white,
    },
  },
  searchbar: {
    "&:hover": {
      border: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
    },

    [theme.fn.smallerThan("md")]: {
      width: "20rem",
    },
  },
  hide: {
    display: "none",
  },
  paper: {
    height: "40px",
    marginTop: `${theme.spacing.xs}px`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
  },
  menuItem: {
    textTransform: "capitalize",
    padding: `${theme.spacing.xxs}px ${theme.spacing.xs}px`,

    "&:hover": {
      backgroundColor: theme.colors.green[1],
    },
  },
  divider: {
    color: theme.colorScheme === "dark" ? theme.white : theme.colors.dark[3],
  },
}));

const HeaderContainer = () => {
  const { classes, cx } = useStyles();
  const show = useSelector((state) => state.navbar.show);
  const { width } = useViewportSize();
  const dispatch = useDispatch();

  const ShowNavbarFunction = (condition) =>
    condition ? dispatch(ShowNavbar()) : dispatch(HideNavbar());

  return (
    <Header height={85} fixed={true} zIndex={90} className={classes.root}>
      <Group direction="row" position="left" className={classes.group}>
        <ActionIcon
          size="lg"
          variant="default"
          radius="md"
          className={cx(classes.menuToggle, {
            [classes.hide]: show && width <= 768,
          })}
          onClick={() => ShowNavbarFunction(!show)}
        >
          <Menu2 size={20} strokeWidth={2} />
        </ActionIcon>
        <Logo />
      </Group>
      <Group>
        <ColorScheme />
        <UserContainer classes={classes} dispatch={dispatch} />
      </Group>
    </Header>
  );
};

const SearchContainer = ({ classes }) => {
  const { ref, focused } = useFocusWithin();

  return (
    <MediaQuery smallerThan="sm" styles={classes.hide}>
      <Input
        icon={<Search size={14} />}
        ref={ref}
        placeholder="Search"
        sx={(theme) => ({
          border:
            theme.colorScheme === "dark"
              ? focused
                ? `1px solid ${theme.colors.dark[4]}`
                : `1px solid ${theme.colors.dark[2]}`
              : focused
              ? `1px solid ${theme.colors.gray[3]}`
              : `1px solid ${theme.colors.gray[1]}`,
          paddingRight: "3rem",
          width: "25rem",
          borderRadius: "10px",
        })}
        size="md"
        variant="unstyled"
        className={classes.searchbar}
        rightSection={
          <ActionIcon
            size="lg"
            radius="md"
            variant="default"
            className={classes.menuToggle2}
          >
            <AdjustmentsHorizontal size={20} strokeWidth={2} />
          </ActionIcon>
        }
      />
    </MediaQuery>
  );
};

const UserContainer = ({ classes, dispatch }) => {
  const admin = require("../images/admin.png");
  const [opened, handlers] = useDisclosure(false);
  const theme = useMantineTheme();

  const handleLogout = async () => {
    try {
      console.log('Attempting to logout...');
      // Use userRequest instead of publicRequest to include auth token
      await userRequest.post('/auth/logout');
      console.log('Logout successful');
      dispatch(LogoutUser());
      // Force reload the page to clear any remaining state
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if server call fails
      dispatch(LogoutUser());
      // Force reload the page to clear any remaining state
      window.location.reload();
    }
  };

  return (
    <Menu
      opened={opened}
      onOpen={handlers.open}
      onClose={handlers.close}
      control={
        <Button
          variant="default"
          sx={(theme) => ({
            background:
              theme.colorScheme === "dark"
                ? opened
                  ? theme.colors.dark[0]
                  : theme.colors.dark[2]
                : opened
                ? theme.colors.dark[0]
                : theme.colors.gray[0],
            color: opened
              ? theme.colors.gray[0]
              : theme.colors.dark[7],
            width: "100px",
            border: "none",
            transition: `ease-in-out 500ms`,

            "&:hover": {
              color: theme.colors.gray[0],
              background: theme.colors.green[6],
            },
          })}
          radius="xl"
          size="md"
          leftIcon={<Avatar src={admin} alt="admin" radius="xl" />}
          rightIcon={<Settings size={25} strokeWidth={2} />}
        ></Button>
      }
    >
      <Container className={classes.paper}>
        <Menu.Item
          className={classes.menuItem}
          icon={<Logout size={25} strokeWidth={2} />}
          onClick={handleLogout}
        >
          logout
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default HeaderContainer;
