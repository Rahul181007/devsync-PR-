import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { planApi } from "../services/plan.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";
import type { Plan } from "../typess/plan.types";

interface PlanState {

    loading: boolean;
    error: string | null;

    plans: Plan[];
    selectedPlan: Plan | null

    total: number;
    page: number;
    limit: number;
}

const initialState: PlanState = {

    loading: false,
    error: null,

    plans: [],
    selectedPlan: null,

    total: 0,
    page: 1,
    limit: 10

}

export const listPlans = createAsyncThunk<
    { items: Plan[]; total: number },
    {
        page?: number;
        limit?: number;
        search?: string;
        status?: "all" | "active" | "inactive";
    },
    { rejectValue: string }
>(
    "plan/listPlan",
    async (params, { rejectWithValue }) => {
        try {
            const response = await planApi.getPlans(params);

            return {
                items: response.data.data.items,
                total: response.data.data.total
            };
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const getPlanById = createAsyncThunk<
    Plan,
    string,
    { rejectValue: string }
>(
    "plan/getPlanById",
    async (planId, { rejectWithValue }) => {
        try {
            const res = await planApi.getPlanById(planId);
            return res.data.data
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const createPlan = createAsyncThunk<
    void,
    {
        data: {
            name: string;
            description: string;
            pricePerMonth: number;
            pricePerYear: number;
            currency: "USD" | "INR" | "EUR";
            features: string[];
            limits: {
                maxProjects: number;
                maxDevelopers: number;
                maxStorageGB: number;
            };
        };
        page: number;
        limit: number;
        search?: string;
        status?: "all" | "active" | "inactive";
    },
    { rejectValue: string }
>(
    "plan/createPlan",
    async ({ data, page, limit, search, status }, { dispatch, rejectWithValue }) => {
        try {
            await planApi.createPlan(data);
            dispatch(listPlans({ page, limit, search, status }))
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const updatePlan = createAsyncThunk<
    void,
    {
        planId: string;
        data: {
            name?: string;
            description?: string;
            pricePerMonth?: number;
            pricePerYear?: number;
            currency?: "USD" | "INR" | "EUR";
            features?: string[];
            limits?: {
                maxProjects?: number;
                maxDevelopers?: number;
                maxStorageGB?: number;
            };
            isActive?: boolean;
        };
        page: number;
        limit: number;
        search?: string;
        status?: "all" | "active" | "inactive";
    },
    { rejectValue: string }
>(
    "plan/updatePlan",
    async ({ planId, data, page, limit, search, status }, { dispatch, rejectWithValue }) => {
        try {

            await planApi.updatePlan(planId, data);

            dispatch(listPlans({ page, limit, search, status }));

        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);


export const deletePlan = createAsyncThunk<
    void,
    {
        planId: string;
        page: number;
        limit: number;
        search?: string;
        status?: "all" | "active" | "inactive";
    },
    { rejectValue: string }
>(
    "plan/deletePlan",
    async ({ planId, page, limit, search, status }, { dispatch, rejectWithValue }) => {
        try {

            await planApi.deletePlan(planId);

            dispatch(listPlans({ page, limit, search, status }));

        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);




const plansSlice = createSlice({
    name: "plans",
    initialState,
    reducers: {
        clearPlanError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(listPlans.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(listPlans.fulfilled, (state, action) => {
                state.loading = false;
                state.plans = action.payload.items;
                state.total = action.payload.total;
            })

            .addCase(listPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })

            .addCase(getPlanById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedPlan = null
            })
            .addCase(getPlanById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPlan = action.payload
            })
            .addCase(getPlanById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })

            .addCase(createPlan.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createPlan.fulfilled, (state) => {
                state.loading = false;

            })

            .addCase(createPlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })

            .addCase(updatePlan.pending, (state) => {
                state.loading = true
            })
            .addCase(updatePlan.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updatePlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(deletePlan.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePlan.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deletePlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
})


export const { clearPlanError } = plansSlice.actions;

export default plansSlice.reducer;