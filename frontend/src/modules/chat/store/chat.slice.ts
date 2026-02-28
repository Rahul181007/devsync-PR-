import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ChatMessage } from "../types/chat.types";
import { chatApi } from "../services/chat.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface ChatState{
    loading:boolean;
    error:string|null;
    messages:ChatMessage[]
}

const initialState:ChatState={
    loading:false,
    error:null,
    messages:[]
}

export const getProjectMessage=createAsyncThunk<
ChatMessage[],
{projectId:string;cursor?:string},
{rejectValue:string}
>(
   "chat/getProjectMessages",
   async({projectId,cursor},{rejectWithValue})=>{
    try {
        const res=await chatApi.getProjectMessage(projectId,{
            limit:30,
            cursor
        })
        return res.data.data
    } catch (error:unknown) {
        return rejectWithValue(getErrorMessage(error))
    }
   } 
)

const chatSlice=createSlice({
    name:"chat",
    initialState,
    reducers:{
        addMessage(state,action){
            state.messages.push(action.payload)
        },
        clearChat(state){
            state.messages=[]
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getProjectMessage.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        .addCase(getProjectMessage.fulfilled,(state,action)=>{
            state.loading=false;
            state.messages=action.payload
        })
        .addCase(getProjectMessage.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })
    }
})


export const { addMessage, clearChat } = chatSlice.actions;

export default chatSlice.reducer;