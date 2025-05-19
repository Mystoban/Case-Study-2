import React, { useLayoutEffect, useEffect } from "react";
import {
  createStyles,
  Container,
  Text,
  ActionIcon,
  Image,
  Grid,
  Paper,
  Group,
  RingProgress,
  Title,
  LoadingOverlay,
  useMantineTheme,
  Button,
} from "@mantine/core";
import { User, Users, Home as HomeIcon, Briefcase, School, Heart, Trash } from "tabler-icons-react";
import { useDispatch, useSelector } from "react-redux";
import { GetEventToday, GetAllDataResident, DeleteSingleEvent } from "../redux/apiCalls";
import { showNotification } from "@mantine/notifications";
import { deleteEventToday } from "../redux/EventTodayRedux";
import L from 'leaflet';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const useStyles = createStyles((theme) => ({
  container: {
    fontFamily: "Regular",
    width: "100%",
    minHeight: "100vh",
    borderRadius: "20px",
    background: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
    transition: "ease-in-out 500ms",
    padding: theme.spacing.md,
  },
  mapContainer: {
    height: "400px",
    width: "100%",
    borderRadius: theme.radius.md,
    overflow: "hidden",
    marginBottom: theme.spacing.xl,
    position: "relative",
  },
  wrapper: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "auto",
    padding: theme.spacing.md,
    justifyContent: "space-between",
    marginBottom: theme.spacing.xl,
  },
  containerwrapper: {
    margin: 0,
    width: "100%",
    borderRadius: 15,
    background: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    padding: theme.spacing.xl,
  },
  text: {
    margin: `${theme.spacing.lg}px 0`,
    fontFamily: "Regular",
  },
  residentcount: {
    fontFamily: "Bold",
    marginLeft: 10,
  },
  textBold: {
    fontFamily: "Bold",
  },
  icon: {
    color: theme.colorScheme === "dark" ? "white" : "black",
  },
  actionIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  countwrapper: {
    display: "flex",
  },
  eventWrapper: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    padding: `${theme.spacing.md}px ${theme.spacing.xl}px`,
  },
  noeventwrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: theme.spacing.xl,
  },
  eventcontainer: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  statCard: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    borderRadius: theme.radius.lg,
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    height: "100%",
    border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: theme.shadows.md,
    },
  },
  statValue: {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 5,
    background: theme.colorScheme === "dark" 
      ? "linear-gradient(45deg, #4CAF50, #81C784)"
      : "linear-gradient(45deg, #2E7D32, #43A047)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  statLabel: {
    fontSize: 16,
    color: theme.colorScheme === "dark" ? theme.colors.gray[3] : theme.colors.gray[7],
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ringProgress: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  eventTitle: {
    fontSize: 36,
    fontWeight: 800,
    marginBottom: theme.spacing.md,
    background: theme.colorScheme === "dark" 
      ? "linear-gradient(45deg, #4CAF50, #81C784)"
      : "linear-gradient(45deg, #2E7D32, #43A047)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
  },
  eventDecorator: {
    fontSize: 40,
    marginBottom: theme.spacing.xs,
  },
  eventContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xl * 2,
    marginBottom: theme.spacing.xl,
    background: theme.colorScheme === "dark" 
      ? theme.colors.dark[7] 
      : theme.colors.green[0],
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  eventText: {
    fontSize: 24,
    fontWeight: 600,
    color: theme.colorScheme === "dark" ? theme.colors.green[3] : theme.colors.green[7],
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  eventDescription: {
    fontSize: 18,
    color: theme.colorScheme === "dark" ? theme.colors.gray[3] : theme.colors.gray[7],
    textAlign: "center",
    maxWidth: "800px",
    margin: "0 auto",
    lineHeight: 1.6,
  },
  eventContent: {
    background: theme.colorScheme === "dark" 
      ? theme.colors.dark[7] 
      : theme.colors.green[0],
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.green[9] : theme.colors.green[2]}`,
  },
  noEventIcon: {
    fontSize: 48,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  barChart: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.sm,
  },
  barContainer: {
    width: "100%",
    height: 30,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2],
    borderRadius: theme.radius.sm,
    overflow: "hidden",
    position: "relative",
  },
  bar: {
    height: "100%",
    transition: "width 0.5s ease",
  },
  barLabel: {
    position: "absolute",
    left: theme.spacing.sm,
    top: "50%",
    transform: "translateY(-50%)",
    color: theme.white,
    fontSize: 14,
    fontWeight: 600,
    zIndex: 1,
  },
  barValue: {
    position: "absolute",
    right: theme.spacing.sm,
    top: "50%",
    transform: "translateY(-50%)",
    color: theme.white,
    fontSize: 14,
    fontWeight: 600,
    zIndex: 1,
  },
  legend: {
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    color: theme.colorScheme === "dark" ? theme.colors.gray[3] : theme.colors.gray[7],
  },
  eventItem: {
    backgroundColor: theme.colorScheme === "dark" 
      ? theme.colors.dark[6] 
      : theme.white,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows.sm,
    },
  },
  eventCard: {
    width: '100%',
  },
  eventContainer: {
    justifyContent: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    background: theme.colorScheme === "dark" 
      ? theme.colors.dark[7] 
      : theme.colors.green[0],
    borderRadius: theme.radius.md,
  },
  eventContent: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
  },
  eventText: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: theme.colorScheme === "dark" ? theme.colors.green[3] : theme.colors.green[7],
  },
  eventDescription: {
    color: theme.colorScheme === "dark" ? theme.colors.gray[3] : theme.colors.gray[7],
    fontSize: '0.95rem',
    lineHeight: 1.5,
  },
}));

const MapComponent = () => {
  useEffect(() => {
    const map = L.map('map').setView([8.197876436802174, 124.38888601850263], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([8.197876436802174, 124.38888601850263])
      .bindPopup('Barangay Hall Location')
      .addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ height: "100%", width: "100%" }} />;
};

const Home = () => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const dispatch = useDispatch();
  const TodayEvent = useSelector((state) => state.eventtoday?.eventtoday);
  const residents = useSelector((state) => state.masterlist?.residents || []);
  const loading = useSelector((state) => state.masterlist?.isFetching || false);

  useLayoutEffect(() => {
    GetEventToday(dispatch, showNotification);
    GetAllDataResident(dispatch);
  }, [dispatch]);

  // Calculate metrics
  const totalResidents = residents.length;
  
  // Calculate age groups
  const calculateAge = birthdate => {
    return new Date().getFullYear() - new Date(birthdate).getFullYear();
  };

  const ageGroups = residents.reduce((acc, resident) => {
    const age = calculateAge(resident.birthdate);
    if (age <= 17) acc.youth++;
    else if (age >= 18 && age <= 59) acc.adult++;
    else acc.senior++;
    return acc;
  }, { youth: 0, adult: 0, senior: 0 });

  // Calculate gender distribution
  const genderDistribution = residents.reduce((acc, resident) => {
    resident.gender?.toLowerCase() === 'female' ? acc.female++ : acc.male++;
    return acc;
  }, { male: 0, female: 0 });

  const pwdResidents = residents.filter(r => r.PWD).length;
  const fourPsMembers = residents.filter(r => r.fourpsmember).length;
  const registeredVoters = residents.filter(r => r.registervoter).length;

  // Calculate percentages
  const youthPercentage = (ageGroups.youth / totalResidents) * 100 || 0;
  const adultPercentage = (ageGroups.adult / totalResidents) * 100 || 0;
  const seniorPercentage = (ageGroups.senior / totalResidents) * 100 || 0;
  const genderRatio = (genderDistribution.female / totalResidents) * 100 || 0;

  if (loading) {
    return (
      <div className={classes.container}>
        <LoadingOverlay visible={true} />
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <Grid gutter="md">
        <Grid.Col span={12}>
          <Paper className={classes.mapContainer}>
            <MapComponent />
          </Paper>
        </Grid.Col>

        <Grid.Col span={12}>
          <Paper className={classes.containerwrapper}>
            <EventContainer classes={classes} TodayEvent={TodayEvent} />
          </Paper>
        </Grid.Col>

        <Grid.Col span={12}>
          <Title order={2} mb="xl" 
            style={{ 
              fontSize: 32, 
              fontWeight: 700,
              color: theme.colorScheme === "dark" ? theme.white : theme.black,
            }}>
            Barangay Demographics
          </Title>
          <Grid gutter="xl">
            <Grid.Col span={4}>
              <Paper className={classes.statCard}>
                <Group position="apart" align="flex-start">
                  <div>
                    <Text className={classes.statValue}>{totalResidents}</Text>
                    <Text className={classes.statLabel}>Total Population</Text>
                  </div>
                  <Users 
                    size={36} 
                    color={theme.colorScheme === "dark" ? "#81C784" : "#2E7D32"} 
                  />
                </Group>
                <Text size="sm" color="dimmed" mt="md" style={{ lineHeight: 1.5 }}>
                  Current number of registered residents
                </Text>
              </Paper>
            </Grid.Col>

            <Grid.Col span={4}>
              <Paper className={classes.statCard}>
                <Group position="apart" align="flex-start">
                  <div>
                    <Text className={classes.statValue}>
                      {genderDistribution.female} / {genderDistribution.male}
                    </Text>
                    <Text className={classes.statLabel}>Female/Male Ratio</Text>
                  </div>
                  <User 
                    size={36} 
                    color={theme.colorScheme === "dark" ? "#81C784" : "#2E7D32"} 
                  />
                </Group>
                <div className={classes.barChart}>
                  <div className={classes.barContainer}>
                    <div 
                      className={classes.bar} 
                      style={{ 
                        width: `${genderRatio}%`,
                        backgroundColor: "#4CAF50",
                      }}
                    >
                      <span className={classes.barLabel}>Female</span>
                      <span className={classes.barValue}>{Math.round(genderRatio)}%</span>
                    </div>
                  </div>
                  <div className={classes.barContainer}>
                    <div 
                      className={classes.bar} 
                      style={{ 
                        width: `${100 - genderRatio}%`,
                        backgroundColor: "#81C784",
                      }}
                    >
                      <span className={classes.barLabel}>Male</span>
                      <span className={classes.barValue}>{Math.round(100 - genderRatio)}%</span>
                    </div>
                  </div>
                  <div className={classes.legend}>
                    <div className={classes.legendItem}>
                      <div className={classes.legendColor} style={{ backgroundColor: "#4CAF50" }} />
                      <Text className={classes.legendText}>Female ({genderDistribution.female})</Text>
                    </div>
                    <div className={classes.legendItem}>
                      <div className={classes.legendColor} style={{ backgroundColor: "#81C784" }} />
                      <Text className={classes.legendText}>Male ({genderDistribution.male})</Text>
                    </div>
                  </div>
                </div>
              </Paper>
            </Grid.Col>

            <Grid.Col span={4}>
              <Paper className={classes.statCard}>
                <Group position="apart" align="flex-start">
                  <div>
                    <Text className={classes.statValue}>{pwdResidents}</Text>
                    <Text className={classes.statLabel}>PWD Residents</Text>
                  </div>
                  <Heart 
                    size={36} 
                    color={theme.colorScheme === "dark" ? "#81C784" : "#2E7D32"} 
                  />
                </Group>
                <div className={classes.ringProgress}>
                  <RingProgress
                    size={120}
                    thickness={12}
                    roundCaps
                    sections={[
                      { value: (pwdResidents / totalResidents) * 100, color: theme.colorScheme === "dark" ? "#81C784" : "#2E7D32" },
                      { value: 100 - (pwdResidents / totalResidents) * 100, color: theme.colorScheme === "dark" ? "#2C2E33" : "#E8F5E9" }
                    ]}
                    label={
                      <Text size="xs" align="center" px="xs" style={{ fontSize: 16, fontWeight: 700 }}>
                        {Math.round((pwdResidents / totalResidents) * 100)}%
                      </Text>
                    }
                  />
                  <Text size="sm" color="dimmed" align="center">of total population</Text>
                </div>
              </Paper>
            </Grid.Col>

            <Grid.Col span={4}>
              <Paper className={classes.statCard}>
                <Group position="apart" align="flex-start">
                  <div>
                    <Text className={classes.statValue}>{fourPsMembers}</Text>
                    <Text className={classes.statLabel}>4P's Beneficiaries</Text>
                  </div>
                  <Briefcase 
                    size={36} 
                    color={theme.colorScheme === "dark" ? "#81C784" : "#2E7D32"} 
                  />
                </Group>
                <div className={classes.ringProgress}>
                  <RingProgress
                    size={120}
                    thickness={12}
                    roundCaps
                    sections={[
                      { value: (fourPsMembers / totalResidents) * 100, color: theme.colorScheme === "dark" ? "#81C784" : "#2E7D32" },
                      { value: 100 - (fourPsMembers / totalResidents) * 100, color: theme.colorScheme === "dark" ? "#2C2E33" : "#E8F5E9" }
                    ]}
                    label={
                      <Text size="xs" align="center" px="xs" style={{ fontSize: 16, fontWeight: 700 }}>
                        {Math.round((fourPsMembers / totalResidents) * 100)}%
                      </Text>
                    }
                  />
                  <Text size="sm" color="dimmed" align="center">of total population</Text>
                </div>
              </Paper>
            </Grid.Col>

            <Grid.Col span={4}>
              <Paper className={classes.statCard}>
                <Group position="apart" align="flex-start">
                  <div>
                    <Text className={classes.statValue}>{registeredVoters}</Text>
                    <Text className={classes.statLabel}>Registered Voters</Text>
                  </div>
                  <HomeIcon 
                    size={36} 
                    color={theme.colorScheme === "dark" ? "#81C784" : "#2E7D32"} 
                  />
                </Group>
                <div className={classes.ringProgress}>
                  <RingProgress
                    size={120}
                    thickness={12}
                    roundCaps
                    sections={[
                      { value: (registeredVoters / totalResidents) * 100, color: theme.colorScheme === "dark" ? "#81C784" : "#2E7D32" },
                      { value: 100 - (registeredVoters / totalResidents) * 100, color: theme.colorScheme === "dark" ? "#2C2E33" : "#E8F5E9" }
                    ]}
                    label={
                      <Text size="xs" align="center" px="xs" style={{ fontSize: 16, fontWeight: 700 }}>
                        {Math.round((registeredVoters / totalResidents) * 100)}%
                      </Text>
                    }
                  />
                  <Text size="sm" color="dimmed" align="center">of total population</Text>
                </div>
              </Paper>
            </Grid.Col>

            <Grid.Col span={4}>
              <Paper className={classes.statCard}>
                <Group position="apart" align="flex-start">
                  <div>
                    <Text className={classes.statValue}>{`${ageGroups.youth}/${ageGroups.adult}/${ageGroups.senior}`}</Text>
                    <Text className={classes.statLabel}>Youth/Adult/Senior</Text>
                  </div>
                  <School 
                    size={36} 
                    color={theme.colorScheme === "dark" ? "#81C784" : "#2E7D32"} 
                  />
                </Group>
                <DemographicsBarChart
                  youth={ageGroups.youth}
                  adult={ageGroups.adult}
                  senior={ageGroups.senior}
                  total={totalResidents}
                  classes={classes}
                />
              </Paper>
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
    </div>
  );
};

const EventContainer = ({ classes, TodayEvent }) => {
  const dispatch = useDispatch();
  // Convert single event to array if it exists, or empty array if none
  const events = TodayEvent ? (Array.isArray(TodayEvent) ? TodayEvent : [TodayEvent]) : [];

  const handleDeleteEvent = async (event) => {
    if (event._id) {
      try {
        await DeleteSingleEvent(
          dispatch,
          event._id,
          showNotification,
          () => {},
          event.title
        );
        // Dispatch local delete action to update UI immediately
        dispatch(deleteEventToday(event._id));
      } catch (error) {
        showNotification({
          title: "Error",
          message: "Failed to delete event",
          color: "red"
        });
      }
    } else {
      showNotification({
        title: "Error",
        message: "Cannot delete event: Missing event ID",
        color: "red"
      });
    }
  };

  return (
    <div className={classes.eventCard}>
      <Group className={classes.eventContainer}>
        <Text className={classes.eventDecorator}>🎉</Text>
        <Title className={classes.eventTitle}>Events Today</Title>
        <Text className={classes.eventDecorator}>🎊</Text>
      </Group>
      {events.length > 0 ? (
        <div className={classes.eventContent}>
          {events.map((event, index) => (
            <Paper 
              key={event._id || index}
              className={classes.eventItem}
              style={{
                marginBottom: index < events.length - 1 ? '1rem' : 0,
                padding: '1rem',
                border: '1px solid',
                borderColor: 'rgba(76, 175, 80, 0.3)',
                borderRadius: '8px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <Group position="apart" align="flex-start">
                <div style={{ flex: 1 }}>
                  <Group position="apart" mb="xs">
                    <Text className={classes.eventText} style={{ margin: 0 }}>
                      {event.title}
                    </Text>
                    <Text size="sm" color="dimmed">
                      {event.time || 'All Day'}
                    </Text>
                  </Group>
                  {event.about && (
                    <Text className={classes.eventDescription} style={{ margin: 0 }}>
                      {event.about}
                    </Text>
                  )}
                  {event.location && (
                    <Text size="sm" color="dimmed" mt="xs">
                      📍 {event.location}
                    </Text>
                  )}
                </div>
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() => handleDeleteEvent(event)}
                  title="Delete event"
                >
                  <Trash size={20} />
                </ActionIcon>
              </Group>
            </Paper>
          ))}
        </div>
      ) : (
        <div className={classes.eventContent}>
          <Text className={classes.noEventIcon}>📅</Text>
          <Text className={classes.eventText}>No events scheduled for today</Text>
          <Text className={classes.eventDescription}>
            Check the calendar for upcoming events or schedule a new event
          </Text>
        </div>
      )}
    </div>
  );
};

const DemographicsBarChart = ({ youth, adult, senior, total, classes }) => {
  const youthPercentage = (youth / total) * 100;
  const adultPercentage = (adult / total) * 100;
  const seniorPercentage = (senior / total) * 100;

  return (
    <div className={classes.barChart}>
      <div className={classes.barContainer}>
        <div 
          className={classes.bar} 
          style={{ 
            width: `${youthPercentage}%`,
            backgroundColor: "#4CAF50",
          }}
        >
          <span className={classes.barLabel}>Youth</span>
          <span className={classes.barValue}>{Math.round(youthPercentage)}%</span>
        </div>
      </div>
      <div className={classes.barContainer}>
        <div 
          className={classes.bar} 
          style={{ 
            width: `${adultPercentage}%`,
            backgroundColor: "#81C784",
          }}
        >
          <span className={classes.barLabel}>Adult</span>
          <span className={classes.barValue}>{Math.round(adultPercentage)}%</span>
        </div>
      </div>
      <div className={classes.barContainer}>
        <div 
          className={classes.bar} 
          style={{ 
            width: `${seniorPercentage}%`,
            backgroundColor: "#C8E6C9",
          }}
        >
          <span className={classes.barLabel}>Senior</span>
          <span className={classes.barValue}>{Math.round(seniorPercentage)}%</span>
        </div>
      </div>
      <div className={classes.legend}>
        <div className={classes.legendItem}>
          <div className={classes.legendColor} style={{ backgroundColor: "#4CAF50" }} />
          <Text className={classes.legendText}>Youth ({youth})</Text>
        </div>
        <div className={classes.legendItem}>
          <div className={classes.legendColor} style={{ backgroundColor: "#81C784" }} />
          <Text className={classes.legendText}>Adult ({adult})</Text>
        </div>
        <div className={classes.legendItem}>
          <div className={classes.legendColor} style={{ backgroundColor: "#C8E6C9" }} />
          <Text className={classes.legendText}>Senior ({senior})</Text>
        </div>
      </div>
    </div>
  );
};

const ResidentContainer = ({ classes, totalResidents }) => {
  return (
    <div>
      <Text size="lg" className={classes.text}>
        {totalResidents <= 1 ? "Total of registered resident" : "Total of registered residents"}
      </Text>
      <div className={classes.countwrapper}>
        <ActionIcon variant="default" className={classes.actionIcon}>
          <User className={classes.icon} size={25} strokeWidth={2} />
        </ActionIcon>
        <Text size="xl" className={classes.residentcount}>
          {totalResidents}
        </Text>
      </div>
    </div>
  );
};

export default Home;
