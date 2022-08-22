import axios, {Axios, AxiosError, AxiosResponse} from "axios";
import {Project} from "./types/Project";
import {NotificationManager} from 'react-notifications';

export default class ClusterizerApi {
    _axios: Axios;
    baseUrl: string;

    constructor(token) {
        this.baseUrl = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'http://0.0.0.0:8080';
        this._axios = axios.create(
            {
                baseURL: this.baseUrl,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            },);
    }

    login() {
        return this._axios.post("/login")
    }

    //// Projects
    listProjects(): Promise<AxiosResponse<Project[]>> {
        return this._axios.get<Project[]>("/project")
    }

    createProject(project) {
        return this._axios.post("/project", project)
    }

    updateProject(project) {
        return this._axios.put(`/project/`, project)
    }

    deleteProject(projectId) {
        return this._axios.delete(`/project`,
            {headers: {project_id: projectId}})
    }

    createInputFile(projectId, formData) {
        return this._axios.post(`/input-file`, formData,
            {headers: {project_id: projectId}});
    }

    //// Pre Processing

    listPreProcessings(projectId) {
        return this._axios.get("/pre-processing",
            {headers: {project_id: projectId}})
    }

    createPreProcessing(projectId, sr, repr, windowSize, hopLength, transforms) {
        return this._axios.post("/pre-processing",
            {
                sample_rate: sr,
                representation: repr,
                window_size: windowSize,
                hop_length: hopLength,
                transforms: transforms
            }, {headers: {project_id: projectId}},)
    }

    deletePeProcessing(projectId, preProcessingId) {
        return this._axios.delete(`/pre-processing/`,
            {headers: {project_id: projectId, pre_processing_id: preProcessingId}})
    }

    //// Analysis

    listAnalysis(projectId, preProcessingId) {
        return this._axios.get("/analysis", {
            headers: {project_id: projectId, pre_processing_id: preProcessingId}
        })
    }

    createAnalysis(projectId, analysis) {
        return this._axios.post("/analysis",
            analysis,
            {
                headers: {
                    project_id: projectId,
                    pre_processing_id: analysis.pre_processing_id
                }
            })
    }

    deleteAnalysis(projectId: string, analysis) {
        return this._axios.delete(`/analysis`,
            {
                headers: {
                    project_id: projectId,
                    pre_processing_id: analysis.pre_processing_id,
                    analysis_id: analysis.id
                }
            })
    }

    renameAnalysis(projectId, analysis, newName) {
        return this._axios.put("/analysis/name",
            newName,
            {
                headers: {
                    project_id: projectId,
                    pre_processing_id: analysis.pre_processing_id,
                    analysis_id: analysis.id
                }
            }
        )
    }

    singleSplit(projectId, analysis, split) {
        return this._axios.post("/split/result",
            {},
            {
                headers: {
                    project_id: projectId,
                    pre_processing_id: analysis.pre_processing_id,
                    analysis_id: analysis.id,
                    split_id: split.id
                }
            })
    }

    renameSplit(projectId, analysis, split, name) {
        return this._axios.put("/split/name",
            {split_id: split.id, name: name},
            {
                headers: {
                    project_id: projectId,
                    pre_processing_id: analysis.pre_processing_id,
                    analysis_id: analysis.id,
                    split_id: split.id
                }
            }
        )
    }

    getAnalysisResult(projectId, analysis) {
        return this._axios.get(`/analysis/result/${projectId}/${analysis.pre_processing_id}/${analysis.id}`,
            {
                headers: {
                    'Cache-Control': "public, max-age=604800, immutable",
                    project_id: projectId,
                    pre_processing_id: analysis.pre_processing_id,
                    analysis_id: analysis.id
                }
            })
    }

    // updateAnalysis(projectId, analysis) {
    //     // CAUTION! analysis state in FE !== in BE
    //     return this._axios.put(`/analysis`,
    //         analysis,
    //         {
    //             headers: {
    //                 project_id: projectId,
    //                 pre_processing_id: analysis.pre_processing_id
    //             }
    //         })
    // }

    listExports() {
        return this._axios.get("export")
    }

    createExport(projectId, exportObj) {
        return this._axios.post("/export",
            exportObj,
            {headers: {project_id: projectId}})
    }

    addSplitToExport(projectId, exportObj, split, index) {
        const data = {};
        data[index] = split.url;
        return this._axios.put("/export/split",
            {splits: data, export_id: exportObj.id},
            {headers: {project_id: projectId}})
    }

    deleteSplitFromExport(projectId, exportObj, index) {
        return this._axios.delete("export/split",
            {
                headers: {project_id: projectId},
                data: {index: index, export_id: exportObj.id}
            })
    }

    fetchAudioBlob(audioURL) {
        return this._axios.get("/audio/" + audioURL, {
            headers: {
                'Cache-Control': "public, max-age=604800, immutable",
                project_id: audioURL.split("/")[1]
            },
            responseType: "arraybuffer"
        }).then(response => {
            return new Blob([response.data])
        })
            .catch(err => {
                NotificationManager.error(err.toString())
            })
    }

    deleteSplit(split) {
        return this._axios.delete("/split",
            {
                headers: {
                    project_id: split.url.split("/")[1]
                }, data: split
            });
    }
}

export function errorHandler(err: AxiosError) {
    if (err.code === undefined) return;
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