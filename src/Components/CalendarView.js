import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction";
import {
  Button,
  Modal,
  Text,
  TextInput,
  createStyles,
  Container,
} from "@mantine/core";
import { DeleteSingleEvent } from "../redux/apiCalls";
import { DatePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { showNotification } from "@mantine/notifications";
import { CreateBrgyEvent } from "../redux/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { eventsReset } from "../redux/EventRedux";

const useStyles = createStyles((theme) => ({
  textinputs: {
    width: "100%",
    margin: `0 ${theme.spacing.xxs}px`,
  },
  registerbutton: {
    marginTop: `${theme.spacing.lg}px`,
    width: "100px",
    alignContent: "center",
  },
  deletebutton: {
    marginTop: `${theme.spacing.lg}px`,
    width: "100px",
    alignContent: "center",
    backgroundColor: "#D5786B",
    color: "white",
  },
  modal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
}));

const CalendarView = () => {
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);
  const [dateData, setDateData] = useState(null);
  const [eventData, setEventData] = useState("");
  const [eventAboutData, setEventAboutData] = useState("");
  const [createEventModal, setCreateEventModal] = useState(false);
  const [eventDataEnd, setEventDataEnd] = useState(null);
  const [eventID, setEventID] = useState(null);
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events.events);

  // Transform events to include _id as the event id
  const calendarEvents = events.map(event => ({
    ...event,
    id: event._id, // Set the event id to be the MongoDB _id
  }));

  const handleDateSelect = (selectInfo) => {
    setDateData(selectInfo.startStr);
    setEventDataEnd(null);
    setEventData("");
    setEventAboutData("");
    setCreateEventModal(true);
  };

  const handleDateClick = (e) => {
    const eventId = e.event.id; // Get the MongoDB _id we set earlier
    const event = events.find(evt => evt._id === eventId); // Find the full event object
    
    if (event) {
      setEventData(event.title);
      setDateData(event.start);
      setEventAboutData(event.about);
      setEventDataEnd(event.end);
      setEventID(event._id);
      setOpened(true);
    } else {
      showNotification({
        title: "Error",
        message: "Could not find event details",
        color: "red"
      });
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventID) {
      showNotification({
        title: "Error",
        message: "Cannot delete event: Missing event ID",
        color: "red"
      });
      return;
    }

    try {
      await DeleteSingleEvent(
        dispatch,
        eventID,
        showNotification,
        setOpened,
        eventData
      );
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Failed to delete event",
        color: "red"
      });
    }
  };

  const handleCreateEvent = () => {
    if (!eventData) {
      showNotification({
        title: "Error",
        message: "Event name is required",
        color: "red"
      });
      return;
    }

    if (!eventDataEnd) {
      showNotification({
        title: "Error",
        message: "End date is required",
        color: "red"
      });
      return;
    }

    const input = {
      title: eventData,
      about: eventAboutData,
      start: dateData,
      end: dayjs(eventDataEnd).format('YYYY-MM-DD'),
    };

    CreateBrgyEvent(dispatch, input, showNotification, setCreateEventModal);
  };

  return (
    <div>
      <FullCalendar
        events={calendarEvents}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height={650}
        eventClick={handleDateClick}
        selectable={true}
        select={handleDateSelect}
      />
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Event Details"
        centered
      >
        <Text>What: {eventData}</Text>
        <Text>About: {eventAboutData || "none"}</Text>
        <Text>Start of event: {dayjs(dateData).format("dddd, MMMM D")}</Text>
        <Text>End of event: {dayjs(eventDataEnd).subtract(1, 'day').format("dddd, MMM D")}</Text>
        <Container fluid className={classes.modal}>
          <Button
            className={classes.deletebutton}
            variant="filled"
            onClick={handleDeleteEvent}
          >
            Delete
          </Button>
        </Container>
      </Modal>
      <Modal
        opened={createEventModal}
        onClose={() => setCreateEventModal(false)}
        title="Create Event"
        centered
      >
        <Container fluid className={classes.modal}>
          <TextInput
            className={classes.textinputs}
            name="eventname"
            label="Name of Event"
            placeholder="Input the name of event"
            radius="sm"
            value={eventData}
            onChange={(e) => setEventData(e.currentTarget.value)}
            required
          />
          <TextInput
            className={classes.textinputs}
            name="eventdescription"
            label="Description of Event (optional)"
            placeholder="Input the description of the event"
            radius="sm"
            value={eventAboutData}
            onChange={(e) => setEventAboutData(e.currentTarget.value)}
          />
          <TextInput
            className={classes.textinputs}
            value={dayjs(dateData).format("MMMM D, YYYY")}
            label="Start of the Event"
            disabled
          />
          <DatePicker
            className={classes.textinputs}
            placeholder="Input the end day of event"
            label="End of the Event"
            value={eventDataEnd}
            onChange={setEventDataEnd}
            required
            minDate={dayjs(dateData).toDate()}
          />
          <Button
            className={classes.registerbutton}
            variant="filled"
            onClick={handleCreateEvent}
          >
            Create
          </Button>
        </Container>
      </Modal>
    </div>
  );
};

export default CalendarView;
