import type { JobApplicationResponse } from "../types/JobApplication";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
interface JobApplicationState {
    jobs: JobApplicationResponse[]
    loading: boolean
    error: string | null
}

const initialState: JobApplicationState = {
    jobs: [],
    loading: false,
    error: null,
}

const jobSlice = createSlice({
    name: "jobs",
    initialState,
    reducers: {
        setJobStart: (state) => {
            state.loading = true
        },
        createJobSuccess: (state, action: PayloadAction<JobApplicationResponse>) => {
            state.loading = false
            state.jobs.push(action.payload)
        },
        getJobByIdSuccess: (state, action: PayloadAction<JobApplicationResponse[]>) => {
            state.loading = false
            state.jobs = action.payload
        },
        updateJobSuccess: (state, action: PayloadAction<JobApplicationResponse>) => {
            state.loading = false
            const index = state.jobs.findIndex(
                job => job._id === action.payload._id
            )
            if (index !== -1) {
                state.jobs[index] = action.payload
            }
        },
        deleteJobSuccess: (state, action: PayloadAction<string | null>) => {
            state.loading = false
            state.jobs = state.jobs.filter((job) => job._id !== action.payload)
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
    getJobByIdSuccess,
    updateJobSuccess,
    deleteJobSuccess,
    setJobFailure,
} = jobSlice.actions

export default jobSlice.reducer