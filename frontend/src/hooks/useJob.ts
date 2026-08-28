import { createJobSuccess, deleteJobSuccess, getJobsSuccess, setJobFailure, setJobStart, updateJobSuccess } from "../features/jobSlice"
import { handleAsync } from "../lib/handleAsync"
import { createJobRequest, deleteJobRequest, getJobsRequest, updateJobRequest } from "../services/jobService"
import type { JobApplicationFormType } from "../types/JobApplication"
import type { JobApplicationQuery } from "../types/pagination"
import { useAppDispatch } from "./reduxHooks"

export const useJob = () => {
    const dispatch = useAppDispatch()

    const createJob = async (form: JobApplicationFormType) => {
        dispatch(setJobStart())
        const result = await handleAsync(() => createJobRequest(form))
        if (result.success) dispatch(createJobSuccess(result.data))
        else dispatch(setJobFailure(result.message))
        return result
    }

    const getJobs = async (query: JobApplicationQuery) => {
        dispatch(setJobStart())
        const result = await handleAsync(() => getJobsRequest(query))
        if (result.success) dispatch(getJobsSuccess(result.data))
        else dispatch(setJobFailure(result.message))

        return result
    }

    const updateJob = async (id: string, form: JobApplicationFormType) => {
        dispatch(setJobStart())
        const result = await handleAsync(() => updateJobRequest(id, form))
        if (result.success) dispatch(updateJobSuccess(result.data))
        else dispatch(setJobFailure(result.message))

        return result
    }

    const deleteJob = async (id: string) => {
        dispatch(setJobStart())
        const result = await handleAsync(() => deleteJobRequest(id))
        if (result.success) dispatch(deleteJobSuccess(result.data._id))
        else dispatch(setJobFailure(result.message))

        return result
    }

    return { createJob, getJobs, updateJob, deleteJob }
}