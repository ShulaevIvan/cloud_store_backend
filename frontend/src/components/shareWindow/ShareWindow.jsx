import React from "react";
import { Link } from "react-router-dom";

const ShareWindow = (props) => {
    return (
        <div className="share-file-window-wrap">
            <span className="share-file-window-close-btn" onClick={props.closeHandler}></span>
            <span className="share-file-window-copy-btn"></span>
            <div className="share-file-window-container">
                <div className="share-file-link-wrap">
                    <p>{props.fileLink}</p>
                </div>
            </div>
        </div>
    );
};

export default ShareWindow;