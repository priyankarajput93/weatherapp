import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {API_KEY, BASE_URL} from '../utils/Constants';

// method to get data from API
export const getData = createAsyncThunk('appData/getAppData', async params => {
  const {lat, lon} = params;
  try {
    const response = await fetch(
      BASE_URL + `lat=${lat}` + `&lon=${lon}` + `&appid=${API_KEY}`,
    );
    const json = await response.json();
    return json;
  } catch (error) {
    return error.message;
  }
});

const appSlice = createSlice({
  name: 'appData',
  initialState: {
    userName: '',
    userPassword: '',
    data: [],
    status: 'idle',
    error: 'error',
  },
  reducers: {
    addUserName: (state, action) => {
      state.userName = action.payload;
    },
    addUserPassword: (state, action) => {
      state.userPassword = action.payload;
    },
    clearData: (state, action) => {
      state.userName = '';
      state.userPassword = '';
      state.status = 'idle';
      state.error = '';
      state.data = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getData.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getData.fulfilled, (state, action) => {
        if (action.payload === 'Network request failed') {
          state.status = 'failed';
          state.error = action.payload;
        } else {
          state.status = 'succeeded';
          state.data = action.payload;
        }
      })
      .addCase(getData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const addUserName = appSlice.actions.addUserName;
export const addUserPassword = appSlice.actions.addUserPassword;
export const clearData = appSlice.actions.clearData;

export default appSlice.reducer;
