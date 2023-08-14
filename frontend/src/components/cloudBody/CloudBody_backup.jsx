import React from "react";
import UploadFileFrom from "../uploadFileForm/UploadFileForm";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { replaceUserFiles, removeUserFile, renameUserFile, updateDownloadFile, logoutUser } from "../../redux/slices/userSlice";
import FileItem from "../fileItemView/FileItem";
import EditFileControls from "../editFileControls/EditFileControls";
import ShareWindow from "../shareWindow/ShareWindow";
import AdminPanel from "../adminPanel/AdminPanel";

const CloudBody = () => {
    const uFiles = useSelector((state) => state.user.userFiels);
    const userData = useSelector((state) => state.user.userData);
    const storageUserData = JSON.parse(localStorage.getItem('userData'));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userFilesState, setUserFilesState] = useState({ files: uFiles });
    const [loadBlobState, setLoadBlob] = useState({ blobFiles: [] });
    const [shareWindow, setShareWindow] = useState({ 
        windowActive: false,
        shareFile: null,
        linkActive: false, 
        linkText: 'copy link',
        linkUrl: '',
    })
    const [renameInput, setRenameInput] = useState({
        inputActive: false,
        editId: undefined,
        renameInputRef: useRef(),
        commentInputRef: useRef(),
    });


    const rmFileHandler = (id) => {
        const fetchFunc = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/user_files/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${userData ? userData.token : storageUserData.token}`,
                },
                body: JSON.stringify({user: userData ? userData.user.id : storageUserData.user.id, id: id})
            })
            .then((response) => {
                if (response.status === 401) {
                    dispatch(logoutUser())
                    navigate('/');
                    return;   
                }
            })
            .then(() => {
                dispatch(removeUserFile(id));
                setUserFilesState(prevState => ({
                    ...prevState,
                    files: prevState.files.filter((item) => item.file_uid !== id),
                }));
            });
        }
        fetchFunc();
    };

    const renameFileHandler = (id) => {
        const fetchFunc = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/user_files/?id=${id}&user=${userData ? userData.user.id: storageUserData.user.id}`, {
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
                return  response.json();
            })
            .then((data) => {
                setRenameInput(prevState => ({
                    ...prevState,
                    inputActive: prevState.inputActive = true,
                    editId: prevState.editId = id
                }));

                setTimeout(() => {
                    renameInput.renameInputRef.current.value = data.file_name;
                    renameInput.commentInputRef.current.value = data.file_comment;
                }, 100);
            });
        }
        fetchFunc();
    };

    const downloadHandler = async (id) => {
        const fetchFunc = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/user_files/?id=${id}&download=true`, {
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
                return  response.json();
            })
            .then((data) => {
                dispatch(updateDownloadFile(JSON.stringify(data)));
            });
        }
        fetchFunc();
    }

    const shareFileHandler = (clientX, clientY, id) => {

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
                return  response.json()
            })
            .then((data) => {
                setShareWindow(prevState => ({
                    ...prevState,
                    cords: prevState.cords = {left: clientX / 2, top: clientY},
                    windowActive: prevState.windowActive = true,
                    linkActive: prevState.linkActive = true,
                    shareFile: prevState.shareFile = data,
                }));
                return;
            });
        }
        fetchFunc();
    };

    const shareFileCloseHandler = () => {
        setShareWindow(prevState => ({
            ...prevState,
            shareFileId: prevState.shareFile = null,
            windowActive: prevState.windowActive = false,
            linkActive: prevState.linkActive = false,
            linkText: prevState.linkText = 'copylink',
        }));
    };

    const shareFileLinkHandler = async (e, link) => {
        e.preventDefault();
        if (shareWindow.linkActive && navigator.clipboard) {
            setShareWindow(prevState => ({
                ...prevState,
                linkActive: prevState.linkActive = false,
                linkText: prevState.linkText = 'copylink',
                linkUrl: prevState.linkUrl = link,
            }));
            await navigator.clipboard.writeText(`${shareWindow.linkUrl}`);
        }
        else if (navigator.clipboard) {

            setShareWindow(prevState => ({
                ...prevState,
                linkActive: prevState.linkActive = true,
                linkText: prevState.linkText = 'copied',
                linkUrl: prevState.linkUrl = '',
            
            }));
            await navigator.clipboard.writeText(`${shareWindow.linkUrl}`);
        }
    };

    const editOkHandler = (id) => {
        const fetchFunc = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/user_files/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${userData ? userData.token : storageUserData.token}`,
                },
                body: JSON.stringify({
                    user: userData ? userData.user.id : storageUserData.user.id,
                    rename_id: id,
                    file_name: renameInput.renameInputRef.current.value,
                    file_comment: renameInput.commentInputRef.current.value,
                })
            })
            .then((response) => {
                if (response.status === 401) {
                    dispatch(logoutUser())
                    navigate('/');
                    return;   
                }
                return  response.json();
            })
            .then((data) => {
                const newFileData = {
                    ...data,
                    file_name: data.file_name,
                    file_comment: data.file_comment,
                };
                dispatch(renameUserFile(JSON.stringify(newFileData)));
                setRenameInput(prevState => ({
                    ...prevState,
                    inputActive: prevState.inputActive = false,
                }));
                renameInput.renameInputRef.current.value = ''
                renameInput.commentInputRef.current.value = ''
            });
        }
        fetchFunc();
    };

    const editCancelHandler = (id) => {
        setRenameInput(prevState => ({
            ...prevState,
            inputActive: prevState.inputActive = false,
        }));
        renameInput.renameInputRef.current.value = '';
        renameInput.commentInputRef.current.value = '';
    };

    const getDownloadTime = (date) => {
        const time = new Date(date);
        const plus = time.toString().match(/[+]/);
        const min = time.toString().match(/[-]/);
        const difHours = time.toString().match(/\GMT\S+/);
        if (plus[0] && difHours[0]) {
            const hours = time.getHours() + Number(difHours[0].replace(/\GMT/, '').replace(/\+/, '').replace(/0/g, ''));
            time.setHours(hours);
            if (new Date().getFullYear() - time.getFullYear() > 25) {
                return '';
            }
            return String(time);
        }
        else if (min[0] && difHours[0]) {
            const hours = time.getHours() - Number(difHours[0].replace(/\GMT/, '').replace(/\-/, '').replace(/0/g, ''));
            time.setHours(hours);
            if (new Date().getFullYear() - time.getFullYear() > 25) {
                return '';
            }
            return String(time);
        }
        if (new Date().getFullYear() - time.getFullYear() > 25) {
            return '';
        }
        return String(time);
    };
    

    useEffect(() => {
        const getFiles = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/files/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${userData ? userData.token : storageUserData.token}`,
                },
               
                body: JSON.stringify({user: userData ? userData.user.id : storageUserData.user.id})
            })
            .then((response) => {
                if (response.status === 401) {
                    dispatch(logoutUser())
                    navigate('/');
                    return;   
                }
                return  response.json();
            })
            .then((data) => {
                dispatch(replaceUserFiles(JSON.stringify(data)));
                setUserFilesState(prevState => ({
                    ...prevState,
                    files: prevState.files = data.sort((a, b) => new Date(a.file_created_time) - new Date(b.file_created_time)).reverse(),
                }));
            });
        }
        getFiles();
    // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (JSON.stringify(userFilesState.files) !== JSON.stringify(uFiles)) {
            uFiles.map((item) => {
                const fetchBlob = async () => {
                    await fetch(`${item.file_url}`, {
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
                        return  response.blob();
                    })
                    .then((data) => {
                        const resultBlob = {fileId: item.file_uid, fileBlob: URL.createObjectURL(new Blob([data], {type: item.file_type}))}
                        
                        setLoadBlob(prevState => ({
                            ...prevState,
                            blobFiles: [...prevState.blobFiles, resultBlob],
                        }))
                    })
                }
                return fetchBlob();
            });
            setUserFilesState(prevState => ({
                ...prevState,
                files: Array.from(uFiles).sort((a,b) =>  a.file_created_time - b.file_created_time).reverse(),
            })); 
        }
    // eslint-disable-next-line
    }, [uFiles]);


    return (
        <div className="cloud-body">
            <div className="cloud-body-wrap">
                <div className="cloud-body-controls-wrap">
                   <UploadFileFrom />
                </div>
                <div className="cloud-body-title-wrap">
                    <h1>Files</h1>
                </div>
                <div className="cloud-body-files-wrap">
                   
                    {userFilesState.files.sort((a, b) => new Date(a.file_created_time) - new Date(b.file_created_time)).reverse().map((item) => {
                        return (
                            <React.Fragment key={Math.random()}>
                                {shareWindow.windowActive && shareWindow.shareFile && shareWindow.shareFile.file_uid === item.file_uid ? 

                                    <ShareWindow
                                        key= {Math.random()}
                                        fileLink={item.file_url} 
                                        fileName = {item.file_name}
                                        closeHandler = {shareFileCloseHandler}
                                        linkHandler = {(e) => shareFileLinkHandler(e, item.file_url)}
                                        linkText = {shareWindow.linkText}
                                        cords = {shareWindow.cords}
                                    /> : 
                                null}
                                
                                <FileItem
                                    key= {item.file_uid}
                                    {...item}
                                    lastDownloadTime = {getDownloadTime(item.file_last_download_time)}
                                    lastUploadDate = {getDownloadTime(item.file_created_time)}
                                    removeHandler = {rmFileHandler} 
                                    renameHandler = {renameFileHandler} 
                                    shareHandler  = {(e) => shareFileHandler(e.clientX, e.clientY, item.file_uid)}
                                    downloadHandler = {downloadHandler}
                                    blobFiles = {loadBlobState.blobFiles}
                                    renameInput = {
                                        renameInput.inputActive && renameInput.editId === item.file_uid ?
                                            <EditFileControls 
                                                editHandlerRef = {renameInput.renameInputRef}
                                                editCommentRef = {renameInput.commentInputRef}
                                                editOkHandler = {editOkHandler} 
                                                editCancelHandler = {editCancelHandler}
                                                fileId = {item.file_uid}
                                            /> : null
                                    }
                                />
                            </React.Fragment>
                        );
                    })}
                    
                </div>
            </div>
            {userData && userData.is_admin ? <AdminPanel userData = {userData ? userData : storageUserData} /> : 
                storageUserData && storageUserData.is_admin ? <AdminPanel userData = {userData ? userData : storageUserData} /> : null}
        </div>
    );
};

export default  CloudBody;