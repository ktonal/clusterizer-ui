import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Card, Spinner} from "react-bootstrap";
import Peaks from 'peaks.js';
import {FiTrash, FiPlay, FiPause, FiDownload} from "react-icons/fi";
import {AuthContext} from "../../Auth";
import ClusterizerApi from "../../api";
import {LabelStat} from "../stage2-analysis/LabelStat";
import {Editable} from "./Editable";
import {usePromiseTracker} from "react-promise-tracker";


function fetchAudioElementContent(audioURL, audioEl, token) {
    return new ClusterizerApi(token).fetchAudioBlob(audioURL)
        .then(blob => {
            audioEl.src = URL.createObjectURL(blob);
            return audioEl.src;
        })
}

function DownloadAudio(audioURL, token, filename) {
    return new ClusterizerApi(token).fetchAudioBlob(audioURL)
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${filename}.mp3`); //or any other extension
            document.body.appendChild(link);
            link.click();
        })
}

function LabelOverlay({analysisResult, label, totalWidth, color}) {
    const N = analysisResult.length;
    const width = (totalWidth / N) + "px";
    return <>{label !== null &&
    analysisResult.map((x, i) => {
        if (x !== label) return null;
        const position = (i * (totalWidth / N)) + "px";
        return <div key={i}
                    style={{
                        position: "absolute", width: width, height: "100%",
                        left: position,
                        // bottom: "10%",
                        backgroundColor: "rgba(255,200,0,0.41)",
                        zIndex: 1000
                    }}>

        </div>
    })
    }</>
}

function WaveformControls({addSplitToExport, removeSplit, split}) {
    const {token} = useContext(AuthContext);
    return (
        <div className={"add-split-button"}>
            <Button className={"mx-1 my-2"}
                    variant={"outline-danger"} size={"sm"} type={"button"}
                    onClick={() => {
                        removeSplit();
                    }}>
                <FiTrash/>
            </Button>
            {/*<Button className={"mx-1 my-2"}*/}
            {/*        variant={"outline-primary"} size={"sm"} type={"button"}*/}
            {/*        onClick={() => addSplitToExport()}>*/}
            {/*    <FiPlus/>*/}
            {/*</Button>*/}
            <Button className={"mx-1 my-2"}
                    disabled={split.url === null}
                    variant={"outline-primary"} size={"sm"} type={"button"}
                    onClick={() => DownloadAudio(split.url, token, split.name)}>
                <FiDownload/>
            </Button>
        </div>
    )
}

export function WaveformContainer(
    {
        split,
        addSplitToExport,
        removeSplit,
        setSplit,
        selectedId,
        analysisResult,
        selectedLabel,
        performSplit,
        renameSplit
    }) {
    const [playing, setPlaying] = useState(false);
    const [divWidth, setDivWidth] = useState(-1);
    const playButton = useRef();
    const {promiseInProgress: bouncingSplit} = usePromiseTracker({area: "bounce-split-" + split.id});
    useEffect(() => {
        const div = document.getElementById('top' + split.url);
        setDivWidth(div.offsetWidth - 120);
        const eventListener = (e) => {
            if (e.code === 'Space') {
                playButton.current.click();
                e.preventDefault();
            }
        };
        if (selectedId === split.id) {
            div.addEventListener("keydown", eventListener)
        } else {
            div.removeEventListener("keydown", eventListener)
        }
    }, [divWidth, selectedId, split, playButton]);
    return (
        <Card className={"m-2 waveform-container"}
              border={split.id === selectedId ? "primary" : ""}
              id={"top" + split.url}
              onClick={() => {
                  setSplit(split)
              }}
        >
            <div style={{marginLeft: split.url === null ? "0" : "78px", position: "relative"}}>

                {split.url !== null ?
                    <>
                        <Button className={"mx-4 play-button"}
                                variant={"outline-primary"} size={"lg"} type={"button"}
                                style={{display: "inline-block"}}
                                onClick={() => setPlaying(!playing)}
                                id={"play-" + split.url}
                                ref={playButton}
                        >
                            {playing ? <FiPause/> : <FiPlay/>}
                        </Button>
                        {analysisResult &&
                        <LabelOverlay totalWidth={divWidth}
                                      analysisResult={analysisResult}
                                      label={selectedLabel}/>}
                        <Waveform audioURL={split.url} divWidth={divWidth}
                                  playing={playing} setPlaying={setPlaying}
                                  playButton={playButton}
                                  audioName={renameSplit === null ? '' : split.name}
                                  renameAudio={(newName) => renameSplit(split, newName)}
                        />
                        <WaveformControls
                            split={split} addSplitToExport={addSplitToExport} removeSplit={removeSplit}
                        />
                    </> :
                    <>
                        {bouncingSplit
                            ? <Spinner animation="border" role="status"
                                       className={"m-3"}
                                       style={{width: "100px", height: "100px", margin: "auto auto"}}/>

                            : <LabelStat split={split} performSplit={performSplit} removeSplit={removeSplit}
                                         renameSplit={renameSplit}
                            />}

                    </>
                }
            </div>
        </Card>)
}

export function Waveform({audioURL, divWidth, playing, setPlaying, playButton, audioName, renameAudio}) {
    const {token} = useContext(AuthContext);
    const [peaks, setPeaks] = useState(null);

    useEffect(() => {
        const containerEl = document.getElementById('overview' + audioURL);

        const audioEl = document.getElementById(audioURL);
        fetchAudioElementContent(audioURL, audioEl, token);
        if (peaks !== null) {
            peaks.views.destroyOverview();
            peaks.views.createOverview(containerEl);
            peaks.setSource({mediaUrl: audioEl.src}, () => {
            });
        }
        const audioContext = new AudioContext();
        const options = {
            zoomview: {
                container: document.getElementById('zoomview' + audioURL),
                waveformColor: '#538ece',
                playheadColor: '#000000',
            },
            overview: {
                container: containerEl,
                highlightColor: 'rgba(1, 1, 1, 0)',
                waveformColor: '#969696',
                playheadColor: 'rgba(26,26,26,0.73)',
            },

            mediaElement: audioEl,
            webAudio: {
                audioContext: audioContext,
                scale: 128,
                multiChannel: false
            },
        };

        Peaks.init(options, function (err, instance) {
            if (instance !== undefined) {
                if (peaks === null) setPeaks(instance);
                // peaks.setSource({mediaUrl: audioEl.src}, () => {
                // });
                const view = instance.views.getView('overview');
                view.showPlayheadTime(true);
                view.fitToContainer();

                instance.on('overview.dblclick', () => {
                    setPlaying(true);
                });
                instance.on("overview.click", () => {
                    // const playButton = document.getElementById("play-" + audioURL);
                    playButton.current.focus();
                });
                instance.on("player.seeked", () => {
                    // const playButton = document.getElementById("play-" + audioURL);
                    playButton.current.focus();
                });
                instance.on("player.ended", () => {
                    setPlaying(false)
                });
            }
        });


    }, [audioURL, token, playButton, setPlaying, peaks]);

    useEffect(() => {
        if (peaks === null) return;
        if (playing) {
            peaks.player.play();
        } else {
            peaks.player.pause()
        }
    }, [playing, peaks]);

    return (
        <>
            <span style={{position: "absolute", right: "1em", top: "1em"}}>
                <Editable value={audioName} onSubmit={(newName) => renameAudio(newName)}/>
            </span>
            <div id={"overview" + audioURL}
                 style={{height: "178px", width: divWidth + "px"}}
            >
            </div>

            <audio id={audioURL} crossOrigin="anonymous"/>
        </>)
}