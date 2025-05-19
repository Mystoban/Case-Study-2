import React from "react";
import { createStyles, Group, Text, Image, Box } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.xs,
  },
  logoWrapper: {
    width: 70,
    height: 70,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    color: theme.colorScheme === "dark" ? theme.white : theme.colors.dark[7],
    marginLeft: theme.spacing.md,
    textAlign: "center",
  }
}));

const Logo = () => {
  const { classes } = useStyles();

  return (
    <Group className={classes.container}>
      <Box className={classes.logoWrapper}>
        <Image
          className={classes.logo}
          src="/iligan_seal.png"
          alt="Iligan City Seal"
        />
      </Box>
      <Text className={classes.title}>Barangay Kalilangan</Text>
    </Group>
  );
};

export default Logo;