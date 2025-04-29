import { configureStore } from "@reduxjs/toolkit";
import movieReducer from './movieSlice';

const store=configureStore({
    reducer: {
        movies: movieReducer
    }
})

export type RootState=ReturnType<typeof store.getState>;
export type AppDistach=typeof store.dispatch;

export default store;