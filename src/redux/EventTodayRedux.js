import { createSlice } from "@reduxjs/toolkit"

const EventTodayReducer = createSlice({
    name: "eventtoday",
    initialState: {
        eventtoday: [],
    },
    reducers: {
        fetchEventToday: (state, action) => {
            // Ensure we always store an array of events
            state.eventtoday = Array.isArray(action.payload) ? action.payload : action.payload ? [action.payload] : [];
        },
        fetchEventTodayFailed: (state) => {
            state.eventtoday = [];
        },
        deleteEventToday: (state, action) => {
            state.eventtoday = Array.isArray(state.eventtoday) 
                ? state.eventtoday.filter(event => event._id !== action.payload)
                : [];
        }
    }
});

export const { fetchEventToday, fetchEventTodayFailed, deleteEventToday } = EventTodayReducer.actions;
export default EventTodayReducer.reducer;

