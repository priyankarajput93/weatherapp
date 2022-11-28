import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_KEY = 'b11c778d23934dfd116088a9e47c93be';
const lat = '31.2175';
const lon = '76.1407';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast?lat=31.2175&lon=76.1407&appid=b11c778d23934dfd116088a9e47c93be';

export const getData = createAsyncThunk('appData/getAppData', async () => {
    try {
        const response = await fetch(BASE_URL);
        const json = await response.json();
        // console.log(json);
        console.log('Api called');
        return json;
    } catch (error) {
        console.log("error " + error);
        return error.message;
    }
})

const appSlice = createSlice({
    name: 'appData',
    initialState: {
        userName: '',
        userPassword: '',
        data: [],
        status: 'idle',
        error: 'error'
    },
    reducers: {
        addUserName: (state, action) => {
            state.userName = (action.payload);
        },
        addUserPassword: (state, action) => {
            state.userPassword = (action.payload);
        },
        apiStatus: (state, action) => {
            state.status = (action.payload);
        },
        errorValue: (state, action) => {
            state.error = (action.payload);
        },
        setData: (state, action) => {
            state.data = (action.payload);
        },
        clearData: (state, action) => {
            state.userName = '';
            state.userPassword = '';
            state.status = 'idle';
            state.error = '';
            state.data = [];
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getData.pending, (state, action) => {
                console.log(getData.pending);
                state.status = "loading";
                console.log('builder');
                console.log('builder status');
            })
            .addCase(getData.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = (action.payload);
                console.log("succeeded");
               // console.log(action.payload);
            })
            .addCase(getData.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
                console.log("failed");

            })
    }
})

export const addUserName = appSlice.actions.addUserName;
export const addUserPassword = appSlice.actions.addUserPassword;
export const setData = appSlice.actions.setData;
export const errorValue = appSlice.actions.errorValue;
export const apiStatus = appSlice.actions.apiStatus;
export const clearData = appSlice.actions.clearData;

/*
export const weatherData = (state) => state.appData.data;
export const getError = (state) => state.appData.error;
export const getStatus = (state) => state.appData.status;
*/
export default appSlice.reducer;