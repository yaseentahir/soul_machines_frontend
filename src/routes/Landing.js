/*eslint-disable*/

import React, { useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Color from "color";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import breakpoints from "../utils/breakpoints";
import { landingBackgroundImage, landingBackgroundColor } from "../config";
import micFill from "../img/mic-fill.svg";
import videoFill from "../img/camera-video-fill.svg";
import http from "../services/http";
import logoImageLeft from "../img/daco-logo.png";
import Loader from "../components/ContentCards/loader";
import { Circles } from "react-loader-spinner";
import {
  setLogo,
  setCharacterName,
  setText,
  setHide,
  set_API_KEY,
  setIdentifier,
  setAvatarKey,
} from "../store/sm";

function Landing({ className }) {
  const { mic, camera } = useSelector(({ sm }) => sm.requestedMediaPerms);
  const { characterName, logo, text, hide, identifier } = useSelector(
    ({ sm }) => ({
      ...sm,
    }),
  );
  const dispatch = useDispatch();
  useEffect(() => {
    // Step 1: Fetch the current page's URL
    const currentUrl = window.location.href;
    dispatch(setHide(true));
    // Extract the "key" from the URL, assuming it's the last segment of the path
    const urlSegments = currentUrl.split("/");
    const key = urlSegments[urlSegments.length - 1];

    if (key) {
      // Step 2: Use the key to make the GET request
      http
        .get(`/soulMachines/${key}`, {
          "Content-Type": "application/json",
        })
        .then((response) => {
          const data = response.data; // Assuming the response contains the data you want
          console.log(data);
          dispatch(setIdentifier(data.data.key));
          dispatch(setCharacterName(data.data.characterName));
          dispatch(setLogo(data.data.logo));
          dispatch(setText(data.data.text));
          dispatch(setAvatarKey(data.data.key));
          const projectKey = data.data.projectKey;
          dispatch(set_API_KEY(projectKey));
          dispatch(setHide(false));
        })
        .catch((error) => {
          dispatch(setHide(false));
          console.error("Error fetching soulMachines data:", error);
        });
    } else {
      window.location.href = "https://www.campusxr.org/ai-representatives";
    }
  }, []);

  return (
    <>
      {/* <div className={className}>
        {hide ? (
          <div className="loader-wrapper">
            {" "}
            <Circles color="#A200F6" height="100" width="100" />
          </div>
        ) : (
          <div className="landing-wrapper">
            <div className="landing-card">
              {logo && <img src={logo} className="logoImg" alt="Background" />}
              <div className="logo-container">
                <div>
                  <p>{text}</p>
                </div>
               
                  <h1>{characterName}</h1>
                  <Link
                    to={`/avatar?key=${identifier}`}
                    className="shadow chat-btn-land fs-3"
                    style={{ height: "40px" }}
                  >
                    Start
                  </Link>
                </div>
              </div>
            
          </div>
        )}
      </div> */}

      <div className={className}>
        {hide ? (
          <div className="landing-wrapper">
            {" "}
            <Circles color="#A200F6" height="100" width="100" />
          </div>
        ) : (
          <div className="landing-wrapper">
            <div className="landing-card">
              {logo && logo !== "pass" ? (
                <img src={logo} className="character-logo" alt="Background" />
              ) : null}
              <div className="detail-container">
                <h1>{characterName}</h1>
                {text && <p>{text}</p>}

                <Link
                  className="btn-link chat-btn-land"
                  to={`/avatar?key=${identifier}`}
                >
                  Start
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

Landing.propTypes = {
  className: PropTypes.string.isRequired,
};

export default styled(Landing)`
  .loader-wrapper {
    display: grid;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #f2f2f2 !important;
  }

  .landing-wrapper {
    background: rgb(2, 0, 36);
    background: linear-gradient(
      90deg,
      rgba(2, 0, 36, 1) 0%,
      rgba(252, 8, 130, 1) 35%,
      rgba(2, 0, 36, 1) 100%
    );
    min-height: 100vh;
    padding: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .character-logo {
    width: 100%; /* Scale the image to fit the container width */
  }

  .detail-container h1 {
    font-size: 1.5rem; /* Adjust font size for large screens */
  }

  .detail-container p {
    font-size: 1rem; /* Adjust font size for large screens */
  }

  .chat-btn-land {
    text-decoration: none;
    border-radius: 10px;
    background-image: linear-gradient(
      to right top,
      #565656,
      #464647,
      #373738,
      #28282a,
      #1a1a1c
    );
    color: #fff;
  }

  .landing-card {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    margin: 1rem auto;
    text-align: center;
    display: flex;
    flex-direction: column; /* Change to column layout */
    gap: 2rem;
    width: 340px;
  }

  @media (max-width: 768px) {
    .detail-container h1 {
      font-size: 1.2rem; /* Adjust font size for smaller screens */
    }

    .detail-container p {
      font-size: 0.9rem; /* Adjust font size for smaller screens */
    }
  }

  .detail-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  .btn-link {
    padding: 10px;
    color: #fff;
    width: 100%;
    text-decoration: none;
    text-transform: uppercase;
  }

  .chat-btn-land:hover {
    background: #000000;
  }

  // old styles
  // .loader-wrapper {
  //   display: grid;
  //   justify-content: center;
  //   align-items: center;
  //   min-height: 100vh;
  //   background: #f2f2f2 !important;
  // }
  // .landing-wrapper {
  //   min-height: 100vh;
  //   background: #f2f2f2; /* Light white background color */
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  // }

  // img {
  //    height:3rem;
  //    width:3rem;
  //    aspect
  // }
  // .landing-card h1 {
  //   font-size:1.5rem;
  // }

  // .landing-card p {
  //   font-size: 1rem;
  // }
  // .chat-btn-land {
  //   text-decoration: none;

  //   border-radius: 10px;
  //   background-image: linear-gradient(
  //     to right top,
  //     #565656,
  //     #464647,
  //     #373738,
  //     #28282a,
  //     #1a1a1c
  //   );
  //   color: #fff;
  // }

  // .landing-card {
  //   background-color: white;
  //   border-radius: 10px;
  //   box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  //   padding: 1rem;
  //   text-align: center;
  //   display: flex;
  //   flex-direction: row;
  //   gap: 1rem;
  // }
  // @media (max-width: 768px) {
  //   .landing-card {
  //     flex-direction: column;
  //     align-items: center;
  //   }

  //   .landing-card p {
  //     font-size: .9rem;
  //   }

  //   .landing-card h1 {
  //     font-size:1.2rem;
  //   }
  // }

  // .logoImg {
  //   width: 30rem;
  //   border-radius: 50px;
  //   position: relative;
  // }

  // .logo-container {
  //   // position: relative;
  //   height: 100%;
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: center;
  //   align-item: center;
  // }

  // .logo-container p {
  //   width: 300px;
  //   text-transform: capitalize;
  //   padding: 10px;
  //   border-radius: 20px;

  //   color: black;
  //   margin-bottom: 1.5rem;
  // }
`;
