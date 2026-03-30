import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ProfileResponse } from "../types/setting.types";
import { settingsApi } from "../services/setting.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface SettingState {
    loading: boolean;
    error: string | null;
    profile: ProfileResponse | null
}

const initialState: SettingState = {
    loading: false,
    error: null,
    profile: null
}

export const getProfile = createAsyncThunk<
    ProfileResponse,
    void,
    { rejectValue: string }
>(
    "settings/getProfile",
    async (_, { rejectWithValue }) => {
        try {
            const res = await settingsApi.getProfile();
            return res.data
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const updateAvatar = createAsyncThunk<
    void,
    FormData,
    { rejectValue: string }
>(
    "settings/updateAvatar",
    async (formData, { rejectWithValue, dispatch }) => {
        try {
            await settingsApi.updateAvatar(formData);
            dispatch(getProfile());
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const updateProfile = createAsyncThunk<
    void,
    { name: string },
    { rejectValue: string }
>(
    "settings/updateProfile",
    async (data, { rejectWithValue, dispatch }) => {
        try {
            await settingsApi.updateProfile(data);
            dispatch(getProfile());
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);


export const updateCompanyLogo = createAsyncThunk<
    void,
    FormData,
    { rejectValue: string }
>(
    "settings/updateCompanyLogo",
    async (formData, { rejectWithValue, dispatch }) => {
        try {
            await settingsApi.updateCompanyLogo(formData);


            dispatch(getProfile());
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);


export const sendOtp = createAsyncThunk<
    void,
    void,
    { rejectValue: string }
>(
    "settings/sendOtp",
    async (_, { rejectWithValue }) => {
        try {
            await settingsApi.sendOtp();
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const verifyOtp = createAsyncThunk<
    void,
    { otp: string },
    { rejectValue: string }
>(
    "settings/verifyOtp",
    async ({ otp }, { rejectWithValue }) => {
        try {
            await settingsApi.verifyOtp(otp);
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const changePassword = createAsyncThunk<
    void,
    { newPassword: string },
    { rejectValue: string }
>(
    "settings/changePassword",
    async ({ newPassword }, { rejectWithValue }) => {
        try {
            await settingsApi.changePassword(newPassword);
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

const settingsSLice = createSlice({
    name: "settings",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })

            .addCase(updateAvatar.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateAvatar.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateAvatar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProfile.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

    }
})

export default settingsSLice.reducer;