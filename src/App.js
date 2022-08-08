import React, {useContext, useState} from "react";
import {NotificationContainer} from 'react-notifications';
import {WaveformContainer} from "./components/common/Waveform";
import ClusterizerApi from "./api";
import {usePromiseTracker} from "react-promise-tracker";
import {NewAnalysisForm} from "./components/stage2-analysis/NewAnalysisForm";
import {AnalysisController} from "./components/stage2-analysis/AnalysisController";
import {NewPreProcessingForm} from "./components/stage1-pre-processing/NewPreProcessingForm";
import {PreProcessingController} from "./components/stage1-pre-processing/PreProcessingController";
import {ProjectController} from "./components/project/ProjectController";
import {NewProjectForm} from "./components/project/NewProjectForm";
import {Accordion, AccordionContext, Button, Spinner, useAccordionButton} from "react-bootstrap";
import {AuthContext, clientId} from "./Auth";
import {ProjectCard} from "./components/project/ProjectCard";
import {PreProcessingCard} from "./components/stage1-pre-processing/PreProcessingCard";
import {AnalysisCard} from "./components/stage2-analysis/AnalysisCard";
import {FiPlus} from "react-icons/fi";
// import {ExportController} from "./components/stage3-export/ExportController";
import {Sortable} from "./components/common/Sortable";


const AccordionHeader = (({children, eventKey, showForm, setShowForm, secondaryChildren}) => {
    const {activeEventKey} = useContext(AccordionContext);
    const toggleSection = useAccordionButton(eventKey, () => {
        if (activeEventKey !== eventKey) {
            // we are opening
            setShowForm(false)
        }
    });

    return (
        <div style={{display: "flex"}}>
            <Button className={"m-3"}
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
            {secondaryChildren}
        </div>);
});

