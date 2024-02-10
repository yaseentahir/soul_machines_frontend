import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Send } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { sendTextMessage } from "../store/sm";

function TextInput({ className }) {
  const [textInput, setText] = useState("");

  const handleInput = (e) => setText(e.target.value);

  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendTextMessage({ text: textInput }));
    setText("");
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit}>
        <div
          // style={{
          //   height: "60px",
          //   borderRadius: "50px",
          //   overflow: "hidden",
          // }}
          className="input-group input-text-feild"
        >
          <input
            value={textInput}
            onChange={handleInput}
            className="form-control"
            placeholder="Type your message here ..."
          />
          <button
            className="btn send-button"
            type="submit"
            aria-label="Submit"
            data-tip="Submit"
          >
            <Send />
          </button>
        </div>
      </form>
    </div>
  );
}

TextInput.propTypes = {
  className: PropTypes.string.isRequired,
};

export default styled(TextInput)`
  input {
    border-right: none;
  }

  .send-button {
    border: 1px solid #ced4da;
    border-left: none;
    background: #fff;
    color: rgba(0, 0, 0, 0.4);
  }
  .input-text-feild {
    height: 60px;
    border-radius: 50px;
    overflow: hidden;
    width: 88% !important;
  }
  @media only screen and (max-width: 600px) {
    .input-text-feild {
      height: 50px;
      width: 98% !important;
      margin-left: 5px;
    }
  }
`;
