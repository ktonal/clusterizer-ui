import axios, {Axios, AxiosError, AxiosResponse} from "axios";
import {Project} from "./types/Project";
import {NotificationManager} from 'react-notifications';

export default class ClusterizerApi {
    _axios: Axios;
    baseUrl: string;

    constructor(token) {
        this.baseUrl = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'http://0.0.0.0:80';
        this._axios = axios.create(
            {
                baseURL: this.baseUrl,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            },);
    }

    //// Projects
    listProjects(): Promise<AxiosResponse<Project[]>> {
        return this._axios.get<Project[]>("/project")
    }


    getProject(projectId) {
        return this._axios.get(`/project/${projectId}`)
    }

    createProject(project) {
        return this._axios.post("/project", project)
    }

    updateProject(project) {
        return this._axios.put(`/project/${project.id}`, project)
    }

    deleteProject(projectId) {
        return this._axios.delete(`/project/${projectId}`)
    }

    createInputFile(projectId, formData) {
        return this._axios.post(`/input-file?project_id=${projectId}`, formData);
    }


    //// Pre Processing

    listPreProcessings(projectId) {
        return this._axios.get("/pre-processing",
            {params: {project_id: projectId}})
    }

    createPreProcessing(projectId, sr, repr, windowSize, hopLength) {
        return this._axios.post("/pre-processing", {
            sample_rate: sr,
            representation: repr,
            window_size: windowSize,
            hop_length: hopLength
        }, {params: {"project_id": projectId}},)
    }

    deletePeProcessing(projectId, preProcessingId) {
        return this._axios.delete(`/pre-processing/${preProcessingId}`,
            {params: {"project_id": projectId}})
    }

    //// Analysis

    listAnalysis(projectId, preProcessingId) {
        return this._axios.get("/analysis", {
            params: {
                project_id: projectId, pre_processing_id: preProcessingId
            }
        })
    }

    createAnalysis(projectId, analysis) {
        return this._axios.post("/analysis", analysis,
            {params: {project_id: projectId}})
    }

    deleteAnalysis(projectId: string, analysis) {
        return this._axios.delete(`/analysis/${analysis.id}`,
            {params: {"project_id": projectId, "pre_processing_id": analysis.pre_processing_id}})
    }

    split(projectId, analysis) {
        return this._axios.post("/split", analysis,
            {params: {project_id: projectId}})
    }

    updateAnalysis(projectId: any, analysis: {}) {
        return this._axios.put(`/analysis`, analysis,
            {params: {"project_id": projectId}})
    }
}

export function errorHandler(err: AxiosError) {
    if (err.code === undefined) return
    switch (err.response?.status) {
        case 401:
            NotificationManager.error("Unauthorized! Please login");
            break;
        case 422:
            NotificationManager.error("Unprocessable Request! Maybe some arguments are missing or wrong...");
            break;
        case 500:
            NotificationManager.error(`Server Error! ${err.response?.data}`)

    }
}