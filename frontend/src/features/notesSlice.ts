import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface NotesState{
    summary:string;
    quiz:string;
}
const initialState:NotesState={
    summary:'',
    quiz:''
}

const notesSlice=createSlice({
    name:'notes',
    initialState,
    reducers:{
        setSummary:(state,action:PayloadAction<string>)=>{
            state.summary=action.payload
        },
        setQuiz:(state,action:PayloadAction<string>)=>{
            state.quiz=action.payload
        },
        resetContent:(state)=>{
            state.summary=''
            state.quiz=''
        },
    },
})

export const {setSummary,setQuiz,resetContent}=notesSlice.actions;
export default notesSlice.reducer