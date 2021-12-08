import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {removeUser, selectUser} from "../features/user/userSlice";
import {selectMode, setMode} from "../features/mode/modeSlice";
import EmailIcon from '@mui/icons-material/Email';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import {AppBar, Container, Select, Toolbar} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import {removeAccessToken} from "../features/accessToken/accessTokenSlice";
import {removeRefreshToken} from "../features/refreshToken/refreshTokenSlice";

export const Header = () => {
    const user = useSelector(selectUser);
    const mode = useSelector(selectMode);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    function handleSwitchMode(event) {
        dispatch(setMode(event.target.value));
        navigate('/');
    }


    const logoutHandler = async () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        dispatch(removeUser());
        dispatch(removeAccessToken());
        dispatch(removeRefreshToken());
        navigate('/SignIn');
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Container>
                <Toolbar className={'header_top_line'}>
                    <Typography variant={"h5"}>
                        <Link
                            style={{
                                color: 'white'
                            }} to='/'>ArtFury</Link>
                    </Typography>
                        {user && (
                            <nav>
                                <Select style={{background: "white"}} value={mode} onChange={handleSwitchMode}>
                                    <MenuItem value={'handler'}>Исполнитель</MenuItem>
                                    <MenuItem value={'customer'}>Заказчик</MenuItem>
                                </Select>
                                <Box sx={{display: 'flex', alignItems: 'center', textAlign: 'center'}}>
                                    <Tooltip title="Account settings">
                                        <IconButton onClick={handleClick} size="small" sx={{ml: 2}}>
                                            <Avatar sx={{
                                                width: 32,
                                                height: 32
                                            }}>{user.first_name[0]}{user.last_name[0]}</Avatar>
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    onClick={handleClose}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                            mt: 1.5,
                                            '& .MuiAvatar-root': {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                            '&:before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            },
                                        },
                                    }}
                                    transformOrigin={{horizontal: 'right', vertical: 'top'}}
                                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                                >
                                    <Link
                                        style={{
                                            color: 'black'
                                        }} to='/Profile'><MenuItem key={2} onClick={handleClose}>
                                        <AccountBoxIcon/>{user.first_name} {user.last_name}
                                    </MenuItem>
                                    </Link>
                                    <Link
                                        style={{
                                            color: 'black'
                                        }} to='/ChatList'><MenuItem key={1} onClick={handleClose}>
                                        <EmailIcon/>Чаты
                                    </MenuItem>
                                    </Link>
                                    <MenuItem
                                        style={{
                                            color: 'black',
                                            display: 'block'
                                        }} key={3} onClick={handleClose}>
                                        <div className={'logout_btn'}onClick={logoutHandler}>
                                            <LogoutIcon style={{position: 'absolute'}}/><span  style={{marginLeft: '25px'}} >Выйти</span>
                                        </div>
                                    </MenuItem>
                                </Menu>
                            </nav>
                        )}
                </Toolbar>
            </Container>
        </AppBar>
    )
}