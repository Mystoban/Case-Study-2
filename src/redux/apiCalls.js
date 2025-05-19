import {
  fetchResidentsStart,
  fetchResidentsSuccess,
  fetchResidentsFailed,
  updateResident,
  deleteResident,
} from "./MasterlistRedux";

import { publicRequest, userRequest } from "../RequestMethod";

import {
  FaceGetInfoStart,
  FaceGetInfoSuccess,
  FaceGetInfoFailed,
} from "./FaceRecognitionRedux";

import { fetchAllEvents, addEvents, deleteEvent } from "./EventRedux";

import { fetchEventToday, fetchEventTodayFailed } from "./EventTodayRedux";

import { LoginUser, Logout } from "./UserRedux";
import { RecordGetAll, RecordLoading, RecordError } from "./RecordRedux";

//fetch data of a single person
export const GetFaceRecognitionData = async (
  dispatch,
  fullname,
  showNotification
) => {
  try {
    dispatch(FaceGetInfoStart());
    const res = await userRequest.get(`/residents/search?fullname=${fullname}`);
    dispatch(FaceGetInfoSuccess(res.data));
  } catch (error) {
    dispatch(FaceGetInfoFailed());
    showNotification({
      title: "Error",
      message: error.response?.data?.message || "Failed to fetch resident data",
    });
  }
};

//fetch all data
export const GetAllDataResident = async (dispatch) => {
  dispatch(fetchResidentsStart());
  try {
    const res = await userRequest.get("/residents");
    dispatch(fetchResidentsSuccess(res.data));
  } catch (error) {
    dispatch(fetchResidentsFailed());
    console.error("Error fetching residents:", error);
  }
};

//Update Resident
export const UpdateDataResident = async (
  dispatch,
  residentId,
  showNotification,
  setUpdateStatus,
  updatedValues,
  setEditProfileOpened
) => {
  try {
    const res = await userRequest.put(`/residents/${residentId}`, updatedValues);
    dispatch(updateResident(res.data));
    showNotification({
      title: "Success",
      message: "Resident updated successfully",
    });
    setUpdateStatus(false);
    setEditProfileOpened(false);
  } catch (error) {
    showNotification({
      title: "Error",
      message: error.response?.data?.message || "Failed to update resident",
    });
    setUpdateStatus(false);
  }
};

//Delete Resident from the Masterlist
export const DeleteDataResident = async (
  dispatch,
  residentId,
  showNotification,
  setDeleteUserModal
) => {
  try {
    await userRequest.delete(`/residents/${residentId}`);
    dispatch(deleteResident(residentId));
    showNotification({
      title: "Success",
      message: "Resident deleted successfully",
    });
    setDeleteUserModal(false);
  } catch (error) {
    showNotification({
      title: "Error",
      message: error.response?.data?.message || "Failed to delete resident",
    });
    setDeleteUserModal(false);
  }
};

//Get All Events
export const GetAllBrgyEvents = async (dispatch, showNotification) => {
  try {
    const res = await userRequest.get("/events");
    dispatch(fetchAllEvents(res.data));
  } catch (error) {
    showNotification({
      title: "Error",
      message: error.response?.data?.message || "Failed to fetch events",
    });
  }
};

//Create Events
export const CreateBrgyEvent = async (
  dispatch,
  data,
  showNotification,
  setcreateEventModal
) => {
  try {
    const res = await userRequest.post("/events", data);
    dispatch(addEvents(res.data));
    showNotification({
      title: "Success",
      message: "Event created successfully",
    });
    setcreateEventModal(false);
  } catch (error) {
    showNotification({
      title: "Error",
      message: error.response?.data?.message || "Failed to create event",
    });
    setcreateEventModal(false);
  }
};

//Delete Single Event
export const DeleteSingleEvent = async (
  dispatch,
  ID,
  showNotification,
  setOpened,
  eventData
) => {
  try {
    await userRequest.delete(`/events/${ID}`);
    dispatch(deleteEvent(ID));
    showNotification({
      title: "Success",
      message: "Event deleted successfully",
    });
    setOpened(false);
  } catch (error) {
    showNotification({
      title: "Error",
      message: error.response?.data?.message || "Failed to delete event",
    });
    setOpened(false);
  }
};

//fetch Event Today
export const GetEventToday = async (dispatch, showNotification) => {
  try {
    const res = await userRequest.get("/events/today");
    dispatch(fetchEventToday(res.data));
  } catch (error) {
    dispatch(fetchEventTodayFailed());
    showNotification({
      title: "Error",
      message: error.response?.data?.message || "Failed to fetch today's events",
    });
  }
};

//fetch All Records
export const GetAllRecords = async (dispatch, showNotification) => {
  try {
    dispatch(RecordLoading());
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const res = await userRequest.get("/records", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('API Response:', res);
    console.log('Response Data:', res.data);
    
    if (!res.data) {
      throw new Error('No data received from server');
    }

    // Handle both array and object responses
    let records = [];
    if (Array.isArray(res.data)) {
      records = res.data;
    } else if (typeof res.data === 'object') {
      if (res.data.data && Array.isArray(res.data.data)) {
        records = res.data.data;
      } else if (res.data.records && Array.isArray(res.data.records)) {
        records = res.data.records;
      }
    }

    console.log('Processed Records:', records);
    dispatch(RecordGetAll(records));
  } catch (error) {
    console.error('Error fetching records:', error);
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch records";
    dispatch(RecordError(errorMessage));
    showNotification({
      title: "Error",
      message: errorMessage,
      color: "red"
    });
    dispatch(RecordGetAll([]));
  }
};
