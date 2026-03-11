import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { BillingCycle, CreatePaymentResponse, PaymentHistory, Plan, Subscription } from "../types/billing.types";
import { billingApi } from "../services/billing.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface CompanyBillingState{
    loading:boolean;
    error:string|null;
    subscription:Subscription|null;
    plans:Plan[];
    payments:PaymentHistory[]
}

const initialState:CompanyBillingState={
    loading:false,
    error:null,

    subscription:null,
    plans:[],
    payments:[]
}


export const fetchCompanySubscription=createAsyncThunk<
Subscription,
void,
{rejectValue:string}
>(
    "companyBilling/fetchSubscription",
    async(_,{rejectWithValue})=>{
        try {
            const res=await billingApi.getCurrentSubscription();
            return res.data.data
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const fetchAvailablePlans=createAsyncThunk<
Plan[],
void,
{rejectValue:string}
>(
    "companyBilling/fetchPlans",
    async(_,{rejectWithValue})=>{
        try {
            const res=await  billingApi.getAvailablePlans();
            return res.data.data
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)


export const fetchPaymentHistory=createAsyncThunk<
PaymentHistory[],
void,
{rejectValue:string}
>(
    "companyBilling/fetchPayments",
    async(_,{rejectWithValue})=>{
        try {
            const res=await billingApi.getPaymentHistory();
            return res.data.data
        } catch (error:unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const createPayment = createAsyncThunk<
  CreatePaymentResponse,
  { planId: string; billingCycle: BillingCycle },
  { rejectValue: string }
>(
  "companyBilling/createPayment",
  async (data, { rejectWithValue }) => {
    try {
      const res = await billingApi.createPayment(data);
      return res.data.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const verifyPayment=createAsyncThunk<
void,
{orderId:string;paymentId:string;signature:string},
{rejectValue:string}
>(
      "companyBilling/verifyPayment",
  async (data, { rejectWithValue }) => {
    try {
      await billingApi.verifyPayment(data);
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
)


export const downloadInvoice = createAsyncThunk<
Blob,
string,
{ rejectValue: string }
>(
  "companyBilling/downloadInvoice",
  async (invoiceId, { rejectWithValue }) => {
    try {
      const res = await billingApi.downloadInvoice(invoiceId);
      return res.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const companyBillingSlice=createSlice({
    name:"companyBilling",
    initialState,
    reducers:{
        clearBillingError(state){
            state.error=null;
        }
    },
    extraReducers:(builder)=>{
        builder

        .addCase(fetchCompanySubscription.pending,(state)=>{
            state.loading=true;
            state.error=null;

        })
        .addCase(fetchCompanySubscription.fulfilled,(state,action)=>{
            state.loading=false;
            state.subscription=action.payload
        })
        .addCase(fetchCompanySubscription.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })


        //plans
        .addCase(fetchAvailablePlans.pending,(state)=>{
            state.loading=false;
            state.error=null;

        })
        .addCase(fetchAvailablePlans.fulfilled,(state,action)=>{
            state.loading=false;
            state.plans=action.payload;
        })

        .addCase(fetchAvailablePlans.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })

        //payments
        .addCase(fetchPaymentHistory.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        .addCase(fetchPaymentHistory.fulfilled,(state,action)=>{
            state.loading=false;
            state.payments=action.payload
        })

        .addCase(fetchPaymentHistory.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string
        })
    }
})


export const { clearBillingError } = companyBillingSlice.actions;

export default companyBillingSlice.reducer;