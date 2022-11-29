import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_KEY = 'b11c778d23934dfd116088a9e47c93be';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast?';

export const getData = createAsyncThunk('appData/getAppData', async (params) => {

    const { lat, lon } = params;
    try {
        const response = await fetch(BASE_URL + `lat=${lat}` + `&lon=${lon}` + `&appid=${API_KEY}`);
        const json = await response.json();
        return json;
    } catch (error) {
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
                state.status = "loading";
            })
            .addCase(getData.fulfilled, (state, action) => {
                if (action.payload === 'Network request failed') {
                    state.status = "failed";
                    state.error = action.payload;
                } else {
                    state.status = "succeeded";
                    state.data = (action.payload);
                }
                console.log(action.payload);
            })
            .addCase(getData.rejected, (state, action) => {
                state.status = "failed";
                console.log('failed');
                state.error = action.error.message;
            })
    }
})

export const addUserName = appSlice.actions.addUserName;
export const addUserPassword = appSlice.actions.addUserPassword;
export const clearData = appSlice.actions.clearData;

export default appSlice.reducer;