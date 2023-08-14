import React from "react";
import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/slices/userSlice";
import UploadFileFrom from "../uploadFileForm/UploadFileForm";

const UserFilesAdminPopup = (props) => {
    const initialState = {
        renameInputActive: false,
        renameInputRef: useRef(null),
        renameCommentRef: useRef(null),
        userFiles: [...props.userFiles],
    };
    const userData = useSelector((state) => state.user.userData);
    const storageUserData = JSON.parse(localStorage.getItem('userData'));
    const [userFilesAdmin, setUserFilesAdmin] = useState(initialState);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const rmUserFileHandler = (userId, fileId) => {
        const fetchFunc = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/user_files/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${userData ? userData.token : storageUserData.token}`,
                },
                body: JSON.stringify({user: userId, id: fileId})
            })
            .then((response) => {
                if (response.status === 401) {
                    dispatch(logoutUser())
                    navigate('/');
                    return;   
                }
                
            })
            .then(() => {
                setUserFilesAdmin(prevState => ({
                    ...prevState,
                    userFiles: prevState.userFiles.filter((item) => item.file_uid !== fileId)
                }));
            });
        }
        fetchFunc();
    };

    const renameFileHandler = (fileData) => {
        setUserFilesAdmin(prevState => ({
            ...prevState,
            renameInputActive: prevState.renameInputActive = true,
        }));
        setTimeout(() => {
            userFilesAdmin.renameCommentRef.current.value = fileData.file_comment;
            userFilesAdmin.renameInputRef.current.value = fileData.file_name;
        }, 10);
    };

    const renameFileCancelHandler = () => {
        setUserFilesAdmin(prevState => ({
            ...prevState,
            renameInputActive: prevState.renameInputActive = false,
        }));
        userFilesAdmin.renameCommentRef.current.value = '';
        userFilesAdmin.renameInputRef.current.value = '';
    };

    const renameFileOkHandler = (fileData) => {
        const fetchFunc = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/user_files/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${userData ? userData.token : storageUserData.token}`,
                },
                body: JSON.stringify({
                    user: fileData.user_id,
                    rename_id: fileData.file_uid,
                    file_name: userFilesAdmin.renameInputRef.current.value,
                    file_comment: userFilesAdmin.renameCommentRef.current.value,
                }),
            })
            .then((response) => {
                if (response.status === 401) {
                    dispatch(logoutUser())
                    navigate('/');
                    return;   
                }
                return response.json();
            })
            .then((data) => {
                setUserFilesAdmin(prevState => ({
                    ...prevState,
                    renameInputActive: prevState.renameInputActive = false,
                    userFiles: prevState.userFiles = [...prevState.userFiles.filter((item) => item.file_uid !== fileData.file_uid), data]
                }));
                
                userFilesAdmin.renameInputRef.current.value = '';
                userFilesAdmin.renameCommentRef.current.value = '';
            })
        }
        fetchFunc()
        
    };

    const downloadFileHandler = (id) => {
        const fetchFunc = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/user_files/?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${userData ? userData.token : storageUserData.token}`,
                },
            })
            .then((response) => {
                if (response.status === 401) {
                    dispatch(logoutUser())
                    navigate('/');
                    return;   
                }
            })
        };
        fetchFunc();
    };

    const getCorrectTime = (date) => {
        const time = new Date(date);
        const plus = time.toString().match(/[+]/);
        const min = time.toString().match(/[-]/);
        // eslint-disable-next-line
        const difHours = time.toString().match(/\GMT\S+/);
        
        if (plus[0] && difHours[0]) {
            // eslint-disable-next-line
            const hours = time.getHours() + Number(difHours[0].replace(/\GMT/, '').replace(/\+/, '').replace(/0/g, ''));
            time.setHours(hours);
            if (new Date().getFullYear() - time.getFullYear() > 25) {
                return '';
            }
            // eslint-disable-next-line
            return String(time).replace(/\GMT.+$/, '');
        }
        else if (min[0] && difHours[0]) {
            // eslint-disable-next-line
            const hours = time.getHours() - Number(difHours[0].replace(/\GMT/, '').replace(/\-/, '').replace(/0/g, ''));
            time.setHours(hours);
            if (new Date().getFullYear() - time.getFullYear() > 25) {
                return '';
            }
            // eslint-disable-next-line
            return String(time).replace(/\GMT.+$/, '');
        }
        if (new Date().getFullYear() - time.getFullYear() > 25) {
            return '';
        }
        // eslint-disable-next-line
        return String(time).replace(/\GMT.+$/, '');
    };

    return (
        <React.Fragment>
            <div className="admin-user-files-panel-popup-wrap">
                <span className="admin-user-files-popup-close" onClick={props.closePopupHandler}></span>
                {<UploadFileFrom targetUser = {props.targetUser ? props.targetUser : null} userAdminState = {userFilesAdmin.userFiles} setUserAdminState = {setUserFilesAdmin} />}
                <div className="admin-user-files-panel-body">
                    {userFilesAdmin.userFiles.map((fileObj) => {
                        return (
                            <div className="admin-user-files-item" key={Math.random()}>
                                {userFilesAdmin.renameInputActive ? 
                                    <div className="rename-input-wrap">
                                        <input 
                                            type="text" 
                                            placeholder={`${fileObj.file_name}`} 
                                            ref={userFilesAdmin.renameInputRef}
                                        />
                                        <textarea 
                                            className="rename-comment-input" 
                                            placeholder={fileObj.file_comment}
                                            ref={userFilesAdmin.renameCommentRef} 
                                        />
                                        <div className="admin-user-rename-control-wrap">
                                            <button className="rename-input-ok-btn" onClick={() => renameFileOkHandler(fileObj)}>Ok</button>
                                            <button className="rename-input-cancel-btn" onClick={renameFileCancelHandler}>Cancel</button>
                                        </div>
                                    </div> : 
                                null }
                                <div className="admin-user-files-control-item">
                                    <a 
                                        className="admin-user-files-control-item-download-btn" 
                                        onClick={() => downloadFileHandler(fileObj.file_uid)} 
                                        href={fileObj.file_url} 
                                        download={fileObj.file_name}  
                                        target="_blank" rel="noreferrer"
                                    >{''}</a>
                                    <span className="admin-user-files-control-item-rename-btn" onClick={() => renameFileHandler(fileObj)}></span>
                                    <span 
                                        className="admin-user-files-control-item-delete-btn" 
                                        onClick={() => rmUserFileHandler(fileObj.user_id, fileObj.file_uid)}>
                                    </span>
                                </div>
                                <div className="file-info-wrap">
                                    {console.log(fileObj)}
                                    <p>File Name: {fileObj.file_name}</p>
                                    <p>File Type: {fileObj.file_type}</p>
                                    <p>Comment: {fileObj.file_comment}</p>
                                    <p>Created Time: {getCorrectTime(fileObj.file_created_time)}</p>
                                    <p>Last Download Time: {getCorrectTime(fileObj.file_last_download_time)}</p>
                                    <p>File Url: <a href={`${fileObj.file_url}`}>{fileObj.file_url}</a></p>
                                </div>
                            </div>
                        );
                    })}
                    
                </div>
            </div>
        </React.Fragment>
    );
};

export default UserFilesAdminPopup;