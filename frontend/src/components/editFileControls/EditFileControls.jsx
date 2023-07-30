import React from "react";

const EditFileControls = (props) => {
    return (
        <div className="edit-wrap">
            <div className="edit-name-input-wrap">
                <label htmlFor="edit-name-input">Edit FileName</label>
                <input id="edit-name-input" ref={props.editHandlerRef} type="text" />
            </div>
            <div className="edit-comment-input-wrap">
                <label htmlFor="edit-comment-input">Edit Comment</label>
                <input id="edit-comment-input" ref={props.editCommentRef} type="text" />
            </div>

            <div className="edit-input-wrap">
                <div className="edit-inpit-ok-btn" onClick={() => props.editOkHandler(props.fileId)}><button>ok</button></div>
                <div className="edit-inpit-cancel-btn" onClick={() => props.editCancelHandler(props.fileId)}><button>cancel</button></div>
            </div>                         
        </div>
    );
};

export default EditFileControls;