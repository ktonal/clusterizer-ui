import {useContext, useEffect, useState} from "react";
import {trackPromise} from "react-promise-tracker";
import ClusterizerApi, {errorHandler} from "../../api";
import {NotificationManager} from 'react-notifications';
import {AuthContext} from "../../Auth";

export function ProjectController({project, setProject}) {
    const {token} = useContext(AuthContext);

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        trackPromise(new ClusterizerApi(token).listProjects().then(({data}) => {
            setProjects(data);
            if (data.length > 0) NotificationManager.info("loaded projects")
        }).catch(err => errorHandler(err)), "project-list")
    }, [setProject, token]);

    useEffect(() => {
        // autoload first project
        if (projects.length > 0 && !project.hasOwnProperty("id")) setProject(projects[0])
    }, [projects, project, setProject]);

    const addProject = (p, file) => {
        trackPromise(
            new ClusterizerApi(token).createProject(p)
                .then((resp, err) => {
                    const project = resp.data;
                    setProject(project);
                    setProjects([project, ...projects]);
                    let formData = new FormData();
                    formData.append("file", file);
                    NotificationManager.info("added project");
                    trackPromise(
                        new ClusterizerApi(token).createInputFile(project.id, formData)
                            .then((resp) => {
                                NotificationManager.info("added file to project");
                                return resp.data;
                            })
                            .catch(err => errorHandler(err)), "new-file");
                }).catch(err => errorHandler(err)), "new-project");
    };

    const deleteProject = (projectId) => {
        trackPromise(
            new ClusterizerApi(token).deleteProject(projectId)
                .then((resp) => {
                    NotificationManager.info("deleted project");
                    if (projectId === project.id) setProject({});
                    setProjects([...projects.filter((p) => p.id !== projectId)])
                })
            , "delete-project")
    };

    return [projects, addProject, deleteProject]
}