import {configureStore} from '@reduxjs/toolkit'
import notesReducer from '../features/notesSlice'
export const store=configureStore({
    reducer:notesReducer
})

//dispatch reducers ko use karte hue store me changes karta h