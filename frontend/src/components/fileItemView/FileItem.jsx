import React from "react";

const FileItem = (props) => {
    const imageTypes = ['image/png', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
    const videoTypes = ['video/mp4', 'video/ogg', 'video/webm'];
    const audioTypes = ['audio/ogg', 'audio/wav', 'audio/mp3', 'audio/mpeg'];
    const targetBlob = props.blobFiles.find((item) => item.fileId === props.file_uid);

    return (
        <React.Fragment>
            <div className="cloud-files-item-wrap" key={props.id}>
            {props.renameInput}
                <div className="cloud-item-controls">
                    <span className="cloud-item-share-btn" onClick={props.shareHandler}></span>
                    <a className="cloud-item-download-btn"
                        onClick={() => {
                            props.downloadHandler(props.file_uid)
                        }}
                        download={`${props.file_url}.${props.file_type ? props.file_type.match(/\w+$/)[0] : ''}`}
                        href={props.file_url}
                        type={props.file_type}
                        target="_blank"
                        rel="noopener"
                    ></a>
                    <span className="cloud-item-rename-btn" onClick={() => props.renameHandler(props.file_uid)}></span>
                    <span className="cloud-item-delete-btn" onClick={() => props.removeHandler(props.file_uid)}></span>
                </div>

                <div className="cloud-item-filename">{
                props.file_name && props.file_name.length > 15 ? 
                    props.file_name.split('').splice(0, 15).join('') + '...' : props.file_name
                    }
                </div>
                <div className="cloud-item-img">
                    {imageTypes.includes(props.file_type) ?  <img src={targetBlob ? targetBlob.fileBlob : null} /> : null }
                    {audioTypes.includes(props.file_type) ? <audio controls src={targetBlob ? targetBlob.fileBlob : null}></audio> : null }
                    {videoTypes.includes(props.file_type) ? 
                    <video width="300" height="300" controls  src={targetBlob ? targetBlob.fileBlob : null} type={props.file_type}>
                    </video> : null}
                    {!imageTypes.includes(props.file_type) && 
                        !audioTypes.includes(props.file_type) && 
                            !videoTypes.includes(props.file_type) ?
                                <img src="https://dummyimage.com/150x150/000/fff&text=FILE" /> : null}
                </div>
                <div className="cloud-item-file-type">{props.file_type ? props.file_type.match(/\w+$/)[0] : ''}</div>
                <div className="cloud-item-comment"><span>Comment:</span> {props.file_comment}</div>
                <div className="cloud-item-last-download">Last Download: {props.lastDownloadTime.replace(/\s(GMT)/, '').replace(/\+\d+\s+\(\w+\s+\w+\s+\w+\)/, '')}</div>
                <div className="cloud-item-date-load">Upload Date: {props.lastUploadDate.replace(/\s(GMT)/, '').replace(/\+\d+\s+\(\w+\s+\w+\s+\w+\)/, '')}</div>
            </div>
        </React.Fragment>
    ); 
};

export default FileItem;