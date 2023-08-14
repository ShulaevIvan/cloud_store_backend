import React from "react";
import { useState, useEffect } from "react";
import UserFilesAdminPopup from "../userFilesAdminPopup/UserFilesAdminPopup";
import RegisterForm from "../registerForm/RegisterForm";
import { useSelector} from "react-redux";

const AdminPanel = (props) => {
    let authUsers = useSelector((state) => state.user.authUsers);
    if (JSON.parse(localStorage.getItem('authUsers'))) authUsers = JSON.parse(localStorage.getItem('authUsers'));
    const initialState = { users: [], authUsers: authUsers};
    const storageUserData = JSON.parse(localStorage.getItem('userData'));
    const userData = props.userData;
    const [otherUsers, setOtherUsers] = useState(initialState);
    const [userFilesPanel, setUserFilesPanel] = useState({
        activePanel: false,
        targetUserId: undefined,
        targetUserFiles: [],
        activeRegister: false,
    });

    const removeUserHandler = (targetUserId) => {
        const fetchFunc = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/control/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${userData ? userData.token : storageUserData.token}`,
                },
                body: JSON.stringify({user: userData ? userData.user.id : storageUserData.user.id, target_user: targetUserId, action: 'DELETE'}),
            })
            .then(() => {
                setOtherUsers(prevState => ({
                    ...prevState,
                    users: prevState.users = prevState.users.filter((item) => item.id !== targetUserId),
                }));
            })
        }
        fetchFunc();
    };

    const addAdminHandler = (targetUserId) => {
        const fetchFunc = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/control/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${userData ? userData.token : storageUserData.token}`,
                },
                body: JSON.stringify({user: userData ? userData.user.id : storageUserData.user.id, target_user: targetUserId, action: 'TOADMIN'}),
            })
            .then(() => {
                setOtherUsers(prevState => ({
                    ...prevState,
                    users: prevState.users.map((item) => {
                        if(item.id === targetUserId) {
                            item.is_staff = true;
                            return item;
                        }
                        return item;
                    })
                }));
            });
        }
        fetchFunc();
    };

    const removeAdminHandler = (targetUserId) => {
        const fetchFunc = async () => {
            await fetch (`${process.env.REACT_APP_BACKEND_URL}/api/user/control/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${userData ? userData.token : storageUserData.token}`,
                },
                body: JSON.stringify({user: userData ? userData.user.id : storageUserData.user.id, target_user:  targetUserId, action: 'TOUSER'}),
            })
            .then(() => {
                setOtherUsers(prevState => ({
                    ...prevState,
                    users: prevState.users.map((item) => {
                        if(item.id === targetUserId) {
                            item.is_staff = false;
                            return item;
                        }
                        return item;
                    })
                }));
            })
        };
        fetchFunc();
    };

    const logoutAdminHandler = (targetUserId) => {
        const fetchFunc = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/logout/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${userData ? userData.token : storageUserData.token}`,
                },
               
                body: JSON.stringify({user: targetUserId})
            })
        };
        fetchFunc();
    };

    const userFilesAdminPopupHandler = (targetUserId) => {
        const fetchFunc = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/files/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${userData ? userData.token : storageUserData.token}`,
                },
                body: JSON.stringify({user: targetUserId})
            })
            .then((response) => response.json())
            .then((data) => {
                setUserFilesPanel(prevState => ({
                    ...prevState,
                    targetUserId: prevState.targetUserId = targetUserId,
                    targetUserFiles: prevState.targetUserFiles = data.sort((a, b) => new Date(a.file_created_time) - new Date(b.file_created_time)).reverse(),
                    activePanel: prevState.activePanel = true,
                }));
            });
        }
        fetchFunc();
    };

    const userFilesAdminPopupCloseHandler = () => {
        setUserFilesPanel(prevState => ({
            ...prevState,
            activePanel: prevState.activePanel = false
        }));
    };

    const registerUserHandler = () => {
        setUserFilesPanel(prevState => ({
            ...prevState,
            activeRegister: true,
        }));
    };

    useEffect(() => {
        const fetchFunc = async () => {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/usersdetail/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${userData ? userData.token : storageUserData.token}`,
                },
            })
            .then((response) => response.json())
            .then((data) => {
                setOtherUsers(prevState => ({
                    ...prevState,
                    users: [...data.users].filter((user) => user.id !== userData.user.id),
                }));
                localStorage.setItem('otherUsers', JSON.stringify(data.users))
            })
        }
        fetchFunc();
    // eslint-disable-next-line
    }, [userFilesPanel.activePanel, userFilesPanel.activeRegister]);

    useEffect(() => {
        localStorage.setItem('authUsers', JSON.stringify(authUsers));
    }, [authUsers])



    return (
        <React.Fragment>
            <div className="admin-panel-wrap">
                <div className="admin-panel-title">
                    <h2>Admin-Panel</h2>
                    <div className="register-user-wrap">
                        <button onClick={registerUserHandler}>Register User</button>
                        <div className="admin-register-form">
                            {userFilesPanel.activeRegister ? <RegisterForm adminRegister={true} setAdminPanelState = {setUserFilesPanel} /> : null}
                        </div>
                    </div>
                </div>
                <div className="admin-other-users-wrap">
                {userFilesPanel.activePanel ? 
                    <UserFilesAdminPopup
                        targetUser = {userFilesPanel.targetUserId} 
                        closePopupHandler = {userFilesAdminPopupCloseHandler} 
                        userFiles = {userFilesPanel.targetUserFiles} /> : null}
                {otherUsers.users.map((item) => {
                    const userAuth = authUsers.find((u) => u.userId === item.id && u.auth === true);

                    return (
                        <React.Fragment key={Math.random()}>
                            <div className="admin-other-users-item-wrap">
                                <div className="admin-other-users-item-controls-wrap">
                                    <div className="admin-other-users-item-controls-addadmin-btn-wrap">
                                        <span className={userAuth ? 'admin-users-logout-admin-btn' : 'admin-users-logout-admin-deactive-btn'}
                                            onClick={() => logoutAdminHandler(item.id)}
                                        ></span>
                                        <span 
                                            className={item.is_staff ? 'admin-users-deactive-admin-btn' : 'admin-users-active-admin-btn'}
                                            onClick={() => item.is_staff ? removeAdminHandler(item.id) : addAdminHandler(item.id)}
                                        ></span>
                                    </div>
                                    <div className="admin-other-users-item-controls-remove-btn-wrap">
                                        <span className="admin-users-remove-btn" onClick={() => removeUserHandler(item.id)}></span>
                                    </div>
                            </div>
                                <div className="admin-other-users-item-name">{item.username}</div>
                                <div className="admin-other-users-item-email">{item.email}</div>
                                <div className="admin-other-users-item-access-level">{item.is_staff ? 'role: admin': 'role: user'}</div>
                                <div className="admin-other-users-item-files-count">{item.files_count} files</div>
                                <div className="admin-other-users-item-memory-usage">Memory usage: {(Number(item.files_size) / 1024 / 1024).toFixed(2)}mb</div>
                                <div className="admin-other-users-item-control-wrap">
                                    <button onClick={() => userFilesAdminPopupHandler(item.id)}>Manage user files</button>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
                </div>
                
            </div>
        </React.Fragment>
    );
};

export default AdminPanel;