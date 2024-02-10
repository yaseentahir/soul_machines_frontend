/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import PropTypes from "prop-types";
import {
  MicFill,
  MicMuteFill,
  HandIndex,
  ChatQuote,
} from "react-bootstrap-icons";
import ReactTooltip from "react-tooltip";
import { stopSpeaking, setShowTranscript, setMicOn } from "../store/sm/index";
import mic from "../img/mic.svg";
import micFill from "../img/mic-fill.svg";
import breakpoints from "../utils/breakpoints";
import { primaryAccent } from "../globalStyle";
import { whiteFill } from "../globalStyle";
import FeedbackModal from "./FeedbackModal";

const volumeMeterHeight = 24;
const volumeMeterMultiplier = 1.2;
const smallHeight = volumeMeterHeight;
const largeHeight = volumeMeterHeight * volumeMeterMultiplier;

function Controls({ className }) {
  const {
    micOn,
    speechState,
    showTranscript,
    transcript,
    requestedMediaPerms,
    highlightMic,
    highlightChat,
    highlightSkip,
  } = useSelector((state) => ({ ...state.sm }));

  const dispatch = useDispatch();

  const [showFeedback, setShowFeedback] = useState(false);

  // mic level visualizer
  // TODO: fix this
  // const typingOnly = requestedMediaPerms.mic !== true;
  // const [volume, setVolume] = useState(0);
  // useEffect(async () => {
  //   if (connected && typingOnly === false) {
  //     // credit: https://stackoverflow.com/a/64650826
  //     let volumeCallback = null;
  //     let audioStream;
  //     let audioContext;
  //     let audioSource;
  //     let unmounted = false;
  //     // Initialize
  //     try {
  //       audioStream = mediaStreamProxy.getUserMediaStream();
  //       audioContext = new AudioContext();
  //       audioSource = audioContext.createMediaStreamSource(audioStream);
  //       const analyser = audioContext.createAnalyser();
  //       analyser.fftSize = 512;
  //       analyser.minDecibels = -127;
  //       analyser.maxDecibels = 0;
  //       analyser.smoothingTimeConstant = 0.4;
  //       audioSource.connect(analyser);
  //       const volumes = new Uint8Array(analyser.frequencyBinCount);
  //       volumeCallback = () => {
  //         analyser.getByteFrequencyData(volumes);
  //         let volumeSum = 0;
  //         volumes.forEach((v) => { volumeSum += v; });
  //         // multiply value by 2 so the volume meter appears more responsive
  //         // (otherwise the fill doesn't always show)
  //         const averageVolume = (volumeSum / volumes.length) * 2;
  //         // Value range: 127 = analyser.maxDecibels - analyser.minDecibels;
  //         setVolume(averageVolume > 127 ? 127 : averageVolume);
  //       };
  //       // runs every time the window paints
  //       const volumeDisplay = () => {
  //         window.requestAnimationFrame(() => {
  //           if (!unmounted) {
  //             volumeCallback();
  //             volumeDisplay();
  //           }
  //         });
  //       };
  //       volumeDisplay();
  //     } catch (e) {
  //       console.error('Failed to initialize volume visualizer!', e);
  //     }

  //     return () => {
  //       console.log('closing down the audio stuff');
  //       // FIXME: tracking #79
  //       unmounted = true;
  //       audioContext.close();
  //       audioSource.close();
  //     };
  //   } return false;
  // }, [connected]);

  // bind transcrpt open and mute func to each other, so that
  // when we open the transcript we mute the mic
  const toggleKeyboardInput = () => {
    dispatch(setShowTranscript(!showTranscript));
    // dispatch(setMicOn({ micOn: showTranscript }));
  };

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const iconSize = 24;

  const [showContextMenu, setShowContextMenu] = useState(false);

  const originalShareCopy = "Share Experience";
  const [shareCopy, setShareCopy] = useState(originalShareCopy);

  const shareDP = async () => {
    const url = window.location;
    try {
      await navigator.share({ url });
    } catch {
      const type = "text/plain";
      const blob = new Blob([url], { type });
      const data = [new window.ClipboardItem({ [type]: blob })];
      navigator.clipboard.write(data);
      setShareCopy("Link copied!");
      setTimeout(() => setShareCopy(originalShareCopy), 3000);
    }
  };

  return (
    <div className={className}>
      {showFeedback ? (
        <div className="alert-modal">
          <div className="alert-modal-card container">
            <FeedbackModal
              onClose={() => {
                setShowFeedback(false);
              }}
              closeText="Resume Conversation"
              denyFeedbackText="Close"
              denyFeedback={() => {
                setShowFeedback(false);
              }}
            />
          </div>
        </div>
      ) : null}
      <div className="d-flex">
        {/* mute dp sound */}
        {/* <div>
          
          <button
            type="button"
            className="control-icon"
            aria-label="Toggle DP Audio"
            data-tip="Toggle DP Audio"
            onClick={() =>
              dispatch(setOutputMute({ isOutputMuted: !isOutputMuted }))
            }
          >
            {isOutputMuted ? (
              <VolumeMuteFill
                size={iconSize}
                style={{ border: highlightMute ? "red 2px solid" : "" }}
              />
            ) : (
              <VolumeUpFill
                size={iconSize}
                color={primaryAccent}
                style={{ border: highlightMute ? "red 2px solid" : "" }}
              />
            )}
          </button>
        </div> */}
        <div>
          {/* skip through whatever dp is currently speaking */}
          <button
            type="button"
            className="control-icon skip-speech-icon"
            disabled={speechState !== "speaking"}
            style={{
              display: speechState == "speaking" ? "block" : "none",
              // position: "fixed",
              // bottom: "30px",
              // left: "220px",
            }}
            onClick={() => dispatch(stopSpeaking())}
            data-tip="Skip Speech"
            aria-label="Skip Speech"
          >
            <HandIndex
              color={whiteFill}
              size={iconSize}
              style={{
                border: highlightSkip ? "red 2px solid" : "",
                cursor: "pointer",
                width: "49px",
                height: "49px",
                padding: "14px",
                borderRadius: "50px",
              }}
            />
          </button>
        </div>
        <div>
          {/* show transcript */}
          <button
            type="button"
            className="control-icon trancript-icon"
            aria-label="Toggle Transcript"
            data-tip="Toggle Transcript"
            // style={{ position: "fixed", bottom: "30px", right: "20px" }}
            onClick={toggleKeyboardInput}
            disabled={transcript.length <= 0}
          >
            <ChatQuote
              size={iconSize}
              color={showTranscript ? primaryAccent : "#B3B3B3"}
              style={{ border: highlightChat ? "red 2px solid" : "" }}
            />
          </button>
        </div>
        <div>
          {/* toggle user mic */}
          <button
            type="button"
            className="control-icon mic-icon"
            aria-label="Toggle Microphone"
            data-tip="Toggle Microphone"
            disabled={requestedMediaPerms.micDenied === true}
            onClick={() => dispatch(setMicOn({ micOn: !micOn }))}
          >
            {micOn ? (
              <MicFill
                size={iconSize}
                color={whiteFill}
                style={{
                  border: highlightMic ? "red 2px solid" : "",
                  width: "46px",
                  height: "46px",
                  padding: "14px",
                  borderRadius: "50px",
                }}
              />
            ) : (
              <MicMuteFill
                size={iconSize}
                style={{
                  border: highlightMic ? "red 2px solid" : "",
                  backgroundColor: "#f2695c",
                  width: "46px",
                  height: "46px",
                  padding: "14px",
                  borderRadius: "50px",
                }}
              />
            )}
          </button>
        </div>
        {/* toggle user camera */}
        {/* <div>
          
          <button
            type="button"
            className="control-icon"
            aria-label="Toggle Camera"
            data-tip="Toggle Camera"
            disabled={requestedMediaPerms.cameraDenied === true}
            onClick={() => dispatch(setCameraOn({ cameraOn: !cameraOn }))}
          >
            {cameraOn ? (
              <CameraVideoFill
                size={iconSize}
                color={primaryAccent}
                style={{ border: highlightCamera ? "red 2px solid" : "" }}
              />
            ) : (
              <CameraVideoOffFill
                size={iconSize}
                style={{ border: highlightCamera ? "red 2px solid" : "" }}
              />
            )}
          </button>
        </div> */}
        {/* {menu} */}
        {/* <div className="context-control-parent">
          <button
            className="control-icon context-controls-trigger"
            type="button"
            aria-label="More Options"
            data-tip="More Options"
            id="dpChatDropdown"
            onClick={() => setShowContextMenu(!showContextMenu)}
          >
            {showContextMenu ? (
              <X size={iconSize} color="#fff" />
            ) : (
              <ThreeDotsVertical
                size={iconSize}
                style={{ border: highlightMenu ? "red 2px solid" : "" }}
              />
            )}
          </button>
          {showContextMenu ? (
            <div className="context-controls shadow">
              <div className="d-flex justify-content-end align-items-start">
                <ul>
                  <li>
                    <button
                      className="btn-unstyled "
                      type="button"
                      onClick={() => dispatch(disconnect())}
                    >
                      <Escape size={18} /> Exit Session
                    </button>
                  </li>
                  <li>
                    <button
                      className="btn-unstyled"
                      type="button"
                      onClick={() => {
                        setShowContextMenu(false);
                        setShowFeedback(true);
                      }}
                    >
                      <Megaphone size={18} /> Give Feedback
                    </button>
                  </li>
                  <li>
                    <button
                      className="btn-unstyled"
                      type="button"
                      onClick={() => shareDP()}
                    >
                      <Share size={18} /> {shareCopy}
                    </button>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      href="https://soulmachines.com"
                      className="text-black text-decoration-none"
                      rel="noreferrer"
                    >
                      <Link45deg size={18} /> Visit Soul Machines
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ) : null}
        </div> */}

        <div
          className="speech-indicator"
          style={{
            background:
              speechState == "speaking" ? "black" : "rgba(51, 66, 81, 0.4)",
          }}
        >
          <span className={"quiet"}></span>
          <span
            className={speechState == "speaking" ? "speaking" : "quiet"}
          ></span>
          <span className={"quiet"}></span>
          <span
            className={speechState == "speaking" ? "speaking" : "quiet"}
          ></span>
          <span className={"quiet"}></span>
          <span
            className={speechState == "speaking" ? "speaking" : "quiet"}
          ></span>
        </div>
      </div>
    </div>
  );
}

