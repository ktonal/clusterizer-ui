import React, {useContext, useState} from "react";
import {NotificationContainer} from 'react-notifications';
import {Waveform} from "./components/common/Waveform";
import ClusterizerApi from "./api";
import {usePromiseTracker} from "react-promise-tracker";
import {NewAnalysisForm} from "./components/stage2-analysis/NewAnalysisForm";
import {AnalysisController} from "./components/stage2-analysis/AnalysisController";
import {NewPreProcessingForm} from "./components/stage1-pre-processing/NewPreProcessingForm";
import {PreProcessingController} from "./components/stage1-pre-processing/PreProcessingController";
import {ProjectController} from "./components/project/ProjectController";
import {NewProjectForm} from "./components/project/NewProjectForm";
import {Accordion, AccordionContext, Button, Container, Spinner, useAccordionButton} from "react-bootstrap";
import {AuthContext, clientId} from "./Auth";
import {ProjectCard} from "./components/project/ProjectCard";
import {PreProcessingCard} from "./components/stage1-pre-processing/PreProcessingCard";
import {AnalysisCard} from "./components/stage2-analysis/AnalysisCard";
import {FiPlus} from "react-icons/fi";
import jwt_decode from "jwt-decode";

function Clusterizer({token}) {

    const [project, setProject] = useState({});
    const [preProcessing, setPreProcessing] = useState({});
    const [analysis, setAnalysis] = useState({});
    const [split, setSplit] = useState({});
    const [splits, setSplits] = useState([]);

    const [allProjects, addProject, deleteProject] = ProjectController({project, setProject});
    const {promiseInProgress: fetchingProjects} = usePromiseTracker({area: "project-list"});
    const {promiseInProgress: creatingNewProject} = usePromiseTracker({area: "new-project"});
    const {promiseInProgress: newFileUploading} = usePromiseTracker({area: "new-file"});

    const [allPreProcessing, addPreProcessing, deletePreProcessing] = PreProcessingController({
        project,
        preProcessing,
        setPreProcessing
    });
    const {promiseInProgress: fetchingPPs} = usePromiseTracker({area: "loading-pre-processings", delay: 0});
    const {promiseInProgress: creatingPP} = usePromiseTracker({area: "new-pre-processing"});

    const [allAnalysis, addAnalysis, deleteAnalysis, deleteSplit] = AnalysisController({
        analysis,
        setAnalysis,
        project,
        preProcessing,
        splits,
        setSplits
    });
    const {promiseInProgress: fetchingAnalysis} = usePromiseTracker({area: "loading-analysis"});
    const {promiseInProgress: creatingAnalysis} = usePromiseTracker({area: "new-analysis"});

    const {promiseInProgress: creatingSplits} = usePromiseTracker({area: "split"});

    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showPPForm, setShowPPForm] = useState(false);
    const [showAnalysisForm, setShowAnalysisForm] = useState(false);

    const AccordionHeader = (({children, eventKey, showForm, setShowForm}) => {
        const {activeEventKey} = useContext(AccordionContext);
        const toggleSection = useAccordionButton(eventKey, () => {
            if (activeEventKey !== eventKey) {
                // we are opening
                setShowForm(false)
            }
        });

        return (
            <div
                style={{display: "flex"}}
            >
                <Button
                    className={"m-3"}
                    variant={"outline-primary"} size={"md"} type={"button"}
                    onClick={() => {
                        if (activeEventKey !== eventKey) toggleSection(eventKey);
                        setShowForm(true);
                    }}>
                    <FiPlus/>
                </Button>
                <div style={{flex: 1, padding: "6px 0", display: "flex", alignItems: "center"}}
                     onClick={() => {
                         if (showForm && activeEventKey === eventKey) {
                             setShowForm(false);
                             return;
                         }
                         toggleSection(eventKey);
                     }}
                >
                    {children}
                </div>
                {/*<a className={"primary p-4"}>keep open</a>*/}
                {/*<span className={"p-4 text-muted"}>{eventKey}</span>*/}
            </div>
        );
    });
    return (
        <Container id={"root-container"}>
            <NotificationContainer/>
            <Accordion style={{width: "100%"}} defaultActiveKey={"project"}>
                <Accordion.Item eventKey={"project"}>
                    <AccordionHeader eventKey={"project"}
                                     showForm={showProjectForm}
                                     setShowForm={setShowProjectForm}>

                        <h4>{project.hasOwnProperty("name") ? project.name : null}</h4>
                        <span className={"mx-3"}>{project.file_name}</span>
                    </AccordionHeader>
                    <Accordion.Body className={"overflow-auto"}
                                    style={{maxHeight: "600px"}}>
                        {(creatingNewProject || newFileUploading || fetchingProjects)
                            ? <Spinner animation="border" role="status"
                                       style={{width: "100px", height: "100px", margin: "auto auto"}}/>
                            : (showProjectForm || (allProjects.length === 0)
                                ? <NewProjectForm addProject={
                                    (p, file) => {
                                        addProject(p, file);
                                        setShowProjectForm(false);
                                    }}/>
                                : (fetchingProjects ?
                                    <Spinner animation="border" role="status"
                                             style={{width: "100px", height: "100px", margin: "auto auto"}}/>
                                    : <div>{allProjects.map(p => {
                                        return <ProjectCard key={p.id}
                                                            project={p}
                                                            selectProject={setProject}
                                                            selectedId={project.id}
                                                            deleteProject={deleteProject}
                                        />;
                                    })}</div>))
                        }
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={"pre-processing"}>
                    <AccordionHeader eventKey={"pre-processing"}
                                     showForm={showPPForm}
                                     setShowForm={setShowPPForm}>
                        <h4>{preProcessing.hasOwnProperty("name") ? preProcessing.name : null}</h4>
                    </AccordionHeader>
                    <Accordion.Body className={"overflow-auto"}
                                    style={{maxHeight: "600px"}}>
                        {(creatingPP || fetchingPPs)
                            ? <Spinner animation="border" role="status"
                                       style={{width: "100px", height: "100px", margin: "auto auto"}}/>
                            : (showPPForm || (allPreProcessing.length === 0)
                                ? <NewPreProcessingForm addPreProcessing={pp => {
                                    addPreProcessing(pp, project.id);
                                    setShowPPForm(false);
                                }}/>
                                : <div>{allPreProcessing.map((pp) =>
                                    <PreProcessingCard key={pp.id}
                                                       preProcessing={pp}
                                                       selectedId={preProcessing.id}
                                                       selectPreProcessing={setPreProcessing}
                                                       deletePreProcessing={deletePreProcessing}

                                    />)
                                }</div>)}
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={"analysis"}>
                    <AccordionHeader eventKey={"analysis"}
                                     showForm={showAnalysisForm}
                                     setShowForm={setShowAnalysisForm}>
                        <h4>{analysis.hasOwnProperty("name") ? analysis.name : null}</h4>
                    </AccordionHeader>
                    <Accordion.Body className={"overflow-auto"}
                                    style={{maxHeight: "600px"}}>
                        {creatingAnalysis || fetchingAnalysis
                            ? <Spinner animation="border" role="status"
                                       style={{width: "100px", height: "100px", margin: "auto auto"}}/>
                            : (showAnalysisForm || (allAnalysis.length === 0)
                                ? <NewAnalysisForm addAnalysis={a => {
                                    addAnalysis(a);
                                    setShowAnalysisForm(false);
                                }}/>
                                : <div>{allAnalysis.map((a, index) => {
                                    return <AnalysisCard key={a.id}
                                                         analysis={a}
                                                         selectedId={analysis.id}
                                                         selectAnalysis={setAnalysis}
                                                         project={project}
                                                         deleteAnalysis={() => deleteAnalysis(a)}
                                    />
                                })
                                }</div>)}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            {creatingSplits ?
                <Spinner animation="border" role="status"
                         style={{width: "100px", height: "100px", margin: "auto auto"}}/>
                : null}
            <div>
                {
                    splits && token ?
                        splits.map((s) => <Waveform key={s.url}
                                                    split={s}
                                                    selectedUrl={split.url}
                                                    setSplit={setSplit}
                                                    removeSplit={() => deleteSplit(s)}
                                                    audioURL={`${new ClusterizerApi(token).baseUrl}/audio/${s.url}`}
                        />) : null}
            </div>
        </Container>
    )
}

