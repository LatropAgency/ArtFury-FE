import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {APIService} from "../services/APIService";
import {MessageService} from "../services/MessageService";
import {Alert, Button, InputLabel, Paper, TextField} from "@mui/material";
import * as React from "react";

export function SignUp() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [errorAlertMessages, setErrorAlertMessages] = useState([]);
    const [errorMessages, setErrorMessages] = useState({password: [], email: [], password2: [], username: []});

    function handleFirstNameChange(event) {
        setFirstName(event.target.value);
    }

    function handleLastNameChange(event) {
        setLastName(event.target.value);
    }

    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    function handlePassword2Change(event) {
        setPassword2(event.target.value);
    }

    const signUpHandler = async (username, firstName, lastName, email, password, password2) => {
        for (const [key, value] of Object.entries(errorMessages)) {
            errorMessages[key] = []
            setErrorMessages(JSON.parse(JSON.stringify(errorMessages)))
        }
        try {
            const response = await APIService.signUp(username, firstName, lastName, email, password, password2);
            if (response.status === 201)
                navigate(`/SignIn`);
        } catch (e) {
            if (e.response.data.detail)
                setErrorAlertMessages([MessageService.getRUMessage(e.response.data.detail), ...errorAlertMessages]);
            if (Object.entries(e.response.data)) {
                for (const [key, value] of Object.entries(e.response.data)) {
                    value.map((message) => {
                        errorMessages[key] = [MessageService.getRUMessage(message), ...errorMessages[key]]
                    })
                    setErrorMessages(JSON.parse(JSON.stringify(errorMessages)))
                }
            }
        }
    }
    return (
        <Paper className={'signup_form'}>
            <h1 className={'title'}>Регистрация</h1>
            {errorAlertMessages.map((message, index) => {
                return (<Alert severity="error" key={index}>{message}</Alert>)
            }) }
            <InputLabel>Логин:</InputLabel>
            <TextField name='username'  inputProps = {{minLength : 1, maxLength: 150 }} fullWidth type='text' required value={username} onChange={handleUsernameChange}/>
            {errorMessages.username.map((message, index) => {
                return (<Alert severity="error" key={index}>{message}</Alert>)
            })}
            <InputLabel>Имя:</InputLabel>
            <TextField name='firstName' type='text'  inputProps = {{minLength : 1, maxLength: 150 }} fullWidth required value={firstName} onChange={handleFirstNameChange}/>
            <InputLabel>Фамилия:</InputLabel>
            <TextField name='lastName' type='text'  inputProps = {{minLength : 1, maxLength: 150 }} fullWidth required value={lastName} onChange={handleLastNameChange}/>
            <InputLabel>Email:</InputLabel>
            <TextField name='email' type='email'  inputProps = {{minLength : 1, maxLength: 254 }} fullWidth required value={email} onChange={handleEmailChange}/>
            {errorMessages.email.map((message, index) => {
                return (<Alert severity="error" key={index}>{message}</Alert>)
            })}
            <InputLabel>Пароль:</InputLabel>
            <TextField name='password' type='password'  inputProps = {{minLength : 1, maxLength: 4096 }} fullWidth required value={password} onChange={handlePasswordChange}/>
            {errorMessages.password.map((message, index) => {
                return (<Alert severity="error" key={index}>{message}</Alert>)
            })}
            <InputLabel>Повторение пароля:</InputLabel>
            <TextField name='password2' type='password'  inputProps = {{minLength : 1, maxLength: 4096 }} fullWidth required value={password2} onChange={handlePassword2Change}/>
            {errorMessages.password2.map((message, index) => {
                return (<Alert severity="error" key={index}>{message}</Alert>)
            })}
            <Button disabled={!Boolean(username && firstName && lastName && email && password)} style={{display:"block", margin: '10px auto'}} variant={"contained"} onClick={() => {signUpHandler(username, firstName, lastName, email, password, password2);}}>
                Зарегистрироваться
            </Button>
            <Link to='/SignIn'><Button style={{ display: 'block',margin: 'auto'}}>Вход</Button></Link>
        </Paper>
    )
}