Controls.propTypes = { className: PropTypes.string.isRequired };

export default styled(Controls)`
  .context-controls {
    position: absolute;
    z-index: 100;
    background: rgba(0, 0, 0, 0.3);
    left: 0;
    top: 0;

    & > div {
      width: 100vw;
      height: 100vh;

      margin-top: 4rem;
    }

    ul {
      padding: 1rem;

      list-style-type: none;

      background: #fff;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: none;

      & > li {
        border-bottom: 1px solid rgba(0, 0, 0, 0.4);
        padding: 0.5rem;
      }
      & > li:last-child {
        border: none;
        padding-bottom: 0;
      }
    }
  }
  .context-controls-trigger {
    position: relative;
    border: 1px solid red;
    z-index: 105;
  }
  .control-icon {
    border: none;
    background: none;

    padding: 0.4rem;
  }
  .form-control {
    opacity: 0.8;
    &:focus {
      opacity: 1;
    }
  }

  .interrupt {
    opacity: 1;
    transition: opacity 0.1s;
  }
  .interrupt-active {
    opacity: 0;
  }

  .volume-display {
    position: relative;
    top: ${volumeMeterHeight * 0.5}px;
    display: flex;
    align-items: flex-end;
    justify-content: start;
    min-width: ${({ videoWidth }) =>
      videoWidth <= breakpoints.md ? 21 : 32}px;
    .meter-component {
      /* don't use media queries for this since we need to write the value
      in the body of the component */
      height: ${({ videoWidth }) =>
        videoWidth >= breakpoints.md ? largeHeight : smallHeight}px;
      background-size: ${({ videoWidth }) =>
        videoWidth >= breakpoints.md ? largeHeight : smallHeight}px;
      background-position: bottom;
      background-repeat: no-repeat;
      min-width: ${({ videoWidth }) =>
        videoWidth <= breakpoints.md ? 21 : 28}px;
      position: absolute;
    }
    .meter-component-1 {
      background-image: url(${mic});
      z-index: 10;
    }
    .meter-component-2 {
      background-image: url(${micFill});
      z-index: 20;
    }
  }
  .alert-modal {
    position: absolute;
    z-index: 1000;
    display: flex;
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;
    width: 100vw;
    min-height: 100vh;
    background: rgba(0, 0, 0, 0.3);
  }
  .alert-modal-card {
    background: #fff;
    padding: 1.3rem;
    border-radius: 5px;
  }
  .speech-indicator {
    width: 117px;
    height: 56px;
    transition: background-color 0.3s ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    height: 49px;
    border-radius: 36px;
    position: fixed;
    bottom: 40px;
    left: 90px;
  }
  .speech-indicator span.quiet {
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background: #fff;
    margin: 0 3px;
    transform: translateY(0);
    transition:
      transform 0.2s ease-in-out,
      height 0.2s ease-in-out;
    animation-name: idleAnimation;
    animation-duration: 1.2s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    will-change: transform, height;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  .speech-indicator span.speaking {
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background: #fff;
    margin: 0 3px;
    transform: translateY(0);
    transition:
      transform 0.2s ease-in-out,
      height 0.2s ease-in-out;
    animation-name: speakingAnimation;
    animation-duration: 0.5s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    will-change: transform, height;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  @keyframes idleAnimation {
    0% {
      transform: scale(0.7);
    }
    50% {
      transform: scale(1.3);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes speakingAnimation {
    0% {
      height: 0.5rem;
    }
    100% {
      height: 1rem;
    }
  }
  .mic-icon {
    position: fixed;
    bottom: 30px;
    left: 20px;
  }
  .trancript-icon {
    position: fixed;
    bottom: 30px;
    right: 20px;
  }
  .skip-speech-icon {
    position: fixed;
    bottom: 30px;
    left: 220px;
  }
  @media only screen and (max-width: 600px) {
    .mic-icon {
      bottom: 41px;
    }
    .skip-speech-icon {
      bottom: 41px;
    }
    .trancript-icon {
      bottom: 49px;
    }
    .speech-indicator {
      height: 38px;
      bottom: 53px;
      left: 90px;
    }
  }
`;
