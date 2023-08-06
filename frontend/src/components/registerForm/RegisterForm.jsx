import React from "react";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { saveUserData } from "../../redux/slices/userSlice";
import { useNavigate } from 'react-router-dom';


const RegisterForm = (props) => {
    const storageData = JSON.parse(localStorage.getItem('registerInputsData'));
    const initialState = {
        data: undefined,
        errorMessage: false,
        allInputsValid: undefined,
        loginInput: {
            loginRef: useRef(null),
            error: false,
            errDescription: 'Ошибка: только латинские буквы и цифры, первый символ — буква, длина от 4 до 20 символов',
            validate: () => {
                let str = formState.loginInput.loginRef.current.value
                if (str.length >= 4 && str.length < 20 && str.split('')[0].match(/[A-Z]/) && str.match(/[a-zA-Z0-9_]/)) {
                    return false;
                }
                setFormState(prevState => ({
                    ...prevState,
                    allInputsValid: prevState.allInputsValid = false
                }));
                return true;
            },
        },
        fullNameInput: {
            fullNameRef: useRef(null),
            error: false,
            errDescription: 'Ошибка: не пустое поле',
            validate: () => {
                if (formState.fullNameInput.fullNameRef.current.value.trim() !== '') {
                    return false
                }
                return true;
            }
        },
        passwordInput: {
            passwordRef: useRef(null),
            error: false,
            errDescription: 'Ошибка: не менее 6 символов: как минимум одна заглавная буква, одна цифра и один специальный символ или пароли не совпадают',
            validate: () => {
                const pattern = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/;
                if (formState.passwordInput.passwordRef.current.value.match(pattern)) {
                    return false;
                }
                return true;
            },
        },
        confirmPasswordInput: {
            confirmPasswordRef: useRef(null),
            error: false,
            errDescription: 'Ошибка: не менее 6 символов: как минимум одна заглавная буква, одна цифра и один специальный символ или пароли не совпадают',
            validate: () => {
                const pattern = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/;
                if (formState.confirmPasswordInput.confirmPasswordRef.current.value.match(pattern)) {
                    return false;
                }
                return true;
            }
        },
        emailInput: {
            emailRef: useRef(null),
            error: false,
            errDescription: 'Ошибка: должен соответствовать формату адресов электронной почты',
            validate: () => {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (formState.emailInput.emailRef.current.value.match(pattern)) {
                    return false;
                }
                return true;
            },
        },
        register: {
            registerRef: useRef(null),
            error: false,
        },
    };
    const [formState, setFormState] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const registerHandler = () => {

        setFormState(prevState => ({
            ...prevState,
            errorMessage: prevState.errorMessage = false,
            loginInput: prevState.loginInput = {
                ...prevState.loginInput,
                error: prevState.error = prevState.loginInput.validate()
            },
            fullNameInput: prevState.fullNameInput = {
                ...prevState.fullNameInput,
                error: prevState.error = prevState.fullNameInput.validate()
            },
            passwordInput: prevState.passwordInput = {
                ...prevState.passwordInput,
                error: prevState.error = prevState.passwordInput.validate()
            },
            confirmPasswordInput: prevState.confirmPasswordInput = {
                ...prevState.confirmPasswordInput,
                error: prevState.error = prevState.confirmPasswordInput.validate()
            },
            emailInput: prevState.emailInput = {
                ...prevState.emailInput,
                error: prevState.error = prevState.emailInput.validate()
            },
        }));

        setTimeout(() => {
            if (!formState.loginInput.error && 
                !formState.fullNameInput.error && 
                    !formState.passwordInput.error && 
                        !formState.confirmPasswordInput.error && 
                            !formState.emailInput.error) {
                                setFormState(prevState => ({
                                    ...prevState,
                                    allInputsValid: prevState.allInputsValid = true,
                                    errorMessage: prevState.errorMessage = false,
                                }));
                                localStorage.removeItem('registerInputsData');
                                return;
            }

            const validDataToLocalStorage = {
                login: !formState.loginInput.error ? formState.loginInput.loginRef.current.value: '',
                password: '',
                emailInput: !formState.passwordInput.error ? formState.emailInput.emailRef.current.value : '',
                fullName: !formState.fullNameInput.error ? formState.fullNameInput.fullNameRef.current.value : '',
            };

            localStorage.setItem('registerInputsData', JSON.stringify(validDataToLocalStorage));
            setFormState(prevState => ({
                ...prevState,
                allInputsValid: prevState.allInputsValid = false,
                errorMessage: prevState.errorMessage = true,
            }));

            return;
        }, 100);
    };

    const cancelRegisterHandler = () => {
        formState.loginInput.loginRef.current.value = '';
        formState.fullNameInput.fullNameRef.current.value = '';
        formState.passwordInput.passwordRef.current.value = '';
        formState.confirmPasswordInput.confirmPasswordRef.current.value = '';
        formState.emailInput.emailRef.current.value = '';

        if (props.adminRegister) {
            props.setAdminPanelState(prevState => ({
                ...prevState,
                activeRegister: prevState.activeRegister = false,
            }));
            return;
        }

        navigate('/');
    };

    useEffect(()=> {
        if (formState.allInputsValid) {
            const data = {
                username: formState.loginInput.loginRef.current.value,
                full_name: formState.fullNameInput.fullNameRef.current.value,
                password: formState.passwordInput.passwordRef.current.value,
                email: formState.emailInput.emailRef.current.value
            };

            const fetchFunc = async () => {
                await fetch(`${process.env.REACT_APP_BACKEND_URL}/singup/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then((response) => response.json())
                .then((data) => {
                    const checkUser = Object.keys(data).find(key => key === 'user');

                    if (!checkUser) {
                        setFormState(prevState => ({
                            ...prevState,
                            allInputsValid: prevState.allInputsValid = false,
                            errorMessage: prevState.errorMessage = data
                        }))
                    }
                    if (data.user && !props.adminRegister) {
                        dispatch(saveUserData(data));
                        navigate('/');
                        return;
                    }
                    if (data.user && props.adminRegister) {
                        props.setAdminPanelState(prevState => ({
                            ...prevState,
                            activeRegister: prevState.activeRegister = false,
                        }));
                    }
                    
                });
            }
            fetchFunc();
        }
    // eslint-disable-next-line
    }, [formState.allInputsValid]);

    useEffect(() => {
        if (storageData) {
            formState.loginInput.loginRef.current.value = storageData.login;
            formState.fullNameInput.fullNameRef.current.value = storageData.fullName;
            formState.emailInput.emailRef.current.value = storageData.emailInput;
        }
    }, []);



    return (
        <React.Fragment>
            <div className="register-form-wrap">
                <form className="register-from">
                    <div className="register-input-wrap">
                        <label htmlFor="id">Login</label>
                            {formState.loginInput.error ? <span className="error-placeholder">{formState.loginInput.errDescription}</span> : null}
                           
                            <input 
                                ref={formState.loginInput.loginRef} 
                                id="login" type='text' 
                                className={formState.loginInput.error ? 'register-form-input-err' : 'register-form-input'} 
                            />
                    </div>
                    <div className="register-input-wrap">
                        <label htmlFor="fullname">FullName</label>
                            {formState.fullNameInput.error ? <span className="error-placeholder">{formState.fullNameInput.errDescription}</span> : null}
                            <input 
                                ref={formState.fullNameInput.fullNameRef} 
                                id="fullname" 
                                type='text'
                                className={formState.fullNameInput.error ? 'register-form-input-err' : 'register-form-input'}  
                            />
                    </div>
                    <div className="register-input-wrap">
                        <label htmlFor="password">Password</label>
                        {formState.passwordInput.error ? <span className="error-placeholder">{formState.passwordInput.errDescription}</span> : null}
                            <input 
                                ref={formState.passwordInput.passwordRef} 
                                id="password" 
                                type='password'
                                className={formState.passwordInput.error ? 'register-form-input-err' : 'register-form-input'}  
                            />
                    </div>
                    <div className="register-input-wrap">
                        <label htmlFor="confirm-password">Confirm password</label>
                        {formState.passwordInput.error ? <span className="error-placeholder">{formState.passwordInput.errDescription}</span> : null}
                            <input 
                                ref={formState.confirmPasswordInput.confirmPasswordRef} 
                                id="confirm-password" 
                                type='password'
                                className={formState.confirmPasswordInput.error ? 'register-form-input-err' : 'register-form-input'} 
                            />
                    </div>
                    <div className="register-input-wrap">
                        <label id="email">Email</label>
                        {formState.emailInput.error ? <span className="error-placeholder">{formState.emailInput.errDescription}</span> : null}
                            <input 
                                ref={formState.emailInput.emailRef} 
                                htmlFor="email" 
                                type='text'
                                className={formState.emailInput.error ? 'register-form-input-err' : 'register-form-input'}  
                            />
                    </div>
                    
                </form>
                <div className="register-btn-wrap">
                    <button onClick={registerHandler}>Register</button>
                    <button onClick={cancelRegisterHandler}>Cancel</button>
                </div>
               
            </div>
            <div className="form-register-status">{
                formState.errorMessage ? 
                    `${formState.errorMessage.username ? formState.errorMessage.username : ''} 
                        ${formState.errorMessage.email ? formState.errorMessage.email : ''}` : null}
            </div>
            
        </React.Fragment>
    );
};

export default RegisterForm;