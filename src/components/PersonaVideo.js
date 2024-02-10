/*eslint-disable*/
import React, { createRef, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as actions from "../store/sm";
import proxyVideo from "../proxyVideo";
import { headerHeight, transparentHeader } from "../config";

import TagManager from "react-gtm-module";

import podiumImage from "../img/podium-transformed.png";
import podium from "../img/podium-image.png";
import podiumBlue from "../img/podium-transformed.gif";
import lowerBody from "../img/cover_lower-transformed.gif";
import animatedDress from "../img/dress-animated.gif";
import blueDress from "../img/blue.gif";

import ReactPlayer from "react-player";
import { current } from "@reduxjs/toolkit";

function PersonaVideo({ className }) {
  const { speechState } = useSelector((state) => ({ ...state.sm }));

  const localVideoRef = useRef(null);

  const dispatch = useDispatch();
  const setVideoDimensions = (videoWidth, videoHeight) =>
    dispatch(actions.setVideoDimensions({ videoWidth, videoHeight }));
  const { isOutputMuted, loading, connected, avtarKey } = useSelector(
    ({ sm }) => ({
      ...sm,
    }),
  );

  const characterStates = {
    idle: { start: 0, end: 16 },
    speaking: { start: 19, end: 20 },
    animating: { start: 21, end: 27 },
  };

  const movement = [17, 20, 36];

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest function.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  useInterval(() => {
    if (avtarKey === "NHC" || avtarKey === "NHC1") {
      console.log(speechState);
      dispatch(actions.keepAlive());
      if (speechState === "idle") {
        console.log(
          "current time while idle",
          localVideoRef.current.currentTime,
        );

        if (localVideoRef.current.currentTime > 16) {
          localVideoRef.current.currentTime = characterStates.idle.start;
        }
      } else {
        if (localVideoRef.current.currentTime <= 16) {
          const randomIndex = Math.floor(Math.random() * movement.length);
          const randomTime = movement[randomIndex];
          localVideoRef.current.currentTime = randomTime;
        }
      }
    }
  }, 1000);

  useEffect(() => {
    if (avtarKey === "NHC" || avtarKey === "NHC1") {
      const tagManagerArgs = {
        gtmId: "G-0VKFYM0W02",
      };

      TagManager.initialize(tagManagerArgs);
    }
  }, [avtarKey]);

  // video elem ref used to link proxy video element to displayed video
  const videoRef = createRef();
  // we need the container dimensions to render the right size video in the persona server
  const containerRef = createRef();
  // only set the video ref once, otherwise we get a flickering whenever the window is resized
  const [videoDisplayed, setVideoDisplayed] = useState(false);
  // we need to keep track of the inner window height so the video displays correctly
  const [height, setHeight] = useState("100vh");

  const handleResize = () => {
    if (containerRef.current) {
      // the video should resize with the element size.
      // this needs to be done through the redux store because the Persona server
      // needs to be aware of the video target dimensions to render a propperly sized video
      const videoWidth = containerRef.current.clientWidth;
      const videoHeight = containerRef.current.clientHeight;
      setVideoDimensions(videoWidth, videoHeight);

      // constrain to inner window height so it fits on mobile
      setHeight(`${videoHeight}`);
    }
  };

  // persona video feed is routed through a proxy <video> tag,
  // we need to get the src data from that element to use here
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    if (connected) {
      if (!videoDisplayed) {
        videoRef.current.srcObject = proxyVideo.srcObject;
        setVideoDisplayed(true);

        if (avtarKey === "NHC || NHC1") {
          videoRef.current.style.display = "none";
        }
      }
    }
    // when component dismounts, remove resize listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div ref={containerRef} className={className} style={{ height }}>
      <div className="persona-video-overlay">
        {connected ? (
          avtarKey === "NHC" ? (
            <>
              <video
                ref={localVideoRef}
                loop
                autoPlay
                crossOrigin="anonymous"
                className="persona-video-full"
              >
                <source src="https://sunrisedatabucket.s3.amazonaws.com/nhc-no+transition-0906.mp4"></source>
              </video>

              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="persona-video-full"
                id="personavideo"
                data-sm-video
                muted={isOutputMuted}
              />
            </>
          ) : avtarKey === "NHC1" ? (
            <>
              <video
                ref={localVideoRef}
                loop
                autoPlay
                crossOrigin="anonymous"
                className="persona-video-full"
              >
                <source src="https://sunrisedatabucket.s3.amazonaws.com/nhc-transition-0906.mp4"></source>
              </video>

              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="persona-video-full"
                id="personavideo"
                data-sm-video
                muted={isOutputMuted}
              />
            </>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="persona-video-full"
              id="personavideo"
              data-sm-video
              muted={isOutputMuted}
            />
          )
        ) : null}
      </div>
      {loading ? (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : null}
      {connected === false && loading === false ? "disconnected" : ""}

      {/* {avtarKey === "NHCALANOUD_PODIUM_SCARF" && (
        <img className="podium-image3" src={podiumImage} alt="podium" />
      )}
      {avtarKey === "NHCALANOUD_LOGO_SCARF" && (
        <img className="lower-body-image" src={lowerBody} alt="podium" />
      )}
      {avtarKey === "NHCALANOUD_LOGO" && (
        <img className="lower-body-image" src={animatedDress} alt="podium" />
      )}
      {avtarKey === "NHCALANOUD_PODIUM" && (
        <img className="podium" src={podium} alt="podium" />
      )}
      {avtarKey === "NHCALANOUD_G" && (
        <img className="lower-body-image" src={podiumBlue} alt="podium" />
      )}
      {avtarKey === "NHCALANOUD_G_SCARF" && (
        <img className="lower-body-image" src={blueDress} alt="podium" />
      )} */}
    </div>
  );
}

PersonaVideo.propTypes = {
  className: PropTypes.string.isRequired,
};

export default styled(PersonaVideo)`

  .persona-video-overlay {
    background-color: '#fffff';
    z-index:50;
    height:100%
    width:100%;

    position:relative;
  }

  .overlay-local-video{
    position: absolute;
    top:0;
    left:0;
    height:100%
    width:100%;
  }

  /* if you need the persona video to be different than the window dimensions, change these values */
  width: 100vw;

  position: fixed;
  z-index: 0;

  display: flex;
  // align-items: center;
  justify-content: center;
  margin-top: ${transparentHeader ? "" : headerHeight};
  .persona-video-full {
    /* the video element will conform to the container dimensions, so keep this as it is */
    width: 100%;
    height: 100%;
  }
  .persona-video {
    /* the video element will conform to the container dimensions, so keep this as it is */
    width: 42%;
    height: 42%;
  }
  .persona-video5 {
    /* the video element will conform to the container dimensions, so keep this as it is */
    width: 26%;
    height: 26%;
  }
  .grey-bg-image {
    position: absolute;
    top: 23%;
    height: 25%;
    width: 100%;
  }
  .podium-image3 {
    position: absolute;
    top: 4%;
    height: 98%;
    width: 28%;
  }
  .podium-image {
    position: absolute;
    top: -4%;
    height: 105%;
    width: 26%;
  }

    @media (max-width: 768px) {
      
   video {
        object-fit: cover;
   }
  }


  // @media only screen and (min-height: 1000px) {
  //   .podium-image {
  //     height: 1030px !important;
  //   }
  // }




  @media only screen and (max-width: 400px) {
    .podium-image {
      width: 92% !important;
    }
  }
  @media only screen and (min-width: 400px) and (max-width: 600px) {
    .podium-image {
      width: 115% !important;
    }
  }
  @media only screen and (min-width: 600px) and (max-width: 800px) {
    .podium-image {
      width: 83% !important;
    }
  }
  @media only screen and (min-width: 801px) and (max-width: 900px) {
    .podium-image {
      width: 73% !important;
    }
  }
  @media only screen and (min-width: 901px) and (max-width: 1000px) {
    .podium-image {
      width: 39% !important;
    }
  }
  @media only screen and (min-width: 1001px) and (max-width: 1200px) {
    .podium-image {
      width: 69% !important;
    }
  }
  @media only screen and (min-width: 1200px) and (max-width: 1500px) {
    .podium-image {
      width: 25% !important;
    }
  }
  .lower-body-image {
    position: absolute;
    top: -2%;
    height: 102%;
    width: 25%;
  }
  @media only screen and (max-width: 600px) {
    .lower-body-image {
      width: 92% !important;
    }
  }
  @media only screen and (min-width: 600px) and (max-width: 800px) {
    .lower-body-image {
      width: 53% !important;
    }
  }
  @media only screen and (min-width: 801px) and (max-width: 900px) {
    .lower-body-image {
      width: 48% !important;
    }
  }
  @media only screen and (min-width: 901px) and (max-width: 1100px) {
    .lower-body-image {
      width: 38% !important;
    }
  }
  @media only screen and (min-width: 1101px) and (max-width: 1200px) {
    .lower-body-image {
      width: 32% !important;
    }
  }
  @media only screen and (min-width: 1200px) and (max-width: 1500px) {
    .lower-body-image {
      width: 31% !important;
    }
  }
  .animated-gif-image {
    position: absolute;
    top: 18%;
    height: 75%;
    width: 34%;
  }
  .podium {
    position: absolute;
    top: 40%;
    height: 62%;
    width: 41%;
  }
  @media only screen and (max-width: 500px) {
    .podium {
      width: 135% !important;
    }
  }
  @media only screen and (min-width: 500px) and (max-width: 600px) {
    .podium {
      width: 105% !important;
    }
  }
  @media only screen and (min-width: 600px) and (max-width: 800px) {
    .podium {
      width: 85% !important;
    }
  }
  @media only screen and (min-width: 801px) and (max-width: 900px) {
    .podium {
      width: 75% !important;
    }
  }
  @media only screen and (min-width: 901px) and (max-width: 1000px) {
    .podium {
      width: 63% !important;
    }
  }
  @media only screen and (min-width: 1001px) and (max-width: 1200px) {
    .podium {
      width: 53% !important;
    }
  }
  @media only screen and (min-width: 1200px) and (max-width: 1500px) {
    .podium {
      width: 43% !important;
    }
  }
  .podium-blue {
    position: absolute;
    top: 25%;
    height: 74%;
    width: 24%;
  }
  @media only screen and (max-width: 600px) {
    .podium-blue {
      width: 90% !important;
    }
  }
  @media only screen and (min-width: 600px) and (max-width: 800px) {
    .podium-blue {
      width: 70% !important;
    }
  }
  @media only screen and (min-width: 801px) and (max-width: 900px) {
    .podium-blue {
      width: 60% !important;
    }
  }
  @media only screen and (min-width: 901px) and (max-width: 1000px) {
    .podium-blue {
      width: 45% !important;
    }
  }
  @media only screen and (min-width: 1001px) and (max-width: 1200px) {
    .podium-blue {
      width: 35% !important;
    }
  }
  @media only screen and (min-width: 1200px) and (max-width: 1500px) {
    .podium-blue {
      width: 30% !important;
    }
  }
`;
