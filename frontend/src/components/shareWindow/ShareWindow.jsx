import React from "react";

const ShareWindow = (props) => {
    return (
        <div className="share-file-window-wrap" style={{left: props.cords.left, top: props.cords.top}}>
            <span className="share-file-window-close-btn" onClick={props.closeHandler}></span>
            <span className="share-file-window-copy-btn"></span>
            <div className="share-file-window-container">
                <div className="share-file-link-wrap">
                    <h3>Share file: {props.fileName}</h3>
                    <p>
                        {props.fileLink}
                        {/* <a href={'#'} onClick={props.linkHandler} className="share-copy-link">{props.linkText}</a> */}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShareWindow;