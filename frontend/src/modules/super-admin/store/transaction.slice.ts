import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Transaction } from "../typess/transaction.type";
import { transactionApi } from "../services/transaction.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface TransactionState {
    items: Transaction[];
    loading: boolean;
    error: string | null;

    page: number;
    limit: number;
    total: number;

    search: string;
    status: "ALL" | "PENDING" | "SUCCESS" | "FAILED";
    fromDate: string;
    toDate: string;

    recentTransactions: Transaction[];
}

type TransactionQuery = {
    page: number;
    limit: number;
    search?: string;
    status?: "PENDING" | "SUCCESS" | "FAILED";
    fromDate?: string;
    toDate?: string;
};

const initialState: TransactionState = {
    items: [],
    loading: false,
    error: null,
    page: 1,
    limit: 10,
    total: 0,

    search: "",
    status: "ALL",
    fromDate: "",
    toDate: "",
    recentTransactions: [],
}

export const fetchTransactions = createAsyncThunk(
    "transactions/fetch",
    async (
        params: {
            page: number;
            limit: number;
            search?: string;
            status?: "ALL" | "PENDING" | "SUCCESS" | "FAILED";
            fromDate?: string;
            toDate?: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const query: TransactionQuery = {
                page: params.page,
                limit: params.limit
            }

            if (params.search?.trim()) {
                query.search = params.search.trim();
            }

            if (params.status && params.status !== "ALL") {
                query.status = params.status;
            }

            if (params.fromDate) {
                query.fromDate = params.fromDate;
            }

            if (params.toDate) {
                query.toDate = params.toDate;
            }

            const res = await transactionApi.getTransactions(query);
            return res.data.data
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const fetchRecentTransactions = createAsyncThunk<
    Transaction[],
    void,
    { rejectValue: string }
>(
    "transactions/fetchRecent",
    async (_, { rejectWithValue }) => {
        try {
            const res = await transactionApi.getTransactions({
                page: 1,
                limit: 5
            });

            return res.data.data.data;
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);



export const downloadInvoice = createAsyncThunk<
    Blob,
    string,
    { rejectValue: string }
>(
    "transactions/downloadInvoice",
    async (invoiceId, { rejectWithValue }) => {
        try {
            const res = await transactionApi.downloadInvoice(invoiceId);
            return res.data;
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);


const transactionSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        setPage(state, action: PayloadAction<number>) {
            state.page = action.payload;
        },
        setSearch(state, action: PayloadAction<string>) {
            state.search = action.payload;
            state.page = 1;
        },
        setStatus(state, action: PayloadAction<TransactionState["status"]>) {
            state.status = action.payload;
            state.page = 1;
        },

        setFromDate(state, action: PayloadAction<string>) {
            state.fromDate = action.payload;
            state.page = 1;
        },
        setToDate(state, action: PayloadAction<string>) {
            state.toDate = action.payload;
            state.page = 1;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data;
                state.total = action.payload.total;
                state.limit = action.payload.limit;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchRecentTransactions.fulfilled, (state, action) => {
                state.recentTransactions = action.payload;
            })
    }
});

export const { setPage, setSearch, setStatus, setFromDate, setToDate } = transactionSlice.actions;
export default transactionSlice.reducer;