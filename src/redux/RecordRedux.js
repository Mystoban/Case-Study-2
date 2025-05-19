import { createSlice } from "@reduxjs/toolkit";


const RecordRedux = createSlice({
    name: "record",
    initialState: {
        records: [],
        recordSuccess: false,
        isLoading: false,
        error: null
    },
    reducers: {
        RecordLoading: (state) => {
            console.log('RecordLoading action dispatched');
            state.isLoading = true;
            state.error = null;
        },
        RecordGetAll: (state, action) => {
            console.log('RecordGetAll action dispatched with payload:', action.payload);
            state.records = action.payload;
            state.recordSuccess = true;
            state.isLoading = false;
            state.error = null;
            console.log('Updated state:', state);
        },
        RecordAdd: (state, action) => {
            console.log('RecordAdd action dispatched with payload:', action.payload);
            state.records.push(action.payload);
            state.recordSuccess = true;
            state.isLoading = false;
            state.error = null;
        },
        RecordError: (state, action) => {
            console.log('RecordError action dispatched with payload:', action.payload);
            state.error = action.payload;
            state.isLoading = false;
            state.recordSuccess = false;
        }
    }
})

export const { RecordGetAll, RecordAdd, RecordLoading, RecordError } = RecordRedux.actions;
export default RecordRedux.reducer;