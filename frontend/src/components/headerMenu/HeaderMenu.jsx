import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { logoutUser} from "../../redux/slices/userSlice";
import { useLocation } from "react-router-dom";


const HeaderMenu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.user.userData);
    const user = useSelector((state) => state.user);
    const storageUserData = JSON.parse(localStorage.getItem('userData'));
    const location  = useLocation();
    const initialState = {
        menuActive: false,
    };
    
    const [menuState, setMenuState] = useState(initialState);

    const menuHandler = () => {
        if (!menuState.menuActive) {
            setMenuState(prevState => ({
                ...prevState,
                menuActive: prevState.menuActive = true,
            }));
            return;
        }
        setMenuState(prevState => ({
            ...prevState,
            menuActive:  prevState.menuActive = false,
        }));
    };

    const logoutHandler = () => {
        const fetchFunc = async () => {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/logout/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${userData ? userData.token : storageUserData.token}`,
                },
               
                body: JSON.stringify({user: userData ? userData.user.id : storageUserData.user.id}),
            })
            .then((response) => response.json())
            .then((data) => {
                const storageUserData = JSON.parse(localStorage.getItem('userData'))
                if (storageUserData) {
                    storageUserData.auth = false;
                    storageUserData.user.userAuthenticated = false;
                }

                localStorage.setItem('userData', JSON.stringify(storageUserData));
                setMenuState(prevState => ({
                    ...prevState,
                    menuActive: false,
                }));
                dispatch(logoutUser());
                setTimeout(() => {
                    navigate('/');
                }, 10);
            });
        };
        fetchFunc();
    };

    const myFilesHandler = () => {
        navigate('/store');
    };

    

    return (
        <React.Fragment>
            {(user.userAuthenticated || storageUserData.user.userAuthenticated) && (location.pathname !== '/' || location.pathname !== '/register') ?
                <div className='cloud-header-menu'>
                    <span className="user-menu-btn" onClick={menuHandler}></span>
                    <ul className={
                        menuState.menuActive ? 'user-menu-header user-menu-active' : 'user-menu-header user-menu-hidden'
                        }
                    >
                        <li><Link onClick={myFilesHandler}>MyFiels</Link></li>
                        <li><Link onClick={logoutHandler}>Logout</Link></li>
                    </ul>
                </div>
            : null}
        </React.Fragment>
    );
};

export default HeaderMenu;