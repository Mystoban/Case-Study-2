import { createSlice } from "@reduxjs/toolkit";

const FacerecognitionReducer = createSlice({
    name: "faceRecognition",
    initialState:{
        singlepersondata: {},
        status: "idle",
        fetchdata: false,
        error: null
    },
    reducers: {
        FaceGetInfoStart: (state) => {
            state.status = "loading";
            state.fetchdata = true;
            state.error = null;
        },
        FaceGetInfoSuccess: (state, action) => {
            state.status = "success";
            state.singlepersondata = action.payload;
            state.fetchdata = true;
            state.error = null;
        },
        FaceGetInfoFailed: (state, action) => {
            state.status = "failed";
            state.singlepersondata = {};
            state.fetchdata = false;
            state.error = action.payload;
        },
        FaceGetInfoReset: (state) => {
            state.status = "idle";
            state.singlepersondata = {};
            state.fetchdata = false;
            state.error = null;
        },
        DataDisplayClose: (state) => {
            state.fetchdata = false;
        },
        CreateDocument: (state, action) => {
            state.status = "success";
            state.singlepersondata = {
                ...action.payload,
                fullname: `${action.payload.firstname} ${action.payload.middlename ? action.payload.middlename + ' ' : ''}${action.payload.lastname}${action.payload.suffix ? ' ' + action.payload.suffix : ''}`
            };
            state.fetchdata = false;
            state.error = null;
        },
        ClearDocument: (state) => {
            state.singlepersondata = {};
            state.status = "idle";
            state.fetchdata = false;
            state.error = null;
        }
    }
});

export const {
    FaceGetInfoStart,
    FaceGetInfoSuccess,
    FaceGetInfoFailed,
    FaceGetInfoReset,
    DataDisplayClose,
    CreateDocument,
    ClearDocument
} = FacerecognitionReducer.actions;

export default FacerecognitionReducer.reducer;