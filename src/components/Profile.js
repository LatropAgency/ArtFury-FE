import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {APIService} from "../services/APIService";
import {MessageService} from "../services/MessageService";
import {useDispatch, useSelector} from "react-redux";
import {selectUser, setUser} from "../features/user/userSlice";
import {Alert, Button, InputLabel, Paper, TextField} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import * as React from "react";

export const Profile = () => {
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(true);
    const [successAlertMessage, setSuccessAlertMessage] = useState('')
    const [successPasswordChangeMessage, setSuccessPasswordChangeMessage] = useState('')
    const [errorAlertMessages, setErrorAlertMessages] = useState([]);
    const [errorMessages, setErrorMessages] = useState({password: [], old_password: [], password2: []});
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const dispatch = useDispatch();


    function handleOldPasswordChange(event) {
        setOldPassword(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    function handlePassword2Change(event) {
        setPassword2(event.target.value);
    }


    useEffect(() => {
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setLoading(false);
    }, [])


    function handleFirstNameChange(event) {
        setFirstName(event.target.value);
    }

    function handleLastNameChange(event) {
        setLastName(event.target.value);
    }

    function handleUpdateProfile(event) {
        APIService.updateProfile(firstName, lastName).then((updated_profile_response) => {
            setSuccessAlertMessage('Профиль успешно обновлен');
            dispatch(setUser(updated_profile_response.data));
            localStorage.setItem('user', JSON.stringify(updated_profile_response.data));
        })
    }

    const changePasswordHandler = async (oldPassword, password, password2) => {
        for (const [key, value] of Object.entries(errorMessages)) {
            errorMessages[key] = []
            setErrorMessages(JSON.parse(JSON.stringify(errorMessages)))
        }
        try {
            const response = await APIService.changeUserPassword(oldPassword, password, password2);
            if (response.status === 200) {
                setSuccessPasswordChangeMessage('Пароль успешно изменён')
                setPassword('');
                setPassword2('');
                setOldPassword('');
                navigate(`/Profile`);
            }
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
        <>
            {!loading && (
                <Paper className={'profile'}>
                    <h1 className={'title'}>Профиль</h1>
                    <Avatar sx={{
                        width: 200,
                        height: 200,
                        margin: 'auto',
                        fontSize: '80px'
                    }}>{user.first_name[0]}{user.last_name[0]}</Avatar>
                    <div className={'update_profile_form'}>
                        {successAlertMessage && (<Alert severity="success">{successAlertMessage}</Alert>)}
                        <InputLabel>Имя:</InputLabel>
                        <TextField defaultValue={firstName} inputProps = {{minLength : 1, maxLength: 150 }} onChange={handleFirstNameChange} fullWidth/>
                        <InputLabel>Фамилия:</InputLabel>
                        <TextField defaultValue={lastName} inputProps = {{minLength : 1, maxLength: 150 }} onChange={handleLastNameChange} fullWidth/>
                        <InputLabel>Email:</InputLabel>
                        <TextField defaultValue={user.email} fullWidth disabled={true}/>
                        <Button disabled={!Boolean(firstName && lastName)} onClick={handleUpdateProfile} style={{margin: "auto", display: "block", marginTop: '10px'}} variant={'contained'}>
                            Сохранить
                        </Button>
                    </div>
                    <div className={'change_password_form'}>
                        <h1 className={'title'}>Форма смены пароля</h1>
                        {successPasswordChangeMessage && (<Alert severity="success">{successPasswordChangeMessage}</Alert>)}
                        <InputLabel>Текущий Пароль:</InputLabel>
                        <TextField name='old_password' type='password' inputProps = {{minLength : 1, maxLength: 4096 }} required value={oldPassword}
                                   onChange={handleOldPasswordChange} fullWidth/>
                        {errorMessages.old_password.map((message, index) => {
                            return (<Alert severity="error" key={index}>{message}</Alert>)
                        })}
                        <InputLabel>Пароль:</InputLabel>
                        <TextField name='password' type='password' inputProps = {{minLength : 1, maxLength: 4096 }} required value={password}
                                   onChange={handlePasswordChange} fullWidth/>
                        {errorMessages.password.map((message, index) => {
                            return (<Alert severity="error" key={index}>{message}</Alert>)
                        })}
                        <InputLabel>Повторение пароля:</InputLabel>
                        <TextField name='password2' type='password' inputProps = {{minLength : 1, maxLength: 4096 }} required value={password2}
                                   onChange={handlePassword2Change} fullWidth/>
                        {errorMessages.password2.map((message, index) => {
                            return (<Alert severity="error" key={index}>{message}</Alert>)
                        })}
                        <Button disabled={!Boolean(password && password2 && oldPassword)} style={{margin: "auto", display: "block", marginTop: '10px'}} variant={'contained'} onClick={() => {
                            changePasswordHandler(oldPassword, password, password2);
                        }}>
                            Сменить
                        </Button>
                    </div>
                </Paper>
            )}
        </>
    )
}