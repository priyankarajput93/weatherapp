import { applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { configureStore } from '@reduxjs/toolkit';
import AppReducer from "./Reducers";

export const Store = configureStore(
    {
        reducer: {
            appReducer: AppReducer,
        }
    },
    applyMiddleware(thunk)
);