import React from "react";
import LoginForm from "../loginForm/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const HomePage = () => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const registerHandler = () => {
        navigate('/register');
    }
    useEffect(() => {
        if (user.userAuthenticated)  {
            navigate('/store');
        }
    });
    
    return (
        <React.Fragment>
            {!user.userAuthenticated && window.location.pathname === '/' ?  <div className="container">
                <div className="login-wrapper">
                    <div className="login-form">
                        <LoginForm></LoginForm>
                    </div>
                    <div className="register-wrap">
                        <div className="register-btn-wrap">
                            <button onClick={(registerHandler)} className="register-btn">Register</button>
                        </div>
                    </div>
                </div>
            </div> :  null}
           
        </React.Fragment>
    );
    
};

export default HomePage