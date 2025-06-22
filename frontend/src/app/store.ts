import {configureStore} from '@reduxjs/toolkit'
import notesReducer from '../features/notesSlice'
export const store=configureStore({
    reducer:{
        notes:notesReducer
    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
//dispatch reducers ko use karte hue store me changes karta h