function App() {
    const storedToken = localStorage.getItem("IdToken");
    const expiredToken = Number.parseInt(localStorage.getItem("IdTokenExpiresAt")) < Date.now();
    const [userLoaded, setUserLoaded] = useState(expiredToken);
    const [token, setToken] = useState(storedToken);

    window.onSignIn = (response) => {
        // Useful data for your client-side scripts:
        const decoded = jwt_decode(response.credential);
        const tk = response.credential;
        setToken(tk);
        setUserLoaded(true);
        localStorage.setItem("IdToken", tk);
        localStorage.setItem("IdTokenExpiresAt", decoded.exp.toString());
    };
    return (
        <Container>
            <div className="g_id_signin"
                 data-type="standard"
                 data-size="large"
                 data-theme="outline"
                 data-text="sign_in"
                 data-shape="rectangular"
                 data-logo_alignment="left"
                 style={{margin: "1rem 1rem 1rem auto", width: "max-content"}}
            >
            </div>
            {(!userLoaded)
                ? <div style={{margin: "auto", width: "max-content"}}>
                    <div id="g_id_onload"
                         data-client_id={clientId}
                         data-auto_select="true"
                         data-callback={"onSignIn"}
                    >
                    </div>

                    <Spinner animation="border" role="status"
                             style={{width: "300px", height: "300px", margin: "50px auto"}}/>
                </div>
                : <AuthContext.Provider value={{
                    token: token, setToken: setToken, expiresAt: localStorage.getItem("IdTokenExpiresAt"),
                    refreshToken: () => window.google.accounts.id.prompt()
                }}>
                    <>
                        <div id="g_id_onload"
                             data-client_id={clientId}
                             data-auto_select="true"
                             data-callback={"onSignIn"}
                        >
                        </div>
                        <Clusterizer token={token}/>
                    </>
                </AuthContext.Provider>
            }</Container>
    );
}

export default App;
