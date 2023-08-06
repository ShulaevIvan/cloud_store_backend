import React from "react";
import { useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import HeaderMenu from "../headerMenu/HeaderMenu";

const CloudHeader = () => {
    const user = useSelector((state) => state.user);
    const storageUserData = JSON.parse(localStorage.getItem('userData'));
    const location  = useLocation();
    if ((user.userAuthenticated || storageUserData.user.userAuthenticated) && location.pathname !== '/' && location.pathname !== '/register') {
        return (
            <div className="cloud-header">
                <div className="cloud-header-wrap">
                    <div className="cloud-header-search-wrap">
                        {/* <span className="search-header-icon"></span> */}
                        {/* <input type="text" placeholder="search" /> */}
                    </div>
                    <div className="cloud-header-user-info">
                        <div className="user-avatar-wrap">
                            <img src="#" />
                        </div>
                        <div className="user-info-wrap">
                            <span>{storageUserData ? storageUserData.user.username : user.userData.user.username}</span>
                        </div>
                        <HeaderMenu></HeaderMenu>
                    </div>
                </div>

            </div>
        );
    }
};

export default CloudHeader;