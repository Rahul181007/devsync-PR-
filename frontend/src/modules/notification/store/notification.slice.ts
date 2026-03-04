import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Notification } from "../types/notification.types";
import { notificationApi } from "../services/notification.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface NotificationState{
    loading:boolean;
    error:string|null;
    items:Notification[];
    unreadCount:number;
}

const initialState:NotificationState={
    loading:false,
    error:null,
    items:[],
    unreadCount:0

}

export const fetchNotifications=createAsyncThunk<
  Notification[],
  void,
  { rejectValue: string }
>(
    "notification/fetchAll",
    async(_,{rejectWithValue})=>{
        try {
            const res=await notificationApi.getNotifications();
            return res.data.data
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const fetchUnreadCount=createAsyncThunk<
  number,
  void,
  { rejectValue: string }
>(
    "notification/fetchUnreadCount",
    async(_,{rejectWithValue})=>{
        try {
            const res=await notificationApi.getUnreadCount();
            return res.data.data.count
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const markNotificationAsRead=createAsyncThunk<
string,
string,
{rejectValue:string}
>(
    "notification/markAsRead",
    async(notificationId,{rejectWithValue})=>{
        try {
            await notificationApi.markAsRead(notificationId);
            return notificationId
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const markAllNotificationsAsRead=createAsyncThunk<
void,
void,
{rejectValue:string}
>(
    "notification/markAllAsRead",
    async(_,{rejectWithValue} )=>{
        try {
            await notificationApi.markAllAsRead()
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)


const notificationSlice=createSlice({
    name:'notification',
    initialState,
    reducers:{
            clearNotifications(state) {
      state.items = [];
      state.unreadCount = 0;
    },
      addRealtimeNotification(state, action) {
    state.items.unshift(action.payload); // add at top
    state.unreadCount += 1;
  }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchNotifications.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchNotifications.fulfilled,(state,action)=>{
            state.loading=false;
            state.items=action.payload;
        })
        .addCase(fetchNotifications.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })


        .addCase(fetchUnreadCount.fulfilled,(state,action)=>{
            state.unreadCount=action.payload
        })

        .addCase(markNotificationAsRead.fulfilled,(state,action)=>{
    const id = action.payload;

    const exists = state.items.find(n => n.id === id);

    if (exists) {
        state.items = state.items.filter(n => n.id !== id);
        state.unreadCount = Math.max(0, state.unreadCount - 1);
    }

        })

        .addCase(markAllNotificationsAsRead.fulfilled,(state)=>{
            state.items = [];
            state.unreadCount=0
        })
    }
})

export const { clearNotifications,addRealtimeNotification } = notificationSlice.actions;
export default notificationSlice.reducer