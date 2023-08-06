import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { authenticateUser, logoutUser, saveUserData } from "../../redux/slices/userSlice";

const LoginForm = () => {

    const initialState = {
        loginStatus: true,
        loginInputRef: useRef(null),
        loginBtnRef: useRef(null),
        passwordInputRef: useRef(null),
        userData: {},
        storageUserData: JSON.parse(localStorage.getItem('userData')),
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginFromState, setLoginFormState] = useState(initialState);

    const loginHandler = (e) => {
        e.preventDefault();
        if (loginFromState.loginInputRef.current.value.trim() !== '' && loginFromState.passwordInputRef.current.value !== '') {
            const authData = {
                username: loginFromState.loginInputRef.current.value,
                password: loginFromState.passwordInputRef.current.value,
            };
            const fetchFunc = async () => {
                await fetch(`${process.env.REACT_APP_BACKEND_URL}/login/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(authData)
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data.token) {
                        dispatch(authenticateUser());
                        dispatch(saveUserData(data));
                        setLoginFormState(prevState => ({
                            ...prevState,
                            loginStatus: prevState.loginStatus = true,
                            userData: prevState.userData = data
                        }));
                        const toStorageData = {
                            ...data,
                            auth: true,
                            user: {
                                ...data.user,
                                userAuthenticated: true,
                                authPassword: authData.password,
                            },
                        };
                        localStorage.setItem('userData', JSON.stringify(toStorageData));
                        navigate('/store');
                        return;
                    }
                    dispatch(logoutUser());
                    setLoginFormState(prevState => ({
                        ...prevState,
                        loginStatus: prevState.loginStatus = false
                    }));
                })
            }
            fetchFunc();
        }
    };

    useEffect(() => {
        if (loginFromState.storageUserData && loginFromState.storageUserData.auth) {
            loginFromState.loginInputRef.current.value = loginFromState.storageUserData.user.username;
            loginFromState.passwordInputRef.current.value = loginFromState.storageUserData.user.authPassword;
            return;
        }
        else if (loginFromState.storageUserData) loginFromState.loginInputRef.current.value = loginFromState.storageUserData.user.username;
    }, [])


    return (
        <React.Fragment>
            <div className='login-form-wrap'>
                <div className={loginFromState.loginStatus ? 'login-err-hidden' : 'login-err-show'}>
                    <p>неправильный логин или пароль</p>
                </div>
                <form className='login-form'>
                    <div className='login-input-wrap'>
                        <label>Login</label>
                            <input ref={loginFromState.loginInputRef}  type='text' />
                    </div>
                    <div className='password-input-wrap'>
                        <label>Password</label>
                            <input ref={loginFromState.passwordInputRef} type='password' />
                    </div>
                    <div className='enter-btn-wrap'>
                        <button onClick={loginHandler} ref={loginFromState.loginBtnRef}>Enter</button>
                    </div>
                </form>
            </div>
        </React.Fragment>
    );
};

export default LoginForm