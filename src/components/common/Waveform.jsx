import React, {useContext, useEffect, useReducer, useRef, useState} from "react";
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

// function LabelOverlay(
//     {
//         analysisResult,
//         label,
//         totalWidth,
//         totalDuration,
//         displayedSegment,
//         }) {
//     const N = analysisResult.length;
//     const zoomFactor = (displayedSegment.endTime - displayedSegment.startTime) / totalDuration;
//     const width = zoomFactor * (totalWidth / N) + "px";
//     return <>{label !== null &&
//     analysisResult.map((x, i) => {
//         if (x !== label) return null;
//         const position = (i * (totalWidth / N)) + "px";
//         if (position < displayedSegment.startTime || position > displayedSegment.endTime) return null;
//         return <div key={i}
//                     style={{
//                         position: "absolute", width: width, height: "100%",
//                         left: position,
//                         // bottom: "10%",
//                         backgroundColor: "rgba(255,200,0,0.41)",
//                         zIndex: 1000
//                     }}>
//
//         </div>
//     })
//     }</>
// }

function WaveformControls({addSplitToExport, removeSplit, split}) {
    const {token} = useContext(AuthContext);
    return (
        <div className={"add-split-button"}
        >
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
    const [displayed, setDisplayed] = useState({start: 0, end: 120.});
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
    const segments = [];
    if (analysisResult !== undefined) {
        let thisSegment = {startTime: displayed.start};
        let frameDur = split.duration / analysisResult.length;
        let lastLabel = analysisResult[0];
        let i = Math.max(0, Number.parseInt((displayed.start / frameDur).toString()));
        let endFrame = Number.parseInt((displayed.end / frameDur).toString());
        while (i < analysisResult.length) {
            if (analysisResult[i] !== lastLabel && lastLabel === selectedLabel) {
                thisSegment.endTime = i * frameDur;
                thisSegment.labelText = `label=${lastLabel.toString()}; frames=${Number.parseInt((thisSegment.startTime / frameDur).toString())}-${i}`;
                segments.push(thisSegment);
            } else if (analysisResult[i] !== lastLabel && analysisResult[i] === selectedLabel) {
                thisSegment = {startTime: i * frameDur, endTime: 0, color: 'rgb(249,195,40)'};
            }
            lastLabel = analysisResult[i];
            i++;
            if (i > endFrame) break;
        }
    }
    return (
        <>
            <Card className={"m-2 waveform-container"}
                  border={split.id === selectedId ? "primary" : ""}
                  id={"top" + split.url}
                  onClick={() => {
                      setSplit(split)
                  }}
                  style={{backgroundColor: 'rgba(249,249,249,0.82)'}}
            >
                <div style={{
                    marginLeft: split.url === null ? "0" : "78px", position: "relative",
                }}
                >

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
                            <Waveform audioURL={split.url} divWidth={divWidth}
                                      playing={playing} setPlaying={setPlaying}
                                      playButton={playButton}
                                      audioName={renameSplit === null ? '' : split.name}
                                      renameAudio={(newName) => renameSplit(split, newName)}
                                      segments={segments}
                                      setDisplayed={setDisplayed}
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
            </Card>
            {split.url && (split.duration > 20) &&
            <div id={"overview" + split.url}
                 style={{
                     height: "28px", width: divWidth + "px", position: 'relative',
                     margin: '4px auto 4px 82px',
                     border: '1px solid gray'
                 }}>
            </div>}
        </>)
}

export function Waveform(
    {
        audioURL,
        divWidth,
        playing,
        setPlaying,
        playButton,
        audioName,
        renameAudio,
        segments,
        setDisplayed,
    }) {
    const {token} = useContext(AuthContext);
    const [peaks, setPeaks] = useState(null);
    const [selection, setSelection] = useState({capture: false, selectionStart: null, selectionEnd: null});
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case 'init':
                const {token, setPlaying, playButton} = action.payload;

                return {
                    ...state,
                    token: token, setPlaying: setPlaying, playButton: playButton,
                };
            case 'newAudio':
                const url = action.payload;
                const containerEl = document.getElementById('zoomview' + url);
                const overviewEl = document.getElementById('overview' + url);
                const audioEl = document.getElementById(url);
                fetchAudioElementContent(url, audioEl, state.token);
                const audioContext = new AudioContext();
                const options = {
                    zoomview: {
                        container: containerEl,
                        waveformColor: 'rgba(63,94,103,0.8)',
                        playheadColor: '#000000',
                        wheelMode: "scroll"
                    },
                    overview: {
                        container: overviewEl,
                        waveformColor: 'rgba(63,94,103,0.8)',
                        playheadColor: '#000000',
                        showAxisLabels: false,
                        highlightColor: "rgba(64,94,103,0.51)",
                        highlightOffset: 0,
                    },
                    zoomLevels: [16],
                    mediaElement: audioEl,
                    webAudio: {
                        audioContext: audioContext,
                        scale: 16,
                        multiChannel: false
                    },
                    segmentStartMarkerColor: '#a0a0a0',
                    segmentEndMarkerColor: '#a0a0a0',
                    randomizeSegmentColor: false,
                    // segmentColor: '#000000',
                    segments: segments,
                };
                if (peaks === null) {
                    Peaks.init(options, function (err, instance) {
                        setPeaks(instance);
                    });
                } else {
                    peaks.setSource({
                        mediaUrl: state.audioEl.src, webAudio: {
                            audioContext: new AudioContext(),
                            scale: 16,
                            multiChannel: false
                        },
                    }, () => {
                        const dur = Math.min(peaks.player.getDuration(), 120.);
                        const zoomView = peaks.views.getView("zoomview");
                        zoomView.setZoom({seconds: dur});
                        setDisplayed({start: zoomView.getStartTime(), end: zoomView.getEndTime()})
                    });
                }
                return {
                    ...state, containerEl: containerEl,
                    audioEl: audioEl,
                    audioURL: audioURL,
                };
            case 'newSegment':
                if (peaks !== null) {
                    peaks.segments.removeAll();
                    segments.forEach(s => peaks.segments.add(s));
                    return {...state, segments: segments};
                }
                return state;
            case 'newPeak':
                const view = peaks.views.getView('zoomview');
                view.showPlayheadTime(true);
                view.setZoom({seconds: Math.min(state.audioEl.duration, 120.)});
                if (setDisplayed !== undefined) {
                    setDisplayed({start: view.getStartTime(), end: view.getEndTime()});
                }

                peaks.on('zoomview.dblclick', () => {

                });
                peaks.on("zoomview.click", () => {
                    state.playButton.current.focus();
                });
                peaks.on("player.seeked", () => {
                    // const playButton = document.getElementById("play-" + audioURL);
                    state.playButton.current.focus();
                });
                peaks.on("player.ended", () => {
                    state.setPlaying(false)
                });

                state.containerEl.addEventListener("dblclick", (event) => {
                    if (event.altKey && event.shiftKey) {
                        view.setZoom(
                            {seconds: Math.min(peaks.player.getDuration(), 120.)})
                    } else {
                        state.setPlaying(true);
                        state.playButton.current.click();
                    }
                })

                state.containerEl.addEventListener("wheel", (event) => {
                    const zoomview = peaks.views.getView('zoomview');

                    if (!zoomview) return;

                    if (event.shiftKey && event.altKey) {
                        // @ts-ignore
                        const maxScale = zoomview._getScale(Math.min(peaks.player.getDuration(), 120.));

                        zoomview.setZoom({
                            // @ts-ignore
                            scale: Math.max(Math.min(zoomview._scale * (event.wheelDelta > 0 ? 1.1 : .9), maxScale), 16),
                        });
                        setDisplayed({start: zoomview.getStartTime(), end: zoomview.getEndTime()});
                        event.preventDefault();
                    } else {
                        zoomview.setStartTime(
                            // @ts-ignore
                            zoomview.pixelsToTime(zoomview._frameOffset) + event.deltaX / 100
                        );
                        setDisplayed({start: zoomview.getStartTime(), end: zoomview.getEndTime()});
                    }
                });
                return {...state, peaks: peaks};
            default:
                return state;
        }
    }, {
        audioURL: null, peaks: null, segments: [],
        containerEl: null,
        audioEl: null,
        playButton: null, setPlaying: null, token: null
    });

    useEffect(() => {
        if (![token, setPlaying, playButton].some(x => x === undefined)) {
            dispatch({
                type: 'init',
                payload: {
                    token: token, setPlaying: setPlaying, playButton: playButton,
                }
            })
        }
    }, [token, setPlaying, playButton]);

    useEffect(() => {
        if (state.audioURL !== audioURL) {
            dispatch({
                type: "newAudio",
                payload: audioURL
            })
        }
    }, [audioURL, state, dispatch]);

    useEffect(() => {
        if (peaks !== null) {
            dispatch({type: "newPeak", payload: peaks})
        }
    }, [peaks, dispatch]);
    //
    useEffect(() => {
        if (state.segments !== segments) {
            dispatch({type: "newSegment", payload: segments})
        }
    }, [segments, state, dispatch]);

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
            <div id={"zoomview" + audioURL}
                 style={{
                     height: "178px", width: divWidth + "px", position: 'relative',
                 }}
                 onMouseDown={e => {
                     if (e.altKey && e.shiftKey) {
                         setSelection({
                             selectionStart: e.nativeEvent.layerX,
                             capture: true,
                             selectionEnd: e.nativeEvent.layerX,
                         })
                     }
                 }}
                 onMouseMove={e => {
                     if (selection.capture && e.altKey && e.shiftKey) {
                         setSelection(s => {
                             return {...s, selectionEnd: e.nativeEvent.layerX}
                         })
                     }
                     e.stopPropagation()
                 }}
                 onMouseUp={(e) => {
                     if (e.altKey && e.shiftKey) {
                         const view = peaks.views.getView("zoomview");
                         const downPosition = view.pixelsToTime(view._frameOffset + selection.selectionStart);
                         const upPosition = view.pixelsToTime(view._frameOffset + e.nativeEvent.layerX)
                         const startTime = Math.min(upPosition, downPosition);
                         const endTime = Math.max(upPosition, downPosition);
                         if (startTime !== endTime) {
                             view.setZoom({seconds: endTime - startTime});
                             view.setStartTime(startTime);
                         }
                         setSelection({
                             selectionStart: null,
                             capture: false,
                             selectionEnd: null,
                         })
                     }
                     e.preventDefault()
                 }}
            >
            </div>
            {selection.capture &&
            <div style={{
                position: 'absolute', backgroundColor: "rgba(255,192,197,0.3)",
                height: "178px",
                top: 0,
                left: (selection.selectionStart <= selection.selectionEnd ? selection.selectionStart : selection.selectionEnd + 5) + "px",
                width: (Math.max(selection.selectionStart, selection.selectionEnd) - 5 - Math.min(selection.selectionStart, selection.selectionEnd)) + "px"
            }}>
            </div>}

            <audio id={audioURL} crossOrigin="anonymous"/>
        </>)
}

