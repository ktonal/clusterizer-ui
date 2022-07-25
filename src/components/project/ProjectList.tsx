import * as React from 'react'
import {usePromiseTracker} from "react-promise-tracker";
import {TailSpin} from "react-loader-spinner";
import {ProjectCard} from "./ProjectCard";


export function ProjectList({allProjects, selectedProject, selectProject, deleteProject}) {
    const {promiseInProgress: fetchingProjects} = usePromiseTracker({area: "project-list"});
    const {promiseInProgress: creatingNewProject} = usePromiseTracker({area: "new-project"});
    const {promiseInProgress: newFileUploading} = usePromiseTracker({area: "new-file"});

    return (
        <div className={"list-container"}>
            {(creatingNewProject || newFileUploading || fetchingProjects) ? <TailSpin/> : null}
            {fetchingProjects ?
                <TailSpin/>
                :
                allProjects.map((p) => <ProjectCard key={p.id}
                                                    project={p}
                                                    selectProject={selectProject}
                                                    selectedId={selectedProject.id}
                                                    deleteProject={deleteProject}
                />)}
        </div>
    )
}