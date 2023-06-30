import React from "react";
import { useState, useRef, useEffect } from "react";


const RegisterForm = () => {
    const initialState = {
        data: undefined,
        allInputsValid: undefined,

        loginInput: {
            loginRef: useRef(null),
            error: false,
            validate: () => {
                let str = formState.loginInput.loginRef.current.value
                if (str.length >= 4 && str.length < 20 && str.split('')[0].match(/[A-Z]/) && str.match(/[a-zA-Z0-9_]/)) {
                    return false;
                }
                return true;
            },
        },
        fullNameInput: {
            fullNameRef: useRef(null),
            error: false,
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
            validate: () => {
                const pattern = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/;
                if (formState.passwordInput.passwordRef.current.value.match(pattern)) {
                    return false
                }
                return true
            },
        },
        confirmPasswordInput: {
            confirmPasswordRef: useRef(null),
            error: false,
            validate: () => {
                const pattern = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/;
                if (formState.confirmPasswordInput.confirmPasswordRef.current.value.match(pattern)) {
                    return false
                }
                return true
            }
        },
        emailInput: {
            emailRef: useRef(null),
            error: false,
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
    
    const registerHandler = () => {

        setFormState(prevState => ({
            ...prevState,
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
        }))
        if (!formState.loginInput.error && 
                !formState.fullNameInput.error && 
                    !formState.passwordInput.error && 
                        !formState.confirmPasswordInput.error && 
                            !formState.emailInput.error) {
                                setFormState(prevState => ({
                                    ...prevState,
                                    allInputsValid: prevState.allInputsValid = true
                                }));
            return;
        }
        setFormState(prevState => ({
            ...prevState,
            allInputsValid: prevState.allInputsValid = false
        }));
        
    }

    useEffect(()=> {
        if (formState.allInputsValid) {
            const data = {
                username: formState.loginInput.loginRef.current.value,
                full_name: formState.fullNameInput.fullNameRef.current.value,
                password: formState.passwordInput.passwordRef.current.value,
                email: formState.emailInput.emailRef.current.value
            }
            console.log(data)
            const fetchFunc = async () => {
                await fetch('http://localhost:8000/singup/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
            }
            fetchFunc()
        }
    }, [formState.allInputsValid])

    return (
        <React.Fragment>
            <div className="register-form-wrap">
                <form className="register-from">
                    <label htmlFor="id">Login</label>
                        <input 
                            ref={formState.loginInput.loginRef} 
                            id="login" type='text' 
                            className={formState.loginInput.error ? 'register-form-input-err' : 'register-form-input'} 
                        />
                    <label htmlFor="fullname">FullName</label>
                        <input 
                            ref={formState.fullNameInput.fullNameRef} 
                            id="fullname" 
                            type='text'
                            className={formState.fullNameInput.error ? 'register-form-input-err' : 'register-form-input'}  
                        />
                    <label htmlFor="password">Password</label>
                        <input 
                            ref={formState.passwordInput.passwordRef} 
                            id="password" 
                            type='password'
                            className={formState.passwordInput.error ? 'register-form-input-err' : 'register-form-input'}  
                        />
                    <label htmlFor="confirm-password">Confirm password</label>
                        <input 
                            ref={formState.confirmPasswordInput.confirmPasswordRef} 
                            id="confirm-password" 
                            type='password'
                            className={formState.confirmPasswordInput.error ? 'register-form-input-err' : 'register-form-input'} 
                        />

                    <label id="email">Email</label>
                        <input 
                            ref={formState.emailInput.emailRef} 
                            htmlFor="email" 
                            type='text'
                            className={formState.emailInput.error ? 'register-form-input-err' : 'register-form-input'}  
                        />
                </form>
                <div className="register-btn-wrap">
                    <button onClick={registerHandler}>Регистрация</button>
                    {/* <button onClick={registerHandler} disabled = {formState.allInputsValud ? false : true}>Регистрация</button> */}
                </div>
            </div>
            
        </React.Fragment>
    );
};

export default RegisterForm;