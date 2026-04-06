import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { TaskAttachment, TaskComment, TaskDetail, TaskListItem, TaskPriority, TaskType } from "../types/task.types";
import { taskApi } from "../services/task.api";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface TaskState {
    loading: boolean;
    error: string | null;
    tasks: TaskListItem[];
    selectedTask: TaskDetail | null;
    comments: TaskComment[];
    commentsLoading: boolean;
    attachments: TaskAttachment[];
    attachmentsLoading: boolean;
}

const initialState: TaskState = {
    loading: false,
    error: null,
    tasks: [],
    selectedTask: null,

    comments: [],
    commentsLoading: false,
    attachments: [],
    attachmentsLoading: false,
}

export const getProjectTasks = createAsyncThunk<
    TaskListItem[],
    string,
    { rejectValue: string }
>(
    "task/getProjectTasks",
    async (projectId, { rejectWithValue }) => {
        try {
            const res = await taskApi.getProjectTask(projectId);
            return res.data.data
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const getTaskDetail = createAsyncThunk<
    TaskDetail,
    { projectId: string; taskId: string },
    { rejectValue: string }
>(
    "task/getTaskDetail",
    async ({ projectId, taskId }, { rejectWithValue }) => {
        try {
            const res = await taskApi.getTaskDetail(projectId, taskId);
            return res.data.data
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
)

export const updateTaskStatus = createAsyncThunk<
    void,
    {
        projectId: string;
        taskId: string;
        status: "IN_PROGRESS" | "COMPLETED";
    },
    { rejectValue: string }
>(
    "task/updateTaskStatus",
    async ({ projectId, taskId, status }, { dispatch, rejectWithValue }) => {
        try {
            await taskApi.updateTaskStatus(projectId, taskId, status)
            dispatch(getProjectTasks(projectId))
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const createTask = createAsyncThunk<
    void,
    {
        projectId: string;
        data: {
            title: string;
            description: string;
            type: TaskType;
            priority: TaskPriority;
            parentId?: string | null;
            assigneeId?: string | null;
            dueDate?: string | null
            estimatedTime?: number|null;
            storyPoints?: number | null;
        }
    },
    { rejectValue: string }
>(
    "task/createTask",
    async ({ projectId, data }, { rejectWithValue }) => {
        try {
            await taskApi.createTask(projectId, data)
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const updateTask = createAsyncThunk<
    void,
    {
        projectId: string;
        taskId: string;
        data: {
            title?: string
            description?: string
            type?: TaskType
            priority?: TaskPriority
            dueDate?: string | null
            estimatedTime?:number|null
            storyPoints?: number | null;
        }
    },
    { rejectValue: string }
>(
    "task/updateTask",
    async ({ projectId, taskId, data }, { dispatch, rejectWithValue }) => {
        try {
            console.log("task",data)
            await taskApi.updateTask(projectId, taskId, data)

            dispatch(getProjectTasks(projectId))
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const getTaskComments = createAsyncThunk<
    TaskComment[],
    { projectId: string; taskId: string },
    { rejectValue: string }
>(
    "task/getTaskComments",
    async ({ projectId, taskId }, { rejectWithValue }) => {
        try {
            const res = await taskApi.getTaskComment(projectId, taskId);
            return res.data.data;
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);


export const addTaskComment = createAsyncThunk<
    void,
    { projectId: string; taskId: string; message: string },
    { rejectValue: string }
>(
    "task/addTaskComment",
    async ({ projectId, taskId, message }, { dispatch, rejectWithValue }) => {
        try {
            await taskApi.addComment(projectId, taskId, message);

            // refresh comments
            dispatch(getTaskComments({ projectId, taskId }));
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);


export const uploadTaskAttachment = createAsyncThunk<
    void,
    { projectId: string; taskId: string; file: File },
    { rejectValue: string }
>(
    "task/uploadAttachment",
    async ({ projectId, taskId, file }, { dispatch, rejectWithValue }) => {
        try {
            await taskApi.uploadTaskAttachment(projectId, taskId, file);

            dispatch(getTaskAttachments({ projectId, taskId }));
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const getTaskAttachments = createAsyncThunk<
    TaskAttachment[],
    { projectId: string; taskId: string },
    { rejectValue: string }
>(
    "task/getAttachments",
    async ({ projectId, taskId }, { rejectWithValue }) => {
        try {
            const res = await taskApi.getTaskAttachments(projectId, taskId);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);


const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        clearTaskError(state) {
            state.error = null
        },
        clearSelectedTask(state) {
            state.selectedTask = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProjectTasks.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getProjectTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload
            })
            .addCase(getProjectTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })

            .addCase(getTaskDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTaskDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTask = action.payload
            })
            .addCase(getTaskDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })

            // GET COMMENTS
            .addCase(getTaskComments.pending, (state) => {
                state.commentsLoading = true;
            })
            .addCase(getTaskComments.fulfilled, (state, action) => {
                state.commentsLoading = false;
                state.comments = action.payload;
            })
            .addCase(getTaskComments.rejected, (state) => {
                state.commentsLoading = false;
            })

            .addCase(getTaskAttachments.pending, (state) => {
                state.attachmentsLoading = true;
            })
            .addCase(getTaskAttachments.fulfilled, (state, action) => {
                state.attachmentsLoading = false;
                state.attachments = action.payload;
            })
            .addCase(getTaskAttachments.rejected, (state) => {
                state.attachmentsLoading = false;
            })
    }
})


export const { clearTaskError, clearSelectedTask } = taskSlice.actions;
export default taskSlice.reducer