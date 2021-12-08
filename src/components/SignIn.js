import {APIService} from "../services/APIService";
import {useState} from "react";
import {MessageService} from "../services/MessageService";
import {Link, useNavigate} from 'react-router-dom'
import {setUser} from "../features/user/userSlice";
import {setAccessToken} from "../features/accessToken/accessTokenSlice";
import {setRefreshToken} from "../features/refreshToken/refreshTokenSlice";
import {useDispatch} from "react-redux";
import {Alert, Button, InputLabel, Paper, TextField} from "@mui/material";
import * as React from "react";

export function SignIn() {
    const [errorAlertMessage, setErrorAlertMessage] = useState('')
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const signInHandler = async (username, password) => {
        try {
            const credentials = await APIService.signIn(username, password);
            if (credentials.status === 200) {
                localStorage.setItem('accessToken', credentials.data.access);
                localStorage.setItem('refreshToken', credentials.data.refresh);
                let currentUser = await APIService.getCurrentUser();
                localStorage.setItem('user', JSON.stringify(currentUser.data));
                dispatch(setUser(currentUser.data));
                dispatch(setAccessToken(credentials.data.access));
                dispatch(setRefreshToken(credentials.data.refresh));
                navigate(`/`);
            }
        } catch (e) {
            setErrorAlertMessage(MessageService.getRUMessage(e.response.data.detail));
        }
    }
    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    return (
        <Paper className={'signin_form'}>
            <h1 className={'title'}>Вход</h1>
            {errorAlertMessage && (<Alert severity="error">{errorAlertMessage}</Alert>)}
            <InputLabel>Логин:</InputLabel>
            <TextField fullWidth name='username' type='text'  inputProps = {{minLength : 1, maxLength: 150 }} required value={username} onChange={handleUsernameChange}/>
            <InputLabel>Пароль:</InputLabel>
            <TextField fullWidth name='password' type='password'  inputProps = {{minLength : 1, maxLength: 4096 }} required value={password} onChange={handlePasswordChange}/>
            <Button style={{display:"block", margin: '10px auto'}}  disabled={!Boolean(username && password.length)} variant={"contained"} onClick={() => {signInHandler(username, password);}}>Войти</Button>
            <Link to='/SignUp'><Button style={{ display: 'block',margin: 'auto'}}>Регистрация</Button></Link>
        </Paper>
    )
}