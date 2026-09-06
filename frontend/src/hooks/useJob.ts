import { clearJob, createJobSuccess, deleteJobSuccess, getJobsSuccess, getJobSuccess, setJobFailure, setJobStart, updateJobSuccess } from "../features/jobSlice"
import { handleAsync } from "../lib/handleAsync"
import { createJobRequest, deleteJobRequest, generateJobRequest, getJobRequest, getJobsRequest, updateJobRequest } from "../services/jobService"
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

    const getJobs = async (id: number, query: JobApplicationQuery) => {
        dispatch(setJobStart())
        const result = await handleAsync(() => getJobsRequest(id, query))
        if (result.success) dispatch(getJobsSuccess(result.data))
        else dispatch(setJobFailure(result.message))

        return result
    }

    const getJob = async (id: number) => {
        dispatch(setJobStart())
        const result = await handleAsync(() => getJobRequest(id))
        if (result.success) dispatch(getJobSuccess(result.data))
        else dispatch(setJobFailure(result.message))

        return result
    }

    const updateJob = async (id: number, form: JobApplicationFormType) => {
        dispatch(setJobStart())
        const result = await handleAsync(() => updateJobRequest(id, form))
        if (result.success) dispatch(updateJobSuccess(result.data))
        else dispatch(setJobFailure(result.message))

        return result
    }

    const deleteJob = async (id: number) => {
        dispatch(setJobStart())
        const result = await handleAsync(() => deleteJobRequest(id))
        if (result.success) dispatch(deleteJobSuccess(result.data.id))
        else dispatch(setJobFailure(result.message))

        return result
    }

    const generateJob = async (jobUrl: string) => {
        dispatch(setJobStart())
        const result = await handleAsync(() => generateJobRequest(jobUrl))
        if (result.success) dispatch(createJobSuccess(result.data))
        else dispatch(setJobFailure(result.message))
    }

    const resetJob = () => {
        dispatch(clearJob())
    }

    return { createJob, getJobs, getJob, updateJob, deleteJob, generateJob, resetJob }
}