function Clusterizer() {
    const {token} = useContext(AuthContext);
    const [project, setProject] = useState({});
    const [preProcessing, setPreProcessing] = useState({});
    const [analysis, setAnalysis] = useState({});
    const [split, setSplit] = useState({});
    const [splits, setSplits] = useState([]);
    const [analysisResult, setAnalysisResult] = useState([]);

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

    const [allAnalysis, addAnalysis, deleteAnalysis, renameAnalysis, bounceAllSplit, downloadResult, deleteSplit, renameSplit, performSplit] = AnalysisController({
        analysis,
        setAnalysis,
        project,
        preProcessing,
        split,
        setSplit,
        splits,
        setSplits,
        setAnalysisResult,
    });
    const {promiseInProgress: fetchingAnalysis} = usePromiseTracker({area: "loading-analysis"});
    const {promiseInProgress: creatingAnalysis} = usePromiseTracker({area: "new-analysis"});

    const {promiseInProgress: creatingSplits} = usePromiseTracker({area: "split"});

    // const [currentExport, createExport, addSplitToExport, removeSplitFromExport, urlToObject, doExport] = ExportController({
    //     project,
    //     allAnalysis
    // });

    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showPPForm, setShowPPForm] = useState(false);
    const [showAnalysisForm, setShowAnalysisForm] = useState(false);
    // const [showExportForm, setShowExportForm] = useState(false);

    const [showExportSplits,] = useState(false);
    return (
        <div id={"root-container"}
             className={"mx-3"}>
            <NotificationContainer/>
            {project.hasOwnProperty("file_info") ?
                <>
                    <h3 style={{width: "max-content", margin: "auto"}}>
                        {project.file_info.name}
                    </h3>
                    <WaveformContainer
                        split={{...project.file_info, id: project.id}}
                        analysisResult={analysisResult}
                        selectedLabel={split.label}
                        setSplit={() => {
                        }}
                        renameSplit={null}
                    />
                </>
                : null
            }
            <br/>
            <Accordion style={{position: "fixed", maxHeight: "70vh"}}
                       className={"col-sm-4 overflow-auto"}
                       defaultActiveKey={["project"]}>

                <Accordion.Item eventKey={"project"}>
                    <AccordionHeader eventKey={"project"}
                                     showForm={showProjectForm}
                                     setShowForm={setShowProjectForm}
                    >

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
                                     setShowForm={setShowPPForm}
                    >
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
                                     setShowForm={setShowAnalysisForm}
                                     children={
                                         <h4>{analysis.hasOwnProperty("name") ? analysis.name : null}</h4>
                                     }
                        // secondaryChildren={
                        //     <span className={"mx-3"}
                        //           onClick={e => {
                        //               e.preventDefault();
                        //               setShowExportSplits(p => !p)
                        //           }}>
                        //        {showExportSplits ? "show list" : "hide list"}
                        //    </span>}
                    >

                    </AccordionHeader>
                    <Accordion.Body className={"overflow-auto"}
                                    style={{maxHeight: "600px"}}>
                        {creatingAnalysis || fetchingAnalysis || creatingSplits
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
                                                         downloadResult={downloadResult}
                                                         renameAnalysis={renameAnalysis}
                                                         bounceAllSplit={bounceAllSplit}
                                    />
                                })
                                }</div>)}
                    </Accordion.Body>
                </Accordion.Item>
                {/*<Accordion.Item eventKey={"export"}>*/}
                {/*    <AccordionHeader eventKey={"export"}*/}
                {/*                     showForm={showExportForm}*/}
                {/*                     setShowForm={setShowExportForm}*/}
                {/*                     children={*/}
                {/*                         <h4>{currentExport.hasOwnProperty("name") ? currentExport.name : "Export"}</h4>}*/}
                {/*                     secondaryChildren={*/}
                {/*                         <span className={"mx-3"} onClick={e => {*/}
                {/*                             e.preventDefault();*/}
                {/*                             setShowExportSplits(p => !p)*/}
                {/*                         }}>*/}
                {/*                {showExportSplits ? "hide list" : "show list"}*/}
                {/*            </span>}*/}
                {/*    >*/}
                {/*    </AccordionHeader>*/}
                {/*    <Accordion.Body className={"overflow-auto"}*/}
                {/*                    style={{maxHeight: "600px"}}>*/}
                {/*        {showExportForm*/}
                {/*            ? <NewExportForm setExport={e => {*/}
                {/*                createExport(e);*/}
                {/*                setShowExportForm(false);*/}
                {/*            }}/>*/}
                {/*            : <div>*/}
                {/*                {*/}
                {/*                    Object.entries(currentExport.splits).map(([i, splitURL]) => {*/}
                {/*                        const split = urlToObject(splitURL);*/}
                {/*                        if (split !== undefined) {*/}
                {/*                            return <p key={i + split.id}>*/}
                {/*                                {i}---{split.name} {split.label} {split.duration}*/}
                {/*                            </p>*/}
                {/*                        } else return null;*/}
                {/*                    })*/}
                {/*                }*/}
                {/*                {Object.entries(currentExport.splits).length > 0*/}
                {/*                    ? <Button variant={"outline-primary"}*/}
                {/*                              onClick={doExport}>*/}
                {/*                        Export*/}
                {/*                    </Button> : null}*/}
                {/*            </div>}*/}
                {/*    </Accordion.Body>*/}
                {/*</Accordion.Item>*/}
            </Accordion>
            <div className={"col-sm-8 offset-sm-4 overflow-auto"} style={{maxHeight: "70vh"}}>
                <h3 className={"mx-auto"}
                    style={{width: "max-content"}}>
                    {showExportSplits ?
                        "Export Splits"
                        : `${project.name} > ${analysis.name}`}
                </h3>
                <div className={"px-3"}>
                    {!showExportSplits && splits !== undefined && splits.length > 0 && token ?
                        <Sortable items={splits}
                                  excludeKeys={["id", "url"]}
                                  renderItem={(s) => {
                                      return (
                                          <WaveformContainer
                                              key={s.id}
                                              split={s}
                                              selectedId={split.id}
                                              setSplit={setSplit}
                                              removeSplit={() => deleteSplit(s)}
                                              addSplitToExport={() => {
                                              }}
                                              audioURL={s.url}
                                              performSplit={performSplit}
                                              renameSplit={renameSplit}
                                          />)
                                  }}/> : null}
                    {/*{showExportSplits && Object.entries(currentExport.splits) && token ?*/}
                    {/*    Object.entries(currentExport.splits).map(([i, u]) => {*/}
                    {/*        const s = urlToObject(u);*/}
                    {/*        if (s === undefined) return null;*/}
                    {/*        return <Waveform key={i + s.url}*/}
                    {/*                         split={s}*/}
                    {/*                         selectedUrl={split.url}*/}
                    {/*                         setSplit={setSplit}*/}
                    {/*                         removeSplit={() => removeSplitFromExport(i)}*/}
                    {/*                         addSplitToExport={null}*/}
                    {/*                         audioURL={s.url}*/}
                    {/*        />*/}
                    {/*    }) : null}*/}
                </div>
            </div>
        </div>
    )
}


function App() {
    const storedToken = localStorage.getItem("IdToken");
    const expiredStorage = localStorage.getItem("IdTokenExpiry");
    const expired = expiredStorage === null ? true : Number.parseInt(expiredStorage) < (Date.now() / 1000);
    const [userLoaded, setUserLoaded] = useState(!expired);
    const [token, setToken] = useState(expired ? null : storedToken);
    // const [userLoaded, setUserLoaded] = useState(false);
    // const [token, setToken] = useState(null);

    window.onSignIn = (response) => {
        const tk = response.credential;
        new ClusterizerApi(tk).login().then(res => {
            const token = res.data.access_token;
            setToken(token);
            setUserLoaded(true);
            localStorage.setItem("IdToken", token);
            localStorage.setItem("IdTokenExpiry", res.data.expires.toString());
        })
    };
    return (
        <div style={{padding: "30px 5px 0 5px"}}>
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
            {(!userLoaded || token === null)
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
                    token: token, setToken: setToken, expiresAt: localStorage.getItem("IdTokenExpiry"),
                    refreshToken: () => window.google.accounts.id.prompt()
                }}>
                    <>
                        <Clusterizer/>
                    </>
                </AuthContext.Provider>
            }</div>
    );
}

export default App;
