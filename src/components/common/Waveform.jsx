import React, {useContext, useEffect, useState} from "react";
import {Button, Card} from "react-bootstrap";
import Peaks from 'peaks.js';
import {NotificationManager} from 'react-notifications';
import {FiTrash, FiPlay, FiPause, FiDownload, FiPlus} from "react-icons/fi";
import {AuthContext} from "../../Auth";
import axios from "axios";


function fetchAudioBlob(audioURL, token) {

    return axios.create({
        headers: {
            "Authorization": "Bearer " + token,
            'Cache-Control': "public, max-age=604800, immutable"

        },
        responseType: "arraybuffer"
    }).get(audioURL)
        .then(response => {
            return new Blob([response.data])
        })
        .catch(err => {
            NotificationManager.error(err.toString())
        })
}


function fetchAudioElementContent(audioURL, audioEl, token) {
    fetchAudioBlob(audioURL, token)
        .then(blob => {
            audioEl.src = URL.createObjectURL(blob);
        })
}

function DownloadAudio(audioURL, token, filename) {
    return fetchAudioBlob(audioURL, token)
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${filename}.mp3`); //or any other extension
            document.body.appendChild(link);
            link.click();
        })
}

function DeleteAudio(audioUrl, token) {
    const requestObj = new Request(audioUrl, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    fetch(requestObj).then(res => {
    });
    return
}

export function Waveform({audioURL, addSplitToExport, removeSplit, split, setSplit, selectedUrl}) {
    const {token} = useContext(AuthContext);
    const [peaks, setPeaks] = useState(null);
    const [containerWidth, setContainerWidth] = useState(-1);
    useEffect(() => {
        const audioEl = document.getElementById(audioURL);
        const audioContext = new AudioContext();
        const options = {
            zoomview: {
                container: document.getElementById('zoomview' + audioURL),
                waveformColor: '#538ece',
                playheadColor: '#000000',
            },
            overview: {
                container: document.getElementById('overview' + audioURL),
                highlightColor: 'rgba(1, 1, 1, 0)',
                waveformColor: '#939393',
                playheadColor: 'rgba(26,26,26,0.73)',
            },

            mediaElement: audioEl,
            webAudio: {
                audioContext: audioContext,
                scale: 128,
                multiChannel: false
            },
        };
        Peaks.init(options, function (err, peaks) {
            if (peaks !== undefined) {
                peaks.views.getView("overview").showPlayheadTime(true);
                setPeaks(peaks)
            }
        });
        if (audioEl === undefined) return;
        fetchAudioElementContent(audioURL, audioEl, token);
        const appWidth = document.getElementById("top-container-" + audioURL).offsetWidth;
        audioEl.onloadedmetadata = function () {
            setContainerWidth(appWidth - 155 - 85);
        };
    }, [audioURL, token]);

    const [playing, setPlaying] = useState(false);
    // eslint-disable-next-line
    const playOrPause = () => {
        if (peaks !== null && !playing) peaks.player.play(); else peaks.player.pause();
        setPlaying(!playing);
    };

    useEffect(() => {
        if (peaks === null || containerWidth < 0) return;
        peaks.on('overview.dblclick', () => {
            setPlaying(true);
            setSplit(split);
            peaks.player.play();
        });
        peaks.on("overview.click", () => {
            setSplit(split);
            const playButton = document.getElementById("play-" + audioURL);
            playButton.focus();
        });
        peaks.on("player.seeked", () => {
            setSplit(split);
            const playButton = document.getElementById("play-" + audioURL);
            playButton.focus();
        });

        peaks.on("player.ended", () => {
            setPlaying(false)
        });
        const container = document.getElementById('overview' + audioURL);
        const view = peaks.views.getView('overview');
        if (!container) return;
        view.fitToContainer();

    }, [containerWidth, peaks, audioURL, setSplit, split]);

    useEffect(() => {
        const eventListener = (e) => {
            if (e.code === 'Space') playOrPause();
            e.preventDefault();
        };
        const topContainer = document.getElementById("top-container-" + audioURL);
        if (selectedUrl === split.url) {
            topContainer.addEventListener("keydown", eventListener)
        } else {
            topContainer.removeEventListener("keydown", eventListener)
        }
    }, [split, selectedUrl, playing, audioURL, playOrPause]);

    return (
        <Card className={"m-2"}
              border={split.url === selectedUrl ? "primary" : ""}
              id={"top-container-" + audioURL}
        >
            <div style={
                {
                    marginLeft: "78px",
                    // marginRight: "78px",
                    position: "relative"
                }
            }>
                <Button className={"mx-4 play-button"}
                        variant={"outline-primary"} size={"lg"} type={"button"}
                        style={{display: "inline-block"}}
                        onClick={playOrPause}
                        id={"play-" + audioURL}
                >
                    {playing ? <FiPause/> : <FiPlay/>}
                </Button>

                <span>name = {split.name}; label = {split.label}; duration = {split.duration.toFixed(3)} sec.</span>

                <div id={"overview" + audioURL}
                     style={{
                         height: "178px",
                         width: containerWidth + "px",
                     }}
                >{""}</div>
                <audio id={audioURL} crossOrigin="anonymous">
                </audio>
                <div className={"add-split-button"}>
                    <Button className={"mx-1"}
                            variant={"outline-danger"} size={"md"} type={"button"}
                            onClick={() => {
                                DeleteAudio(audioURL, token);
                                removeSplit(audioURL);
                            }}>
                        <FiTrash/>
                    </Button>
                    <Button className={"mx-1"}
                            variant={"outline-primary"} size={"md"} type={"button"}
                            onClick={addSplitToExport}>
                        <FiPlus/>
                    </Button>
                    <Button className={"mx-1"}
                            variant={"outline-primary"} size={"md"} type={"button"}
                            onClick={() => DownloadAudio(audioURL, token, split.name)}>
                        <FiDownload/>
                    </Button>
                </div>
            </div>
        </Card>
    )
}