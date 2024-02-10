/*eslint-disable*/

import React, { createRef, useEffect, useState } from "react";
import http from "../services/http";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import PersonaVideo from "../components/PersonaVideo";
import Captions from "../components/Captions";
import ContentCardDisplay from "../components/ContentCardDisplay";
import {
  disconnect,
  sendEvent,
  setCharacterName,
  setHide,
  setVideoDimensions,
  set_API_KEY,
  setAvatarKey,
} from "../store/sm/index";
import Header from "../components/Header";
import { disconnectPage, disconnectRoute } from "../config";
import TextInput from "../components/TextInput";
import STTFeedback from "../components/STTFeedback";
import { createScene } from "../store/sm/index";
import { Circle } from "react-bootstrap-icons";
import { setRequestedMediaPerms } from "../store/sm/index";
import { Circles } from "react-loader-spinner";

function DPChat({ className }) {
  const {
    connected,
    loading,
    disconnected,
    error,
    showTranscript,
    micOn,
    isOutputMuted,
    API_KEY,
    hide,
  } = useSelector(({ sm }) => ({ ...sm }));

  const dispatch = useDispatch();

  const history = useHistory();

  // if (disconnected === true) {
  //   if (disconnectPage) {
  //     history.push(disconnectRoute);
  //   } else history.push("/");
  // } else if (error !== null) history.push("/loading?error=true");
  // // usually this will be triggered when the user refreshes
  // else if (connected !== true) history.push("/");

  const createSceneIfNotStarted = () => {
    if (loading === false && connected === false && error === null) {
      dispatch(createScene());
    }
  };

  const setAPI = async () => {
    if (!API_KEY) {
      const urlParams = new URLSearchParams(window.location.search);
      const key = urlParams.get("key");
      if (key) {
        try {
          // Step 1: Use the key parameter to make the GET request
          const response = await http.get(`/soulMachines/${key}`, {
            "Content-Type": "application/json",
          });

          const data = response.data; // Assuming the response contains the data you want
          const projectKey = data.data.projectKey;
          dispatch(setCharacterName(data.data.key));
          dispatch(set_API_KEY(projectKey));
          dispatch(setAvatarKey(data.data.key));
        } catch (error) {
          console.error("Error fetching soulMachines data:", error);
        }
      } else {
        // Redirect to the home page
        window.location.href = "https://www.campusxr.org/ai-representatives";
      }
    } else {
      console.log("Key already exists");
    }
  };

  const handleResize = () => {
    if (connected) {
      dispatch(
        setVideoDimensions({
          videoWidth: window.innerWidth,
          videoHeight: window.innerHeight,
        }),
      );
    }
  };
  // useEffect(() => {
  //   console.log(hide);
  // });

  const [startedAt] = useState(Date.now());
  const cleanup = () => {
    if (Date.now() - startedAt < 1000) {
      console.warn(
        "cleanup function invoked less than 1 second after component mounted, ignoring!",
      );
    } else {
      console.log("cleanup function invoked!");
      window.removeEventListener("resize", handleResize);
      if (connected === true && loading === false) dispatch(disconnect());
    }
  };
  const [loadingUi, setLoadingUi] = useState(true);
  useEffect(async () => {
    dispatch(setHide(true));
    await setAPI();
    createSceneIfNotStarted();
    setLoadingUi(false);
    // send init event, since we will finish loading before we display the DP
    dispatch(sendEvent({ eventName: "", payload: {}, kind: "init" }));
    // run resize once on mount, then add listener for future resize events
    handleResize();
    window.addEventListener("resize", handleResize);
    // run cleanup on unmount
    return () => cleanup();
  }, []);

  window.onbeforeunload = () => {
    console.log("cleaning up");
    cleanup();
  };

  // content card display is dependent on remaining space between header and footer
  // there might be a better way to do this w/ flexbox
  const ccDisplaRef = createRef(null);
  const [ccDisplayHeight, setCCDisplayHeight] = useState("auto");
  useEffect(() => {
    setCCDisplayHeight(ccDisplaRef.current.clientHeight);
  }, [ccDisplaRef]);

  return (
    <>
      {hide && (
        <div className="loader-wrapper d-flex justify-content-center align-items-center position-fixed top-0 start-0 h-100 w-100">
          {" "}
          <Circles color="#A200F6" height="100" width="100" />
        </div>
      )}
      <div className={className}>
        <div className="video-overlay">
          {/* top row */}
          <div className="row">
            <Header />
            {/* {
            // consumers of the template can uncomment this block if they want a camera preview
            // will need to add cameraOn to the values they get from the state
              cameraOn
                ? (
                  <div className="row d-flex justify-content-end">
                    <div className="col-auto">
                      <div className="camera-preview">
                        <CameraPreview />
                      </div>
                    </div>
                  </div>
                )
                : <div />
            } */}
          </div>
          {/* middle row */}
          <div
            className="row d-flex justify-content-end align-items-center flex-grow-1 ps-3 pe-3 chat-display-box"
            style={{ overflowY: "scroll" }}
            ref={ccDisplaRef}
          >
            <div
              className="col col-md-5 d-flex align-items-end align-items-md-center"
              style={{ height: `${ccDisplayHeight - 20}px` || "auto" }}
            >
              <div>
                <ContentCardDisplay />
              </div>
            </div>
          </div>
          {/* bottom row */}
          <div>
            {isOutputMuted ? (
              <div className="row">
                <div className="col text-center">
                  <Captions />
                </div>
              </div>
            ) : null}
            <div className="row">
              <div className="d-flex justify-content-center m-2">
                <STTFeedback />
              </div>
            </div>
            {showTranscript === true ? (
              <div className="row justify-content-end">
                <div className="col-md-8 col-lg-5 pt-xs-2 pb-lg-3 pl-0 pe-lg-8">
                  <TextInput />
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div>{connected ? <PersonaVideo /> : null}</div>
      </div>
    </>
  );
}
DPChat.propTypes = {
  className: PropTypes.string.isRequired,
};

export default styled(DPChat)`
  .loader-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #f2f2f2 !important;
  }
  .video-overlay {
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;

    z-index: 10;

    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .vertical-fit-container {
    flex: 0 1 auto;
    overflow-y: scroll;

    scrollbar-width: none; /* Firefox 64 */
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
