import type { JobApplicationResponse } from "../types/JobApplication";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { PaginatedResponse } from "../types/pagination";
interface JobApplicationState {
    jobs: PaginatedResponse<JobApplicationResponse>
    loading: boolean
    error: string | null
}

const initialState: JobApplicationState = {
  jobs: {
    items: [],
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

const jobSlice = createSlice({
    name: "jobs",
    initialState,
    reducers: {
        setJobStart: (state) => {
            state.loading = true
        },
        createJobSuccess: (state, action: PayloadAction<JobApplicationResponse>) => {
            state.loading = false
            state.jobs.items.push(action.payload)
        },
        getJobsSuccess: (state, action: PayloadAction<PaginatedResponse<JobApplicationResponse>>) => {
            state.loading = false
            state.jobs = action.payload
        },
        updateJobSuccess: (state, action: PayloadAction<JobApplicationResponse>) => {
            state.loading = false
            const index = state.jobs.items.findIndex(
                job => job._id === action.payload._id
            )
            if (index !== -1) {
                state.jobs.items[index] = action.payload
            }
        },
        deleteJobSuccess: (state, action: PayloadAction<string | null>) => {
            state.loading = false
            state.jobs.items = state.jobs.items.filter((job) => job._id !== action.payload)
        },
        setJobFailure: (state, action: PayloadAction<string | null>) => {
            state.loading = false
            state.error = action.payload
        }
    }
})

export const {
    setJobStart,
    createJobSuccess,
    getJobsSuccess,
    updateJobSuccess,
    deleteJobSuccess,
    setJobFailure,
} = jobSlice.actions

export default jobSlice.reducer